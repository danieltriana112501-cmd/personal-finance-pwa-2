# Dependency Map & Critical Paths

## Core Logic (High Risk)
> Modifying these files affects the entire application.

- **`lib/supabase/client.ts`**: The bridge to the database for the browser.
- **`lib/supabase/middleware.ts`**: The gatekeeper. Handles session refreshing and route protection.
- **`app/layout.tsx`**: Injector for `QueryProvider` and PWA headers.

## Feature Modules (Medium Risk)
> Changes here are isolated to specific features.

### Dashboard Feature
- **Entry Point**: `app/page.tsx`
- **Components**:
    - `components/dashboard/fast-track-dashboard.tsx` (Complex: Optimistic Updates).
    - `components/dashboard/analysis-view.tsx` (Aggregator).
    - `components/dashboard/expenses-donut.tsx` (Data Viz).

### Budget Feature
- **Data Source**: `budgets` table.
- **Components**: `components/management/manage-budget-drawer.tsx`.

### Savings Feature
- **Data Source**: `savings_goals` table.
- **Components**: `components/savings/savings-card.tsx` (To be verified).

## External Dependencies (Third Party)
- **UI**: `lucide-react` (Icons), `sonner` (Toasts), `vaul` (Drawers).
- **Data**: `@tanstack/react-query` (Fetching), `recharts` (Charts).
- **Auth/DB**: `@supabase/ssr`, `@supabase/supabase-js`.
