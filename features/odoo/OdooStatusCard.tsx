'use client';

import { useOdooStatus } from '@/features/odoo/useOdoo';
import { Database, CheckCircle2, AlertCircle, ArrowRight, Clock } from 'lucide-react';
import Link from 'next/link';

/**
 * OdooStatusCard
 * --------------
 * A compact status banner the user can drop in above the Datasets table to
 * surface the Odoo integration state at a glance. Clicks through to the full
 * /integrations/odoo page for actions.
 */
export function OdooStatusCard() {
    const { data, isLoading } = useOdooStatus();

    if (isLoading || !data) {
        return (
            <div
                className="glass-card rounded-2xl p-4 flex items-center gap-3"
                aria-busy="true"
            >
                <div className="w-10 h-10 rounded-lg bg-muted/40 animate-pulse" />
                <div className="flex-1">
                    <div className="h-3 w-32 bg-muted/40 rounded animate-pulse mb-2" />
                    <div className="h-3 w-48 bg-muted/40 rounded animate-pulse" />
                </div>
            </div>
        );
    }

    // Three visual states: not configured / configured but never synced /
    // configured + has at least one sync.
    const lastSync = data.last_sync_at ? new Date(data.last_sync_at) : null;
    const lastSyncLabel = lastSync ? formatRelative(lastSync) : 'Never synced';

    return (
        <Link
            href="/integrations/odoo"
            className="glass-card rounded-2xl p-4 flex items-center gap-4 group hover:border-primary/40 transition-colors"
            aria-label="Open Odoo integration settings"
        >
            <div
                className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    data.configured ? 'bg-primary/10' : 'bg-muted/40'
                }`}
            >
                <Database
                    className={`w-5 h-5 ${
                        data.configured ? 'text-primary' : 'text-muted-foreground'
                    }`}
                />
            </div>

            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                    <h4 className="font-medium text-foreground">Odoo ERP</h4>
                    {data.configured ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider text-success">
                            <CheckCircle2 className="w-3 h-3" />
                            Configured
                        </span>
                    ) : (
                        <span className="inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider text-warning">
                            <AlertCircle className="w-3 h-3" />
                            Not configured
                        </span>
                    )}
                </div>
                <p className="text-xs text-muted-foreground truncate">
                    {data.configured ? (
                        <>
                            <Clock className="w-3 h-3 inline mr-1 -mt-0.5" />
                            {lastSyncLabel}
                            <span className="mx-1.5">·</span>
                            {data.sync_count} {data.sync_count === 1 ? 'sync' : 'syncs'}
                        </>
                    ) : (
                        'Connect your Odoo instance to import CRM, Sales, and Invoice data.'
                    )}
                </p>
            </div>

            <ArrowRight className="w-4 h-4 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-primary" />
        </Link>
    );
}

/* ──────────────────────────────────────────────────────────
 * Local helpers
 * ────────────────────────────────────────────────────────── */

function formatRelative(date: Date): string {
    const diffMs = Date.now() - date.getTime();
    const diffMin = Math.round(diffMs / 60_000);

    if (diffMin < 1) return 'Synced just now';
    if (diffMin < 60) return `Synced ${diffMin}m ago`;
    const diffHr = Math.round(diffMin / 60);
    if (diffHr < 24) return `Synced ${diffHr}h ago`;
    const diffDay = Math.round(diffHr / 24);
    if (diffDay < 30) return `Synced ${diffDay}d ago`;
    return `Synced ${date.toLocaleDateString()}`;
}
