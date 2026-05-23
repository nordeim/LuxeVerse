# LuxeVerse — Agent Instructions

## Identity & Purpose
LuxeVerse is a cinematic luxury e-commerce platform built on the **Anti-Generic Mandate**. Reject template-driven design, purple gradients, and system font fallbacks. Every pixel must feel intentional.

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

### 2. `params` & `searchParams` are Plain Objects
In Next.js 16, they are **NOT** Promises. 
❌ `const { slug } = await params`
✅ `const { slug } = params` (Direct destructuring)

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

- **R3F Components**: Cannot be `lazy()` destructured. Direct import + `<Suspense>` only.
- **Zod v4 API**: Use `result.error.issues`, NOT `.errors`.
- **Testing**: `screen.getByText` is exact match. Use `getAllByText` or `toHaveTextContent` for partials/duplicates.
- **Accessibility**: WCAG AAA target. `useFocusTrap` is mandatory for all overlays.
- **Motion**: `framer-motion`. Respect `useReducedMotion()`.

## Core Stacks
- **Framework**: Next.js 16.2.6 (App Router, RSC-first)
- **Language**: TypeScript 6.0.3 (Strict, no enums)
- **Styling**: Tailwind 4.3.0 (CSS-first)
- **DB**: Prisma 6.19.3 (PostgreSQL, zero enums)
- **API**: tRPC 11.17.0
- **Auth**: NextAuth 4.24.14
- **State**: Zustand 5.0.13
- **Test**: Vitest 3.2.4 (jsdom)
