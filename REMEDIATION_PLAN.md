# LuxeVerse — Audit Remediation Plan (Phase 5 Prep)

## Overview
This plan addresses the findings from the Phase 4 Code Review & Audit. The goal is to replace remaining mock data, close functional gaps, and harden the codebase for production readiness, aligning with the "Meticulous Approach" and "Anti-Generic" mandates.

## Status Summary
- **Audit Date**: 2026-05-25
- **Gaps Identified**: 12
- **Criticality**: 3 P0 (Security/Core), 6 P1 (Functional), 3 P2 (Technical Debt)

---

## 1. Real-World Commerce Integration (P0)

### 1.1 Stripe Hardening
- **Finding**: `payment.service.ts` and `checkout.actions.ts` use hardcoded mock PaymentIntents.
- **Action**: 
    - Wire `payment.service.ts` to real `stripe.paymentIntents.create`.
    - Update `checkout.actions.ts` to use `paymentService.createIntent()`.
- **Verification**: `tsc --noEmit` and manual verification of PaymentIntent generation in logs.

### 1.2 Session Binding
- **Finding**: `checkout.actions.ts` uses `userId: "user_mock_id"`.
- **Action**: 
    - Import `authOptions` and use `getServerSession` to resolve the real user ID.
    - Implement guest checkout fallback if no session exists.
- **Verification**: Create an order while logged in and verify `userId` in Prisma Studio.

### 1.3 Dynamic Tax & Shipping
- **Finding**: Hardcoded constants ($8.00 tax, $0 shipping) in server actions.
- **Action**: 
    - Implement a basic calculation utility in `packages/utils`.
    - Wire to order creation logic.

---

## 2. Dynamic Content & Service Wiring (P1)

### 2.1 Editorial Service
- **Finding**: `EditorialIndexPage` and PDP ArticleCard rely on hardcoded `EDITORIALS` array.
- **Action**: 
    - Create `src/server/services/editorial.service.ts`.
    - Update `app/editorial/page.tsx` to fetch from Prisma.
- **Verification**: `pnpm build` succeeds with dynamic routes.

### 2.2 Homepage Hydration (RSC-First)
- **Finding**: `FeaturedCollections` and `NewArrivals` define internal mock state.
- **Action**: 
    - Refactor to accept props from the Homepage (RSC).
    - Update `app/page.tsx` to fetch data via `ProductService`.

### 2.3 Newsletter & Visual Search Stubs
- **Finding**: `TODO` markers for visual search and newsletter integration.
- **Action**: 
    - Implement a `newsletter.action.ts` (Resend placeholder or dummy API log).
    - Wire `VisualSearchButton` to the existing AI service infrastructure.

---

## 3. Technical Hardening & Debt (P2)

### 3.1 Icon Standardization
- **Finding**: `SearchInput.tsx` uses raw `✕` character.
- **Action**: Replace with Lucide `X` icon to maintain "Cinematic Luxury" visual consistency.

### 3.2 Error Monitoring (Sentry)
- **Finding**: `global-error.tsx` has a `TODO` for Sentry.
- **Action**: 
    - Initialize Sentry (or a production-ready logger shell).
    - Ensure stack traces are captured in development mode.

### 3.3 E2E Checkout Flow
- **Finding**: MEP §5.3 deliverable (`checkout.spec.ts`) is missing.
- **Action**: 
    - Create `apps/web/e2e/checkout.spec.ts`.
    - Verify the "Browse → Add to Bag → Checkout" journey.

---

## Quality Gates
1. `pnpm typecheck` (0 errors)
2. `pnpm lint` (0 warnings, no hex colors)
3. `pnpm test` (All passing, 95+ count)
4. `pnpm build` (With --webpack flag)
