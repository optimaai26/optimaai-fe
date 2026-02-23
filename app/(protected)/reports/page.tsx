import { PageHeader } from '@/components/layout/PageHeader';
import { FileText, Download, Share2 } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Reports' };

export default function ReportsPage() {
    return (
        <div className="animate-fade-in">
            <PageHeader
                title="Analytics Reports"
                description="Generate and export comprehensive business summaries."
                actions={
                    <div className="flex gap-2">
                        <button className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-muted text-foreground text-sm font-medium hover:bg-muted/80 transition-colors">
                            <Share2 className="w-4 h-4" />
                            Share
                        </button>
                        <button className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg gradient-primary text-white text-sm font-medium hover:opacity-90 transition-opacity">
                            <Download className="w-4 h-4" />
                            Generate Report
                        </button>
                    </div>
                }
            />

            <div className="mt-8">
                {/* 
                    TODO: Implement Report Generation Flow.
                    - Add a form to select data range and report type.
                    - Implement a list of recently generated reports.
                    - Add 'Download PDF' and 'Export CSV' functionality.
                */}
                <div className="glass-card rounded-xl p-12 flex flex-col items-center justify-center text-center border-dashed border-2">
                    <div className="w-16 h-16 rounded-full bg-primary-50 dark:bg-primary-900/20 flex items-center justify-center mb-4">
                        <FileText className="w-8 h-8 text-primary-500" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">Ready to compile?</h3>
                    <p className="text-muted-foreground max-w-sm mb-6">
                        Select your datasets and parameters to generate a new business intelligence report.
                    </p>
                </div>
            </div>
        </div>
    );
}
