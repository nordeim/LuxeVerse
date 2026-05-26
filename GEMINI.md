# LuxeVerse — Agent Instructions

## 1. Identity & Philosophy
LuxeVerse is a cinematic luxury e-commerce platform ("digital atelier") built on the **Anti-Generic Mandate**. 
- **Core Philosophy**: Reject template-driven aesthetics, "AI-slop", purple gradients, bento grids, and lazy font fallbacks. Prioritize whitespace, hierarchy, and artistic storytelling.
- **Emotional Resonance**: Every pixel must feel intentional, premium, and high-performance. Imperfection and human fingerprint signal authorship over machine-generated monotony.
- **Accessibility**: **WCAG 2.2 AA is the legal floor** (ADA Title II, EAA); **AAA is the design ambition** for key user journeys.
- **Typography Resilience**: Reject lazy `system-ui, sans-serif` defaults. Rely on explicit web fonts. Carefully tuned fallback fonts with matching metrics (`size-adjust`, `font-display: swap`) are permitted strictly to prevent FOIT (Flash of Invisible Text).

## 2. Tech Stack & Architecture
- **Framework**: Next.js 16 (App Router, RSC-first, PPR, Turbopack)
- **UI**: React 19, Tailwind CSS v4 (CSS-first, OKLCH palette), Radix/shadcn
- **Language**: TypeScript 5.8+ (Strict, `erasableSyntaxOnly`, `verbatimModuleSyntax`)
- **DB & API**: PostgreSQL, Prisma (Zero-enum), tRPC v11 (End-to-end type safety)
- **State**: Zustand v5 (Client), TanStack Query (Server)
- **Auth & Payments**: NextAuth v5, Stripe
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
├── proxy.ts                  # Next.js 16 Middleware (replaces middleware.ts)
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
- **Middleware**: Next.js 16 uses `proxy.ts` instead of `middleware.ts`. **Constraint**: `proxy.ts` runs on the **Node.js runtime only**. Edge Runtime is not supported.
- **Global Error**: `global-error.tsx` **must** define its own `<html>` and `<body>` tags (it replaces the root layout entirely).

### Tailwind CSS v4 (CSS-First)
- **Zero Config**: No `tailwind.config.*`. All tokens live in `globals.css` via `@theme inline`.
- **Custom Utilities**: Use `@utility name { ... }` (NOT `@layer utilities`).
- **Tokens**: Use OKLCH tokens (e.g., `bg-obsidian-900`), **never raw hex**.
- **CSS Variables**: Use v4 parenthesis syntax `bg-(--brand)` (NOT v3 bracket syntax `bg-[--brand]`).
- **Variant Stacking**: Left-to-right order (e.g., `*:first:pt-0`, NOT `first:*:pt-0`). Verify generated CSS for complex stacking specificity.
- **Utility Migration**: `bg-linear-to-r` (not gradient), `outline-hidden` (not none), `shrink-0` (not flex-shrink-0).

### State & Data (Zustand / Prisma / tRPC)
- **Zustand v5 Selectors**: Use `useShallow` for object selectors to prevent infinite loops. No `getState` in render loops.
- **Zustand Persistence**: `partialize` must exclude UI state (`isOpen`, `isLoading`).
- **Prisma Decimals**: Convert Prisma `Decimal` to `Number()` in service layers before passing to Client Components.
- **tRPC v11 Superjson**: Required for Date serialization. In v11, `transformer: superjson` **must** be placed inside `httpBatchLink()`, not at the root client config.
- **Service Factories**: Use `create*Service()` for RSC data fetching. tRPC is for mutations, RSC is for initial page data.

### i18n (next-intl v4 Split Architecture)
- **`routing.ts`** (Edge): Uses `defineRouting()`. Consumed by `proxy.ts`.
- **`request.ts`** (Node): Uses `getRequestConfig()`. Consumed by `createNextIntlPlugin`.
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
| **Styling** | `bg-(--brand)`, `@utility glass { ... }` | `bg-[--brand]`, `@layer utilities { ... }` |
| **Components** | `<Sheet>` with focus trap & scroll lock | Custom `<div>` overlay with manual `z-index` math |
| **Data Fetching** | RSC fetches via Service Factory → passes to Client | tRPC `useQuery` for initial above-the-fold page data |
| **Auth (Server)** | `getToken` + `await cookies()` assembly | `getServerSession` (Pages Router only, crashes in RSC) |
| **Mobile Nav** | Symmetrical: `hidden md:flex` / `md:hidden` | JS-based viewport width checking on mount |
| **State** | `useShallow(s => ({ a: s.a, b: s.b }))` | `useStore(s => ({ a: s.a, b: s.b }))` (Causes loops in v5) |

## 7. Security & Mobile Standards (OWASP 2025)
- **Security Headers**: Enforce `Content-Security-Policy: frame-ancestors 'none'` (primary), with `X-Frame-Options: DENY` only for legacy browser fallback. Also enforce `X-Content-Type-Options: nosniff` and strict `Referrer-Policy`.
- **Mobile Nav**: Use `shadcn/ui` Sheet with symmetrical breakpoints. Must include focus trap, ESC dismiss, and scroll lock.
- **Overlays**: Mandatory `useFocusTrap` and `useLockBodyScroll` for all modals/sheets.

## 8. Troubleshooting & Battle-Tested Gotchas

### PWA & Turbopack Conflict
- **Issue**: `@ducanh2912/next-pwa` relies on `workbox-webpack-plugin`, which Turbopack does not support.
- **Fix**: You **must** use the officially documented `--webpack` flag for production builds (`next build --webpack`). 
- **Alternative**: Migrate to **Serwist** (Configurator mode) for native Turbopack support via post-build steps.

### "Slow Filesystem" Warning
- **Issue**: `⚠ Slow filesystem detected. The benchmark took >200ms.`
- **Cause**: Turbopack performs thousands of micro-file reads. Running on a network mount, external HDD, or WSL2 cross-OS boundary causes HMR hangs and timeouts.
- **Fix**: Move the project to a native Linux filesystem (e.g., `ext4`/`btrfs` in `/home/user/`).

### tRPC Date Serialization (`Type 'string' is not assignable to type 'Date'`)
- **Cause**: Standard JSON degrades Prisma `Date` objects to ISO strings.
- **Fix**: Implement `superjson` globally inside `httpBatchLink`. 
- **Audit**: Search for `new Date(` to remove manual parsing wrappers that will break once `superjson` returns native Date objects.

### Server-Side Auth in Server Actions
- **Issue**: `getServerSession` throws `TypeError` in App Router Server Actions.
- **Fix**: Use `getToken` from `next-auth/jwt` + `await cookies()` header assembly.

### Dual Localized Routes
- **Issue**: Having both `/account` and `[locale]/account` causes routing conflicts.
- **Fix**: Delete top-level pages. Merge into `[locale]/` and use `proxy.ts` to redirect legacy paths to `/{defaultLocale}/...`.

## 9. Verification & Quality Gates

### Pipeline (Must pass before completion)
```bash
pnpm typecheck && pnpm lint && pnpm test && pnpm build
```

### Custom Lint Regex (Tailwind v4 Migration)
Use `\b` word boundaries to catch deprecated v3 classes without false positives:
```bash
# Scan for deprecated v3 utilities
grep -rEn '\bbg-gradient-to-[a-z]+\b|\boutline-none\b|\bflex-shrink-0\b' src/
# Scan for raw hex colors
grep -rEn 'text-\[#[0-9A-Fa-f]{3,6}\]|bg-\[#[0-9A-Fa-f]{3,6}\]' src/
# Scan for banned TS syntax
grep -rn 'enum \|namespace ' src/
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

