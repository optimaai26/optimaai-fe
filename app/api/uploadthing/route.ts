/**
 * Uploadthing API route handler skeleton
 * Uncomment when uploadthing is configured with actual secrets
 */

// import { createRouteHandler } from 'uploadthing/next';
// import { ourFileRouter } from '@/lib/uploadthing';

// export const { GET, POST } = createRouteHandler({
//   router: ourFileRouter,
// });

import { NextResponse } from 'next/server';

export async function GET() {
    return NextResponse.json({ status: 'uploadthing not configured yet' });
}

export async function POST() {
    return NextResponse.json({ status: 'uploadthing not configured yet' }, { status: 501 });
}
