"use client";

import { Loader2, Play, TrendingUp } from "lucide-react";
import { useState } from "react";
import { type Column, DataTable } from "@/components/data-display/DataTable";
import { PageHeader } from "@/components/layout/PageHeader";
import { RunPredictionModal } from "@/features/predictions/RunPredictionModal";
import { usePredictions } from "@/features/predictions/usePredictions";
import type { PastPrediction } from "@/types";

const TYPE_LABEL: Record<PastPrediction["type"], string> = {
	revenue_forecast: "Revenue",
	churn: "Churn",
	growth_scoring: "Growth",
};

const columns: Column<PastPrediction>[] = [
	{
		key: "type",
		header: "Type",
		render: (row) => (
			<span className="capitalize">{TYPE_LABEL[row.type] ?? row.type}</span>
		),
	},
	{
		key: "summary",
		header: "Result",
		render: (row) => <span>{row.result.summary}</span>,
	},
	{
		key: "status",
		header: "Status",
		render: (row) => <span className="capitalize">{row.status}</span>,
	},
	{
		key: "createdAt",
		header: "Created",
		render: (row) =>
			row.createdAt ? new Date(row.createdAt).toLocaleString() : "—",
	},
];

export function PredictionsPageClient() {
	const { data, isLoading, isError } = usePredictions();
	const [isModalOpen, setIsModalOpen] = useState(false);
	const predictions = data?.data ?? [];

	return (
		<div className="animate-fade-in space-y-6">
			<PageHeader
				title="Predictions"
				description="Run ML predictions against your datasets."
				actions={
					<button
						type="button"
						onClick={() => setIsModalOpen(true)}
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
						onClick={() => setIsModalOpen(true)}
						className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium"
					>
						Run Prediction
					</button>
				</div>
			) : (
				<DataTable
					columns={columns}
					data={predictions}
					keyExtractor={(row) => row.id}
				/>
			)}
			<RunPredictionModal
				isOpen={isModalOpen}
				onClose={() => setIsModalOpen(false)}
			/>
		</div>
	);
}