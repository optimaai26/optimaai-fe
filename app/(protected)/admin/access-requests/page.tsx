import { PageHeader } from '@/components/layout/PageHeader';
import { UserCog, Bell } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Admin ?" Access Requests' };

export default function AccessRequestsPage() {
    return (
        <div className="animate-fade-in space-y-6">
            <PageHeader
                title="Access Requests"
                description="Review and approve pending access requests from new users."
            />

            {/* 
              DESIGN CHALLENGE: 
              1. Design an approval workflow UI (Approve/Reject/Verify).
              2. Implement real-time notifications for new requests.
              3. Build a "Verification History" log to track admin decisions.
            */}
            <div className="glass-card rounded-2xl min-h-[400px] border-2 border-dashed border-border flex flex-col items-center justify-center p-8 bg-muted/5 relative group">
                <div className="absolute top-4 right-4 animate-bounce">
                    <Bell className="w-5 h-5 text-amber-500 opacity-50" />
                </div>

                <div className="p-4 rounded-2xl bg-muted text-muted-foreground mb-4 group-hover:scale-110 transition-transform">
                    <UserCog className="w-10 h-10" />
                </div>

                <h3 className="text-lg font-bold mb-2">Access Control Plane</h3>
                <p className="text-sm text-muted-foreground max-w-sm text-center mb-8">
                    Implementing a secure and intuitive workflow for onboarding new enterprise users.
                </p>

                <div className="space-y-3 w-full max-w-xs">
                    <div className="h-2 w-full bg-muted rounded animate-pulse" />
                    <div className="h-2 w-2/3 bg-muted rounded animate-pulse" />
                    <div className="h-2 w-3/4 bg-muted rounded animate-pulse" />
                </div>

                <div className="mt-8">
                    <code className="text-[10px] text-primary bg-primary/5 px-2 py-1 rounded font-mono">
                        // TODO: Implement the Approval Workflow logic
                    </code>
                </div>
            </div>
        </div>
    );
}
