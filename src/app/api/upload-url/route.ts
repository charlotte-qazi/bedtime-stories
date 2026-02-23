import { requireAuthAPI } from '@/lib/auth';
import { signPutObjectUrl } from '@/lib/r2';

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '');
}

function generateShortId(length: number = 6): string {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars[Math.floor(Math.random() * chars.length)];
  }
  return result;
}

function generateObjectKey(
  reader: 'granny' | 'grandpa',
  title: string
): string {
  const now = new Date();
  const yearMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  const slug = slugify(title);
  const shortId = generateShortId(6);

  return `videos/${reader}/${yearMonth}/${slug}-${shortId}.mp4`;
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

  const { reader, title, contentType } = body;

  if (!reader || (reader !== 'granny' && reader !== 'grandpa')) {
    return Response.json(
      { error: 'reader must be "granny" or "grandpa"' },
      { status: 400 }
    );
  }

  if (!title || typeof title !== 'string' || title.trim().length === 0) {
    return Response.json({ error: 'Missing or invalid title' }, { status: 400 });
  }

  if (!contentType || typeof contentType !== 'string') {
    return Response.json({ error: 'Missing or invalid contentType' }, { status: 400 });
  }

  if (!contentType.startsWith('video/')) {
    return Response.json(
      { error: 'contentType must start with "video/"' },
      { status: 400 }
    );
  }

  const key = generateObjectKey(reader, title);
  const url = await signPutObjectUrl(key, contentType);

  return Response.json({ key, url });
}
