import { AdminUsersPageClient } from '@/features/users/AdminUsersPageClient';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Admin - Users' };

export default function AdminUsersPage() {
    return <AdminUsersPageClient />;
}
