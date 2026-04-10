'use client';

import { useState, useRef } from 'react';
import { X, Loader2, UploadCloud, FileSpreadsheet, FolderUp } from 'lucide-react';
import { useToast } from '@/components/ui/Toast';
import { useQueryClient } from '@tanstack/react-query';

export function UploadDatasetModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const [file, setFile] = useState<File | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    
    const { toast } = useToast();
    const queryClient = useQueryClient();

    if (!isOpen) return null;

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        const droppedFile = e.dataTransfer.files[0];
        if (droppedFile) {
            setFile(droppedFile);
            if (!name) {
                // Auto-fill name if empty
                setName(droppedFile.name.replace(/\.[^/.]+$/, ""));
            }
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
            setFile(selectedFile);
            if (!name) {
                // Auto-fill name if empty
                setName(selectedFile.name.replace(/\.[^/.]+$/, ""));
            }
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        // Simulate API post and file upload
        await new Promise(res => setTimeout(res, 1500));
        setIsSubmitting(false);

        toast({
            title: 'Upload Successful',
            message: `Dataset "${name}" was uploaded and is now processing.`,
            type: 'success'
        });
        
        // Refresh datasets query
        queryClient.invalidateQueries({ queryKey: ['datasets'] });
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-md animate-fade-in">
            <div className="bg-background/95 backdrop-blur-xl border border-border/50 rounded-2xl shadow-2xl ring-1 ring-white/10 w-full max-w-lg flex flex-col animate-slide-up">
                <div className="flex items-center justify-between p-4 border-b border-border/50 bg-muted/20">
                    <div className="flex items-center gap-2 text-foreground font-semibold">
                        <FolderUp className="w-5 h-5 text-primary-500" />
                        Upload Data Source
                    </div>
                    <button onClick={onClose} className="p-1 text-muted-foreground hover:text-foreground rounded-md hover:bg-muted transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>
                
                <form onSubmit={handleSubmit} className="p-6 space-y-5">
                    
                    {!file ? (
                        <div 
                            className={`border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center text-center transition-colors cursor-pointer ${isDragging ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50 hover:bg-muted/50'}`}
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onDrop={handleDrop}
                            onClick={() => fileInputRef.current?.click()}
                        >
                            <input 
                                type="file" 
                                className="hidden" 
                                ref={fileInputRef} 
                                onChange={handleFileChange}
                                accept=".csv,.xlsx,.xls,.json"
                            />
                            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                                <UploadCloud className="w-6 h-6 text-primary" />
                            </div>
                            <h4 className="font-medium text-foreground mb-1">Click or drag file to this area to upload</h4>
                            <p className="text-xs text-muted-foreground max-w-[260px]">Support for a single or bulk upload. Strictly prohibit from uploading company data or other band files.</p>
                        </div>
                    ) : (
                        <div className="border border-primary/30 bg-primary/5 rounded-xl p-4 flex items-center gap-4">
                            <div className="p-3 bg-background rounded-lg border border-border shadow-sm">
                                <FileSpreadsheet className="w-6 h-6 text-primary" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="font-medium text-sm text-foreground truncate">{file.name}</p>
                                <p className="text-xs text-muted-foreground">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                            </div>
                            <button 
                                type="button"
                                onClick={() => setFile(null)}
                                className="p-2 hover:bg-background rounded-md text-muted-foreground hover:text-danger transition-colors cursor-pointer"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    )}

                    <div className="space-y-5 pt-2 border-t border-border/50">
                        <div>
                            <label className="block text-sm font-medium text-foreground mb-1">Dataset Name</label>
                            <input 
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="e.g. Q4 Financials 2023"
                                required
                                className="w-full bg-background/50 border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/50 transition-colors hover:border-border/80"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-foreground mb-1">Description (Optional)</label>
                            <textarea 
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Add context about this dataset..."
                                rows={2}
                                className="w-full bg-background/50 border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/50 resize-none custom-scrollbar transition-colors hover:border-border/80"
                            />
                        </div>
                    </div>

                    <div className="pt-2 flex justify-end gap-3 mt-2">
                        <button 
                            type="button" 
                            onClick={onClose}
                            className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                        >
                            Cancel
                        </button>
                        <button 
                            type="submit" 
                            disabled={isSubmitting || !file || !name.trim()}
                            className="px-5 py-2 text-sm font-semibold text-white bg-primary hover:bg-primary/90 rounded-lg shadow-sm hover:shadow-primary/20 transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Upload Dataset'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
