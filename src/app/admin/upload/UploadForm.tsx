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
      const { key, url } = await getUploadUrl(reader, title, file.type);

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
    <div>
      {success && (
        <div className="mb-8 rounded-2xl bg-emerald-50 px-5 py-4">
          <p className="text-base font-bold text-emerald-800">
            Story uploaded successfully!
          </p>
          <Link
            href="/"
            className="mt-2 inline-flex items-center gap-2 text-sm font-semibold text-teal-600 transition-colors hover:text-teal-500"
          >
            ← View all stories
          </Link>
        </div>
      )}

      {error && (
        <div className="mb-8 rounded-2xl bg-red-50 px-5 py-4 text-sm font-medium leading-relaxed text-red-800">
          {error}
        </div>
      )}

      <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label
            htmlFor="title"
            className="block text-sm font-semibold text-slate-700"
          >
            Story Title
          </label>
          <input
            id="title"
            name="title"
            type="text"
            required
            disabled={uploading}
            className="mt-2 block w-full rounded-2xl border-2 border-slate-200 px-4 py-3.5 text-base text-slate-900 placeholder-slate-400 transition-colors focus:border-teal-500 focus:outline-none focus:ring-0 disabled:opacity-50"
            placeholder="The Magical Forest"
          />
        </div>

        <div>
          <label
            htmlFor="reader"
            className="block text-sm font-semibold text-slate-700"
          >
            Reader
          </label>
          <select
            id="reader"
            name="reader"
            required
            disabled={uploading}
            className="mt-2 block w-full rounded-2xl border-2 border-slate-200 px-4 py-3.5 text-base text-slate-900 transition-colors focus:border-teal-500 focus:outline-none focus:ring-0 disabled:opacity-50"
          >
            <option value="">Select reader</option>
            <option value="granny">Granny</option>
            <option value="grandpa">Grandpa</option>
          </select>
        </div>

        <div>
          <label
            htmlFor="video"
            className="block text-sm font-semibold text-slate-700"
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
            className="mt-2 block w-full rounded-2xl border-2 border-dashed border-slate-200 px-4 py-3.5 text-sm text-slate-900 transition-colors file:mr-3 file:cursor-pointer file:rounded-xl file:border-0 file:bg-teal-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-teal-700 hover:file:bg-teal-100 disabled:opacity-50"
          />
          <p className="mt-2 text-xs text-slate-400">
            MP4, MOV, or other video formats
          </p>
        </div>

        {progress && (
          <div className="rounded-2xl bg-blue-50 px-4 py-3.5 text-sm font-medium text-blue-800">
            {progress}
          </div>
        )}

        <div className="flex flex-col gap-3 pt-2 sm:flex-row">
          <button
            type="submit"
            disabled={uploading}
            className="flex-1 rounded-2xl bg-teal-500 px-6 py-3.5 text-base font-bold text-white transition-colors hover:bg-teal-400 disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-400 focus-visible:ring-offset-2"
          >
            {uploading ? 'Uploading...' : 'Upload Story'}
          </button>
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-2xl border-2 border-slate-200 px-6 py-3.5 text-base font-semibold text-slate-700 transition-colors hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
