import { PageHeader } from '@/components/layout/PageHeader';
import { ArrowLeft, Download, Trash2, RefreshCw } from 'lucide-react';
import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Dataset Detail' };

export default function DatasetDetailPage({ params }: { params: { id: string } }) {
    return (
        <div className="animate-fade-in">
            <div className="mb-4">
                <Link
                    href="/datasets"
                    className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Datasets
                </Link>
            </div>

            <PageHeader
                title="Q4 Sales Data"
                description={`Dataset ID: ${params.id} • 12,500 rows • 24 columns • Uploaded 2 hours ago`}
                actions={
                    <div className="flex items-center gap-2">
                        <button className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-border text-sm hover:bg-muted transition-colors">
                            <RefreshCw className="w-4 h-4" />
                            Reprocess
                        </button>
                        <button className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-border text-sm hover:bg-muted transition-colors">
                            <Download className="w-4 h-4" />
                            Export
                        </button>
                        <button className="inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-danger hover:bg-danger/10 transition-colors">
                            <Trash2 className="w-4 h-4" />
                            Delete
                        </button>
                    </div>
                }
            />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                {/* Stats Cards */}
                {[
                    { label: 'Total Rows', value: '12,500' },
                    { label: 'Total Columns', value: '24' },
                    { label: 'Missing Values', value: '1.2%' },
                ].map((stat) => (
                    <div key={stat.label} className="glass-card rounded-xl p-5 text-center">
                        <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
                        <p className="text-2xl font-bold">{stat.value}</p>
                    </div>
                ))}
            </div>

            {/* Column Summary */}
            <div className="glass-card rounded-xl p-6 mb-6">
                <h3 className="font-semibold mb-4">Column Summary</h3>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-border">
                                <th className="text-left py-2 px-3 font-medium text-muted-foreground">Column</th>
                                <th className="text-left py-2 px-3 font-medium text-muted-foreground">Type</th>
                                <th className="text-left py-2 px-3 font-medium text-muted-foreground">Unique</th>
                                <th className="text-left py-2 px-3 font-medium text-muted-foreground">Nulls</th>
                            </tr>
                        </thead>
                        <tbody>
                            {[
                                { name: 'customer_id', type: 'string', unique: 12500, nulls: 0 },
                                { name: 'revenue', type: 'number', unique: 8432, nulls: 12 },
                                { name: 'signup_date', type: 'date', unique: 892, nulls: 0 },
                                { name: 'is_active', type: 'boolean', unique: 2, nulls: 5 },
                                { name: 'region', type: 'string', unique: 6, nulls: 0 },
                            ].map((col) => (
                                <tr key={col.name} className="border-b border-border last:border-0 hover:bg-muted/30">
                                    <td className="py-2 px-3 font-mono text-xs">{col.name}</td>
                                    <td className="py-2 px-3">
                                        <span className="px-2 py-0.5 rounded-md bg-muted text-xs">{col.type}</span>
                                    </td>
                                    <td className="py-2 px-3">{col.unique.toLocaleString()}</td>
                                    <td className="py-2 px-3">{col.nulls}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Data Preview */}
            <div className="glass-card rounded-xl p-6">
                <h3 className="font-semibold mb-4">Data Preview</h3>
                <div className="h-48 flex items-center justify-center text-muted-foreground text-sm border border-dashed border-border rounded-lg">
                    Data preview table — first 100 rows
                </div>
            </div>
        </div>
    );
}
