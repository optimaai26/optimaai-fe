'use client';

import type { ComponentType } from 'react';
import { useState } from 'react';
import { PageHeader } from '@/components/layout/PageHeader';
import { KpiCard } from '@/components/data-display/KpiCard';
import { Activity, BarChart3, DollarSign, PieChart, TrendingUp, Users, Loader2, Lock } from 'lucide-react';
import { useDashboard } from '@/features/dashboard/useDashboard';
import { useAuth } from '@/features/auth/AuthProvider';
import { useUiStore } from '@/lib/stores/ui-store';
import { RequestAccessModal } from '@/features/access-requests/RequestAccessModal';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const iconMap: Record<string, ComponentType<{ className?: string }>> = {
    DollarSign,
    Users,
    Activity,
    TrendingUp,
};

export function DashboardPageClient() {
    const { data, isLoading, isError } = useDashboard();
    const { user } = useAuth();
    const { viewScope } = useUiStore();
    const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);

    if (isLoading) return <div className="min-h-[40vh] flex items-center justify-center"><Loader2 className="w-6 h-6 animate-spin" /></div>;
    if (isError || !data) return <div className="text-sm text-danger">Failed to load dashboard data.</div>;

    const chartData = data.data?.chartData ?? [];

    const isDepartmentScope = viewScope === 'department';
    const hasDepartmentViewPermission = user?.role.permissions.some(p => p.key === 'view:department');
    const isLocked = isDepartmentScope && !hasDepartmentViewPermission;

    if (isLocked) {
        return (
            <div className="animate-fade-in">
                <PageHeader title="Dashboard" description="Overview of your key business metrics and AI insights." />
                <div className="glass-card rounded-xl p-10 flex flex-col items-center justify-center text-center border-dashed mt-8 min-h-[400px]">
                    <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-6">
                        <Lock className="w-8 h-8 text-muted-foreground" />
                    </div>
                    <h2 className="text-xl font-semibold mb-2">Restricted Access</h2>
                    <p className="text-muted-foreground max-w-md mx-auto mb-8">
                        You do not have the required permissions to view department-level aggregated insights. 
                        Please request elevated access from your organization administrator.
                    </p>
                    <button 
                        onClick={() => setIsRequestModalOpen(true)}
                        className="px-6 py-2.5 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg transition-colors shadow-sm"
                    >
                        Request Access
                    </button>
                </div>
                <RequestAccessModal isOpen={isRequestModalOpen} onClose={() => setIsRequestModalOpen(false)} />
            </div>
        );
    }

    return (
        <div className="animate-fade-in">
            <PageHeader title="Dashboard" description="Overview of your key business metrics and AI insights." />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {(data.data?.kpis ?? []).map((kpi) => (
                    <KpiCard key={kpi.id} title={kpi.title} value={kpi.value} changePercent={kpi.changePercent} trend={kpi.trend} icon={kpi.icon ? iconMap[kpi.icon] : undefined} />
                ))}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                <div className="glass-card rounded-xl p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold">Revenue Trend</h3>
                        <BarChart3 className="w-5 h-5 text-muted-foreground" />
                    </div>
                    <div className="h-64 w-full text-sm">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={chartData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" opacity={0.1} vertical={false} />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: 'currentColor', opacity: 0.5 }} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: 'currentColor', opacity: 0.5 }} dx={-10} tickFormatter={(val) => `$${val/1000}k`} />
                                <Tooltip 
                                    contentStyle={{ backgroundColor: 'hsl(var(--background))', borderColor: 'hsl(var(--border))', borderRadius: '8px' }}
                                    itemStyle={{ color: 'hsl(var(--foreground))' }}
                                />
                                <Line type="monotone" dataKey="revenue" stroke="hsl(var(--primary))" strokeWidth={3} dot={{ r: 4, fill: 'hsl(var(--primary))', strokeWidth: 2 }} activeDot={{ r: 6 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>
                <div className="glass-card rounded-xl p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold">User Distribution</h3>
                        <PieChart className="w-5 h-5 text-muted-foreground" />
                    </div>
                    <div className="h-64 w-full text-sm">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={chartData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" opacity={0.1} vertical={false} />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: 'currentColor', opacity: 0.5 }} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: 'currentColor', opacity: 0.5 }} dx={-10} />
                                <Tooltip 
                                    contentStyle={{ backgroundColor: 'hsl(var(--background))', borderColor: 'hsl(var(--border))', borderRadius: '8px' }}
                                    itemStyle={{ color: 'hsl(var(--foreground))' }}
                                />
                                <Line type="monotone" dataKey="users" stroke="hsl(var(--secondary))" strokeWidth={3} dot={{ r: 4, fill: 'hsl(var(--secondary))', strokeWidth: 2 }} activeDot={{ r: 6 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
            <div className="glass-card rounded-xl p-6">
                <h3 className="font-semibold mb-4">Recent Activity</h3>
                <div className="space-y-3">
                    {(data.data?.recentActivity ?? []).map((item) => (
                        <div key={item.id} className="flex items-center gap-3 py-2">
                            <div className={`w-2 h-2 rounded-full ${item.color}`} />
                            <span className="text-sm">{item.action}</span>
                            <span className="text-xs text-muted-foreground ml-auto">{item.time}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
