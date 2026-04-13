# Plan Selector

Plan search application with user authentication and a results dashboard that consumes an external API.

## Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript (strict mode)
- **Auth & DB:** Supabase
- **Styling:** Tailwind CSS 4 + shadcn/ui
- **Animations:** Framer Motion
- **Icons:** Lucide React

## Prerequisites

- Node.js 18+
- pnpm (`npm install -g pnpm`) or npm (included with Node.js)
- A [Supabase](https://supabase.com) project

## Setup

1. **Clone the repository**

   ```bash
   git clone <repo-url>
   cd techroom-test
   ```

2. **Install dependencies**

   ```bash
   pnpm install
   # or
   npm install
   ```

3. **Configure environment variables**

   Copy the example file and fill in your values:

   ```bash
   cp .env.local.example .env.local
   ```

   | Variable                        | Description                                       |
   | ------------------------------- | ------------------------------------------------- |
   | `NEXT_PUBLIC_SUPABASE_URL`      | Your Supabase project URL                         |
   | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anon/public key                     |
   | `NEXT_PUBLIC_SITE_URL`          | Public app URL (for auth email redirects)         |
   | `PLANS_API_BASE_URL`            | Full URL of the external plan search API endpoint |
   | `PLANS_API_KEY`                 | API key for the external plan search service      |

   For production (Vercel + Supabase Auth), also verify:
   - In Supabase Dashboard -> Authentication -> URL Configuration:
   - Site URL: `https://your-domain.com`
   - Additional Redirect URLs includes: `https://your-domain.com/auth/callback`

4. **Run the development server**

   ```bash
   pnpm dev
   # or
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000).

## Project Structure

```
src/
  app/
    (auth)/           # Public routes: /login, /register
    (protected)/      # Authenticated routes: /dashboard
    api/plans/        # Route handler — proxies requests to external API
    layout.tsx        # Root layout (fonts, metadata)
    page.tsx          # Redirects to /dashboard
  components/
    auth/             # LoginForm, RegisterForm, AuthMosaic
    layout/           # SideNav, TopBar, PageTransition
    plans/            # SearchForm, PlanGrid, PlanCard, PlanDetailModal
    ui/               # shadcn/ui primitives
  lib/
    api/              # Client-side helper to call /api/plans/search
    supabase/         # Browser client, server client, server actions
    types/            # Shared TypeScript interfaces
  proxy.ts            # Route protection via Supabase session
```

## Available Commands

```bash
pnpm dev        # Start development server
pnpm build      # Production build
pnpm lint       # Run ESLint

# Alternatively with npm:
npm run dev
npm run build
npm run lint
```

## Authentication Flow

- Unauthenticated users are redirected to `/login` by middleware.
- After sign-in, users are redirected to `/dashboard`.
- Sign-out clears the session and redirects to `/login`.
- Email/password registration is handled via Supabase Auth.

## Plan Search Flow

1. User fills in zip code, effective date, birth date, and gender.
2. The form submits to the Next.js Route Handler at `/api/plans/search`.
3. The Route Handler verifies the session, then forwards the request to the external API using the server-side `PLANS_API_KEY`.
4. Results are returned to the client and rendered as animated plan cards.
5. Clicking a card opens a detail modal with full plan breakdown.
