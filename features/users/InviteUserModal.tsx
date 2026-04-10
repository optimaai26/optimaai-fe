'use client';

import { useState } from 'react';
import { X, Loader2, UserPlus } from 'lucide-react';
import { useToast } from '@/components/ui/Toast';
import { ROLE_LABELS, type RoleName } from '@/constants/permissions';
import { useQueryClient } from '@tanstack/react-query';
import { Select } from '@/components/ui/Select';

export function InviteUserModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [role, setRole] = useState<RoleName>('analyst');
    const [department, setDepartment] = useState('');
    
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { toast } = useToast();
    const queryClient = useQueryClient();

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        // Simulate API post
        await new Promise(res => setTimeout(res, 800));
        setIsSubmitting(false);

        toast({
            title: 'User Invited',
            message: `An invitation email has been sent to ${email}.`,
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
            <div className="bg-background/95 backdrop-blur-xl border border-border/50 rounded-2xl shadow-2xl ring-1 ring-white/10 w-full max-w-md flex flex-col animate-slide-up">
                <div className="flex items-center justify-between p-4 border-b border-border/50 bg-muted/20">
                    <div className="flex items-center gap-2 text-foreground font-semibold">
                        <UserPlus className="w-5 h-5 text-primary-500" />
                        Invite Team Member
                    </div>
                    <button onClick={onClose} className="p-1 text-muted-foreground hover:text-foreground rounded-md hover:bg-muted transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>
                
                <form onSubmit={handleSubmit} className="p-6 space-y-5">
                    <div>
                        <label className="block text-sm font-medium text-foreground mb-1">Full Name</label>
                        <input 
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="e.g. Jane Doe"
                            required
                            className="w-full bg-background/50 border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/50 transition-colors hover:border-border/80"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-foreground mb-1">Email Address</label>
                        <input 
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="e.g. jane@company.com"
                            required
                            className="w-full bg-background/50 border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/50 transition-colors hover:border-border/80"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-foreground mb-1">Role Assignment</label>
                        <Select 
                            value={role} 
                            onChange={(val) => setRole(val as RoleName)}
                            options={roleOptions}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-foreground mb-1">Department (Optional)</label>
                        <input 
                            type="text"
                            value={department}
                            onChange={(e) => setDepartment(e.target.value)}
                            placeholder="e.g. Marketing"
                            className="w-full bg-background/50 border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/50 transition-colors hover:border-border/80"
                        />
                    </div>

                    <div className="pt-4 flex justify-end gap-3 mt-2">
                        <button 
                            type="button" 
                            onClick={onClose}
                            className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                        >
                            Cancel
                        </button>
                        <button 
                            type="submit" 
                            disabled={isSubmitting || !name.trim() || !email.trim()}
                            className="px-5 py-2 text-sm font-semibold text-white bg-primary hover:bg-primary/90 rounded-lg shadow-sm hover:shadow-primary/20 transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Send Invite'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
