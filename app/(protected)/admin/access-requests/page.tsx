import { PageHeader } from '@/components/layout/PageHeader';
import { UserPlus, CheckCircle, XCircle } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Admin – Access Requests' };

export default function AccessRequestsPage() {
    return (
        <div className="animate-fade-in">
            <PageHeader
                title="Access Requests"
                description="Review and approve pending registration requests from new users."
            />

            <div className="mt-8 space-y-4">
                {/* 
                    TODO: Implement Request Management Table.
                    - Fetch pending requests from the API.
                    - Implement 'Approve' and 'Reject' actions with loading states.
                    - Add filtering by email or department.
                */}
                {[1, 2].map((i) => (
                    <div key={i} className="glass-card rounded-xl p-4 flex items-center justify-between border-dashed border-2">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-muted animate-pulse" />
                            <div className="space-y-2">
                                <div className="h-4 w-32 bg-muted rounded animate-pulse" />
                                <div className="h-3 w-48 bg-muted rounded animate-pulse" />
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <div className="w-8 h-8 rounded-lg bg-muted animate-pulse" />
                            <div className="w-8 h-8 rounded-lg bg-muted animate-pulse" />
                        </div>
                    </div>
                ))}

                <div className="text-center py-12">
                    <UserPlus className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
                    <p className="text-muted-foreground">Implement the request review logic here.</p>
                </div>
            </div>
        </div>
    );
}
