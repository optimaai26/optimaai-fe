'use client';

import { useState } from 'react';
import { X, Loader2, ShieldPlus } from 'lucide-react';
import { useToast } from '@/components/ui/Toast';
import { PERMISSION_GROUPS, type PermissionKey } from '@/constants/permissions';
import { useQueryClient } from '@tanstack/react-query';

export function CreateRoleModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
    const [name, setName] = useState('');
    const [selectedPermissions, setSelectedPermissions] = useState<Set<PermissionKey>>(new Set());
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { toast } = useToast();
    const queryClient = useQueryClient();

    if (!isOpen) return null;

    const togglePermission = (key: PermissionKey) => {
        const next = new Set(selectedPermissions);
        if (next.has(key)) next.delete(key);
        else next.add(key);
        setSelectedPermissions(next);
    };

    const toggleGroup = (keys: PermissionKey[]) => {
        const allSelected = keys.every(k => selectedPermissions.has(k));
        const next = new Set(selectedPermissions);
        if (allSelected) {
            keys.forEach(k => next.delete(k));
        } else {
            keys.forEach(k => next.add(k));
        }
        setSelectedPermissions(next);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        // Simulate API post
        await new Promise(res => setTimeout(res, 800));
        setIsSubmitting(false);

        toast({
            title: 'Role Created',
            message: `The role "${name}" has been successfully created.`,
            type: 'success'
        });
        
        // Refresh roles query
        queryClient.invalidateQueries({ queryKey: ['roles'] });
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-md animate-fade-in">
            <div className="bg-background/95 backdrop-blur-xl border border-border/50 rounded-2xl shadow-2xl ring-1 ring-white/10 w-full max-w-2xl max-h-[85vh] flex flex-col animate-slide-up">
                <div className="flex items-center justify-between p-4 border-b border-border/50 bg-muted/20">
                    <div className="flex items-center gap-2 text-foreground font-semibold">
                        <ShieldPlus className="w-5 h-5 text-primary-500" />
                        Create Custom Role
                    </div>
                    <button onClick={onClose} className="p-1 text-muted-foreground hover:text-foreground rounded-md hover:bg-muted transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>
                
                <form onSubmit={handleSubmit} className="p-6 overflow-y-auto custom-scrollbar flex-1 space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-foreground mb-1">Role Name</label>
                        <input 
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="e.g. Guest Data Analyst"
                            required
                            className="w-full bg-background/50 border border-border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500/50 transition-colors hover:border-border/80"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-foreground mb-3 flex items-center justify-between">
                            <span>Permissions</span>
                            <span className="text-xs font-normal text-muted-foreground bg-muted/50 px-2 py-0.5 rounded-full">
                                {selectedPermissions.size} selected
                            </span>
                        </label>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {PERMISSION_GROUPS.map(group => {
                                const allSelected = group.permissions.every(p => selectedPermissions.has(p));
                                const someSelected = group.permissions.some(p => selectedPermissions.has(p));

                                return (
                                    <div key={group.label} className="border border-border/50 rounded-xl p-4 bg-muted/10 hover:bg-muted/20 hover:border-border/80 transition-colors">
                                        <div className="flex items-center justify-between mb-3 pb-3 border-b border-border/50">
                                            <span className="text-xs font-bold text-foreground uppercase tracking-wider">{group.label}</span>
                                            <button 
                                                type="button" 
                                                onClick={() => toggleGroup(group.permissions)}
                                                className={`text-[10px] uppercase font-bold tracking-widest px-2.5 py-1 rounded-full transition-colors ${allSelected ? 'bg-primary/20 text-primary hover:bg-primary/30' : someSelected ? 'bg-primary/10 text-primary-400 hover:bg-primary/20' : 'bg-muted hover:bg-muted-foreground/20 text-muted-foreground'}`}
                                            >
                                                {allSelected ? 'All' : someSelected ? 'Some' : 'None'}
                                            </button>
                                        </div>
                                        <div className="space-y-2.5">
                                            {group.permissions.map(perm => (
                                                <label key={perm} className="flex items-center gap-3 cursor-pointer group">
                                                    <div className={`w-4 h-4 rounded border flex items-center justify-center transition-all ${selectedPermissions.has(perm) ? 'bg-primary border-primary text-primary-foreground shadow-sm shadow-primary/20' : 'border-input bg-background group-hover:border-primary/50'}`}>
                                                        {selectedPermissions.has(perm) && <CheckIcon />}
                                                    </div>
                                                    <span className="text-sm font-mono text-muted-foreground group-hover:text-foreground transition-colors">{perm}</span>
                                                    <input 
                                                        type="checkbox" 
                                                        className="hidden" 
                                                        checked={selectedPermissions.has(perm)}
                                                        onChange={() => togglePermission(perm)}
                                                    />
                                                </label>
                                            ))}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </form>

                <div className="p-4 border-t border-border/50 bg-muted/10 flex justify-end gap-3 mt-auto">
                    <button 
                        type="button" 
                        onClick={onClose}
                        className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                    >
                        Cancel
                    </button>
                    <button 
                        type="submit" 
                        onClick={handleSubmit}
                        disabled={isSubmitting || !name.trim() || selectedPermissions.size === 0}
                        className="px-5 py-2 text-sm font-semibold text-white bg-primary hover:bg-primary/90 rounded-lg shadow-sm hover:shadow-primary/20 transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Create Role'}
                    </button>
                </div>
            </div>
        </div>
    );
}

function CheckIcon() {
    return (
        <svg width="10" height="10" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M10 3L4.5 8.5L2 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
    );
}
