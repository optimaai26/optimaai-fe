import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api/api-client";
import type { Role } from "@/types";

export function useRoles() {
	return useQuery<{ data: Role[] }>({
		queryKey: ["roles"],
		queryFn: () => apiClient.get<{ data: Role[] }>("/roles"),
	});
}
