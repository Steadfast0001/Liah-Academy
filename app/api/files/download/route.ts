import { NextRequest } from 'next/server';
import { readPrivateFile, verifySignedFileUrl } from '@/lib/private-files';

export const dynamic = 'force-dynamic';

const MIME_TYPES: Record<string, string> = {
  '.pdf': 'application/pdf',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.webp': 'image/webp'
};

export async function GET(request: NextRequest) {
  const reference = request.nextUrl.searchParams.get('ref') || '';
  const expires = request.nextUrl.searchParams.get('expires') || '';
  const signature = request.nextUrl.searchParams.get('sig') || '';
  const isDownload = request.nextUrl.searchParams.get('download') === '1';

  if (!verifySignedFileUrl(reference, expires, signature)) {
    return new Response('This file link is invalid or expired.', {
      status: 403,
      headers: { 'Cache-Control': 'no-store' }
    });
  }

  try {
    const { bytes, fileName } = await readPrivateFile(reference);
    const dotIndex = fileName.lastIndexOf('.');
    const ext = dotIndex !== -1 ? fileName.slice(dotIndex).toLowerCase() : '';
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';
    const disposition = isDownload ? 'attachment' : 'inline';

    return new Response(new Uint8Array(bytes), {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Content-Disposition': `${disposition}; filename="${fileName}"`,
        'X-Content-Type-Options': 'nosniff',
        'Cache-Control': 'private, no-store, max-age=0'
      }
    });
  } catch {
    return new Response('File not found.', {
      status: 404,
      headers: { 'Cache-Control': 'no-store' }
    });
  }
}