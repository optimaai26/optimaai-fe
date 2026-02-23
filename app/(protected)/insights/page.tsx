import { PageHeader } from '@/components/layout/PageHeader';
import { BrainCircuit, Lightbulb } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Insights' };

export default function InsightsPage() {
    return (
        <div className="animate-fade-in space-y-6">
            <PageHeader
                title="AI Strategic Insights"
                description="LLM-powered recommendations derived from your data patterns."
            />

            {/* 
              DESIGN CHALLENGE: 
              1. Design high-fidelity "Strategy Cards" for AI recommendations.
              2. Implement an interactive ranking system for recommendation "Impact" vs "Difficulty".
              3. Design a "Regenerate" flow with professional loading states.
            */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="glass-card rounded-2xl p-6 border-2 border-dashed border-border min-h-[220px] transition-all hover:bg-muted/10 group">
                        <div className="flex items-start gap-4 mb-4">
                            <div className="p-3 rounded-xl bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                                <Lightbulb className="w-6 h-6" />
                            </div>
                            <div className="flex-1 space-y-2">
                                <div className="h-4 w-32 bg-muted rounded animate-pulse" />
                                <div className="h-3 w-48 bg-muted rounded animate-pulse" />
                            </div>
                        </div>
                        <div className="pt-4 border-t border-border mt-auto">
                            <code className="text-[10px] text-primary bg-primary/5 px-2 py-1 rounded">
                                // TODO: Design the Recommendation UI
                            </code>
                        </div>
                    </div>
                ))}
            </div>

            <div className="glass-card p-8 rounded-2xl border border-dashed border-border bg-primary/5 flex items-center gap-6">
                <div className="p-4 rounded-full bg-primary/10 text-primary">
                    <BrainCircuit className="w-8 h-8" />
                </div>
                <div>
                    <h3 className="font-bold text-lg">Infrastructure Insights</h3>
                    <p className="text-sm text-muted-foreground mt-1 font-mono">
                        // Feature track: Build a deep-audit visualization for current data patterns here.
                    </p>
                </div>
            </div>
        </div>
    );
}
