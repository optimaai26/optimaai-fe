import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api/api-client";
import type { User } from "@/types";

export function useUsers() {
	return useQuery<{ data: User[] }>({
		queryKey: ["users"],
		queryFn: () => apiClient.get<{ data: User[] }>("/users"),
	});
}
