export async function getUploadUrl(filename: string, contentType: string) {
  const response = await fetch('/api/upload-url', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ filename, contentType }),
  });

  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.error || 'Failed to get upload URL');
  }

  return response.json() as Promise<{ key: string; url: string }>;
}

export async function uploadToR2(url: string, file: File) {
  try {
    const response = await fetch(url, {
      method: 'PUT',
      body: file,
      headers: {
        'Content-Type': file.type,
      },
    });

    if (!response.ok) {
      throw new Error(
        `Failed to upload video: ${response.status} ${response.statusText}`
      );
    }
  } catch (uploadError) {
    if (
      uploadError instanceof TypeError &&
      uploadError.message === 'Failed to fetch'
    ) {
      throw new Error(
        'CORS error: R2 bucket needs CORS configuration. Check R2_SETUP.md for instructions.'
      );
    }
    throw uploadError;
  }
}
