'use client';

import { useQuery } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';

import { PageHeader } from '@/components/layout/PageHeader';
import { apiClient } from '@/lib/api/api-client';
import { DashboardLiveStats } from '@/features/dashboard/DashboardLiveStats';

// ──────────────────────────────────────────────────────────────────────
//  Page
// ──────────────────────────────────────────────────────────────────────

export default function DashboardPage() {
    return (
        <div className="space-y-6 animate-fade-in">
            <PageHeader
                title="Dashboard"
                description="Overview of your key business metrics."
            />

            {/* Live KPIs + charts from uploaded data */}
            <DashboardLiveStats />

            {/* Recent activity feed */}
            <RecentActivity />
        </div>
    );
}

// ──────────────────────────────────────────────────────────────────────
//  Recent Activity
// ──────────────────────────────────────────────────────────────────────

interface DatasetRow {
    id:           number;
    name:         string;
    file:         string;
    uploaded_at:  string | null;
    status:       string;
}

function RecentActivity() {
    const { data, isLoading } = useQuery<DatasetRow[], Error>({
        queryKey: ['recent-uploads'],
        queryFn:  () => apiClient.get<DatasetRow[]>('/datasets/'),
        staleTime: 60 * 1000,
    });

    return (
        <div className="glass-card rounded-2xl border border-border p-5">
            <h3 className="font-semibold text-sm mb-3">Recent Activity</h3>

            {isLoading ? (
                <div className="flex items-center gap-2 text-sm text-muted-foreground py-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Loading…
                </div>
            ) : !data || data.length === 0 ? (
                <p className="text-sm text-muted-foreground py-2">
                    No recent uploads. Upload a dataset to get started.
                </p>
            ) : (
                <ul className="space-y-2">
                    {data.slice(0, 5).map((row) => (
                        <li
                            key={row.id}
                            className="flex items-center justify-between gap-2 text-sm py-1.5"
                        >
                            <div className="flex items-center gap-2 min-w-0">
                                <span className="inline-block w-2 h-2 rounded-full bg-amber-500 shrink-0" />
                                <span className="text-foreground/85 truncate">
                                    Dataset uploaded:{' '}
                                    <strong className="text-foreground">{row.file}</strong>
                                </span>
                            </div>
                            <span className="text-xs text-muted-foreground shrink-0">
                                {row.uploaded_at
                                    ? formatRelative(row.uploaded_at)
                                    : ''}
                            </span>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

function formatRelative(iso: string): string {
    const then = new Date(iso).getTime();
    const now  = Date.now();
    const diff = Math.max(0, now - then);
    const mins = Math.round(diff / 60000);
    if (mins < 60)  return `${mins} min${mins === 1 ? '' : 's'} ago`;
    const hrs = Math.round(mins / 60);
    if (hrs < 24)   return `${hrs} hour${hrs === 1 ? '' : 's'} ago`;
    const days = Math.round(hrs / 24);
    return `${days} day${days === 1 ? '' : 's'} ago`;
}