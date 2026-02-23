import { PageHeader } from '@/components/layout/PageHeader';
import { Layout, Save, Share2 } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Business Model Canvas' };

export default function CanvasPage() {
    return (
        <div className="animate-fade-in flex flex-col h-[calc(100vh-var(--topbar-height)-2rem)]">
            <PageHeader
                title="Business Model Canvas"
                description="Strategize and iterate on your business model blocks."
                actions={
                    <div className="flex gap-2">
                        <button className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-muted text-foreground text-sm font-medium hover:bg-muted/80 transition-colors">
                            <Share2 className="w-4 h-4" />
                            Share
                        </button>
                        <button className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg gradient-primary text-white text-sm font-medium hover:opacity-90 transition-opacity">
                            <Save className="w-4 h-4" />
                            Save Changes
                        </button>
                    </div>
                }
            />

            <div className="mt-8 flex-1 grid grid-cols-5 grid-rows-2 gap-px bg-border rounded-xl overflow-hidden border border-border">
                {/* 
                    TODO: Implement Interactive Business Model Canvas.
                    - Create individual block components (Key Partners, Value Prop, etc.).
                    - Implement item list with 'Add' and 'Delete' functionality.
                    - Use Zustand/Local state to manage block content.
                */}
                <div className="bg-background p-4 row-span-2 group relative overflow-hidden flex flex-col gap-4">
                    <h3 className="text-xs font-bold uppercase tracking-tighter text-muted-foreground flex items-center gap-1.5">
                        <Layout className="w-3.5 h-3.5" />
                        Key Partners
                    </h3>
                    <div className="flex-1 border-2 border-dashed border-muted rounded-lg flex items-center justify-center p-4">
                        <p className="text-[10px] text-muted-foreground text-center uppercase font-semibold">Ready for design</p>
                    </div>
                </div>

                {/* Repeat for other 8 segments... */}
                <div className="bg-background/50 p-4 col-span-4 row-span-2 flex items-center justify-center italic text-muted-foreground text-sm">
                    Remaining 8 canvas blocks to be implemented...
                </div>
            </div>
        </div>
    );
}
