import { PageHeader } from '@/components/layout/PageHeader';
import { Shield, Check, X, Plus } from 'lucide-react';
import { PERMISSION_GROUPS, ROLE_PERMISSIONS, ROLE_LABELS } from '@/constants/permissions';
import { Fragment } from 'react';
import type { RoleName } from '@/types';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Admin – Roles' };

const roles: RoleName[] = ['admin', 'manager', 'analyst', 'viewer'];

export default function AdminRolesPage() {
    return (
        <div className="animate-fade-in">
            <PageHeader
                title="Roles & Permissions"
                description="Manage role definitions and their permission matrices."
                actions={
                    <button className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg gradient-primary text-white text-sm font-medium hover:opacity-90 transition-opacity">
                        <Plus className="w-4 h-4" />
                        Create Role
                    </button>
                }
            />

            {/* Permissions Matrix */}
            <div className="glass-card rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-border bg-muted/50">
                                <th className="text-left px-4 py-3 font-semibold text-muted-foreground min-w-[200px]">Permission</th>
                                {roles.map((role) => (
                                    <th key={role} className="text-center px-4 py-3 font-semibold text-muted-foreground">
                                        <div className="flex flex-col items-center gap-1">
                                            <Shield className="w-4 h-4" />
                                            <span>{ROLE_LABELS[role]}</span>
                                        </div>
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {PERMISSION_GROUPS.map((group) => (
                                <Fragment key={`group-wrapper-${group.label}`}>
                                    <tr key={`group-header-${group.label}`} className="bg-muted/30">
                                        <td colSpan={roles.length + 1} className="px-4 py-2">
                                            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                                {group.label}
                                            </span>
                                        </td>
                                    </tr>
                                    {group.permissions.map((perm) => (
                                        <tr key={perm} className="border-b border-border last:border-0 hover:bg-muted/20 transition-colors">
                                            <td className="px-4 py-2.5 font-mono text-xs">{perm}</td>
                                            {roles.map((role) => {
                                                const has = ROLE_PERMISSIONS[role].includes(perm);
                                                return (
                                                    <td key={`${role}-${perm}`} className="text-center px-4 py-2.5">
                                                        {has ? (
                                                            <Check className="w-4 h-4 text-success mx-auto" />
                                                        ) : (
                                                            <X className="w-4 h-4 text-muted-foreground/30 mx-auto" />
                                                        )}
                                                    </td>
                                                );
                                            })}
                                        </tr>
                                    ))}
                                </Fragment>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
