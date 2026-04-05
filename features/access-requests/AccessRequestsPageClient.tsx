'use client';

import { DataTable, type Column } from '@/components/data-display/DataTable';
import { PageHeader } from '@/components/layout/PageHeader';
import { useAccessRequests, useReviewAccessRequest } from '@/features/access-requests/useAccessRequests';
import type { AccessRequest } from '@/types';
import { Check, Loader2, X } from 'lucide-react';

function ActionButtons({ requestId }: { requestId: string }) {
    const review = useReviewAccessRequest();
    return <div className="flex items-center gap-2"><button onClick={() => review.mutate({ id: requestId, status: 'approved' })} className="inline-flex items-center gap-1 text-success text-sm"><Check className="w-4 h-4" />Approve</button><button onClick={() => review.mutate({ id: requestId, status: 'rejected' })} className="inline-flex items-center gap-1 text-danger text-sm"><X className="w-4 h-4" />Reject</button></div>;
}

const columns: Column<AccessRequest>[] = [
    { key: 'user', header: 'User', render: (row) => row.user.name },
    { key: 'email', header: 'Email', render: (row) => row.user.email },
    { key: 'requestedRole', header: 'Requested Role' },
    { key: 'status', header: 'Status', render: (row) => <span className="capitalize">{row.status}</span> },
    { key: 'justification', header: 'Reason', render: (row) => <span className="text-sm text-muted-foreground">{row.justification}</span> },
    { key: 'actions', header: 'Actions', render: (row) => row.status === 'pending' ? <ActionButtons requestId={row.id} /> : <span className="text-xs text-muted-foreground">Reviewed</span> },
];

export function AccessRequestsPageClient() {
    const { data, isLoading, isError } = useAccessRequests();
    const requests = data?.data ?? [];

    return (
        <div className="animate-fade-in space-y-6">
            <PageHeader title="Access Requests" description="Review and approve pending access requests from new users." />
            {isLoading ? <div className="min-h-[240px] flex items-center justify-center"><Loader2 className="w-6 h-6 animate-spin" /></div> : isError ? <div className="text-sm text-danger">Failed to load access requests.</div> : <DataTable columns={columns} data={requests} keyExtractor={(row) => row.id} emptyMessage="No access requests found" />}
        </div>
    );
}
