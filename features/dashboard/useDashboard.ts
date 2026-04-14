import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api/api-client";
import type { DashboardOverview } from "@/types";

export function useDashboard() {
	return useQuery<{ data: DashboardOverview }>({
		queryKey: ["dashboard"],
		queryFn: () => apiClient.get<{ data: DashboardOverview }>("/dashboard"),
	});
}
