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
	const roleName: RoleName | null = user ? user.role.name : null;

	/**
	 * Checks if the user holds one of the specified roles
	 */
	const hasRole = (roles: RoleName | RoleName[]): boolean => {
		if (!roleName) return false;
		if (Array.isArray(roles)) {
			return roles.includes(roleName);
		}
		return roleName === roles;
	};

	/**
	 * Checks if the user holds a specific permission
	 * based on their role's defined abilities.
	 */
	const hasPermission = (permission: PermissionKey): boolean => {
		if (!roleName) return false;
		const perms = ROLE_PERMISSIONS[roleName];
		return perms ? perms.includes(permission) : false;
	};

	/**
	 * Helper to check multiple permissions (requires ALL of them)
	 */
	const hasAllPermissions = (permissions: PermissionKey[]): boolean => {
		if (!roleName) return false;
		const perms = ROLE_PERMISSIONS[roleName] || [];
		return permissions.every((p) => perms.includes(p));
	};

	/**
	 * Helper to check if the user has AL LEAST ONE of the required permissions
	 */
	const hasAnyPermission = (permissions: PermissionKey[]): boolean => {
		if (!roleName) return false;
		const perms = ROLE_PERMISSIONS[roleName] || [];
		return permissions.some((p) => perms.includes(p));
	};

	/** True only when the user has the 'admin' role */
	const isAdmin = roleName === "admin";

	/** True when the user can access any part of the admin panel */
	const canAccessAdmin = hasAnyPermission([
		"admin:users",
		"admin:roles",
		"admin:access-requests",
	]);

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
