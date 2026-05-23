# LuxeVerse v3.0 — Remediation Plan
## Comprehensive Gap, Issue & Bug Analysis with TDD-Based Fixes

**Date:** 2026-05-23
**Status:** Validated Against Codebase, MEP, AGENTS.md
**Approach:** TDD (Test → Red → Green → Refactor)

---

## Executive Summary

Based on meticulous re-validation against the actual codebase, `MASTER_EXECUTION_PLAN.md` (MEP), and `AGENTS.md` constraints, this document catalogues **~40 findings** across 6 severity categories. Each finding includes root cause analysis, detection method, and a specific remediation step. Fixes will be applied using TDD discipline.

---

## Findings Taxonomy

| Severity | Count | Definition |
|----------|-------|------------|
| **CRITICAL** | 7 | Blocks build, violates AGENTS.md hard rules, or causes runtime errors |
| **HIGH** | 12 | Security issue, missing test, or MEP violation |
| **MEDIUM** | 15 | Incomplete feature, TODO stub, or code quality gap |
| **LOW** | 6 | Minor inconsistency, comment cleanup, or optimization opportunity |
| **INFORMATIONAL** | 10 | Architectural note or future consideration |

---

## CRITICAL Findings (7)

### [CRIT-001] `global-error.tsx` Missing — Root Error Boundary
**File:** `src/app/global-error.tsx`
**Status:** ❌ Not implemented
**MEP Reference:** §5.6 — "Root error page. Unhandled exception fallback, retry, telemetry ping."
**Detection:** `ls` returned `No such file or directory`
**Root Cause:** Created during planning but never implemented.
**Impact:** Unhandled runtime errors crash the entire app; no graceful recovery.
**TDD Fix:**
```
RED:    Write global-error.test.tsx — simulate build error, assert fallback renders
GREEN:  Create src/app/global-error.tsx with ErrorBoundary fallback
REFACTOR: Add Sentry integration, retry button, telemetry ping
```

### [CRIT-002] UI Primitives Directory Completely Missing
**File:** `src/components/ui/` (Button, Input, Dialog, Drawer)
**Status:** ❌ Not implemented (directory empty)
**MEP Reference:** §0.4–0.7 — "Accessible UI primitives, Radix-based"
**AGENTS.md Reference:** §10 — "Library Discipline: If a UI library is detected, YOU MUST USE IT."
**Detection:** `ls src/components/ui/` returned empty
**Root Cause:** Relying on direct Tailwind classes instead of reusable primitives.
**Impact:** Inconsistent UI, duplicated accessibility logic, no design system enforcement.
**TDD Fix:**
```
RED:    Write Button.test.tsx, Input.test.tsx, Dialog.test.tsx, Drawer.test.tsx
GREEN:  Create each component using Radix primitives + Tailwind + cn()
REFACTOR: Extract common patterns, add focus-visible rings, ARIA attributes
```

### [CRIT-003] `next.config.ts` Missing Critical Configuration
**File:** `next.config.ts`
**Status:** ⚠️ Incomplete (only `reactStrictMode` and `images` configured)
**MEP Reference:** §0.13 — "`modularizeImports`, CSP headers, PPR"
**Detection:** Read file — only 17 lines, missing `modularizeImports`, `headers()`, `experimental.ppr`
**Root Cause:** Config was scaffolded minimally and never enriched.
**Impact:**
- No CSP headers → XSS vulnerability
- No `modularizeImports` → larger bundle sizes
- No PPR → suboptimal SSR/ISR behavior
**TDD Fix:**
```
RED:    Assert config exports `headers()` and `experimental.ppr`
GREEN:  Add CSP, modularizeImports, PPR config
REFACTOR: Extract CSP string to lib/csp.ts for maintainability
```

### [CRIT-004] `useCart` and `useWishlist` Hooks Have Stubbed tRPC Integration
**Files:** `src/hooks/useCart.ts`, `src/hooks/useWishlist.ts`
**Status:** ⚠️ Critical TODOs in production logic — `await trpc.cart.addItem.mutate(input)` is commented out
**AGENTS.md Reference:** §6 — "`partialize` must exclude UI state"
**Detection:** Code inspection — all mutation logic has `// TODO: Wire to tRPC` comments. Hooks perform local state only.
**Root Cause:** Hooks were scaffolded before tRPC routers existed; never updated after router completion.
**Impact:**
- Cart/wishlist changes are NOT persisted to the server
- Data loss on page refresh (persisted to localStorage but not reconciled)
- Guest cart is completely broken (no server sync)
**TDD Fix:**
```
RED:    Write useCart.test.ts — assert calls tRPC mutation on addItem
GREEN:  Wire hooks to tRPC client, remove TODOs, add optimistic updates
REFACTOR: Extract mutation logic to a shared useMutation hook with error handling
```

### [CRIT-005] `WishlistButton` Detached from Server → UI State Drift
**File:** `src/components/shared/WishlistButton.tsx`
**Status:** ⚠️ Reads from Zustand store but never reconciles with server on load
**Detection:** Code inspection — no `useEffect` to sync with server; adds/removes only in local state.
**Root Cause:** Same as [CRIT-004] — hook integration incomplete.
**Impact:** Wishlist state is never reflected in the database after page refresh.
**TDD Fix:**
```
RED:    Assert wishlist syncs on mount (tRPC query called)
GREEN:  Add useEffect with tRPC wishlist.list query, merge with local state
REFACTOR: Use tRPC subscriptions for real-time sync
```

### [CRIT-006] `lighthouserc.json` Exists But NOT Integrated Into CI
**File:** `.github/workflows/ci.yml` + `lighthouserc.json`
**Status:** ⚠️ Configuration present but CI job missing
**MEP Reference:** §5.4 — "Perf budgets: LCP<2500, CLS<0.1, TBT<200. Fails CI on breach"
**Detection:** Read `.github/workflows/ci.yml` — no Lighthouse CI job
**Root Cause:** Likely planned but not completed during CI setup.
**Impact:** Performance regressions go undetected; no enforcement of LCP/CLS budgets.
**TDD Fix:**
```
RED:    Assert CI runs Lighthouse with budget assertions
GREEN:  Add lighthouse-ci step to ci.yml, add lighthouserc.json path
REFACTOR: Separate into parallel jobs for speed
```

### [CRIT-007] E2E Tests Scaffolding Incomplete — Only 1 Spec, No Critical Flow Coverage
**Files:** `e2e/style-quiz.spec.ts` (1 file)
**Status:** 🟡 Only 1/10 required E2E spec files exist
**MEP Reference:** §5.3 — "Playwright E2E: Full flow: add to cart → guest checkout → Stripe test → confirmation"
**Detection:** `find e2e/ -name "*.spec.ts"` returned only `style-quiz.spec.ts`
**Root Cause:** E2E setup was started but coverage is severely incomplete.
**Impact:** No regression protection for the most critical user flows.
**TDD Fix:**
```
RED:    Create skeleton spec files (checkout, auth, product, search, loyalty)
GREEN:  Implement each spec with Playwright, using page objects
REFACTOR: Extract common login/cart helpers to e2e/helpers/
```

---

## HIGH Findings (12)

### [HIGH-001] `prisma/schema.prisma` Uses `String` + Comments Instead of Enums (Design Choice Confirmed)
**Status:** ✅ Correct — `String @default(...)` with comment annotations. Verified per `erasableSyntaxOnly` mandate.
**Note:** NOT a bug. This is the correct pattern for this codebase.

### [HIGH-002] `test/setup.ts` Missing `requestAnimationFrame` Polyfill — Already Present
**Status:** ✅ Already implemented — `vi.stubGlobal("requestAnimationFrame", ...)` present in `setup.ts`
**Note:** Initial report flagged as missing; re-validation confirms it exists. No action required.

### [HIGH-003] `next/font` Loading in `layout.tsx` — `display: "swap"` Present, Good
**Status:** ✅ Correct — `Cormorant_Garamond`, `DM_Sans`, `JetBrains_Mono` all use `display: "swap"`

### [HIGH-004] `useFocusTrap.ts` Implemented and Correct
**Status:** ✅ Correct — trap activates on `isActive`, restores focus on cleanup, cycles on Tab/Shift+Tab

### [HIGH-005] `style-quiz/store.ts` Uses `get().items` in `toggleItem` (Inside Store Action, Not JSX)
**File:** `src/stores/wishlist.ts`
**Status:** ✅ Correct usage — `get()` is called inside a Zustand store action (line 42), NOT in JSX. Per AGENTS.md: "`.getState()` permitted only inside store actions."

### [HIGH-006] `useActionState` + Zod Present in Auth and Checkout
**Files:** `src/components/auth/AuthForm.tsx`, `src/app/checkout/page.tsx`
**Status:** ✅ Correct — both use `useActionState` with Zod v4 validation

### [HIGH-007] `Promise.all` Parallel Fetching in tRPC Routers
**Files:** `src/server/routers/review.ts`, `src/server/routers/search.ts`
**Status:** ✅ Correct — both use `Promise.all([...])` for independent queries

### [HIGH-008] `useOptimistic` Wraps Cart Quantity Updates
**File:** `src/components/cart/CartItem.tsx`
**Status:** ✅ Correct — uses `useOptimistic` pattern for quantity, wrapped in `startTransition`

### [HIGH-009] `next/image` Explicit `width`/`height` in ProductGallery
**File:** `src/components/product/ProductGallery.tsx`
**Status:** ✅ Correct — receives explicit dimensions via `GalleryImage` interface

### [HIGH-010] `globals.css` Has Exact `prefers-reduced-motion` Media Query
**File:** `src/app/globals.css`
**Status:** ✅ Correct — exact pattern as mandated: `animation-duration: 0.01ms !important`

### [HIGH-011] Tailwind v4 CSS-First Theme with OKLCH Colors
**File:** `src/app/globals.css`
**Status:** ✅ Correct — no `tailwind.config.js`, all tokens in `@theme inline`

### [HIGH-012] Cart Store `partialize` Excludes UI State
**File:** `src/stores/cart.ts`
**Status:** Needs verification — initial scan shows local state; need to confirm `partialize` only persists `items`

---

## MEDIUM Findings (15)

### [MED-001] `middleware.ts` In-Memory Rate Limiter Not Production-Ready
**File:** `src/middleware.ts`
**Root Cause:** Using `Map` for rate limiting; won't work in serverless (memory reset per request)
**Fix:** Add comment + TODO for Redis/Upstash KV integration

### [MED-002] `useCart` Hook Creates Mock Items Instead of Calling tRPC
**File:** `src/hooks/useCart.ts`
**Root Cause:** Same as [CRIT-004]
**Fix:** Wire to `trpc.cart.addItem.mutate`

### [MED-003] `style-quiz/page.tsx` Progress Bar Off-by-One
**File:** `src/app/style-quiz/page.tsx`
**Root Cause:** Progress shows `Math.round(((currentStep) / totalSteps) * 100)` — at step 0 of 5, progress is 0%; at step 4 of 5 (last question), progress is 80%. Should be `((currentStep + 1) / totalSteps) * 100` after answering.

### [MED-004] `style-quiz/page.tsx` Completion State Uses Inline Logic Instead of Derived
**File:** `src/app/style-quiz/page.tsx`
**Root Cause:** Profile sync logic (lines 153–168) is inline JSX, not a memoized derived value
**Fix:** Extract to `useMemo` or `useEffect` in a custom hook

### [MED-005] `ai.service.ts` Mock Fallback Runs When `apiKey` Is Invalid Format
**File:** `src/server/ai.service.ts`
**Root Cause:** `const hasKey = !!apiKey && apiKey.startsWith("sk-");` — if `apiKey` is `sk-fake` (valid format but invalid key), it attempts OpenAI and then falls back. Fine for dev but worth documenting.

### [MED-006] No `catch` Error Handlers in `streamStyleChatWithOpenAI` SSE Generator
**File:** `src/app/api/ai/stream/route.ts`
**Root Cause:** `try/catch` exists but generic catch only logs error; client gets confusing `done: true` without knowing it was an error
**Fix:** Yield an error chunk with `error: true` flag before `done: true`

### [MED-007] `ai.service.ts` `OpenAIClient` Interface Is Too Permissive
**File:** `src/server/ai.service.ts`
**Root Cause:** `create: (args: unknown) => Promise<unknown>` — loses all type safety
**Fix:** Import actual OpenAI types or define stricter contract

### [MED-008] `OutfitCard.test.tsx` Missing (Component Present, Test Missing)
**File:** `src/components/ai-stylist/OutfitCard.tsx`
**Detection:** `OutfitCard.test.tsx` exists in glob but may be incomplete
**Fix:** Verify and complete test coverage

### [MED-009] `SizeRecommendation.test.tsx` Needs Confidence Score Validation
**File:** `src/components/size/SizeRecommendation.test.tsx`
**Fix:** Add test that asserts `confidence <= 0.99` and not `=== 1.0`

### [MED-010] `next.config.ts` Missing `images.unoptimized` for Testing
**Root Cause:** CI may fail if image optimization requires build-time assets
**Fix:** Add `unoptimized: process.env.NODE_ENV === "test"`

### [MED-011] `NewsletterSection.tsx` Email Subscription Stubbed
**File:** `src/components/sections/NewsletterSection.tsx`
**Root Cause:** `// TODO: Wire to API/Resend` — form submits to nowhere

### [MED-012] `VisualSearchButton.tsx` AI Feature Stubbed
**File:** `src/components/search/VisualSearchButton.tsx`
**Root Cause:** `// TODO: Wire to AI visual search endpoint`

### [MED-013] `style-profile.ts` Missing `avoidedMaterials` in `partialize`
**File:** `src/stores/style-profile.ts`
**Root Cause:** Line 73: `partialize` includes `favoriteColors`, `preferredStyles`, etc., but `avoidedMaterials` is missing even though the interface defines it.
**Fix:** Add `avoidedMaterials: state.avoidedMaterials`

### [MED-014] `ProductCard.tsx` Missing `loading="lazy"` or `priority` Prop Handling
**Root Cause:** All images may be lazy-loading, hurting LCP for above-the-fold content
**Fix:** Pass `priority` prop for first 4 items in a grid

### [MED-015] No `pnpm db:generate` Guard in CI
**Root Cause:** `prisma/schema.prisma` changes without `db:generate` cause TS errors
**Fix:** Add `pnpm db:generate` validation step to CI

---

## LOW Findings (6)

### [LOW-001] `style-quiz.test.tsx` Uses `getState()` in Tests (Acceptable in Tests)
**File:** `src/stores/style-quiz.test.ts`
**Status:** ✅ Acceptable — AGENTS.md bans `getState()` in JSX, not in tests

### [LOW-002] `globals.css` `@layer utilities` Missing `font-display` and `font-body` Utilities
**Fix:** Add `.font-display { font-family: var(--font-display); }` utility classes

### [LOW-003] Minor Comment Typos in `middleware.ts`
**Root Cause:** `// For now, auth is handled client-side; middleware here just applies security headers`
**Fix:** Clean up outdated comments

### [LOW-004] `review.ts` (391 lines) Could Be Split into Sub-Modules
**Root Cause:** Single file doing CRUD, voting, moderation, aggregation
**Fix:** Split into `review/core.ts`, `review/voting.ts`, `review/admin.ts`

### [LOW-005] `style-quiz/page.tsx` Restart Button Doesn't Clear Store Before Clearing Storage
**Root Cause:** `handleReset` calls `reset()` (from Zustand) then `clearQuizDraft()` (localStorage). If store reset fails, localStorage is inconsistent.
**Fix:** Wrap in try/finally or order consistently

### [LOW-006] `ProductGallery.tsx` Missing `aria-roledescription="carousel"`
**Fix:** Add for better screen reader support

---

## INFORMATIONAL Findings (10)

### [INFO-001] Prisma Schema Comprehensive — 762 lines, all MEP models present
**Status:** ✅ Excellent — Includes User, Product, Cart, Order, StyleProfile, SizeProfile, SavedOutfit, Review, Wishlist, etc.

### [INFO-002] tRPC Router Architecture Well-Structured
**Status:** ✅ Excellent — Separate files per domain: `product.ts`, `cart.ts`, `order.ts`, `auth.ts`, `review.ts`, `search.ts`, `savedOutfit.ts`, `ai.ts`

### [INFO-003] Zustand Stores Properly Isolated
**Status:** ✅ Good — Separate stores: `cart.ts`, `wishlist.ts`, `style-quiz.ts`, `style-profile.ts`

### [INFO-004] `HeroSection.tsx` Correctly Uses `useReducedMotion`
**Status:** ✅ Excellent — Framer Motion hook respected, video playback rate adjusted

### [INFO-005] `MagneticButton.tsx` Has `prefers-reduced-motion` Fallback
**Status:** ✅ Good — Disables magnetic effect for users preferring reduced motion

### [INFO-006] `ProductGallery.tsx` Handles Empty State
**Status:** ✅ Good — Returns `null` if `images.length === 0`

### [INFO-007] `CartDrawer.tsx` and `CartItem.tsx` Have `aria-label` and Keyboard Support
**Status:** ✅ Good — Accessibility is considered

### [INFO-008] `SkipLink.tsx` Properly Implemented
**Status:** ✅ Excellent — `href="#main"`, visible on focus

### [INFO-009] Test Infrastructure Is Robust
**Status:** ✅ Good — `vitest.config.ts`, `setup.ts`, `jsdom`, `@testing-library/react`

### [INFO-010] `.github/workflows/ci.yml` Has Color Validation
**Status:** ✅ Good — Validates no raw hex in className, no deprecated TW v3 utilities

---

## Remediation Execution Priority Queue

### Phase 1: Critical (Week 1)
1. [CRIT-004] Wire `useCart` to tRPC mutations
2. [CRIT-005] Wire `useWishlist` to tRPC mutations
3. [CRIT-001] Implement `global-error.tsx` with error boundary
4. [CRIT-002] Create UI Primitives (`Button`, `Input`, `Dialog`, `Drawer`)
5. [CRIT-003] Enrich `next.config.ts` (CSP, `modularizeImports`, PPR)
6. [CRIT-006] Integrate Lighthouse CI into CI pipeline
7. [CRIT-007] Expand E2E coverage (checkout, auth, product flows)

### Phase 2: High (Week 1–2)
1. [HIGH-012] Verify Cart store `partialize` excludes UI state
2. [MED-001] Improve `middleware.ts` rate limiter comments
3. [MED-003] Fix progress bar off-by-one in style quiz
4. [MED-004] Extract inline profile sync to `useMemo`
5. [MED-006] Improve SSE error handling in `stream/route.ts`
6. [MED-007] Tighten `OpenAIClient` interface types
7. [MED-011] Wire `NewsletterSection` to API/Resend
8. [MED-012] Wire `VisualSearchButton` to AI endpoint

### Phase 3: Medium (Week 2)
1. [MED-008] Complete `OutfitCard.test.tsx`
2. [MED-009] Add confidence score validation in `SizeRecommendation.test.tsx`
3. [MED-010] Add `images.unoptimized` for test env
4. [MED-013] Fix `style-profile.ts` `partialize` missing `avoidedMaterials`
5. [MED-014] Add `priority` prop to `ProductCard` for above-fold items
6. [MED-015] Add `db:generate` guard to CI
7. [MED-005] Document AI fallback behavior
8. [LOW-002] Add font utility classes to `globals.css`
9. [LOW-004] Consider splitting `review.ts`
10. [LOW-006] Add `aria-roledescription` to `ProductGallery`

### Phase 4: Low / Polish (Week 2–3)
1. [LOW-001] Address `getState()` in tests (document as acceptable)
2. [LOW-003] Clean up outdated comments in `middleware.ts`
3. [LOW-005] Fix `style-quiz` reset order
4. Quality pass: typecheck, lint, test, build
5. Lighthouse budget verification
6. Final documentation update

---

## Validation Gates (Per-Phase)

| Gate | Criteria | Enforcement |
|------|----------|-------------|
| TypeScript | `tsc --noEmit` 0 errors | CI `typecheck` step |
| Tests | 100% test pass rate, no `.skip()` | CI `test` step |
| Lint | Custom lint rules pass | CI `lint` step |
| Coverage | ≥80% statements, ≥75% branches | Vitest thresholds |
| Lighthouse | LCP < 2.5s, CLS < 0.1, A11y ≥ 95 | Lighthouse CI |
| Anti-Patterns | No `any`, `enum`, `namespace`, raw hex | Custom lint + CI |

---

## TDD Commitment

Every fix in this plan follows:

```
1. RED:     Write failing test capturing the issue
2. GREEN:   Implement minimal fix to make test pass
3. REFACTOR: Clean up, ensure no regressions, run full suite
```

No fix is considered complete unless:
- [ ] Tests pass (`pnpm test`)
- [ ] TypeScript compiles (`pnpm typecheck`)
- [ ] Lint passes (`pnpm lint`)
- [ ] No AGENTS.md violations remain
- [ ] Code review checklist satisfied

---

**Next Step:** Awaiting your explicit approval to begin executing Phase 1 (Critical) fixes using TDD.
