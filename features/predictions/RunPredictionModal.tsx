'use client';

import { useState } from 'react';
import { X, Loader2, Sparkles } from 'lucide-react';
import { useToast } from '@/components/ui/Toast';
import { useQueryClient } from '@tanstack/react-query';
import { useDatasets } from '@/features/datasets/useDatasets';
import { Select } from '@/components/ui/Select';

export function RunPredictionModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
    const [datasetId, setDatasetId] = useState('');
    const [modelType, setModelType] = useState('churn');
    const [description, setDescription] = useState('');
    
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { toast } = useToast();
    const queryClient = useQueryClient();
    const { data: datasetsRes } = useDatasets();
    const datasets = datasetsRes?.data ?? [];

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        // Simulate API post
        await new Promise(res => setTimeout(res, 1200));
        setIsSubmitting(false);

        toast({
            title: 'Prediction Queued',
            message: `Your prediction task has been queued and will begin processing shortly.`,
            type: 'success'
        });
        
        // Refresh predictions query
        queryClient.invalidateQueries({ queryKey: ['predictions'] });
        onClose();
    };

    const datasetOptions = [
        ...datasets.map(d => ({ value: d.id, label: d.name })),
        ...(datasets.length === 0 ? [{ value: 'sample_1', label: 'Sample Customer Data (Fallback)' }] : [])
    ];

    const modelOptions = [
        { value: 'churn', label: 'Customer Churn Risk' },
        { value: 'revenue', label: 'Revenue Forecasting' },
        { value: 'growth', label: 'Growth Trajectory Analysis' },
        { value: 'nlp', label: 'Sentiment & NLP Analysis' }
    ];

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-md animate-fade-in">
            <div className="bg-background/95 backdrop-blur-xl border border-border/50 rounded-2xl shadow-2xl ring-1 ring-white/10 w-full max-w-lg flex flex-col animate-slide-up">
                <div className="flex items-center justify-between p-4 border-b border-border/50 bg-muted/20">
                    <div className="flex items-center gap-2 text-foreground font-semibold">
                        <Sparkles className="w-5 h-5 text-primary-500" />
                        Run New Prediction
                    </div>
                    <button onClick={onClose} className="p-1 text-muted-foreground hover:text-foreground rounded-md hover:bg-muted transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>
                
                <form onSubmit={handleSubmit} className="p-6 space-y-5">
                    <div>
                        <label className="block text-sm font-medium text-foreground mb-1">Source Dataset</label>
                        <Select 
                            value={datasetId}
                            onChange={setDatasetId}
                            options={datasetOptions}
                            placeholder="Select a dataset..."
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-foreground mb-1">AI Model Type</label>
                        <Select 
                            value={modelType}
                            onChange={setModelType}
                            options={modelOptions}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-foreground mb-1">Description / Notes (Optional)</label>
                        <textarea 
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="What are you trying to identify?"
                            rows={3}
                            className="w-full bg-background/50 border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/50 resize-none custom-scrollbar transition-colors hover:border-border/80"
                        />
                    </div>

                    <div className="pt-4 flex justify-end gap-3 mt-2">
                        <button 
                            type="button" 
                            onClick={onClose}
                            className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                        >
                            Cancel
                        </button>
                        <button 
                            type="submit" 
                            disabled={isSubmitting || !datasetId}
                            className="px-5 py-2 text-sm font-semibold text-white bg-primary hover:bg-primary/90 rounded-lg shadow-sm hover:shadow-primary/20 transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Start Run'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
