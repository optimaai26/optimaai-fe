import { PageHeader } from '@/components/layout/PageHeader';
import { TrendingUp, AlertTriangle, DollarSign, Users, Play, BarChart3, Clock, CheckCircle2, brain, Sparkles, Filter } from 'lucide-react';
import type { Metadata } from 'next';
import PredictionChart from '@/components/data-display/PredictionChart';

export const metadata: Metadata = { title: 'AI Predictions' };

const predictionRuns = [
    {
        id: '1',
        type: 'Churn Prediction',
        dataset: 'Sales_Q4_Final.csv',
        status: 'completed',
        confidence: 94,
        impact: 'High',
        lastRun: '2h ago',
        icon: AlertTriangle,
        color: 'text-amber-500',
        bg: 'bg-amber-500/10',
    },
    {
        id: '2',
        type: 'Revenue Forecasting',
        dataset: 'Finance_2023.csv',
        status: 'completed',
        confidence: 89,
        impact: 'Critical',
        lastRun: '5h ago',
        icon: DollarSign,
        color: 'text-emerald-500',
        bg: 'bg-emerald-500/10',
    },
    {
        id: '3',
        type: 'CLV (Customer Lifetime Value)',
        dataset: 'Users_Master.csv',
        status: 'processing',
        confidence: 0,
        impact: 'Medium',
        lastRun: 'Running...',
        icon: Users,
        color: 'text-indigo-500',
        bg: 'bg-indigo-500/10',
    },
];

const forecastData = [
    { name: 'Jan', value: 4000, predicted: 4000 },
    { name: 'Feb', value: 3000, predicted: 3000 },
    { name: 'Mar', value: 2000, predicted: 2000 },
    { name: 'Apr', value: 2780, predicted: 2780 },
    { name: 'May', value: 1890, predicted: 1890 },
    { name: 'Jun', value: 2390, predicted: 2390 },
    { name: 'Jul', value: null, predicted: 3490 },
    { name: 'Aug', value: null, predicted: 4000 },
    { name: 'Sep', value: null, predicted: 4500 },
];

export default function PredictionsPage() {
    return (
        <div className="animate-fade-in space-y-6">
            <PageHeader
                title="AI Predictions"
                description="Harness ML models to forecast business outcomes and identify risks."
                actions={
                    <button className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-semibold hover:bg-primary/90 transition-all shadow-md active:scale-95">
                        <Play className="w-4 h-4 fill-current" />
                        Run New Prediction
                    </button>
                }
            />

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                {/* Prediction List */}
                <div className="xl:col-span-1 space-y-4">
                    <div className="flex items-center justify-between px-1">
                        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Active Models</h3>
                        <Filter className="w-4 h-4 text-muted-foreground cursor-pointer" />
                    </div>
                    {predictionRuns.map((run) => (
                        <div
                            key={run.id}
                            className={`glass-card p-4 rounded-xl cursor-pointer transition-all border-l-4 ${run.id === '1' ? 'border-primary ring-1 ring-primary/20' : 'border-transparent hover:border-border'}`}
                        >
                            <div className="flex items-start gap-4">
                                <div className={`p-2 rounded-lg ${run.bg} ${run.color}`}>
                                    <run.icon className="w-5 h-5" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between mb-1">
                                        <h4 className="font-semibold text-sm truncate">{run.type}</h4>
                                        {run.status === 'completed' ? (
                                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                                        ) : (
                                            <div className="w-3.5 h-3.5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                                        )}
                                    </div>
                                    <p className="text-xs text-muted-foreground mb-3">{run.dataset}</p>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-1.5">
                                            <Clock className="w-3 h-3 text-muted-foreground" />
                                            <span className="text-[10px] text-muted-foreground">{run.lastRun}</span>
                                        </div>
                                        {run.confidence > 0 && (
                                            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-primary/10 text-primary">
                                                {run.confidence}% CONFIDENCE
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Detailed Analysis */}
                <div className="xl:col-span-2 space-y-6">
                    <div className="glass-card rounded-2xl p-6 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4">
                            <Sparkles className="w-5 h-5 text-primary opacity-20 group-hover:opacity-100 transition-opacity" />
                        </div>
                        <div className="flex items-center gap-4 mb-8">
                            <div className="p-3 rounded-xl bg-primary/10 text-primary">
                                <TrendingUp className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold">Churn Prediction Model</h3>
                                <p className="text-sm text-muted-foreground">Analyzing risk patterns in Enterprise tier customers.</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                            {[
                                { label: 'Risk Accuracy', value: '94.2%', sub: 'Target: >90%', color: 'text-emerald-500' },
                                { label: 'Precision', value: '88.5%', sub: 'False pos: low', color: 'text-indigo-500' },
                                { label: 'Data Points', value: '1.2M', sub: 'Last 12 months', color: 'text-primary' },
                            ].map(metric => (
                                <div key={metric.label} className="p-4 rounded-xl bg-muted/30 border border-border/50">
                                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">{metric.label}</p>
                                    <p className={`text-2xl font-bold ${metric.color}`}>{metric.value}</p>
                                    <p className="text-[10px] text-muted-foreground mt-1">{metric.sub}</p>
                                </div>
                            ))}
                        </div>

                        <div className="h-80 w-full mb-6">
                            <PredictionChart data={forecastData} />
                        </div>

                        <div className="flex flex-col gap-4 p-4 rounded-xl bg-muted/50 border border-border">
                            <div className="flex items-center gap-2">
                                <BarChart3 className="w-4 h-4 text-primary" />
                                <span className="text-sm font-semibold">Top Risk Factors (AI Weighted)</span>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {[
                                    { factor: 'Support Ticket Volume', weight: 85 },
                                    { factor: 'Logins/Week Drop', weight: 72 },
                                    { factor: 'Feature Usage Intensity', weight: 64 },
                                    { factor: 'Contract Age', weight: 45 },
                                ].map(f => (
                                    <div key={f.factor} className="space-y-1.5">
                                        <div className="flex items-center justify-between text-[10px]">
                                            <span className="font-medium">{f.factor}</span>
                                            <span className="text-muted-foreground">{f.weight}%</span>
                                        </div>
                                        <div className="h-1.5 w-full bg-border rounded-full overflow-hidden">
                                            <div className="h-full bg-primary" style={{ width: `${f.weight}%` }} />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
