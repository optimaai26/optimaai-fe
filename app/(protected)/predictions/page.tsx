import { PageHeader } from '@/components/layout/PageHeader';
import { TrendingUp, Sparkles, Filter } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Predictions' };

export default function PredictionsPage() {
    return (
        <div className="animate-fade-in">
            <PageHeader
                title="ML Predictions"
                description="Advanced forecasting and trend analysis powered by machine learning."
                actions={
                    <button className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-muted text-foreground text-sm font-medium hover:bg-muted/80 transition-colors">
                        <Filter className="w-4 h-4" />
                        Adjust Parameters
                    </button>
                }
            />

            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* 
                    TODO: Implement Prediction Cards and Charts.
                    - Use Recharts for data visualization (AreaChart or LineChart).
                    - Create prediction cards showing confidence scores.
                    - Implement 'What-if' scenario toggles.
                */}
                <div className="md:col-span-2 glass-card rounded-xl p-6 h-[400px] flex items-center justify-center border-dashed border-2">
                    <div className="text-center">
                        <TrendingUp className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                        <p className="text-muted-foreground">Select a dataset to begin forecasting...</p>
                    </div>
                </div>

                <div className="glass-card rounded-xl p-6 flex flex-col justify-between border-dashed border-2">
                    <div>
                        <div className="w-10 h-10 rounded-lg bg-primary-50 dark:bg-primary-900/20 flex items-center justify-center mb-4">
                            <Sparkles className="w-5 h-5 text-primary-500" />
                        </div>
                        <h3 className="font-semibold mb-2">AI Forecasting</h3>
                        <p className="text-sm text-muted-foreground">
                            Predict future revenue, customer churn, and market trends with precision.
                        </p>
                    </div>
                    <div className="h-4 w-full bg-muted rounded animate-pulse mt-6" />
                </div>
            </div>
        </div>
    );
}
