import { PageHeader } from '@/components/layout/PageHeader';
import { Users, Plus, Search, MoreHorizontal, Shield } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Admin – Users' };

const mockUsers = [
    { id: '1', name: 'Alice Johnson', email: 'alice@company.com', role: 'admin', status: 'active', lastLogin: '2 hours ago' },
    { id: '2', name: 'Bob Smith', email: 'bob@company.com', role: 'manager', status: 'active', lastLogin: '1 day ago' },
    { id: '3', name: 'Carol Williams', email: 'carol@company.com', role: 'analyst', status: 'active', lastLogin: '3 hours ago' },
    { id: '4', name: 'David Brown', email: 'david@company.com', role: 'viewer', status: 'inactive', lastLogin: '2 weeks ago' },
];

const roleColors: Record<string, string> = {
    admin: 'bg-danger/10 text-danger',
    manager: 'bg-warning/10 text-warning',
    analyst: 'bg-info/10 text-info',
    viewer: 'bg-muted text-muted-foreground',
};

export default function AdminUsersPage() {
    return (
        <div className="animate-fade-in">
            <PageHeader
                title="User Management"
                description="Manage users, assign roles, and control access."
                actions={
                    <button className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg gradient-primary text-white text-sm font-medium hover:opacity-90 transition-opacity">
                        <Plus className="w-4 h-4" />
                        Add User
                    </button>
                }
            />

            {/* Search */}
            <div className="flex items-center gap-3 mb-6">
                <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-muted text-muted-foreground flex-1 max-w-sm">
                    <Search className="w-4 h-4" />
                    <input type="text" placeholder="Search users..." className="bg-transparent text-sm outline-none w-full" />
                </div>
            </div>

            {/* Users Table */}
            <div className="glass-card rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-border bg-muted/50">
                                <th className="text-left px-4 py-3 font-semibold text-muted-foreground">User</th>
                                <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Role</th>
                                <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Status</th>
                                <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Last Login</th>
                                <th className="text-right px-4 py-3 font-semibold text-muted-foreground">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {mockUsers.map((user) => (
                                <tr key={user.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full gradient-primary flex items-center justify-center text-white text-xs font-semibold">
                                                {user.name.split(' ').map(n => n[0]).join('')}
                                            </div>
                                            <div>
                                                <p className="font-medium">{user.name}</p>
                                                <p className="text-xs text-muted-foreground">{user.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3">
                                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${roleColors[user.role]}`}>
                                            {user.role}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3">
                                        <span className={`inline-flex items-center gap-1.5 text-xs ${user.status === 'active' ? 'text-success' : 'text-muted-foreground'}`}>
                                            <span className={`w-1.5 h-1.5 rounded-full ${user.status === 'active' ? 'bg-success' : 'bg-muted-foreground'}`} />
                                            {user.status}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-muted-foreground">{user.lastLogin}</td>
                                    <td className="px-4 py-3 text-right">
                                        <button className="p-1.5 rounded-lg hover:bg-muted transition-colors">
                                            <MoreHorizontal className="w-4 h-4 text-muted-foreground" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
