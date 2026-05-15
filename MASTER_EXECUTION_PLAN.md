# 🔍 Validation & Critique Summary

Before delivering the refined `MASTER_EXECUTION_PLAN.md`, here is the critical assessment of the draft against the PRD and provided skills, along with key enhancements applied:

| Area | Draft Status | Validation & Enhancement |
|------|--------------|--------------------------|
| **Framework Routing** | Mixed Next.js App Router + TanStack Router references | **Resolved:** Standardized on **Next.js 16 App Router** per PRD §3. Dropped TanStack Router. Adopted Next.js native routing, `next/font`, `next/image`, and Turbopack. |
| **TypeScript 6 / Zod v4** | Mentioned but not enforced in file interfaces | **Enforced:** All forms use React 19 `useActionState` + Zod v4 (`result.error.issues`). `erasableSyntaxOnly`, `verbatimModuleSyntax`, and strict `no any/no enum/no namespace` baked into TS config. |
| **Tailwind v4 Config** | Traditional `tailwind.config.ts` mentioned | **Fixed:** Strictly CSS-first `@theme inline` in `globals.css`. Zero JS config. OKLCH color tokens, fluid typography scale, and `prefers-reduced-motion` enforced. |
| **State Management** | Zustand used, but `partialize`/selector rules missing | **Hardened:** Explicit Zustand rules: flat stores, `useStore(s => s.field)`, `partialize` for data-only persistence, store-to-store isolation. |
| **Testing Strategy** | Listed in Phase 5 only | **Shifted Left:** TDD mandated per phase. Vitest + Testing Library + Playwright E2E integrated into every deliverable. `act()` wrapping, `requestAnimationFrame` mocks, and axe-core audits added. |
| **Performance/Security** | Generic targets | **Quantified & Automated:** LCP < 2.5s, CLS < 0.1, INP < 200ms enforced via Lighthouse CI. CSP, OWASP 2025, rate-limiting, and Stripe PCI SAQ-A baked into architecture gates. |
| **AI/3D Heavy Features** | No bundle budget guards | **Added:** Dynamic `import()` for `@react-three/fiber`, WebGL fallbacks, and Web Worker isolation for AI inference. `manualChunks` function enforced. |

---

# LuxeVerse v3.0 — Master Execution Plan
**Project:** Cinematic Luxury E-Commerce Platform  
**Date:** 2026-05-15  
**Status:** Validated & Enhanced  
**Stack:** Next.js 16 · React 19.2 · TypeScript 6.0 · Tailwind CSS v4.2 · Prisma 7 · PostgreSQL 17 · tRPC · Stripe · Zustand 5 · Framer Motion 12  

## Table of Contents
1. [Architecture & Routing Strategy](#1-architecture--routing-strategy)
2. [Phase 0 — Foundation & Design System](#phase-0--foundation--design-system)
3. [Phase 1 — Core Commerce Foundation](#phase-1--core-commerce-foundation)
4. [Phase 2 — Cinematic Experience](#phase-2--cinematic-experience)
5. [Phase 3 — AI & Personalization](#phase-3--ai--personalization)
6. [Phase 4 — Scale, Loyalty & Social](#phase-4--scale-loyalty--social)
7. [Phase 5 — Hardening, Testing & Launch](#phase-5--hardening-testing--launch)
8. [Cross-Cutting Guardrails](#8-cross-cutting-guardrails)
9. [Validation Checklist](#9-validation-checklist)

---

## 1. Architecture & Routing Strategy
**Decision:** Next.js 16 App Router (RSC-first) with tRPC for type-safe client-server communication. GraphQL used only for complex aggregations or external integrations.
- **Routing:** File-based via `src/app/`. Route groups `(shop)`, `(auth)`, `(account)`. Dynamic segments `[category]`, `[slug]`.
- **Data Fetching:** Server Components for initial payload (ISR/SSG). `useQuery`/`useOptimistic` for client interactions. tRPC for mutations.
- **State:** Zustand (client UI/cart) + React Server Cache (catalog) + `searchParams` (filters).
- **Build:** Turbopack (Next.js default), Vite not required for App Router. Unified CI with `next build`.

---

## Phase 0 — Foundation & Design System
**Goal:** Bootable monorepo shell, strict TS/TW v4 config, accessible UI primitives, CI/CD pipeline.  
**Duration:** 2 weeks | **Deliverable:** `next dev` runs a styled, WCAG-compliant app shell with design tokens live.

### 📁 File Matrix & Interfaces
| # | File / Directory | Purpose | Key Interfaces / Features |
|---|------------------|---------|---------------------------|
| 0.1 | `tsconfig.json` | TS strict config | `strict: true`, `erasableSyntaxOnly: true`, `verbatimModuleSyntax: true`, `noUnusedLocals/Parameters`, path aliases `@/*` |
| 0.2 | `src/globals.css` | Tailwind v4 CSS-first theme | `@theme inline` with OKLCH colors, fluid typography (`clamp()`), golden-ratio spacing, luxury easing curves, `prefers-reduced-motion` override |
| 0.3 | `src/lib/utils.ts` | Class composition | `cn(...inputs: ClassValue[]): string` using `clsx` + `tailwind-merge` |
| 0.4 | `src/components/ui/Button.tsx` | Accessible button primitive | `ButtonProps` (variant, size, loading, disabled). Uses `@radix-ui/react-slot`. Supports `useActionState` pending state |
| 0.5 | `src/components/ui/Input.tsx` | Form input | `InputProps` (type, error, label, helperText). Focus-visible ring, ARIA invalid handling |
| 0.6 | `src/components/ui/Dialog.tsx` | Modal dialog | `DialogProps` (open, onOpenChange, title, description). Focus trap, escape key, scroll lock |
| 0.7 | `src/components/ui/Drawer.tsx` | Slide panel | `DrawerProps` (side, open, onClose). Radix-based, reduced-motion compliant |
| 0.8 | `src/components/shared/SkipLink.tsx` | WCAG 2.4.1 | `href="#main"`, sr-only → visible on focus |
| 0.9 | `src/components/shared/ErrorBoundary.tsx` | React error catch | `ErrorBoundaryProps` (fallback). Logs to telemetry, renders graceful fallback |
| 0.10 | `src/components/layout/Navbar.tsx` | Global nav | Sticky, scroll-aware blur, responsive (desktop → mobile Sheet), search trigger, cart badge |
| 0.11 | `src/components/layout/Footer.tsx` | Global footer | 4-col layout, newsletter form, social links, i18n/currency placeholders |
| 0.12 | `src/app/layout.tsx` | Root layout | `<html>`, `<body>`, `next/font` loading, `<SkipLink>`, `<Navbar>`, `<main id="main">`, `<Footer>`, `<Toaster>` |
| 0.13 | `next.config.ts` | Next.js config | `reactStrictMode: true`, `experimental: { ppr: "incremental" }`, image domains, CSP headers via middleware |
| 0.14 | `middleware.ts` | Auth/Locale routing | Geo-IP locale redirect, auth guard, rate limiting headers |
| 0.15 | `.github/workflows/ci.yml` | CI pipeline | `tsc --noEmit` → `next lint` → `vitest` → `next build` → Lighthouse CI budget |

### ✅ Phase 0 Validation Gates
- [ ] `npx tsc --noEmit` passes with 0 errors, 0 warnings
- [ ] `@theme inline` used; zero `tailwind.config.js`
- [ ] All UI primitives wrap Radix/Shadcn; zero custom DOM rebuilds
- [ ] Lighthouse Accessibility ≥ 95 on shell
- [ ] CI fails on `any`, `enum`, `namespace`, or `useState` in render

---

## Phase 1 — Core Commerce Foundation
**Goal:** Functional product catalog, cart, checkout with Stripe. Authenticated user flows.  
**Duration:** 6 weeks | **Deliverable:** Browse → Add to Cart → Guest/Logged-in Checkout → Order Confirmation.

### 📁 File Matrix & Interfaces
| # | File / Directory | Purpose | Key Interfaces / Features |
|---|------------------|---------|---------------------------|
| 1.1 | `src/lib/schemas.ts` | Zod v4 validation | `loginSchema`, `registerSchema`, `addressSchema`, `checkoutSchema`. Uses `.safeParse()`, accesses `result.error.issues[0].message` |
| 1.2 | `prisma/schema.prisma` | DB schema | All models: User, Product, Variant, Cart, Order, Address, Payment. Enums as `String` + union types (per `erasableSyntaxOnly`) |
| 1.3 | `src/lib/prisma.ts` | Prisma singleton | Global client cache, connection pooling for serverless |
| 1.4 | `src/server/routers/product.ts` | Product tRPC router | `list`, `getBySlug`, `getVariants`, `getRelated`. Parallel `Promise.all` data fetch |
| 1.5 | `src/server/routers/cart.ts` | Cart tRPC router | `addItem`, `updateQty`, `remove`, `applyCoupon`. Inventory validation, optimistic sync |
| 1.6 | `src/app/(shop)/page.tsx` | Shop landing | ISR revalidate 60s. Server Component rendering category grid, featured collections |
| 1.7 | `src/app/(shop)/[category]/[slug]/page.tsx` | PDP (Server) | Fetches product. Streams media gallery, passes variant/cart to Client Islands |
| 1.8 | `src/components/product/ProductGallery.tsx` | Media island | Thumbnails, zoom, fullscreen, video autoplay. `useOptimistic` for hover state |
| 1.9 | `src/components/product/VariantSelector.tsx` | Variant picker | Color swatches, size buttons. OOS styling disabled, ARIA-selected, `useActionState` sync |
| 1.10 | `src/components/cart/CartDrawer.tsx` | Slide-in cart | Zustand store driven. Optimistic updates, undo toast (5s), free shipping progress |
| 1.11 | `src/app/checkout/page.tsx` | Checkout flow | Multi-step: Shipping → Payment → Review. Server actions via `useActionState` |
| 1.12 | `src/components/checkout/PaymentForm.tsx` | Stripe integration | Elements wrapper, PCI SAQ-A compliant, express pay (Apple/Google), BNPL toggle |
| 1.13 | `src/stores/cart.ts` | Cart state | `useCartStore` (Zustand). `partialize: (s) => ({ items: s.items })`. Selectors only in JSX |
| 1.14 | `src/app/(auth)/login/page.tsx` | Auth forms | `useActionState` + Zod. NextAuth v5 JWT, secure cookies, role-based redirects |
| 1.15 | `src/app/(shop)/loading.tsx` | Skeleton loader | `aria-busy="true"`, structured grid skeletons, no spinners for content |

### ✅ Phase 1 Validation Gates
- [ ] All form submissions use `useActionState` + Zod v4
- [ ] Cart persists only domain data (`partialize`)
- [ ] Stripe PCI compliance verified (no raw PAN handling)
- [ ] PDP LCP < 2.5s via image priority, font preload, SSR shell
- [ ] Axe-core 0 violations on checkout flow

---

## Phase 2 — Cinematic Experience
**Goal:** Visually stunning homepage, advanced search, editorial system, 3D/AR viewers.  
**Duration:** 6 weeks | **Deliverable:** Editorial-grade homepage, immersive product interaction, rich content rendering.

### 📁 File Matrix & Interfaces
| # | File / Directory | Purpose | Key Interfaces / Features |
|---|------------------|---------|---------------------------|
| 2.1 | `src/components/sections/HeroSection.tsx` | Full-viewport hero | Video bg (responsive), cinematic overlays, `TextReveal` animation, magnetic CTA |
| 2.2 | `src/components/shared/MagneticButton.tsx` | Cursor-following CTA | `strength: number`, `radius: number`, `prefers-reduced-motion` fallback |
| 2.3 | `src/components/shared/ScrollReveal.tsx` | Viewport entry | `whileInView`, stagger children, `margin: -100px` |
| 2.4 | `src/components/product/ProductViewer3D.tsx` | WebGL product view | `@react-three/fiber` + `@react-three/drei`. Dynamic import, GLB loader, environment maps, annotations |
| 2.5 | `src/components/search/SearchOverlay.tsx` | Cmd+K search | Debounced tRPC query, recent/trending, visual search upload hook |
| 2.6 | `src/app/search/page.tsx` | Search results | URL-synced filters (`searchParams`), faceted sidebar, infinite scroll fallback |
| 2.7 | `src/components/editorial/RichTextRenderer.tsx` | CMS blocks | Structured JSON renderer: text, image, product-embed, quote, timeline |
| 2.8 | `src/components/shared/PageTransition.tsx` | Route transitions | Framer Motion `AnimatePresence`, blur+fade, `layout` prop disabled for perf |
| 2.9 | `src/stores/wishlist.ts` | Wishlist state | Flat Zustand store, optimistic add/remove, sync with tRPC |
| 2.10 | `src/app/loading.tsx` | Global suspense | Skeleton grid matching editorial layout, `aria-busy` |

### ✅ Phase 2 Validation Gates
- [ ] 3D viewer dynamically imported; initial bundle < 150KB
- [ ] All animations use `transform`/`opacity` only (compositor)
- [ ] Search state fully URL-synced; shareable/bookmarkable
- [ ] Hero video lazy-loads on mobile; poster fallback present
- [ ] Reduced motion disables all parallax/magnetic effects

---

## Phase 3 — AI & Personalization
**Goal:** AI stylist, style quiz, size prediction, personalized recommendations.  
**Duration:** 6 weeks | **Deliverable:** Adaptive UX with streaming AI responses, fit guidance, outfit generation.

### 📁 File Matrix & Interfaces
| # | File / Directory | Purpose | Key Interfaces / Features |
|---|------------------|---------|---------------------------|
| 3.1 | `src/server/ai.service.ts` | AI orchestration | `generateOutfit`, `getSizeAdvice`, `streamStyleChat`. Uses OpenAI/Claude, structured JSON output |
| 3.2 | `src/app/style-quiz/page.tsx` | Multi-step quiz | Visual choice steps, progress bar, adaptive next-question logic |
| 3.3 | `src/components/ai-stylist/StyleChat.tsx` | Streaming chat | SSE/WebSocket stream, message bubbles, inline product cards, save/swap outfits |
| 3.4 | `src/components/ai-stylist/OutfitCard.tsx` | Generated outfit | Flatlay grid, item roles, bundle price, confidence score |
| 3.5 | `src/components/size/SizeRecommendation.tsx` | AI fit prediction | Confidence badge, heatmap visualization, cross-brand mapping |
| 3.6 | `src/components/recommendations/PersonalizedGrid.tsx` | "For You" section | Hybrid filtering, fairness constraints (brand/price distribution) |
| 3.7 | `src/stores/style-profile.ts` | Style data | Persists quiz results, AI persona, color preferences. `partialize` applied |
| 3.8 | `src/app/api/ai/stream/route.ts` | Stream endpoint | Next.js Route Handler, async generator, SSE headers, abort controller |

### ✅ Phase 3 Validation Gates
- [ ] AI streaming handles network drop/retry gracefully
- [ ] Size recommendation outputs confidence scores; never claims 100%
- [ ] Style quiz saves draft to localStorage before submission
- [ ] No blocking JS on AI routes; Web Worker isolation for inference if needed
- [ ] Lighthouse Performance ≥ 90 on recommendation pages

---

## Phase 4 — Scale, Loyalty & Social
**Goal:** Loyalty program, i18n, PWA, sustainability scoring, UGC.  
**Duration:** 6 weeks | **Deliverable:** Global-ready, community-driven, offline-capable platform.

### 📁 File Matrix & Interfaces
| # | File / Directory | Purpose | Key Interfaces / Features |
|---|------------------|---------|---------------------------|
| 4.1 | `src/server/loyalty.service.ts` | Points engine | Tier calculation, challenge tracking, redemption validation |
| 4.2 | `src/app/loyalty/page.tsx` | Dashboard | Tier progress, active challenges, referral link, badge showcase |
| 4.3 | `src/i18n/config.ts` | Locale setup | `next-intl` integration, RTL support, currency formatting |
| 4.4 | `src/components/shared/LanguageSwitcher.tsx` | Locale picker | Dropdown, auto-detect, path-based routing (`/en`, `/fr`, `/ar`) |
| 4.5 | `public/manifest.json` | PWA config | Standalone, theme color, icons, shortcuts |
| 4.6 | `src/sw.ts` | Service worker | Cache strategies: assets (cache-first), API (network-first), images (stale-while-revalidate) |
| 4.7 | `src/components/social/UGCGallery.tsx` | Customer photos | Instagram sync, product tagging, "Shop This Look" overlay |
| 4.8 | `src/components/sustainability/Scorecard.tsx` | Eco scoring | Circular score, breakdown bars, certifications, carbon offset toggle |
| 4.9 | `src/app/(account)/page.tsx` | Account hub | Order history, addresses, loyalty status, style profile prompt |

### ✅ Phase 4 Validation Gates
- [ ] RTL layout verified via CSS logical properties (`margin-inline`, `text-align: start`)
- [ ] PWA install prompt respects user dismissal; offline fallback functional
- [ ] Sustainability scores sourced from verified schema; not hardcoded
- [ ] Loyalty redemption atomic (DB transaction + optimistic UI rollback on fail)

---

## Phase 5 — Hardening, Testing & Launch
**Goal:** Production readiness, full test coverage, performance/security audit, launch.  
**Duration:** 4 weeks | **Deliverable:** Deployable, monitored, documented platform meeting all KPIs.

### 📁 File Matrix & Interfaces
| # | File / Directory | Purpose | Key Interfaces / Features |
|---|------------------|---------|---------------------------|
| 5.1 | `vitest.config.ts` | Test runner | jsdom env, setup file, alias sync, coverage thresholds (stmt:80, branch:75) |
| 5.2 | `src/test/setup.ts` | Test bootstrap | `@testing-library/jest-dom/vitest`, `requestAnimationFrame` mock, `act` setup |
| 5.3 | `e2e/checkout.spec.ts` | Playwright E2E | Full flow: add to cart → guest checkout → Stripe test → confirmation |
| 5.4 | `lighthouserc.json` | Perf budgets | Assertions: LCP<2500, CLS<0.1, TBT<200. Fails CI on breach |
| 5.5 | `src/lib/sentry.ts` | Error tracking | Client + server config, source maps, PII filtering |
| 5.6 | `src/app/global-error.tsx` | Root error page | Unhandled exception fallback, retry, telemetry ping |
| 5.7 | `docs/architecture.md` | System docs | Data flow, cache strategy, RSC boundaries, security posture |
| 5.8 | `docs/runbook.md` | Deploy/ops guide | Env vars, DB migrations, rollback procedure, incident response |
| 5.9 | `.github/workflows/deploy.yml` | Production CI | Canary 10%→50%→100%, auto-rollback on Sentry error spike |

### ✅ Phase 5 Validation Gates
- [ ] 100% test pass rate; zero `test.skip()`
- [ ] `npm audit` shows 0 high/critical
- [ ] CSP headers enforced; `unsafe-inline` removed
- [ ] Lighthouse: Perf≥90, A11y≥95, BestPractices≥95, SEO≥95
- [ ] Load testing (k6) handles 1k concurrent users without degradation

---

## 8. Cross-Cutting Guardrails
| Concern | Rule | Enforcement |
|---------|------|-------------|
| **TypeScript** | `strict: true`, `erasableSyntaxOnly`, `verbatimModuleSyntax`. Zero `any/enum/namespace` | Fails `tsc --noEmit` in CI |
| **Tailwind v4** | CSS-first `@theme inline`. No JS config. No arbitrary values like `w-[37px]` | Dead code audit script + lint rule |
| **State** | Zustand selectors only in JSX. `partialize` for data. No `getState()` in render | ESLint `no-direct-store-access` |
| **Forms** | `useActionState` + Zod v4. Validate at boundaries only. Disable submit during pending | React 19 strict mode + test coverage |
| **Accessibility** | Skip link, focus traps, `prefers-reduced-motion`, semantic HTML, contrast ≥ 4.5:1 | axe-core CI + manual VoiceOver/NVDA |
| **Performance** | LCP < 2.5s, dynamic imports for 3D/AI, skeleton loading, no blocking scripts | Lighthouse CI + bundle analyzer |
| **Security** | OWASP 2025, Stripe SAQ-A, CSP, rate limits, Zod input sanitization, secure cookies | Snyk scan + DAST + manual review |

---

## 9. Validation Checklist
| Domain | Check | Status |
|--------|-------|--------|
| **PRD Alignment** | Phases map to PRD §3–§29? Features match? | ✅ Validated |
| **Skills Compliance** | React 19 hooks, TS strict, Tailwind v4 CSS-first, Zustand rules, WCAG AAA? | ✅ Enforced |
| **Tech Stack** | Next.js 16 App Router, React 19.2, TS 6.0, TW 4.2, Prisma 7, Zod 4? | ✅ Updated to stable/canary |
| **Anti-Generic** | No purple gradients, no bento grids, bespoke typography, intentional whitespace? | ✅ Design system tokens enforce |
| **Testing** | TDD per phase, E2E critical flows, a11y audits, mock consistency? | ✅ Shift-left integrated |
| **Deployment** | CI/CD, canary, monitoring, runbooks, rollback strategy? | ✅ Phase 5 hardened |

---

# 🔍 Critical Re-Evaluation & Skill Reconciliation

Before delivering the refined plan, I conducted a strict cross-audit of the previous MEP against the three provided skills and the PRD. Below are the **critical deltas, reconciliations, and hardening measures** applied:

| Area | Previous Gap / Ambiguity | Skill-Backed Correction Applied |
|------|--------------------------|--------------------------------|
| **Next.js 16 vs Vite 8** | MVP skill heavily references Vite 8/Rolldown, but PRD mandates Next.js 16 App Router | **Reconciled:** Vite-specific rules (`manualChunks` function, `@tanstack/router-plugin`) replaced with Next.js 16 equivalents (`modularizeImports`, Turbopack auto-splitting, native App Router). React 19/TS 6/Zod/Zustand patterns preserved and adapted to RSC boundaries. |
| **React 19 Hooks** | `useActionState` mentioned, but `useOptimistic` & `startTransition` missing | **Hardened:** Explicit mandate: all optimistic UI updates must wrap setter in `startTransition`. `useId()` required for stable `aria-controls` pairs to prevent hydration mismatches. |
| **Zod v4 API** | Referenced Zod v4 but didn't enforce `.issues` vs `.errors` | **Enforced:** All validation boundaries must use `result.error.issues[0].message`. `.errors` is explicitly banned (v3 legacy). |
| **Zustand Discipline** | `partialize` mentioned, but `.getState()` in JSX not explicitly banned | **Hardened:** Explicit rule: `useStore(s => s.field)` only in JSX. `.getState()` permitted only inside store actions. `partialize` must exclude all ephemeral UI state (`isOpen`, `isLoading`, `toasts`). |
| **Tailwind v4 Gotchas** | CSS-first noted, but negative value & arbitrary value traps missing | **Enforced:** Explicit ban on double-hyphen negatives (`bottom--24` → `-bottom-24`). Zero arbitrary values (`w-[37px]`). All tokens in `@theme inline`. Font families via `@layer utilities`, never `font-["..."]`. |
| **Testing Gotchas** | Vitest/Playwright listed, but jsdom/runtime traps missing | **Hardened:** `requestAnimationFrame` polyfill required in `setup.ts`. All Zustand mutations in tests wrapped in `act()`. `console.error` spies scoped to `beforeAll`/`afterAll` (never module scope). Factory pattern `getMockX(overrides)` mandated. |
| **Accessibility** | WCAG AA/AAA mentioned, but focus trap & roving tabindex missing | **Enforced:** `useFocusTrap` hook required for all overlays. Roving `tabIndex` + arrow keys for tabs. Skip link mandatory. `prefers-reduced-motion` media query exact syntax baked into `globals.css`. |
| **Performance** | Waterfall elimination mentioned, but not structurally enforced | **Hardened:** `Promise.all()` mandatory for independent server fetches. `next/image` requires explicit `width`/`height` to prevent CLS. Dynamic `import()` with `ssr: false` for 3D/AI. Skeleton loaders only (no spinners for content). |

---

# 📜 LuxeVerse v3.0 — Refined & Skill-Hardened Master Execution Plan
**Status:** Re-Validated & Enhanced  
**Stack:** Next.js 16 · React 19.2 · TypeScript 6.0 · Tailwind CSS v4.2 · Prisma 7 · PostgreSQL 17 · tRPC · Zustand 5 · Zod v4 · Framer Motion 12  
**Workflow:** `ANALYZE → PLAN → VALIDATE → IMPLEMENT → VERIFY → DELIVER`

## Phase 0 — Foundation & Design System
**Goal:** Bootable monorepo shell, strict TS/TW v4 config, accessible UI primitives, CI/CD pipeline.  
**Duration:** 2 weeks | **Deliverable:** `next dev` runs a styled, WCAG-compliant app shell with design tokens live.

### 📁 File Matrix & Interfaces
| # | File / Directory | Purpose | Key Interfaces / Skill-Enforced Rules |
|---|------------------|---------|----------------------------------------|
| 0.1 | `tsconfig.json` | TS strict config | `strict: true`, `erasableSyntaxOnly: true`, `verbatimModuleSyntax: true`, `noUnusedLocals/Parameters`, path aliases `@/*`. **Zero `any`/`enum`/`namespace`.** |
| 0.2 | `src/globals.css` | Tailwind v4 CSS-first theme | `@import "tailwindcss";` + `@theme inline` with OKLCH colors, fluid typography (`clamp()`), golden-ratio spacing, luxury easing curves. **Exact `prefers-reduced-motion` media query.** |
| 0.3 | `src/lib/utils.ts` | Class composition | `cn(...inputs: ClassValue[]): string` using `clsx` + `tailwind-merge` |
| 0.4 | `src/components/ui/Button.tsx` | Accessible button primitive | `ButtonProps` (variant, size, loading, disabled). Wraps Radix `Slot`. Supports `useActionState` pending state. **Component-prefixed interface.** |
| 0.5 | `src/components/ui/Input.tsx` | Form input | `InputProps` (type, error, label, helperText). Focus-visible ring, ARIA invalid handling |
| 0.6 | `src/components/ui/Dialog.tsx` | Modal dialog | `DialogProps` (open, onOpenChange, title, description). **Must integrate `useFocusTrap` hook.** |
| 0.7 | `src/components/ui/Drawer.tsx` | Slide panel | `DrawerProps` (side, open, onClose). Radix-based, reduced-motion compliant |
| 0.8 | `src/components/shared/SkipLink.tsx` | WCAG 2.4.1 | `href="#main"`, sr-only → visible on focus. **Mandatory in root layout.** |
| 0.9 | `src/components/shared/ErrorBoundary.tsx` | React error catch | `ErrorBoundaryProps` (fallback). Logs to telemetry, renders graceful fallback |
| 0.10 | `src/components/layout/Navbar.tsx` | Global nav | Sticky, scroll-aware blur, responsive (desktop → mobile Sheet), search trigger, cart badge |
| 0.11 | `src/components/layout/Footer.tsx` | Global footer | 4-col layout, newsletter form, social links, i18n/currency placeholders |
| 0.12 | `src/app/layout.tsx` | Root layout | `<html>`, `<body>`, `next/font` loading, `<SkipLink>`, `<Navbar>`, `<main id="main">`, `<Footer>`, `<Toaster>` |
| 0.13 | `next.config.ts` | Next.js config | `reactStrictMode: true`, `modularizeImports`, image domains, CSP headers via `headers()` |
| 0.14 | `middleware.ts` | Auth/Locale routing | Geo-IP locale redirect, auth guard, rate limiting headers |
| 0.15 | `.github/workflows/ci.yml` | CI pipeline | `tsc --noEmit` → `next lint` → `vitest run` → `next build` → Lighthouse CI budget |

### ✅ Phase 0 Validation Gates
- [ ] `npx tsc --noEmit` passes with 0 errors, 0 warnings
- [ ] `@theme inline` used; **zero `tailwind.config.*` files exist**
- [ ] All UI primitives wrap Radix/Shadcn; zero custom DOM rebuilds
- [ ] `prefers-reduced-motion` media query present in `globals.css`
- [ ] Lighthouse Accessibility ≥ 95 on shell
- [ ] CI fails on `any`, `enum`, `namespace`, or `.getState()` in JSX

---

## Phase 1 — Core Commerce Foundation
**Goal:** Functional product catalog, cart, checkout with Stripe. Authenticated user flows.  
**Duration:** 6 weeks | **Deliverable:** Browse → Add to Cart → Guest/Logged-in Checkout → Order Confirmation.

### 📁 File Matrix & Interfaces
| # | File / Directory | Purpose | Key Interfaces / Skill-Enforced Rules |
|---|------------------|---------|----------------------------------------|
| 1.1 | `src/lib/schemas.ts` | Zod v4 validation | `loginSchema`, `registerSchema`, `addressSchema`, `checkoutSchema`. **Must use `result.error.issues[0].message`.** |
| 1.2 | `prisma/schema.prisma` | DB schema | All models. **Enums as `String` + union types** (per `erasableSyntaxOnly`) |
| 1.3 | `src/lib/prisma.ts` | Prisma singleton | Global client cache, connection pooling for serverless |
| 1.4 | `src/server/routers/product.ts` | Product tRPC router | `list`, `getBySlug`, `getVariants`, `getRelated`. **Parallel `Promise.all` data fetch.** |
| 1.5 | `src/server/routers/cart.ts` | Cart tRPC router | `addItem`, `updateQty`, `remove`, `applyCoupon`. Inventory validation, optimistic sync |
| 1.6 | `src/app/(shop)/page.tsx` | Shop landing | ISR revalidate 60s. Server Component rendering category grid, featured collections |
| 1.7 | `src/app/(shop)/[category]/[slug]/page.tsx` | PDP (Server) | Fetches product. Streams media gallery, passes variant/cart to Client Islands |
| 1.8 | `src/components/product/ProductGallery.tsx` | Media island | Thumbnails, zoom, fullscreen, video autoplay. `useOptimistic` for hover state |
| 1.9 | `src/components/product/VariantSelector.tsx` | Variant picker | Color swatches, size buttons. OOS styling disabled, ARIA-selected, `useActionState` sync |
| 1.10 | `src/components/cart/CartDrawer.tsx` | Slide-in cart | Zustand store driven. Optimistic updates, undo toast (5s), free shipping progress |
| 1.11 | `src/app/checkout/page.tsx` | Checkout flow | Multi-step: Shipping → Payment → Review. Server actions via `useActionState` |
| 1.12 | `src/components/checkout/PaymentForm.tsx` | Stripe integration | Elements wrapper, PCI SAQ-A compliant, express pay (Apple/Google), BNPL toggle |
| 1.13 | `src/stores/cart.ts` | Cart state | `useCartStore` (Zustand). `partialize: (s) => ({ items: s.items })`. **Selectors only in JSX.** |
| 1.14 | `src/app/(auth)/login/page.tsx` | Auth forms | `useActionState` + Zod. NextAuth v5 JWT, secure cookies, role-based redirects |
| 1.15 | `src/app/(shop)/loading.tsx` | Skeleton loader | `aria-busy="true"`, structured grid skeletons, **no spinners for content** |

### ✅ Phase 1 Validation Gates
- [ ] All form submissions use `useActionState` + Zod v4 (`.issues` API)
- [ ] Cart persists only domain data (`partialize`); zero UI state persisted
- [ ] Stripe PCI compliance verified (no raw PAN handling)
- [ ] PDP LCP < 2.5s via image priority, font preload, SSR shell
- [ ] `next/image` components have explicit `width`/`height` (zero CLS)
- [ ] Axe-core 0 violations on checkout flow

---

## Phase 2 — Cinematic Experience
**Goal:** Visually stunning homepage, advanced search, editorial system, 3D/AR viewers.  
**Duration:** 6 weeks | **Deliverable:** Editorial-grade homepage, immersive product interaction, rich content rendering.

### 📁 File Matrix & Interfaces
| # | File / Directory | Purpose | Key Interfaces / Skill-Enforced Rules |
|---|------------------|---------|----------------------------------------|
| 2.1 | `src/components/sections/HeroSection.tsx` | Full-viewport hero | Video bg (responsive), cinematic overlays, `TextReveal` animation, magnetic CTA |
| 2.2 | `src/components/shared/MagneticButton.tsx` | Cursor-following CTA | `strength: number`, `radius: number`, `prefers-reduced-motion` fallback |
| 2.3 | `src/components/shared/ScrollReveal.tsx` | Viewport entry | `whileInView`, stagger children, `margin: -100px` |
| 2.4 | `src/components/product/ProductViewer3D.tsx` | WebGL product view | `@react-three/fiber` + `@react-three/drei`. **Dynamic `import()`, `ssr: false`, skeleton fallback.** |
| 2.5 | `src/components/search/SearchOverlay.tsx` | Cmd+K search | Debounced tRPC query, recent/trending, visual search upload hook |
| 2.6 | `src/app/search/page.tsx` | Search results | URL-synced filters (`searchParams`), faceted sidebar, infinite scroll fallback |
| 2.7 | `src/components/editorial/RichTextRenderer.tsx` | CMS blocks | Structured JSON renderer: text, image, product-embed, quote, timeline |
| 2.8 | `src/components/shared/PageTransition.tsx` | Route transitions | Framer Motion `AnimatePresence`, blur+fade, `layout` prop disabled for perf |
| 2.9 | `src/stores/wishlist.ts` | Wishlist state | Flat Zustand store, optimistic add/remove, sync with tRPC |
| 2.10 | `src/app/loading.tsx` | Global suspense | Skeleton grid matching editorial layout, `aria-busy` |

### ✅ Phase 2 Validation Gates
- [ ] 3D viewer dynamically imported; initial bundle < 150KB
- [ ] All animations use `transform`/`opacity` only (compositor)
- [ ] Search state fully URL-synced; shareable/bookmarkable
- [ ] Hero video lazy-loads on mobile; poster fallback present
- [ ] Reduced motion disables all parallax/magnetic effects
- [ ] All lists have explicit empty states with actionable guidance

---

## Phase 3 — AI & Personalization
**Goal:** AI stylist, style quiz, size prediction, personalized recommendations.  
**Duration:** 6 weeks | **Deliverable:** Adaptive UX with streaming AI responses, fit guidance, outfit generation.

### 📁 File Matrix & Interfaces
| # | File / Directory | Purpose | Key Interfaces / Skill-Enforced Rules |
|---|------------------|---------|----------------------------------------|
| 3.1 | `src/server/ai.service.ts` | AI orchestration | `generateOutfit`, `getSizeAdvice`, `streamStyleChat`. Uses OpenAI/Claude, structured JSON output |
| 3.2 | `src/app/style-quiz/page.tsx` | Multi-step quiz | Visual choice steps, progress bar, adaptive next-question logic |
| 3.3 | `src/components/ai-stylist/StyleChat.tsx` | Streaming chat | SSE/WebSocket stream, message bubbles, inline product cards, save/swap outfits |
| 3.4 | `src/components/ai-stylist/OutfitCard.tsx` | Generated outfit | Flatlay grid, item roles, bundle price, confidence score |
| 3.5 | `src/components/size/SizeRecommendation.tsx` | AI fit prediction | Confidence badge, heatmap visualization, cross-brand mapping |
| 3.6 | `src/components/recommendations/PersonalizedGrid.tsx` | "For You" section | Hybrid filtering, fairness constraints (brand/price distribution) |
| 3.7 | `src/stores/style-profile.ts` | Style data | Persists quiz results, AI persona, color preferences. `partialize` applied |
| 3.8 | `src/app/api/ai/stream/route.ts` | Stream endpoint | Next.js Route Handler, async generator, SSE headers, abort controller |

### ✅ Phase 3 Validation Gates
- [ ] AI streaming handles network drop/retry gracefully
- [ ] Size recommendation outputs confidence scores; never claims 100%
- [ ] Style quiz saves draft to localStorage before submission
- [ ] No blocking JS on AI routes; Web Worker isolation for inference if needed
- [ ] Lighthouse Performance ≥ 90 on recommendation pages

---

## Phase 4 — Scale, Loyalty & Social
**Goal:** Loyalty program, i18n, PWA, sustainability scoring, UGC.  
**Duration:** 6 weeks | **Deliverable:** Global-ready, community-driven, offline-capable platform.

### 📁 File Matrix & Interfaces
| # | File / Directory | Purpose | Key Interfaces / Skill-Enforced Rules |
|---|------------------|---------|----------------------------------------|
| 4.1 | `src/server/loyalty.service.ts` | Points engine | Tier calculation, challenge tracking, redemption validation |
| 4.2 | `src/app/loyalty/page.tsx` | Dashboard | Tier progress, active challenges, referral link, badge showcase |
| 4.3 | `src/i18n/config.ts` | Locale setup | `next-intl` integration, RTL support, currency formatting |
| 4.4 | `src/components/shared/LanguageSwitcher.tsx` | Locale picker | Dropdown, auto-detect, path-based routing (`/en`, `/fr`, `/ar`) |
| 4.5 | `public/manifest.json` | PWA config | Standalone, theme color, icons, shortcuts |
| 4.6 | `src/sw.ts` | Service worker | Cache strategies: assets (cache-first), API (network-first), images (stale-while-revalidate) |
| 4.7 | `src/components/social/UGCGallery.tsx` | Customer photos | Instagram sync, product tagging, "Shop This Look" overlay |
| 4.8 | `src/components/sustainability/Scorecard.tsx` | Eco scoring | Circular score, breakdown bars, certifications, carbon offset toggle |
| 4.9 | `src/app/(account)/page.tsx` | Account hub | Order history, addresses, loyalty status, style profile prompt |

### ✅ Phase 4 Validation Gates
- [ ] RTL layout verified via CSS logical properties (`margin-inline`, `text-align: start`)
- [ ] PWA install prompt respects user dismissal; offline fallback functional
- [ ] Sustainability scores sourced from verified schema; not hardcoded
- [ ] Loyalty redemption atomic (DB transaction + optimistic UI rollback on fail)

---

## Phase 5 — Hardening, Testing & Launch
**Goal:** Production readiness, full test coverage, performance/security audit, launch.  
**Duration:** 4 weeks | **Deliverable:** Deployable, monitored, documented platform meeting all KPIs.

### 📁 File Matrix & Interfaces
| # | File / Directory | Purpose | Key Interfaces / Skill-Enforced Rules |
|---|------------------|---------|----------------------------------------|
| 5.1 | `vitest.config.ts` | Test runner | jsdom env, setup file, alias sync, coverage thresholds (stmt:80, branch:75) |
| 5.2 | `src/test/setup.ts` | Test bootstrap | `@testing-library/jest-dom/vitest`, **`requestAnimationFrame` mock**, `act` setup |
| 5.3 | `e2e/checkout.spec.ts` | Playwright E2E | Full flow: add to cart → guest checkout → Stripe test → confirmation |
| 5.4 | `lighthouserc.json` | Perf budgets | Assertions: LCP<2500, CLS<0.1, TBT<200. Fails CI on breach |
| 5.5 | `src/lib/sentry.ts` | Error tracking | Client + server config, source maps, PII filtering |
| 5.6 | `src/app/global-error.tsx` | Root error page | Unhandled exception fallback, retry, telemetry ping |
| 5.7 | `docs/architecture.md` | System docs | Data flow, cache strategy, RSC boundaries, security posture |
| 5.8 | `docs/runbook.md` | Deploy/ops guide | Env vars, DB migrations, rollback procedure, incident response |
| 5.9 | `.github/workflows/deploy.yml` | Production CI | Canary 10%→50%→100%, auto-rollback on Sentry error spike |

### ✅ Phase 5 Validation Gates
- [ ] 100% test pass rate; zero `test.skip()`
- [ ] `requestAnimationFrame` polyfill active in jsdom; `act()` wraps all store mutations
- [ ] `console.error` spies scoped to `beforeAll`/`afterAll` (no module leaks)
- [ ] `npm audit` shows 0 high/critical
- [ ] CSP headers enforced; `unsafe-inline` removed
- [ ] Lighthouse: Perf≥90, A11y≥95, BestPractices≥95, SEO≥95
- [ ] Load testing (k6) handles 1k concurrent users without degradation

---

## 🛡️ Cross-Cutting Guardrails (Skill-Enforced)
| Concern | Rule | Enforcement |
|---------|------|-------------|
| **TypeScript** | `strict: true`, `erasableSyntaxOnly`, `verbatimModuleSyntax`. Zero `any/enum/namespace` | Fails `tsc --noEmit` in CI |
| **Tailwind v4** | CSS-first `@theme inline`. No JS config. No arbitrary values. Negative values: `-bottom-24` (single hyphen) | Dead code audit script + lint rule |
| **State** | Zustand selectors only in JSX: `useStore(s => s.field)`. `partialize` for data. No `.getState()` in render | ESLint `no-direct-store-access` |
| **Forms** | `useActionState` + Zod v4. Validate at boundaries only. Disable submit during pending. Use `result.error.issues` | React 19 strict mode + test coverage |
| **React 19** | `useOptimistic` setters wrapped in `startTransition`. `useId()` for stable `aria-controls` pairs | Code review + test assertions |
| **Accessibility** | Skip link, `useFocusTrap` in overlays, roving tabindex for tabs, `prefers-reduced-motion`, semantic HTML, contrast ≥ 4.5:1 | axe-core CI + manual VoiceOver/NVDA |
| **Performance** | LCP < 2.5s, `Promise.all` for independent fetches, `next/image` dimensions, dynamic imports for 3D/AI, skeleton loading | Lighthouse CI + bundle analyzer |
| **Security** | OWASP 2025, Stripe SAQ-A, CSP, rate limits, Zod input sanitization, secure cookies | Snyk scan + DAST + manual review |
| **Testing** | TDD per phase, `requestAnimationFrame` mock, `act()` wrapping, scoped `consoleSpy`, factory pattern `getMockX()` | CI gate + coverage thresholds |
| **Anti-Generic** | No purple gradients, no bento grids, bespoke typography, intentional whitespace, OKLCH palette | Design system tokens + visual audit |

---

## ✅ Final Validation Checklist
| Domain | Check | Status |
|--------|-------|--------|
| **PRD Alignment** | Phases map to PRD §3–§29? Features match? | ✅ Validated |
| **Skills Compliance** | React 19 hooks, TS strict, Tailwind v4 CSS-first, Zustand rules, WCAG AAA? | ✅ Enforced |
| **Tech Stack** | Next.js 16 App Router, React 19.2, TS 6.0, TW 4.2, Prisma 7, Zod 4? | ✅ Updated & Reconciled |
| **Anti-Generic** | No purple gradients, no bento grids, bespoke typography, intentional whitespace? | ✅ Design system tokens enforce |
| **Testing** | TDD per phase, E2E critical flows, a11y audits, mock consistency, jsdom traps handled? | ✅ Shift-left integrated |
| **Deployment** | CI/CD, canary, monitoring, runbooks, rollback strategy? | ✅ Phase 5 hardened |

---

## 🎯 Next Step: VALIDATE Checkpoint
This refined Master Execution Plan has been meticulously cross-audited against the PRD and all three provided skills. Vite-specific patterns have been safely adapted to Next.js 16 App Router conventions, while preserving all React 19, TypeScript 6, Zod v4, Zustand, Tailwind v4, and testing mandates.

**Please explicitly confirm:**
1. Do you approve this refined plan for implementation?
2. Are there any scope adjustments, priority shifts, or additional constraints before we begin Phase 0?

