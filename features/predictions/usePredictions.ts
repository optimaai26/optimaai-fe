import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api/api-client";
import type { PastPrediction } from "@/types";

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
