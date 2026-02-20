# Bedtime Stories

A Next.js application for creating and managing personalized bedtime stories, with Supabase authentication.

## 🚀 Quick Start

1. **Clone and Install**
   ```bash
   pnpm install
   ```

2. **Set up Environment Variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Then edit `.env.local` with your Supabase credentials:
   - Get them from: https://supabase.com/dashboard/project/YOUR_PROJECT/settings/api

3. **Configure Supabase Session Duration**
   - Go to: Supabase Dashboard → Authentication → Settings
   - Set JWT expiry to `604800` (1 week in seconds)

4. **Run Development Server**
   ```bash
   pnpm dev
   ```
   
   Open [http://localhost:3000](http://localhost:3000)

5. **Known Issues**
   - If you see SSL certificate errors, disable Zscaler/corporate proxy during development

## 📚 Documentation

- **[PROJECT_PATTERNS.md](./PROJECT_PATTERNS.md)** - Complete guide to project architecture, patterns, and conventions
- **[.cursorrules](./.cursorrules)** - AI assistant rules for maintaining code consistency

## 🏗️ Tech Stack

- **Framework**: Next.js 16.1.6 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Authentication**: Supabase Auth with @supabase/ssr
- **Package Manager**: pnpm

## 🔐 Authentication

This project uses a custom auth pattern without middleware:

**Protect a page:**
```typescript
import { requireAuth } from '@/lib/auth';

export default async function ProtectedPage() {
  const user = await requireAuth();
  return <div>Welcome, {user.email}!</div>;
}
```

**Protect an API route:**
```typescript
import { requireAuthAPI } from '@/lib/auth';

export async function GET() {
  const { error, user } = await requireAuthAPI();
  if (error) return error;
  
  return Response.json({ data: 'protected' });
}
```

See [PROJECT_PATTERNS.md](./PROJECT_PATTERNS.md) for complete authentication documentation.

## 📁 Project Structure

```
src/
├── app/              # Next.js App Router pages
│   ├── page.tsx     # Protected home page
│   ├── login/       # Login form
│   └── signup/      # Signup form
├── lib/
│   ├── auth.ts      # Auth helpers (requireAuth, requireAuthAPI)
│   └── supabase/    # Supabase client utilities
```

## 🎨 Styling

- Uses Tailwind CSS with Zinc color palette
- Dark mode support on all components
- Consistent component patterns documented in PROJECT_PATTERNS.md

## 🛠️ Development

### Adding Protected Pages
1. Create page in `src/app/[route]/page.tsx`
2. Add `const user = await requireAuth();` at the top
3. Build your page

### Adding Protected API Routes
1. Create route in `src/app/api/[route]/route.ts`
2. Check auth: `const { error, user } = await requireAuthAPI();`
3. Return error early: `if (error) return error;`

### Before Production
- [ ] Remove any SSL bypass environment variables
- [ ] Set environment variables in hosting platform
- [ ] Test authentication flow
- [ ] Verify session duration is 1 week

## 📖 Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase SSR Guide](https://supabase.com/docs/guides/auth/server-side/nextjs)
- [Tailwind CSS](https://tailwindcss.com/docs)

## 🤝 Contributing

Follow the patterns documented in [PROJECT_PATTERNS.md](./PROJECT_PATTERNS.md) to maintain consistency.

Key principles:
- DRY (use auth helpers)
- Simple over complex
- Server components by default
- Dark mode always included
- TypeScript everywhere
