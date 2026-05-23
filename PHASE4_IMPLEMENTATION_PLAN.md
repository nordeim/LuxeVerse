# Phase 4 Implementation Plan — Scale, Loyalty & Social

## Overview

This plan implements Phase 4 of the LuxeVerse project (Scale, Loyalty & Social) as defined in the MASTER_EXECUTION_PLAN.md. It follows the TDD approach: tests first, then minimal implementation. All files use flattened src/server/ directories, route groups (e.g., (account)), and strict AGENTS.md enforcement (strict TS, Tailwind v4, Zustand rules).

---

## Phase 4.1: Loyalty & Rewards Engine

### Objective
Implement a loyalty points system, tiered membership, point history, and redemption features.

### Database Schema (Prisma)

**Prerequisites: Fields already exist on User and Order models.**

**User Model:**
- loyaltyPoints: Int (default: 0)
- lifetimePoints: Int (default: 0)
- tier: String (default: 'BRONZE')

**Order Model:**
- pointsEarned: Int (default: 0)
- pointsRedeemed: Int (default: 0)

**New Models:**
- PointHistory: id, userId, orderId?, amount, type (EARNED/REDEEMED/ADJUSTED), description, createdAt.
- Benefit/Perk: id, tier, name, description, multiplier.

### TDD Steps

#### Test Plan (Write First)
1. When a user places an order, their loyaltyPoints and lifetimePoints increase correctly based on the order total and current tier multiplier.
2. When a user redeems points, their loyaltyPoints decrease and a PointHistory record is created.
3. When a user's lifetimePoints cross a threshold, their tier upgrades (e.g., BRONZE -> SILVER -> GOLD).
4. If a user's order is cancelled, the loyalty points earned from that order are reversed.
5. Ensure atomicity: if point redemption or earning fails mid-transaction, all database changes are rolled back.

#### Implementation
1. Create src/server/loyalty.service.ts (MEP flat structure).
2. Implement createLoyaltyService() factory with: calculatePoints, addPoints, redeemPoints, getHistory, adjustPoints, reverseTransaction.
3. Define tier thresholds in a configuration object (e.g., BRONZE: 0, SILVER: 1000, GOLD: 5000, PLATINUM: 10000).
4. Wrap all Prisma operations in a $transaction for atomicity.
5. Create tRPC router: src/server/routers/loyalty.ts for client-side interaction.
6. Create components: LoyaltyDashboard.tsx, PointsHistory.tsx, RedeemPointsButton.tsx.
7. Run pnpm db:generate after any Prisma schema change.

---

## Phase 4.2: Multi-language Support (i18n)

### Objective
Add internationalization (i18n) to support English and an additional language (e.g., French or Spanish, to be confirmed).

### TDD Steps

#### Test Plan (Write First)
1. When the locale is changed to 'fr', the UI text reflects the French translations.
2. When the user visits /fr/shop, the content is rendered in French.
3. Ensure the currency symbol and number formatting adjust based on the locale.

#### Implementation
1. Install dependency: next-intl.
2. Create src/i18n/config.ts with defaultLocale and locales array (MEP).
3. Create translation files: messages/en.json, messages/fr.json.
4. Update src/app/layout.tsx to use NextIntlClientProvider and remove hardcoded lang="en".
5. Update components to use useTranslations hook.
6. Add middleware: src/middleware.ts for locale routing.
7. Ensure CSS uses logical properties (margin-inline, text-align: start) for RTL support.

---

## Phase 4.3: Progressive Web App (PWA)

### Objective
Transform the web app into an installable PWA with offline support.

### TDD Steps

#### Test Plan (Write First)
1. Verify that the manifest.json file is served correctly from /manifest.json.
2. Verify that the service worker registers successfully in the browser.
3. Verify that key static assets are cached by the service worker for offline access.

#### Implementation
1. Install dependency: @ducanh2912/next-pwa.
2. Update next.config.ts to wrap the export with next-pwa configuration.
3. Create public/manifest.json with app metadata, icons, and theme colors.
4. Create src/sw.ts (MEP) for cache strategies: assets (cache-first), API (network-first), images (stale-while-revalidate).
5. Add public/icon-192x192.png and public/icon-512x512.png.
6. Ensure src/app/layout.tsx registers the service worker.

---

## Phase 4.4: User-Generated Content (UGC)

### Objective
Enable users to upload photos and write content (reviews, style guides) that can be displayed on the site.

### TDD Steps

#### Test Plan (Write First)
1. A user can upload an image, and it is stored in the database/cloud storage.
2. Uploaded content is linked to the user's profile.
3. Content can be flagged for moderation and its status changed (PENDING, APPROVED, REJECTED).

#### Implementation
1. Create Prisma model: UGCContent (id, userId, type, url, caption, status, createdAt).
2. Create tRPC router: src/server/routers/ugc.ts for CRUD operations.
3. Create component: src/components/social/UGCGallery.tsx (MEP).
   - Features: Instagram sync, product tagging, "Shop This Look" overlay.
4. Create moderation queue component (optional, can be deferred).
5. Run pnpm db:generate after any Prisma schema change.

---

## Phase 4.5: Sustainability Tracking & Transparency

### Objective
Add a product sustainability score and display it to the user.

### TDD Steps

#### Test Plan (Write First)
1. Products have a sustainabilityScore (0-100).
2. The sustainability score is calculated from verified materials and production data.
3. The score is displayed on the Product Detail Page (PDP) and Product List Page (PLP).

#### Implementation
1. Update Prisma Product model to include sustainabilityScore (Int, default: 0).
2. Update src/server/services/product.service.ts to include sustainability data.
3. Create component: src/components/sustainability/Scorecard.tsx (MEP).
   - Features: Circular score, breakdown bars, certifications, carbon offset toggle.
4. Update ProductCard.tsx and ProductPage.tsx to display the score.

---

## Phase 4.6: Account Hub & Dashboard

### Objective
Create a comprehensive user account hub where users can manage their profile, view order history, loyalty status, and saved items.

### TDD Steps

#### Test Plan (Write First)
1. Authenticated users can view their Account Hub.
2. The hub displays the user's current tier, points, and recent order history.
3. Users can update their profile information.

#### Implementation
1. Create route group: src/app/(account)/page.tsx (MEP).
2. Create components: AccountOverview.tsx, OrderHistory.tsx, ProfileSettings.tsx.
3. Use Zustand for client-side state management of user data.
4. Ensure all components are client components with "use client" directive where necessary.
5. Zustand Store Rule: Persist ONLY domain data (items). UI state (isOpen, isLoading) MUST be excluded from partialize.

---

## Quality Gates & Verification

Before marking any sub-phase as complete, the following MUST pass:

### Code Quality
1. pnpm run typecheck (tsc --noEmit) — Zero TypeScript errors.
2. pnpm run lint — All linting and formatting checks pass.
3. pnpm run test (Vitest) — All new and existing tests pass. Coverage for new logic must be > 80%.
4. pnpm run build — The production build completes successfully.

### MEP Validation Gates
5. **RTL Layout:** Verified via CSS logical properties (margin-inline, text-align: start).
6. **PWA Install Prompt:** Respects user dismissal; offline fallback functional.
7. **Sustainability Scores:** Sourced from verified schema; not hardcoded.
8. **Loyalty Redemption:** Atomic (DB transaction + optimistic UI rollback on fail).

### SKILL.md Discipline
9. **No `any`:** All service layers typed with Prisma payload types (e.g., Prisma.CartGetPayload). No raw `any` anywhere.
10. **No `enum`:** All status fields use string unions. Zero Prisma enums.
11. **Zustand Selectors:** `useStore(s => s.field)` in JSX only. `.getState()` permitted inside store actions, never in render.
12. **Prisma Schema Sync:** After any schema change, run `pnpm db:generate` to update the Prisma Client. Failure to do so results in TS2339 errors.

---

## Plan Validation

- **Does the scope match the MEP?** Yes, it covers all 6 sub-phases of Phase 4.
- **Are the TDD steps clear?** Yes, each sub-phase starts with tests that define the desired behavior.
- **Is the database schema correct?** Yes, it builds on existing Prisma fields and adds necessary new models.
- **Are there any blockers or dependencies?** Yes, Phase 4.2 (i18n) requires installing `next-intl`. Phase 4.3 (PWA) requires image assets and a service worker.
