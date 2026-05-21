# LuxeVerse — Agent Instructions

Quick-start guardrails for OpenCode sessions. Full conventions: `CLAUDE.md`.

## Identity & Purpose
Luxury e-commerce. Anti-generic. Cinematic storytelling meets intelligent commerce. Every interaction must feel premium and intentional.

## Current Project Status
- **Status**: Phase 2 (Cinematic Experience) Verified; Entering Phase 3 (AI & Personalization).
- **Milestones**: Database seeded, Core Commerce (Cart/Checkout/Stripe) functional, Search (tRPC) wired, 3D Product Viewer active, Editorial system functional.

## Tech Stack
| Layer | Tech | Note |
|-------|------|------|
| Framework | Next.js 16.2.6 (App Router) | RSC-first, PPR ready. |
| Language | TypeScript 6.0.3 | `strict`, `erasableSyntaxOnly` (No enums). |
| Styling | Tailwind CSS 4.3.0 | CSS-first only. Zero config files. |
| DB | Prisma 6.19.3 + PostgreSQL 17 | Zero enums. String + Union patterns. |
| API | tRPC 11 + Zod 4.4 | End-to-end type safety. |
| Auth | NextAuth 4.24.14 | v4 stable. Uses JWT + Role-based access. |
| State | Zustand 5.0 | Selector discipline required. |
| Monorepo | pnpm + Turborepo | Parallel task orchestration. |

## Essential Commands
```bash
# Verify entire repo (Run before any completion claim)
pnpm typecheck && pnpm lint && pnpm test && pnpm build

# Web App Only (from apps/web/)
pnpm dev          # Next.js dev (Turbopack)
pnpm typecheck    # tsc --noEmit
pnpm lint         # Custom shell scripts (next lint is removed)
pnpm test         # Vitest run

# DB Management (from apps/web/)
pnpm db:generate  # prisma generate (Run after schema changes!)
pnpm db:migrate   # prisma migrate dev
pnpm db:seed      # Seed luxury products
```

## Monorepo Boundaries
- `apps/web`: Next.js 16 application. All business logic and routes.
- `packages/ui`: Reusable UI primitives. Imports: `import { Button } from "@luxeverse/ui"`.
- `packages/utils`: Shared utilities (`cn`, formatters). Imports: `import { cn } from "@luxeverse/utils"`.

## The 10 Mistake Magnets (Verified Fixes)

### 1. Next.js 16 CLI: `next lint` is REMOVED
`pnpm lint` in `apps/web` runs custom shell scripts (`validate-deprecated-twind.sh`, `validate-colors.sh`). Do not attempt to run `next lint` or `npx next lint`.

### 2. `params` & `searchParams` are Plain Objects
In Next.js 16, `params` and `searchParams` in `page.tsx` are **NOT** Promises. 
❌ `const { slug } = await params` (Silent bug or hydration error)
✅ `const { slug } = params` (Direct destructuring)

### 3. React 19: `JSX.Element` is BANNED
The global `JSX` namespace is removed. 
❌ `function Component(): JSX.Element`
✅ `function Component()` (Inferred) or `import { ReactElement } from "react"`

### 4. Tailwind v4: strictly CSS-First
❌ No `tailwind.config.js` or `tailwind.config.ts`.
✅ Configure only in `globals.css` via `@theme inline { ... }`.
✅ Utilities: `bg-linear-to-r` (v4) NOT `bg-gradient-to-r` (v3).

### 5. TypeScript: `erasableSyntaxOnly`
❌ `enum Status { ... }` or `namespace MySpace`.
✅ Use string unions: `type Status = "ACTIVE" | "DRAFT"`.

### 6. Zustand Selector Discipline
✅ `const items = useCartStore((s) => s.items)` in JSX only.
❌ `useCartStore.getState().items` is banned in JSX (causes stale data).
✅ `partialize` must exclude UI state (`isOpen`, `isLoading`).

### 7. RSC vs Client Boundaries
✅ Server Components (RSC) by default.
✅ `"use client"` MUST be the very first line (before imports).
❌ No `window`, `document`, or `localStorage` in RSC.

### 8. Prisma Schema Sync
Run `pnpm db:generate` immediately after any change to `schema.prisma`. 
TS errors like `TS2339` (missing property) are usually solved by regenerating the client.

### 9. Forms & Buttons
✅ Use `useActionState` + Zod v4 (`result.error.issues[0].message`) for all form mutations.
✅ Buttons default to `type="button"` unless they are form submission triggers.

### 10. No Emojis, No Raw Hex
❌ 🛍️ ✕ 🎉 in JSX → ✅ Lucide icons only.
❌ `bg-[#1a1a2e]` → ✅ `bg-obsidian-900` (Use design tokens).

## Consequence Matrix
- `any` or `enum` in code? CI fails (`tsc --noEmit`).
- `tailwind.config.js` exists? Build fails.
- `await params` in Page? Hydration mismatch or undefined values at runtime.
- Raw `<a>` for internal nav? Full page reload (State lost). Use `<Link>`.

## High-Signal Context
- **Testing**: `vitest` + `jsdom`. All store mutations in tests must be wrapped in `act()`.
- **Accessibility**: WCAG AAA target. `useFocusTrap` is mandatory for all overlays.
- **Motion**: `framer-motion`. Respect `useReducedMotion()`. Motion must serve narrative.
