import { AdminRolesPageClient } from '@/features/roles/AdminRolesPageClient';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Admin - Roles' };

export default function AdminRolesPage() {
    return <AdminRolesPageClient />;
}
