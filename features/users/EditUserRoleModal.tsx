'use client';

import { useState, useEffect } from 'react';
import { X, Loader2, ShieldAlert } from 'lucide-react';
import { useToast } from '@/components/ui/Toast';
import { ROLE_LABELS, type RoleName } from '@/constants/permissions';
import { useQueryClient } from '@tanstack/react-query';
import type { User } from '@/types';
import { Select } from '@/components/ui/Select';

export function EditUserRoleModal({ user, onClose }: { user: User | null; onClose: () => void }) {
    const [role, setRole] = useState<RoleName>('analyst');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { toast } = useToast();
    const queryClient = useQueryClient();

    useEffect(() => {
        if (user) {
            setRole(user.role.name as RoleName);
        }
    }, [user]);

    if (!user) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        // Simulate API patch
        await new Promise(res => setTimeout(res, 800));
        setIsSubmitting(false);

        toast({
            title: 'Role Updated',
            message: `${user.name}'s role has been successfully updated to ${ROLE_LABELS[role]}.`,
            type: 'success'
        });
        
        // Refresh users query
        queryClient.invalidateQueries({ queryKey: ['users'] });
        onClose();
    };

    const roleOptions = (Object.entries(ROLE_LABELS) as [RoleName, string][]).map(([key, label]) => ({
        value: key,
        label
    }));

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-md animate-fade-in">
            <div className="bg-background/95 backdrop-blur-xl border border-border/50 rounded-2xl shadow-2xl ring-1 ring-white/10 w-full max-w-sm flex flex-col animate-slide-up">
                <div className="flex items-center justify-between p-4 border-b border-border/50 bg-muted/20">
                    <div className="flex items-center gap-2 text-foreground font-semibold">
                        <ShieldAlert className="w-5 h-5 text-primary-500" />
                        Edit User Role
                    </div>
                    <button onClick={onClose} className="p-1 text-muted-foreground hover:text-foreground rounded-md hover:bg-muted transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>
                
                <form onSubmit={handleSubmit} className="p-6 space-y-5">
                    <div>
                        <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">User details</label>
                        <div className="bg-muted/50 border border-border/50 rounded-lg p-3">
                            <div className="font-medium text-foreground">{user.name}</div>
                            <div className="text-sm text-muted-foreground">{user.email}</div>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-foreground mb-1 mt-2">Assign New Role</label>
                        <Select 
                            value={role} 
                            onChange={(val) => setRole(val as RoleName)}
                            options={roleOptions}
                        />
                    </div>

                    <div className="pt-2">
                        <p className="text-xs text-muted-foreground bg-primary/5 p-3 rounded-lg border border-primary/10">
                            <strong>Note:</strong> Role changes take effect immediately across all sessions for this user.
                        </p>
                    </div>

                    <div className="pt-2 flex justify-end gap-3 mt-2">
                        <button 
                            type="button" 
                            onClick={onClose}
                            className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                        >
                            Cancel
                        </button>
                        <button 
                            type="submit" 
                            disabled={isSubmitting || role === user.role.name}
                            className="px-5 py-2 text-sm font-semibold text-white bg-primary hover:bg-primary/90 rounded-lg shadow-sm hover:shadow-primary/20 transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Apply Role'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
