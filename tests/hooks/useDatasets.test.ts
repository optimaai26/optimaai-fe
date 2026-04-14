import { renderHook, waitFor } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Providers } from "@/components/providers/Providers";
import { useCreateDataset, useDatasets } from "@/features/datasets/useDatasets";

describe("useDatasets integration", () => {
	it("fetches a list of datasets from MSW", async () => {
		const { result } = renderHook(() => useDatasets(), { wrapper: Providers });

		expect(result.current.isLoading).toBe(true);
		expect(result.current.data?.data).toBeUndefined();

		await waitFor(() => {
			expect(result.current.isSuccess).toBe(true);
			expect(result.current.data?.data).toBeDefined();
			expect(Array.isArray(result.current.data?.data)).toBe(true);
		});
	});

	it("allows triggering standard dataset creation", async () => {
		const { result } = renderHook(() => useCreateDataset(), {
			wrapper: Providers,
		});

		const testPayload = {
			name: "Test DB",
			source: "CSV",
			rowCount: 100,
			storageSize: "1MB",
		};

		result.current.mutate(testPayload as any);

		await waitFor(() => {
			expect(result.current.isSuccess).toBe(true);
		});
	});
});
