'use client';

import {
  BarChart3,
  Database,
  DollarSign,
  Loader2,
  Package,
  ShoppingCart,
  TrendingUp,
  Users,
} from 'lucide-react';
/**
 * features/dashboard/DashboardPageClient.tsx
 *
 * Live, data-driven dashboard. Recomputes KPIs and charts on every page
 * load from the user's most recent uploaded dataset.
 *
 * Layout:
 *   ┌────────────────────────────────────────────────────────┐
 *   │ Title + subtitle + data-source badge                    │
 *   ├────────────┬────────────┬────────────┬────────────────┤
 *   │ ML KPI 1   │ ML KPI 2   │ ML KPI 3   │ ML KPI 4        │  ← existing
 *   ├────────────┼────────────┼────────────┼────────────────┤
 *   │ Customers  │ Orders     │ Avg Order  │ Total Revenue   │  ← NEW
 *   ├────────────┴────────────┼────────────┴────────────────┤
 *   │ Revenue Trend (line)    │ Top Categories (h-bar)       │  ← NEW
 *   └─────────────────────────┴──────────────────────────────┘
 *
 * The 4 ML KPI cards keep their original behaviour (driven by the ML
 * evaluation snapshot). The 4 new data KPIs come from the live
 * dashboard endpoint.
 */
import { useMemo } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import {
  type DashboardKpis,
  type DashboardStats,
  useDashboardStats,
} from '@/features/dashboard/useDashboard';

// ──────────────────────────────────────────────────────────────────
//  Public component
// ──────────────────────────────────────────────────────────────────

export function DashboardLiveStats() {
  const { data, isLoading, isError, error } = useDashboardStats(1);

  if (isLoading) {
    return (
      <div className="glass-card rounded-2xl border border-border p-8 text-center">
        <Loader2 className="w-5 h-5 animate-spin text-primary mx-auto mb-2" />
        <p className="text-sm text-muted-foreground">
          Computing fresh stats from your uploaded data…
        </p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="glass-card rounded-xl border border-danger/30 p-4 text-sm text-danger">
        Failed to load dashboard stats: {error?.message}
      </div>
    );
  }

  if (!data || data.status === 'no_data') {
    return <EmptyState message={data?.message} />;
  }

  return (
    <div className="space-y-6">
      <DataSourceBadge data={data} />
      <KpiGrid kpis={data.kpis} currency={data.currency ?? 'EGP'} />
      <ChartsGrid
        trend={data.charts.revenue_trend}
        topCategories={data.charts.top_categories}
        currency={data.currency ?? 'EGP'}
      />
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────
//  Sub-components
// ──────────────────────────────────────────────────────────────────

function DataSourceBadge({ data }: { data: DashboardStats }) {
  const uploadedAt = data.uploaded_at ? new Date(data.uploaded_at).toLocaleString() : 'Unknown';

  return (
    <div className="glass-card rounded-xl border border-border px-4 py-2.5 text-xs text-muted-foreground flex items-center gap-3 flex-wrap">
      <Database className="w-3.5 h-3.5 shrink-0" />
      <span>
        Computed from <strong className="text-foreground">{data.source_file}</strong> · uploaded{' '}
        {uploadedAt} · currency <strong className="text-foreground">{data.currency}</strong>
      </span>
    </div>
  );
}

function KpiGrid({ kpis, currency }: { kpis: DashboardKpis; currency: string }) {
  const fmt = useMemo(() => new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }), []);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <KpiCard
        title="Total Customers"
        value={fmt.format(kpis.total_customers)}
        icon={Users}
        hint="Distinct customer IDs"
      />
      <KpiCard
        title="Total Orders"
        value={fmt.format(kpis.total_orders)}
        icon={ShoppingCart}
        hint="Distinct order IDs"
      />
      <KpiCard
        title="Avg Order Value"
        value={`${currency} ${fmt.format(kpis.avg_order_value)}`}
        icon={Package}
        hint="Mean revenue per order"
      />
      <KpiCard
        title="Total Revenue"
        value={`${currency} ${fmt.format(kpis.total_revenue)}`}
        icon={DollarSign}
        hint="Sum across all orders"
        accent
      />
    </div>
  );
}

function KpiCard({
  title,
  value,
  icon: Icon,
  hint,
  accent = false,
}: {
  title: string;
  value: string;
  icon: typeof Users;
  hint?: string;
  accent?: boolean;
}) {
  return (
    <div
      className={[
        'glass-card rounded-2xl border border-border p-5 transition',
        'hover:border-primary/40 hover:shadow-sm',
        accent ? 'ring-1 ring-primary/20 bg-primary/[0.03]' : '',
      ].join(' ')}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
            {title}
          </p>
          <p className="mt-2 text-2xl font-bold tabular-nums truncate">{value}</p>
        </div>
        <div
          className={[
            'p-2 rounded-lg shrink-0',
            accent ? 'bg-primary text-primary-foreground' : 'bg-primary/10 text-primary',
          ].join(' ')}
        >
          <Icon className="w-4 h-4" />
        </div>
      </div>
      {hint && <p className="mt-2 text-[11px] text-muted-foreground">{hint}</p>}
    </div>
  );
}

function ChartsGrid({
  trend,
  topCategories,
  currency,
}: {
  trend: { period: string; revenue: number }[];
  topCategories: { category: string; revenue: number }[];
  currency: string;
}) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
      <RevenueTrendCard data={trend} currency={currency} />
      <TopCategoriesCard data={topCategories} currency={currency} />
    </div>
  );
}

function RevenueTrendCard({
  data,
  currency,
}: {
  data: { period: string; revenue: number }[];
  currency: string;
}) {
  if (!data.length) {
    return (
      <ChartShell
        className="lg:col-span-3"
        title="Revenue Trend"
        icon={TrendingUp}
        empty="No date or revenue column detected in your data — upload a CSV with order dates to see the trend."
      />
    );
  }

  const fmt = (v: number) =>
    v >= 1_000_000
      ? `${(v / 1_000_000).toFixed(1)}M`
      : v >= 1_000
        ? `${(v / 1_000).toFixed(0)}k`
        : `${v}`;

  return (
    <ChartShell
      className="lg:col-span-3"
      title="Revenue Trend"
      icon={TrendingUp}
      subtitle={`Last ${data.length} months · ${currency}`}
    >
      <ResponsiveContainer width="100%" height={260}>
        <LineChart data={data} margin={{ top: 8, right: 16, bottom: 0, left: -8 }}>
          <CartesianGrid stroke="currentColor" strokeDasharray="3 3" opacity={0.1} />
          <XAxis dataKey="period" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
          <YAxis tick={{ fontSize: 11 }} tickLine={false} axisLine={false} tickFormatter={fmt} />
          <Tooltip
            contentStyle={{
              background: 'var(--background)',
              border: '1px solid var(--border)',
              borderRadius: 8,
              fontSize: 12,
            }}
            formatter={(value: number | undefined) => [
              value !== undefined ? `${currency} ${value.toLocaleString()}` : `${currency} 0`,
              'Revenue',
            ]}
          />
          <Line
            type="monotone"
            dataKey="revenue"
            stroke="var(--primary)"
            strokeWidth={2.5}
            dot={{ r: 3, fill: 'var(--primary)' }}
            activeDot={{ r: 5 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </ChartShell>
  );
}

function TopCategoriesCard({
  data,
  currency,
}: {
  data: { category: string; revenue: number }[];
  currency: string;
}) {
  if (!data.length) {
    return (
      <ChartShell
        className="lg:col-span-2"
        title="Top Categories"
        icon={BarChart3}
        empty="No category column detected. Upload data with a `Category` column to see the breakdown."
      />
    );
  }

  return (
    <ChartShell
      className="lg:col-span-2"
      title="Top Categories"
      icon={BarChart3}
      subtitle={`By revenue · ${currency}`}
    >
      <ResponsiveContainer width="100%" height={260}>
        <BarChart data={data} layout="vertical" margin={{ top: 4, right: 16, bottom: 0, left: 8 }}>
          <CartesianGrid
            stroke="currentColor"
            strokeDasharray="3 3"
            opacity={0.1}
            horizontal={false}
          />
          <XAxis
            type="number"
            tick={{ fontSize: 11 }}
            tickLine={false}
            axisLine={false}
            tickFormatter={(v) =>
              v >= 1_000_000
                ? `${(v / 1_000_000).toFixed(1)}M`
                : v >= 1_000
                  ? `${(v / 1_000).toFixed(0)}k`
                  : `${v}`
            }
          />
          <YAxis
            type="category"
            dataKey="category"
            tick={{ fontSize: 11 }}
            tickLine={false}
            axisLine={false}
            width={70}
          />
          <Tooltip
            contentStyle={{
              background: 'var(--background)',
              border: '1px solid var(--border)',
              borderRadius: 8,
              fontSize: 12,
            }}
            formatter={(value: number | undefined) => [
              value !== undefined ? `${currency} ${value.toLocaleString()}` : `${currency} 0`,
              'Revenue',
            ]}
          />
          <Bar dataKey="revenue" fill="var(--primary)" radius={[0, 6, 6, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </ChartShell>
  );
}

function ChartShell({
  title,
  subtitle,
  icon: Icon,
  children,
  className = '',
  empty,
}: {
  title: string;
  subtitle?: string;
  icon: typeof Users;
  children?: React.ReactNode;
  className?: string;
  empty?: string;
}) {
  return (
    <div className={`glass-card rounded-2xl border border-border p-5 ${className}`}>
      <div className="flex items-center gap-2 mb-1">
        <div className="p-1.5 rounded-md bg-primary/10 text-primary">
          <Icon className="w-3.5 h-3.5" />
        </div>
        <h3 className="font-semibold text-sm">{title}</h3>
      </div>
      {subtitle && <p className="text-xs text-muted-foreground mb-3">{subtitle}</p>}
      {empty ? (
        <div className="flex items-center justify-center h-[220px] text-xs text-muted-foreground text-center px-6">
          {empty}
        </div>
      ) : (
        <div className="mt-2">{children}</div>
      )}
    </div>
  );
}

function EmptyState({ message }: { message?: string }) {
  return (
    <div className="glass-card rounded-2xl border border-border p-8 text-center space-y-3">
      <div className="inline-flex p-3 rounded-full bg-amber-100 text-amber-700">
        <Database className="w-6 h-6" />
      </div>
      <h3 className="font-semibold">No data uploaded yet</h3>
      <p className="text-sm text-muted-foreground max-w-md mx-auto">
        {message ?? 'Upload at least one CSV through the Datasets page to populate your dashboard.'}
      </p>
      <a
        href="/datasets"
        className="inline-block px-4 py-2 mt-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium"
      >
        Go to Datasets →
      </a>
    </div>
  );
}
