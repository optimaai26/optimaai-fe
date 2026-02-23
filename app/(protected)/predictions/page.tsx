import { PageHeader } from '@/components/layout/PageHeader';
import { TrendingUp, AlertTriangle, DollarSign, Users, Play, BarChart3 } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Predictions' };

const predictions = [
    {
        id: '1',
        type: 'Churn Prediction',
        dataset: 'Q4 Sales Data',
        status: 'completed',
        confidence: 92,
        icon: AlertTriangle,
        color: 'text-warning',
        bg: 'bg-warning/10',
    },
    {
        id: '2',
        type: 'Revenue Forecast',
        dataset: 'Q4 Sales Data',
        status: 'completed',
        confidence: 87,
        icon: DollarSign,
        color: 'text-success',
        bg: 'bg-success/10',
    },
    {
        id: '3',
        type: 'Growth Scoring',
        dataset: 'Customer Segments',
        status: 'running',
        confidence: null,
        icon: TrendingUp,
        color: 'text-primary-400',
        bg: 'bg-primary-400/10',
    },
];

export default function PredictionsPage() {
    return (
        <div className="animate-fade-in">
            <PageHeader
                title="Predictions"
                description="ML-powered predictions: churn, revenue forecast, and growth scoring."
                actions={
                    <button className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg gradient-primary text-white text-sm font-medium hover:opacity-90 transition-opacity">
                        <Play className="w-4 h-4" />
                        New Prediction
                    </button>
                }
            />

            {/* Prediction Cards */}
            <div className="grid gap-6 mb-8">
                {predictions.map((pred) => (
                    <div key={pred.id} className="glass-card rounded-xl p-6 hover:border-primary-400/20 transition-all duration-200">
                        <div className="flex items-start gap-4">
                            <div className={`w-12 h-12 rounded-xl ${pred.bg} flex items-center justify-center shrink-0`}>
                                <pred.icon className={`w-6 h-6 ${pred.color}`} />
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center justify-between mb-2">
                                    <h3 className="font-semibold">{pred.type}</h3>
                                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${pred.status === 'completed' ? 'bg-success/10 text-success' :
                                            pred.status === 'running' ? 'bg-info/10 text-info' : 'bg-muted text-muted-foreground'
                                        }`}>
                                        {pred.status}
                                    </span>
                                </div>
                                <p className="text-sm text-muted-foreground mb-3">
                                    Dataset: {pred.dataset}
                                    {pred.confidence && ` • Confidence: ${pred.confidence}%`}
                                </p>

                                {pred.status === 'completed' && (
                                    <div className="h-40 flex items-center justify-center text-muted-foreground text-sm border border-dashed border-border rounded-lg">
                                        <BarChart3 className="w-5 h-5 mr-2" />
                                        Prediction result chart — connect to Recharts
                                    </div>
                                )}

                                {pred.status === 'running' && (
                                    <div className="flex items-center gap-2">
                                        <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                                            <div className="h-full w-2/3 gradient-primary rounded-full animate-pulse-subtle" />
                                        </div>
                                        <span className="text-xs text-muted-foreground">Processing...</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
