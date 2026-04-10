'use client';

import { X, TrendingUp, CheckCircle2, Clock, AlertCircle, BarChart3, Database } from 'lucide-react';
import type { Prediction } from '@/types';

export function PredictionDetailModal({ 
    prediction, 
    isOpen, 
    onClose 
}: { 
    prediction: Prediction | null; 
    isOpen: boolean; 
    onClose: () => void 
}) {
    if (!isOpen || !prediction) return null;

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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-md animate-fade-in">
            <div className="bg-background/95 backdrop-blur-xl border border-border/50 rounded-2xl shadow-2xl ring-1 ring-white/10 w-full max-w-3xl max-h-[85vh] flex flex-col animate-slide-up">
                <div className="flex items-start justify-between p-6 border-b border-border/50 bg-muted/20">
                    <div>
                        <div className="flex items-center gap-3 mb-3">
                            <div className={`px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wider border ${getStatusColor(prediction.status)} flex items-center gap-2 w-fit`}>
                                {getStatusIcon(prediction.status)}
                                {prediction.status}
                            </div>
                            <div className="flex items-center gap-1.5 px-2.5 py-1 bg-surface-100 dark:bg-surface-800 rounded-md text-xs font-mono text-muted-foreground border border-border/50">
                                <Database className="w-3 h-3" />
                                {prediction.datasetId}
                            </div>
                        </div>
                        <h2 className="text-xl font-bold text-foreground capitalize flex items-center gap-2">
                            {prediction.type.replace(/_/g, ' ')} Model Detail
                        </h2>
                    </div>
                    <button onClick={onClose} className="p-1.5 text-muted-foreground hover:text-foreground rounded-lg hover:bg-surface-200 dark:hover:bg-surface-700 transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>
                
                <div className="p-6 overflow-y-auto custom-scrollbar flex-1 space-y-6">
                    {prediction.status === 'completed' && prediction.result ? (
                        <>
                            <div className="glass-card p-5 rounded-xl border border-primary/20 bg-primary/5">
                                <h3 className="text-sm font-bold uppercase tracking-wider text-primary-500 mb-2 flex items-center gap-2">
                                    <SparkleIcon /> Executive Summary
                                </h3>
                                <p className="text-surface-700 dark:text-surface-200 leading-relaxed text-sm">
                                    {prediction.result.summary}
                                </p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="p-5 border border-border/50 rounded-xl bg-muted/10 flex flex-col justify-center">
                                    <span className="text-xs text-muted-foreground font-bold uppercase tracking-wider mb-3">Model Confidence</span>
                                    <div className="flex items-end gap-3">
                                        <span className="text-4xl font-extrabold text-foreground">
                                            {(prediction.result.confidence * 100).toFixed(1)}<span className="text-2xl text-muted-foreground">%</span>
                                        </span>
                                    </div>
                                    <div className="w-full h-2 bg-muted rounded-full overflow-hidden mt-4">
                                        <div 
                                            className="h-full bg-primary" 
                                            style={{ width: `${Math.min(100, Math.max(0, prediction.result.confidence * 100))}%` }}
                                        />
                                    </div>
                                </div>
                                
                                <div className="p-5 border border-border/50 rounded-xl bg-muted/10">
                                    <span className="text-xs text-muted-foreground font-bold uppercase tracking-wider mb-3 flex items-center gap-2">
                                        <BarChart3 className="w-4 h-4" /> Data Point Sample
                                    </span>
                                    <div className="bg-surface-900 rounded-lg p-3 overflow-x-auto custom-scrollbar">
                                        <pre className="text-xs font-mono text-surface-50">
                                            {JSON.stringify(prediction.result.data || { "status": "No structured data available" }, null, 2)}
                                        </pre>
                                    </div>
                                </div>
                            </div>
                        </>
                    ) : prediction.status === 'failed' ? (
                        <div className="flex flex-col items-center justify-center py-12 text-center border-2 border-dashed border-danger/30 rounded-xl bg-danger/5">
                            <AlertCircle className="w-10 h-10 text-danger mb-3" />
                            <h3 className="font-semibold text-lg text-foreground mb-1">Prediction Failed</h3>
                            <p className="text-sm text-muted-foreground max-w-md">The model encountered an error during execution. Please verify your dataset format and re-run the wizard.</p>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-12 text-center border-2 border-dashed border-border/50 rounded-xl bg-muted/5">
                            <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin mb-4" />
                            <h3 className="font-semibold text-lg text-foreground mb-1">Model is Processing...</h3>
                            <p className="text-sm text-muted-foreground max-w-md">This prediction is currently running on our distributed cluster. It may take a few minutes to complete.</p>
                        </div>
                    )}
                </div>

                <div className="p-4 border-t border-border/50 bg-muted/10 flex justify-end">
                    <button 
                        onClick={onClose}
                        className="px-6 py-2 text-sm font-semibold text-foreground bg-background hover:bg-surface-100 dark:hover:bg-surface-800 border border-border rounded-lg transition-all"
                    >
                        Close Details
                    </button>
                </div>
            </div>
        </div>
    );
}

function SparkleIcon() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>
    )
}
