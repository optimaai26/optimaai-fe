import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api/api-client';
import type { ApiResponse, CanvasBlock } from '@/types';

const QUERY_KEY = ['canvas'] as const;

export function useCanvas() {
    return useQuery({
        queryKey: QUERY_KEY,
        queryFn: () => apiClient.get<ApiResponse<CanvasBlock[]>>('/canvas'),
    });
}

export function useUpdateCanvasBlock() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, content }: { id: string; content: string }) => apiClient.patch<ApiResponse<CanvasBlock>>(`/canvas/${id}`, { content }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEY });
            queryClient.invalidateQueries({ queryKey: ['reports'] });
        },
    });
}
