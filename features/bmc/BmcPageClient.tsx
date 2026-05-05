'use client';

/**
 * features/bmc/BmcPageClient.tsx
 *
 * Renders the Business Model Canvas as a classic Osterwalder grid:
 *
 *  ┌────────────┬────────────┬─────────────┬────────────┬────────────┐
 *  │ Key        │ Key        │ Value       │ Customer   │ Customer   │
 *  │ Partners   │ Activities │ Propositions│ Relations  │ Segments   │
 *  │            ├────────────┤             ├────────────┤            │
 *  │            │ Key        │             │ Channels   │            │
 *  │            │ Resources  │             │            │            │
 *  ├────────────┴────────────┴─────────────┴────────────┴────────────┤
 *  │     Cost Structure          │      Revenue Streams              │
 *  └─────────────────────────────┴───────────────────────────────────┘
 */

import { useState, type FormEvent } from 'react';
import {
    Activity,
    Database,
    DollarSign,
    Download,
    FileText,
    Handshake,
    Heart,
    Loader2,
    Package,
    Receipt,
    RefreshCw,
    Send,
    Sparkles,
    Users,
    type LucideIcon,
} from 'lucide-react';

import { PageHeader } from '@/components/layout/PageHeader';
import {
    getBmcDownloadUrl,
    useGenerateBmc,
    type BmcBlock,
    type BmcResponse,
    type EvidenceTag,
} from '@/features/bmc/useBmc';

const ICONS: Record<string, LucideIcon> = {
    Users,
    Sparkles,
    Send,
    Heart,
    DollarSign,
    Package,
    Activity,
    Handshake,
    Receipt,
};

const CONFIDENCE_STYLES: Record<BmcBlock['confidence'], string> = {
    high:   'text-emerald-700 bg-emerald-50 ring-emerald-200',
    medium: 'text-amber-700 bg-amber-50 ring-amber-200',
    low:    'text-rose-700 bg-rose-50 ring-rose-200',
};

export function BmcPageClient() {
    const [businessName, setBusinessName] = useState('Your Business');
    const [bmc, setBmc] = useState<BmcResponse | null>(null);
    const generate = useGenerateBmc();

    const onGenerate = async (e?: FormEvent) => {
        e?.preventDefault();
        try {
            const result = await generate.mutateAsync({ business_name: businessName });
            setBmc(result);
        } catch (err) {
            console.error('BMC generation failed', err);
        }
    };

    return (
        <div className="animate-fade-in space-y-6">
            <PageHeader
                title="Business Model Canvas"
                description="Auto-inferred from your uploaded data. Edit and regenerate anytime."
            />

            {/* Generation form */}
            <form
                onSubmit={onGenerate}
                className="glass-card rounded-2xl border border-border p-4 flex flex-wrap items-center gap-3"
            >
                <label
                    htmlFor="business-name"
                    className="text-sm font-medium shrink-0"
                >
                    Business name
                </label>
                <input
                    id="business-name"
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    className="flex-1 min-w-[200px] bg-background border border-border rounded-lg px-3 py-2 text-sm outline-none focus:border-primary"
                    placeholder="e.g. Egypt E-commerce"
                />
                <button
                    type="submit"
                    disabled={generate.isPending}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium disabled:opacity-50"
                >
                    {generate.isPending ? (
                        <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Generating…
                        </>
                    ) : bmc ? (
                        <>
                            <RefreshCw className="w-4 h-4" />
                            Regenerate
                        </>
                    ) : (
                        <>
                            <Sparkles className="w-4 h-4" />
                            Generate Canvas
                        </>
                    )}
                </button>

                {bmc?.bmc_id && bmc.files && (
                    <div className="flex gap-2 ml-auto">
                        <DownloadButton
                            url={getBmcDownloadUrl(bmc.bmc_id, 'pdf')}
                            label="PDF"
                        />
                        <DownloadButton
                            url={getBmcDownloadUrl(bmc.bmc_id, 'docx')}
                            label="Word"
                        />
                    </div>
                )}
            </form>

            {/* Loading state */}
            {generate.isPending && !bmc && (
                <div className="glass-card rounded-2xl border border-border p-8 text-center">
                    <Loader2 className="w-6 h-6 animate-spin text-primary mx-auto mb-3" />
                    <p className="font-medium">Building your Business Model Canvas…</p>
                    <p className="text-sm text-muted-foreground mt-1">
                        Analysing each block from your uploaded data — this usually
                        takes 60–90 seconds.
                    </p>
                </div>
            )}

            {/* Error state */}
            {generate.isError && (
                <div className="glass-card rounded-xl border border-danger/30 p-4 text-sm text-danger">
                    BMC generation failed: {generate.error?.message ?? 'Unknown error'}
                </div>
            )}

            {/* Empty / no-data state */}
            {bmc?.status === 'no_data' && <NoDataState message={bmc.message} />}

            {/* Successful BMC */}
            {bmc?.status === 'success' && <BmcCanvas bmc={bmc} />}
        </div>
    );
}

/* ============================================================== */
/*  Sub-components                                                 */
/* ============================================================== */

function NoDataState({ message }: { message?: string }) {
    return (
        <div className="glass-card rounded-2xl border border-border p-8 text-center space-y-3">
            <div className="inline-flex p-3 rounded-full bg-amber-100 text-amber-700">
                <Database className="w-6 h-6" />
            </div>
            <h3 className="font-semibold">No data to infer from yet</h3>
            <p className="text-sm text-muted-foreground max-w-md mx-auto">
                {message ??
                    'Upload at least one CSV through the Datasets page to generate a BMC describing your business.'}
            </p>
            <a
                href="/datasets"
                className="inline-block px-4 py-2 mt-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium"
            >
                Go to Datasets →
            </a>
        </div>
    );
}

function BmcCanvas({ bmc }: { bmc: BmcResponse }) {
    const byId = Object.fromEntries(bmc.blocks.map((b) => [b.id, b]));

    return (
        <div className="space-y-4">
            {/* Data scope banner */}
            <div className="glass-card rounded-xl border border-border p-3 text-xs text-muted-foreground flex items-center gap-3 flex-wrap">
                <span className="inline-flex items-center gap-1.5">
                    <Database className="w-3.5 h-3.5" />
                    Inferred from{' '}
                    <strong className="text-foreground">
                        {bmc.data_scope.sources.filter((s) => s !== 'latest_ml_results').length}
                    </strong>{' '}
                    customer source(s)
                </span>
                {bmc.data_scope.is_sparse && (
                    <span className="text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md">
                        ⚠ Sparse data — upload more files for richer canvas
                    </span>
                )}
                <span className="ml-auto">
                    Generated {new Date(bmc.generated_at).toLocaleString()}
                </span>
            </div>

            {/*
               Osterwalder canvas — CSS Grid with 5 columns and 3 rows.
               Block placement uses grid-column / grid-row spans to
               match the classic layout.
            */}
            <div className="grid grid-cols-5 gap-2 auto-rows-[minmax(220px,_auto)]">
                {/* Row 1+2 col 1 — Key Partners */}
                <Block block={byId['key_partners']} className="row-span-2" />
                {/* Row 1 col 2 — Key Activities */}
                <Block block={byId['key_activities']} />
                {/* Row 1+2 col 3 — Value Propositions */}
                <Block block={byId['value_propositions']} className="row-span-2" />
                {/* Row 1 col 4 — Customer Relationships */}
                <Block block={byId['customer_relationships']} />
                {/* Row 1+2 col 5 — Customer Segments */}
                <Block block={byId['customer_segments']} className="row-span-2" />
                {/* Row 2 col 2 — Key Resources */}
                <Block block={byId['key_resources']} />
                {/* Row 2 col 4 — Channels */}
                <Block block={byId['channels']} />
                {/* Row 3 cols 1-2 — Cost Structure */}
                <Block
                    block={byId['cost_structure']}
                    className="col-span-2"
                    accent="cost"
                />
                {/* Row 3 cols 3-5 — Revenue Streams */}
                <Block
                    block={byId['revenue_streams']}
                    className="col-span-3"
                    accent="revenue"
                />
            </div>

            {/* Confidence legend */}
            <div className="glass-card rounded-xl border border-border p-3 text-xs flex items-center gap-4 flex-wrap">
                <span className="font-medium text-muted-foreground">
                    Block confidence:
                </span>
                <ConfidenceLegend level="high" label="Strong data signal" />
                <ConfidenceLegend level="medium" label="Limited data" />
                <ConfidenceLegend level="low" label="Sparse / no relevant data" />
            </div>

            {/* Evidence-tag legend */}
            <div className="glass-card rounded-xl border border-border p-3 text-xs flex items-center gap-4 flex-wrap">
                <span className="font-medium text-muted-foreground">
                    Statement evidence:
                </span>
                <TagLegendItem tag="observed"   label="Direct fact from data" />
                <TagLegendItem tag="derived"    label="Computed / compared" />
                <TagLegendItem tag="inferred"   label="Interpretation, hedged" />
                <TagLegendItem tag="assumption" label="Not in data — flagged" />
            </div>
        </div>
    );
}

function Block({
    block,
    className = '',
    accent,
}: {
    block?: BmcBlock;
    className?: string;
    accent?: 'cost' | 'revenue';
}) {
    if (!block) return <div className={className} />;

    const Icon = ICONS[block.icon] ?? FileText;
    const confStyle = CONFIDENCE_STYLES[block.confidence];

    const accentBg = {
        cost: 'bg-rose-50/30 dark:bg-rose-950/20',
        revenue: 'bg-emerald-50/30 dark:bg-emerald-950/20',
        undefined: '',
    }[accent ?? 'undefined'];

    return (
        <div
            className={[
                'glass-card border border-border rounded-2xl p-4 flex flex-col gap-2',
                'transition hover:border-primary/40 hover:shadow-sm',
                accentBg,
                className,
            ].join(' ')}
        >
            <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0">
                    <div className="p-1.5 rounded-md bg-primary/10 text-primary shrink-0">
                        <Icon className="w-3.5 h-3.5" />
                    </div>
                    <h3 className="font-semibold text-sm truncate">{block.title}</h3>
                </div>
                <span
                    className={`text-[10px] uppercase tracking-wide px-1.5 py-0.5 rounded ring-1 ring-inset ${confStyle}`}
                >
                    {block.confidence}
                </span>
            </div>

            <ul className="space-y-1.5 text-xs leading-relaxed text-foreground/85 mt-1">
                {block.bullets.map((b, i) => (
                    <li key={i} className="flex gap-1.5">
                        <span className="text-primary shrink-0 mt-0.5">•</span>
                        <span>
                            {b.text}{' '}
                            <TagPill tag={b.tag} />
                        </span>
                    </li>
                ))}
            </ul>

            {block.data_used.length > 0 && (
                <div className="mt-auto pt-2 border-t border-border/50">
                    <p className="text-[10px] text-muted-foreground truncate">
                        From: {block.data_used.join(', ')}
                    </p>
                </div>
            )}
        </div>
    );
}

function ConfidenceLegend({
    level,
    label,
}: {
    level: BmcBlock['confidence'];
    label: string;
}) {
    return (
        <span className="inline-flex items-center gap-1.5">
            <span
                className={`inline-block w-2 h-2 rounded-full ${
                    level === 'high'
                        ? 'bg-emerald-500'
                        : level === 'medium'
                          ? 'bg-amber-500'
                          : 'bg-rose-500'
                }`}
            />
            <span className="text-muted-foreground">
                <strong className="capitalize text-foreground">{level}</strong>: {label}
            </span>
        </span>
    );
}

const TAG_STYLES: Record<EvidenceTag, string> = {
    observed:   'text-emerald-700 bg-emerald-50 ring-emerald-200',
    derived:    'text-blue-700 bg-blue-50 ring-blue-200',
    inferred:   'text-amber-700 bg-amber-50 ring-amber-200',
    assumption: 'text-rose-700 bg-rose-50 ring-rose-200',
};

const TAG_DOT: Record<EvidenceTag, string> = {
    observed:   'bg-emerald-500',
    derived:    'bg-blue-500',
    inferred:   'bg-amber-500',
    assumption: 'bg-rose-500',
};

function TagPill({ tag }: { tag: EvidenceTag }) {
    return (
        <span
            className={`inline-block text-[9px] uppercase tracking-wide font-medium px-1.5 py-0.5 rounded ring-1 ring-inset ${TAG_STYLES[tag]}`}
        >
            {tag}
        </span>
    );
}

function TagLegendItem({ tag, label }: { tag: EvidenceTag; label: string }) {
    return (
        <span className="inline-flex items-center gap-1.5">
            <span className={`inline-block w-2 h-2 rounded-full ${TAG_DOT[tag]}`} />
            <span className="text-muted-foreground">
                <strong className="capitalize text-foreground">{tag}</strong>: {label}
            </span>
        </span>
    );
}

function DownloadButton({ url, label }: { url: string; label: string }) {
    return (
        <a
            href={url}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-2 text-sm rounded-lg bg-primary text-primary-foreground hover:opacity-90"
        >
            <Download className="w-4 h-4" />
            {label}
        </a>
    );
}