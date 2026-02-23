import { PageHeader } from '@/components/layout/PageHeader';
import { Users, UserPlus } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Admin ?" Users' };

export default function AdminUsersPage() {
    return (
        <div className="animate-fade-in space-y-6">
            <PageHeader
                title="User Management"
                description="Manage your team members and their organizational access."
                actions={
                    <button className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-semibold hover:bg-primary/90 transition-all">
                        <UserPlus className="w-4 h-4" />
                        Invite Member
                    </button>
                }
            />

            {/* 
              DESIGN CHALLENGE: 
              1. Design a high-fidelity user management table with filtering and sorting.
              2. Implement user state management (Invite, Suspend, Delete).
              3. Design a professional "User Identity" card for the profile details.
            */}
            <div className="glass-card rounded-2xl min-h-[500px] border border-dashed border-border p-6 flex items-center justify-center bg-muted/10 overflow-hidden relative">
                <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
                    {/* Background pattern noise */}
                </div>

                <div className="text-center relative z-10">
                    <div className="flex -space-x-3 mb-6 justify-center">
                        {[1, 2, 3, 4].map(i => (
                            <div key={i} className="w-10 h-10 rounded-full border-2 border-background bg-muted animate-pulse" />
                        ))}
                    </div>
                    <h3 className="font-semibold text-lg mb-2">Internal Users Hub</h3>
                    <p className="text-sm text-muted-foreground max-w-xs mx-auto mb-6">
                        This view is currently under construction. Design the user table from scratch.
                    </p>
                    <code className="text-xs text-primary font-mono uppercase bg-primary/5 px-3 py-1.5 rounded-full">
                        // Feature Track: Admin Control Plane
                    </code>
                </div>
            </div>
        </div>
    );
}
