import { renderHook, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { Providers } from "@/components/providers/Providers";
import { ROLE_NAMES } from "@/constants/permissions";
import { useAuth } from "@/features/auth/AuthProvider";

describe("useAuth", () => {
	it("initializes with null user", () => {
		const { result } = renderHook(() => useAuth(), { wrapper: Providers });
		expect(result.current.user).toBeNull();
	});

	it("can perform login with valid credentials", async () => {
		const { result } = renderHook(() => useAuth(), { wrapper: Providers });

		result.current.login({
			email: "test@example.com",
			password: "password123",
		});

		await waitFor(() => {
			expect(result.current.user).not.toBeNull();
			expect(result.current.user?.email).toBe("test@example.com");
			expect(ROLE_NAMES).toContain(result.current.user?.role.name);
		});
	});

	it("clears user upon logout", async () => {
		const { result } = renderHook(() => useAuth(), { wrapper: Providers });

		// Log in first
		result.current.login({
			email: "test@example.com",
			password: "password123",
		});

		await waitFor(() => expect(result.current.user).toBeTruthy());

		// Then log out
		result.current.logout();

		await waitFor(() => {
			expect(result.current.user).toBeNull();
		});
	});
});
