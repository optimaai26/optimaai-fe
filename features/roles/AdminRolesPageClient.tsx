'use client';

import { PageHeader } from '@/components/layout/PageHeader';
import { PERMISSION_GROUPS, ROLE_LABELS } from '@/constants/permissions';
import { useRoles } from '@/features/roles/useRoles';
import { Fragment } from 'react';
import { Check, Loader2, Shield, X } from 'lucide-react';

export function AdminRolesPageClient() {
    const { data, isLoading, isError } = useRoles();
    const roles = data?.data ?? [];

    if (isLoading) return <div className="min-h-[240px] flex items-center justify-center"><Loader2 className="w-6 h-6 animate-spin" /></div>;
    if (isError) return <div className="text-sm text-danger">Failed to load roles.</div>;

    return (
        <div className="animate-fade-in">
            <PageHeader title="Roles & Permissions" description="Manage role definitions and their permission matrices." />
            <div className="glass-card rounded-xl overflow-hidden"><div className="overflow-x-auto"><table className="w-full text-sm"><thead><tr className="border-b border-border bg-muted/50"><th className="text-left px-4 py-3 font-semibold text-muted-foreground min-w-[200px]">Permission</th>{roles.map((role) => <th key={role.id} className="text-center px-4 py-3 font-semibold text-muted-foreground"><div className="flex flex-col items-center gap-1"><Shield className="w-4 h-4" /><span>{ROLE_LABELS[role.name]}</span></div></th>)}</tr></thead><tbody>{PERMISSION_GROUPS.map((group) => <Fragment key={`group-${group.label}`}><tr className="bg-muted/30"><td colSpan={roles.length + 1} className="px-4 py-2"><span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{group.label}</span></td></tr>{group.permissions.map((permission) => <tr key={permission} className="border-b border-border last:border-0 hover:bg-muted/20 transition-colors"><td className="px-4 py-2.5 font-mono text-xs">{permission}</td>{roles.map((role) => { const has = role.permissions.some((item) => item.key === permission); return <td key={`${role.id}-${permission}`} className="text-center px-4 py-2.5">{has ? <Check className="w-4 h-4 text-success mx-auto" /> : <X className="w-4 h-4 text-muted-foreground/30 mx-auto" />}</td>; })}</tr>)}</Fragment>)}</tbody></table></div></div>
        </div>
    );
}
