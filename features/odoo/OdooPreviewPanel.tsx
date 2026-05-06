'use client';

import { useState } from 'react';
import { useOdooPreview } from '@/features/odoo/useOdoo';
import type { OdooModel } from '@/types/odoo';
import { Eye, Loader2, RefreshCw } from 'lucide-react';

const MODELS: { value: OdooModel; label: string }[] = [
    { value: 'sale.order', label: 'Sales orders' },
    { value: 'account.move', label: 'Invoices' },
    { value: 'crm.lead', label: 'CRM leads' },
    { value: 'res.partner', label: 'Customers' },
];

/**
 * OdooPreviewPanel
 * ----------------
 * Tabbed sample viewer. Calls /api/v1/odoo/preview lazily — only the active
 * tab is fetched, and only when the user clicks "Load preview" so we don't
 * hammer Odoo on every page mount.
 */
export function OdooPreviewPanel() {
    const [model, setModel] = useState<OdooModel>('sale.order');
    const [enabled, setEnabled] = useState(false);
    const limit = 10;

    const preview = useOdooPreview(model, limit, enabled);

    // Switching tabs after loading triggers a refetch via the new query key.
    const handleTab = (next: OdooModel) => {
        setModel(next);
        // Keep `enabled` true so the new tab fetches automatically — better
        // UX than forcing a click on every tab switch.
    };

    const headers = preview.data?.rows?.[0]
        ? Object.keys(preview.data.rows[0])
        : [];

    return (
        <div className="glass-card rounded-2xl p-6">
            <div className="flex items-start justify-between gap-4 mb-5">
                <div>
                    <h3 className="text-lg font-semibold mb-1">Preview</h3>
                    <p className="text-sm text-muted-foreground">
                        Sample {limit} records from Odoo without persisting anything.
                    </p>
                </div>
                {!enabled ? (
                    <button
                        type="button"
                        onClick={() => setEnabled(true)}
                        aria-label="Load preview"
                        className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-semibold hover:bg-primary/90 transition-colors"
                    >
                        <Eye className="w-4 h-4" />
                        Load preview
                    </button>
                ) : (
                    <button
                        type="button"
                        onClick={() => preview.refetch()}
                        disabled={preview.isFetching}
                        aria-label="Refresh preview"
                        className="inline-flex items-center gap-2 px-4 py-2 bg-muted/40 text-foreground rounded-lg text-sm font-semibold hover:bg-muted/60 transition-colors disabled:opacity-50"
                    >
                        <RefreshCw
                            className={`w-4 h-4 ${
                                preview.isFetching ? 'animate-spin' : ''
                            }`}
                        />
                        Refresh
                    </button>
                )}
            </div>

            {/* ── Tabs ───────────────────────────────────────────── */}
            <div
                className="flex flex-wrap gap-2 mb-4"
                role="tablist"
                aria-label="Odoo model"
            >
                {MODELS.map(({ value, label }) => (
                    <button
                        key={value}
                        type="button"
                        role="tab"
                        aria-selected={model === value}
                        onClick={() => handleTab(value)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                            model === value
                                ? 'bg-primary text-primary-foreground'
                                : 'bg-muted/30 text-muted-foreground hover:bg-muted/50'
                        }`}
                    >
                        {label}
                    </button>
                ))}
            </div>

            {/* ── Results ────────────────────────────────────────── */}
            {!enabled && (
                <div className="min-h-[200px] flex items-center justify-center text-sm text-muted-foreground border-2 border-dashed border-border rounded-xl bg-muted/10">
                    Click <span className="mx-1 font-medium">Load preview</span> to
                    fetch a sample.
                </div>
            )}

            {enabled && preview.isLoading && (
                <div className="min-h-[200px] flex items-center justify-center">
                    <Loader2 className="w-6 h-6 animate-spin text-primary" />
                </div>
            )}

            {enabled && preview.isError && (
                <div className="min-h-[120px] flex items-center justify-center text-sm text-danger border border-danger/30 bg-danger/5 rounded-xl p-4">
                    Failed to fetch preview.{' '}
                    {extractError(preview.error)}
                </div>
            )}

            {enabled && preview.data && (
                <>
                    <div className="text-xs text-muted-foreground mb-2">
                        Showing {preview.data.count} of{' '}
                        <code>{preview.data.model}</code>
                    </div>
                    <div className="overflow-x-auto rounded-xl border border-border">
                        <table className="w-full text-xs">
                            <thead className="bg-muted/30">
                                <tr>
                                    {headers.map((h) => (
                                        <th
                                            key={h}
                                            className="text-left font-semibold px-3 py-2 whitespace-nowrap"
                                        >
                                            {h}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {preview.data.rows.map((row, idx) => (
                                    <tr
                                        key={idx}
                                        className="border-t border-border hover:bg-muted/10"
                                    >
                                        {headers.map((h) => (
                                            <td
                                                key={h}
                                                className="px-3 py-2 whitespace-nowrap max-w-[200px] truncate"
                                                title={formatCell(row[h])}
                                            >
                                                {formatCell(row[h])}
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </>
            )}
        </div>
    );
}

/* ──────────────────────────────────────────────────────────
 * Helpers
 * ────────────────────────────────────────────────────────── */

/**
 * Odoo Many2one fields come back as `[id, "Display Name"]`. Render the
 * display name; fall back to JSON for anything else non-primitive.
 */
function formatCell(value: unknown): string {
    if (value === null || value === undefined) return '—';
    if (value === false) return '—';
    if (Array.isArray(value)) {
        if (value.length >= 2 && typeof value[1] === 'string') return value[1];
        return JSON.stringify(value);
    }
    if (typeof value === 'object') return JSON.stringify(value);
    return String(value);
}

function extractError(err: unknown): string {
    if (!err) return '';
    if (err instanceof Error) {
        const body = (err as Error & { body?: { detail?: string } }).body;
        return body?.detail ?? err.message;
    }
    return String(err);
}
