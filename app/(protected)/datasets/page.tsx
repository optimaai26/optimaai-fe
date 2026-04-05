import { DatasetsPageClient } from '@/features/datasets/DatasetsPageClient';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Datasets' };

export default function DatasetsPage() {
    return <DatasetsPageClient />;
}
