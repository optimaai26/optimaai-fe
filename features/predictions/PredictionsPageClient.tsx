'use client';

import { PageHeader } from '@/components/layout/PageHeader';
import { usePredictions } from '@/features/predictions/usePredictions';
import { Loader2, Play, TrendingUp, Sparkles, CheckCircle2, Clock, AlertCircle } from 'lucide-react';
import { useState } from 'react';
import { RunPredictionModal } from '@/features/predictions/RunPredictionModal';
import { PredictionDetailModal } from '@/features/predictions/PredictionDetailModal';
import type { Prediction } from '@/types';

export function PredictionsPageClient() {
    const { data, isLoading, isError } = usePredictions();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedPrediction, setSelectedPrediction] = useState<Prediction | null>(null);
    const predictions = data?.data ?? [];

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'completed': return <CheckCircle2 className="w-4 h-4 text-success" />;
            case 'failed': return <AlertCircle className="w-4 h-4 text-danger" />;
            default: return <Clock className="w-4 h-4 text-warning" />;
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'completed': return 'bg-success/10 text-success border-success/20';
            case 'failed': return 'bg-danger/10 text-danger border-danger/20';
            default: return 'bg-warning/10 text-warning border-warning/20';
        }
    };

    return (
        <div className="animate-fade-in space-y-6">
            <PageHeader 
                title="AI Predictions" 
                description="Forecast business outcomes using advanced ML models." 
                actions={
                    <button 
                        onClick={() => setIsModalOpen(true)} 
                        className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-semibold"
                    >
                        <Sparkles className="w-4 h-4" />
                        Run Wizard
                    </button>
                } 
            />
            
            {isLoading ? (
                <div className="min-h-[240px] flex items-center justify-center"><Loader2 className="w-6 h-6 animate-spin" /></div>
            ) : isError ? (
                <div className="text-sm text-danger flex items-center justify-center min-h-[240px]">Failed to load predictions.</div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {predictions.map((prediction) => (
                        <div 
                            key={prediction.id} 
                            onClick={() => setSelectedPrediction(prediction)}
                            className="glass-card rounded-2xl p-6 border border-border group hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5 transition-all flex flex-col h-full cursor-pointer"
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div>
                                    <div className="flex items-center gap-2 mb-2">
                                        <div className={`px-2 py-0.5 rounded text-xs font-semibold capitalize border ${getStatusColor(prediction.status)} flex items-center gap-1.5 w-fit`}>
                                            {getStatusIcon(prediction.status)}
                                            {prediction.status}
                                        </div>
                                        <div className="px-2 py-0.5 bg-muted rounded text-xs font-mono text-muted-foreground border border-border/50">
                                            Dataset: {prediction.datasetId}
                                        </div>
                                    </div>
                                    <h3 className="font-semibold text-lg text-foreground group-hover:text-primary transition-colors capitalize">{prediction.type.replace('_', ' ')} Model</h3>
                                </div>
                                <div className="p-2 bg-primary/10 rounded-lg">
                                    <TrendingUp className="w-5 h-5 text-primary" />
                                </div>
                            </div>
                            
                            <div className="flex-1">
                                <p className="text-sm text-muted-foreground pr-4 line-clamp-3 leading-relaxed">
                                    {prediction.result?.summary ?? 'This model is currently processing data. Results will be available shortly after completion.'}
                                </p>
                            </div>

                            {prediction.result?.confidence !== undefined && (
                                <div className="mt-6 pt-4 border-t border-border flex items-center justify-between">
                                    <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Confidence Score</span>
                                    <div className="flex items-center gap-2">
                                        <span className="font-semibold text-sm">{(prediction.result.confidence * 100).toFixed(1)}%</span>
                                        <div className="w-16 h-1.5 bg-muted rounded-full overflow-hidden">
                                            <div 
                                                className="h-full bg-primary" 
                                                style={{ width: `${Math.min(100, Math.max(0, prediction.result.confidence * 100))}%` }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                    {predictions.length === 0 && (
                        <div className="col-span-full min-h-[160px] flex flex-col items-center justify-center border-2 border-dashed border-border rounded-2xl text-muted-foreground">
                            <Sparkles className="w-8 h-8 mb-2 opacity-50" />
                            <p className="text-sm font-medium">No predictions have been run yet.</p>
                            <p className="text-xs mt-1">Start by running the new prediction wizard.</p>
                        </div>
                    )}
                </div>
            )}
            <RunPredictionModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
            <PredictionDetailModal 
                isOpen={!!selectedPrediction} 
                prediction={selectedPrediction} 
                onClose={() => setSelectedPrediction(null)} 
            />
        </div>
    );
}
