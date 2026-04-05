import { AccessRequestsPageClient } from '@/features/access-requests/AccessRequestsPageClient';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Admin - Access Requests' };

export default function AccessRequestsPage() {
    return <AccessRequestsPageClient />;
}
