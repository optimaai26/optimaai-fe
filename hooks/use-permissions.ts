import type { PermissionKey, RoleName } from '@/types';
import { ROLE_PERMISSIONS } from '@/constants/permissions';

/* ==========================================
 * usePermissions – Role-based access hook
 * ========================================== */

/**
 * Check if a given role has a specific permission.
 * Usage:
 *   const { hasPermission, hasAny, hasAll } = usePermissions('admin');
 */
export function usePermissions(role: RoleName | undefined) {
    const permissions = role ? ROLE_PERMISSIONS[role] ?? [] : [];

    /** Check single permission */
    const hasPermission = (key: PermissionKey): boolean => {
        return permissions.includes(key);
    };

    /** Check if user has ANY of the given permissions */
    const hasAny = (...keys: PermissionKey[]): boolean => {
        return keys.some((key) => permissions.includes(key));
    };

    /** Check if user has ALL of the given permissions */
    const hasAll = (...keys: PermissionKey[]): boolean => {
        return keys.every((key) => permissions.includes(key));
    };

    /** Check if user is an admin */
    const isAdmin = role === 'admin';

    /** Check if user can access admin panel */
    const canAccessAdmin = hasAny('admin:users', 'admin:roles', 'admin:access-requests');

    return {
        permissions,
        hasPermission,
        hasAny,
        hasAll,
        isAdmin,
        canAccessAdmin,
    };
}
