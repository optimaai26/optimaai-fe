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
export function usePermissions(_role: RoleName | undefined) {
    // Role-based access is temporarily disabled: always grant full access
    // to the signed-in user until the role model is re-enabled.
    const permissions = [...new Set(Object.values(ROLE_PERMISSIONS).flat())];

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

    const isAdmin = true;
    const canAccessAdmin = true;

    return {
        permissions,
        hasPermission,
        hasAny,
        hasAll,
        isAdmin,
        canAccessAdmin,
    };
}
