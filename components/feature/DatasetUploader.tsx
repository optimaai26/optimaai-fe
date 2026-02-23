'use client';

import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { cn } from '@/lib/utils/cn';
import { Upload, FileText, X, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

type UploadStatus = 'idle' | 'uploading' | 'processing' | 'success' | 'error';

interface DatasetUploaderProps {
    onUploadComplete?: (fileName: string) => void;
    className?: string;
}

export function DatasetUploader({ onUploadComplete, className }: DatasetUploaderProps) {
    const [file, setFile] = useState<File | null>(null);
    const [status, setStatus] = useState<UploadStatus>('idle');
    const [progress, setProgress] = useState(0);

    const onDrop = useCallback((acceptedFiles: File[]) => {
        const f = acceptedFiles[0];
        if (!f) return;
        setFile(f);
        setStatus('uploading');

        // Simulate upload progress
        let prog = 0;
        const interval = setInterval(() => {
            prog += Math.random() * 20;
            if (prog >= 100) {
                prog = 100;
                clearInterval(interval);
                setProgress(100);
                setStatus('processing');
                // Simulate processing
                setTimeout(() => {
                    setStatus('success');
                    onUploadComplete?.(f.name);
                }, 2000);
            } else {
                setProgress(Math.round(prog));
            }
        }, 300);
    }, [onUploadComplete]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'text/csv': ['.csv'],
            'application/vnd.ms-excel': ['.xls'],
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
        },
        maxFiles: 1,
        maxSize: 16 * 1024 * 1024, // 16MB
        disabled: status === 'uploading' || status === 'processing',
    });

    const reset = () => {
        setFile(null);
        setStatus('idle');
        setProgress(0);
    };

    const statusIcon = {
        idle: null,
        uploading: <Loader2 className="w-5 h-5 animate-spin text-primary-400" />,
        processing: <Loader2 className="w-5 h-5 animate-spin text-warning" />,
        success: <CheckCircle2 className="w-5 h-5 text-success" />,
        error: <AlertCircle className="w-5 h-5 text-danger" />,
    };

    return (
        <div className={cn('space-y-4', className)}>
            <div
                {...getRootProps()}
                className={cn(
                    'relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-200',
                    isDragActive
                        ? 'border-primary-400 bg-primary-50/50 dark:bg-primary-900/20'
                        : 'border-border hover:border-primary-400/50 hover:bg-muted/50',
                    (status === 'uploading' || status === 'processing') && 'pointer-events-none opacity-70',
                )}
            >
                <input {...getInputProps()} />
                <Upload className="w-10 h-10 mx-auto mb-3 text-muted-foreground" />
                <p className="text-sm font-medium mb-1">
                    {isDragActive ? 'Drop your file here' : 'Drag & drop your CSV file here'}
                </p>
                <p className="text-xs text-muted-foreground">
                    or click to browse • CSV, XLS, XLSX up to 16MB
                </p>
            </div>

            {/* Upload Progress */}
            {file && status !== 'idle' && (
                <div className="glass-card rounded-xl p-4">
                    <div className="flex items-center gap-3">
                        <FileText className="w-8 h-8 text-primary-400 shrink-0" />
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                                <p className="text-sm font-medium truncate">{file.name}</p>
                                <div className="flex items-center gap-2">
                                    {statusIcon[status]}
                                    {status !== 'uploading' && status !== 'processing' && (
                                        <button onClick={reset} className="p-1 hover:bg-muted rounded-md transition-colors">
                                            <X className="w-4 h-4 text-muted-foreground" />
                                        </button>
                                    )}
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                                    <div
                                        className={cn(
                                            'h-full rounded-full transition-all duration-300',
                                            status === 'success' ? 'bg-success' : status === 'error' ? 'bg-danger' : 'gradient-primary',
                                        )}
                                        style={{ width: `${progress}%` }}
                                    />
                                </div>
                                <span className="text-xs text-muted-foreground w-10 text-right">
                                    {status === 'processing' ? 'AI...' : status === 'success' ? 'Done' : `${progress}%`}
                                </span>
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">
                                {status === 'uploading' && 'Uploading...'}
                                {status === 'processing' && 'Cleaning & processing data...'}
                                {status === 'success' && 'Upload complete! Dataset is ready.'}
                                {status === 'error' && 'Upload failed. Please try again.'}
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
