import { PageHeader } from '@/components/layout/PageHeader';
import { DatasetUploader } from '@/components/feature/DatasetUploader';
import { Database, Plus, Search, Filter } from 'lucide-react';
import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Datasets' };

const mockDatasets = [
    { id: '1', name: 'Q4 Sales Data', rows: 12500, status: 'ready', uploaded: '2 hours ago' },
    { id: '2', name: 'Customer Segments', rows: 8340, status: 'processing', uploaded: '5 hours ago' },
    { id: '3', name: 'Marketing Spend', rows: 3200, status: 'ready', uploaded: '1 day ago' },
    { id: '4', name: 'Product Usage Logs', rows: 45000, status: 'ready', uploaded: '3 days ago' },
];

const statusStyles: Record<string, string> = {
    ready: 'bg-success/10 text-success',
    processing: 'bg-warning/10 text-warning',
    error: 'bg-danger/10 text-danger',
    uploading: 'bg-info/10 text-info',
};

export default function DatasetsPage() {
    return (
        <div className="animate-fade-in">
            <PageHeader
                title="Datasets"
                description="Upload, manage, and explore your data sources."
                actions={
                    <button className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg gradient-primary text-white text-sm font-medium hover:opacity-90 transition-opacity">
                        <Plus className="w-4 h-4" />
                        Upload Dataset
                    </button>
                }
            />

            {/* Upload Area */}
            <DatasetUploader className="mb-8" />

            {/* Search + Filter */}
            <div className="flex items-center gap-3 mb-6">
                <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-muted text-muted-foreground flex-1 max-w-sm">
                    <Search className="w-4 h-4" />
                    <input
                        type="text"
                        placeholder="Search datasets..."
                        className="bg-transparent text-sm outline-none w-full"
                    />
                </div>
                <button className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-border text-sm hover:bg-muted transition-colors">
                    <Filter className="w-4 h-4" />
                    Filter
                </button>
            </div>

            {/* Dataset Cards */}
            <div className="grid gap-4">
                {mockDatasets.map((ds) => (
                    <Link
                        key={ds.id}
                        href={`/datasets/${ds.id}`}
                        className="glass-card rounded-xl p-5 flex items-center gap-4 hover:border-primary-400/20 transition-all duration-200 group"
                    >
                        <div className="w-12 h-12 rounded-xl bg-primary-50 dark:bg-primary-900/30 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                            <Database className="w-6 h-6 text-primary-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <h3 className="font-semibold truncate">{ds.name}</h3>
                            <p className="text-sm text-muted-foreground">
                                {ds.rows.toLocaleString()} rows • Uploaded {ds.uploaded}
                            </p>
                        </div>
                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${statusStyles[ds.status]}`}>
                            {ds.status}
                        </span>
                    </Link>
                ))}
            </div>
        </div>
    );
}
