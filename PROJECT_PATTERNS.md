# Bedtime Stories - Project Documentation

## 📖 Overview

A Next.js 16 application with Supabase authentication, built using the App Router and TypeScript. This document provides a comprehensive guide to the project's architecture, patterns, and conventions.

## 🏗️ Architecture Decisions

### Why No Middleware?

**Decision**: Authentication checks at page/route level instead of middleware.

**Reasoning**: 
- Next.js 16's Edge Runtime has fetch restrictions that cause issues with Supabase API calls
- Page-level checks are more reliable and easier to debug
- Using `requireAuth()` helper keeps code DRY despite no middleware

**Trade-offs**:
- ✅ No Edge Runtime issues
- ✅ Simple and predictable
- ✅ Works perfectly in development
- ⚠️ Must add auth check to each protected route (mitigated by helper)

### Authentication Strategy

**Cookie-based sessions** via `@supabase/ssr`:
- HTTP-only cookies (secure from XSS)
- Automatic persistence across browser restarts
- 1-week session duration
- Per-device sessions

**Two-client pattern**:
- **Browser client**: For client components (forms, interactive UI)
- **Server client**: For server components (pages, API routes)

## 📁 Project Structure

```
bedtime-stories/
├── src/
│   ├── app/                      # Next.js App Router
│   │   ├── layout.tsx            # Root layout with fonts
│   │   ├── page.tsx              # Protected home page
│   │   ├── login/
│   │   │   └── page.tsx          # Login form (client component)
│   │   └── signup/
│   │       └── page.tsx          # Signup form (client component)
│   └── lib/
│       ├── auth.ts               # ⭐ Auth helpers (requireAuth, requireAuthAPI)
│       └── supabase/
│           ├── browser.ts        # Browser client factory
│           └── server.ts         # Server client factory
├── .env.local                    # Environment variables (not in git)
├── .env.example                  # Template for env vars
├── package.json                  # Dependencies
└── next.config.ts                # Next.js config
```

## 🔐 Authentication Implementation

### Helper Functions (`src/lib/auth.ts`)

#### `requireAuth()`
**Purpose**: Protect server components (pages)

**Usage**:
```typescript
import { requireAuth } from '@/lib/auth';

export default async function ProtectedPage() {
  const user = await requireAuth(); // Redirects to /login if not authenticated
  
  return <div>Welcome, {user.email}!</div>;
}
```

**Behavior**:
- Checks for authenticated user
- Redirects to `/login` if not authenticated
- Returns user object if authenticated

#### `requireAuthAPI()`
**Purpose**: Protect API routes

**Usage**:
```typescript
import { requireAuthAPI } from '@/lib/auth';

export async function GET() {
  const { error, user } = await requireAuthAPI();
  if (error) return error; // Returns 401 Unauthorized
  
  // Protected logic here
  return Response.json({ userId: user.id });
}
```

**Behavior**:
- Checks for authenticated user
- Returns `{ error: Response, user: null }` if not authenticated
- Returns `{ error: null, user: User }` if authenticated

### Client Setup (`src/lib/supabase/`)

**Browser Client** (`browser.ts`):
- Used in client components
- Manages cookies automatically
- For forms and interactive auth flows

**Server Client** (`server.ts`):
- Used in server components and API routes
- Reads cookies via Next.js `cookies()` API
- Cookie-based session validation

## 🎨 Design System

### Color Palette
- **Base**: Zinc scale (`zinc-50` to `zinc-900`)
- **Success**: Green (`green-50`, `green-800`, etc.)
- **Error**: Red (`red-50`, `red-800`, etc.)
- **Dark mode**: Always included via `dark:` variants

### Typography
- **Fonts**: Geist Sans (body), Geist Mono (code)
- **Headings**: `text-2xl` or `text-4xl`, `font-semibold`
- **Body**: `text-sm` to `text-lg`

### Component Styling Patterns

**Centered full-height layout**:
```tsx
<div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-black">
```

**Card/Modal container**:
```tsx
<div className="w-full max-w-md rounded-lg border border-zinc-200 bg-white p-8 dark:border-zinc-800 dark:bg-zinc-900">
```

**Form inputs**:
```tsx
<input
  className="mt-1 block w-full rounded-md border border-zinc-300 px-3 py-2 text-zinc-900 placeholder-zinc-400 focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:placeholder-zinc-500"
/>
```

**Primary buttons**:
```tsx
<button
  className="w-full rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-800 disabled:opacity-50 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
>
```

## 🔄 Common Workflows

### Adding a New Protected Page

1. Create page file: `src/app/[route]/page.tsx`
2. Import helper: `import { requireAuth } from '@/lib/auth';`
3. Call at top: `const user = await requireAuth();`
4. Build your page JSX

Example:
```typescript
import { requireAuth } from '@/lib/auth';

export default async function StoriesPage() {
  const user = await requireAuth();
  
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-black">
      <main className="w-full max-w-3xl p-8">
        <h1 className="text-4xl font-semibold text-zinc-900 dark:text-zinc-50">
          My Stories
        </h1>
      </main>
    </div>
  );
}
```

### Adding a Protected API Route

1. Create route file: `src/app/api/[route]/route.ts`
2. Import helper: `import { requireAuthAPI } from '@/lib/auth';`
3. Check auth at start of handler
4. Early return if error

Example:
```typescript
import { requireAuthAPI } from '@/lib/auth';

export async function GET() {
  const { error, user } = await requireAuthAPI();
  if (error) return error;
  
  // Fetch data specific to user.id
  const data = await fetchUserData(user.id);
  
  return Response.json({ data });
}

export async function POST(request: Request) {
  const { error, user } = await requireAuthAPI();
  if (error) return error;
  
  const body = await request.json();
  // Process with user.id
  
  return Response.json({ success: true });
}
```

### Creating an Auth Form

1. Create client component: `'use client'`
2. Import browser client: `import { createClient } from '@/lib/supabase/browser';`
3. Manage `error` and `loading` states
4. Handle form submission with `FormData`
5. Redirect on success with `router.push()` and `router.refresh()`

Example:
```typescript
'use client';

import { createClient } from '@/lib/supabase/browser';
import { useRouter } from 'next/navigation';
import { useState, type FormEvent } from 'react';

export default function AuthForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      router.push('/');
      router.refresh();
    }
  }

  return <form onSubmit={handleSubmit}>{/* form fields */}</form>;
}
```

## 🛠️ Development Setup

### Environment Variables

Required in `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ... (JWT format)
```

### Known Issues & Workarounds

**SSL Certificate Errors**:
- **Symptom**: "unable to get local issuer certificate"
- **Cause**: Corporate proxy (Zscaler) interfering with SSL
- **Solution**: Disable Zscaler during development
- **Note**: No code changes needed - SSL works fine without proxy

## 📋 Checklist for New Features

### Before Adding a Protected Page
- [ ] Decide if it needs to be a server or client component
- [ ] Import `requireAuth` from `@/lib/auth`
- [ ] Call `requireAuth()` at the top of the component
- [ ] Follow styling patterns (dark mode, zinc colors)

### Before Adding an API Route
- [ ] Import `requireAuthAPI` from `@/lib/auth`
- [ ] Check auth at the start: `const { error, user } = await requireAuthAPI()`
- [ ] Return error early if present: `if (error) return error`
- [ ] Use `user.id` for user-specific operations

### Before Deploying to Production
- [ ] Remove any `NODE_TLS_REJECT_UNAUTHORIZED` env vars
- [ ] Verify environment variables are set in hosting platform
- [ ] Test authentication flow end-to-end
- [ ] Verify dark mode styling
- [ ] Check session duration is 1 week (604800s in Supabase dashboard)

## 🎓 Learning Resources

### Key Concepts to Understand
1. **Server Components vs Client Components**: Default to server, use client only when needed
2. **Cookie-based Auth**: Supabase manages sessions via HTTP-only cookies
3. **@supabase/ssr**: Handles cookie reading/writing for Next.js App Router
4. **requireAuth Pattern**: DRY approach to protect routes without middleware

### External Documentation
- [Next.js App Router](https://nextjs.org/docs/app)
- [Supabase SSR Guide](https://supabase.com/docs/guides/auth/server-side/nextjs)
- [Tailwind CSS](https://tailwindcss.com/docs)

## 🤝 Contributing

When adding new features, follow these principles:

1. **DRY**: Don't repeat auth logic - use helpers
2. **Simple**: Prefer simple solutions over complex ones
3. **Consistent**: Follow existing patterns for styling and structure
4. **Typed**: Use TypeScript everywhere
5. **Secure**: Always protect sensitive routes and API endpoints

## 📞 Quick Reference

**Protect a page**: `const user = await requireAuth();`

**Protect an API route**: 
```typescript
const { error, user } = await requireAuthAPI();
if (error) return error;
```

**Client auth**: `const supabase = createClient();` (from `@/lib/supabase/browser`)

**Dark mode**: Add `dark:` prefix to all color classes

**Center content**: `flex min-h-screen items-center justify-center`
