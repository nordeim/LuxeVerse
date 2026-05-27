# LuxeVerse — Agent Instructions

## 1. Identity & Philosophy
LuxeVerse is a cinematic luxury e-commerce platform ("digital atelier") built on the **Anti-Generic Mandate**.
- **Core Philosophy**: Reject template-driven aesthetics, "AI-slop", purple gradients, bento grids, and lazy font fallbacks. Prioritize whitespace, hierarchy, and artistic storytelling.
- **Emotional Resonance**: Every pixel must feel intentional, premium, and high-performance. Imperfection and human fingerprint signal authorship over machine-generated monotony.
- **Accessibility**: **WCAG 2.2 AA is the legal floor** (ADA Title II, EAA); **AAA is the design ambition** for key user journeys.
- **Typography Resilience**: Reject lazy `system-ui, sans-serif` defaults. Rely on explicit web fonts. Carefully tuned fallback fonts with matching metrics (`size-adjust`, `font-display: swap`) are permitted strictly to prevent FOIT.

## 2. Tech Stack & Architecture
- **Framework**: Next.js 16 (App Router, RSC-first, Turbopack)
- **UI**: React 19, Tailwind CSS v4 (CSS-first, OKLCH palette), Radix/shadcn
- **Language**: TypeScript 5.1+ (Strict, `erasableSyntaxOnly`, `verbatimModuleSyntax`)
- **DB & API**: PostgreSQL, Prisma (Zero-enum), tRPC v11 (End-to-end type safety)
- **State**: Zustand v5 (Client), TanStack Query (Server)
- **Auth & Payments**: Auth.js v5 (NextAuth), Stripe
- **i18n**: next-intl v4 (Split Edge/Node architecture)
- **3D/Media**: Three.js, React Three Fiber, Motion (`motion/react`)
- **Testing**: Vitest, React Testing Library, Playwright
- **Monorepo**: Turborepo + `pnpm` workspaces (`apps/web`, `apps/admin`, `packages/ui`, `packages/utils`, `packages/config`, `packages/db`).

## 3. Architecture Blueprint
```text
apps/web/
├── app/                      # App Router (RSC default)
│   ├── globals.css           # Tailwind v4 @theme inline + @utility
│   ├── layout.tsx            # Minimal root pass-through
│   ├── [locale]/layout.tsx   # Real layout with Providers, Navbar, Footer
│   ├── global-error.tsx      # MUST include <html> and <body>
│   └── api/trpc/route.ts     # tRPC handler
├── components/
│   ├── layout/               # Navbar, Footer (RSC)
│   ├── shared/               # SkipLink, ErrorBoundary
│   ├── product/              # Card, Gallery, VariantSelector (Client)
│   └── ui/                   # shadcn primitives (Button, Sheet, Input)
├── hooks/                    # useFocusTrap, useReducedMotion, useCart
├── lib/                      # prisma.ts, schemas.ts, auth.ts, sentry.ts
├── server/
│   ├── routers/              # tRPC routers (mutations)
│   └── services/             # Factory functions (create*Service)
├── stores/                   # Zustand (cart.ts, auth.ts)
├── actions/                  # Server Actions (checkout, auth)
├── i18n/
│   ├── routing.ts            # defineRouting (Edge)
│   └── request.ts            # getRequestConfig (Node)
├── proxy.ts                  # Next.js 16 Proxy (replaces middleware.ts)
└── prisma/schema.prisma      # Zero enums
```

## 4. Essential Commands
| Command | Action |
|---|---|
| `pnpm install` | Install all dependencies |
| `pnpm turbo dev` | Start all services (Turbopack for web) |
| `pnpm turbo build` | Build all apps (Web uses `--webpack` flag for PWA compatibility) |
| `pnpm turbo test` | Run Vitest unit/component tests |
| `pnpm turbo lint` | Run custom shell lint scripts (`next lint` is removed in Next.js 16) |
| `pnpm typecheck` | Run TypeScript check across all packages |
| `pnpm db:generate` | Regenerate Prisma client (**Mandatory** after schema changes) |

## 5. Core Development Conventions

### TypeScript & React 19
- **Zero Enums/Namespaces**: Banned by `erasableSyntaxOnly`. Use string unions (`type Status = "ACTIVE" | "DRAFT"`).
- **Imports**: Use `import type` for type-only imports (`verbatimModuleSyntax`).
- **Return Types**: Prefer inferred. `JSX.Element` is banned (global namespace removed in React 19).
- **Forms**: Use `useActionState` + Zod v4. Read errors via `result.error.issues[0].message`. *Note: When defining Zod schemas, use the `error` parameter, not the deprecated `message` parameter.*
- **Instant UI**: Use `useOptimistic` + `startTransition`. Use `useId()` for stable ARIA pairs.

### Next.js 16 Async APIs (Critical)
- **Params & SearchParams**: **ALWAYS Promises** in both Layouts and Pages. **Must `await`** everywhere.
  - *Mandatory Comment*: `// Next.js 16: params is a real Promise, always await it.`
- **Cookies**: `cookies()` is async → **always `await cookies()`** in Server Actions/RSC.
- **Proxy**: Next.js 16 uses `proxy.ts` instead of `middleware.ts`. **Constraint**: `proxy.ts` runs on the **Node.js runtime only**. Edge Runtime is not supported.
- **Global Error**: `global-error.tsx` **must** define its own `<html>` and `<body>` tags (it replaces the root layout entirely).
- **Cache Components**: The `experimental.ppr` flag and `experimental_ppr` route segment configs have been removed. Opt into Partial Prerendering via `cacheComponents: true` in `next.config.ts` and the `"use cache"` directive.

### Tailwind CSS v4 (CSS-First)
- **Zero Config**: No `tailwind.config.*`. All tokens live in `globals.css` via `@theme inline`.
- **Custom Utilities**: Use `@utility name { ... }` (NOT `@layer utilities`).
- **Tokens**: Use OKLCH tokens (e.g., `bg-obsidian-900`), **never raw hex**.
- **CSS Variables**: Use v4 parenthesis syntax `bg-(--brand)` (NOT v3 bracket syntax `bg-[--brand]`).
- **Variant Stacking**: Left-to-right order (e.g., `*:first:pt-0`, NOT `first:*:pt-0`). Verify generated CSS for complex stacking specificity.
- **Utility Migration**: `bg-linear-to-r` (not gradient), `outline-hidden` (not none), `shrink-0` (not flex-shrink-0).

### Auth.js v5 Integration
- **The Universal `auth()` API**: Stop using `getServerSession`, `getToken`, and manual cookie header assembly. Auth.js v5 introduces the universal `auth()` function, which natively handles session extraction in Server Components, Server Actions, and Route Handlers.
- **Root Configuration**: Create `src/auth.ts` (or `auth.ts` at root) that exports `auth`, `signIn`, `signOut`, and `handlers`.
- **Proxy Integration**: In `src/proxy.ts`, integrate Auth.js v5 by exporting the `auth` wrapper:
  ```typescript
  // src/proxy.ts
  import { auth } from "@/auth";
  import createMiddleware from "next-intl/middleware";
  import { routing } from "@/i18n/routing";

  // Compose next-intl and Auth.js v5
  export default auth((req) => {
    const handleI18nRouting = createMiddleware(routing);
    return handleI18nRouting(req);
  });
  ```

### State & Data (Zustand / Prisma / tRPC)
- **Zustand v5 Selectors**: Use `useShallow` for object selectors to prevent unnecessary re-renders caused by strict equality checks. No `getState` in render loops.
- **Zustand Persistence**: `partialize` must exclude UI state (`isOpen`, `isLoading`).
- **Prisma Decimals**: Convert Prisma `Decimal` to `Number()` in service layers before passing to Client Components.
- **tRPC v11 Superjson**: Required for Date serialization. In v11, `transformer: superjson` **must** be placed inside `httpBatchLink()`, not at the root client config.
- **Service Factories**: Use `create*Service()` for RSC data fetching. tRPC is for mutations, RSC is for initial page data.

### i18n (next-intl v4 Split Architecture)
- **`routing.ts`** (Edge): Uses `defineRouting()`. Consumed by `proxy.ts` and navigation APIs.
- **`request.ts`** (Node): Uses `getRequestConfig()`. Consumed by `createNextIntlPlugin` and Server Components.
- **Fatal Error**: Pointing the plugin to `routing.ts` causes a `TypeError` crash. Must point to `request.ts`.
- **Turbopack Alias**: Required in `next.config.ts`: `turbopack: { resolveAlias: { "next-intl/config": "./src/i18n/request.ts" } }`.
- **Root Layout**: Must be a minimal pass-through. Site components (`Navbar`, `Footer`) and `NextIntlClientProvider` belong in `[locale]/layout.tsx`.

### Accessibility & UX
- **Icons**: Lucide icons ONLY. **Zero raw characters** (e.g., `≡`, `✕`, `→`) or emojis in UI.
- **Motion**: Respect `useReducedMotion()`. Animations must be disabled entirely when reduced motion is preferred.
- **Overlays**: Mandatory `useFocusTrap`, ESC dismiss, and `useLockBodyScroll` for all modals/sheets.

## 6. Patterns & Anti-Patterns

| Category | ✅ Valid Pattern (Do This) | ❌ Anti-Pattern (Never Do This) |
|---|---|---|
| **Routing** | `const { slug } = await params;` | `const { slug } = params;` (Crashes in Next 15/16) |
| **Auth (Server)** | `auth()` from `@/auth` | `getServerSession` or `getToken` (deprecated in v5) |
| **Auth (Proxy)** | `export { auth as proxy }` or `export default auth((req) => ...)` | Legacy `withAuth` composition |
| **Styling** | `bg-(--brand)`, `@utility glass { ... }` | `bg-[--brand]`, `@layer utilities { ... }` |
| **Components** | `<Sheet>` with focus trap & scroll lock | Custom `<div>` overlay with manual `z-index` math |
| **Data Fetching** | RSC fetches via Service Factory → passes to Client | tRPC `useQuery` for initial above-the-fold page data |
| **Mobile Nav** | Symmetrical: `hidden md:flex` / `md:hidden` | JS-based viewport width checking on mount |
| **State** | `useShallow(s => ({ a: s.a, b: s.b }))` | `useStore(s => ({ a: s.a, b: s.b }))` (Causes loops in v5) |
| **i18n Plugin** | `createNextIntlPlugin("./src/i18n/request.ts")` | `createNextIntlPlugin("./src/i18n/routing.ts")` (Runtime crash) |
| **Navigation** | `useRouter().push()` | `window.location.href` |
| **Links** | Next.js `<Link>` | Raw `<a>` for internal navigation |

## 7. Security & Mobile Standards (OWASP 2025)
- **Security Headers**: Enforce `Content-Security-Policy: frame-ancestors 'none'` (primary), with `X-Frame-Options: DENY` only for legacy browser fallback. Also enforce `X-Content-Type-Options: nosniff` and strict `Referrer-Policy`.
- **Mobile Nav**: Use `shadcn/ui` Sheet with symmetrical breakpoints. Must include focus trap, ESC dismiss, and scroll lock.
- **Overlays**: Mandatory `useFocusTrap` and `useLockBodyScroll` for all modals/sheets.

## 8. Troubleshooting & Battle-Tested Gotchas

### PWA & Turbopack Conflict
- **Issue**: `@ducanh2912/next-pwa` relies on `workbox-webpack-plugin`, which Turbopack does not support.
- **Fix**: You **must** use the officially documented `--webpack` flag for production builds (`next build --webpack`).
- **Alternative**: Migrate to **Serwist (Configurator Mode)** for native Turbopack support via post-build steps.

### "Slow Filesystem" Warning
- **Issue**: `⚠ Slow filesystem detected. The benchmark took >200ms.`
- **Cause**: Turbopack performs thousands of micro-file reads. Running on a network mount, external HDD, or WSL2 cross-OS boundary causes HMR hangs and timeouts.
- **Fix**: Move the project to a native Linux filesystem (e.g., `ext4`/`btrfs` in `/home/user/`).

### tRPC Date Serialization (`Type 'string' is not assignable to type 'Date'`)
- **Cause**: Standard JSON degrades Prisma `Date` objects to ISO strings.
- **Fix**: Implement `superjson` inside `httpBatchLink`.
- **Audit**: Search for `new Date(` to remove manual parsing wrappers that will break once `superjson` returns native Date objects.

### Server-Side Auth in Server Actions
- **Issue**: `getServerSession` throws `TypeError` in App Router Server Actions.
- **Fix**: Use the universal `auth()` function from `@/auth`. It works natively in Server Actions without manual cookie assembly.

### Dual Localized Routes
- **Issue**: Having both `/account` and `[locale]/account` causes routing conflicts.
- **Fix**: Delete top-level pages. Merge into `[locale]/` and use `proxy.ts` to redirect legacy paths to `/{defaultLocale}/...`.

### The `params` Microtask Illusion
- **Never** use direct destructuring (`const { slug } = params`) without `await`.
- **Never** remove `async/await` to "optimize" — `await` on a non-Promise triggers a microtask tick, but in Next.js 15+, `params` is an actual Promise. Removing `await` will result in `undefined` at runtime.

### Prisma Schema Synchronization
- **Command**: `pnpm db:generate` after EVERY schema change.
- **Gotcha**: Adding a required field to a model requires updating ALL `prisma.model.create()` calls, or `tsc --noEmit` fails with `TS2322`.
- **Gotcha**: Fields like `relevance` do NOT exist in the Prisma schema just because they make business sense. Check `schema.prisma` before using a field in a query.

### R3F Components Cannot Be `lazy()` Destructured
- **Never**: `const { Canvas } = lazy(() => import('@react-three/fiber'))`
- **Why**: R3F exports named components; `React.lazy()` requires `{ default }`. Destructuring a `LazyExoticComponent` fails at runtime.
- **Always**: Direct import + `<Suspense fallback={<Skeleton />}>`. The Suspense boundary defers heavy bundle load without `lazy()`.

### Search Router `orderBy` Trap
- **Bug fixed**: `search.ts` fell through to `{ relevance: "desc" }`, but Prisma has NO `relevance` field.
- **Fix**: `{ createdAt: "desc" }` as the default sort fallback. `views` can be used as a business-logic proxy for popularity.

### Zod v4 API (Not v3!)
- **Always**: `result.error.issues[0].message`
- **Never**: `result.error.errors[0].message` (Zod v3 API, removed in v4)

### Testing Library Text Matching Pitfalls
- **Symptom**: `getByText` fails with "Found multiple elements" when DOM contains duplicate text nodes.
- **Fix**: Use `getAllByText` for multiple matches; use `container.querySelector` for precise targeting; use `toHaveTextContent` for text spanning multiple elements.

### TypeScript `as any` Strict Mode Violations
- **Gotcha**: `as any` anywhere subverts strict mode. Use `Record<string, never>` for unknown objects, `as const` for literal unions, and explicit typed interfaces.
- **Example**: `const ctx = {} as any` → `const ctx: Record<string, never> = {}`

## 9. Verification & Quality Gates

### Pipeline (Must pass before completion)
```bash
pnpm typecheck && pnpm lint && pnpm test && pnpm build
```

### Custom Lint Regex (Tailwind v4 Migration)
Use `` word boundaries to catch deprecated v3 classes without false positives:
```bash
# Scan for deprecated v3 utilities
grep -rEn '\bbg-gradient-to-[a-z]+\b|\boutline-none\b|\bflex-shrink-0\b' src/
# Scan for raw hex colors
grep -rEn 'text-\[#[0-9A-Fa-f]{3,6}\]|bg-\[#[0-9A-Fa-f]{3,6}\]' src/
# Scan for banned TS syntax
grep -rn 'enum |namespace ' src/
```

### Performance Budgets
| Metric | Target | Enforcement |
|---|---|---|
| LCP | < 2.5s | Lighthouse CI |
| CLS | < 0.1 | Lighthouse CI |
| INP | < 200ms | Lighthouse CI |
| Initial Bundle | < 150KB | Next.js analyze |
| Accessibility | ≥ 95 | axe-core |

## 10. 6-Phase Execution Framework
1. **ANALYZE**: Deep requirement mining, audit existing code.
2. **PLAN**: File matrix, success criteria. *Gate: No code without documented plan.*
3. **VALIDATE**: Confirm alignment with user.
4. **IMPLEMENT**: Modular TDD, inline docs. *Gate: Zero console errors.*
5. **VERIFY**: `tsc`, a11y, perf. *Gate: All checks green.*
6. **DELIVER**: Handoff docs, runbook.

---

## Monorepo Structure

```
packages/
  config/
    tsconfig/        # Shared TypeScript configs (strict, erasableSyntaxOnly)
    eslint/           # Shared ESLint flat config
  ui/                 # Reusable UI primitives (Button, Input, Badge, etc.)
    src/
      button.tsx
      input.tsx
      badge.tsx
      avatar.tsx
      skeleton.tsx
      index.ts          # Barrel export
  utils/              # Shared utilities
    src/
      cn.ts             # clsx + tailwind-merge
      index.ts
apps/
  web/                # Next.js 16 application
    src/
      app/              # App Router
      components/       # Feature components
        layout/         # Navbar, Footer
        shared/         # SkipLink, ErrorBoundary
        product/        # ProductCard, ProductGallery, etc.
        cart/           # CartDrawer, CartItem, etc.
        auth/           # AuthForm, ProtectedRoute
        checkout/       # ShippingStep, PaymentStep, etc.
        search/         # SearchInput, SearchOverlay, FacetFilter, VisualSearchButton
        editorial/      # ArticleCard, RichTextRenderer, ProductEmbed
        sections/       # HeroSection, FeaturedCollections, etc.
      hooks/            # useFocusTrap, useCart, useDebounce
      lib/              # Utilities (prisma, schemas, auth, utils.test.ts)
      server/           # tRPC routers, services
        routers/        # product.ts, cart.ts, order.ts, search.ts (+ search.test.ts)
        services/       # product.service.ts, cart.service.ts
      stores/           # Zustand stores (cart, auth, wishlist)
      test/             # Factory mocks, setup.ts
      types/            # TypeScript type definitions
    prisma/
      schema.prisma     # DB schema (no enums — string unions)
    public/             # Static assets
    docs/
      architecture.md   # Monorepo, RSC/Client split, data flow
      runbook.md        # Commands, setup, common errors, troubleshooting
```

## Implementation Standards

### TypeScript Strict Mode (Non-Negotiable)
- `strict: true`, `erasableSyntaxOnly: true`, `verbatimModuleSyntax: true`
- `noUnusedLocals: true`, `noUnusedParameters: true`
- Zero `any` — use `unknown` or typed interfaces
- Zero `enum` — use string union types (`type Status = "ACTIVE" | "DRAFT"`)
- Zero `namespace` — use ES modules
- Component-prefixed interfaces: `ProductCardProps`, not `Props`
- Prefer `interface` over `type` for structural definitions
- `import type` for type-only imports (verbatimModuleSyntax)

### Next.js 16 App Router (RSC-First)
- Server Components by default, `"use client"` only for interactivity
- `params` is a **Promise** — always `await params` everywhere (Layouts AND Pages)
- RSC: Never access `document`, `window`, or browser APIs
- `next/image`: always explicit `width` + `height`, no CLS
- Metadata: `generateMetadata` for SEO on all pages
- Server Actions: `useActionState` + Zod for all form mutations

### Styling (Tailwind v4)
- **Zero `tailwind.config.*` files** — all configuration in `src/app/globals.css` via `@theme inline`
- OKLCH palette: `obsidian-*`, `neon-*`, `metallic-*`, `atmosphere-*`
- No raw hex: `bg-obsidian-900` not `bg-[#1a1a2e]`
- No arbitrary values: `w-[37px]` banned — extend `@theme` instead
- v4 utilities: `bg-linear-to-*`, `outline-hidden`, `shrink-0`
- Custom utilities: `@utility name { ... }` (not `@layer utilities`)
- CSS variables: `bg-(--brand)` (not `bg-[--brand]`)

### React 19 Patterns
- `useActionState` for all form submissions
- `useOptimistic` + `startTransition` for instant UI feedback
- `useId()` for stable `aria-controls` pairs
- Global `JSX` namespace removed — do not use `JSX.Element`

### Zustand State Discipline
- Selectors only in JSX: `useStore(s => s.field)` not `.getState()`
- `partialize` persists domain data only, never UI state
- `.getState()` permitted ONLY inside store actions, never in JSX
- **Strongly recommend** `useShallow` for object/array selectors to prevent unnecessary re-renders

### Backend (tRPC & Prisma)
- **Prisma Zero-Enum Pattern**: Use `String` + union types in TypeScript. `erasableSyntaxOnly` rejects `enum`.
- **tRPC Routers**: Public (`publicProcedure`) for unauthenticated; Protected (`protectedProcedure`) for auth-required.
- **Zod validation** at every boundary.
- **Service Factory Pattern**: Use `create*Service()` for RSC data fetching. Use `Prisma.CartGetPayload<IncludeShape>` for typed includes — NEVER use `any`.
- **Run `pnpm db:generate` after EVERY schema change**.
- **Update ALL `prisma.model.create()` when adding required fields**.

## Design System & Anti-Generic Mandate

### Color Palette (OKLCH — Perceptually Uniform)
| Token | OKLCH Value | Usage |
|-------|-------------|-------|
| `obsidian-50` | `oklch(0.98 0.002 260)` | Lightest background |
| `obsidian-900` | `oklch(0.12 0.005 260)` | Primary text |
| `obsidian-950` | `oklch(0.08 0.003 260)` | Button/dark surfaces |
| `neon-cyan` | `oklch(0.85 0.18 190)` | Focus indicators |
| `neon-pink` | `oklch(0.65 0.28 350)` | Errors/callouts |
| `metallic-champagne` | `oklch(0.88 0.06 75)` | Primary CTAs |
| `metallic-gold` | `oklch(0.78 0.14 85)` | Hover states |

### Typography (Fluid Scale)
```
hero:  clamp(3.5rem, 2.5rem + 5vw, 8rem)  — Page hero
h1:    clamp(2.5rem, 2rem + 2.5vw, 4rem)   — Page titles
h2:    clamp(2rem, 1.7rem + 1.5vw, 3rem)    — Section headers
h3:    clamp(1.5rem, 1.3rem + 1vw, 2rem)    — Card titles
body:  clamp(1rem, 0.9rem + 0.5vw, 1.125rem)
small: clamp(0.75rem, 0.7rem + 0.25vw, 0.875rem)
```

### Spacing (Golden Ratio)
```
--space-3xs: 0.236rem
--space-2xs: 0.382rem
--space-xs:  0.618rem
--space-sm:  1.000rem
--space-md:  1.618rem
--space-lg:  2.618rem
--space-xl:  4.236rem
--space-2xl: 6.854rem
```

## Quick Reference Card

### TypeScript
```
❌ enum, namespace                     → ✅ union type
❌ function(x: any)                   → ✅ function(x: unknown)
❌ import { UIState } from '...'       → ✅ import type { UIState } from '...'
❌ : Props (generic names)              → ✅ interface ProductCardProps
```

### Tailwind v4
```
❌ tailwind.config.js                   → ✅ @theme inline in globals.css
❌ bg-gradient-to-r                    → ✅ bg-linear-to-r
❌ outline-none                        → ✅ outline-hidden
❌ flex-shrink-0                       → ✅ shrink-0
❌ w-[37px]                            → ✅ extend @theme inline
❌ bg-[#1a1a2e]                        → ✅ bg-obsidian-900
❌ bg-[--brand]                        → ✅ bg-(--brand)
❌ @layer utilities { ... }             → ✅ @utility name { ... }
```

### Zustand
```
❌ useCartStore.getState().items       → ✅ useCartStore((s) => s.items)
❌ partialize: (s) => s               → ✅ partialize: (s) => ({ items: s.items })
❌ useStore(s => ({ a: s.a, b: s.b })) → ✅ useStore(useShallow(s => ({ a: s.a, b: s.b })))
```

### Next.js App Router (Next.js 16+)
```
❌ const { slug } = params              → ✅ const { slug } = await params
❌ <a href="/shop">                     → ✅ <Link href="/shop">
❌ window.location.href                → ✅ router.push("/path")
❌ middleware.ts                        → ✅ proxy.ts (Node.js runtime only)
❌ getServerSession / getToken           → ✅ auth() (Auth.js v5 universal)
❌ experimental.ppr                     → ✅ cacheComponents: true
❌ next.config.ts: eslint key           → ✅ remove eslint key (use .eslintrc only)
❌ next lint CLI                        → ✅ eslint or shell scripts
```

### React 19
```
❌ JSX.Element return type               → ✅ inferred return type
❌ useOptimistic for simple toggles       → ✅ useState for simple, useOptimistic for complex server-confirmed state
❌ Emoji icons (📷, 🎉, ✕)               → ✅ Lucide icons only
```

### Prisma
```
❌ enum Genre                           → ✅ genre String  // type Genre = "ROMANCE" | "THRILLER"
❌ cart: any                            → ✅ type CartWithItems = Prisma.CartGetPayload<{ include: {...} }>
```

### Auth.js v5
```
❌ getServerSession(req, res, authOptions) → ✅ auth()
❌ getToken({ req, secret })                → ✅ auth()
❌ withAuth middleware                      → ✅ export { auth as proxy } or export default auth((req) => ...)
```

### next-intl v4
```
❌ monolithic i18n.ts                     → ✅ routing.ts (Edge) + request.ts (Node)
❌ plugin pointing to routing.ts            → ✅ plugin pointing to request.ts
❌ middleware.ts for next-intl              → ✅ proxy.ts for next-intl
```

## Verification Commands Cheat Sheet

```bash
# Full verification pipeline
pnpm typecheck && pnpm lint && pnpm test && pnpm build

# Prisma type sync check
cd apps/web && pnpm db:generate && pnpm typecheck

# Tailwind v3 utility scan
grep -rEn 'bg-gradient-to-(r|l|t|b)|outline-none[^-]|flex-shrink-0' src/ packages/ apps/

# Raw hex color scan
grep -rEn 'text-\[#[0-9A-Fa-f]{3,6}\]|bg-\[#[0-9A-Fa-f]{3,6}\]' src/ packages/ apps/

# `<a>` tag internal nav scan
grep -rn '<a href="/' src/ packages/ apps/ --include="*.tsx"

# `window.location` usage scan
grep -rn 'window.location' src/ packages/ apps/ --include="*.tsx"

# `any` type scan
grep -rn ': any' src/ packages/ apps/ --include="*.ts" --include="*.tsx"

# `enum` / `namespace` scan
grep -rn 'enum ' src/ packages/ apps/ --include="*.ts" --include="*.tsx"

# Auth.js v5 deprecated API scan
grep -rn 'getServerSession\|getToken(' src/ packages/ apps/ --include="*.ts" --include="*.tsx"

# `middleware.ts` filename scan (should be proxy.ts)
find src/ -name "middleware.ts" -o -name "middleware.js"
```
