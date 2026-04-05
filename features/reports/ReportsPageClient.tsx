'use client';

import { DataTable, type Column } from '@/components/data-display/DataTable';
import { PageHeader } from '@/components/layout/PageHeader';
import { useReports } from '@/features/reports/useReports';
import type { Report } from '@/types';
import { Download, Loader2 } from 'lucide-react';

const columns: Column<Report>[] = [
    { key: 'title', header: 'Title' },
    { key: 'status', header: 'Status', render: (row) => <span className="capitalize">{row.status}</span> },
    { key: 'datasetId', header: 'Dataset' },
    { key: 'updatedAt', header: 'Updated', render: (row) => new Date(row.updatedAt).toLocaleString() },
];

export function ReportsPageClient() {
    const { data, isLoading, isError } = useReports();
    const reports = data?.data ?? [];

    return (
        <div className="animate-fade-in space-y-6">
            <PageHeader title="Executive Reports" description="Manage and export your automated business reports." actions={<button className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-semibold"><Download className="w-4 h-4" />Generate PDF</button>} />
            {isLoading ? <div className="min-h-[240px] flex items-center justify-center"><Loader2 className="w-6 h-6 animate-spin" /></div> : isError ? <div className="text-sm text-danger">Failed to load reports.</div> : <DataTable columns={columns} data={reports} keyExtractor={(row) => row.id} emptyMessage="No reports generated yet" />}
        </div>
    );
}
