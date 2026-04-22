import { useMutation, useQueries, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api/api-client";
import type {
	MappingSuggestion,
	ModelKind,
	PredictionResult,
	SavedMapping,
} from "@/types";

/** One row from an aggregate table (customer or monthly) */
export interface AggregateRow {
	label: string;
	features: Record<string, string | number | boolean | null>;
}

export interface AggregateRowsResponse {
	upload_id: number;
	model_kind: ModelKind;
	table: string | null;
	rows: AggregateRow[];
}

/** Auto-suggest mapping for upload + model kind */
export function useSuggestMapping(
	uploadId: number | null,
	modelKind: ModelKind,
) {
	return useQuery({
		queryKey: ["mapping", "suggest", uploadId, modelKind],
		queryFn: async () => {
			if (uploadId === null) throw new Error("No upload selected");
			return apiClient.post<MappingSuggestion>(
				`/mapping/suggest/${uploadId}?model_kind=${modelKind}`,
				{},
			);
		},
		enabled: uploadId !== null,
	});
}

/** Fetch suggestions for ALL model kinds in parallel — used by the recommendation screen */
export function useSuggestAllMappings(uploadId: number | null) {
	return useQueries({
		queries: (["revenue", "churn", "growth"] as ModelKind[]).map((kind) => ({
			queryKey: ["mapping", "suggest", uploadId, kind],
			queryFn: async () => {
				if (uploadId === null) throw new Error("No upload selected");
				return apiClient.post<MappingSuggestion>(
					`/mapping/suggest/${uploadId}?model_kind=${kind}`,
					{},
				);
			},
			enabled: uploadId !== null,
		})),
		combine: (results) => {
			const allDone = results.every((r) => !r.isLoading && !r.isFetching);
			const anyError = results.some((r) => r.isError);
			const allHaveData = results.every((r) => r.data !== undefined);
			return {
				isLoading: !allDone,
				isError: anyError,
				data:
					allDone && !anyError && allHaveData
						? (results.map((r) => r.data) as MappingSuggestion[])
						: null,
			};
		},
	});
}

/** Fetch rows from the aggregate table (customers for churn, months for growth) */
export function useAggregateRows(
	uploadId: number | null,
	modelKind: ModelKind | null,
) {
	return useQuery({
		queryKey: ["mapping", "aggregate-rows", uploadId, modelKind],
		queryFn: () => {
			if (uploadId === null || !modelKind) {
				throw new Error("Upload ID and model kind required");
			}
			return apiClient.get<AggregateRowsResponse>(
				`/mapping/aggregate-rows/${uploadId}/${modelKind}`,
			);
		},
		enabled:
			uploadId !== null &&
			modelKind !== null &&
			(modelKind === "churn" || modelKind === "growth"),
	});
}

/** Save a user-edited mapping */
export function useSaveMapping() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (payload: {
			upload_id: number;
			model_kind: ModelKind;
			mapping: Record<string, string | null>;
		}) => apiClient.post<SavedMapping>("/mapping/save", payload),
		onSuccess: (_, vars) => {
			queryClient.invalidateQueries({
				queryKey: ["mapping", "saved", vars.upload_id, vars.model_kind],
			});
		},
	});
}

/** Run a prediction using the saved mapping */
export function useRunPrediction() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (payload: {
			upload_id: number;
			model_kind: ModelKind;
			user_features: Record<string, unknown>;
		}) => apiClient.post<PredictionResult>("/mapping/predict", payload),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["predictions"] });
		},
	});
}