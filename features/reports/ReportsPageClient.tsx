"use client";

import { FileJson, FileSpreadsheet, Loader2 } from "lucide-react";
import { type Column, DataTable } from "@/components/data-display/DataTable";
import { PageHeader } from "@/components/layout/PageHeader";
import { useExport } from "@/features/reports/useExport";
import { useReports } from "@/features/reports/useReports";
import type { Report } from "@/types";

const columns: Column<Report>[] = [
	{ key: "title", header: "Title" },
	{
		key: "status",
		header: "Status",
		render: (row) => <span className="capitalize">{row.status}</span>,
	},
	{ key: "datasetId", header: "Dataset" },
	{
		key: "updatedAt",
		header: "Updated",
		render: (row) => new Date(row.updatedAt).toLocaleString(),
	},
];

export function ReportsPageClient() {
	const { data, isLoading, isError } = useReports();
	const { exportAsCSV, exportAsJSON, isExporting } = useExport();
	const reports = data?.data ?? [];

	const actions = (
		<div className="flex items-center gap-3">
			<button
				type="button"
				onClick={() => exportAsCSV(reports, "reports_export.csv")}
				disabled={isExporting || reports.length === 0}
				className="inline-flex items-center gap-2 px-4 py-2 bg-muted text-foreground hover:bg-muted/80 rounded-lg text-sm font-semibold transition-colors disabled:opacity-50"
			>
				<FileSpreadsheet className="w-4 h-4 text-emerald-500" />
				Export CSV
			</button>
			<button
				type="button"
				onClick={() => exportAsJSON(reports, "reports_export.json")}
				disabled={isExporting || reports.length === 0}
				className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg text-sm font-semibold transition-colors disabled:opacity-50"
			>
				<FileJson className="w-4 h-4" />
				Export JSON
			</button>
		</div>
	);

	return (
		<div className="animate-fade-in space-y-6">
			<PageHeader
				title="Executive Reports"
				description="Manage and export your automated business reports."
				actions={actions}
			/>
			{isLoading ? (
				<div className="min-h-[240px] flex items-center justify-center">
					<Loader2 className="w-6 h-6 animate-spin text-primary" />
				</div>
			) : isError ? (
				<div className="text-sm text-danger">Failed to load reports.</div>
			) : (
				<DataTable
					columns={columns}
					data={reports}
					keyExtractor={(row) => row.id}
					emptyMessage="No reports generated yet"
				/>
			)}
		</div>
	);
}
