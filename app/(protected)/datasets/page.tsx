import { PageHeader } from '@/components/layout/PageHeader';
import { Database, Upload } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Datasets' };

export default function DatasetsPage() {
    return (
        <div className="animate-fade-in space-y-6">
            <PageHeader
                title="Datasets"
                description="Upload and manage your raw data for AI analysis."
                actions={
                    <button className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-semibold hover:bg-primary/90 transition-all">
                        <Upload className="w-4 h-4" />
                        Upload Data
                    </button>
                }
            />

            {/* 
              DESIGN CHALLENGE: 
              1. Implement a professional empty state for when no datasets exists.
              2. Design a high-fidelity list/grid view for managing datasets.
              3. Integrate with the `DatasetUploader` component and handle upload progress.
            */}
            <div className="min-h-[400px] border-2 border-dashed border-border rounded-2xl flex flex-col items-center justify-center text-center p-8 bg-muted/20">
                <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                    <Database className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold mb-2">No Datasets Found</h3>
                <p className="text-sm text-muted-foreground max-w-sm mb-6">
                    Connect your data sources or upload a CSV/JSON file to begin generating AI-powered insights.
                </p>
                <div className="text-xs font-mono text-primary bg-primary/10 px-3 py-1.5 rounded-full border border-primary/20">
                    // TODO: Implement the Dataset logic & design here
                </div>
            </div>
        </div>
    );
}
