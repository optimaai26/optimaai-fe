'use client';

import { PageHeader } from '@/components/layout/PageHeader';
import { Save, Download, Plus } from 'lucide-react';
import type { Metadata } from 'next';

const canvasSections = [
    { key: 'key_partners', label: 'Key Partners', span: 'row-span-2' },
    { key: 'key_activities', label: 'Key Activities', span: '' },
    { key: 'value_propositions', label: 'Value Propositions', span: 'row-span-2' },
    { key: 'customer_relationships', label: 'Customer Relationships', span: '' },
    { key: 'customer_segments', label: 'Customer Segments', span: 'row-span-2' },
    { key: 'key_resources', label: 'Key Resources', span: '' },
    { key: 'channels', label: 'Channels', span: '' },
    { key: 'cost_structure', label: 'Cost Structure', span: '' },
    { key: 'revenue_streams', label: 'Revenue Streams', span: '' },
];

export default function CanvasPage() {
    return (
        <div className="animate-fade-in">
            <PageHeader
                title="Business Model Canvas"
                description="Interactive canvas editor for your business strategy."
                actions={
                    <div className="flex items-center gap-2">
                        <button className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-border text-sm hover:bg-muted transition-colors">
                            <Download className="w-4 h-4" />
                            Export
                        </button>
                        <button className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg gradient-primary text-white text-sm font-medium hover:opacity-90 transition-opacity">
                            <Save className="w-4 h-4" />
                            Save Canvas
                        </button>
                    </div>
                }
            />

            {/* BMC Grid */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-3 min-h-[600px]">
                {/* Row 1 */}
                <CanvasBlock section="Key Partners" className="md:row-span-2" />
                <div className="flex flex-col gap-3">
                    <CanvasBlock section="Key Activities" />
                    <CanvasBlock section="Key Resources" />
                </div>
                <CanvasBlock section="Value Propositions" className="md:row-span-2" />
                <div className="flex flex-col gap-3">
                    <CanvasBlock section="Customer Relationships" />
                    <CanvasBlock section="Channels" />
                </div>
                <CanvasBlock section="Customer Segments" className="md:row-span-2" />

                {/* Row 3 - Cost & Revenue span full bottom */}
                <div className="md:col-span-2">
                    <CanvasBlock section="Cost Structure" className="h-full" />
                </div>
                <div className="md:col-span-3">
                    <CanvasBlock section="Revenue Streams" className="h-full" />
                </div>
            </div>
        </div>
    );
}

function CanvasBlock({ section, className }: { section: string; className?: string }) {
    return (
        <div className={`glass-card rounded-xl p-4 flex flex-col min-h-[140px] group hover:border-primary-400/20 transition-all ${className ?? ''}`}>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                {section}
            </h4>
            <div className="flex-1 space-y-2">
                <div className="text-sm text-muted-foreground italic">Click to add items...</div>
            </div>
            <button className="mt-2 self-start inline-flex items-center gap-1 text-xs text-primary-400 hover:text-primary-300 opacity-0 group-hover:opacity-100 transition-all">
                <Plus className="w-3 h-3" />
                Add
            </button>
        </div>
    );
}
