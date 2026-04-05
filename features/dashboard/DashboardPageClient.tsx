'use client';

import { PageHeader } from '@/components/layout/PageHeader';
import { KpiCard } from '@/components/data-display/KpiCard';
import { Activity, BarChart3, DollarSign, PieChart, TrendingUp, Users, Loader2 } from 'lucide-react';
import { useDashboard } from '@/features/dashboard/useDashboard';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
    DollarSign,
    Users,
    Activity,
    TrendingUp,
};

export function DashboardPageClient() {
    const { data, isLoading, isError } = useDashboard();

    if (isLoading) return <div className="min-h-[40vh] flex items-center justify-center"><Loader2 className="w-6 h-6 animate-spin" /></div>;
    if (isError || !data) return <div className="text-sm text-danger">Failed to load dashboard data.</div>;

    return (
        <div className="animate-fade-in">
            <PageHeader title="Dashboard" description="Overview of your key business metrics and AI insights." />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {data.data.kpis.map((kpi) => (
                    <KpiCard key={kpi.id} title={kpi.title} value={kpi.value} changePercent={kpi.changePercent} trend={kpi.trend} icon={kpi.icon ? iconMap[kpi.icon] : undefined} />
                ))}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                <div className="glass-card rounded-xl p-6"><div className="flex items-center justify-between mb-4"><h3 className="font-semibold">Revenue Trend</h3><BarChart3 className="w-5 h-5 text-muted-foreground" /></div><div className="h-64 flex items-center justify-center text-muted-foreground text-sm border border-dashed border-border rounded-lg">Chart placeholder ready for Recharts integration</div></div>
                <div className="glass-card rounded-xl p-6"><div className="flex items-center justify-between mb-4"><h3 className="font-semibold">User Distribution</h3><PieChart className="w-5 h-5 text-muted-foreground" /></div><div className="h-64 flex items-center justify-center text-muted-foreground text-sm border border-dashed border-border rounded-lg">Query-driven dashboard shell is now connected</div></div>
            </div>
            <div className="glass-card rounded-xl p-6">
                <h3 className="font-semibold mb-4">Recent Activity</h3>
                <div className="space-y-3">
                    {data.data.recentActivity.map((item) => (
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
