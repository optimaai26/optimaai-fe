'use client';

import { PageHeader } from '@/components/layout/PageHeader';
import { useCanvas } from '@/features/canvas/useCanvas';
import { CanvasCRUD } from '@/features/canvas/components/CanvasCRUD';
import { Loader2 } from 'lucide-react';

export function CanvasPageClient() {
    const { data, isLoading, isError } = useCanvas();
    const blocks = data?.data ?? [];

    return (
        <div className="animate-fade-in space-y-6">
            <PageHeader title="Strategy Canvas" description="Edit the business model canvas backed by the mock API layer." />
            {isLoading ? (
                <div className="min-h-[240px] flex items-center justify-center"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>
            ) : isError ? (
                <div className="text-sm text-danger flex items-center justify-center min-h-[240px]">Failed to load canvas blocks.</div>
            ) : (
                <CanvasCRUD blocks={blocks} />
            )}
        </div>
    );
}
