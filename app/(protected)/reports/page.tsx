import { PageHeader } from '@/components/layout/PageHeader';
import { FileText, Download, Share2, Search, Filter, Filter as FilterIcon, Calendar, ArrowUpRight, BarChart4, FileSpreadsheet } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Executive Reports' };

const pastReports = [
    {
        id: '1',
        name: 'Quarterly Strategic Audit - Q4 2023',
        type: 'Audit',
        format: 'PDF',
        date: 'Oct 15, 2023',
        status: 'Finalized',
        size: '2.4 MB',
    },
    {
        id: '2',
        name: 'Market Projection & Prediction Model v4',
        type: 'Forecast',
        format: 'XLSX',
        date: 'Oct 12, 2023',
        status: 'Finalized',
        size: '1.8 MB',
    },
    {
        id: '3',
        name: 'Churn Analysis & Strategy Canvas Export',
        type: 'Strategy',
        format: 'PDF',
        date: 'Oct 10, 2023',
        status: 'Finalized',
        size: '4.1 MB',
    },
    {
        id: '4',
        name: 'Automated Insight Weekly Summary',
        type: 'Weekly',
        format: 'PDF',
        date: 'Oct 08, 2023',
        status: 'Archived',
        size: '0.9 MB',
    },
];

export default function ReportsPage() {
    return (
        <div className="animate-fade-in space-y-6">
            <PageHeader
                title="Executive Reports"
                description="Manage, export, and share your generated strategic reports and audits."
                actions={
                    <button className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-semibold hover:bg-primary/90 transition-all shadow-md active:scale-95">
                        <ArrowUpRight className="w-4 h-4" />
                        Generate New Report
                    </button>
                }
            />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    {/* Search & Filter */}
                    <div className="flex items-center gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground" />
                            <input
                                type="text"
                                placeholder="Search reports by name or date..."
                                className="w-full pl-10 pr-4 py-2 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-sm"
                            />
                        </div>
                        <button className="p-2 rounded-xl border border-border bg-background hover:bg-muted transition-colors">
                            <FilterIcon className="w-4 h-4" />
                        </button>
                    </div>

                    {/* Report Table */}
                    <div className="glass-card rounded-2xl overflow-hidden border border-border">
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead className="bg-muted/30">
                                    <tr className="border-b border-border">
                                        <th className="text-left py-4 px-6 font-semibold text-xs text-muted-foreground uppercase tracking-wider">Report Name</th>
                                        <th className="text-left py-4 px-6 font-semibold text-xs text-muted-foreground uppercase tracking-wider">Type</th>
                                        <th className="text-left py-4 px-6 font-semibold text-xs text-muted-foreground uppercase tracking-wider">Date</th>
                                        <th className="text-right py-4 px-6 font-semibold text-xs text-muted-foreground uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {pastReports.map((report) => (
                                        <tr key={report.id} className="border-b border-border last:border-0 hover:bg-muted/20 transition-colors group">
                                            <td className="py-4 px-6">
                                                <div className="flex items-center gap-3">
                                                    <div className={`p-2 rounded-lg ${report.format === 'PDF' ? 'bg-rose-500/10 text-rose-500' : 'bg-emerald-500/10 text-emerald-500'}`}>
                                                        {report.format === 'PDF' ? <FileText className="w-4 h-4" /> : <FileSpreadsheet className="w-4 h-4" />}
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <span className="font-semibold">{report.name}</span>
                                                        <span className="text-[10px] text-muted-foreground uppercase">{report.size} • {report.status}</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-4 px-6">
                                                <span className="px-2 py-0.5 rounded-full bg-muted text-[10px] font-bold uppercase text-muted-foreground">
                                                    {report.type}
                                                </span>
                                            </td>
                                            <td className="py-4 px-6 text-muted-foreground flex items-center gap-2">
                                                <Calendar className="w-3.5 h-3.5" />
                                                {report.date}
                                            </td>
                                            <td className="py-4 px-6 text-right">
                                                <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <button className="p-2 rounded-lg border border-border hover:bg-primary/10 hover:text-primary" title="Download">
                                                        <Download className="w-4 h-4" />
                                                    </button>
                                                    <button className="p-2 rounded-lg border border-border hover:bg-primary/10 hover:text-primary" title="Share">
                                                        <Share2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    {/* Active Insights Summary Card */}
                    <div className="glass-card rounded-2xl p-6 bg-primary/5 border-primary/20 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-10">
                            <BarChart4 className="w-20 h-20" />
                        </div>
                        <h3 className="text-lg font-bold mb-4 relative z-10 font-heading">Report Quality Audit</h3>
                        <div className="space-y-4 relative z-10">
                            <p className="text-sm text-muted-foreground">
                                Your reports are currently scoring <span className="font-bold text-primary">89/100</span> in comprehensiveness.
                            </p>
                            <div className="w-full h-2 bg-muted rounded-full">
                                <div className="h-full bg-primary rounded-full transition-all duration-1000" style={{ width: '89%' }} />
                            </div>
                            <div className="p-3 bg-background/50 rounded-xl border border-primary/10">
                                <p className="text-[10px] text-primary font-bold uppercase mb-1">Recommendation</p>
                                <p className="text-xs text-muted-foreground leading-relaxed">
                                    Include the regional distribution charts from ADR-0004 to increase decision quality for Q1 projections.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Metadata/Stats */}
                    <div className="glass-card rounded-2xl p-6">
                        <h3 className="font-semibold mb-6">Storage Utilization</h3>
                        <div className="space-y-6">
                            {[
                                { label: 'Audit Logs', value: '45.2 MB', count: 12, color: 'bg-primary' },
                                { label: 'Exports', value: '124.8 MB', count: 54, color: 'bg-indigo-500' },
                                { label: 'Backups', value: '890.1 MB', count: 3, color: 'bg-emerald-500' },
                            ].map(u => (
                                <div key={u.label}>
                                    <div className="flex items-center justify-between text-xs mb-2">
                                        <span className="font-medium">{u.label}</span>
                                        <span className="text-muted-foreground">{u.value} ({u.count})</span>
                                    </div>
                                    <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                                        <div className={`h-full ${u.color}`} style={{ width: `${(u.count / 70) * 100}%` }} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
