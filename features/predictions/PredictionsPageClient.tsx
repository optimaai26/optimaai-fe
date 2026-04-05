'use client';

import { PageHeader } from '@/components/layout/PageHeader';
import { useCreatePrediction, usePredictions } from '@/features/predictions/usePredictions';
import { Loader2, Play, TrendingUp } from 'lucide-react';

export function PredictionsPageClient() {
    const { data, isLoading, isError } = usePredictions();
    const createPrediction = useCreatePrediction();
    const predictions = data?.data ?? [];

    return (
        <div className="animate-fade-in space-y-6">
            <PageHeader title="AI Predictions" description="Forecast business outcomes using advanced ML models." actions={<button onClick={() => createPrediction.mutate({ datasetId: 'dataset-1', type: 'churn', status: 'queued' })} className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-semibold"><Play className="w-4 h-4 fill-current" />New Prediction</button>} />
            {isLoading ? <div className="min-h-[240px] flex items-center justify-center"><Loader2 className="w-6 h-6 animate-spin" /></div> : isError ? <div className="text-sm text-danger">Failed to load predictions.</div> : <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">{predictions.map((prediction) => <div key={prediction.id} className="glass-card rounded-2xl p-6 border border-border"><div className="flex items-start justify-between mb-4"><div><p className="text-xs uppercase tracking-wider text-muted-foreground">{prediction.type.replace('_', ' ')}</p><h3 className="font-semibold mt-1">{prediction.id}</h3></div><TrendingUp className="w-5 h-5 text-primary" /></div><p className="text-sm text-muted-foreground mb-2">Dataset: {prediction.datasetId}</p><p className="text-sm capitalize mb-2">Status: {prediction.status}</p><p className="text-sm text-muted-foreground">{prediction.result?.summary ?? 'Awaiting prediction results.'}</p></div>)}</div>}
        </div>
    );
}
