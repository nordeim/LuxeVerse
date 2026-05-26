# LuxeVerse — Agent Instructions

## Identity & Purpose
LuxeVerse is a cinematic luxury e-commerce platform built on the **Anti-Generic Mandate**. It merges editorial-grade design with AI-driven personalization. Every interaction must feel premium, intentional, and high-performance.

**Core Philosophy**: Reject template-driven aesthetics and "AI-slop". Prioritize whitespace, hierarchy, and artistic storytelling.

## Tech Stack
- **Framework**: Next.js (App Router, RSC-first, PPR)
- **UI Library**: React 19
- **Language**: TypeScript 6 (Strict mode, `erasableSyntaxOnly`)
- **Styling**: Tailwind CSS v4 (CSS-first, OKLCH palette)
- **Database**: PostgreSQL + Prisma
- **API**: tRPC 11 (End-to-end type safety)
- **Auth**: NextAuth v4
- **State**: Zustand 5
- **i18n**: next-intl v4
- **Payments**: Stripe

## Architecture
Turborepo monorepo with pnpm workspaces:
- `apps/web`: Primary storefront application.
- `packages/ui`: Shared Radix-based primitives.
- `packages/utils`: Shared helper functions (cn, formatting).
- `packages/config`: Shared TS, ESLint, and Tailwind configurations.

## Essential Commands
| Command | Action |
|---------|--------|
| `pnpm turbo dev` | Start all services (Turbopack for web) |
| `pnpm turbo build` | Build all apps (Web app uses `--webpack` flag) |
| `pnpm turbo test` | Run Vitest unit and component tests |
| `pnpm turbo lint` | Run custom lint validation (TW4 + colors) |
| `pnpm typecheck` | Run TypeScript check across all packages |
| `pnpm db:generate` | Regenerate Prisma client (Mandatory after schema changes) |

## Development Conventions

### 1. TypeScript & React 19
- **Zero Enums**: Banned by `erasableSyntaxOnly`. Use string unions.
- **Zero Namespace**: Use ES modules exclusively.
- **Import Type**: Use `import type` for type-only imports.
- **Return Types**: Prefer inferred return types for components.
- **Forms**: Use `useActionState` + Zod v4 (`result.error.issues[0].message`).
- **Instant UI**: Use `useOptimistic` + `startTransition` for optimistic updates.

### 2. Next.js 16 Duality
- **Layouts**: `params` is a `Promise` — must `await`.
- **Pages**: `params` is a plain object at runtime, but type as `Promise<T>` to satisfy `tsc`.
- **Cookies**: `cookies()` is async — always `await cookies()`.

### 3. Tailwind CSS v4 (CSS-First)
- **Zero Config**: All tokens live in `src/app/globals.css` via `@theme inline`. No `tailwind.config.*`.
- **Tokens**: Use OKLCH tokens (e.g., `bg-obsidian-900`), never raw hex.
- **Migration**: Use `bg-linear-to-r` (v4), `outline-hidden` (a11y), and `shrink-0`.

### 4. State Management (Zustand)
- **Selectors**: Always use selectors in JSX: `const items = useStore(s => s.items)`.
- **No getState in JSX**: `.getState()` is strictly prohibited in render loops.
- **Persistence**: `partialize` must exclude UI state (`isOpen`, `isLoading`).

### 5. Database & API (Prisma/tRPC)
- **Decimal Conversion**: Convert Prisma `Decimal` to `Number()` in service layers.
- **Service Factory**: Use `create*Service()` for RSC data fetching.
- **Superjson**: Required for Date serialization over tRPC.

### 6. i18n (next-intl v4)
- **Architecture**: Split `routing.ts` (Edge/Middleware) and `request.ts` (Node/RSC).
- **Configuration**: Use `defineRouting` and `getRequestConfig` factories.
- **Root Layout**: Must be a minimal pass-through; site components live in `[locale]/layout.tsx`.

## Critical Gotchas
- **PWA**: Turbopack incompatible with custom `sw.ts`. Use auto-generated mode or build with `--webpack`.
- **Auth**: Use `getToken` + cookie header assembly in Server Actions.
- **Sentry**: Use dynamic import + fallback stub to avoid hard dependencies.
- **A11y**: WCAG AAA target. Mandatory `SkipLink` and focus traps for overlays.
- **Icons**: Lucide icons ONLY. No emojis or raw characters in UI.

## Verification Pipeline
Before completion, ensure all gates pass:
`pnpm typecheck && pnpm lint && pnpm test && pnpm build`
