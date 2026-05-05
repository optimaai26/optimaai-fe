import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api/api-client";
import type { ApiResponse, Dataset, PaginatedResponse } from "@/types";

/* ==========================================
 * Dataset Query Hooks
 * TanStack Query wrappers for datasets CRUD
 * ========================================== */

const QUERY_KEY = ["datasets"] as const;

/** Backend shape (snake_case, flat array) */
type BackendDataset = {
	id: number;
	name: string;
	file: string;
	table_name: string;
	rows: number;
	columns: number;
	quality_before: number | null;
	quality_after: number | null;
	uploaded_at: string | null;
	status: string;
	user_id: number;
};

type BackendDatasetDetail = {
	id: number;
	user_id: number;
	file: string;
	table_name: string;
	rows: number;
	columns: number;
	quality_before: number | null;
	quality_after: number | null;
	uploaded_at: string | null;
	status: string;
};

/** Convert backend row → frontend Dataset */
function toDataset(r: BackendDataset): Dataset {
	const now = new Date().toISOString();
	return {
		id: String(r.id),
		name: r.name,
		fileName: r.file,
		fileUrl: "",
		status: (r.status as Dataset["status"]) ?? "completed",
		rowCount: r.rows ?? 0,
		columnCount: r.columns ?? 0,
		uploadedBy: `user-${r.user_id}`,
		createdAt: r.uploaded_at ?? now,
		updatedAt: r.uploaded_at ?? now,
	} as Dataset;
}

/** Fetch paginated datasets list */
export function useDatasets(page = 1, pageSize = 20) {
	return useQuery({
		queryKey: [...QUERY_KEY, { page, pageSize }],
		queryFn: async () => {
			const raw = await apiClient.get<BackendDataset[]>("/datasets/");
			const datasets = raw.map(toDataset);
			return {
				data: datasets,
				page: 1,
				pageSize: datasets.length,
				total: datasets.length,
			} as PaginatedResponse<Dataset>;
		},
	});
}

/** Fetch single dataset by ID */
export function useDataset(id: string) {
	return useQuery({
		queryKey: [...QUERY_KEY, id],
		queryFn: async () => {
			const r = await apiClient.get<BackendDatasetDetail>(`/datasets/${id}`);
			const now = new Date().toISOString();
			const dataset: Dataset = {
				id: String(r.id),
				name: r.file.replace(/\.[^.]+$/, "").replace(/[-_]/g, " "),
				fileName: r.file,
				fileUrl: "",
				status: (r.status as Dataset["status"]) ?? "completed",
				rowCount: r.rows ?? 0,
				columnCount: r.columns ?? 0,
				uploadedBy: `user-${r.user_id}`,
				createdAt: r.uploaded_at ?? now,
				updatedAt: r.uploaded_at ?? now,
			} as Dataset;
			return { data: dataset } as ApiResponse<Dataset>;
		},
		enabled: !!id,
	});
}

/** Delete a dataset */
export function useDeleteDataset() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (id: string) => apiClient.delete(`/datasets/${id}`),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: QUERY_KEY });
		},
	});
}

/** Update dataset metadata */
export function useUpdateDataset() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({
			id,
			...data
		}: {
			id: string;
			name?: string;
			description?: string;
		}) => apiClient.patch<ApiResponse<Dataset>>(`/datasets/${id}`, data),
		onSuccess: (_, variables) => {
			queryClient.invalidateQueries({ queryKey: [...QUERY_KEY, variables.id] });
			queryClient.invalidateQueries({ queryKey: QUERY_KEY });
		},
	});
}