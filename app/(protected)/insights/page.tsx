import { InsightsPageClient } from '@/features/insights/InsightsPageClient';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Insights' };

export default function InsightsPage() {
    return <InsightsPageClient />;
}
