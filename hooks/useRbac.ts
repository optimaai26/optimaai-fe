'use client';

import { useAuth } from '@/features/auth/AuthProvider';
import { ROLE_PERMISSIONS, type PermissionKey, type RoleName } from '@/constants/permissions';

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
        return permissions.every(p => perms.includes(p));
    };

    /**
     * Helper to check if the user has AL LEAST ONE of the required permissions
     */
    const hasAnyPermission = (permissions: PermissionKey[]): boolean => {
        if (!roleName) return false;
        const perms = ROLE_PERMISSIONS[roleName] || [];
        return permissions.some(p => perms.includes(p));
    };

    return {
        hasRole,
        hasPermission,
        hasAllPermissions,
        hasAnyPermission,
        currentRole: roleName,
    };
}
