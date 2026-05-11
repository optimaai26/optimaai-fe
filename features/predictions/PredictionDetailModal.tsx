'use client';

import { Loader2, X } from 'lucide-react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { usePredictionDetail } from '@/features/predictions/usePredictions';
import type { PastPrediction } from '@/types';

export function PredictionDetailModal({
  predictionId,
  onClose,
}: {
  predictionId: string | null;
  onClose: () => void;
}) {
  const { data, isLoading, isError } = usePredictionDetail(predictionId);
  const prediction = data?.data;

  if (!predictionId) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-md animate-fade-in">
      <div className="bg-background/95 backdrop-blur-xl border border-border/50 rounded-2xl shadow-2xl w-full max-w-3xl flex flex-col animate-slide-up max-h-[90vh]">
        <div className="flex items-center justify-between p-4 border-b border-border/50 bg-muted/20">
          <div className="flex items-center gap-2 font-semibold">
            Prediction Detail
            {prediction && (
              <span className="text-xs text-muted-foreground font-normal ml-2">
                {prediction.type} ·{' '}
                {prediction.createdAt ? new Date(prediction.createdAt).toLocaleString() : ''}
              </span>
            )}
          </div>
          <button type="button" onClick={onClose} className="p-1 hover:bg-muted rounded-md">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {isLoading && (
            <div className="min-h-[200px] flex items-center justify-center">
              <Loader2 className="w-6 h-6 animate-spin" />
            </div>
          )}
          {isError && <div className="text-sm text-danger">Failed to load prediction.</div>}
          {prediction && <DetailBody prediction={prediction} />}
        </div>

        <div className="flex items-center justify-end p-4 border-t border-border/50 bg-muted/20">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 text-sm font-semibold bg-primary text-primary-foreground rounded-lg"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

function DetailBody({ prediction }: { prediction: PastPrediction }) {
  const summary = prediction.result?.data as Record<string, unknown> | undefined;

  if (!summary) {
    return (
      <div className="text-sm text-muted-foreground">
        No detailed data available for this prediction.
      </div>
    );
  }

  const kind = prediction.type as string;

  if (kind === 'revenue_forecast' || kind === 'revenue_batch') {
    return <RevenueDetail summary={summary as unknown as RevenueSummary} />;
  }
  if (kind === 'churn' || kind === 'churn_batch') {
    return <ChurnDetail summary={summary as unknown as ChurnSummary} />;
  }
  if (kind === 'growth_scoring' || kind === 'growth_batch') {
    return <GrowthDetail summary={summary as unknown as GrowthSummary} />;
  }

  return (
    <pre className="text-xs p-3 bg-muted/30 rounded-md overflow-auto max-h-96">
      {JSON.stringify(summary, null, 2)}
    </pre>
  );
}

interface RevenueSummary {
  n_rows: number;
  total_predicted: number;
  avg_row_predicted: number;
  monthly_actual: Array<{ month: string; predicted_revenue: number }>;
  forward_forecast: Array<{ month: string; predicted_revenue: number }>;
}

interface ChurnSummary {
  n_customers: number;
  risk_counts: { high: number; medium: number; low: number };
  rows: Array<{
    customer_id: string;
    churn_probability: number;
    risk_level: 'low' | 'medium' | 'high';
  }>;
}

interface GrowthSummary {
  n_months_actual: number;
  n_months_forecast: number;
  actual: Array<{ month: string; actual_revenue: number }>;
  forecast: Array<{ month: string; predicted_revenue: number }>;
}

function RevenueDetail({ summary }: { summary: RevenueSummary }) {
  type Row = {
    month: string;
    historical: number | null;
    forecast: number | null;
  };

  const historical: Row[] = (summary.monthly_actual ?? []).map((m) => ({
    month: m.month,
    historical: m.predicted_revenue,
    forecast: null,
  }));

  const forecastPoints: Row[] = (summary.forward_forecast ?? []).map((f) => ({
    month: f.month,
    historical: null,
    forecast: f.predicted_revenue,
  }));

  if (historical.length > 0 && forecastPoints.length > 0) {
    const last = historical[historical.length - 1];
    forecastPoints.unshift({
      month: last.month,
      historical: null,
      forecast: last.historical,
    });
  }

  const chartData = [...historical, ...forecastPoints];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-3">
        <Stat label="Rows predicted" value={(summary.n_rows ?? 0).toLocaleString()} />
        <Stat
          label="Total predicted"
          value={`$${(summary.total_predicted ?? 0).toLocaleString()}`}
        />
        <Stat label="Avg per row" value={`$${(summary.avg_row_predicted ?? 0).toLocaleString()}`} />
      </div>
      {chartData.length > 0 && (
        <div className="glass-card p-4 rounded-xl">
          <div className="text-xs font-medium text-muted-foreground mb-2">
            Monthly revenue — historical + 12-month forecast
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-20" />
                <XAxis dataKey="month" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Line
                  type="monotone"
                  dataKey="historical"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  dot={{ r: 2 }}
                  name="Historical"
                  connectNulls
                />
                <Line
                  type="monotone"
                  dataKey="forecast"
                  stroke="#10b981"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  dot={{ r: 2 }}
                  name="Forecast"
                  connectNulls
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
}

function ChurnDetail({ summary }: { summary: ChurnSummary }) {
  const rc = summary.risk_counts ?? { high: 0, medium: 0, low: 0 };
  const distData = [
    { name: 'High', value: rc.high, fill: '#ef4444' },
    { name: 'Medium', value: rc.medium, fill: '#f59e0b' },
    { name: 'Low', value: rc.low, fill: '#10b981' },
  ];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-4 gap-3">
        <Stat label="Customers" value={(summary.n_customers ?? 0).toLocaleString()} />
        <Stat label="High risk" value={rc.high.toLocaleString()} tone="danger" />
        <Stat label="Medium risk" value={rc.medium.toLocaleString()} tone="warning" />
        <Stat label="Low risk" value={rc.low.toLocaleString()} tone="success" />
      </div>

      <div className="glass-card p-4 rounded-xl">
        <div className="text-xs font-medium text-muted-foreground mb-2">Risk distribution</div>
        <div className="h-40 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={distData}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-20" />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 10 }} />
              <Tooltip />
              <Bar dataKey="value" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="glass-card p-4 rounded-xl">
        <div className="text-xs font-medium text-muted-foreground mb-2">
          Top 20 at-risk customers
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left px-2 py-1.5 font-semibold text-muted-foreground">Rank</th>
                <th className="text-left px-2 py-1.5 font-semibold text-muted-foreground">
                  Customer ID
                </th>
                <th className="text-right px-2 py-1.5 font-semibold text-muted-foreground">
                  Probability
                </th>
                <th className="text-right px-2 py-1.5 font-semibold text-muted-foreground">Risk</th>
              </tr>
            </thead>
            <tbody>
              {(summary.rows ?? []).slice(0, 20).map((r, i) => {
                const riskColor =
                  r.risk_level === 'high'
                    ? 'text-danger'
                    : r.risk_level === 'medium'
                      ? 'text-warning'
                      : 'text-success';
                return (
                  <tr key={r.customer_id} className="border-b border-border last:border-0">
                    <td className="px-2 py-1.5 font-mono">{i + 1}</td>
                    <td className="px-2 py-1.5 font-mono">{r.customer_id}</td>
                    <td className="px-2 py-1.5 text-right font-mono">
                      {(r.churn_probability * 100).toFixed(1)}%
                    </td>
                    <td className={`px-2 py-1.5 text-right font-medium capitalize ${riskColor}`}>
                      {r.risk_level}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function GrowthDetail({ summary }: { summary: GrowthSummary }) {
  type MergedRow = { month: string; actual?: number; forecast?: number };
  const merged = new Map<string, MergedRow>();
  for (const a of summary.actual ?? []) {
    merged.set(a.month, { month: a.month, actual: a.actual_revenue });
  }
  for (const f of summary.forecast ?? []) {
    const existing = merged.get(f.month);
    if (existing) {
      existing.forecast = f.predicted_revenue;
    } else {
      merged.set(f.month, {
        month: f.month,
        forecast: f.predicted_revenue,
      });
    }
  }
  const chartData = Array.from(merged.values()).sort((a, b) => a.month.localeCompare(b.month));

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <Stat label="Months of history" value={(summary.n_months_actual ?? 0).toLocaleString()} />
        <Stat label="Forecast horizon" value={`${summary.n_months_forecast ?? 0} months`} />
      </div>
      {chartData.length > 0 && (
        <div className="glass-card p-4 rounded-xl">
          <div className="text-xs font-medium text-muted-foreground mb-2">Actual vs forecast</div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-20" />
                <XAxis dataKey="month" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Line
                  type="monotone"
                  dataKey="actual"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  dot={{ r: 2 }}
                  name="Actual"
                  connectNulls
                />
                <Line
                  type="monotone"
                  dataKey="forecast"
                  stroke="#10b981"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  dot={{ r: 2 }}
                  name="Forecast"
                  connectNulls
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
}

function Stat({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone?: 'success' | 'warning' | 'danger';
}) {
  const color =
    tone === 'danger'
      ? 'text-danger'
      : tone === 'warning'
        ? 'text-warning'
        : tone === 'success'
          ? 'text-success'
          : 'text-foreground';
  return (
    <div className="glass-card p-3 rounded-xl text-center">
      <div className="text-xs text-muted-foreground uppercase tracking-wider">{label}</div>
      <div className={`text-xl font-bold mt-1 ${color}`}>{value}</div>
    </div>
  );
}
