"use client";

import type { ReactNode } from "react";
import type { PermissionKey, RoleName } from "@/constants/permissions";
import { useRbac } from "@/hooks/useRbac";

interface UserRoleGateProps {
	children: ReactNode;
	fallback?: ReactNode;
	roles?: RoleName | RoleName[];
	permissions?: PermissionKey | PermissionKey[];
	requireAllPermissions?: boolean;
}

export function UserRoleGate({
	children,
	fallback = null,
	roles,
	permissions,
	requireAllPermissions = false,
}: UserRoleGateProps) {
	const { hasRole, hasPermission, hasAllPermissions, hasAnyPermission } =
		useRbac();

	let allowed = true;

	// Check roles
	if (roles) {
		allowed = allowed && hasRole(roles);
	}

	// Check permissions
	if (permissions && allowed) {
		const permsArray = Array.isArray(permissions) ? permissions : [permissions];
		if (requireAllPermissions) {
			allowed = allowed && hasAllPermissions(permsArray);
		} else {
			allowed = allowed && hasAnyPermission(permsArray);
		}
	}

	if (!allowed) {
		return fallback;
	}

	return <>{children}</>;
}
