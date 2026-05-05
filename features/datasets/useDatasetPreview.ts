import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api/api-client";

export type DatasetView = "cleaned" | "customer" | "monthly";

export interface DatasetPreview {
	upload_id: number;
	view: DatasetView;
	table: string | null;
	available: boolean;
	total_rows: number;
	columns: string[];
	rows: Array<Record<string, string | number | boolean | null>>;
}

export function useDatasetPreview(id: string, view: DatasetView, limit = 50) {
	return useQuery({
		queryKey: ["datasets", "preview", id, view, limit],
		queryFn: () =>
			apiClient.get<DatasetPreview>(
				`/datasets/${id}/preview/${view}?limit=${limit}`,
			),
		enabled: !!id,
	});
}