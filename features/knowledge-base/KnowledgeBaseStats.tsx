'use client';

/**
 * features/knowledge-base/KnowledgeBaseStats.tsx
 *
 * Compact card showing KB health — drop it on the Dashboard or Datasets page.
 *
 *   import { KnowledgeBaseStats } from '@/features/knowledge-base/KnowledgeBaseStats';
 *   <KnowledgeBaseStats />
 */

import { Database, Loader2, RefreshCw } from 'lucide-react';
import { useIngestKpis, useKbStats } from '@/features/knowledge-base/useKnowledgeBase';

export function KnowledgeBaseStats() {
    const { data, isLoading, isError } = useKbStats();
    const ingestKpis = useIngestKpis();

    return (
        <div className="glass-card rounded-2xl p-5 border border-border">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary/10 text-primary">
                        <Database className="w-5 h-5" />
                    </div>
                    <div>
                        <h3 className="font-semibold text-sm">Knowledge Base</h3>
                        <p className="text-xs text-muted-foreground">
                            What the AI can answer about
                        </p>
                    </div>
                </div>
                <button
                    type="button"
                    onClick={() => ingestKpis.mutate()}
                    disabled={ingestKpis.isPending}
                    className="text-xs px-3 py-1.5 rounded-lg border border-border hover:bg-muted flex items-center gap-1.5 disabled:opacity-50"
                    aria-label="Sync latest ML KPIs into knowledge base"
                >
                    {ingestKpis.isPending ? (
                        <Loader2 className="w-3 h-3 animate-spin" />
                    ) : (
                        <RefreshCw className="w-3 h-3" />
                    )}
                    Sync KPIs
                </button>
            </div>

            {isLoading ? (
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Loader2 className="w-3 h-3 animate-spin" /> Loading…
                </div>
            ) : isError || !data ? (
                <p className="text-xs text-danger">Failed to load KB stats.</p>
            ) : (
                <div className="grid grid-cols-3 gap-3 text-center">
                    <Stat label="Chunks" value={data.total_chunks} />
                    <Stat label="Sources" value={data.sources.length} />
                    <Stat label="Categories" value={data.categories.length} />
                </div>
            )}
        </div>
    );
}

function Stat({ label, value }: { label: string; value: number }) {
    return (
        <div className="rounded-lg bg-muted/40 py-3">
            <div className="text-lg font-bold">{value}</div>
            <div className="text-[11px] uppercase tracking-wide text-muted-foreground">
                {label}
            </div>
        </div>
    );
}
