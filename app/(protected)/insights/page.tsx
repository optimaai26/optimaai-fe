import { PageHeader } from '@/components/layout/PageHeader';
import { BrainCircuit, Sparkles, ArrowRight, Star, AlertCircle, TrendingUp } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'AI Insights' };

const insights = [
    {
        id: '1',
        title: 'High Churn Risk in Enterprise Segment',
        content: 'Enterprise customers with less than 3 logins/month show 4.2x higher churn probability. Consider implementing an automated engagement campaign targeting inactive enterprise accounts.',
        category: 'strategic',
        priority: 'critical',
        icon: AlertCircle,
    },
    {
        id: '2',
        title: 'Revenue Growth Opportunity in APAC',
        content: 'APAC region shows 23% higher conversion rates but only receives 12% of marketing spend. Reallocating 8% of budget could yield an estimated $45K/month incremental revenue.',
        category: 'financial',
        priority: 'high',
        icon: TrendingUp,
    },
    {
        id: '3',
        title: 'Product Feature Optimization',
        content: 'Users who engage with the export feature within their first week show 67% higher retention. Consider surfacing export capabilities in the onboarding flow.',
        category: 'operational',
        priority: 'medium',
        icon: Star,
    },
];

const priorityStyles: Record<string, string> = {
    critical: 'bg-danger/10 text-danger border-danger/20',
    high: 'bg-warning/10 text-warning border-warning/20',
    medium: 'bg-info/10 text-info border-info/20',
    low: 'bg-muted text-muted-foreground border-border',
};

const categoryLabels: Record<string, string> = {
    strategic: 'Strategic',
    financial: 'Financial',
    operational: 'Operational',
    growth: 'Growth',
};

export default function InsightsPage() {
    return (
        <div className="animate-fade-in">
            <PageHeader
                title="AI Insights"
                description="LLM-generated strategic recommendations based on your data."
                actions={
                    <button className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg gradient-primary text-white text-sm font-medium hover:opacity-90 transition-opacity">
                        <Sparkles className="w-4 h-4" />
                        Generate New Insights
                    </button>
                }
            />

            {/* Insight Cards */}
            <div className="grid gap-6">
                {insights.map((insight) => (
                    <div
                        key={insight.id}
                        className="glass-card rounded-xl p-6 hover:border-primary-400/20 transition-all duration-200 group"
                    >
                        <div className="flex items-start gap-4">
                            <div className="w-10 h-10 rounded-xl bg-primary-50 dark:bg-primary-900/30 flex items-center justify-center shrink-0">
                                <BrainCircuit className="w-5 h-5 text-primary-400" />
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2 flex-wrap">
                                    <h3 className="font-semibold">{insight.title}</h3>
                                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${priorityStyles[insight.priority]}`}>
                                        {insight.priority}
                                    </span>
                                    <span className="px-2 py-0.5 rounded-full text-xs bg-muted text-muted-foreground">
                                        {categoryLabels[insight.category]}
                                    </span>
                                </div>
                                <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                                    {insight.content}
                                </p>
                                <button className="inline-flex items-center gap-1.5 text-sm text-primary-400 hover:text-primary-300 font-medium transition-colors">
                                    View details
                                    <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
