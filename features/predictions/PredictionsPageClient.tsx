"use client";

import { Loader2, Play, TrendingUp } from "lucide-react";
import { useState } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { PredictionDetailModal } from "@/features/predictions/PredictionDetailModal";
import { RunPredictionModal } from "@/features/predictions/RunPredictionModal";
import { usePredictions } from "@/features/predictions/usePredictions";
import type { PastPrediction } from "@/types";

const TYPE_LABEL: Record<string, string> = {
	revenue_forecast: "Revenue",
	revenue_batch: "Revenue (batch)",
	churn: "Churn",
	churn_batch: "Churn (batch)",
	growth_scoring: "Growth",
	growth_batch: "Growth (batch)",
};

function summarise(row: PastPrediction): string {
	const d = row.result?.data as Record<string, unknown> | undefined;
	if (!d) return row.result?.summary ?? "—";

	if (typeof d.total_predicted === "number") {
		const total = (d.total_predicted as number).toLocaleString();
		const n = (d.n_rows as number) ?? 0;
		return `$${total} across ${n.toLocaleString()} rows`;
	}
	if (d.risk_counts) {
		const rc = d.risk_counts as { high: number; medium: number; low: number };
		const n = (d.n_customers as number) ?? 0;
		return `${n} customers · ${rc.high} high-risk, ${rc.medium} med, ${rc.low} low`;
	}
	if (typeof d.n_months_forecast === "number") {
		return `${d.n_months_actual ?? 0} months history · ${d.n_months_forecast ?? 0} month forecast`;
	}
	if (typeof d.prediction === "number") {
		return `$${(d.prediction as number).toLocaleString()}`;
	}
	if (typeof d.churn_probability === "number") {
		const p = ((d.churn_probability as number) * 100).toFixed(1);
		return `${p}% churn · ${d.risk_level ?? ""} risk`;
	}
	if (typeof d.forecast_3m === "number") {
		return `3-month forecast $${(d.forecast_3m as number).toLocaleString()}`;
	}
	return row.result?.summary ?? "Prediction completed.";
}

export function PredictionsPageClient() {
	const { data, isLoading, isError } = usePredictions();
	const [isRunOpen, setIsRunOpen] = useState(false);
	const [detailId, setDetailId] = useState<string | null>(null);
	const predictions = data?.data ?? [];

	return (
		<div className="animate-fade-in space-y-6">
			<PageHeader
				title="Predictions"
				description="Run ML predictions against your datasets."
				actions={
					<button
						type="button"
						onClick={() => setIsRunOpen(true)}
						className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-semibold hover:bg-primary/90"
					>
						<Play className="w-4 h-4" />
						Run Prediction
					</button>
				}
			/>
			{isLoading ? (
				<div className="min-h-[240px] flex items-center justify-center">
					<Loader2 className="w-6 h-6 animate-spin" />
				</div>
			) : isError ? (
				<div className="text-sm text-danger">Failed to load predictions.</div>
			) : predictions.length === 0 ? (
				<div className="min-h-[320px] border-2 border-dashed border-border rounded-2xl flex flex-col items-center justify-center text-center p-8 bg-muted/20">
					<div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
						<TrendingUp className="w-8 h-8 text-muted-foreground" />
					</div>
					<h3 className="text-lg font-semibold mb-2">No predictions yet</h3>
					<p className="text-sm text-muted-foreground max-w-sm mb-4">
						Pick a dataset and run your first prediction.
					</p>
					<button
						type="button"
						onClick={() => setIsRunOpen(true)}
						className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium"
					>
						Run Prediction
					</button>
				</div>
			) : (
				<div className="overflow-x-auto rounded-xl border border-border">
					<table className="w-full text-sm">
						<thead>
							<tr className="border-b border-border bg-muted/50">
								<th className="text-left px-4 py-3 font-semibold text-muted-foreground whitespace-nowrap">
									Type
								</th>
								<th className="text-left px-4 py-3 font-semibold text-muted-foreground">
									Result
								</th>
								<th className="text-left px-4 py-3 font-semibold text-muted-foreground whitespace-nowrap">
									Status
								</th>
								<th className="text-left px-4 py-3 font-semibold text-muted-foreground whitespace-nowrap">
									Created
								</th>
							</tr>
						</thead>
						<tbody>
							{predictions.map((row) => (
								<tr
									key={row.id}
									onClick={() => setDetailId(row.id)}
									className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors cursor-pointer"
								>
									<td className="px-4 py-3 capitalize">
										{TYPE_LABEL[row.type] ?? row.type}
									</td>
									<td className="px-4 py-3">{summarise(row)}</td>
									<td className="px-4 py-3 capitalize">{row.status}</td>
									<td className="px-4 py-3 whitespace-nowrap">
										{row.createdAt
											? new Date(row.createdAt).toLocaleString()
											: "—"}
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			)}
			<RunPredictionModal
				isOpen={isRunOpen}
				onClose={() => setIsRunOpen(false)}
			/>
			<PredictionDetailModal
				predictionId={detailId}
				onClose={() => setDetailId(null)}
			/>
		</div>
	);
}