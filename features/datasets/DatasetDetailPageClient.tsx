"use client";

import { AlertCircle, ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { useDataset } from "@/features/datasets/useDatasets";
import {
	type DatasetView,
	useDatasetPreview,
} from "@/features/datasets/useDatasetPreview";

const VIEWS: Array<{
	id: DatasetView;
	label: string;
	subtitle: string;
}> = [
	{
		id: "cleaned",
		label: "Cleaned data",
		subtitle: "Original rows after preprocessing",
	},
	{
		id: "customer",
		label: "Customer aggregate",
		subtitle: "One row per customer (for churn)",
	},
	{
		id: "monthly",
		label: "Monthly aggregate",
		subtitle: "One row per month (for growth)",
	},
];

export function DatasetDetailPageClient({ id }: { id: string }) {
	const { data, isLoading, isError } = useDataset(id);
	const dataset = data?.data;
	const [view, setView] = useState<DatasetView>("cleaned");
	const preview = useDatasetPreview(id, view);

	return (
		<div className="animate-fade-in space-y-6">
			<Link
				href="/datasets"
				className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-primary transition-colors group"
			>
				<ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
				Back to Datasets
			</Link>

			{isLoading ? (
				<div className="min-h-[240px] flex items-center justify-center">
					<Loader2 className="w-6 h-6 animate-spin" />
				</div>
			) : isError || !dataset ? (
				<div className="text-sm text-danger">Dataset not found.</div>
			) : (
				<>
					<PageHeader
						title={dataset.name}
						description={`Source file: ${dataset.fileName}`}
					/>

					{/* Summary tiles */}
					<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
						<StatTile label="Rows" value={dataset.rowCount.toLocaleString()} />
						<StatTile
							label="Columns"
							value={dataset.columnCount.toLocaleString()}
						/>
						<StatTile
							label="Status"
							value={String(dataset.status ?? "—")}
							capitalize
						/>
					</div>

					{/* View tabs */}
					<div className="border-b border-border">
						<div className="flex gap-1 -mb-px overflow-x-auto">
							{VIEWS.map((v) => {
								const isActive = view === v.id;
								return (
									<button
										key={v.id}
										type="button"
										onClick={() => setView(v.id)}
										className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
											isActive
												? "border-primary text-primary"
												: "border-transparent text-muted-foreground hover:text-foreground"
										}`}
									>
										<div>{v.label}</div>
										<div className="text-xs font-normal text-muted-foreground mt-0.5">
											{v.subtitle}
										</div>
									</button>
								);
							})}
						</div>
					</div>

					{/* Preview content */}
					<PreviewArea preview={preview} view={view} />
				</>
			)}
		</div>
	);
}

function StatTile({
	label,
	value,
	capitalize,
}: {
	label: string;
	value: string;
	capitalize?: boolean;
}) {
	return (
		<div className="glass-card h-28 rounded-xl flex flex-col items-center justify-center">
			<span className="text-xs text-muted-foreground uppercase tracking-wider">
				{label}
			</span>
			<span
				className={`text-2xl font-bold mt-1 ${capitalize ? "capitalize" : ""}`}
			>
				{value}
			</span>
		</div>
	);
}

function PreviewArea({
	preview,
	view,
}: {
	preview: ReturnType<typeof useDatasetPreview>;
	view: DatasetView;
}) {
	if (preview.isLoading) {
		return (
			<div className="min-h-[320px] flex items-center justify-center">
				<Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
			</div>
		);
	}

	if (preview.isError) {
		return (
			<div className="min-h-[240px] flex flex-col items-center justify-center gap-2 text-sm text-danger">
				<AlertCircle className="w-6 h-6" />
				Could not load preview.
			</div>
		);
	}

	const data = preview.data;
	if (!data) return null;

	if (!data.available) {
		return (
			<div className="min-h-[240px] border-2 border-dashed border-border rounded-2xl flex flex-col items-center justify-center text-center p-8 bg-muted/20">
				<AlertCircle className="w-8 h-8 text-muted-foreground mb-3" />
				<h3 className="text-base font-semibold mb-1">
					{view === "customer"
						? "No customer aggregate"
						: view === "monthly"
							? "No monthly aggregate"
							: "No cleaned table"}
				</h3>
				<p className="text-sm text-muted-foreground max-w-md">
					{view === "customer"
						? "This dataset doesn't have a customer-level aggregate. The uploader couldn't detect a customer-ID column."
						: view === "monthly"
							? "This dataset doesn't have a monthly aggregate. The uploader couldn't detect date and amount columns."
							: "The cleaned data table wasn't created for this upload."}
				</p>
			</div>
		);
	}

	if (data.rows.length === 0) {
		return (
			<div className="min-h-[240px] text-sm text-muted-foreground flex items-center justify-center">
				Table exists but has no rows.
			</div>
		);
	}

	return (
		<div className="space-y-3">
			<div className="flex items-center justify-between text-xs text-muted-foreground">
				<span>
					Showing {data.rows.length} of {data.total_rows.toLocaleString()} rows
				</span>
				<span className="font-mono text-[10px] opacity-60">{data.table}</span>
			</div>
			<div className="overflow-x-auto rounded-xl border border-border">
				<table className="w-full text-xs">
					<thead>
						<tr className="border-b border-border bg-muted/50">
							{data.columns.map((col) => (
								<th
									key={col}
									className="text-left px-3 py-2 font-semibold text-muted-foreground whitespace-nowrap"
								>
									{col}
								</th>
							))}
						</tr>
					</thead>
					<tbody>
						{data.rows.map((row, idx) => (
							<tr
								// biome-ignore lint/suspicious/noArrayIndexKey: rows have no stable id
								key={idx}
								className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors"
							>
								{data.columns.map((col) => (
									<td
										key={col}
										className="px-3 py-2 whitespace-nowrap font-mono text-[11px]"
									>
										{formatCell(row[col])}
									</td>
								))}
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</div>
	);
}

function formatCell(v: unknown): string {
	if (v === null || v === undefined) return "—";
	if (typeof v === "number") {
		return Number.isInteger(v)
			? v.toLocaleString()
			: v.toLocaleString(undefined, { maximumFractionDigits: 4 });
	}
	if (typeof v === "boolean") return v ? "true" : "false";
	return String(v);
}