import { PageHeader } from '@/components/layout/PageHeader';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Dataset Detail' };

export default function DatasetDetailPage({ params }: { params: { id: string } }) {
    return (
        <div className="animate-fade-in space-y-6">
            <Link
                href="/datasets"
                className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-primary transition-colors group"
            >
                <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                Back to Datasets
            </Link>

            <PageHeader
                title="Dataset Analysis"
                description={`Detailed profiling for dataset ID: ${params.id}`}
            />

            {/* 
              DESIGN CHALLENGE: 
              1. Design a comprehensive "Data Quality" dashboard.
              2. Implement a column-by-column profiling view (nulls, unique values, distributions).
              3. Create a searchable and sortable data preview table.
            */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="glass-card h-32 rounded-xl border border-dashed border-border transition-all hover:border-primary/40 flex items-center justify-center">
                        <span className="text-xs text-muted-foreground font-mono">Profile Metric {i} Placeholder</span>
                    </div>
                ))}
            </div>

            <div className="glass-card min-h-[500px] rounded-2xl border border-dashed border-border flex items-center justify-center bg-muted/10">
                <div className="text-center">
                    <p className="text-sm font-semibold mb-2">Detailed Profiling & Preview</p>
                    <p className="text-xs text-muted-foreground mb-4 font-mono">// TODO: Build the data analysis UI from scratch</p>
                    <div className="h-1.5 w-48 bg-muted rounded-full overflow-hidden mx-auto">
                        <div className="h-full bg-primary/30 w-1/3 animate-pulse" />
                    </div>
                </div>
            </div>
        </div>
    );
}
