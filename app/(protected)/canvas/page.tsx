import { CanvasPageClient } from '@/features/canvas/CanvasPageClient';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Canvas' };

export default function CanvasPage() {
    return <CanvasPageClient />;
}
