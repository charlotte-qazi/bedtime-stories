'use client';

import { createClient } from '@/lib/supabase/browser';
import { useRouter } from 'next/navigation';
import { useState, useRef, type FormEvent } from 'react';
import Link from 'next/link';

export default function UploadForm() {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [progress, setProgress] = useState<string>('');

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    setUploading(true);
    setProgress('Preparing upload...');

    try {
      const formData = new FormData(e.currentTarget);
      const title = formData.get('title') as string;
      const reader = formData.get('reader') as 'granny' | 'grandpa';
      const file = formData.get('video') as File;

      if (!title || !reader || !file) {
        throw new Error('Please fill in all fields');
      }

      if (!file.type.startsWith('video/')) {
        throw new Error('Please select a video file');
      }

      // Step 1: Get upload URL
      setProgress('Getting upload URL...');
      const uploadUrlResponse = await fetch('/api/upload-url', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          filename: file.name,
          contentType: file.type,
        }),
      });

      if (!uploadUrlResponse.ok) {
        const data = await uploadUrlResponse.json();
        throw new Error(data.error || 'Failed to get upload URL');
      }

      const { key, url } = await uploadUrlResponse.json();

      // Step 2: Upload file to R2
      setProgress('Uploading video...');
      try {
        const uploadResponse = await fetch(url, {
          method: 'PUT',
          body: file,
          headers: {
            'Content-Type': file.type,
          },
        });

        if (!uploadResponse.ok) {
          throw new Error(
            `Failed to upload video: ${uploadResponse.status} ${uploadResponse.statusText}`
          );
        }
      } catch (uploadError) {
        if (uploadError instanceof TypeError && uploadError.message === 'Failed to fetch') {
          throw new Error(
            'CORS error: R2 bucket needs CORS configuration. Check R2_SETUP.md for instructions.'
          );
        }
        throw uploadError;
      }

      // Step 3: Create story in database
      setProgress('Creating story record...');
      const supabase = createClient();
      const { error: dbError } = await supabase.from('stories').insert({
        title,
        reader,
        video_object_key: key,
      });

      if (dbError) {
        throw new Error(dbError.message || 'Failed to create story');
      }

      setProgress('Complete!');
      setSuccess(true);
      setUploading(false);

      // Reset form
      if (formRef.current) {
        formRef.current.reset();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
      setUploading(false);
      setProgress('');
    }
  }

  return (
    <div className="rounded-lg border border-zinc-200 bg-white p-8 dark:border-zinc-800 dark:bg-zinc-900">
      {success && (
        <div className="mb-6 rounded-md bg-green-50 p-4 dark:bg-green-900/20">
          <p className="text-sm text-green-800 dark:text-green-400">
            Story uploaded successfully!
          </p>
          <Link
            href="/"
            className="mt-2 inline-block text-sm font-medium text-green-900 hover:underline dark:text-green-300"
          >
            ← View all stories
          </Link>
        </div>
      )}

      {error && (
        <div className="mb-6 rounded-md bg-red-50 p-3 text-sm text-red-800 dark:bg-red-900/20 dark:text-red-400">
          {error}
        </div>
      )}

      <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label
            htmlFor="title"
            className="block text-sm font-medium text-zinc-700 dark:text-zinc-300"
          >
            Story Title
          </label>
          <input
            id="title"
            name="title"
            type="text"
            required
            disabled={uploading}
            className="mt-1 block w-full rounded-md border border-zinc-300 px-3 py-2 text-zinc-900 placeholder-zinc-400 focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500 disabled:opacity-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:placeholder-zinc-500"
            placeholder="The Magical Forest"
          />
        </div>

        <div>
          <label
            htmlFor="reader"
            className="block text-sm font-medium text-zinc-700 dark:text-zinc-300"
          >
            Reader
          </label>
          <select
            id="reader"
            name="reader"
            required
            disabled={uploading}
            className="mt-1 block w-full rounded-md border border-zinc-300 px-3 py-2 text-zinc-900 focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500 disabled:opacity-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
          >
            <option value="">Select reader</option>
            <option value="granny">👵 Granny</option>
            <option value="grandpa">👴 Grandpa</option>
          </select>
        </div>

        <div>
          <label
            htmlFor="video"
            className="block text-sm font-medium text-zinc-700 dark:text-zinc-300"
          >
            Video File
          </label>
          <input
            id="video"
            name="video"
            type="file"
            accept="video/*"
            required
            disabled={uploading}
            className="mt-1 block w-full text-sm text-zinc-900 file:mr-4 file:rounded-md file:border-0 file:bg-zinc-100 file:px-4 file:py-2 file:text-sm file:font-medium file:text-zinc-900 hover:file:bg-zinc-200 disabled:opacity-50 dark:text-zinc-100 dark:file:bg-zinc-800 dark:file:text-zinc-100 dark:hover:file:bg-zinc-700"
          />
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-500">
            MP4, MOV, or other video formats
          </p>
        </div>

        {progress && (
          <div className="rounded-md bg-blue-50 p-3 text-sm text-blue-800 dark:bg-blue-900/20 dark:text-blue-400">
            {progress}
          </div>
        )}

        <div className="flex gap-4">
          <button
            type="submit"
            disabled={uploading}
            className="flex-1 rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-800 disabled:opacity-50 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
          >
            {uploading ? 'Uploading...' : 'Upload Story'}
          </button>
          <Link
            href="/"
            className="rounded-md border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
