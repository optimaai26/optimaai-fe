import { PageHeader } from '@/components/layout/PageHeader';
import { FileText, Download } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Reports' };

export default function ReportsPage() {
    return (
        <div className="animate-fade-in space-y-6">
            <PageHeader
                title="Executive Reports"
                description="Manage and export your automated business reports."
                actions={
                    <button className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-semibold hover:bg-primary/90 transition-all">
                        <Download className="w-4 h-4" />
                        Generate PDF
                    </button>
                }
            />

            {/* 
              DESIGN CHALLENGE: 
              1. Design a professional audit log/table for historical reports.
              2. Implement multi-format export logic (PDF, CSV, XLSX).
              3. Create a dashboard for "Report Health" and generation scheduling.
            */}
            <div className="glass-card rounded-2xl p-8 border border-dashed border-border min-h-[500px] flex flex-col items-center justify-center bg-muted/5">
                <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-6">
                    <FileText className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold mb-2">No Reports Generated</h3>
                <p className="text-sm text-muted-foreground text-center max-w-sm mb-6">
                    Connect your predictions and strategy canvas to generate a comprehensive executive summary.
                </p>
                <div className="flex gap-3">
                    <div className="w-20 h-8 bg-muted rounded-lg animate-pulse" />
                    <div className="w-20 h-8 bg-muted rounded-lg animate-pulse" />
                </div>
                <div className="mt-8">
                    <code className="text-xs text-primary font-mono">// TODO: Implement Reporting Engine & History</code>
                </div>
            </div>
        </div>
    );
}
