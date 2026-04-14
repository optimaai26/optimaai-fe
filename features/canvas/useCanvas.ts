import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api/api-client";
import type { ApiResponse, CanvasBlock } from "@/types";

const QUERY_KEY = ["canvas"] as const;

export function useCanvas() {
	return useQuery({
		queryKey: QUERY_KEY,
		queryFn: () => apiClient.get<ApiResponse<CanvasBlock[]>>("/canvas"),
	});
}

export function useAddCanvasBlock() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (data: Omit<CanvasBlock, "id">) =>
			apiClient.post<ApiResponse<CanvasBlock>>("/canvas", data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: QUERY_KEY });
		},
	});
}

export function useUpdateCanvasBlock() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: ({
			id,
			...data
		}: {
			id: string;
			content?: string;
			section?: string;
			order?: number;
		}) => apiClient.patch<ApiResponse<CanvasBlock>>(`/canvas/${id}`, data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: QUERY_KEY });
		},
	});
}

export function useDeleteCanvasBlock() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (id: string) => apiClient.delete(`/canvas/${id}`),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: QUERY_KEY });
		},
	});
}
