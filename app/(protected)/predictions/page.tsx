import { PageHeader } from '@/components/layout/PageHeader';
import { TrendingUp, Play } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Predictions' };

export default function PredictionsPage() {
    return (
        <div className="animate-fade-in space-y-6">
            <PageHeader
                title="AI Predictions"
                description="Forecast business outcomes using advanced ML models."
                actions={
                    <button className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-semibold hover:bg-primary/90 transition-all">
                        <Play className="w-4 h-4 fill-current" />
                        New Prediction
                    </button>
                }
            />

            {/* 
              DESIGN CHALLENGE: 
              1. Design a custom "Model Status" card that shows the lifecycle of a prediction job.
              2. Implement professional data visualizations using Recharts (Line/Area charts).
              3. Design a "Confidence Gauge" UI to represent ML certainty.
            */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="glass-card min-h-[400px] rounded-2xl border border-dashed border-border flex items-center justify-center p-8">
                    <div className="text-center">
                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                            <TrendingUp className="w-6 h-6 text-primary" />
                        </div>
                        <h3 className="font-semibold mb-1 text-sm uppercase tracking-wider">Prediction Engine</h3>
                        <p className="text-xs text-muted-foreground mb-4">No active models running.</p>
                        <code className="text-[10px] text-primary bg-primary/5 px-2 py-1 rounded">
                            // TODO: Implement ML Visualization logic
                        </code>
                    </div>
                </div>

                <div className="glass-card min-h-[400px] rounded-2xl border border-dashed border-border flex items-center justify-center bg-muted/5">
                    <span className="text-xs text-muted-foreground font-mono italic">Secondary Analytics Component Workspace</span>
                </div>
            </div>
        </div>
    );
}
