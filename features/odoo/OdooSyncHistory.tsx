'use client';

import Link from 'next/link';
import { useOdooSyncs } from '@/features/odoo/useOdoo';
import { History, Loader2, FileText, ArrowUpRight } from 'lucide-react';

/**
 * OdooSyncHistory
 * ---------------
 * Lists past Odoo-sourced uploads for the current user. Each row links to
 * the Datasets detail page (since Odoo syncs are stored as upload rows).
 */
export function OdooSyncHistory() {
    const { data, isLoading, isError } = useOdooSyncs(20);
    const rows = data?.data ?? [];

    return (
        <div className="glass-card rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-5">
                <History className="w-5 h-5 text-muted-foreground" />
                <h3 className="text-lg font-semibold">Recent syncs</h3>
            </div>

            {isLoading ? (
                <div className="min-h-[160px] flex items-center justify-center">
                    <Loader2 className="w-5 h-5 animate-spin text-primary" />
                </div>
            ) : isError ? (
                <div className="text-sm text-danger">
                    Failed to load sync history.
                </div>
            ) : rows.length === 0 ? (
                <div className="min-h-[160px] flex flex-col items-center justify-center text-center text-sm text-muted-foreground border-2 border-dashed border-border rounded-xl bg-muted/10 p-6">
                    <FileText className="w-6 h-6 mb-2 opacity-60" />
                    No syncs yet. Run your first one above.
                </div>
            ) : (
                <div className="overflow-x-auto rounded-xl border border-border">
                    <table className="w-full text-sm">
                        <thead className="bg-muted/30 text-xs uppercase tracking-wider text-muted-foreground">
                            <tr>
                                <th className="text-left font-semibold px-4 py-2.5">
                                    File
                                </th>
                                <th className="text-right font-semibold px-4 py-2.5">
                                    Rows
                                </th>
                                <th className="text-right font-semibold px-4 py-2.5">
                                    Cols
                                </th>
                                <th className="text-right font-semibold px-4 py-2.5">
                                    Quality
                                </th>
                                <th className="text-left font-semibold px-4 py-2.5">
                                    When
                                </th>
                                <th className="text-left font-semibold px-4 py-2.5">
                                    Status
                                </th>
                                <th className="px-4 py-2.5"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {rows.map((row) => (
                                <tr
                                    key={row.id}
                                    className="border-t border-border hover:bg-muted/10 transition-colors"
                                >
                                    <td className="px-4 py-3 font-medium">
                                        <Link
                                            href={`/datasets/${row.id}`}
                                            className="hover:text-primary"
                                        >
                                            {row.file}
                                        </Link>
                                    </td>
                                    <td className="px-4 py-3 text-right tabular-nums">
                                        {row.rows.toLocaleString()}
                                    </td>
                                    <td className="px-4 py-3 text-right tabular-nums">
                                        {row.columns.toLocaleString()}
                                    </td>
                                    <td className="px-4 py-3 text-right text-muted-foreground tabular-nums">
                                        {formatQuality(
                                            row.quality_before,
                                            row.quality_after,
                                        )}
                                    </td>
                                    <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">
                                        {formatDate(row.uploaded_at)}
                                    </td>
                                    <td className="px-4 py-3">
                                        <StatusBadge status={row.status} />
                                    </td>
                                    <td className="px-4 py-3 text-right">
                                        <Link
                                            href={`/datasets/${row.id}`}
                                            aria-label="Open dataset"
                                            className="inline-flex items-center text-muted-foreground hover:text-primary"
                                        >
                                            <ArrowUpRight className="w-4 h-4" />
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

/* ──────────────────────────────────────────────────────────
 * Helpers
 * ────────────────────────────────────────────────────────── */

function StatusBadge({ status }: { status: string }) {
    const tone =
        status === 'completed'
            ? 'bg-success/10 text-success'
            : status === 'failed'
              ? 'bg-danger/10 text-danger'
              : 'bg-muted/40 text-muted-foreground';
    return (
        <span
            className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider ${tone}`}
        >
            {status}
        </span>
    );
}

function formatQuality(before: number | null, after: number | null): string {
    if (before == null && after == null) return '—';
    const b = before != null ? `${Math.round(before)}%` : '—';
    const a = after != null ? `${Math.round(after)}%` : '—';
    return `${b} → ${a}`;
}

function formatDate(iso: string | null): string {
    if (!iso) return '—';
    const d = new Date(iso);
    return d.toLocaleString(undefined, {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
}
