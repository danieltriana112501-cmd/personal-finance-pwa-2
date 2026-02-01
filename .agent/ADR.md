# Architectural Decision Records (ADR)

> **Purpose**: Record the "Why" behind major technical decisions to prevent regression and help future agents understand constraints.

## ADR-001: Supabase as Backend-as-a-Service
- **Context**: Need for rapid development, built-in Auth, and PostgreSQL database without managing infrastructure.
- **Decision**: Use Supabase.
- **Consequences**:
    - **Pros**: Instant Auth, RLS (when enabled), Realtime capabilities.
    - **Cons**: Vendor lock-in (moderate), reliance on their JS client.

## ADR-002: Offline-First Strategy via Optimistic UI
- **Context**: As a Personal Finance PWA, users often enter expenses on the go where connectivity is spotty.
- **Decision**: Use React Query (`@tanstack/react-query`) with `onMutate` handlers to update the UI immediately.
- **Status**: Implemented in `FastTrackDashboard`.
- **Trade-offs**:
    - **Pros**: UI feels instant (App-like).
    - **Cons**: Complex rollback logic (implemented via context).

## ADR-003: Tailwind CSS v4
- **Context**: Desire for the latest styling capabilities and performance.
- **Decision**: Adopt Tailwind v4 (Alpha/Beta at time of adoption).
- **Consequences**:
    - Simplifies configuration (no `tailwind.config.js` needed, just CSS).

## ADR-004: Security Model (Current Status)
- **Context**: Initial prototype phase.
- **Decision**: **TEMPORARILY** disable RLS on `savings_goals` and `budgets` to speed up dev.
- **Status**: **DEPRECATED / CRITICAL FIX NEEDED**.
- **Action**: Must enable RLS immediately for multi-user production support.
