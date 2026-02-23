import { PageHeader } from '@/components/layout/PageHeader';
import { Sparkles, ArrowRight, Lightbulb, Target, TrendingUp, Zap, ShieldCheck, RefreshCw, Layers } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'AI Strategy Insights' };

const insights = [
    {
        id: '1',
        title: 'Customer Retention Strategy',
        type: 'growth',
        confidence: 94,
        impact: 'High',
        difficulty: 'Medium',
        description: 'Implement a personalized onboarding flow for customers in the "Enterprise" tier who haven\'t logged in for 3 days.',
        action: 'Configure Onboarding Flow',
        icon: Target,
        color: 'text-indigo-500',
        bg: 'bg-indigo-500/10',
    },
    {
        id: '2',
        title: 'Revenue Maximization',
        type: 'revenue',
        confidence: 88,
        impact: 'Critical',
        difficulty: 'Easy',
        description: 'Apply dynamic pricing to the "API Access" add-on based on usage volume observed in the last 30 days.',
        action: 'Update Pricing Model',
        icon: TrendingUp,
        color: 'text-emerald-500',
        bg: 'bg-emerald-500/10',
    },
    {
        id: '3',
        title: 'Operational Efficiency',
        type: 'efficiency',
        confidence: 82,
        impact: 'Medium',
        difficulty: 'Hard',
        description: 'Consolidate redundant data pipelines identified in the "Sales_Q4" processing run to reduce latency by 15%.',
        action: 'Optimize Pipelines',
        icon: Zap,
        color: 'text-amber-500',
        bg: 'bg-amber-500/10',
    },
    {
        id: '4',
        title: 'Security Compliance',
        type: 'risk',
        confidence: 96,
        impact: 'Critical',
        difficulty: 'Easy',
        description: 'Auto-rotate API keys for service accounts that have been active for more than 90 days without rotation.',
        action: 'Enable Auto-Rotation',
        icon: ShieldCheck,
        color: 'text-rose-500',
        bg: 'bg-rose-500/10',
    },
];

export default function InsightsPage() {
    return (
        <div className="animate-fade-in space-y-8">
            <PageHeader
                title="AI Strategy Insights"
                description="LLM-powered strategic recommendations based on your business data and ML predictions."
                actions={
                    <button className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-semibold hover:bg-primary/90 transition-all shadow-md active:scale-95">
                        <RefreshCw className="w-4 h-4" />
                        Regenerate Insights
                    </button>
                }
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {insights.map((insight) => (
                    <div
                        key={insight.id}
                        className="glass-card rounded-2xl p-6 flex flex-col transition-all hover:scale-[1.02] hover:shadow-xl group"
                    >
                        <div className="flex items-start justify-between mb-6">
                            <div className="flex items-center gap-3">
                                <div className={`p-3 rounded-xl ${insight.bg} ${insight.color}`}>
                                    <insight.icon className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold group-hover:text-primary transition-colors">{insight.title}</h3>
                                    <div className="flex items-center gap-2 mt-1">
                                        <span className={`text-[10px] font-bold uppercase px-1.5 py-0.5 rounded ${insight.bg} ${insight.color}`}>
                                            {insight.type}
                                        </span>
                                        <span className="text-[10px] text-muted-foreground font-medium">
                                            {insight.confidence}% Confidence
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-col items-end">
                                <span className={`text-[10px] font-bold ${insight.impact === 'Critical' ? 'text-rose-500' : 'text-primary'}`}>
                                    IMPACT: {insight.impact}
                                </span>
                                <span className="text-[10px] text-muted-foreground">
                                    DIFFICULTY: {insight.difficulty}
                                </span>
                            </div>
                        </div>

                        <p className="text-sm text-muted-foreground leading-relaxed mb-8 flex-1">
                            {insight.description}
                        </p>

                        <div className="pt-6 border-t border-border flex items-center justify-between">
                            <div className="flex -space-x-2">
                                {[1, 2, 3].map(i => (
                                    <div key={i} className="w-6 h-6 rounded-full border-2 border-background bg-muted flex items-center justify-center text-[10px] font-bold">
                                        {i}
                                    </div>
                                ))}
                                <div className="w-6 h-6 rounded-full border-2 border-background bg-primary/10 text-primary flex items-center justify-center text-[10px] font-bold">
                                    +
                                </div>
                            </div>
                            <button className="inline-flex items-center gap-2 text-sm font-bold text-primary hover:underline group/btn transition-all">
                                {insight.action}
                                <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            <div className="glass-card rounded-2xl p-8 bg-primary/5 border-primary/20 relative overflow-hidden">
                <div className="absolute -right-12 -bottom-12 w-64 h-64 bg-primary/10 blur-3xl rounded-full" />
                <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
                    <div className="p-5 rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/20">
                        <Sparkles className="w-10 h-10" />
                    </div>
                    <div className="flex-1 text-center md:text-left">
                        <h3 className="text-2xl font-bold mb-2">Deep Infrastructure Audit Recommended</h3>
                        <p className="text-muted-foreground leading-relaxed max-w-2xl">
                            Our AI detected architectural patterns that match early-stage "Technical Debt" in the data ingress layer.
                            Specifically, the `useDatasets` hook is causing redundant re-renders in the Dashboard.
                        </p>
                    </div>
                    <button className="px-6 py-3 bg-foreground text-background rounded-xl font-bold hover:opacity-90 transition-all whitespace-nowrap">
                        View Audit Details
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { label: 'Total Insights', value: '24', icon: Lightbulb },
                    { label: 'Actions Taken', value: '18', icon: ShieldCheck },
                    { label: 'Value Generated', value: '$45.2k', icon: TrendingUp },
                ].map(stat => (
                    <div key={stat.label} className="glass-card p-6 rounded-2xl flex items-center gap-4">
                        <div className="p-3 rounded-xl bg-muted text-muted-foreground">
                            <stat.icon className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="text-xs font-semibold text-muted-foreground uppercase">{stat.label}</p>
                            <p className="text-xl font-bold">{stat.value}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
