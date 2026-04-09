import { DatasetDetailPageClient } from '@/features/datasets/DatasetDetailPageClient';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Dataset Detail' };

export default async function DatasetDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    return <DatasetDetailPageClient id={id} />;
}
