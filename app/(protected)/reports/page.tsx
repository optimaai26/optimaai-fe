import { PageHeader } from '@/components/layout/PageHeader';
import { FileText, Download, Plus, Calendar, Eye } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Reports' };

const reports = [
    { id: '1', name: 'Monthly Revenue Analysis', date: 'Feb 2026', pages: 12, views: 45 },
    { id: '2', name: 'Customer Churn Report', date: 'Jan 2026', pages: 8, views: 32 },
    { id: '3', name: 'Growth Opportunities Q4', date: 'Dec 2025', pages: 15, views: 67 },
    { id: '4', name: 'Market Segmentation Study', date: 'Dec 2025', pages: 10, views: 28 },
];

export default function ReportsPage() {
    return (
        <div className="animate-fade-in">
            <PageHeader
                title="Reports"
                description="Generated reports and analytics summaries."
                actions={
                    <button className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg gradient-primary text-white text-sm font-medium hover:opacity-90 transition-opacity">
                        <Plus className="w-4 h-4" />
                        Generate Report
                    </button>
                }
            />

            <div className="grid gap-4">
                {reports.map((report) => (
                    <div
                        key={report.id}
                        className="glass-card rounded-xl p-5 flex items-center gap-4 hover:border-primary-400/20 transition-all duration-200 group"
                    >
                        <div className="w-12 h-12 rounded-xl bg-primary-50 dark:bg-primary-900/30 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                            <FileText className="w-6 h-6 text-primary-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <h3 className="font-semibold truncate">{report.name}</h3>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                                <span className="inline-flex items-center gap-1">
                                    <Calendar className="w-3.5 h-3.5" />
                                    {report.date}
                                </span>
                                <span>{report.pages} pages</span>
                                <span className="inline-flex items-center gap-1">
                                    <Eye className="w-3.5 h-3.5" />
                                    {report.views} views
                                </span>
                            </div>
                        </div>
                        <button className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-border text-sm hover:bg-muted transition-colors opacity-0 group-hover:opacity-100">
                            <Download className="w-4 h-4" />
                            Export
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}
