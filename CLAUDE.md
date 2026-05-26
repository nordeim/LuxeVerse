# LuxeVerse — Agent Instructions

## Identity & Purpose
LuxeVerse is a cinematic luxury e-commerce platform built on the **Anti-Generic Mandate**. Reject template-driven design, purple gradients, and system font fallbacks. Every pixel must feel intentional.
LuxeVerse is a production-grade, cinematic luxury e-commerce platform built as a monorepo. It prioritizes emotional resonance, artistic storytelling, and technical excellence.
Cinematic Luxury E-Commerce Platform — An immersive, AI-driven digital boutique experience. Blending art direction, intelligent personalization, and commerce to redefine luxury digital retail.

**Tech Stack**: Next.js 16.2.6 (App Router), React 19.2.6, TypeScript 6.0.3, Tailwind CSS v4.3.0 (CSS-first), Prisma 6.19.3, PostgreSQL, tRPC 11.17.0, NextAuth v4.24.14, Zustand 5.0.13, Stripe 17.7.0

**Architecture**: Turborepo monorepo with pnpm workspaces. Headless composable commerce with RSC-first rendering.
- **Purpose**: Redefine luxury digital retail through an immersive "digital atelier" experience.
- **Main Technologies**:
  - **Framework**: Next.js 16 (App Router, RSC-first, PPR)
  - **Language**: TypeScript 6.0+ (Strict mode, `erasableSyntaxOnly`)
  - **Styling**: Tailwind CSS v4.2+ (CSS-first, Oxide engine, OKLCH palette)
  - **DB & API**: Prisma 7, PostgreSQL 17, tRPC 11, Zod 4
  - **State**: Zustand 5 (Client state), TanStack Query 5 (Server state)
  - **3D/Media**: Three.js, React Three Fiber, Framer Motion 12
- **Architecture**:
  - **Monorepo**: Managed via `pnpm` workspaces and `Turborepo`.
  - **Apps**: `web` (Storefront), `admin` (Dashboard).
  - **Packages**: `ui` (Primitives), `design-system` (Tokens), `db` (ORM), `utils`.

## Core Stacks
- **Framework**: Next.js 16.2.6 (App Router, RSC-first)
- **Language**: TypeScript 6.0.3 (Strict, no enums)
- **Styling**: Tailwind 4.3.0 (CSS-first)
- **DB**: Prisma 6.19.3 (PostgreSQL, zero enums)
- **API**: tRPC 11.17.0
- **Auth**: NextAuth 4.24.14
- **State**: Zustand 5.0.13
- **Test**: Vitest 3.2.4 (jsdom)

## Essential Commands
```bash
# Verify entire repo (MANDATORY before completion claim)
pnpm typecheck && pnpm lint && pnpm test && pnpm build

# Web App (apps/web/)
pnpm dev          # Turbopack dev server
pnpm typecheck    # tsc --noEmit
pnpm lint         # Custom scripts (next lint is REMOVED)
pnpm test         # Vitest run
pnpm db:generate  # Run after ANY schema.prisma change
```

## Monorepo Boundaries
- `apps/web`: Next.js 16. All routes and business logic.
- `packages/ui`: Reusable primitives. `import { Button } from "@luxeverse/ui"`.
- `packages/utils`: Shared helpers. `import { cn } from "@luxeverse/utils"`.

## The 10 Mistake Magnets (Verified Fixes)

### 1. Next.js 16 CLI: `next lint` is REMOVED
`pnpm lint` in `apps/web` runs custom shell scripts. Do not attempt `npx next lint`.

### 2. `params` & `searchParams` (Next.js 16 Duality)

In Next.js 16, `params` behaves differently for **layouts** vs **pages**:

- **Layouts (`layout.tsx`, `template.tsx`)**: `params` is a `Promise`. You MUST `await` it.
  ```tsx
  export default async function Layout({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params; // ✅ CORRECT for layouts
  }
  ```
- **Pages (`page.tsx`)**: `params` is a **plain object**. Use direct destructuring. Do NOT use `await`.
  ```tsx
  export default function Page({ params }: { params: { slug: string } }) {
    const { slug } = params; // ✅ CORRECT for pages (no await)
  }
  ```
- **Note**: The Next.js 16 types still reflect `Promise<...>` in some IDE definitions, but the runtime behavior for pages is a plain object. `await` on a plain object returns the object itself, so it won't crash, but it is semantically incorrect and may cause edge-case issues. Always use direct destructuring for pages.
- **Migration Rule**: If a file is `page.tsx` (or any page component), remove `async` and `await` from `params`. If it's `layout.tsx`, keep `async` and `await`.

### 3. React 19: `JSX.Element` is BANNED
The global `JSX` namespace is removed. 
❌ `function Component(): JSX.Element`
✅ `function Component()` (Inferred) or `import { ReactElement } from "react"`

### 4. Tailwind v4: Strictly CSS-First
❌ No `tailwind.config.js`.
✅ Configure in `globals.css` via `@theme inline { ... }`.
✅ Use `bg-linear-to-r` (v4), NOT `bg-gradient-to-r` (v3).

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
TS errors like `TS2339` (missing property) are usually solved by regenerating.

### 9. Forms & Buttons
✅ Use `useActionState` + Zod v4 (`result.error.issues[0].message`) for all form mutations.
✅ Buttons default to `type="button"` unless submission triggers.

### 10. No Emojis, No Raw Hex
❌ 🛍️ ✕ 🎉 in JSX → ✅ Lucide icons only.
❌ `bg-[#1a1a2e]` → ✅ `bg-obsidian-900` (Use design tokens).

## Critical Gotchas

- **PWA Service Worker**: Turbopack is incompatible with custom `sw.ts` (workbox-webpack-plugin). Use auto-generated SW via `next-pwa` (no `swSrc`). Build with `--webpack` flag if custom SW is needed.
- **i18n `dir`**: Never hardcode `dir="ltr"`. Use `dir={isRTL(locale) ? "rtl" : "ltr"}` via `@/i18n/config`.
- **LanguageSwitcher**: Must use `useRouter().push()`, never `window.location.href`.
- **Redirect URL**: Never hardcode `/${defaultLocale}` in redirects. Use current locale or let middleware handle prefixing.
- **Next.js 16 `params`真理**: Layouts (Promise, await) vs Pages (plain object, no await). The types still say Promise for pages, but runtime is plain object. Ignore the type lie for pages.
- **next-pwa + Turbopack**: Custom `sw.ts` causes build failures. Use auto-generated mode (no `swSrc`) or force `--webpack` flag.
- **superjson for tRPC**: Prisma `Date` fields serialize to ISO strings over tRPC. Register `superjson` on both server (`transformer: superjson`) and client (`httpBatchLink`) to preserve `Date` objects.

## Building and Running

### Core Commands (Root)
| Command | Action |
|---------|--------|
| `pnpm install` | Install all dependencies |
| `pnpm turbo dev` | Start all apps and services in development mode |
| `pnpm turbo build` | Build all apps for production |
| `pnpm turbo test` | Run Vitest unit/component tests |
| `pnpm turbo lint` | Run custom lint validation (TW4 + colors) |
| `pnpm typecheck` | Run TypeScript check across all packages |
| `pnpm format` | Format all files with Prettier |

### Apps/Web Specifics
From `apps/web/`:
- `pnpm dev`: Start Next.js with Turbopack.
- `pnpm db:generate`: Regenerate Prisma client (Mandatory after schema changes).
- `pnpm db:migrate`: Run Prisma migrations.
- `pnpm db:seed`: Seed DB with luxury product data.

### Full verification pipeline
```bash
# Verify everything before claiming completion
pnpm typecheck && pnpm lint && pnpm test && pnpm build
```

## Development Conventions

### 1. TypeScript & React 19
- **Strict Mode**: `noUnusedLocals`, `noUnusedParameters`, and `noExplicitAny` are strictly enforced.
- **Erasable Syntax**: **Zero enums** — use string union types (`type Status = "ACTIVE" | "DRAFT"`).
- **Return Types**: Prefer inferred return types for components. Avoid explicit `: JSX.Element` as it was removed from the global namespace in React 19.
- **Hooks**: Use `useActionState` for forms and `useOptimistic` + `startTransition` for instant UI updates.

### 2. Styling (Tailwind v4)
- **Zero Config**: All configuration lives in `src/app/globals.css` via `@theme inline`. **No `tailwind.config.*` files.**
- **Tokens**: Use design tokens (e.g., `bg-obsidian-900`, `text-metallic-gold`) instead of raw hex code.
- **Negatives**: Use single-hyphen syntax (e.g., `-bottom-24`, not `bottom--24`).
- **Utilities**: `bg-linear-to-r` (v4) replaced `bg-gradient-to-r` (v3).

### 3. State Management (Zustand)
- **Selectors**: Always use selectors in JSX: `const items = useStore(s => s.items)`. **Never use `.getState()` in render.**
- **Persistence**: UI state (e.g., `isOpen`, `isLoading`) must be excluded from persistence via `partialize`.

### 4. Database (Prisma)
- **Schema Sync**: Always run `pnpm db:generate` after modifying `schema.prisma`.
- **Typing**: Use `Prisma.XGetPayload<IncludeShape>` for complex relations to ensure zero `any` in service layers.

### 5. Accessibility & Performance
- **WCAG AAA**: All interactive elements must be keyboard accessible and focus-visible.
- **Reduced Motion**: All animations must respect `prefers-reduced-motion`.
- **Budgets**: LCP < 2.5s, CLS < 0.1. `next/image` must have explicit dimensions.

### 6. Git Workflow
- **Commit Format**: `<type>: <subject>` (e.g., `feat(cart): add optimistic quantity updates`).
- **Verification**: Run `pnpm typecheck && pnpm lint && pnpm test` before any PR.

## Phase 5 Hardening & Launch (2026-05-26) ✅ COMPLETE

### P0: Production Data Integration
| Task | Files | Status |
|------|-------|--------|
| **Checkout Auth Binding** | `src/app/actions/checkout.actions.ts` + `.test.ts` | ✅ Real `getToken` from `next-auth/jwt` |
| **Editorial Service** | `src/server/services/editorial.service.ts` | ✅ Prisma-backed |
| **Featured Collections** | `src/server/services/featuredCollections.service.ts` | ✅ Prisma-backed |
| **New Arrivals** | `src/server/services/newArrivals.service.ts` | ✅ Prisma-backed |

### P1: API Integration
| Task | Files | Status |
|------|-------|--------|
| **Visual Search** | `src/server/routers/visualSearch.ts` | ✅ tRPC wired |
| **Newsletter** | `src/server/routers/newsletter.ts` | ✅ tRPC wired |

### P2: Observability
| Task | Files | Status |
|------|-------|--------|
| **Sentry Integration** | `src/lib/sentry.ts` + `src/app/global-error.tsx` | ✅ Conditional dynamic import |

### Verification
- **typecheck**: 0 errors
- **lint**: All checks passed
- **test**: 93 tests passed (19 test files)
- **build**: Production build succeeds

## Performance Budgets

| Metric | Target | Enforcement |
|--------|--------|-------------|
| LCP | < 2.5s | Lighthouse CI |
| CLS | < 0.1 | Lighthouse CI |
| INP | < 200ms | Lighthouse CI |
| Initial Bundle | < 150KB | Next.js analyze |
| Accessibility | ≥ 95 | axe-core / Lighthouse |

## Contact

engineering@luxeverse.com
