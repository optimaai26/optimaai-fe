import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api/api-client";
import type { Insight } from "@/types";

export function useInsights() {
	return useQuery<{ data: Insight[] }>({
		queryKey: ["insights"],
		queryFn: () => apiClient.get<{ data: Insight[] }>("/insights"),
	});
}
