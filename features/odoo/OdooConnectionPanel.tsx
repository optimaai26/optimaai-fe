'use client';

import { useTestOdooConnection, useOdooStatus } from '@/features/odoo/useOdoo';
import {
    Plug,
    CheckCircle2,
    XCircle,
    Loader2,
    Database,
    Server,
    User as UserIcon,
    KeyRound,
} from 'lucide-react';

/**
 * OdooConnectionPanel
 * -------------------
 * Shows the resolved Odoo config from the backend plus a "Test connection"
 * button that performs a live XML-RPC ping and displays per-model counts.
 *
 * The panel intentionally never accepts credentials in the UI — credentials
 * live in the backend `.env` so they stay out of the browser context.
 */
export function OdooConnectionPanel() {
    const { data: status, isLoading: statusLoading } = useOdooStatus();
    const test = useTestOdooConnection();

    return (
        <div className="glass-card rounded-2xl p-6">
            <div className="flex items-start justify-between gap-4 mb-5">
                <div>
                    <h3 className="text-lg font-semibold mb-1">Connection</h3>
                    <p className="text-sm text-muted-foreground">
                        Credentials are managed in the backend environment. Use this
                        panel to verify reachability and authentication.
                    </p>
                </div>
                <button
                    type="button"
                    onClick={() => test.mutate()}
                    disabled={test.isPending || !status?.configured}
                    aria-label="Test Odoo connection"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {test.isPending ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                        <Plug className="w-4 h-4" />
                    )}
                    {test.isPending ? 'Testing…' : 'Test connection'}
                </button>
            </div>

            {/* ── Config grid ─────────────────────────────────────── */}
            {statusLoading ? (
                <div className="grid grid-cols-2 gap-3">
                    {[0, 1, 2, 3].map((i) => (
                        <div
                            key={i}
                            className="h-14 rounded-lg bg-muted/30 animate-pulse"
                        />
                    ))}
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <ConfigField
                        icon={<Server className="w-4 h-4" />}
                        label="URL"
                        value={status?.url ?? '—'}
                    />
                    <ConfigField
                        icon={<Database className="w-4 h-4" />}
                        label="Database"
                        value={status?.db ?? '—'}
                    />
                    <ConfigField
                        icon={<UserIcon className="w-4 h-4" />}
                        label="Username"
                        value={status?.username ?? '—'}
                    />
                    <ConfigField
                        icon={<KeyRound className="w-4 h-4" />}
                        label="Auth method"
                        value={
                            status?.auth_method === 'api_key' ? 'API key' : 'Password'
                        }
                    />
                </div>
            )}

            {/* ── Test result ─────────────────────────────────────── */}
            {test.isSuccess && test.data && (
                <div
                    className="mt-5 rounded-xl border border-success/30 bg-success/5 p-4"
                    role="status"
                >
                    <div className="flex items-center gap-2 text-success font-semibold mb-3">
                        <CheckCircle2 className="w-4 h-4" />
                        Connected (uid {test.data.uid})
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {(
                            [
                                ['crm.lead', 'Leads'],
                                ['sale.order', 'Orders'],
                                ['account.move', 'Invoices'],
                                ['res.partner', 'Customers'],
                            ] as const
                        ).map(([key, label]) => (
                            <div
                                key={key}
                                className="rounded-lg bg-background/40 p-3"
                            >
                                <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
                                    {label}
                                </div>
                                <div className="text-xl font-bold">
                                    {test.data.counts[key].toLocaleString()}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {test.isError && (
                <div
                    className="mt-5 rounded-xl border border-danger/30 bg-danger/5 p-4 flex items-start gap-3"
                    role="alert"
                >
                    <XCircle className="w-4 h-4 text-danger mt-0.5 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                        <div className="font-semibold text-danger mb-1">
                            Connection failed
                        </div>
                        <p className="text-sm text-muted-foreground break-words">
                            {extractError(test.error)}
                        </p>
                    </div>
                </div>
            )}

            {!status?.configured && !statusLoading && (
                <div
                    className="mt-5 rounded-xl border border-warning/30 bg-warning/5 p-4 text-sm text-muted-foreground"
                    role="status"
                >
                    Odoo isn&apos;t configured yet. Set <code>ODOO_URL</code>,{' '}
                    <code>ODOO_DB</code>, <code>ODOO_USERNAME</code>, and{' '}
                    <code>ODOO_PASSWORD</code> (or <code>ODOO_API_KEY</code>) in
                    the backend <code>.env</code> file, then restart the API.
                </div>
            )}
        </div>
    );
}

/* ──────────────────────────────────────────────────────────
 * Local components
 * ────────────────────────────────────────────────────────── */

function ConfigField({
    icon,
    label,
    value,
}: {
    icon: React.ReactNode;
    label: string;
    value: string;
}) {
    return (
        <div className="rounded-lg bg-muted/20 p-3">
            <div className="flex items-center gap-2 text-[10px] uppercase tracking-wider text-muted-foreground mb-1">
                {icon}
                {label}
            </div>
            <div className="text-sm font-medium truncate" title={value}>
                {value}
            </div>
        </div>
    );
}

function extractError(err: unknown): string {
    if (!err) return 'Unknown error';
    if (typeof err === 'string') return err;
    if (err instanceof Error) {
        // Our ApiError carries the FastAPI detail in `body.detail`.
        const body = (err as Error & { body?: { detail?: string } }).body;
        return body?.detail ?? err.message;
    }
    return 'Unknown error';
}
