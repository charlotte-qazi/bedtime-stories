# Cloudflare R2 Setup Guide

## Overview

This project uses Cloudflare R2 for video storage. R2 is S3-compatible and requires API tokens for access.

## Setup Steps

### 1. Create an R2 Bucket

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. Navigate to **R2** → **Overview**
3. Click **Create bucket**
4. Name your bucket (e.g., `bedtime-stories`)
5. Click **Create bucket**

### 2. Create API Token

1. In R2 Overview, click **Manage R2 API Tokens**
2. Click **Create API token**
3. Give it a name (e.g., `bedtime-stories-app`)
4. **Permissions**: 
   - Select **Object Read & Write** (or customize as needed)
5. **TTL**: Set as needed (or leave blank for no expiration)
6. **Specify bucket** (optional): Select your bucket for added security
7. Click **Create API Token**

**Important**: Copy the credentials now - you won't see them again!

### 3. Get Your Account ID

1. In R2 Overview, your **Account ID** is displayed at the top
2. Copy this value

### 4. Configure Environment Variables

Add to your `.env.local`:

```env
# Cloudflare R2
R2_ACCOUNT_ID=your_account_id_here
R2_ACCESS_KEY_ID=your_access_key_from_token
R2_SECRET_ACCESS_KEY=your_secret_key_from_token
R2_BUCKET=bedtime-stories
```

Replace the placeholder values with:
- **R2_ACCOUNT_ID**: From R2 Overview
- **R2_ACCESS_KEY_ID**: From API token creation
- **R2_SECRET_ACCESS_KEY**: From API token creation
- **R2_BUCKET**: Your bucket name

### 5. Restart Your Dev Server

```bash
pnpm dev
```

## Usage Examples

### Get Signed URL for Downloading/Viewing Video

```typescript
import { signGetObjectUrl } from '@/lib/r2';

// In a server component or API route
const videoUrl = await signGetObjectUrl('videos/sample1.mp4');
// URL expires in 15 minutes (900 seconds) by default

// Custom expiration (1 hour)
const videoUrl = await signGetObjectUrl('videos/sample1.mp4', 3600);
```

### Get Signed URL for Uploading Video

```typescript
import { signPutObjectUrl } from '@/lib/r2';

// In an API route
const uploadUrl = await signPutObjectUrl(
  'videos/new-video.mp4',
  'video/mp4'
);
// Client can PUT directly to this URL
```

## R2 Helper (`src/lib/r2.ts`)

### `signGetObjectUrl(key, expiresInSeconds?)`

**Purpose**: Generate a presigned URL for downloading/viewing a file from R2.

**Parameters**:
- `key` (string): The object key (path) in the bucket
- `expiresInSeconds` (number, optional): URL expiration time (default: 900 = 15 minutes)

**Returns**: Promise<string> - Presigned URL

**Example**:
```typescript
const url = await signGetObjectUrl('videos/story-123.mp4');
```

### `signPutObjectUrl(key, contentType, expiresInSeconds?)`

**Purpose**: Generate a presigned URL for uploading a file to R2.

**Parameters**:
- `key` (string): The object key (path) in the bucket
- `contentType` (string): MIME type (e.g., 'video/mp4')
- `expiresInSeconds` (number, optional): URL expiration time (default: 900 = 15 minutes)

**Returns**: Promise<string> - Presigned URL

**Example**:
```typescript
const uploadUrl = await signPutObjectUrl('videos/new-story.mp4', 'video/mp4');

// Client can then upload:
await fetch(uploadUrl, {
  method: 'PUT',
  body: videoFile,
  headers: { 'Content-Type': 'video/mp4' }
});
```

## Security Notes

### Server-Only Functions

⚠️ **Important**: R2 functions are server-only. Never expose credentials to the client.

**✅ Good** (server component):
```typescript
export default async function VideoPage() {
  const videoUrl = await signGetObjectUrl('videos/sample.mp4');
  return <video src={videoUrl} />;
}
```

**✅ Good** (API route):
```typescript
export async function GET() {
  const url = await signGetObjectUrl('videos/sample.mp4');
  return Response.json({ url });
}
```

**❌ Bad** (client component):
```typescript
'use client';
import { signGetObjectUrl } from '@/lib/r2'; // Won't work!
```

### Environment Variables

- R2 credentials are **server-only** (no `NEXT_PUBLIC_` prefix)
- Never commit `.env.local` to git
- Always use `.env.example` as a template

## Testing R2 Integration

### Test Upload (Manual)

Use the Cloudflare R2 dashboard to upload a test video:

1. Go to your bucket in R2 dashboard
2. Click **Upload**
3. Upload a video file (e.g., `videos/test.mp4`)
4. Use the key in your app

### Test Signed URL Generation

Create a test API route:

```typescript
// app/api/test-r2/route.ts
import { signGetObjectUrl } from '@/lib/r2';

export async function GET() {
  try {
    const url = await signGetObjectUrl('videos/test.mp4');
    return Response.json({ url, success: true });
  } catch (error) {
    return Response.json({ error: String(error) }, { status: 500 });
  }
}
```

Visit: `http://localhost:3000/api/test-r2`

## Troubleshooting

### "Missing credentials in config" Error

**Solution**: Ensure all R2 environment variables are set in `.env.local` and restart dev server.

### "Access Denied" Error

**Solution**: 
1. Verify API token has correct permissions
2. Check bucket name matches exactly
3. Ensure object key exists in bucket

### "SignatureDoesNotMatch" Error

**Solution**: 
1. Verify `R2_SECRET_ACCESS_KEY` is correct
2. Ensure no extra spaces in environment variables
3. Check `R2_ACCOUNT_ID` is correct

### CORS Configuration (Required for Browser Upload)

⚠️ **You must configure CORS before uploading videos from the browser.**

**Steps:**

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com/) → **R2**
2. Click on your bucket name (e.g., `bedtime-stories`)
3. Go to **Settings** tab
4. Scroll down to **CORS Policy**
5. Click **Add CORS policy** (or **Edit** if one exists)
6. Paste this configuration:

```json
[
  {
    "AllowedOrigins": [
      "http://localhost:3000",
      "http://localhost:3001"
    ],
    "AllowedMethods": [
      "GET",
      "PUT"
    ],
    "AllowedHeaders": [
      "*"
    ],
    "ExposeHeaders": [],
    "MaxAgeSeconds": 3600
  }
]
```

7. Click **Save**

**For Production:**

When deploying, add your production domain to `AllowedOrigins`:

```json
[
  {
    "AllowedOrigins": [
      "http://localhost:3000",
      "https://yourdomain.com",
      "https://www.yourdomain.com"
    ],
    "AllowedMethods": [
      "GET",
      "PUT"
    ],
    "AllowedHeaders": [
      "*"
    ],
    "ExposeHeaders": [],
    "MaxAgeSeconds": 3600
  }
]
```

**Note**: After adding CORS policy, wait 1-2 minutes for it to propagate.

## Next Steps

Once R2 is configured:

1. Update `src/app/story/[id]/page.tsx` to use `signGetObjectUrl()` for video playback
2. Create upload API route using `signPutObjectUrl()`
3. Build video upload UI

## Reference

- [Cloudflare R2 Documentation](https://developers.cloudflare.com/r2/)
- [AWS SDK v3 for S3](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-s3/)
- [Presigned URLs Guide](https://docs.aws.amazon.com/AmazonS3/latest/userguide/PresignedUrlUploadObject.html)
