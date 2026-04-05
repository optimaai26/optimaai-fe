import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api/api-client';
import type { ApiResponse, DashboardOverview } from '@/types';

export function useDashboard() {
    return useQuery({
        queryKey: ['dashboard'],
        queryFn: () => apiClient.get<ApiResponse<DashboardOverview>>('/dashboard'),
    });
}
