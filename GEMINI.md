# LuxeVerse — Agent Instructions

## Identity & Purpose
LuxeVerse is a cinematic luxury e-commerce platform built on the **Anti-Generic Mandate**. It merges editorial-grade design with AI-driven personalization. Every interaction must feel premium, intentional, and high-performance.

**Core Philosophy**: Reject template-driven aesthetics and "AI-slop". Prioritize whitespace, hierarchy, and artistic storytelling.

## Tech Stack
- **Framework**: Next.js 16.2.6 (App Router, RSC-first)
- **UI Library**: React 19.2.6
- **Language**: TypeScript 6.0.3 (Strict mode)
- **Styling**: Tailwind CSS v4.3.0 (CSS-first, OKLCH palette)
- **Database**: PostgreSQL 17 + Prisma 6.19.3
- **API**: tRPC 11.17.0 (End-to-end type safety)
- **Auth**: NextAuth 4.24.14
- **State**: Zustand 5.0.13
- **i18n**: next-intl 4.12.0
- **Payments**: Stripe 17.7.0

## Architecture
Turborepo monorepo with pnpm workspaces:
- `apps/web`: Primary Next.js 16 storefront.
- `packages/ui`: Shared Radix-based primitives (Button, Input, etc.).
- `packages/utils`: Shared helper functions (cn, formatting).
- `packages/config`: Shared TS, ESLint, and Tailwind configurations.

## Building and Running
### Core Commands (Root)
| Command | Action |
|---------|--------|
| `pnpm install` | Install all dependencies |
| `pnpm turbo dev` | Start all services in development mode |
| `pnpm turbo build` | Build all apps for production (Note: Web app uses `--webpack` flag) |
| `pnpm turbo test` | Run Vitest unit and component tests |
| `pnpm turbo lint` | Run custom lint validation (TW4 + colors) |
| `pnpm turbo typecheck` | Run TypeScript check across all packages |
| `pnpm db:generate` | Regenerate Prisma client (Mandatory after schema changes) |

### Apps/Web Specifics
From `apps/web/`:
- `pnpm dev`: Start Next.js with Turbopack.
- `pnpm build`: Build with PWA webpack mode.
- `pnpm db:migrate`: Run Prisma migrations.
- `pnpm db:seed`: Seed DB with luxury product data.

## Development Conventions

### 1. TypeScript Strictness
- **Zero Enums**: Banned by `erasableSyntaxOnly`. Use string unions: `type Status = "ACTIVE" | "DRAFT"`.
- **Zero Namespace**: Use ES modules exclusively.
- **Zero `any`**: Use `unknown` or explicit typed interfaces.
- **Import Type**: Use `import type` for type-only imports (`verbatimModuleSyntax`).

### 2. Next.js 16 `params` Duality
- **Layouts**: `params` is a `Promise` — must `await`: `const { locale } = await params`.
- **Pages**: At runtime `params` is a plain object, but generated types expect `Promise<T>`.
- **Convention**: Type as `Promise<T>` and use `await` to satisfy `tsc --noEmit`.
  ```tsx
  export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
  }
  ```

### 3. Tailwind CSS v4 (CSS-First)
- **No Config File**: Do not create `tailwind.config.*`. All tokens live in `src/app/globals.css` via `@theme inline`.
- **Tokens**: Use OKLCH design tokens (e.g., `bg-obsidian-900`) instead of raw hex codes.
- **Utility Migration**: Use `bg-linear-to-r` (v4), `outline-hidden` (a11y), and `shrink-0`.

### 4. React 19 Patterns
- **Forms**: Use `useActionState` + Zod v4 (`result.error.issues[0].message`).
- **Instant UI**: Use `useOptimistic` + `startTransition` for optimistic updates.
- **Id**: Use `useId()` for stable ARIA pairs to avoid hydration mismatches.

### 5. Zustand State Discipline
- **Selectors**: Always use selectors in JSX: `const items = useCartStore(s => s.items)`.
- **No getState in JSX**: `.getState()` is strictly prohibited in render loops; use only in actions.
- **Persistence**: `partialize` must exclude UI state (`isOpen`, `isLoading`).

### 6. RSC vs Client Boundaries
- **RSC by Default**: Keep logic in Server Components.
- **"use client"**: Must be the very first line (before imports).
- **No Browser APIs in RSC**: Do not access `window`, `document`, or `localStorage` in Server Components.

### 7. Testing (TDD)
- **Stack**: Vitest + React Testing Library + Playwright.
- **Mocking**: Write failing tests with mock data before implementing.
- **Setup**: `src/test/setup.ts` contains mandatory mocks (rAF, crypto).

### 8. Anti-Generic UX
- **Icons**: Lucide icons ONLY. No raw characters (✕) or emojis in UI.
- **A11y**: WCAG AAA target. Mandatory `SkipLink` and focus traps for overlays.
- **Motion**: Respect `useReducedMotion()`.

## Quality Gates
Before completion claim, ensure:
1. `pnpm typecheck` passes (zero errors).
2. `pnpm lint` passes (zero warnings, no hex colors, no deprecated utilities).
3. `pnpm turbo test` passes (100% success rate).
4. `pnpm turbo build` completes successfully.

---
**Last Updated**: 2026-05-25
**Environment**: Node 22, Next.js 16.2.6, React 19.2.6, TS 6.0.3, TW 4.3.0, Prisma 6.19.3
