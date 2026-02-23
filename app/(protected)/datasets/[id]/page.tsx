import { PageHeader } from '@/components/layout/PageHeader';
import { ArrowLeft, Download, Trash2, RefreshCw, Database, BarChart3, Search, Filter } from 'lucide-react';
import Link from 'next/link';
import type { Metadata } from 'next';
import OverviewChart from '@/components/data-display/OverviewChart';

export const metadata: Metadata = { title: 'Dataset Detail' };

const profilingData = [
    { name: 'customer_id', type: 'string', unique: 12500, nulls: 0, distinct: 100 },
    { name: 'revenue', type: 'number', unique: 8432, nulls: 12, distinct: 85 },
    { name: 'signup_date', type: 'date', unique: 892, nulls: 0, distinct: 60 },
    { name: 'is_active', type: 'boolean', unique: 2, nulls: 5, distinct: 100 },
    { name: 'region', type: 'string', unique: 6, nulls: 0, distinct: 100 },
];

const distributionData = [
    { name: 'North', total: 450 },
    { name: 'South', total: 320 },
    { name: 'East', total: 280 },
    { name: 'West', total: 150 },
    { name: 'Central', total: 50 },
];

const mockRows = [
    { id: '1', customer_id: 'C-892', revenue: 1250, signup_date: '2023-11-12', is_active: 'Yes', region: 'North' },
    { id: '2', customer_id: 'C-412', revenue: 2310, signup_date: '2023-11-13', is_active: 'Yes', region: 'South' },
    { id: '3', customer_id: 'C-901', revenue: 840, signup_date: '2023-11-14', is_active: 'No', region: 'North' },
    { id: '4', customer_id: 'C-723', revenue: 310, signup_date: '2023-11-15', is_active: 'Yes', region: 'West' },
    { id: '5', customer_id: 'C-109', revenue: 4500, signup_date: '2023-11-16', is_active: 'Yes', region: 'East' },
];

export default function DatasetDetailPage({ params }: { params: { id: string } }) {
    return (
        <div className="animate-fade-in space-y-6">
            <div className="flex items-center justify-between">
                <Link
                    href="/datasets"
                    className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-primary transition-colors group"
                >
                    <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                    Back to Datasets
                </Link>
                <div className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
                    Branch: senior/reference
                </div>
            </div>

            <PageHeader
                title="Q4 Sales Performance"
                description={`Dataset ID: ${params.id} • 12,500 rows • 24 columns • 1.2% missing values`}
                actions={
                    <div className="flex items-center gap-2">
                        <button className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-border text-xs font-medium hover:bg-muted transition-colors">
                            <RefreshCw className="w-3.5 h-3.5" />
                            Reprocess
                        </button>
                        <button className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-border text-xs font-medium hover:bg-muted transition-colors">
                            <Download className="w-3.5 h-3.5" />
                            Export CSV
                        </button>
                        <button className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-danger/10 text-xs font-semibold text-danger hover:bg-danger/20 transition-colors">
                            <Trash2 className="w-3.5 h-3.5" />
                            Delete
                        </button>
                    </div>
                }
            />

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
                {[
                    { label: 'File Size', value: '4.2 MB', sub: 'CSV Format' },
                    { label: 'Data Quality', value: '98.8%', sub: 'Healthy' },
                    { label: 'Anomalies', value: '14', sub: 'Detected' },
                    { label: 'Last Scan', value: '2h ago', sub: 'Automated' },
                ].map((stat) => (
                    <div key={stat.label} className="glass-card rounded-xl p-4">
                        <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-1">{stat.label}</p>
                        <p className="text-xl font-bold">{stat.value}</p>
                        <p className="text-[10px] text-muted-foreground mt-1">{stat.sub}</p>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    {/* Column Profiling */}
                    <div className="glass-card rounded-xl p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="font-semibold text-lg flex items-center gap-2">
                                <Database className="w-5 h-5 text-primary" />
                                Column Definitions & Profiling
                            </h3>
                            <button className="text-xs text-primary hover:underline">View all columns</button>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-border">
                                        <th className="text-left py-3 px-3 text-xs font-semibold text-muted-foreground">NAME</th>
                                        <th className="text-left py-3 px-3 text-xs font-semibold text-muted-foreground">TYPE</th>
                                        <th className="text-left py-3 px-3 text-xs font-semibold text-muted-foreground">DISTINCT</th>
                                        <th className="text-left py-3 px-3 text-xs font-semibold text-muted-foreground">MISSING</th>
                                        <th className="text-right py-3 px-3 text-xs font-semibold text-muted-foreground">QUALITY</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {profilingData.map((col) => (
                                        <tr key={col.name} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors group">
                                            <td className="py-3 px-3">
                                                <code className="text-xs text-primary font-semibold bg-primary/5 px-1.5 py-0.5 rounded">
                                                    {col.name}
                                                </code>
                                            </td>
                                            <td className="py-3 px-3">
                                                <span className="text-xs text-muted-foreground">{col.type}</span>
                                            </td>
                                            <td className="py-3 px-3">
                                                <span className="text-xs font-medium">{col.distinct}%</span>
                                            </td>
                                            <td className="py-3 px-3">
                                                <span className={`text-xs ${col.nulls > 0 ? 'text-amber-500' : 'text-muted-foreground'}`}>
                                                    {col.nulls}
                                                </span>
                                            </td>
                                            <td className="py-3 px-3 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <div className="w-16 h-1.5 bg-muted rounded-full overflow-hidden">
                                                        <div
                                                            className="h-full bg-primary"
                                                            style={{ width: `${100 - col.nulls}%` }}
                                                        />
                                                    </div>
                                                    <span className="text-[10px] font-bold">{100 - col.nulls}%</span>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Data Preview */}
                    <div className="glass-card rounded-xl p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="font-semibold text-lg flex items-center gap-2">
                                <Search className="w-5 h-5 text-primary" />
                                Data Preview (First 5 rows)
                            </h3>
                            <div className="flex items-center gap-2">
                                <div className="relative">
                                    <Filter className="absolute left-2.5 top-2.5 w-3.5 h-3.5 text-muted-foreground" />
                                    <input
                                        type="text"
                                        placeholder="Filter rows..."
                                        className="pl-8 pr-3 py-1.5 rounded-lg border border-border bg-muted/20 text-xs focus:outline-none focus:ring-1 focus:ring-primary w-40"
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="overflow-x-auto rounded-lg border border-border">
                            <table className="w-full text-sm">
                                <thead className="bg-muted/50">
                                    <tr>
                                        {Object.keys(mockRows[0]).map(key => (
                                            <th key={key} className="text-left py-2.5 px-3 font-semibold text-xs text-muted-foreground uppercase border-b border-border">
                                                {key.replace('_', ' ')}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {mockRows.map(row => (
                                        <tr key={row.id} className="border-b border-border last:border-0 hover:bg-muted/20 transition-colors">
                                            {Object.values(row).map((val, i) => (
                                                <td key={i} className="py-2.5 px-3 text-xs whitespace-nowrap">
                                                    {val}
                                                </td>
                                            ))}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    {/* Distribution Visualization */}
                    <div className="glass-card rounded-xl p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="font-semibold flex items-center gap-2">
                                <BarChart3 className="w-5 h-5 text-primary" />
                                Regional Distribution
                            </h3>
                        </div>
                        <div className="h-64">
                            <OverviewChart data={distributionData} />
                        </div>
                        <div className="mt-4 p-3 rounded-lg bg-primary/5 border border-primary/10">
                            <p className="text-[10px] font-semibold text-primary uppercase mb-1">AI INSIGHT</p>
                            <p className="text-xs text-muted-foreground leading-relaxed">
                                North region shows a 15% higher revenue per customer compared to the national average.
                            </p>
                        </div>
                    </div>

                    {/* Metadata */}
                    <div className="glass-card rounded-xl p-6">
                        <h3 className="font-semibold mb-4">Dataset Metadata</h3>
                        <div className="space-y-4">
                            {[
                                { label: 'Created By', value: 'Admin User' },
                                { label: 'Created At', value: 'Feb 23, 2026' },
                                { label: 'Source', value: 'Stripe API' },
                                { label: 'Encryption', value: 'AES-256' },
                                { label: 'Tags', value: '#sales, #q4, #urgent' },
                            ].map(item => (
                                <div key={item.label} className="flex flex-col border-l-2 border-primary/20 pl-3">
                                    <span className="text-[10px] text-muted-foreground font-semibold uppercase">{item.label}</span>
                                    <span className="text-sm font-medium">{item.value}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
