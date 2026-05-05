"use client";

import {
	AlertTriangle,
	CheckCircle2,
	ChevronLeft,
	Loader2,
	Play,
	Sparkles,
	X,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import {
	Bar,
	BarChart,
	CartesianGrid,
	Legend,
	Line,
	LineChart,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from "recharts";
import { useToast } from "@/components/ui/Toast";
import { useDatasets } from "@/features/datasets/useDatasets";
import {
	type BatchChurnSummary,
	type BatchGrowthSummary,
	type BatchRevenueSummary,
	type BatchResult,
	useBatchChurn,
	useBatchGrowth,
	useBatchRevenue,
	useSaveMapping,
	useSuggestAllMappings,
} from "@/features/predictions/useMapping";
import type { MappingSuggestion, ModelKind } from "@/types";

type Step = "choose" | "map" | "result";

type ModelMetaEntry = { title: string; desc: string; dataShape: string };

const MODEL_META: Record<ModelKind, ModelMetaEntry> = {
	revenue: {
		title: "Revenue Forecast",
		desc: "Predict revenue for every order in your dataset and the next 12 months.",
		dataShape: "order-level data",
	},
	churn: {
		title: "Churn Risk",
		desc: "Rank every customer by likelihood to churn.",
		dataShape: "aggregated customer data",
	},
	growth: {
		title: "Growth Projection",
		desc: "Monthly revenue trend and 12-month forward forecast.",
		dataShape: "monthly time-series",
	},
};

function fitScore(s: MappingSuggestion | undefined): number {
	if (!s || !s.mapping) return 0;
	const totalFeatures = Object.keys(s.mapping).length;
	if (totalFeatures === 0) return 0;
	const mapped = totalFeatures - (s.missing?.length ?? 0);
	const ratio = mapped / totalFeatures;
	const confidences = Object.values(s.confidence ?? {}).filter((c) => c > 0);
	const avgConf = confidences.length
		? confidences.reduce((a, b) => a + b, 0) / confidences.length
		: 0;
	return ratio * 0.7 + avgConf * 0.3;
}

function fitLabel(score: number): {
	label: string;
	tone: "good" | "okay" | "poor";
} {
	if (score >= 0.7) return { label: "Recommended", tone: "good" };
	if (score >= 0.35) return { label: "Partial fit", tone: "okay" };
	return { label: "Not recommended", tone: "poor" };
}

type AnyBatchResult =
	| BatchResult<BatchRevenueSummary>
	| BatchResult<BatchChurnSummary>
	| BatchResult<BatchGrowthSummary>;

export function RunPredictionModal({
	isOpen,
	onClose,
}: {
	isOpen: boolean;
	onClose: () => void;
}) {
	const { toast } = useToast();
	const [step, setStep] = useState<Step>("choose");
	const [uploadId, setUploadId] = useState<number | null>(null);
	const [modelKind, setModelKind] = useState<ModelKind | null>(null);
	const [mapping, setMapping] = useState<Record<string, string | null>>({});
	const [batchResult, setBatchResult] = useState<AnyBatchResult | null>(null);

	const { data: datasetsData } = useDatasets();
	const datasets = datasetsData?.data ?? [];

	const suggestions = useSuggestAllMappings(uploadId);
	const saveMapping = useSaveMapping();
	const batchRevenue = useBatchRevenue();
	const batchChurn = useBatchChurn();
	const batchGrowth = useBatchGrowth();

	const isRunning =
		batchRevenue.isPending ||
		batchChurn.isPending ||
		batchGrowth.isPending ||
		saveMapping.isPending;

	const rankedSuggestions = useMemo(() => {
		if (!suggestions.data) return null;
		return suggestions.data
			.filter((s): s is MappingSuggestion => !!s && !!s.mapping)
			.map((s) => ({ suggestion: s, score: fitScore(s) }))
			.sort((a, b) => b.score - a.score);
	}, [suggestions.data]);

	const chosenSuggestion = useMemo(() => {
		if (!suggestions.data || !modelKind) return null;
		return suggestions.data.find((s) => s.model_kind === modelKind) ?? null;
	}, [suggestions.data, modelKind]);

	useEffect(() => {
		if (step === "map" && chosenSuggestion) {
			setMapping(chosenSuggestion.mapping);
		}
	}, [step, chosenSuggestion]);

	useEffect(() => {
		if (!isOpen) {
			setStep("choose");
			setUploadId(null);
			setModelKind(null);
			setMapping({});
			setBatchResult(null);
		}
	}, [isOpen]);

	const availableColumns = useMemo(() => {
		if (!chosenSuggestion) return [];
		const unmapped = chosenSuggestion.unmapped ?? [];
		const mapped = Object.values(mapping).filter(
			(v): v is string => v !== null && !v.startsWith("_from_date:"),
		);
		const dateSources = Object.values(mapping)
			.filter((v): v is string => v !== null && v.startsWith("_from_date:"))
			.map((v) => v.replace("_from_date:", ""));
		return Array.from(new Set([...unmapped, ...mapped, ...dateSources]));
	}, [mapping, chosenSuggestion]);

	if (!isOpen) return null;

	const handlePickModel = (kind: ModelKind) => {
		setModelKind(kind);
		setStep("map");
	};

	const handleRunBatch = async () => {
		if (uploadId === null || !modelKind) return;
		try {
			// Save the mapping first so the batch endpoint has it
			await saveMapping.mutateAsync({
				upload_id: uploadId,
				model_kind: modelKind,
				mapping,
			});

			let result: AnyBatchResult;
			if (modelKind === "revenue") {
				result = await batchRevenue.mutateAsync(uploadId);
			} else if (modelKind === "churn") {
				result = await batchChurn.mutateAsync(uploadId);
			} else {
				result = await batchGrowth.mutateAsync(uploadId);
			}
			setBatchResult(result);
			setStep("result");
		} catch (err) {
			toast({
				title: "Batch prediction failed",
				message: err instanceof Error ? err.message : String(err),
				type: "error",
			});
		}
	};

	const stepNumber = step === "choose" ? 1 : step === "map" ? 2 : 3;

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-md animate-fade-in">
			<div className="bg-background/95 backdrop-blur-xl border border-border/50 rounded-2xl shadow-2xl w-full max-w-3xl flex flex-col animate-slide-up max-h-[90vh]">
				<div className="flex items-center justify-between p-4 border-b border-border/50 bg-muted/20">
					<div className="flex items-center gap-2 font-semibold">
						<Sparkles className="w-5 h-5 text-primary-500" />
						Run Prediction
						<span className="text-xs text-muted-foreground font-normal ml-2">
							Step {stepNumber} of 3
						</span>
					</div>
					<button
						type="button"
						onClick={onClose}
						className="p-1 hover:bg-muted rounded-md"
					>
						<X className="w-5 h-5" />
					</button>
				</div>

				<div className="flex-1 overflow-y-auto p-6 space-y-5">
					{step === "choose" && (
						<>
							<div>
								<label className="block text-sm font-medium mb-2">
									Dataset
								</label>
								<select
									value={uploadId ?? ""}
									onChange={(e) =>
										setUploadId(
											e.target.value ? Number(e.target.value) : null,
										)
									}
									className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm"
								>
									<option value="">— Choose a dataset —</option>
									{datasets.map((d) => (
										<option key={d.id} value={d.id}>
											{d.name} ({d.rowCount} rows)
										</option>
									))}
								</select>
								{datasets.length === 0 && (
									<p className="text-xs text-muted-foreground mt-2">
										No datasets yet. Upload one first.
									</p>
								)}
							</div>

							{uploadId !== null && (
								<div>
									<div className="flex items-center gap-2 mb-3">
										<span className="text-sm font-medium">
											Recommended predictions
										</span>
										<span className="text-xs text-muted-foreground">
											Based on your data's shape
										</span>
									</div>

									{suggestions.isLoading && (
										<div className="min-h-[160px] flex items-center justify-center text-sm text-muted-foreground">
											<Loader2 className="w-5 h-5 animate-spin mr-2" />
											Analysing your dataset…
										</div>
									)}

									{suggestions.isError && (
										<div className="text-sm text-danger">
											Could not analyse dataset. Please try another one.
										</div>
									)}

									{rankedSuggestions && (
										<div className="space-y-2">
											{rankedSuggestions.map(({ suggestion, score }, idx) => {
												const meta = MODEL_META[suggestion.model_kind];
												const { label, tone } = fitLabel(score);
												const totalFeatures = Object.keys(
													suggestion.mapping,
												).length;
												const mappedCount =
													totalFeatures - suggestion.missing.length;
												const toneColor =
													tone === "good"
														? "text-success border-success/40 bg-success/5"
														: tone === "okay"
															? "text-warning border-warning/40 bg-warning/5"
															: "text-muted-foreground border-border bg-muted/20";
												const badgeColor =
													tone === "good"
														? "bg-success/20 text-success"
														: tone === "okay"
															? "bg-warning/20 text-warning"
															: "bg-muted text-muted-foreground";
												return (
													<button
														key={suggestion.model_kind}
														type="button"
														onClick={() =>
															handlePickModel(suggestion.model_kind)
														}
														className={`w-full text-left border rounded-lg p-4 transition-colors hover:border-primary/60 ${toneColor}`}
													>
														<div className="flex items-start justify-between gap-3">
															<div className="flex-1 min-w-0">
																<div className="flex items-center gap-2">
																	{idx === 0 && tone === "good" && (
																		<CheckCircle2 className="w-4 h-4 text-success shrink-0" />
																	)}
																	<div className="font-medium text-sm text-foreground">
																		{meta.title}
																	</div>
																</div>
																<div className="text-xs text-muted-foreground mt-1">
																	{meta.desc}
																</div>
																<div className="text-xs mt-2">
																	<span className="font-medium">
																		{mappedCount} of {totalFeatures}
																	</span>{" "}
																	<span className="text-muted-foreground">
																		features mapped
																	</span>
																	{suggestion.missing.length > 0 && (
																		<span className="text-muted-foreground">
																			{" "}
																			· needs {meta.dataShape}
																		</span>
																	)}
																</div>
															</div>
															<span
																className={`text-xs px-2 py-0.5 rounded-full whitespace-nowrap ${badgeColor}`}
															>
																{label}
															</span>
														</div>
													</button>
												);
											})}
										</div>
									)}
								</div>
							)}
						</>
					)}

					{step === "map" && chosenSuggestion && modelKind && (
						<>
							<div className="text-sm text-muted-foreground">
								Review the column mapping. The model will run on{" "}
								<span className="font-medium text-foreground">
									every row in your dataset
								</span>{" "}
								using this mapping.
							</div>

							{chosenSuggestion.missing.length > 0 && (
								<div className="flex items-start gap-2 p-3 rounded-lg bg-warning/10 border border-warning/30">
									<AlertTriangle className="w-4 h-4 text-warning shrink-0 mt-0.5" />
									<div className="text-xs">
										<div className="font-medium text-warning mb-1">
											{chosenSuggestion.missing.length} feature(s) couldn't be
											auto-mapped
										</div>
										<div className="text-muted-foreground">
											Missing: {chosenSuggestion.missing.join(", ")}. The
											prediction will run with defaults for these.
										</div>
									</div>
								</div>
							)}
							<div className="space-y-2">
								{Object.keys(chosenSuggestion.mapping).map((feature) => {
									const current = mapping[feature];
									const conf = chosenSuggestion.confidence[feature] ?? 0;
									const confColor =
										conf >= 0.75
											? "bg-success/20 text-success"
											: conf >= 0.4
												? "bg-warning/20 text-warning"
												: "bg-danger/20 text-danger";
									const isDerived = current?.startsWith("_from_date:");
									return (
										<div
											key={feature}
											className="flex items-center gap-3 p-2 border border-border rounded-lg"
										>
											<div className="flex-1 min-w-0">
												<div className="text-sm font-medium truncate">
													{feature}
												</div>
												{isDerived && (
													<div className="text-xs text-muted-foreground">
														derived from date
													</div>
												)}
											</div>
											<span
												className={`text-xs px-2 py-0.5 rounded-full ${confColor}`}
											>
												{(conf * 100).toFixed(0)}%
											</span>
											<select
												value={current ?? ""}
												onChange={(e) =>
													setMapping({
														...mapping,
														[feature]: e.target.value || null,
													})
												}
												className="bg-background border border-border rounded-md px-2 py-1 text-xs min-w-[140px]"
											>
												<option value="">— unmapped —</option>
												{isDerived && (
													<option value={current ?? ""}>{current}</option>
												)}
												{availableColumns.map((c) => (
													<option key={c} value={c}>
														{c}
													</option>
												))}
											</select>
										</div>
									);
								})}
							</div>
						</>
					)}

					{step === "result" && batchResult && modelKind && (
						<BatchResultView result={batchResult} kind={modelKind} />
					)}
				</div>

				<div className="flex items-center justify-between p-4 border-t border-border/50 bg-muted/20">
					<button
						type="button"
						onClick={() => {
							if (step === "map") setStep("choose");
							else if (step === "result") setStep("map");
						}}
						disabled={step === "choose" || step === "result" || isRunning}
						className="flex items-center gap-1 px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground disabled:opacity-40"
					>
						<ChevronLeft className="w-4 h-4" />
						Back
					</button>
					<div className="flex items-center gap-2">
						<button
							type="button"
							onClick={onClose}
							className="px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground"
						>
							Cancel
						</button>
						{step === "map" && (
							<button
								type="button"
								onClick={handleRunBatch}
								disabled={isRunning}
								className="px-4 py-1.5 text-sm font-semibold bg-primary text-primary-foreground rounded-lg disabled:opacity-50 flex items-center gap-2"
							>
								{isRunning ? (
									<Loader2 className="w-3 h-3 animate-spin" />
								) : (
									<Play className="w-3 h-3" />
								)}
								Run on entire dataset
							</button>
						)}
						{step === "result" && (
							<button
								type="button"
								onClick={onClose}
								className="px-4 py-1.5 text-sm font-semibold bg-primary text-primary-foreground rounded-lg"
							>
								Done
							</button>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}

// ══════════════════════════════════════════════════════
//  Result views
// ══════════════════════════════════════════════════════

function BatchResultView({
	result,
	kind,
}: {
	result: AnyBatchResult;
	kind: ModelKind;
}) {
	return (
		<div className="space-y-4">
			<div className="flex items-center gap-2 p-3 rounded-lg bg-success/10 border border-success/30">
				<CheckCircle2 className="w-5 h-5 text-success" />
				<span className="text-sm font-medium">Batch prediction complete</span>
			</div>

			{kind === "revenue" && (
				<RevenueResultView
					summary={result.summary as BatchRevenueSummary}
				/>
			)}
			{kind === "churn" && (
				<ChurnResultView summary={result.summary as BatchChurnSummary} />
			)}
			{kind === "growth" && (
				<GrowthResultView summary={result.summary as BatchGrowthSummary} />
			)}

			<details className="text-xs">
				<summary className="cursor-pointer text-muted-foreground hover:text-foreground">
					Show raw response
				</summary>
				<pre className="mt-2 p-2 bg-muted/30 rounded-md overflow-auto max-h-48">
					{JSON.stringify(result, null, 2)}
				</pre>
			</details>
		</div>
	);
}

function RevenueResultView({ summary }: { summary: BatchRevenueSummary }) {
	// Combine historical + forecast for one continuous chart
	const historical = summary.monthly_actual.map((m) => ({
		month: m.month,
		historical: m.predicted_revenue,
		forecast: null as number | null,
	}));

	const forecastPoints = (summary.forward_forecast || []).map((f) => {
		// forward_forecast items can be either numbers (old) or {month, predicted_revenue}
		if (typeof f === "number") {
			return {
				month: "?",
				historical: null as number | null,
				forecast: f,
			};
		}
		return {
			month: f.month,
			historical: null as number | null,
			forecast: f.predicted_revenue,
		};
	});

	// Bridge point: duplicate the last historical point into the forecast line
	// so the two lines visually connect on the chart
	if (historical.length > 0 && forecastPoints.length > 0) {
		const last = historical[historical.length - 1];
		forecastPoints.unshift({
			month: last.month,
			historical: null,
			forecast: last.historical,
		});
	}

	const chartData = [...historical, ...forecastPoints];

	return (
		<div className="space-y-4">
			<div className="grid grid-cols-3 gap-3">
				<Stat label="Rows predicted" value={summary.n_rows.toLocaleString()} />
				<Stat
					label="Total predicted"
					value={`$${summary.total_predicted.toLocaleString()}`}
				/>
				<Stat
					label="Avg per row"
					value={`$${summary.avg_row_predicted.toLocaleString()}`}
				/>
			</div>

			{summary.errors > 0 && (
				<div className="text-xs text-warning">
					{summary.errors} row(s) failed prediction and were counted as $0.
				</div>
			)}

			{summary.forecast_note && (
				<div className="text-xs text-muted-foreground p-2 bg-muted/30 rounded-md">
					{summary.forecast_note}
				</div>
			)}

			{chartData.length > 0 && (
				<div className="glass-card p-4 rounded-xl">
					<div className="text-xs font-medium text-muted-foreground mb-2">
						Monthly revenue — historical + 12-month forecast
					</div>
					<div className="h-64 w-full">
						<ResponsiveContainer width="100%" height="100%">
							<LineChart data={chartData}>
								<CartesianGrid
									strokeDasharray="3 3"
									className="opacity-20"
								/>
								<XAxis dataKey="month" tick={{ fontSize: 10 }} />
								<YAxis tick={{ fontSize: 10 }} />
								<Tooltip />
								<Legend wrapperStyle={{ fontSize: 11 }} />
								<Line
									type="monotone"
									dataKey="historical"
									stroke="#3b82f6"
									strokeWidth={2}
									dot={{ r: 2 }}
									name="Historical (predicted)"
									connectNulls
								/>
								<Line
									type="monotone"
									dataKey="forecast"
									stroke="#10b981"
									strokeWidth={2}
									strokeDasharray="5 5"
									dot={{ r: 2 }}
									name="Forecast (Prophet)"
									connectNulls
								/>
							</LineChart>
						</ResponsiveContainer>
					</div>
				</div>
			)}
		</div>
	);
}
function ChurnResultView({ summary }: { summary: BatchChurnSummary }) {
	const distData = [
		{ name: "High", value: summary.risk_counts.high, fill: "#ef4444" },
		{ name: "Medium", value: summary.risk_counts.medium, fill: "#f59e0b" },
		{ name: "Low", value: summary.risk_counts.low, fill: "#10b981" },
	];

	return (
		<div className="space-y-4">
			<div className="grid grid-cols-4 gap-3">
				<Stat
					label="Customers"
					value={summary.n_customers.toLocaleString()}
				/>
				<Stat
					label="High risk"
					value={summary.risk_counts.high.toLocaleString()}
					tone="danger"
				/>
				<Stat
					label="Medium risk"
					value={summary.risk_counts.medium.toLocaleString()}
					tone="warning"
				/>
				<Stat
					label="Low risk"
					value={summary.risk_counts.low.toLocaleString()}
					tone="success"
				/>
			</div>

			<div className="glass-card p-4 rounded-xl">
				<div className="text-xs font-medium text-muted-foreground mb-2">
					Risk distribution
				</div>
				<div className="h-40 w-full">
					<ResponsiveContainer width="100%" height="100%">
						<BarChart data={distData}>
							<CartesianGrid strokeDasharray="3 3" className="opacity-20" />
							<XAxis dataKey="name" tick={{ fontSize: 11 }} />
							<YAxis tick={{ fontSize: 10 }} />
							<Tooltip />
							<Bar dataKey="value" />
						</BarChart>
					</ResponsiveContainer>
				</div>
			</div>

			<div className="glass-card p-4 rounded-xl">
				<div className="text-xs font-medium text-muted-foreground mb-2">
					Top 20 at-risk customers
				</div>
				<div className="overflow-x-auto">
					<table className="w-full text-xs">
						<thead>
							<tr className="border-b border-border">
								<th className="text-left px-2 py-1.5 font-semibold text-muted-foreground">
									Rank
								</th>
								<th className="text-left px-2 py-1.5 font-semibold text-muted-foreground">
									Customer ID
								</th>
								<th className="text-right px-2 py-1.5 font-semibold text-muted-foreground">
									Probability
								</th>
								<th className="text-right px-2 py-1.5 font-semibold text-muted-foreground">
									Risk
								</th>
							</tr>
						</thead>
						<tbody>
							{summary.rows.slice(0, 20).map((r, i) => {
								const riskColor =
									r.risk_level === "high"
										? "text-danger"
										: r.risk_level === "medium"
											? "text-warning"
											: "text-success";
								return (
									<tr
										key={r.customer_id}
										className="border-b border-border last:border-0"
									>
										<td className="px-2 py-1.5 font-mono">{i + 1}</td>
										<td className="px-2 py-1.5 font-mono">
											{r.customer_id}
										</td>
										<td className="px-2 py-1.5 text-right font-mono">
											{(r.churn_probability * 100).toFixed(1)}%
										</td>
										<td
											className={`px-2 py-1.5 text-right font-medium capitalize ${riskColor}`}
										>
											{r.risk_level}
										</td>
									</tr>
								);
							})}
						</tbody>
					</table>
				</div>
			</div>
		</div>
	);
}

function GrowthResultView({ summary }: { summary: BatchGrowthSummary }) {
	type MergedRow = { month: string; actual?: number; forecast?: number };
	const merged = new Map<string, MergedRow>();
	for (const a of summary.actual) {
		merged.set(a.month, { month: a.month, actual: a.actual_revenue });
	}
	for (const f of summary.forecast) {
		const existing = merged.get(f.month);
		if (existing) {
			existing.forecast = f.predicted_revenue;
		} else {
			merged.set(f.month, {
				month: f.month,
				forecast: f.predicted_revenue,
			});
		}
	}
	const chartData = Array.from(merged.values()).sort((a, b) =>
		a.month.localeCompare(b.month),
	);

	return (
		<div className="space-y-4">
			<div className="grid grid-cols-2 gap-3">
				<Stat
					label="Months of history"
					value={summary.n_months_actual.toLocaleString()}
				/>
				<Stat
					label="Forecast horizon"
					value={`${summary.n_months_forecast} months`}
				/>
			</div>

			{chartData.length > 0 && (
				<div className="glass-card p-4 rounded-xl">
					<div className="text-xs font-medium text-muted-foreground mb-2">
						Actual vs forecast
					</div>
					<div className="h-64 w-full">
						<ResponsiveContainer width="100%" height="100%">
							<LineChart data={chartData}>
								<CartesianGrid
									strokeDasharray="3 3"
									className="opacity-20"
								/>
								<XAxis dataKey="month" tick={{ fontSize: 10 }} />
								<YAxis tick={{ fontSize: 10 }} />
								<Tooltip />
								<Legend wrapperStyle={{ fontSize: 11 }} />
								<Line
									type="monotone"
									dataKey="actual"
									stroke="#3b82f6"
									strokeWidth={2}
									dot={{ r: 2 }}
									name="Actual"
									connectNulls
								/>
								<Line
									type="monotone"
									dataKey="forecast"
									stroke="#10b981"
									strokeWidth={2}
									strokeDasharray="5 5"
									dot={{ r: 2 }}
									name="Forecast"
									connectNulls
								/>
							</LineChart>
						</ResponsiveContainer>
					</div>
				</div>
			)}
		</div>
	);
}

function Stat({
	label,
	value,
	tone,
}: {
	label: string;
	value: string;
	tone?: "success" | "warning" | "danger";
}) {
	const color =
		tone === "danger"
			? "text-danger"
			: tone === "warning"
				? "text-warning"
				: tone === "success"
					? "text-success"
					: "text-foreground";
	return (
		<div className="glass-card p-3 rounded-xl text-center">
			<div className="text-xs text-muted-foreground uppercase tracking-wider">
				{label}
			</div>
			<div className={`text-xl font-bold mt-1 ${color}`}>{value}</div>
		</div>
	);
}