# LuxeVerse — Agent Instruction File

**Purpose**: Prevent common mistakes. This is a luxury e-commerce platform. Generic "AI slop" UI is unacceptable. Every pixel must feel intentional and premium.

**Reference**: See `CLAUDE.md` for full conventions. This file is for quick onboarding and mistake prevention.

---

## Tech Stack

- Next.js 16 (App Router, RSC-first)
- React 19.2, TypeScript 6 (strict, `erasableSyntaxOnly`, `verbatimModuleSyntax`)
- Tailwind CSS v4 (CSS-first, **zero `tailwind.config.js`**)
- Prisma 7 + PostgreSQL (no enums — `String` + unions)
- tRPC + Zod v4 (`.issues[0].message` — not `.errors`)
- NextAuth v5 (JWT, edge-compatible)
- Zustand 5 (`partialize`, selector discipline)
- Turborepo + pnpm workspaces

---

## Critical Rules (Mistakes Agents Make Frequently)

### 1. Tailwind v4 — No Config File, Ever
```
✅ globals.css only: @theme inline { --color-obsidian-900: oklch(...) }
❌ No tailwind.config.js, tailwind.config.ts, or post.config.js
❌ No bg-gradient-to-r, outline-none, flex-shrink-0 (v3 utilities banned)
✅ Use: bg-linear-to-r, outline-hidden, shrink-0
```

### 2. TypeScript — `erasableSyntaxOnly` Bans These
```
❌ enum Status { ACTIVE, DRAFT }              → ✅ type Status = "ACTIVE" | "DRAFT"
❌ namespace MyNamespace                      → ✅ use ES modules only
❌ function foo(x: any)                       → ✅ function foo(x: unknown)
❌ interface Props (generic names)            → ✅ interface ProductCardProps
```

### 3. Zustand — Selector Discipline Is Law
```
✅ const items = useCartStore((s) => s.items)     in JSX only
❌ useCartStore.getState().items                   never in JSX
✅ .getState() permitted only inside store actions (not in render)
✅ partialize: (state) => ({ items: state.items }) — persist DATA only
❌ Never persist: isOpen, isLoading, toasts, or any UI state
```

### 4. RSC-First — Client Components Are Rare
```
✅ Server Components by default
✅ "use client" only for: interactivity, browser APIs, Zustand, tRPC, forms
❌ Never access document, window, or localStorage in RSC
❌ Never use useState, useEffect, useRef in RSC (throws at build time)

// RSC: correct for data fetch
export default async function Page() {
  const products = await prisma.product.findMany()
  return <ProductGrid products={products} />
}

// Client Component: isolated interactivity
"use client"
export function ProductGallery({ images }) {
  const [active, setActive] = useState(0)
  // ...interactive logic
}
```

### 5. Forms — `useActionState` + Zod v4 + Flat FormData
```
❌ Manual validation: if (!email.includes("@"))
✅ Zod at boundaries: result.error.issues[0].message

// FormData is flat — checkout schema must match field names exactly
const checkoutSchema = z.object({
  firstName: z.string(),  // NOT address: { firstName: ... }
  lastName: z.string(),
  line1: z.string(),
  // ...
})
```

### 6. tRPC — Validate at Every Boundary
```
❌ publicProcedure.query(async ({ ctx }) => { /* validate inside */ })
✅ publicProcedure.input(z.object({ id: z.string() })).query(async ({ input, ctx }) => { ... })
```

### 7. Next.js 16 — `params` Is Plain Object
```
❌ const { category } = await params         // params is NOT a Promise
✅ const { category } = params               // plain object, no await
```

### 8. Buttons Default to `type="button"`
```
❌ <button onClick={handleClick}>Click</button>     // defaults to submit
✅ <button type="button" onClick={...}>Click</button>
```

### 9. Focus Management in Drawers/Modals
```
❌ Focus returns to close button (inside drawer, which may be unmounted)
✅ Focus returns to trigger element that opened the overlay (cart icon, menu button)
```

### 10. No Emojis, No Raw Hex, No `bg-gradient-to-*`
```
❌ 🛍️ ✕ 🎉 in JSX              → ✅ Lucide icons only
❌ bg-[#1a1a2e]               → ✅ bg-obsidian-900 (design token)
❌ bg-gradient-to-r           → ✅ bg-linear-to-r
```

---

## Monorepo Boundaries

```
packages/
  ui/           → Reusable primitives, barrel export
  utils/        → cn(), formatters, barrel export
  config/       → tsconfig, eslint flat config

apps/
  web/          → Next.js 16 app, all business logic
    src/
      app/          → App Router (RSC by default)
      components/   → Co-located by feature
      server/         → tRPC routers, Prisma services
      stores/         → Zustand (cart, auth)
      types/          → Shared TypeScript types
      test/           → Factories, setup.ts
    prisma/         → schema.prisma (String for status, not enum)
```

### Workspace Imports
```
❌ import { Button } from "../../../packages/ui/src/button"
✅ import { Button } from "@luxeverse/ui"
✅ import { cn } from "@luxeverse/utils"
```

---

## Exact Commands

```bash
# Install (from root)
pnpm install

# Dev (from root)
pnpm dev                    # Turborepo: runs all apps

# From apps/web/
pnpm dev                    # Next.js dev (Turbopack)
pnpm typecheck              # tsc --noEmit (must pass 0 errors)
pnpm test                   # vitest run
pnpm test:watch             # vitest watch
pnpm lint                   # next lint
pnpm build                  # production build (must succeed)

# Database
pnpm db:generate            # prisma generate
pnpm db:migrate             # prisma migrate dev
pnpm db:seed                # prisma db seed (runs seed.ts)
pnpm db:studio              # prisma studio

# Pre-commit (ALL must pass)
pnpm typecheck && pnpm lint && pnpm test && pnpm build
```

---

## Service Factory Pattern

```ts
// Services are factories, not singletons
export function createProductService(): ProductService { ... }

// In router:
const service = createProductService()
return service.getBySlug(input.slug)
```

---

## Quick Reference

| Rule | Penalty if Broken |
|------|-----------------|
| `any` in code | CI fails (`tsc --noEmit`) |
| `enum` or `namespace` | `erasableSyntaxOnly` error |
| `tailwind.config.js` exists | Build fails (Tailwind v4 enforces CSS-first) |
| `.getState()` in JSX | Runtime: no reactivity, stale data |
| UI state persisted | localStorage leaks ephemeral state |
| `document`/`window` in RSC | Build-time error, SSR crash |
| Raw hex in className | Design token bypass, visual inconsistency |
| Emojis in UI | A11y failure, non-standard rendering |
| `bg-gradient-to-*` | Tailwind v4 compile error |
| `useState` in RSC | `ReferenceError: useState is not defined` at build time |

---

## When in Doubt

1. **Check `CLAUDE.md`** for detailed conventions
2. **Check `docs/`** for architecture, design tokens, runbook
3. **Check existing code** in the matching component/feature for patterns
4. **Never guess styling**: always use design tokens (`obsidian-*`, `metallic-*`, `neon-*`)
5. **Never guess TypeScript**: `strict` + `noUnusedLocals` + `noUnusedParameters` are enforced

## Files That Explain the System

| File | Why It Matters |
|------|---------------|
| `CLAUDE.md` | Full conventions (corollary to this file) |
| `apps/web/src/app/globals.css` | OKLCH palette, spacing, easing (source of truth for tokens) |
| `packages/config/tsconfig/base.json` | Strict TS rules (compiler enforces) |
| `apps/web/prisma/schema.prisma` | Data model, no enums, String for status |
| `turbo.json` | Monorepo pipeline, cache rules |
