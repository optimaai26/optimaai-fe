import { PageHeader } from '@/components/layout/PageHeader';
import { Database, TrendingUp, Info } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Dataset Details' };

export default function DatasetDetailPage({ params }: { params: { id: string } }) {
    return (
        <div className="animate-fade-in">
            <PageHeader
                title={`Dataset: ${params.id}`}
                description="Detailed analysis and column metadata for the selected dataset."
            />

            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2 space-y-6">
                    {/* 
                        TODO: Implement Data Exploration View.
                        - Show a sample preview of the data (first 10-20 rows).
                        - Implement column statistical analysis (mean, median, etc.).
                        - Use a scrollable data table.
                    */}
                    <div className="glass-card rounded-xl p-6 h-[500px] flex items-center justify-center border-dashed border-2">
                        <div className="text-center">
                            <Database className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                            <p className="text-muted-foreground">Implement Data Explorer for dataset ID: {params.id}</p>
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    {/* 
                        TODO: Implement Metadata Sidebar.
                        - Show file size, row count, column count.
                        - List data types (Strings, Numbers, Dates).
                        - Add a 'Run Prediction' shortcut button.
                    */}
                    <div className="glass-card rounded-xl p-6 border-dashed border-2">
                        <div className="flex items-center gap-2 mb-4">
                            <Info className="w-4 h-4 text-primary-500" />
                            <h3 className="font-semibold">Metadata</h3>
                        </div>
                        <div className="space-y-4">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="flex justify-between items-center">
                                    <div className="h-3 w-16 bg-muted rounded animate-pulse" />
                                    <div className="h-3 w-12 bg-muted rounded animate-pulse" />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
