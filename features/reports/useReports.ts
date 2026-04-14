import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api/api-client";
import type { Report } from "@/types";

export function useReports() {
	return useQuery<{ data: Report[] }>({
		queryKey: ["reports"],
		queryFn: () => apiClient.get<{ data: Report[] }>("/reports"),
	});
}
