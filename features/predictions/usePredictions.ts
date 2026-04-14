import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api/api-client";
import type { Prediction } from "@/types";

export function usePredictions() {
	return useQuery<{ data: Prediction[] }>({
		queryKey: ["predictions"],
		queryFn: () => apiClient.get<{ data: Prediction[] }>("/predictions"),
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
