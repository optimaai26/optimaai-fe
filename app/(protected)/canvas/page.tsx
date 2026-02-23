'use client';

import { PageHeader } from '@/components/layout/PageHeader';
import { Save, Download, Plus, Trash2, Edit3, GripVertical, Info } from 'lucide-react';

const mockCanvasData = {
    key_partners: [
        { id: '1', text: 'Cloud Hosting Providers' },
        { id: '2', text: 'Data Integration Partners' }
    ],
    key_activities: [
        { id: '3', text: 'AI Model Refinement' },
        { id: '4', text: 'Enterprise Sales Outbound' }
    ],
    value_propositions: [
        { id: '5', text: 'Real-time Predictive Analytics' },
        { id: '6', text: 'No-code ML Model Training' }
    ],
    customer_relationships: [
        { id: '7', text: 'Account Manager Support' },
        { id: '8', text: 'Active Community Forum' }
    ],
    customer_segments: [
        { id: '9', text: 'B2B SaaS Companies' },
        { id: '10', text: 'Growth Phase Series B+' }
    ],
    key_resources: [
        { id: '11', text: 'Proprietary ML Algorithms' },
        { id: '12', text: 'Dataset Intellectual Property' }
    ],
    channels: [
        { id: '13', text: 'Direct Sales Team' },
        { id: '14', text: 'Technical Blog / SEO' }
    ],
    cost_structure: [
        { id: '15', text: 'Compute & Storage Fees' },
        { id: '16', text: 'Senior Engineering Salary' }
    ],
    revenue_streams: [
        { id: '17', text: 'Tiered Subscription (SaaS)' },
        { id: '18', text: 'Consultancy Onboarding' }
    ],
};

export default function CanvasPage() {
    return (
        <div className="animate-fade-in space-y-6">
            <PageHeader
                title="Business Model Strategy"
                description="Iterate on your high-level strategy using the interactive Business Model Canvas editor."
                actions={
                    <div className="flex items-center gap-2">
                        <button className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-border text-xs font-medium hover:bg-muted transition-colors">
                            <Download className="w-3.5 h-3.5" />
                            Export PDF
                        </button>
                        <button className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-primary text-primary-foreground text-xs font-bold hover:bg-primary/90 transition-all shadow-md active:scale-95">
                            <Save className="w-3.5 h-3.5" />
                            Save Configuration
                        </button>
                    </div>
                }
            />

            {/* Selection/Metadata Bar */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-muted/30 border border-border">
                <div className="flex items-center gap-6">
                    <div className="flex flex-col">
                        <span className="text-[10px] text-muted-foreground uppercase font-semibold">Active Plan</span>
                        <span className="text-sm font-bold">Standard SaaS Roadmap v2.1</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-[10px] text-muted-foreground uppercase font-semibold">Last Modified</span>
                        <span className="text-sm font-medium">Oct 12, 2023 - 14:30</span>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-emerald-500 flex items-center gap-1 bg-emerald-500/10 px-2 py-1 rounded">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        Auto-saved
                    </span>
                </div>
            </div>

            {/* BMC Grid */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 min-h-[700px]">
                {/* Row 1 & 2 combined for tall columns */}
                <CanvasBlock section="Key Partners" items={mockCanvasData.key_partners} className="md:row-span-2" color="border-indigo-500/20" />

                <div className="flex flex-col gap-4 md:row-span-2">
                    <CanvasBlock section="Key Activities" items={mockCanvasData.key_activities} className="flex-1" color="border-amber-500/20" />
                    <CanvasBlock section="Key Resources" items={mockCanvasData.key_resources} className="flex-1" color="border-emerald-500/20" />
                </div>

                <CanvasBlock section="Value Propositions" items={mockCanvasData.value_propositions} className="md:row-span-2" color="border-sky-500/20" />

                <div className="flex flex-col gap-4 md:row-span-2">
                    <CanvasBlock section="Customer Relationships" items={mockCanvasData.customer_relationships} className="flex-1" color="border-rose-500/20" />
                    <CanvasBlock section="Channels" items={mockCanvasData.channels} className="flex-1" color="border-violet-500/20" />
                </div>

                <CanvasBlock section="Customer Segments" items={mockCanvasData.customer_segments} className="md:row-span-2" color="border-orange-500/20" />

                {/* Bottom Row - Cost & Revenue */}
                <CanvasBlock section="Cost Structure" items={mockCanvasData.cost_structure} className="md:col-span-2" color="border-slate-500/20" />
                <CanvasBlock section="Revenue Streams" items={mockCanvasData.revenue_streams} className="md:col-span-3" color="border-primary/20" />
            </div>
        </div>
    );
}

function CanvasBlock({ section, items, className, color }: { section: string; items: any[]; className?: string; color?: string }) {
    return (
        <div className={`glass-card rounded-2xl p-4 flex flex-col group transition-all border-b-4 hover:border-primary/40 ${color} ${className ?? ''}`}>
            <div className="flex items-center justify-between mb-4">
                <h4 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-1.5 border-b border-border pb-1 w-full">
                    {section}
                    <Info className="w-3 h-3 text-muted-foreground/50 hover:text-primary cursor-help" />
                </h4>
            </div>

            <div className="flex-1 space-y-2 relative">
                {items.map((item) => (
                    <div
                        key={item.id}
                        className="group/note relative bg-background/80 dark:bg-muted/50 p-3 rounded-lg border border-border/60 shadow-sm hover:shadow-md hover:ring-1 hover:ring-primary/20 transition-all cursor-grab active:cursor-grabbing"
                    >
                        <div className="absolute left-1.5 top-1/2 -translate-y-1/2 opacity-0 group-hover/note:opacity-100 transition-opacity">
                            <GripVertical className="w-3 h-3 text-muted-foreground/30" />
                        </div>
                        <p className="text-xs font-medium pl-3 pr-6 leading-relaxed">{item.text}</p>
                        <div className="absolute right-1.5 top-1.5 flex gap-1 opacity-0 group-hover/note:opacity-100 transition-opacity">
                            <button className="p-1 rounded bg-muted hover:bg-primary/10 hover:text-primary"><Edit3 className="w-2.5 h-2.5" /></button>
                            <button className="p-1 rounded bg-muted hover:bg-danger/10 hover:text-danger"><Trash2 className="w-2.5 h-2.5" /></button>
                        </div>
                    </div>
                ))}

                <button className="w-full mt-4 py-3 rounded-xl border-2 border-dashed border-border hover:border-primary/30 hover:bg-primary/5 transition-all group/add flex items-center justify-center gap-2">
                    <Plus className="w-4 h-4 text-muted-foreground group-hover/add:text-primary group-hover/add:scale-110 transition-all" />
                    <span className="text-xs font-semibold text-muted-foreground group-hover/add:text-primary">Add Strategy Note</span>
                </button>
            </div>
        </div>
    );
}
