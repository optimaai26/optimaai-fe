import type { PermissionKey, RoleName } from '@/types';

/* ==========================================
 * Permission & Role Constants
 * ========================================== */

/** Map roles to their default permission sets */
export const ROLE_PERMISSIONS: Record<RoleName, PermissionKey[]> = {
    admin: [
        'datasets:read', 'datasets:write', 'datasets:delete',
        'predictions:read', 'predictions:run',
        'insights:read',
        'canvas:read', 'canvas:write',
        'reports:read', 'reports:export',
        'admin:users', 'admin:roles', 'admin:access-requests',
    ],
    manager: [
        'datasets:read', 'datasets:write',
        'predictions:read', 'predictions:run',
        'insights:read',
        'canvas:read', 'canvas:write',
        'reports:read', 'reports:export',
        'admin:access-requests',
    ],
    analyst: [
        'datasets:read', 'datasets:write',
        'predictions:read', 'predictions:run',
        'insights:read',
        'canvas:read',
        'reports:read',
    ],
    viewer: [
        'datasets:read',
        'predictions:read',
        'insights:read',
        'canvas:read',
        'reports:read',
    ],
};

/** Human-readable role labels */
export const ROLE_LABELS: Record<RoleName, string> = {
    admin: 'Administrator',
    manager: 'Manager',
    analyst: 'Analyst',
    viewer: 'Viewer',
};

/** Permission group labels for the permissions matrix UI */
export const PERMISSION_GROUPS = [
    {
        label: 'Datasets',
        permissions: ['datasets:read', 'datasets:write', 'datasets:delete'] as PermissionKey[],
    },
    {
        label: 'Predictions',
        permissions: ['predictions:read', 'predictions:run'] as PermissionKey[],
    },
    {
        label: 'Insights',
        permissions: ['insights:read'] as PermissionKey[],
    },
    {
        label: 'Canvas',
        permissions: ['canvas:read', 'canvas:write'] as PermissionKey[],
    },
    {
        label: 'Reports',
        permissions: ['reports:read', 'reports:export'] as PermissionKey[],
    },
    {
        label: 'Administration',
        permissions: ['admin:users', 'admin:roles', 'admin:access-requests'] as PermissionKey[],
    },
];
