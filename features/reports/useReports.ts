import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api/api-client';
import type { ApiResponse, Report } from '@/types';

export function useReports() {
    return useQuery({
        queryKey: ['reports'],
        queryFn: () => apiClient.get<ApiResponse<Report[]>>('/reports'),
    });
}
