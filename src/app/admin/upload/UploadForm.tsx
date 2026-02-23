'use client';

import { createStoryRecord } from '@/lib/actions/upload';
import { getUploadUrl, uploadToR2 } from '@/lib/api/upload';
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

      setProgress('Getting upload URL...');
      const { key, url } = await getUploadUrl(file.name, file.type);

      setProgress('Uploading video...');
      await uploadToR2(url, file);

      setProgress('Creating story record...');
      const result = await createStoryRecord(title, reader, key);

      if (result.error) {
        throw new Error(result.error);
      }

      setProgress('Complete!');
      setSuccess(true);
      setUploading(false);

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
    <div className="rounded-lg border border-slate-200 bg-white p-8">
      {success && (
        <div className="mb-6 rounded-md bg-emerald-50 p-4">
          <p className="text-sm text-emerald-800">
            Story uploaded successfully!
          </p>
          <Link
            href="/"
            className="mt-2 inline-block text-sm font-medium text-teal-500 hover:underline"
          >
            ← View all stories
          </Link>
        </div>
      )}

      {error && (
        <div className="mb-6 rounded-md bg-red-50 p-3 text-sm text-red-800">
          {error}
        </div>
      )}

      <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label
            htmlFor="title"
            className="block text-sm font-medium text-slate-700"
          >
            Story Title
          </label>
          <input
            id="title"
            name="title"
            type="text"
            required
            disabled={uploading}
            className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 text-slate-900 placeholder-slate-400 focus:border-blue-950 focus:outline-none focus:ring-1 focus:ring-blue-950 disabled:opacity-50"
            placeholder="The Magical Forest"
          />
        </div>

        <div>
          <label
            htmlFor="reader"
            className="block text-sm font-medium text-slate-700"
          >
            Reader
          </label>
          <select
            id="reader"
            name="reader"
            required
            disabled={uploading}
            className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 text-slate-900 focus:border-blue-950 focus:outline-none focus:ring-1 focus:ring-blue-950 disabled:opacity-50"
          >
            <option value="">Select reader</option>
            <option value="granny">👵 Granny</option>
            <option value="grandpa">👴 Grandpa</option>
          </select>
        </div>

        <div>
          <label
            htmlFor="video"
            className="block text-sm font-medium text-slate-700"
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
            className="mt-1 block w-full text-sm text-slate-900 file:mr-4 file:rounded-md file:border-0 file:bg-slate-100 file:px-4 file:py-2 file:text-sm file:font-medium file:text-slate-900 hover:file:bg-slate-200 disabled:opacity-50"
          />
          <p className="mt-1 text-sm text-slate-500">
            MP4, MOV, or other video formats
          </p>
        </div>

        {progress && (
          <div className="rounded-md bg-blue-50 p-3 text-sm text-blue-800">
            {progress}
          </div>
        )}

        <div className="flex gap-4">
          <button
            type="submit"
            disabled={uploading}
            className="flex-1 rounded-md bg-blue-950 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-900 disabled:opacity-50"
          >
            {uploading ? 'Uploading...' : 'Upload Story'}
          </button>
          <Link
            href="/"
            className="rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
