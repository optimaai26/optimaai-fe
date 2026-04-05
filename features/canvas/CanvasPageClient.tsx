'use client';

import { PageHeader } from '@/components/layout/PageHeader';
import { useCanvas, useUpdateCanvasBlock } from '@/features/canvas/useCanvas';
import { Loader2, Save } from 'lucide-react';
import { useState } from 'react';

export function CanvasPageClient() {
    const { data, isLoading, isError } = useCanvas();
    const updateBlock = useUpdateCanvasBlock();
    const [drafts, setDrafts] = useState<Record<string, string>>({});
    const blocks = data?.data ?? [];

    return (
        <div className="animate-fade-in space-y-6">
            <PageHeader title="Strategy Canvas" description="Edit the business model canvas backed by the mock API layer." />
            {isLoading ? <div className="min-h-[240px] flex items-center justify-center"><Loader2 className="w-6 h-6 animate-spin" /></div> : isError ? <div className="text-sm text-danger">Failed to load canvas blocks.</div> : <div className="grid grid-cols-1 md:grid-cols-2 gap-6">{blocks.map((block) => <div key={block.id} className="glass-card rounded-2xl p-5 space-y-3"><div className="flex items-center justify-between"><h3 className="font-semibold capitalize">{block.section.replace(/_/g, ' ')}</h3><button onClick={() => updateBlock.mutate({ id: block.id, content: drafts[block.id] ?? block.content })} className="inline-flex items-center gap-1 text-primary text-sm"><Save className="w-4 h-4" />Save</button></div><textarea value={drafts[block.id] ?? block.content} onChange={(event) => setDrafts((current) => ({ ...current, [block.id]: event.target.value }))} className="w-full min-h-32 rounded-xl border border-border bg-background px-3 py-2 text-sm" /></div>)}</div>}
        </div>
    );
}
