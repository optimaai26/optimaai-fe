import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api/api-client";
import type { PastPrediction, Prediction } from "@/types";

export function usePredictions() {
	return useQuery({
		queryKey: ["predictions"],
		queryFn: () =>
			apiClient.get<{ data: PastPrediction[] }>("/predictions"),
	});
}

export function useCreatePrediction() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (payload: Partial<Prediction>) =>
			apiClient.post<{ data: Prediction }>(
				"/predictions",
				payload as Record<string, unknown>,
			),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["predictions"] });
		},
	});
}

export function usePredictionDetail(id: string | null) {
	return useQuery({
		queryKey: ["predictions", id],
		queryFn: () =>
			apiClient.get<{ data: PastPrediction }>(`/predictions/${id}`),
		enabled: !!id,
	});
}