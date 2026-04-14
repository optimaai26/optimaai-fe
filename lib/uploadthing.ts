/**
 * Uploadthing configuration skeleton
 * Replace with actual uploadthing setup when ready
 */

// import { createUploadthing, type FileRouter } from 'uploadthing/next';
// const f = createUploadthing();

// export const ourFileRouter = {
//   csvUploader: f({ 'text/csv': { maxFileSize: '16MB', maxFileCount: 1 } })
//     .middleware(async ({ req }) => {
//       // Auth check here
//       return { userId: 'user-id' };
//     })
//     .onUploadComplete(async ({ metadata, file }) => {
//       console.log('Upload complete:', file.url);
//       return { uploadedBy: metadata.userId };
//     }),
// } satisfies FileRouter;

// export type OurFileRouter = typeof ourFileRouter;

export {};
