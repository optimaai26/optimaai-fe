"use client";

import { ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { PageHeader } from "@/components/layout/PageHeader";
import { useDataset } from "@/features/datasets/useDatasets";

export function DatasetDetailPageClient({ id }: { id: string }) {
	const { data, isLoading, isError } = useDataset(id);
	const dataset = data?.data;

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
						description={
							dataset.description ?? `Detailed profiling for dataset ID: ${id}`
						}
					/>
					<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
						<div className="glass-card h-32 rounded-xl flex flex-col items-center justify-center">
							<span className="text-xs text-muted-foreground uppercase tracking-wider">
								Rows
							</span>
							<span className="text-2xl font-bold">
								{dataset.rowCount.toLocaleString()}
							</span>
						</div>
						<div className="glass-card h-32 rounded-xl flex flex-col items-center justify-center">
							<span className="text-xs text-muted-foreground uppercase tracking-wider">
								Columns
							</span>
							<span className="text-2xl font-bold">
								{dataset.columnCount.toLocaleString()}
							</span>
						</div>
						<div className="glass-card h-32 rounded-xl flex flex-col items-center justify-center">
							<span className="text-xs text-muted-foreground uppercase tracking-wider">
								Status
							</span>
							<span className="text-2xl font-bold capitalize">
								{dataset.status}
							</span>
						</div>
					</div>
					<div className="glass-card min-h-[320px] rounded-2xl p-6 bg-muted/10">
						<h3 className="font-semibold mb-4">Dataset Metadata</h3>
						<div className="space-y-2 text-sm">
							<p>
								<span className="text-muted-foreground">File:</span>{" "}
								{dataset.fileName}
							</p>
							<p>
								<span className="text-muted-foreground">Uploaded By:</span>{" "}
								{dataset.uploadedBy}
							</p>
							<p>
								<span className="text-muted-foreground">Created At:</span>{" "}
								{new Date(dataset.createdAt).toLocaleString()}
							</p>
							<p>
								<span className="text-muted-foreground">Updated At:</span>{" "}
								{new Date(dataset.updatedAt).toLocaleString()}
							</p>
						</div>
					</div>
				</>
			)}
		</div>
	);
}
