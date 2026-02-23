import { PageHeader } from '@/components/layout/PageHeader';
import { KpiCard } from '@/components/data-display/KpiCard';
import OverviewChart from '@/components/data-display/OverviewChart';
import DistributionChart from '@/components/data-display/DistributionChart';
import { TrendingUp, Users, DollarSign, Activity, BarChart3, PieChart as PieChartIcon } from 'lucide-react';
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

const revenueData = [
    { name: 'Jan', total: 4500 },
    { name: 'Feb', total: 5200 },
    { name: 'Mar', total: 4800 },
    { name: 'Apr', total: 6100 },
    { name: 'May', total: 5900 },
    { name: 'Jun', total: 7200 },
];

const userData = [
    { name: 'New', value: 400 },
    { name: 'Active', value: 300 },
    { name: 'Inactive', value: 200 },
    { name: 'Churned', value: 100 },
];

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
    DollarSign,
    Users,
    Activity,
    TrendingUp,
};

export default function DashboardPage() {
    return (
        <div className="animate-fade-in space-y-8">
            <PageHeader
                title="Dashboard"
                description="Overview of your key business metrics and AI insights."
            />

            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="glass-card rounded-xl p-6 transition-all hover:border-primary/50">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="font-semibold text-lg">Revenue Trend</h3>
                        <BarChart3 className="w-5 h-5 text-muted-foreground" />
                    </div>
                    <div className="h-80 w-full">
                        <OverviewChart data={revenueData} />
                    </div>
                </div>

                <div className="glass-card rounded-xl p-6 transition-all hover:border-primary/50">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="font-semibold text-lg">User Distribution</h3>
                        <PieChartIcon className="w-5 h-5 text-muted-foreground" />
                    </div>
                    <div className="h-80 w-full">
                        <DistributionChart data={userData} />
                    </div>
                </div>
            </div>

            {/* Recent Activity */}
            <div className="glass-card rounded-xl p-6">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="font-semibold text-lg">Recent Intelligence Activity</h3>
                    <Activity className="w-5 h-5 text-primary" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                        { action: 'New dataset "Sales_Q4.csv" uploaded', time: '2 minutes ago', color: 'bg-emerald-500' },
                        { action: 'Churn prediction for "Enterprise tier" completed', time: '15 minutes ago', color: 'bg-indigo-500' },
                        { action: 'AI strategic insight generated for Market Expansion', time: '1 hour ago', color: 'bg-amber-500' },
                        { action: 'Revenue forecast updated for next quarter', time: '3 hours ago', color: 'bg-rose-500' },
                    ].map((item) => (
                        <div key={item.action} className="flex items-center gap-4 p-3 rounded-lg bg-muted/30 border border-transparent hover:border-border hover:bg-muted/50 transition-all">
                            <div className={`w-3 h-3 rounded-full shrink-0 ${item.color} shadow-[0_0_8px_rgba(0,0,0,0.1)]`} />
                            <div className="flex flex-col gap-0.5 min-w-0">
                                <span className="text-sm font-medium truncate">{item.action}</span>
                                <span className="text-xs text-muted-foreground">{item.time}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
