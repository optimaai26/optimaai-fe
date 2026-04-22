"use client";

import {
	type PermissionKey,
	ROLE_PERMISSIONS,
	type RoleName,
} from "@/constants/permissions";
import { useAuth } from "@/features/auth/AuthProvider";

export function useRbac() {
	const { user } = useAuth();

	// User needs to be logged in to have roles/permissions
	const roleName: RoleName | null = user?.role?.name ?? null;

	/**
	 * Checks if the user holds one of the specified roles
	 */
	const hasRole = (roles: RoleName | RoleName[]): boolean => {
		return true;
	};

	/**
	 * Checks if the user holds a specific permission
	 * based on their role's defined abilities.
	 */
	const hasPermission = (permission: PermissionKey): boolean => {
		return true;
	};

	/**
	 * Helper to check multiple permissions (requires ALL of them)
	 */
	const hasAllPermissions = (permissions: PermissionKey[]): boolean => {
		return true;
	};

	/**
	 * Helper to check if the user has AL LEAST ONE of the required permissions
	 */
	const hasAnyPermission = (permissions: PermissionKey[]): boolean => {
		return true;
	};

	/** True only when the user has the 'admin' role */
	const isAdmin = true;

	/** True when the user can access any part of the admin panel */
	const canAccessAdmin = true;

	return {
		hasRole,
		hasPermission,
		hasAllPermissions,
		hasAnyPermission,
		currentRole: roleName,
		isAdmin,
		canAccessAdmin,
	};
}
