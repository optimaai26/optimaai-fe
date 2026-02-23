import { PageHeader } from '@/components/layout/PageHeader';
import { CheckCircle2, XCircle, Clock, UserCog } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Admin – Access Requests' };

const mockRequests = [
    {
        id: '1',
        user: 'Emily Davis',
        email: 'emily@company.com',
        currentRole: 'viewer',
        requestedRole: 'analyst',
        justification: 'Need access to prediction features for the Q1 reporting project.',
        status: 'pending',
        date: '2 hours ago',
    },
    {
        id: '2',
        user: 'Frank Miller',
        email: 'frank@company.com',
        currentRole: 'analyst',
        requestedRole: 'manager',
        justification: 'Taking over team lead responsibilities for the data team.',
        status: 'pending',
        date: '1 day ago',
    },
    {
        id: '3',
        user: 'Grace Lee',
        email: 'grace@company.com',
        currentRole: 'viewer',
        requestedRole: 'analyst',
        justification: 'Starting data analysis work for Q4 marketing initiative.',
        status: 'approved',
        date: '3 days ago',
    },
];

const statusConfig: Record<string, { icon: typeof Clock; color: string; bg: string }> = {
    pending: { icon: Clock, color: 'text-warning', bg: 'bg-warning/10' },
    approved: { icon: CheckCircle2, color: 'text-success', bg: 'bg-success/10' },
    rejected: { icon: XCircle, color: 'text-danger', bg: 'bg-danger/10' },
};

export default function AccessRequestsPage() {
    return (
        <div className="animate-fade-in">
            <PageHeader
                title="Access Requests"
                description="Review and manage role upgrade requests from team members."
            />

            <div className="grid gap-4">
                {mockRequests.map((req) => {
                    const { icon: StatusIcon, color, bg } = statusConfig[req.status];
                    return (
                        <div key={req.id} className="glass-card rounded-xl p-6 hover:border-primary-400/20 transition-all duration-200">
                            <div className="flex items-start gap-4">
                                <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center text-white text-sm font-semibold shrink-0">
                                    {req.user.split(' ').map(n => n[0]).join('')}
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center justify-between mb-1">
                                        <h3 className="font-semibold">{req.user}</h3>
                                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${bg} ${color}`}>
                                            <StatusIcon className="w-3.5 h-3.5" />
                                            {req.status}
                                        </span>
                                    </div>
                                    <p className="text-sm text-muted-foreground mb-2">{req.email}</p>
                                    <div className="flex items-center gap-2 text-xs mb-3">
                                        <span className="px-2 py-0.5 rounded-md bg-muted">{req.currentRole}</span>
                                        <span className="text-muted-foreground">→</span>
                                        <span className="px-2 py-0.5 rounded-md bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-300">
                                            {req.requestedRole}
                                        </span>
                                        <span className="text-muted-foreground ml-2">{req.date}</span>
                                    </div>
                                    <p className="text-sm text-muted-foreground italic mb-4">&quot;{req.justification}&quot;</p>

                                    {req.status === 'pending' && (
                                        <div className="flex items-center gap-2">
                                            <button className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-success/10 text-success text-sm font-medium hover:bg-success/20 transition-colors">
                                                <CheckCircle2 className="w-4 h-4" />
                                                Approve
                                            </button>
                                            <button className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-danger/10 text-danger text-sm font-medium hover:bg-danger/20 transition-colors">
                                                <XCircle className="w-4 h-4" />
                                                Reject
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
