import { PageHeader } from '@/components/layout/PageHeader';
import { KpiCard } from '@/components/data-display/KpiCard';
import { TrendingUp, Users, DollarSign, Activity, BarChart3, PieChart } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Dashboard' };

const kpiData = [
    {
        id: '1',
        title: 'Total Revenue',
        value: '$124,500',
        changePercent: 12.5,
        trend: 'up' as const,
        icon: 'DollarSign',
    },
    {
        id: '2',
        title: 'Active Users',
        value: '2,340',
        changePercent: 8.1,
        trend: 'up' as const,
        icon: 'Users',
    },
    {
        id: '3',
        title: 'Churn Rate',
        value: '3.2%',
        changePercent: -0.8,
        trend: 'down' as const,
        icon: 'Activity',
    },
    {
        id: '4',
        title: 'Growth Score',
        value: '87/100',
        changePercent: 4.2,
        trend: 'up' as const,
        icon: 'TrendingUp',
    },
];

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
    DollarSign,
    Users,
    Activity,
    TrendingUp,
};

export default function DashboardPage() {
    return (
        <div className="animate-fade-in">
            <PageHeader
                title="Dashboard"
                description="Overview of your key business metrics and AI insights."
            />

            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {kpiData.map((kpi) => (
                    <KpiCard
                        key={kpi.id}
                        title={kpi.title}
                        value={kpi.value}
                        changePercent={kpi.changePercent}
                        trend={kpi.trend}
                        icon={iconMap[kpi.icon]}
                    />
                ))}
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                <div className="glass-card rounded-xl p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold">Revenue Trend</h3>
                        <BarChart3 className="w-5 h-5 text-muted-foreground" />
                    </div>
                    <div className="h-64 flex items-center justify-center text-muted-foreground text-sm border border-dashed border-border rounded-lg">
                        Chart placeholder — connect to Recharts
                    </div>
                </div>

                <div className="glass-card rounded-xl p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold">User Distribution</h3>
                        <PieChart className="w-5 h-5 text-muted-foreground" />
                    </div>
                    <div className="h-64 flex items-center justify-center text-muted-foreground text-sm border border-dashed border-border rounded-lg">
                        Chart placeholder — connect to Recharts
                    </div>
                </div>
            </div>

            {/* Recent Activity */}
            <div className="glass-card rounded-xl p-6">
                <h3 className="font-semibold mb-4">Recent Activity</h3>
                <div className="space-y-3">
                    {[
                        { action: 'New dataset uploaded', time: '2 minutes ago', color: 'bg-success' },
                        { action: 'Churn prediction completed', time: '15 minutes ago', color: 'bg-primary-400' },
                        { action: 'AI insight generated', time: '1 hour ago', color: 'bg-info' },
                        { action: 'Revenue forecast updated', time: '3 hours ago', color: 'bg-warning' },
                    ].map((item) => (
                        <div key={item.action} className="flex items-center gap-3 py-2">
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
