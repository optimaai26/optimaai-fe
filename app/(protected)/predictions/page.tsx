import { PredictionsPageClient } from '@/features/predictions/PredictionsPageClient';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Predictions' };

export default function PredictionsPage() {
    return <PredictionsPageClient />;
}
