import { renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import * as authStore from "@/features/auth/AuthProvider";
import { useRbac } from "@/hooks/useRbac";

describe("useRbac logic", () => {
	it("returns false for everything if there is no user", () => {
		vi.spyOn(authStore, "useAuth").mockReturnValue({ user: null } as never);

		const { result } = renderHook(() => useRbac());

		expect(result.current.currentRole).toBeNull();
		expect(result.current.hasRole("admin")).toBe(false);
		expect(result.current.hasPermission("admin:users")).toBe(false);
	});

	it("returns true if the user has the required role", () => {
		vi.spyOn(authStore, "useAuth").mockReturnValue({
			user: { role: { name: "admin" } },
		} as never);

		const { result } = renderHook(() => useRbac());

		expect(result.current.hasRole("admin")).toBe(true);
		expect(result.current.hasRole(["manager", "admin"])).toBe(true);
		expect(result.current.hasRole("viewer")).toBe(false);
	});

	it("properly guards fine-grained permissions based on roles", () => {
		// Manager role definition
		vi.spyOn(authStore, "useAuth").mockReturnValue({
			user: { role: { name: "manager" } },
		} as never);

		const { result } = renderHook(() => useRbac());

		expect(result.current.hasPermission("admin:users")).toBe(false); // manager cannot view users
		expect(result.current.hasPermission("datasets:read")).toBe(true); // manager CAN read datasets
		expect(
			result.current.hasAllPermissions(["datasets:read", "admin:users"]),
		).toBe(false);
		expect(
			result.current.hasAnyPermission(["reports:export", "admin:users"]),
		).toBe(true);
	});
});
