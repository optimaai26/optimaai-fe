import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api/api-client";
import type { AccessRequest } from "@/types";

export function useAccessRequests() {
	return useQuery<{ data: AccessRequest[] }>({
		queryKey: ["access-requests"],
		queryFn: () => apiClient.get<{ data: AccessRequest[] }>("/access-requests"),
	});
}

export function useReviewAccessRequest() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (payload: {
			id: string;
			status: "approved" | "rejected";
			reviewedBy?: string;
		}) =>
			apiClient.patch(`/access-requests/${payload.id}`, {
				status: payload.status,
				reviewedBy: payload.reviewedBy,
			}),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["access-requests"] });
		},
	});
}
