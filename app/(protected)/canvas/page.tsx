'use client';

import { PageHeader } from '@/components/layout/PageHeader';
import { Lock } from 'lucide-react';

export default function CanvasPage() {
    return (
        <div className="animate-fade-in flex flex-col items-center justify-center min-h-[60vh] text-center p-8">
            <div className="w-20 h-20 rounded-3xl bg-muted flex items-center justify-center mb-6">
                <Lock className="w-10 h-10 text-muted-foreground/40" />
            </div>
            <h2 className="text-2xl font-bold mb-3">Strategy Canvas Hidden</h2>
            <p className="text-muted-foreground max-w-md leading-relaxed">
                The Business Model Canvas feature is currently locked while we finalize the underlying business logic and state persistence strategy.
            </p>
            <div className="mt-8 p-4 rounded-xl bg-primary/5 border border-primary/10">
                <p className="text-xs font-mono text-primary">
                    This route is disabled in `constants/navigation.ts` on the master branch.
                </p>
            </div>
        </div>
    );
}
