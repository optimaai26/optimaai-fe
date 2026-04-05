'use client';

import { PageHeader } from '@/components/layout/PageHeader';
import { useInsights } from '@/features/insights/useInsights';
import { BrainCircuit, Lightbulb, Loader2 } from 'lucide-react';

export function InsightsPageClient() {
    const { data, isLoading, isError } = useInsights();
    const insights = data?.data ?? [];

    return (
        <div className="animate-fade-in space-y-6">
            <PageHeader title="AI Strategic Insights" description="LLM-powered recommendations derived from your data patterns." />
            {isLoading ? <div className="min-h-[240px] flex items-center justify-center"><Loader2 className="w-6 h-6 animate-spin" /></div> : isError ? <div className="text-sm text-danger">Failed to load insights.</div> : <><div className="grid grid-cols-1 md:grid-cols-2 gap-6">{insights.map((insight) => <div key={insight.id} className="glass-card rounded-2xl p-6 border border-border min-h-[220px]"><div className="flex items-start gap-4 mb-4"><div className="p-3 rounded-xl bg-primary/10 text-primary"><Lightbulb className="w-6 h-6" /></div><div className="flex-1"><h3 className="font-semibold">{insight.title}</h3><p className="text-sm text-muted-foreground mt-2">{insight.content}</p></div></div><div className="pt-4 border-t border-border mt-auto text-xs text-muted-foreground flex justify-between"><span className="capitalize">{insight.category}</span><span className="capitalize">{insight.priority}</span></div></div>)}</div><div className="glass-card p-8 rounded-2xl border border-dashed border-border bg-primary/5 flex items-center gap-6"><div className="p-4 rounded-full bg-primary/10 text-primary"><BrainCircuit className="w-8 h-8" /></div><div><h3 className="font-bold text-lg">Infrastructure Insights</h3><p className="text-sm text-muted-foreground mt-1">These cards are now driven by query data instead of hardcoded placeholders.</p></div></div></>}
        </div>
    );
}
