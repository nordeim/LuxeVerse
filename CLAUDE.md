---
IMPORTANT: File is read fresh for every conversation. Be brief and practical. This is a luxury e-commerce platform — every pixel and interaction must feel premium.
---

# LuxeVerse

**Cinematic Luxury E-Commerce Platform** — An immersive, AI-driven digital boutique experience. Blending art direction, intelligent personalization, and commerce to redefine luxury digital retail.

**Tech Stack**: Next.js 16.2.6 (App Router), React 19.2.6, TypeScript 6.0.3, Tailwind CSS v4.3.0 (CSS-first), Prisma 6.19.3, PostgreSQL, tRPC 11.17.0, NextAuth v4.24.14, Zustand 5.0.13, Stripe 17.7.0, next-intl 4.12.0, superjson 2.2.6

**Architecture**: Turborepo monorepo with pnpm workspaces. Headless composable commerce with RSC-first rendering.

---

## Project State (2026-05-25)

| Phase | Status | Completion | Key Deliverables |
|-------|--------|------------|-----------------|
| 0: Foundation | Complete | 2026-05-15 | Monorepo, design tokens, CI pass |
| 1: Core Commerce | Complete | 2026-05-20 | Product catalog, cart, checkout, Stripe, Auth |
| 2: Cinematic UX | Complete | 2026-05-21 | Homepage, search (tRPC), editorial, 3D, wishlist |
| 3: AI Personalization | Complete | 2026-05-22 | AI service layer, style quiz, streaming chat, outfit generation, size recommendations |
| 4: Scale, Loyalty & Social | Complete | 2026-05-25 | Loyalty engine (12 tests), i18n (EN/FR/AR), PWA (webpack mode), UGC, Sustainability, Account Hub |
| 5: Hardening & Launch | Planned | ETA 2026-08-30 | E2E tests, perf audit, docs, launch |

**Verification**: TypeScript 0 errors, 91 tests passing (18 test files), build succeeds with --webpack PWA flag.

---

## Foundational Principles

### Meticulous Approach (Six-Phase Workflow)

Follow this six-phase workflow for ALL implementation tasks:

1. **ANALYZE** — Deep, multi-dimensional requirement mining
2. **PLAN** — Structured execution roadmap (present for user validation)
3. **VALIDATE** — Explicit confirmation checkpoint (user approval before code)
4. **IMPLEMENT** — Modular, tested, documented builds
5. **VERIFY** — Rigorous QA against success criteria (typecheck, lint, test, build)
6. **DELIVER** — Complete handoff with knowledge transfer

### Anti-Generic Mandate
- **Reject AI Slop**: No template layouts, no predictable card grids, no "safe" design choices
- **Intentional Minimalism**: Use whitespace as a structural element, not empty space
- **Luxury Aesthetic**: OKLCH palette (Obsidian, Neon, Metallic, Atmosphere), fluid typography, golden-ratio spacing
- **Every Pixel Justified**: Every element must have a reason to exist

---

## Critical Gotchas (Updated 2026-05-24)

### Next.js 16 `params` — The Runtime vs. Type Duality

**CRITICAL DUALITY (Updated 2026-05-25)**:

| Layer | Type | Must Use |
|-------|------|----------|
| **Runtime** | Plain object `{}` | `const { slug } = params` (direct destructuring) |
| **Generated Types** (`.next/types/`) | `Promise<{ ... }>` | `params: Promise<{...}>` + `await` to satisfy tsc |

**Rule for Layouts**: `params` **IS** a `Promise` in `layout.tsx` and `template.tsx`. Always `await` it.

**Rule for Pages**: At **runtime**, `params` is a plain object. BUT `.next/types/` generates `Promise<T>` for `page.tsx` props (especially in Next.js 16.2+ with i18n route groups). You **must** type as `Promise<T>` and `await` it to prevent `TS2345` or `TS2307` errors.

```tsx
// ✅ CORRECT for pages (Must satisfy .next/types/ Promise<T> generation)
interface PageProps {
  params: Promise<{ slug: string }>;
}
export default async function Page({ params }: PageProps) {
  const { slug } = await params; // ✅ Required by generated types
  // ...
}

// ✅ CORRECT for layouts (Always Promise in Next.js 15+)
export default async function Layout({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params; // ✅ Always correct for layouts
}
```

**Why the duality exists**: Next.js 16's `.next/types/` generator interprets dynamic segments as `Promise<T>` to enable async prop resolution, even though the actual runtime `params` is a plain object. JavaScript's `await` on a non-Promise returns the same value (not a bug), so the runtime behavior is correct. TypeScript just needs the `Promise<T>` type annotation to pass `tsc --noEmit`.

**Prevention**: Always check `.next/types/app/[...]/page.ts` after build failures. If `params` is typed as `Promise<any>`, update your page props to match. Never fight the generated types — they are the source of truth for the type-checker.

### PWA Build with next-pwa
* **Symptom**: "This build is using Turbopack, with a webpack config and no turbopack config"
* **Fix**: Add `--webpack` to build script. Use auto-generated SW (no `swSrc`).
* **Never**: Use `swSrc` with Turbopack — `workbox-webpack-plugin` is webpack-only.
* **File**: `package.json`, `next.config.ts`

### tRPC Date Serialization
* **Symptom**: `Type 'string' is not assignable to type 'Date'` on client when using Prisma types
* **Fix**: Register `superjson` in BOTH server (`initTRPC`) AND client (`httpBatchLink`) configurations.
* **File**: `src/server/trpc.ts` + `src/trpc/provider.tsx`

### Prisma Schema Synchronization
* **Command**: `pnpm db:generate` after EVERY schema change
* **Gotcha**: Adding a required field to a model requires updating ALL `prisma.model.create()` calls, or `tsc --noEmit` fails with `TS2322`
* **Gotcha**: Fields like `relevance`, `viewCount`, `rating` must EXIST in `schema.prisma` before being used in queries. Do not assume.

### R3F Components Cannot Be `lazy()` Destructured
* **Never**: `const { Canvas } = lazy(() => import('@react-three/fiber'))`
* **Why**: R3F exports named components; `React.lazy()` requires `{ default }`. Destructuring a `LazyExoticComponent` fails at runtime.
* **Always**: Direct import + `<Suspense fallback={<Skeleton />}>`. The Suspense boundary defers heavy bundle load without `lazy()`.

### Search Router `orderBy` Trap
* **Bug fixed**: `search.ts` fell through to `{ relevance: "desc" }`, but Prisma has NO `relevance` field.
* **Fix**: `{ createdAt: "desc" }` as the default sort fallback. `views` can be used as a business-logic proxy for popularity.

### Zod v4 API (Not v3!)
* **Always**: `result.error.issues[0].message`
* **Never**: `result.error.errors[0].message` (Zod v3 API, removed in v4)

### Testing Library Text Matching Pitfalls
* **Symptom**: `getByText` fails with "Found multiple elements" when DOM contains duplicate text nodes (e.g., multiple cards in a list)
* **Fix**: Use `getAllByText` for multiple matches; use `container.querySelector` for precise targeting; use `toHaveTextContent` for text spanning multiple elements
* **Files**: All component test files

### TypeScript `as any` Strict Mode Violations
* **Gotcha**: `as any` anywhere subverts strict mode. Use `Record<string, never>` for empty testing objects, `as const` for literal unions, and explicit typed interfaces
* **Example**: `const ctx = {} as any` → `const ctx: Record<string, never> = {}`
* **Files**: `ai.test.ts`, `PersonalizedGrid.tsx` (fixed)

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
        [locale]/       # i18n layout + pages (EN/FR/AR)
        loyalty/        # Loyalty dashboard page
        [locale]/account # Account hub (order history, settings)
      components/       # Feature components
        loyalty/        # LoyaltyDashboard, PointsHistory, RedeemPointsButton
        sustainability/ # Scorecard
        social/         # UGCGallery
        account/        # AccountOverview
        layout/         # Navbar, Footer
        shared/         # SkipLink, ErrorBoundary, LanguageSwitcher
        product/        # ProductCard, ProductGallery, etc.
        cart/           # CartDrawer, CartItem, etc.
        auth/           # AuthForm, ProtectedRoute
      hooks/            # useFocusTrap, useCart, useWishlist
      lib/              # Utilities (prisma, schemas, auth)
      server/           # tRPC routers, services
        routers/        # product.ts, cart.ts, order.ts, loyalty.ts, ugc.ts, wishlist.ts, user.ts
        services/       # product.service.ts, cart.service.ts, loyalty.service.ts
      stores/           # Zustand stores (cart, auth, wishlist, style-profile)
      i18n/             # next-intl routing, config
      trpc/             # Client provider with superjson
    prisma/
      schema.prisma     # DB schema (PointHistory, UGCContent added)
    public/             # PWA manifest, icons, static assets
    docs/
      architecture.md   # Monorepo, RSC/Client split, data flow
      runbook.md        # Commands, setup, common errors
```

---

## Implementation Standards

### TypeScript 6 Strict Mode (Non-Negotiable)
- `strict: true`, `erasableSyntaxOnly: true`, `verbatimModuleSyntax: true`
- `noUnusedLocals: true`, `noUnusedParameters: true`
- Zero `any` — use `unknown` or typed interfaces
- Zero `enum` — use string union types (`type Status = "ACTIVE" | "DRAFT"`)
- Zero `namespace` — use ES modules
- Component-prefixed interfaces: `ProductCardProps`, not `Props`
- Prefer `interface` over `type` for structural definitions
- `import type` for type-only imports (verbatimModuleSyntax)

### Next.js 16 App Router (RSC-First)
- Server Components by default, "use client" only for interactivity
- `params` in layouts is a `Promise` (must `await`)
- `params` in pages is a plain object (direct destructuring)
- RSC: Never access `document`, `window`, or browser APIs
- `next/image`: always explicit `width` + `height`, no CLS
- Metadata: `generateMetadata` for SEO on all pages
- Server Actions: `useActionState` + Zod for all form mutations

### Tailwind CSS v4 (CSS-First)
- **Zero `tailwind.config.*` files** — all configuration in `globals.css`
- `@import "tailwindcss"` then `@theme inline` with design tokens
- OKLCH palette: `obsidian-*`, `neon-*`, `metallic-*`, `atmosphere-*`
- No raw hex: `bg-obsidian-900` not `bg-[#1a1a2e]`
- No arbitrary values: `w-[37px]` banned — extend `@theme` instead
- v4 utilities: `bg-linear-to-*`, `outline-hidden`, `shrink-0`

### React 19 Patterns
- `useActionState` for all form submissions
- `useOptimistic` + `startTransition` for instant UI feedback
- `useId()` for stable `aria-controls` pairs

### Zustand State Discipline
- Selectors only in JSX: `useStore(s => s.field)` not `.getState()`
- `partialize` persists domain data only, never UI state
- `.getState()` permitted ONLY inside store actions, never in JSX

---

## Backend (tRPC & Prisma)

### tRPC Routers
- Public: `publicProcedure` for unauthenticated
- Protected: `protectedProcedure` for auth-required
- Zod validation at every boundary
- `result.error.issues[0].message` for error messages (Zod v4 API)
- **CRITICAL**: `superjson` must be registered in both server and client configs for Date/Map/Set serialization

### Prisma (Zero Enums)
- Zero `enum` in schema — use `String` + union types
- Typed includes: `Prisma.CartGetPayload<IncludeShape>` not `any`
- Factory pattern: `createProductService(db)`, `createCartService(db)`
- **Run `pnpm db:generate` after EVERY schema change**
- **Update ALL `prisma.model.create()` when adding required fields**

---

## i18n (next-intl v4)

- **Locale config**: `src/i18n/config.ts` + `src/i18n/routing.ts` (MEP §4.3)
- **Path-based routing**: `/en/shop`, `/fr/shop`, `/ar/shop`
- **RTL support**: CSS logical properties (`margin-inline`, `text-align: start`)
- **Locale switcher**: Uses `useRouter().push()` (NOT `window.location.href`)
- **Messages**: `messages/en.json`, `messages/fr.json`, `messages/ar.json`
- **Middleware**: `src/middleware.ts` with `next-intl/middleware`
- **Layout**: `src/app/[locale]/layout.tsx` with `NextIntlClientProvider`

---

## PWA (next-pwa)

- **Build flag**: `--webpack` required in `package.json` build script
- **Config**: `next.config.ts` wraps with `withPWA({ dest: "public", disable: dev })`
- **Manifest**: `public/manifest.json` with app metadata, icons, theme colors
- **Service worker**: Auto-generated (no `swSrc`); for custom SW, avoid Turbopack
- **Registration**: Automatic via `next-pwa` (no manual `navigator.serviceWorker.register`)

---

## Development Workflow

```bash
# Core commands
pnpm dev                    # Turbo dev — all apps
pnpm build                  # Production build (with --webpack flag)
pnpm test                   # Vitest run
pnpm test:watch             # Watch mode
pnpm typecheck              # tsc --noEmit
pnpm lint                   # Next.js lint (shell scripts)

# Database
pnpm db:generate            # Prisma generate (MANDATORY after schema change)
pnpm db:migrate             # Prisma migrate dev
pnpm db:seed                # Seed with sample data
pnpm db:studio              # Prisma Studio

# i18n
# Messages are loaded dynamically per locale
# Add new translations in messages/*.json

# Full verification pipeline
pnpm typecheck && pnpm lint && pnpm test && pnpm build
```

---

## Testing Strategy (Updated 2026-05-24)

| Type | Stack | Status |
|------|-------|--------|
| Unit | Vitest + Testing Library | ✅ Active (85 tests passing) |
| Router | Vitest + tRPC + Prisma mock | ✅ Active (search, review, savedOutfit, loyalty, ugc router tests) |
| AI Service | Vitest + OpenAI mock | ✅ Active (ai.service.test.ts) |
| Components | Vitest + Testing Library | ✅ Active (OutfitCard, SizeRecommendation) |
| E2E | Playwright | 📅 Planned (Phase 5) |
| A11y | axe-core | 📅 Planned (Phase 5) |

### Test Setup (`src/test/setup.ts`)
- `requestAnimationFrame` mock via `vi.stubGlobal`
- `crypto.randomUUID` mock for deterministic IDs
- Fake timers with `shouldAdvanceTime: true`
- `@testing-library/jest-dom/vitest` imported for `toHaveTextContent`, `toBeDisabled`, etc.

---

## Anti-Patterns (Strictly Prohibited)

| Anti-Pattern | Why | Correct Approach |
|--------------|-----|-----------------|
| `enum` in TypeScript | Breaks erasableSyntaxOnly | String unions |
| `any` anywhere | Subverts strict mode | Explicit type or `unknown` |
| `tailwind.config.js` | Bypasses CSS-first v4 | `@theme inline` |
| `await params` (Pages) OR `params` as plain object (Layouts) | Type/runtime mismatch | Layouts: `Promise`, Pages: plain object |
| `document`/`window` in RSC | SSR errors | Client Component |
| `.getState()` in JSX | No reactivity | Selector subscription |
| `lazy()` with R3F named imports | Type/runtime crash | Direct import + Suspense |
| `bg-gradient-to-*` | v3 deprecated | `bg-linear-to-*` |
| Raw hex in className | Bypasses design tokens | Custom `@theme` tokens |
| `result.error.errors` (Zod) | v3 API | `result.error.issues` (v4) |
| `window.location.href` | Full page reload | `useRouter().push()` |
| `swSrc` with Turbopack | webpack-only plugin | Auto-generated SW, `--webpack` flag |

---

## Documentation

| File | Purpose |
|------|---------|
| `docs/architecture.md` | Monorepo, RSC/Client split, data flow |
| `docs/runbook.md` | Commands, setup, common errors |
| `ACCOMPLISHMENTS.md` | Phase completion log with verification |
| `SKILL.md` | Mistakes catalog, lessons learned |

---

## Lessons Learned (Updated 2026-05-24)

### Prisma Schema & Code Synchronization
- `prisma generate` is NOT automatic. Run it after EVERY schema change.
- When adding a required field, ALL `prisma.model.create()` calls must be updated, or `tsc --noEmit` fails.
- Fields like `relevance`, `viewCount`, `rating` must EXIST in `schema.prisma` before being used in queries. Do not assume.

### PWA Build with next-pwa
- `@ducanh2912/next-pwa` requires webpack (not Turbopack).
- **Fix**: Add `--webpack` to build script in `package.json`.
- **Never**: Use `swSrc` (custom service worker) with Turbopack — `workbox-webpack-plugin` is webpack-only.
- **Manifest**: `public/manifest.json` is required for installable PWA.

### tRPC Date Serialization with superjson
- Without `superjson`, Prisma `Date` fields serialize as ISO strings over tRPC.
- **Fix**: Register `superjson` in server `initTRPC` AND client `httpBatchLink`.
- **Verification**: `typecheck` will fail with `Type 'string' is not assignable to type 'Date'`. Register `superjson` to fix.

### Next.js 16 `params` (Layout vs Page nuance)
- **Layouts**: `params` is a `Promise` — must `await`: `const { locale } = await params`
- **Pages**: `params` is a **plain object** — direct destructuring: `const { locale } = params`
- **Why**: Next.js 16 changed `params` from a resolved Promise to a plain object for pages, but layouts still receive a Promise.
- **Test**: `tsc --noEmit` will catch type mismatches early.

### i18n Locale Switching
- `LanguageSwitcher` must use `useRouter().push()` (SPA navigation) NOT `window.location.href` (full reload).
- **Why**: `window.location.href` destroys Zustand stores, React Query cache, and scroll state.
- **File**: `src/components/shared/LanguageSwitcher.tsx`

### R3F and Dynamic Imports
- `@react-three/fiber` and `@react-three/drei` export named components.
- `React.lazy()` requires a `{ default }` export. Destructuring a `LazyExoticComponent` fails at runtime.
- Correct pattern: Direct import + `<Suspense fallback={<Skeleton />}>`. The `<Suspense>` boundary defers heavy load without `lazy()`.

### Zod v4 API
- Error path: `result.error.issues[0].message` (not `.errors[0].message`)
- This is a breaking change from v3. All forms must use the v4 API.

### TDD with Component Tests
- **Mock data before implementation**: Write failing tests with mock data and THEN implement the component
- **Test state leakage**: Always reset Zustand store state in `beforeEach` unless `autoReset` is configured
- **Text matching**: `screen.getByText` performs exact match. Use `getAllByText` for duplicates, or `toHaveTextContent` for partial matches across elements
- **Interaction testing**: Use `userEvent` when possible, `fireEvent` only for edge cases. Always `await` user interactions.

### Strict Mode TypeScript
- **`as any` is banned**: Replace with `Record<string, never>`, `as const`, or explicit typed interfaces
- **`Record<string, never>`**: Use for empty testing objects where `any` would normally be used
- **Import types**: Always `import type` for type-only imports to comply with `verbatimModuleSyntax`
- **No unused locals**: Remove or use ALL local variables; prefix with `_` only if explicitly needed and `noUnusedLocals: true` is set

---

## Performance Budgets

| Metric | Target | Enforcement |
|--------|--------|-------------|
| LCP | < 2.5s | Lighthouse CI |
| CLS | < 0.1 | Lighthouse CI |
| INP | < 200ms | Lighthouse CI |
| Initial Bundle | < 150KB | Next.js analyze |
| Accessibility | >= 95 | axe-core / Lighthouse |

---

## Last Updated

**2026-05-25** — Post-Phase 4 Remediation + Next.js 16 Params Type Duality Fix:
- **TypeScript**: 0 errors, 91 tests passing (18 test files)
- **Next.js 16 `params`**: Updated all page components to use `params: Promise<{...}>` + `await` (satisfies `.next/types/` generator, no runtime regression)
- **Tailwind v4**: `outline-none` → `outline-hidden` in 5 files (Forced Colors Mode a11y fix)
- **tRPC + NextAuth v4**: `getToken` from `next-auth/jwt` replaces `getServerSession` in tRPC context (App Router compatibility)
- **i18n**: i18n alignment: `lang={defaultLocale}` in root layout, `dir={isRTL(locale)}` in locale layout
- **Lint scripts**: Fixed monorepo search paths (`src/` → `packages/ apps/`), added `--exclude-dir=.turbo`
- **Account routing**: Removed duplicate `/account` route, consolidated under `[locale]/account`
- **Tailwind regex**: `\b` word boundaries for exact class name matching (prevents false negatives)

**Updated SKILL.md**: v4.0.0 with new sections §14.12–18 on:
- tRPC + NextAuth v4 `getToken` pattern
- Duplicate route anti-pattern
- Root layout `lang` attribute
- Monorepo search path gotchas
- RSC Account pages with `getServerSession`
- `[class]` vs `\b` regex matching
- NextAuth env var duality (`NEXTAUTH_SECRET` vs `AUTH_SECRET`)
- New anti-patterns: hardcoded `lang`, duplicate routes, `getServerSession` in App Router, monorepo root `src/` search

---

## Contact

engineering@luxeverse.com