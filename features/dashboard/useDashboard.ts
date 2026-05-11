/**
 * features/dashboard/useDashboard.ts
 *
 * TanStack Query hook for the live dashboard stats endpoint.
 * Caches for 60s — fresh enough for a dashboard, avoids hammering
 * Postgres if the user navigates away and back quickly.
 */
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api/api-client';

export interface DashboardKpis {
  total_customers: number;
  total_orders: number;
  avg_order_value: number;
  total_revenue: number;
}

export interface RevenueTrendPoint {
  period: string; // "2024-04"
  revenue: number;
}

export interface TopCategoryRow {
  category: string;
  revenue: number;
}

export interface DashboardStats {
  status: 'success' | 'no_data';
  source_file?: string;
  uploaded_at?: string;
  currency?: string;
  message?: string;
  kpis: DashboardKpis;
  charts: {
    revenue_trend: RevenueTrendPoint[];
    top_categories: TopCategoryRow[];
  };
  detected_columns?: Record<string, string | null>;
}

export function useDashboardStats(userId: number = 1) {
  return useQuery<DashboardStats, Error>({
    queryKey: ['dashboard-stats', userId],
    queryFn: () => apiClient.get<DashboardStats>(`/dashboard/stats?user_id=${userId}`),
    staleTime: 60 * 1000, // 1 min before refetch on focus
    refetchOnWindowFocus: false, // dashboards don't need this
  });
}
