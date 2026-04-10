'use client';

import { useState } from 'react';
import { DataTable, type Column } from '@/components/data-display/DataTable';
import { PageHeader } from '@/components/layout/PageHeader';
import { UploadDatasetModal } from '@/features/datasets/UploadDatasetModal';
import { useCreateDataset, useDatasets, useDeleteDataset } from '@/features/datasets/useDatasets';
import type { Dataset } from '@/types';
import { Database, Loader2, Trash2, Upload } from 'lucide-react';
import Link from 'next/link';

const columns: Column<Dataset>[] = [
    { key: 'name', header: 'Name', render: (row) => <Link href={`/datasets/${row.id}`} className="font-medium hover:text-primary">{row.name}</Link> },
    { key: 'status', header: 'Status', render: (row) => <span className="capitalize">{row.status}</span> },
    { key: 'fileName', header: 'File' },
    { key: 'rowCount', header: 'Rows' },
    { key: 'columnCount', header: 'Columns' },
    { key: 'actions', header: 'Actions', render: (row) => <DeleteDatasetButton id={row.id} /> },
];

function DeleteDatasetButton({ id }: { id: string }) {
    const mutation = useDeleteDataset();
    return <button onClick={() => mutation.mutate(id)} className="inline-flex items-center gap-1 text-danger hover:opacity-80" disabled={mutation.isPending}><Trash2 className="w-4 h-4" />Delete</button>;
}

export function DatasetsPageClient() {
    const { data, isLoading, isError } = useDatasets();
    const createDataset = useCreateDataset();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const datasets = data?.data ?? [];

    const handleUploadComplete = (fileName: string) => {
        createDataset.mutate({
            name: fileName.replace(/\.[^.]+$/, '').replace(/[-_]/g, ' '),
            fileName,
            fileUrl: `/uploads/${fileName}`,
            status: 'processing',
            rowCount: 0,
            columnCount: 0,
            uploadedBy: 'user-1',
        });
    };

    return (
        <div className="animate-fade-in space-y-6">
            <PageHeader 
                title="Datasets" 
                description="Upload and manage your raw data for AI analysis." 
                actions={
                    <button 
                        onClick={() => setIsModalOpen(true)}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-semibold hover:bg-primary/90 transition-colors"
                    >
                        <Upload className="w-4 h-4" />
                        Upload Data
                    </button>
                } 
            />
            {isLoading ? <div className="min-h-[240px] flex items-center justify-center"><Loader2 className="w-6 h-6 animate-spin" /></div> : isError ? <div className="text-sm text-danger">Failed to load datasets.</div> : datasets.length === 0 ? <div className="min-h-[320px] border-2 border-dashed border-border rounded-2xl flex flex-col items-center justify-center text-center p-8 bg-muted/20"><div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4"><Database className="w-8 h-8 text-muted-foreground" /></div><h3 className="text-lg font-semibold mb-2">No Datasets Found</h3><p className="text-sm text-muted-foreground max-w-sm mb-4">Upload a file to create the first dataset in this mock session.</p><button onClick={() => setIsModalOpen(true)} className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium">Upload File</button></div> : <DataTable columns={columns} data={datasets} keyExtractor={(row) => row.id} />}
            <UploadDatasetModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        </div>
    );
}
