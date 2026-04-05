import { ReportsPageClient } from '@/features/reports/ReportsPageClient';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Reports' };

export default function ReportsPage() {
    return <ReportsPageClient />;
}
