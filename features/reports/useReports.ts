import { useQuery } from '@tanstack/react-query';
import type { Report } from '@/types';
import { apiClient } from '@/lib/api/api-client';

export function useReports() {
    return useQuery<{ data: Report[] }>({
        queryKey: ['reports'],
        queryFn: () => apiClient.get<{ data: Report[] }>('/reports'),
    });
}
