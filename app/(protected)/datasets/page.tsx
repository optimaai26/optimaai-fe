import { PageHeader } from '@/components/layout/PageHeader';
import { Database, Plus } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Datasets' };

export default function DatasetsPage() {
    return (
        <div className="animate-fade-in">
            <PageHeader
                title="Datasets Inventory"
                description="Manage and upload your data files for analysis."
                actions={
                    <button className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg gradient-primary text-white text-sm font-medium hover:opacity-90 transition-opacity">
                        <Plus className="w-4 h-4" />
                        Upload Dataset
                    </button>
                }
            />

            <div className="mt-8">
                {/* 
                    TODO: Implement Dataset filtering and listing table.
                    - Use TanStack Query for data fetching (create a useDatasets hook).
                    - Use the DataTable component for rendering.
                    - Add search functionality and status filters.
                */}
                <div className="glass-card rounded-xl p-12 flex flex-col items-center justify-center text-center">
                    <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                        <Database className="w-8 h-8 text-muted-foreground" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">No datasets found</h3>
                    <p className="text-muted-foreground max-w-sm mb-6">
                        Start by uploading a CSV or Excel file to begin your analysis.
                    </p>
                </div>
            </div>
        </div>
    );
}
