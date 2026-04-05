'use client';

import { DataTable, type Column } from '@/components/data-display/DataTable';
import { PageHeader } from '@/components/layout/PageHeader';
import { useUsers } from '@/features/users/useUsers';
import type { User } from '@/types';
import { Loader2, UserPlus } from 'lucide-react';

const columns: Column<User>[] = [
    { key: 'name', header: 'Name' },
    { key: 'email', header: 'Email' },
    { key: 'role', header: 'Role', render: (row) => row.role.name },
    { key: 'departmentId', header: 'Department', render: (row) => row.departmentId ?? '-' },
    { key: 'createdAt', header: 'Joined', render: (row) => new Date(row.createdAt).toLocaleDateString() },
];

export function AdminUsersPageClient() {
    const { data, isLoading, isError } = useUsers();
    const users = data?.data ?? [];

    return (
        <div className="animate-fade-in space-y-6">
            <PageHeader title="User Management" description="Manage your team members and their organizational access." actions={<button className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-semibold"><UserPlus className="w-4 h-4" />Invite Member</button>} />
            {isLoading ? <div className="min-h-[240px] flex items-center justify-center"><Loader2 className="w-6 h-6 animate-spin" /></div> : isError ? <div className="text-sm text-danger">Failed to load users.</div> : <DataTable columns={columns} data={users} keyExtractor={(row) => row.id} emptyMessage="No users found" />}
        </div>
    );
}
