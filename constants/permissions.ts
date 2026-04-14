/* ==========================================
 * Permission & Role Constants
 * ========================================== */

export const ROLE_NAMES = ["admin", "manager", "analyst", "viewer"] as const;

export type RoleName = (typeof ROLE_NAMES)[number];

export const PERMISSIONS = [
	"datasets:read",
	"datasets:write",
	"datasets:delete",
	"predictions:read",
	"predictions:run",
	"insights:read",
	"canvas:read",
	"canvas:write",
	"reports:read",
	"reports:export",
	"admin:users",
	"admin:roles",
	"admin:access-requests",
	"view:department",
] as const;

export type PermissionKey = (typeof PERMISSIONS)[number];

/** Map roles to their default permission sets */
export const ROLE_PERMISSIONS: Record<RoleName, PermissionKey[]> = {
	admin: [
		"datasets:read",
		"datasets:write",
		"datasets:delete",
		"predictions:read",
		"predictions:run",
		"insights:read",
		"canvas:read",
		"canvas:write",
		"reports:read",
		"reports:export",
		"admin:users",
		"admin:roles",
		"admin:access-requests",
		"view:department",
	],
	manager: [
		"datasets:read",
		"datasets:write",
		"predictions:read",
		"predictions:run",
		"insights:read",
		"canvas:read",
		"canvas:write",
		"reports:read",
		"reports:export",
		"admin:access-requests",
		"view:department",
	],
	analyst: [
		"datasets:read",
		"datasets:write",
		"predictions:read",
		"predictions:run",
		"insights:read",
		"canvas:read",
		"reports:read",
	],
	viewer: [
		"datasets:read",
		"predictions:read",
		"insights:read",
		"canvas:read",
		"reports:read",
	],
};

/** Human-readable role labels */
export const ROLE_LABELS: Record<RoleName, string> = {
	admin: "Administrator",
	manager: "Manager",
	analyst: "Analyst",
	viewer: "Viewer",
};

/** Permission group labels for the permissions matrix UI */
export const PERMISSION_GROUPS = [
	{
		label: "Datasets",
		permissions: [
			"datasets:read",
			"datasets:write",
			"datasets:delete",
		] as PermissionKey[],
	},
	{
		label: "Predictions",
		permissions: ["predictions:read", "predictions:run"] as PermissionKey[],
	},
	{
		label: "Insights",
		permissions: ["insights:read"] as PermissionKey[],
	},
	{
		label: "Canvas",
		permissions: ["canvas:read", "canvas:write"] as PermissionKey[],
	},
	{
		label: "Reports",
		permissions: ["reports:read", "reports:export"] as PermissionKey[],
	},
	{
		label: "Administration",
		permissions: [
			"admin:users",
			"admin:roles",
			"admin:access-requests",
		] as PermissionKey[],
	},
	{
		label: "Dashboard",
		permissions: ["view:department"] as PermissionKey[],
	},
];
