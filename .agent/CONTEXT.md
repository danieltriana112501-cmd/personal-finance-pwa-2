# AI Recursive Context (.agent/CONTEXT.md)

> **META-INSTRUCTION**: This file is the "BRAIN" of the project for any AI Agent. Read this BEFORE proposing changes. If you implement a change, you MUST update this file.

## 1. Tech Stack (Core DNA)
- **Framework**: Next.js 16.1 (App Router)
- **Language**: TypeScript 5.x (Strict Mode)
- **Styling**: Tailwind CSS 4.0 (PostCSS)
- **State Management**:
    - **Server State**: TanStack Query v5 (React Query)
    - **Client State**: React Context / Local State (Minimal)
- **Database**: Supabase (PostgreSQL)
- **Auth**: Supabase SSR (`@supabase/ssr`)
- **PWA**: `@ducanh2912/next-pwa` (Manifest & Service Workers enabled)

## 2. Architecture Overview
The project follows a **Feature-Based** directory structure within the Next.js App Router.

- **`app/`**: Routes and Pages.
    - `layout.tsx`: Root layout with PWA headers & QueryProvider.
    - `(auth)`: Login logic (implicit in `app/login`).
    - `api/`: Server-side API endpoints (currently minimal, relying on Server Actions/Direct DB calls).
- **`components/`**: encapsulated feature logic.
    - `dashboard/`: Main UI widgets (Donuts, Bars, FastTrack entry).
    - `budget/`: Budget management logic.
    - `savings/`: Savings goals tracking.
- **`lib/`**:
    - `supabase/`: `client.ts` (Browser) and `middleware.ts` (Server/Edge).
    - `utils.ts`: `cn` helper for Tailwind.

## 3. Database Schema (Source of Truth)
*Note: RLS policies status: MIXED (Security Risk).*

### `transactions`
- `id`: uuid (PK)
- `amount`: numeric
- `category`: text (food, transport, etc.)
- `type`: text (income, expense)
- `user_id`: uuid (FK -> auth.users)
- **RLS**: Enabled (but potentially disabled via script).

### `savings_goals`
- `id`: uuid (PK)
- `name`: text
- `target_amount`: numeric
- `current_amount`: numeric
- `target_date`: date
- **RLS**: **DISABLED** (Critical Issue).

### `budgets`
- `id`: uuid (PK)
- `category`: text (unique)
- `limit_amount`: numeric
- **RLS**: **DISABLED** (Critical Issue).

## 4. Key Workflows
- **Offline Entry**: `FastTrackDashboard` uses `useMutation` with `onMutate` to update the UI immediately (Optimistic UI) while the network request processes.
- **Auth**: Middleware intercepts requests. If no session, redirects to `/login` (except for static assets).

## 5. Current State & Metadata
- **Last Audit**: 2026-02-01
- **Critical Issues**: Missing RLS on `savings_goals` and `budgets`.
- **Environment**: Development / Preview.
