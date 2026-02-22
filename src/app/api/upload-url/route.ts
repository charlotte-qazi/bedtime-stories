import { requireAuthAPI } from '@/lib/auth';
import { signPutObjectUrl } from '@/lib/r2';

function sanitizeFilename(filename: string): string {
  return filename
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9.-]/g, '');
}

function generateObjectKey(filename: string): string {
  const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
  const randomId = crypto.randomUUID().split('-')[0]; // First segment of UUID
  const sanitized = sanitizeFilename(filename);
  
  return `videos/${today}/${randomId}-${sanitized}`;
}

export async function POST(request: Request) {
  const { error, user } = await requireAuthAPI();
  if (error) return error;

  let body;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const { filename, contentType } = body;

  if (!filename || typeof filename !== 'string') {
    return Response.json({ error: 'Missing or invalid filename' }, { status: 400 });
  }

  if (!contentType || typeof contentType !== 'string') {
    return Response.json({ error: 'Missing or invalid contentType' }, { status: 400 });
  }

  if (!contentType.startsWith('video/')) {
    return Response.json({ error: 'contentType must start with "video/"' }, { status: 400 });
  }

  const key = generateObjectKey(filename);
  const url = await signPutObjectUrl(key, contentType);

  return Response.json({ key, url });
}
