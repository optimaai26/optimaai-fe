'use client';

import { useState } from 'react';
import { useOdooSync, useOdooStatus } from '@/features/odoo/useOdoo';
import type { OdooIncludeOption } from '@/types/odoo';
import {
    Download,
    Loader2,
    CheckCircle2,
    Inbox,
    XCircle,
    Sparkles,
} from 'lucide-react';

/**
 * OdooSyncPanel
 * -------------
 * Configures and triggers an extraction. Mirrors the OdooSyncRequest
 * Pydantic model on the backend so users have full control over what gets
 * pulled (incremental vs full, which categories, optional row cap, KB
 * ingestion).
 *
 * State semantics
 * ---------------
 * - `incremental` defaults to true → backend uses last_sync_at automatically.
 *   First-ever run with incremental=true falls through to a full pull on the
 *   server side, matching what most users expect.
 * - `limit` is optional; we render it as a free-text number for power users
 *   who want a smoke-test pull.
 */
export function OdooSyncPanel() {
    const { data: status } = useOdooStatus();
    const sync = useOdooSync();

    const [incremental, setIncremental] = useState(true);
    const [includeSales, setIncludeSales] = useState(true);
    const [includeInvoices, setIncludeInvoices] = useState(true);
    const [includeLeads, setIncludeLeads] = useState(true);
    const [ingestKb, setIngestKb] = useState(true);
    const [limitText, setLimitText] = useState<string>('');

    const isDisabled = !status?.configured || sync.isPending;

    const handleSync = () => {
        const include: OdooIncludeOption[] = [];
        if (includeSales) include.push('sales');
        if (includeInvoices) include.push('invoices');
        if (includeLeads) include.push('leads');

        const limit = limitText.trim()
            ? Math.max(1, Math.min(100_000, Number(limitText.trim())))
            : undefined;

        sync.mutate({
            incremental,
            include: include.length ? include : undefined,
            ingest_kb: ingestKb,
            limit: Number.isFinite(limit) ? limit : undefined,
        });
    };

    return (
        <div className="glass-card rounded-2xl p-6">
            <div className="flex items-start justify-between gap-4 mb-5">
                <div>
                    <h3 className="text-lg font-semibold mb-1">Run a sync</h3>
                    <p className="text-sm text-muted-foreground">
                        Pull records from Odoo, run them through the preprocessing
                        pipeline, and register them as a new dataset.
                    </p>
                </div>
                <button
                    type="button"
                    onClick={handleSync}
                    disabled={isDisabled}
                    aria-label="Start Odoo sync"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {sync.isPending ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                        <Download className="w-4 h-4" />
                    )}
                    {sync.isPending ? 'Syncing…' : 'Start sync'}
                </button>
            </div>

            {/* ── Mode ────────────────────────────────────────────── */}
            <div className="space-y-4">
                <div>
                    <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-2">
                        Mode
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                        <ModeChip
                            active={incremental}
                            onClick={() => setIncremental(true)}
                            title="Incremental"
                            subtitle="Only records modified since the last sync."
                        />
                        <ModeChip
                            active={!incremental}
                            onClick={() => setIncremental(false)}
                            title="Full"
                            subtitle="Re-pull everything. Heavier — use sparingly."
                        />
                    </div>
                </div>

                {/* ── Categories ─────────────────────────────────── */}
                <div>
                    <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-2">
                        Categories
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                        <Toggle
                            checked={includeSales}
                            onChange={setIncludeSales}
                            label="Sales orders"
                        />
                        <Toggle
                            checked={includeInvoices}
                            onChange={setIncludeInvoices}
                            label="Invoices"
                        />
                        <Toggle
                            checked={includeLeads}
                            onChange={setIncludeLeads}
                            label="CRM leads"
                        />
                    </div>
                </div>

                {/* ── Advanced ───────────────────────────────────── */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                        <label
                            htmlFor="odoo-sync-limit"
                            className="block text-[10px] uppercase tracking-wider text-muted-foreground mb-2"
                        >
                            Row limit (optional)
                        </label>
                        <input
                            id="odoo-sync-limit"
                            type="number"
                            min={1}
                            max={100_000}
                            value={limitText}
                            onChange={(e) => setLimitText(e.target.value)}
                            placeholder="No limit"
                            className="w-full bg-muted/20 border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary/50 focus:bg-background transition-colors"
                        />
                    </div>
                    <div>
                        <div className="block text-[10px] uppercase tracking-wider text-muted-foreground mb-2">
                            Knowledge base
                        </div>
                        <Toggle
                            checked={ingestKb}
                            onChange={setIngestKb}
                            label={
                                <span className="inline-flex items-center gap-1.5">
                                    <Sparkles className="w-3.5 h-3.5" />
                                    Ingest into RAG
                                </span>
                            }
                        />
                    </div>
                </div>
            </div>

            {/* ── Result ──────────────────────────────────────────── */}
            {sync.data && <SyncResult result={sync.data} />}

            {sync.isError && (
                <div
                    className="mt-5 rounded-xl border border-danger/30 bg-danger/5 p-4 flex items-start gap-3"
                    role="alert"
                >
                    <XCircle className="w-4 h-4 text-danger mt-0.5 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                        <div className="font-semibold text-danger mb-1">
                            Sync failed
                        </div>
                        <p className="text-sm text-muted-foreground break-words">
                            {extractError(sync.error)}
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}

/* ──────────────────────────────────────────────────────────
 * Result block
 * ────────────────────────────────────────────────────────── */

function SyncResult({ result }: { result: NonNullable<ReturnType<typeof useOdooSync>['data']> }) {
    if (result.status === 'queued') {
        return (
            <div
                className="mt-5 rounded-xl border border-primary/30 bg-primary/5 p-4 flex items-start gap-3"
                role="status"
            >
                <Loader2 className="w-4 h-4 text-primary mt-0.5 animate-spin flex-shrink-0" />
                <div className="flex-1 min-w-0">
                    <div className="font-semibold text-primary mb-1">
                        Sync queued
                    </div>
                    <p className="text-sm text-muted-foreground">
                        {result.message ??
                            'Running in the background. The history table will update when complete.'}
                    </p>
                </div>
            </div>
        );
    }

    if (result.status === 'empty') {
        return (
            <div
                className="mt-5 rounded-xl border border-warning/30 bg-warning/5 p-4 flex items-start gap-3"
                role="status"
            >
                <Inbox className="w-4 h-4 text-warning mt-0.5 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                    <div className="font-semibold text-warning mb-1">
                        No records
                    </div>
                    <p className="text-sm text-muted-foreground">
                        {result.message ??
                            'Odoo returned no records for these filters. Try a Full sync if this is your first run.'}
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div
            className="mt-5 rounded-xl border border-success/30 bg-success/5 p-4"
            role="status"
        >
            <div className="flex items-center gap-2 text-success font-semibold mb-3">
                <CheckCircle2 className="w-4 h-4" />
                Sync completed
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                <Stat
                    label="Rows"
                    value={(result.rows ?? 0).toLocaleString()}
                />
                <Stat
                    label="Columns"
                    value={(result.columns ?? 0).toLocaleString()}
                />
                <Stat
                    label="Quality before"
                    value={
                        result.quality_before != null
                            ? `${Math.round(result.quality_before)}%`
                            : '—'
                    }
                />
                <Stat
                    label="Quality after"
                    value={
                        result.quality_after != null
                            ? `${Math.round(result.quality_after)}%`
                            : '—'
                    }
                />
            </div>
            {result.file_name && (
                <p className="text-xs text-muted-foreground mt-3">
                    Saved as <code>{result.file_name}</code>
                    {result.upload_id && <> · upload #{result.upload_id}</>}
                </p>
            )}
        </div>
    );
}

/* ──────────────────────────────────────────────────────────
 * Tiny presentational helpers
 * ────────────────────────────────────────────────────────── */

function ModeChip({
    active,
    onClick,
    title,
    subtitle,
}: {
    active: boolean;
    onClick: () => void;
    title: string;
    subtitle: string;
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            aria-pressed={active}
            className={`text-left rounded-lg p-3 border transition-colors ${
                active
                    ? 'border-primary bg-primary/10'
                    : 'border-border bg-muted/20 hover:border-primary/40'
            }`}
        >
            <div
                className={`font-medium text-sm mb-0.5 ${
                    active ? 'text-primary' : 'text-foreground'
                }`}
            >
                {title}
            </div>
            <div className="text-xs text-muted-foreground">{subtitle}</div>
        </button>
    );
}

function Toggle({
    checked,
    onChange,
    label,
}: {
    checked: boolean;
    onChange: (v: boolean) => void;
    label: React.ReactNode;
}) {
    return (
        <label className="flex items-center gap-2 cursor-pointer rounded-lg bg-muted/20 px-3 py-2 hover:bg-muted/30 transition-colors">
            <input
                type="checkbox"
                checked={checked}
                onChange={(e) => onChange(e.target.checked)}
                className="w-4 h-4 accent-primary cursor-pointer"
            />
            <span className="text-sm">{label}</span>
        </label>
    );
}

function Stat({ label, value }: { label: string; value: string }) {
    return (
        <div className="rounded-lg bg-background/40 p-3">
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
                {label}
            </div>
            <div className="text-xl font-bold">{value}</div>
        </div>
    );
}

function extractError(err: unknown): string {
    if (!err) return 'Unknown error';
    if (typeof err === 'string') return err;
    if (err instanceof Error) {
        const body = (err as Error & { body?: { detail?: string } }).body;
        return body?.detail ?? err.message;
    }
    return 'Unknown error';
}
