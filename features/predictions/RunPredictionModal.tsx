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
import { useToast } from "@/components/ui/Toast";
import { useDatasets } from "@/features/datasets/useDatasets";
import {
	useAggregateRows,
	useRunPrediction,
	useSaveMapping,
	useSuggestAllMappings,
} from "@/features/predictions/useMapping";
import type {
	MappingSuggestion,
	ModelKind,
	PredictionResult,
} from "@/types";

type Step = "choose" | "map" | "fill" | "result";

type ModelMetaEntry = { title: string; desc: string; dataShape: string };

const MODEL_META: Record<ModelKind, ModelMetaEntry> = {
	revenue: {
		title: "Revenue Forecast",
		desc: "Predict order-level revenue from price, quantity, discount, and seasonality.",
		dataShape: "order-level data",
	},
	churn: {
		title: "Churn Risk",
		desc: "Estimate customer-level churn probability.",
		dataShape: "aggregated customer data (tenure, total orders, avg order value)",
	},
	growth: {
		title: "Growth Projection",
		desc: "3-month forward revenue forecast.",
		dataShape: "monthly time-series (monthly revenue, month-over-month growth)",
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
	const [featureValues, setFeatureValues] = useState<Record<string, string>>(
		{},
	);
	const [selectedRowLabel, setSelectedRowLabel] = useState<string | null>(null);
	const [predictionResult, setPredictionResult] =
		useState<PredictionResult | null>(null);

	const { data: datasetsData } = useDatasets();
	const datasets = datasetsData?.data ?? [];

	const suggestions = useSuggestAllMappings(uploadId);
	const saveMapping = useSaveMapping();
	const runPrediction = useRunPrediction();

	const aggregateRows = useAggregateRows(
		step === "fill" ? uploadId : null,
		modelKind,
	);

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
			setFeatureValues({});
			setSelectedRowLabel(null);
			setPredictionResult(null);
		}
	}, [isOpen]);

	const userColumnsNeeded = useMemo(() => {
		const cols = new Set<string>();
		for (const v of Object.values(mapping)) {
			if (!v) continue;
			const colName = v.startsWith("_from_date:")
				? v.replace("_from_date:", "")
				: v;
			cols.add(colName);
		}
		return Array.from(cols);
	}, [mapping]);

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

	const handleSaveMapping = async () => {
		if (uploadId === null || !modelKind) return;
		try {
			await saveMapping.mutateAsync({
				upload_id: uploadId,
				model_kind: modelKind,
				mapping,
			});
			setStep("fill");
		} catch (err) {
			toast({
				title: "Failed to save mapping",
				message: err instanceof Error ? err.message : String(err),
				type: "error",
			});
		}
	};

	const handleRunPrediction = async () => {
		if (uploadId === null || !modelKind) return;
		try {
			let userFeatures: Record<string, unknown>;

			if (modelKind === "revenue") {
				userFeatures = {};
				for (const [k, v] of Object.entries(featureValues)) {
					if (v === "") continue;
					const num = Number(v);
					userFeatures[k] =
						Number.isFinite(num) && v.trim() !== "" ? num : v;
				}
			} else {
				const row = aggregateRows.data?.rows.find(
					(r) => r.label === selectedRowLabel,
				);
				if (!row) {
					toast({
						title: "Pick a row",
						message:
							modelKind === "churn"
								? "Please pick a customer."
								: "Please pick a month.",
						type: "error",
					});
					return;
				}
				userFeatures = { ...row.features };
			}

			const result = await runPrediction.mutateAsync({
				upload_id: uploadId,
				model_kind: modelKind,
				user_features: userFeatures,
			});
			setPredictionResult(result);
			setStep("result");
		} catch (err) {
			toast({
				title: "Prediction failed",
				message: err instanceof Error ? err.message : String(err),
				type: "error",
			});
		}
	};

	const stepNumber =
		step === "choose" ? 1 : step === "map" ? 2 : step === "fill" ? 3 : 4;

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-md animate-fade-in">
			<div className="bg-background/95 backdrop-blur-xl border border-border/50 rounded-2xl shadow-2xl w-full max-w-2xl flex flex-col animate-slide-up max-h-[90vh]">
				<div className="flex items-center justify-between p-4 border-b border-border/50 bg-muted/20">
					<div className="flex items-center gap-2 font-semibold">
						<Sparkles className="w-5 h-5 text-primary-500" />
						Run Prediction
						<span className="text-xs text-muted-foreground font-normal ml-2">
							Step {stepNumber} of 4
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

					{step === "map" && chosenSuggestion && (
						<>
							{chosenSuggestion.missing.length > 0 && (
								<div className="flex items-start gap-2 p-3 rounded-lg bg-warning/10 border border-warning/30">
									<AlertTriangle className="w-4 h-4 text-warning shrink-0 mt-0.5" />
									<div className="text-xs">
										<div className="font-medium text-warning mb-1">
											{chosenSuggestion.missing.length} feature(s) couldn't be
											auto-mapped
										</div>
										<div className="text-muted-foreground">
											Missing: {chosenSuggestion.missing.join(", ")}. You can
											map them manually or leave them — the prediction will run
											with defaults.
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

					{step === "fill" && modelKind === "revenue" && (
						<>
							<div className="text-sm text-muted-foreground">
								Enter a row of values. The model will predict based on these.
							</div>
							<div className="grid grid-cols-2 gap-3">
								{userColumnsNeeded.map((col) => (
									<div key={col}>
										<label className="block text-xs font-medium mb-1">
											{col}
										</label>
										<input
											type="text"
											value={featureValues[col] ?? ""}
											onChange={(e) =>
												setFeatureValues({
													...featureValues,
													[col]: e.target.value,
												})
											}
											placeholder="e.g. 42"
											className="w-full bg-background border border-border rounded-md px-2 py-1.5 text-sm"
										/>
									</div>
								))}
							</div>
							{userColumnsNeeded.length === 0 && (
								<div className="text-sm text-danger">
									No columns mapped. Go back and map at least one feature.
								</div>
							)}
						</>
					)}

					{step === "fill" && modelKind !== "revenue" && modelKind !== null && (
						<>
							<div className="text-sm text-muted-foreground">
								{modelKind === "churn"
									? "Pick a customer to assess their churn risk."
									: "Pick a month to forecast its 3-month growth."}
							</div>

							{aggregateRows.isLoading && (
								<div className="min-h-[140px] flex items-center justify-center">
									<Loader2 className="w-5 h-5 animate-spin" />
								</div>
							)}

							{aggregateRows.isError && (
								<div className="text-sm text-danger">
									Could not load{" "}
									{modelKind === "churn" ? "customers" : "months"}.
								</div>
							)}

							{aggregateRows.data && aggregateRows.data.rows.length === 0 && (
								<div className="text-sm text-warning">
									No {modelKind === "churn" ? "customers" : "months"} found in
									the aggregate table.
								</div>
							)}

							{aggregateRows.data && aggregateRows.data.rows.length > 0 && (
								<>
									<div>
										<label className="block text-xs font-medium mb-1">
											{modelKind === "churn" ? "Customer" : "Month"}
										</label>
										<select
											value={selectedRowLabel ?? ""}
											onChange={(e) =>
												setSelectedRowLabel(e.target.value || null)
											}
											className="w-full bg-background border border-border rounded-md px-3 py-2 text-sm"
										>
											<option value="">
												— Choose{" "}
												{modelKind === "churn"
													? "a customer"
													: "a month"}{" "}
												—
											</option>
											{aggregateRows.data.rows.map((r) => (
												<option key={r.label} value={r.label}>
													{r.label}
												</option>
											))}
										</select>
										<p className="text-xs text-muted-foreground mt-1">
											{aggregateRows.data.rows.length}{" "}
											{modelKind === "churn" ? "customers" : "months"}{" "}
											available
										</p>
									</div>

									{selectedRowLabel && (
										<details className="text-xs">
											<summary className="cursor-pointer text-muted-foreground hover:text-foreground">
												Preview values for this{" "}
												{modelKind === "churn" ? "customer" : "month"}
											</summary>
											<div className="mt-2 p-3 bg-muted/30 rounded-md grid grid-cols-2 gap-x-4 gap-y-1">
												{Object.entries(
													aggregateRows.data.rows.find(
														(r) => r.label === selectedRowLabel,
													)?.features ?? {},
												).map(([k, v]) => (
													<div key={k} className="flex justify-between">
														<span className="text-muted-foreground">
															{k}:
														</span>
														<span className="font-mono">
															{v === null
																? "—"
																: typeof v === "number"
																	? v.toLocaleString(undefined, {
																			maximumFractionDigits: 2,
																		})
																	: String(v)}
														</span>
													</div>
												))}
											</div>
										</details>
									)}
								</>
							)}
						</>
					)}

					{step === "result" && predictionResult && (
						<div className="space-y-4">
							<div className="flex items-center gap-2 p-3 rounded-lg bg-success/10 border border-success/30">
								<CheckCircle2 className="w-5 h-5 text-success" />
								<span className="text-sm font-medium">Prediction complete</span>
							</div>
							<div className="glass-card p-5 rounded-xl text-center">
								<div className="text-xs text-muted-foreground uppercase tracking-wider mb-2">
									{predictionResult.model_kind} result
								</div>
								<ResultDisplay result={predictionResult} />
							</div>
							<details className="text-xs">
								<summary className="cursor-pointer text-muted-foreground hover:text-foreground">
									Show raw response
								</summary>
								<pre className="mt-2 p-2 bg-muted/30 rounded-md overflow-auto max-h-48">
									{JSON.stringify(predictionResult, null, 2)}
								</pre>
							</details>
						</div>
					)}
				</div>

				<div className="flex items-center justify-between p-4 border-t border-border/50 bg-muted/20">
					<button
						type="button"
						onClick={() => {
							if (step === "map") setStep("choose");
							else if (step === "fill") setStep("map");
							else if (step === "result") setStep("fill");
						}}
						disabled={step === "choose" || step === "result"}
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
								onClick={handleSaveMapping}
								disabled={saveMapping.isPending}
								className="px-4 py-1.5 text-sm font-semibold bg-primary text-primary-foreground rounded-lg disabled:opacity-50 flex items-center gap-2"
							>
								{saveMapping.isPending && (
									<Loader2 className="w-3 h-3 animate-spin" />
								)}
								Save Mapping & Continue
							</button>
						)}
						{step === "fill" && (
							<button
								type="button"
								onClick={handleRunPrediction}
								disabled={
									runPrediction.isPending ||
									(modelKind === "revenue" &&
										userColumnsNeeded.length === 0) ||
									(modelKind !== "revenue" && !selectedRowLabel)
								}
								className="px-4 py-1.5 text-sm font-semibold bg-primary text-primary-foreground rounded-lg disabled:opacity-50 flex items-center gap-2"
							>
								{runPrediction.isPending ? (
									<Loader2 className="w-3 h-3 animate-spin" />
								) : (
									<Play className="w-3 h-3" />
								)}
								Run Prediction
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

function ResultDisplay({ result }: { result: PredictionResult }) {
	const r = result.result;
	if (result.model_kind === "revenue") {
		return (
			<div className="text-3xl font-bold">
				${(r.prediction ?? 0).toLocaleString()}{" "}
				<span className="text-sm text-muted-foreground">
					{r.unit ?? "USD"}
				</span>
			</div>
		);
	}
	if (result.model_kind === "churn") {
		const riskColor =
			r.risk_level === "high"
				? "text-danger"
				: r.risk_level === "medium"
					? "text-warning"
					: "text-success";
		return (
			<div>
				<div className={`text-3xl font-bold ${riskColor} capitalize`}>
					{r.risk_level ?? "—"} risk
				</div>
				<div className="text-sm text-muted-foreground mt-1">
					{((r.churn_probability ?? 0) * 100).toFixed(1)}% churn probability
				</div>
			</div>
		);
	}
	if (result.model_kind === "growth") {
		return (
			<div>
				<div className="text-3xl font-bold">
					${(r.forecast_3m ?? 0).toLocaleString()}
				</div>
				<div className="text-sm text-muted-foreground mt-1">
					3-month forward revenue forecast
				</div>
			</div>
		);
	}
	return <div className="text-sm">{JSON.stringify(r)}</div>;
}