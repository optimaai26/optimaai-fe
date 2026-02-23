import { PageHeader } from '@/components/layout/PageHeader';
import { Lightbulb, ArrowRight, BrainCircuit } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'AI Insights' };

export default function InsightsPage() {
    return (
        <div className="animate-fade-in">
            <PageHeader
                title="Strategic Insights"
                description="LLM-powered analysis of your business performance and market positioning."
            />

            <div className="mt-8 grid grid-cols-1 lg:grid-cols-4 gap-6">
                <div className="lg:col-span-3 space-y-6">
                    {/* 
                        TODO: Implement Strategic Insight Cards.
                        - Fetch AI insights from the backend (mock for now).
                        - Use a 'Card' layout with categorized insights (Growth, Optimization, Risks).
                        - Add 'Copy to Clipboard' and 'Apply to Canvas' actions.
                    */}
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="glass-card rounded-xl p-6 border-dashed border-2">
                            <div className="flex gap-4">
                                <div className="w-10 h-10 shrink-0 rounded-full bg-warning/10 flex items-center justify-center">
                                    <Lightbulb className="w-5 h-5 text-warning" />
                                </div>
                                <div>
                                    <div className="h-4 w-48 bg-muted rounded animate-pulse mb-3" />
                                    <div className="space-y-2">
                                        <div className="h-3 w-full bg-muted rounded animate-pulse" />
                                        <div className="h-3 w-3/4 bg-muted rounded animate-pulse" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="space-y-6">
                    <div className="glass-card rounded-xl p-6 bg-primary-500 text-white border-0 shadow-lg shadow-primary-500/20">
                        <BrainCircuit className="w-8 h-8 mb-4" />
                        <h3 className="text-lg font-bold mb-2">AI Consultant</h3>
                        <p className="text-primary-50 text-sm mb-4">
                            Ask specific questions about your business data and get instant strategic advice.
                        </p>
                        <button className="w-full py-2 bg-white/20 hover:bg-white/30 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2">
                            Open Chat <ArrowRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
