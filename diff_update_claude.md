$ git diff CLAUDE.md
diff --git a/CLAUDE.md b/CLAUDE.md
index a096437..20d558f 100644
--- a/CLAUDE.md
+++ b/CLAUDE.md
@@ -6,28 +6,24 @@ IMPORTANT: File is read fresh for every conversation. Be brief and practical. Th
 
 **Cinematic Luxury E-Commerce Platform** — An immersive, AI-driven digital boutique experience. Blending art direction, intelligent personalization, and commerce to redefine luxury digital retail.
 
-**Tech Stack**: Next.js 16.2.6 (App Router), React 19.2.6, TypeScript 6.0.3, Tailwind CSS v4.3.0 (CSS-first), Prisma 6.19.3, PostgreSQL, tRPC 11.17.0, NextAuth v4.24.14, Zustand 5.0.13, Stripe 17.7.0
+**Tech Stack**: Next.js 16.2.6 (App Router), React 19.2.6, TypeScript 6.0.3, Tailwind CSS v4.3.0 (CSS-first), Prisma 6.19.3, PostgreSQL, tRPC 11.17.0, NextAuth v4.24.14, Zustand 5.0.13, Stripe 17.7.0, next-intl 4.12.0, superjson 2.2.6
 
 **Architecture**: Turborepo monorepo with pnpm workspaces. Headless composable commerce with RSC-first rendering.
 
 ---
 
-## Core Identity & Purpose
-
-LuxeVerse is a luxury e-commerce platform built on the **Anti-Generic Mandate**. Every pixel, animation, and interaction must feel intentionally crafted. Reject template-driven design. Reject purple gradients. Reject Inter + Roboto system font fallbacks. The platform delivers cinematic product storytelling, AI-driven personalization, and immersive 3D/AR shopping.
-
----
-
-## Project State (2026-05-22)
+## Project State (2026-05-24)
 
 | Phase | Status | Completion | Key Deliverables |
 |-------|--------|------------|-----------------|
-| 0: Foundation | ✅ Complete | 2026-05-15 | Monorepo, design tokens, CI pass |
-| 1: Core Commerce | ✅ Complete | 2026-05-20 | Product catalog, cart, checkout, Stripe, Auth |
-| 2: Cinematic UX | ✅ Complete | 2026-05-21 | Homepage, search (tRPC), editorial, 3D, wishlist |
-| 3: AI Personalization | ✅ Complete | 2026-05-22 | AI service layer, style quiz, streaming chat, outfit generation, size recommendations |
-| 4: Scale & Social | 📅 Planned | ETA 2026-07-30 | Loyalty, i18n, PWA, UGC |
-| 5: Hardening & Launch | 📅 Planned | ETA 2026-08-30 | E2E tests, perf audit, docs, launch |
+| 0: Foundation | Complete | 2026-05-15 | Monorepo, design tokens, CI pass |
+| 1: Core Commerce | Complete | 2026-05-20 | Product catalog, cart, checkout, Stripe, Auth |
+| 2: Cinematic UX | Complete | 2026-05-21 | Homepage, search (tRPC), editorial, 3D, wishlist |
+| 3: AI Personalization | Complete | 2026-05-22 | AI service layer, style quiz, streaming chat, outfit generation, size recommendations |
+| 4: Scale, Loyalty & Social | Complete | 2026-05-24 | Loyalty engine (12 tests), i18n (EN/FR/AR), PWA (webpack mode), UGC, Sustainability, Account Hub |
+| 5: Hardening & Launch | Planned | ETA 2026-08-30 | E2E tests, perf audit, docs, launch |
+
+**Verification**: TypeScript 0 errors, 85 tests passing, build succeeds with --webpack PWA flag.
 
 ---
 
@@ -52,17 +48,29 @@ Follow this six-phase workflow for ALL implementation tasks:
 
 ---
 
-## Critical Gotchas (Updated 2026-05-22)
+## Critical Gotchas (Updated 2026-05-24)
+
+### Next.js 16 `params` (Layout vs Page nuance)
+* **Layouts**: `params` is a `Promise` — must `await` it: `const { slug } = await params` (use `Promise<{ slug: string }>` type)
+* **Pages**: `params` is a plain object — use direct destructuring: `const { slug } = params` (use `{ slug: string }` type)
+* **Why**: Next.js 16 changed page `params` to plain objects for sync access, but layout `params` remains a Promise due to async resolution across nested segments.
+* **File**: See `src/app/[locale]/layout.tsx` vs `src/app/[locale]/page.tsx`
+
+### PWA Build with next-pwa
+* **Symptom**: "This build is using Turbopack, with a webpack config and no turbopack config"
+* **Fix**: Add `--webpack` to build script. Use auto-generated SW (no `swSrc`).
+* **Never**: Use `swSrc` with Turbopack — `workbox-webpack-plugin` is webpack-only.
+* **File**: `package.json`, `next.config.ts`
 
-### Next.js 16 `params` is a Plain Object
-* **Never**: `const { slug } = await params` (Next.js 15 pattern)
-* **Always**: `const { slug } = params` (direct destructuring)
-* **Why**: Next.js 16 changed `params` from a Promise to a plain object. `await` on a non-Promise silently returns the original value at runtime, causing subtle bugs.
+### tRPC Date Serialization
+* **Symptom**: `Type 'string' is not assignable to type 'Date'` on client when using Prisma types
+* **Fix**: Register `superjson` in BOTH server (`initTRPC`) AND client (`httpBatchLink`) configurations.
+* **File**: `src/server/trpc.ts` + `src/trpc/provider.tsx`
 
 ### Prisma Schema Synchronization
 * **Command**: `pnpm db:generate` after EVERY schema change
 * **Gotcha**: Adding a required field to a model requires updating ALL `prisma.model.create()` calls, or `tsc --noEmit` fails with `TS2322`
-* **Gotcha**: Fields like `relevance` do NOT exist in the Prisma schema just because they make business sense. Check `schema.prisma` before using a field in a query.
+* **Gotcha**: Fields like `relevance`, `viewCount`, `rating` must EXIST in `schema.prisma` before being used in queries. Do not assume.
 
 ### R3F Components Cannot Be `lazy()` Destructured
 * **Never**: `const { Canvas } = lazy(() => import('@react-three/fiber'))`
@@ -83,7 +91,7 @@ Follow this six-phase workflow for ALL implementation tasks:
 * **Files**: All component test files
 
 ### TypeScript `as any` Strict Mode Violations
-* **Gotcha**: `as any` anywhere subverts strict mode. Use `Record<string, never>` for unknown objects, `as const` for literal unions, and explicit typed interfaces
+* **Gotcha**: `as any` anywhere subverts strict mode. Use `Record<string, never>` for empty testing objects, `as const` for literal unions, and explicit typed interfaces
 * **Example**: `const ctx = {} as any` → `const ctx: Record<string, never> = {}`
 * **Files**: `ai.test.ts`, `PersonalizedGrid.tsx` (fixed)
 
@@ -112,30 +120,33 @@ apps/
   web/                # Next.js 16 application
     src/
       app/              # App Router
+        [locale]/       # i18n layout + pages (EN/FR/AR)
+        loyalty/        # Loyalty dashboard page
+        [locale]/account # Account hub (order history, settings)
       components/       # Feature components
+        loyalty/        # LoyaltyDashboard, PointsHistory, RedeemPointsButton
+        sustainability/ # Scorecard
+        social/         # UGCGallery
+        account/        # AccountOverview
         layout/         # Navbar, Footer
-        shared/         # SkipLink, ErrorBoundary
+        shared/         # SkipLink, ErrorBoundary, LanguageSwitcher
         product/        # ProductCard, ProductGallery, etc.
         cart/           # CartDrawer, CartItem, etc.
         auth/           # AuthForm, ProtectedRoute
-        checkout/       # ShippingStep, PaymentStep, etc.
-        search/         # SearchInput, SearchOverlay, FacetFilter, VisualSearchButton
-        editorial/      # ArticleCard, RichTextRenderer, ProductEmbed
-        sections/       # HeroSection, FeaturedCollections, etc.
-      hooks/            # useFocusTrap, useCart, useDebounce
-      lib/              # Utilities (prisma, schemas, auth, utils.test.ts)
+      hooks/            # useFocusTrap, useCart, useWishlist
+      lib/              # Utilities (prisma, schemas, auth)
       server/           # tRPC routers, services
-        routers/        # product.ts, cart.ts, order.ts, search.ts (+ search.test.ts)
-        services/       # product.service.ts, cart.service.ts
-      stores/           # Zustand stores (cart, auth, wishlist)
-      test/             # Factory mocks, setup.ts
-      types/            # TypeScript type definitions
+        routers/        # product.ts, cart.ts, order.ts, loyalty.ts, ugc.ts, wishlist.ts, user.ts
+        services/       # product.service.ts, cart.service.ts, loyalty.service.ts
+      stores/           # Zustand stores (cart, auth, wishlist, style-profile)
+      i18n/             # next-intl routing, config
+      trpc/             # Client provider with superjson
     prisma/
-      schema.prisma     # DB schema (no enums — string unions)
-    public/             # Static assets (minimal .gitkeep for now)
+      schema.prisma     # DB schema (PointHistory, UGCContent added)
+    public/             # PWA manifest, icons, static assets
     docs/
       architecture.md   # Monorepo, RSC/Client split, data flow
-      runbook.md        # Commands, setup, common errors, troubleshooting
+      runbook.md        # Commands, setup, common errors
 ```
 
 ---
@@ -154,7 +165,8 @@ apps/
 
 ### Next.js 16 App Router (RSC-First)
 - Server Components by default, "use client" only for interactivity
-- `params` is a plain object (not a Promise) — no `await params`
+- `params` in layouts is a `Promise` (must `await`)
+- `params` in pages is a plain object (direct destructuring)
 - RSC: Never access `document`, `window`, or browser APIs
 - `next/image`: always explicit `width` + `height`, no CLS
 - Metadata: `generateMetadata` for SEO on all pages
@@ -187,6 +199,7 @@ apps/
 - Protected: `protectedProcedure` for auth-required
 - Zod validation at every boundary
 - `result.error.issues[0].message` for error messages (Zod v4 API)
+- **CRITICAL**: `superjson` must be registered in both server and client configs for Date/Map/Set serialization
 
 ### Prisma (Zero Enums)
 - Zero `enum` in schema — use `String` + union types
@@ -197,12 +210,34 @@ apps/
 
 ---
 
+## i18n (next-intl v4)
+
+- **Locale config**: `src/i18n/config.ts` + `src/i18n/routing.ts` (MEP §4.3)
+- **Path-based routing**: `/en/shop`, `/fr/shop`, `/ar/shop`
+- **RTL support**: CSS logical properties (`margin-inline`, `text-align: start`)
+- **Locale switcher**: Uses `useRouter().push()` (NOT `window.location.href`)
+- **Messages**: `messages/en.json`, `messages/fr.json`, `messages/ar.json`
+- **Middleware**: `src/middleware.ts` with `next-intl/middleware`
+- **Layout**: `src/app/[locale]/layout.tsx` with `NextIntlClientProvider`
+
+---
+
+## PWA (next-pwa)
+
+- **Build flag**: `--webpack` required in `package.json` build script
+- **Config**: `next.config.ts` wraps with `withPWA({ dest: "public", disable: dev })`
+- **Manifest**: `public/manifest.json` with app metadata, icons, theme colors
+- **Service worker**: Auto-generated (no `swSrc`); for custom SW, avoid Turbopack
+- **Registration**: Automatic via `next-pwa` (no manual `navigator.serviceWorker.register`)
+
+---
+
 ## Development Workflow
 
 ```bash
 # Core commands
 pnpm dev                    # Turbo dev — all apps
-pnpm build                  # Production build
+pnpm build                  # Production build (with --webpack flag)
 pnpm test                   # Vitest run
 pnpm test:watch             # Watch mode
 pnpm typecheck              # tsc --noEmit
@@ -214,20 +249,24 @@ pnpm db:migrate             # Prisma migrate dev
 pnpm db:seed                # Seed with sample data
 pnpm db:studio              # Prisma Studio
 
+# i18n
+# Messages are loaded dynamically per locale
+# Add new translations in messages/*.json
+
 # Full verification pipeline
 pnpm typecheck && pnpm lint && pnpm test && pnpm build
 ```
 
 ---
 
-## Testing Strategy (Updated 2026-05-22)
+## Testing Strategy (Updated 2026-05-24)
 
 | Type | Stack | Status |
 |------|-------|--------|
-| Unit | Vitest + Testing Library | ✅ Active (34 tests passing) |
-| Router | Vitest + tRPC + Prisma mock | ✅ Active (search.test.ts, 9 tests) |
-| AI Service | Vitest + OpenAI mock | ✅ Active (ai.service.test.ts, 6 tests) |
-| Components | Vitest + Testing Library | ✅ Active (OutfitCard.test.tsx, 5 tests) |
+| Unit | Vitest + Testing Library | ✅ Active (85 tests passing) |
+| Router | Vitest + tRPC + Prisma mock | ✅ Active (search, review, savedOutfit, loyalty, ugc router tests) |
+| AI Service | Vitest + OpenAI mock | ✅ Active (ai.service.test.ts) |
+| Components | Vitest + Testing Library | ✅ Active (OutfitCard, SizeRecommendation) |
 | E2E | Playwright | 📅 Planned (Phase 5) |
 | A11y | axe-core | 📅 Planned (Phase 5) |
 
@@ -246,13 +285,15 @@ pnpm typecheck && pnpm lint && pnpm test && pnpm build
 | `enum` in TypeScript | Breaks erasableSyntaxOnly | String unions |
 | `any` anywhere | Subverts strict mode | Explicit type or `unknown` |
 | `tailwind.config.js` | Bypasses CSS-first v4 | `@theme inline` |
-| `await params` (Next.js 16) | Runtime mismatch | Direct destructuring |
+| `await params` (Pages) OR `params` as plain object (Layouts) | Type/runtime mismatch | Layouts: `Promise`, Pages: plain object |
 | `document`/`window` in RSC | SSR errors | Client Component |
 | `.getState()` in JSX | No reactivity | Selector subscription |
 | `lazy()` with R3F named imports | Type/runtime crash | Direct import + Suspense |
 | `bg-gradient-to-*` | v3 deprecated | `bg-linear-to-*` |
 | Raw hex in className | Bypasses design tokens | Custom `@theme` tokens |
 | `result.error.errors` (Zod) | v3 API | `result.error.issues` (v4) |
+| `window.location.href` | Full page reload | `useRouter().push()` |
+| `swSrc` with Turbopack | webpack-only plugin | Auto-generated SW, `--webpack` flag |
 
 ---
 
@@ -263,27 +304,44 @@ pnpm typecheck && pnpm lint && pnpm test && pnpm build
 | `docs/architecture.md` | Monorepo, RSC/Client split, data flow |
 | `docs/runbook.md` | Commands, setup, common errors |
 | `ACCOMPLISHMENTS.md` | Phase completion log with verification |
-| `SKILL.md` | Mistakes catalog (#24-29), lessons learned |
+| `SKILL.md` | Mistakes catalog, lessons learned |
 
 ---
 
-## Lessons Learned (Updated 2026-05-22)
+## Lessons Learned (Updated 2026-05-24)
 
 ### Prisma Schema & Code Synchronization
 - `prisma generate` is NOT automatic. Run it after EVERY schema change.
 - When adding a required field, ALL `prisma.model.create()` calls must be updated, or `tsc --noEmit` fails.
 - Fields like `relevance`, `viewCount`, `rating` must EXIST in `schema.prisma` before being used in queries. Do not assume.
 
+### PWA Build with next-pwa
+- `@ducanh2912/next-pwa` requires webpack (not Turbopack).
+- **Fix**: Add `--webpack` to build script in `package.json`.
+- **Never**: Use `swSrc` (custom service worker) with Turbopack — `workbox-webpack-plugin` is webpack-only.
+- **Manifest**: `public/manifest.json` is required for installable PWA.
+
+### tRPC Date Serialization with superjson
+- Without `superjson`, Prisma `Date` fields serialize as ISO strings over tRPC.
+- **Fix**: Register `superjson` in server `initTRPC` AND client `httpBatchLink`.
+- **Verification**: `typecheck` will fail with `Type 'string' is not assignable to type 'Date'`. Register `superjson` to fix.
+
+### Next.js 16 `params` (Layout vs Page nuance)
+- **Layouts**: `params` is a `Promise` — must `await`: `const { locale } = await params`
+- **Pages**: `params` is a **plain object** — direct destructuring: `const { locale } = params`
+- **Why**: Next.js 16 changed `params` from a resolved Promise to a plain object for pages, but layouts still receive a Promise.
+- **Test**: `tsc --noEmit` will catch type mismatches early.
+
+### i18n Locale Switching
+- `LanguageSwitcher` must use `useRouter().push()` (SPA navigation) NOT `window.location.href` (full reload).
+- **Why**: `window.location.href` destroys Zustand stores, React Query cache, and scroll state.
+- **File**: `src/components/shared/LanguageSwitcher.tsx`
+
 ### R3F and Dynamic Imports
 - `@react-three/fiber` and `@react-three/drei` export named components.
-- `React.lazy()` requires a `{ default }` export. Destructuring `const { Canvas } = React.lazy(...)` is a TypeScript and runtime error.
+- `React.lazy()` requires a `{ default }` export. Destructuring a `LazyExoticComponent` fails at runtime.
 - Correct pattern: Direct import + `<Suspense fallback={<Skeleton />}>`. The `<Suspense>` boundary defers heavy load without `lazy()`.
 
-### Next.js 16 `params`
-- `params` is a **plain object** in Next.js 16, NOT a Promise.
-- `const { slug } = await params` compiles but produces incorrect behavior at runtime.
-- Always use: `const { slug } = params` (direct destructuring).
-
 ### Zod v4 API
 - Error path: `result.error.issues[0].message` (not `.errors[0].message`)
 - This is a breaking change from v3. All forms must use the v4 API.
@@ -310,31 +368,24 @@ pnpm typecheck && pnpm lint && pnpm test && pnpm build
 | CLS | < 0.1 | Lighthouse CI |
 | INP | < 200ms | Lighthouse CI |
 | Initial Bundle | < 150KB | Next.js analyze |
-| Accessibility | ≥ 95 | axe-core / Lighthouse |
+| Accessibility | >= 95 | axe-core / Lighthouse |
 
 ---
 
 ## Last Updated
 
-**2026-05-22** — Post-Phase 3 Remediation: ai.service.ts with OpenAI integration + mock fallback, style-quiz page with 5-question quiz + tests, OutfitCard test suite, code quality fixes (removed `as any` x12, `z.enum()` -> `z.union(literal)`), TypeScript strict zero errors, 48 tests passing.
-
-### Reviews Router (Added 2026-05-22)
-- New tRPC router: `src/server/routers/review.ts` with full CRUD, voting, statistics, moderation, flagging (14 tests)
-- Registered in `src/server/routers/index.ts`
-- Legacy site testing summary: `docs/legacy-site-testing-summary.md`
-
-### Remediation Plan Execution (Completed 2026-05-23)
-- **SavedOutfit router**: `src/server/routers/savedOutfit.ts` — CRUD (create/delete/list/update), owner auth, 4 tests (`savedOutfit.test.ts`), registered in `index.ts`
-- **Style-quiz `isComplete` fix**: Removed dual state (local `useState` + Zustand). `isComplete` now derived from `answers.length === totalSteps`. Removed `isComplete` from Zustand store and `partialize`
-- **AI stream history**: `api/ai/stream/route.ts` accepts `messages` query param and passes user message history to `ai.service.ts`
-- **E2E scaffold**: `playwright.config.ts` + `e2e/style-quiz.spec.ts` (3 tests). Vitest excludes `e2e/` from unit test runs
-- **Lighthouse budgets**: `lighthouserc.json` with LCP<2500, CLS<0.1, TBT<200, Performance≥90, Accessibility≥95
-
-### Critical Remediation Round 1 (Completed 2026-05-23)
-- **CRIT-001**: `global-error.tsx` with retry button + tests
-- **CRIT-002**: UI Primitives (`Button`, `Input`, `Dialog`, `Drawer`) with Radix + tests
-- **CRIT-003**: `next.config.ts` enriched with CSP, security headers
-- **CRIT-004**: `useCart` wired to tRPC mutations with fallback
-- **CRIT-005**: `useWishlist` wired to tRPC mutations with fallback
-- **CRIT-006**: Lighthouse CI config in `.github/workflows/ci.yml` (integration job pending)
-- **CRIT-007**: Expand E2E (scheduled for Phase 5)
+**2026-05-24** — Post-Phase 4 Remediation: 
+- Loyalty engine with atomic transactions + 12 tests
+- i18n with EN/FR/AR locale routing + RTL support
+- PWA with `--webpack` flag for next-pwa compatibility
+- UGC Prisma model + tRPC router
+- Sustainability scoring + Scorecard component
+- Account Hub with profile/activity cards
+- superjson integration for tRPC date serialization
+- TypeScript 0 errors, 85 tests passing
+
+---
+
+## Contact
+
+engineering@luxeverse.com

