import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api/api-client';
import type { AccessRequest, ApiResponse } from '@/types';

const QUERY_KEY = ['access-requests'] as const;

export function useAccessRequests() {
    return useQuery({
        queryKey: QUERY_KEY,
        queryFn: () => apiClient.get<ApiResponse<AccessRequest[]>>('/access-requests'),
    });
}

export function useReviewAccessRequest() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, status, reviewedBy }: { id: string; status: 'approved' | 'rejected'; reviewedBy?: string }) =>
            apiClient.patch<ApiResponse<AccessRequest>>(`/access-requests/${id}`, { status, reviewedBy }),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEY }),
    });
}
