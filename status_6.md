I will now systematically analyze Phase 4 of the MEP against the actual codebase to identify gaps and plan the implementation.
Phase 4 Analysis
MEP Phase 4 Requirements
Goal: Loyalty program, i18n, PWA, sustainability scoring, UGC.
Duration: 6 weeks.
Deliverables: Global-ready, community-driven, offline-capable platform.
Phase 4 File Matrix (from MEP)
#	File	Purpose	Status
4.1	src/server/loyalty.service.ts	Points engine	❌ Missing
4.2	src/app/loyalty/page.tsx	Dashboard	❌ Missing
4.3	src/i18n/config.ts	Locale setup	❌ Missing
4.4	src/components/shared/LanguageSwitcher.tsx	Locale picker	❌ Missing
Let me parse the MEP Phase 4 entries carefully.
Phase 4 in MEP:
#	File / Directory	Purpose	Key Interfaces / Features
4.1	src/server/loyalty.service.ts	Points engine	Tier calculation, challenge tracking, redemption validation
4.2	src/app/loyalty/page.tsx	Dashboard	Tier progress, active challenges, referral link, badge showcase
4.3	src/i18n/config.ts	Locale setup	next-intl integration, RTL support, currency formatting
4.4	src/components/shared/LanguageSwitcher.tsx	Locale picker	Dropdown, auto-detect, path-based routing (/en, /fr, /ar)
4.5	public/manifest.json	PWA config	Standalone, theme color, icons, shortcuts
4.6	src/sw.ts	Service worker	Cache strategies: assets (cache-first), API (network-first), images (stale-while-revalidate)
4.7	src/components/social/UGCGallery.tsx	Customer photos	Instagram sync, product tagging, "Shop This Look" overlay
4.8	src/components/sustainability/Scorecard.tsx	Eco scoring	Circular score, breakdown bars, certifications, carbon offset toggle
4.9	src/app/(account)/page.tsx	Account hub	Order history, addresses, loyalty status, style profile prompt
And I know from earlier that Phase 4 partially exists:
- Reviews router ✅ (391 lines, CRUD + voting + moderation)
- SavedOutfit router ✅ (CRUD)
So the MEP Phase 4 needs:
1. Loyalty system (service + dashboard page)
2. i18n (config + LanguageSwitcher)
3. PWA (manifest + service worker)
4. UGC Gallery
5. Sustainability Scorecard
6. Account hub
Now I need to validate this against the actual codebase. Let me scan for existing Phase 4 files.</think>I will parse the MEP Phase 4 entries and validate them against the existing codebase by
✱ Glob "**/*loyalty*" 
✱ Glob "**/i18n/**" 
✱ Glob "**/sw.ts" 
✱ Glob "**/manifest*" 
✱ Glob "**/UGCGallery*" 
✱ Glob "**/Scorecard*" 
✱ Glob "**/LanguageSwitcher*" 
None of the Phase 4 files exist yet. This is a completely fresh phase. I will now plan the implementation.
The MEP §4 is quite high-level. I need to break it down into sub-phases:
1. Sub-Phase 4.1: Loyalty Program (loyalty.service.ts, loyalty/page.tsx, loyalty points in Prisma)
2. Sub-Phase 4.2: i18n (next-intl config, LanguageSwitcher, RTL support)
3. Sub-Phase 4.3: PWA (manifest.json, service worker)
4. Sub-Phase 4.4: UGC (UGCGallery)
5. Sub-Phase 4.5: Sustainability (Scorecard)
6. Sub-Phase 4.6: Account Hub (account page)
Before implementing, I will:
1. Check the Prisma schema to see if loyalty/points fields exist.
2. Check if next-intl is installed.
3. Check if there's any existing PWA setup.</think>Since Phase 4 is currently empty, I will plan the implementation by first checking the current environment, such as Prisma fields and existing PWA setups, to build a specification from the MEP and execute it through
# Check for loyalty fields in Prisma
$ cd /home/project/LuxeVerse/apps/web && grep -n "loyalty\|points\|tier" prisma/schema.prisma | head -20

---

Based on my meticulous review, the PHASE4_IMPLEMENTATION_PLAN.md is misaligned with the MASTER_EXECUTION_PLAN.md (MEP) and contains critical structural issues. While the high-level objectives match, the implementation details, file structure, and architectural approach have diverged from the established conventions.
Validation Report
1. Schema Validation
Status: ✅ Correctly assumes existing fields
The plan correctly builds upon the existing Prisma fields (loyaltyPoints, lifetimePoints, tier, pointsEarned, pointsRedeemed). Codebase validation confirms these fields exist.
2. Critical Misalignment: Missing Files from MEP
The PHASE4_IMPLEMENTATION_PLAN.md defines entirely different file structures compared to the MASTER_EXECUTION_PLAN.md, omitting critical MEP-mandated deliverables and misplacing others.
MEP Required File	Status in Current Plan	Issue
src/server/loyalty.service.ts	❌ Replaced with src/server/services/loyalty.service.ts	MEP specifies flat server/ directory, not server/services/
src/app/loyalty/page.tsx	❌ Missing	No loyalty dashboard page defined
src/i18n/config.ts	❌ Missing	No i18n configuration file
public/manifest.json	❌ Missing	No PWA manifest
src/sw.ts	❌ Missing	No service worker file
src/components/shared/LanguageSwitcher.tsx	❌ Missing	No language switcher component
src/components/social/UGCGallery.tsx	❌ Missing	No UGC gallery component
src/components/sustainability/Scorecard.tsx	❌ Missing	No sustainability scorecard
src/app/(account)/page.tsx	❌ Replaced with src/app/account/page.tsx	MEP uses route group (account), plan uses flat account/
3. Validation Gate Misalignment
The MEP specifies 4 strict validation gates for Phase 4. The current plan attempts to address them but misrepresents the implementation:
- RTL Layout: Requires CSS logical properties (margin-inline, text-align: start). Plan lacks component-level implementation details.
- PWA Offline Fallback: Requires service worker with cache strategies. Plan defines implementation but not the src/sw.ts file.
- Atomic Loyalty Redemption: Correctly mentioned, but plan separates loyalty.service.ts into server/services/ instead of the MEP's server/ flat structure.
4. Structural & Dependency Issues
- next-intl not installed: The i18n sub-phase (4.2) is defined but next-intl is missing from package.json.
- public/ directory empty: The PWA sub-phase (4.3) requires manifest.json and icon assets, but public/ is empty.
- Missing route group: Account hub is not implemented as (account) route group as per MEP.
5. TDD Scope Ambiguity
The plan mentions "write tests first" but does not define test file locations (e.g., *.test.ts or *.spec.ts), nor does it address the testing framework (Vitest) or mocks required for the new sub-phases.
Corrective Action Required
To align with the MASTER_EXECUTION_PLAN.md, I will rewrite PHASE4_IMPLEMENTATION_PLAN.md with:
1. Exact MEP file structure (flat server/, (account) route group).
2. All missing files (loyalty/page.tsx, i18n/config.ts, sw.ts, etc.).
3. Validation gate test plans explicitly tied to MEP requirements.
4. Dependency installation steps (next-intl, @ducanh2912/next-pwa).
5. Clarified TDD file paths (e.g., src/server/loyalty.service.test.ts).
Before I implement these corrections, I need your validation on the following:
- Should the loyalty service reside in src/server/loyalty.service.ts (MEP) or src/server/services/loyalty.service.ts (current plan)?
- Do you approve adding next-intl as a dependency for i18n?
- Are the 4 validation gates (RTL, PWA, Sustainability, Atomicity) the correct scope, or do you want additional constraints?

---

 node /home/project/LuxeVerse/gen-plan.js && rm /home/project/LuxeVerse/gen-plan.js
Updated PHASE4_IMPLEMENTATION_PLAN.md successfully.
I will now verify the corrected PHASE4_IMPLEMENTATION_PLAN.md against the MASTER_EXECUTION_PLAN.md and skills/luxeverse-architect-skill/SKILL.md. I will read the corrected file and perform a systematic validation to ensure all MEP-mandated files are present and that the SKILL.md guardrails are met.
I will perform this validation now, reporting
→ Read PHASE4_IMPLEMENTATION_PLAN.md 
I've meticulously reviewed the corrected PHASE4_IMPLEMENTATION_PLAN.md against both MASTER_EXECUTION_PLAN.md and skills/luxeverse-architect-skill/SKILL.md. I have identified several critical misalignments and anti-patterns that violate our architectural standards.
My systematic validation reveals the following:
1. Critical Misalignments with MEP
- File Path Mismatch: MEP specifies src/server/loyalty.service.ts and src/app/(account)/page.tsx. The corrected plan incorrectly uses src/app/account/page.tsx and fails to align with the MEP's flat structure convention.
- Missing MEP-Mandated Files: The plan omits several key files explicitly required in the MEP's "File Matrix," including src/i18n/config.ts, public/manifest.json, and src/sw.ts. These are defined as deliverables in the MEP but are missing from the implementation plan.
- Tier Thresholds Not Defined: While the MEP defines valid tiers (BRONZE | SILVER | GOLD | PLATINUM), the implementation plan lacks the specific logic for tier upgrades, making the 'tier upgrades' test plan unverifiable.
2. SKILL.md Guardrail Violations
- Incorrect Service Architecture: The plan states src/server/services/loyalty.service.ts, which contradicts our SKILL.md rule of using a flat structure src/server/loyalty.service.ts. This avoids arbitrary nesting and maintains factory patterns.
- Missing Quality Gates: The MEP mandates specific validation gates for Phase 4, such as verifying RTL layouts via CSS logical properties and ensuring PWA install prompts respect user dismissal. These critical security and functionality checkpoints are absent from the corrected plan's quality gates.
- Zustand Persistence Rule: The plan instructs to use Zustand for user data in the Account Hub but completely misses the SKILL.md rule that UI state must NOT be persisted. Only domain data should be in partialize.
3. Schema & Prisma Deficiencies
- sustainabilityScore Missing: While the plan mentions adding sustainabilityScore to the Product model, it doesn't exist in the current schema. This is a necessary prerequisite for Phase 4.5 but is not listed as a dependency.
- Missing pnpm db:generate Reminder: Any Prisma schema change requires a command to regenerate the client. The plan fails to mention this, risking TS2339 or TS2322 errors during the build.
Required Actions
To ensure full compliance, the PHASE4_IMPLEMENTATION_PLAN.md must be updated to:
1. Correct all file paths to align with the MEP's flat structure (e.g., src/server/loyalty.service.ts, src/app/(account)/page.tsx).
2. Add all MEP-mandated files that are currently missing.
3. Include the MEP-specified validation gates (RTL, PWA prompt, atomicity) in the quality gates.
4. Define tier threshold logic and currency for redemption to make tests verifiable.
5. Add a pnpm db:generate reminder for all Prisma schema changes.
6. Clarify Zustand partialize rules for the Account Hub.

---

I have meticulously applied all corrections to PHASE4_IMPLEMENTATION_PLAN.md and verified its alignment with MASTER_EXECUTION_PLAN.md and skills/luxeverse-architect-skill/SKILL.md.
Summary of Corrections Applied
I have fixed all identified misalignments and SKILL.md violations. Here is the final validation report:
#	Correction	Status
1	Tier Thresholds Added	✅ Defined BRONZE: 0, SILVER: 1000, GOLD: 5000, PLATINUM: 10000 in Phase 4.1 Implementation
2	pnpm db:generate Reminders	✅ Added to all schema-changing sub-phases (4.1, 4.4, 4.5)
3	PWA Dependency Fixed	✅ Changed next-pwa → @ducanh2912/next-pwa (MEP mandate)
4	MEP Validation Gates Added	✅ New section: RTL Layout, PWA Prompt, Sustainability, Atomic Redemption
5	SKILL.md Discipline Rules Added	✅ New section: No any, No enum, Zustand Selectors, Prisma Sync
6	Zustand partialize Rule Added	✅ Added to Phase 4.6: UI state (isOpen, isLoading) MUST be excluded
7	RTL Support Mentioned	✅ Added CSS logical properties requirement to Phase 4.2
8	(account) Route Group Consistent	✅ Verified src/app/(account)/page.tsx is present
Alignment Verification
vs. MASTER_EXECUTION_PLAN.md
- File Paths: All paths now match the MEP flat structure (e.g., src/server/loyalty.service.ts, src/app/loyalty/page.tsx).
- Missing Files: src/i18n/config.ts, public/manifest.json, src/sw.ts are now explicitly required.
- Validation Gates: All 4 MEP Phase 4 gates are now explicitly listed in the Quality Gates section.
vs. skills/luxeverse-architect-skill/SKILL.md
- any / enum / namespace: Explicitly banned in the new SKILL.md Discipline section.
- Zustand Selectors: Explicitly mandated; .getState() in JSX is banned.
- Prisma Schema Sync: pnpm db:generate reminder is now in every schema-changing sub-phase and the Quality Gates.
- Tailwind v4 / use client: Already present in the original plan; no changes needed.
The corrected PHASE4_IMPLEMENTATION_PLAN.md is now fully aligned with both the MEP and the SKILL.md. Ready for execution.

---

Phase 4 Execution ToDo List
Objective: Execute all 6 sub-phases (4.1–4.6) of the PHASE4_IMPLEMENTATION_PLAN.md using strict TDD (tests first), following the MEP flat structure, and enforcing all SKILL.md guardrails.
---
Sub-Phase 4.1: Loyalty & Rewards Engine
Task 4.1.1: Write Failing Tests
- [ ] Create src/server/loyalty.service.test.ts
  - [ ] Test: calculatePoints returns correct points for a given order total and tier multiplier
  - [ ] Test: addPoints increases loyaltyPoints and lifetimePoints on the User model
  - [ ] Test: redeemPoints decreases loyaltyPoints and creates a PointHistory record with type REDEEMED
  - [ ] Test: getHistory returns a list of PointHistory records for a user
  - [ ] Test: adjustPoints correctly updates points via admin/manual override
  - [ ] Test: Atomicity: If addPoints fails mid-transaction, the User model is not updated (uses Prisma $transaction)
  - [ ] Test: Tier Upgrades: When lifetimePoints crosses SILVER (1000), GOLD (5000), or PLATINUM (10000) threshold, the tier field is updated correctly
  - [ ] Test: Order Cancellation: Calling reverseTransaction on an cancelled order correctly subtracts earned points
- [ ] Run pnpm test — confirm all new tests fail (RED)
Task 4.1.2: Implement Service Layer
- [ ] Create src/server/loyalty.service.ts
  - [ ] Define tier thresholds constant: BRONZE: 0, SILVER: 1000, GOLD: 5000, PLATINUM: 10000
  - [ ] Implement createLoyaltyService() factory
  - [ ] Implement calculatePoints(total, tier): Returns points based on order total and tier multiplier
  - [ ] Implement addPoints(userId, orderId, points): Wraps User update + PointHistory creation in prisma.$transaction
  - [ ] Implement redeemPoints(userId, points): Decreases loyaltyPoints, creates PointHistory record
  - [ ] Implement getHistory(userId): Fetches ordered PointHistory list
  - [ ] Implement adjustPoints(userId, amount, description): Manual adjustment for admin
  - [ ] Implement reverseTransaction(orderId): Reverses earned points for a cancelled order
  - [ ] Ensure zero any types — use Prisma.UserGetPayload / Prisma.OrderGetPayload
- [ ] Run pnpm test — confirm all tests pass (GREEN)
Task 4.1.3: Implement tRPC Router
- [ ] Create src/server/routers/loyalty.ts
  - [ ] Define input schemas using Zod v4 (result.error.issues[0].message API)
  - [ ] Implement loyalty.getHistory procedure
  - [ ] Implement loyalty.redeemPoints mutation
  - [ ] Implement loyalty.addPoints mutation
- [ ] Register loyalty router in src/server/index.ts
Task 4.1.4: Implement Frontend Components
- [ ] Create src/app/loyalty/page.tsx (MEP-mandated page)
- [ ] Create src/components/loyalty/LoyaltyDashboard.tsx
  - [ ] Displays current tier, loyaltyPoints, lifetimePoints
  - [ ] Shows progress to next tier
- [ ] Create src/components/loyalty/PointsHistory.tsx
  - [ ] Lists PointHistory records with date, type, amount, description
- [ ] Create src/components/loyalty/RedeemPointsButton.tsx
  - [ ] Uses useActionState for form submission
  - [ ] Validates redeemable points > 0 before enabling
  - [ ] Calls trpc.loyalty.redeemPoints.useMutation()
Task 4.1.5: Validation & Quality Gates
- [ ] Run pnpm db:generate (Prisma schema sync)
- [ ] Run pnpm typecheck — zero errors
- [ ] Run pnpm lint — all checks pass
- [ ] Run pnpm test — coverage > 80%
- [ ] Run pnpm build — production build succeeds
---
Sub-Phase 4.2: Multi-language Support (i18n)
Task 4.2.1: Write Failing Tests
- [ ] Create test file src/i18n/i18n.test.ts (or equivalent)
  - [ ] Test: Changing locale to fr renders French text
  - [ ] Test: Visiting /fr/shop renders content in French
  - [ ] Test: Currency formatting respects locale (e.g., € vs $)
- [ ] Run pnpm test — confirm all new tests fail (RED)
Task 4.2.2: Install & Configure i18n
- [ ] Install next-intl package
  - [ ] Run pnpm add next-intl
- [ ] Create src/i18n/config.ts
  - [ ] Export defaultLocale (e.g., 'en')
  - [ ] Export locales array (e.g., ['en', 'fr'])
- [ ] Create translation files
  - [ ] messages/en.json
  - [ ] messages/fr.json (or target language)
- [ ] Update src/app/layout.tsx
  - [ ] Remove hardcoded lang="en"
  - [ ] Wrap with NextIntlClientProvider
  - [ ] Dynamically set <html lang={locale}> based on detected/prefixed locale
Task 4.2.3: Implement Locale Routing
- [ ] Create src/middleware.ts
  - [ ] Detect locale from Accept-Language header or URL prefix
  - [ ] Redirect to /[locale]/... if locale is missing
  - [ ] Ensure defaultLocale is used if no match
- [ ] Update all internal links to use locale-prefixed paths
Task 4.2.4: Implement RTL Support
- [ ] Audit globals.css
  - [ ] Replace directional properties with logical properties:
    - margin-left / margin-right → margin-inline-start / margin-inline-end
    - text-align: left / text-align: right → text-align: start
    - border-left / border-right → border-inline-start / border-inline-end
- [ ] Create __tests__/rtl.test.tsx to verify layout direction changes
Task 4.2.5: Validation & Quality Gates
- [ ] Run pnpm typecheck — zero errors
- [ ] Run pnpm lint — all checks pass
- [ ] Run pnpm test — all new i18n tests pass
- [ ] Run pnpm build — production build succeeds
- [ ] MEP Gate: Verify /fr/shop renders French content correctly
---
Sub-Phase 4.3: Progressive Web App (PWA)
Task 4.3.1: Write Failing Tests
- [ ] Create test file test/pwa.test.ts
  - [ ] Test: GET /manifest.json returns 200 with valid JSON
  - [ ] Test: Service worker file (/sw.js or equivalent) is served correctly
  - [ ] Test: Static assets (CSS, JS) have cache headers
- [ ] Run pnpm test — confirm all new tests fail (RED)
Task 4.3.2: Install & Configure PWA
- [ ] Install @ducanh2912/next-pwa (MEP-mandated package)
  - [ ] Run pnpm add @ducanh2912/next-pwa
- [ ] Update next.config.ts
  - [ ] Wrap nextConfig export with withPWA HOC
  - [ ] Configure pwa.dest = 'public'
- [ ] Create public/manifest.json
  - [ ] Add name, short_name, start_url, display, theme_color, background_color
  - [ ] Add icon paths for 192x192 and 512x512
- [ ] Create src/sw.ts (or configure workbox)
  - [ ] Define cache strategies:
    - Assets → Cache First
    - API → Network First
    - Images → Stale-While-Revalidate
Task 4.3.3: Add PWA Assets
- [ ] Create public/icon-192x192.png
- [ ] Create public/icon-512x512.png
- [ ] Verify src/app/layout.tsx registers the service worker
  - [ ] Check for navigator.serviceWorker.register('/sw.js') call
Task 4.3.4: Validation & Quality Gates
- [ ] Run pnpm test — confirm all PWA tests pass (GREEN)
- [ ] Run pnpm build — ensure next-pwa generates sw.js
- [ ] MEP Gate: Verify PWA install prompt works and is dismissible
- [ ] MEP Gate: Verify offline fallback page is functional (disconnect network)
---
Sub-Phase 4.4: User-Generated Content (UGC)
Task 4.4.1: Write Failing Tests
- [ ] Create src/server/routers/ugc.test.ts
  - [ ] Test: ugc.create mutation stores image metadata in DB
  - [ ] Test: ugc.list returns UGC linked to a specific user
  - [ ] Test: ugc.moderate changes status to APPROVED or REJECTED
- [ ] Run pnpm test — confirm all new tests fail (RED)
Task 4.4.2: Update Prisma Schema
- [ ] Add UGCContent model to prisma/schema.prisma
  - [ ] Fields: id, userId, type (e.g., REVIEW, PHOTO), url, caption, status (e.g., PENDING, APPROVED, REJECTED), createdAt
- [ ] Run pnpm db:generate
Task 4.4.3: Implement tRPC Router
- [ ] Create src/server/routers/ugc.ts
  - [ ] Implement ugc.create (mutation)
  - [ ] Implement ugc.list (query)
  - [ ] Implement ugc.moderate (mutation for admin)
- [ ] Register in src/server/index.ts
Task 4.4.4: Implement Frontend Components
- [ ] Create src/components/social/UGCGallery.tsx (MEP-mandated)
  - [ ] Displays grid of approved UGC items
  - [ ] Shows Instagram sync badge, product tagging, and Shop This Look overlay
- [ ] Create src/components/social/UGCUploadForm.tsx
  - [ ] Uses useActionState + Zod v4 validation
  - [ ] Handles file upload (mock or real storage integration)
Task 4.4.5: Validation & Quality Gates
- [ ] Run pnpm db:generate
- [ ] Run pnpm typecheck — zero errors
- [ ] Run pnpm lint — all checks pass
- [ ] Run pnpm test — coverage > 80%
- [ ] Run pnpm build — production build succeeds
---
Sub-Phase 4.5: Sustainability Tracking & Transparency
Task 4.5.1: Write Failing Tests
- [ ] Create src/server/services/product.service.test.ts (add new tests)
  - [ ] Test: getProductById returns sustainabilityScore
  - [ ] Test: sustainabilityScore is between 0 and 100
- [ ] Run pnpm test — confirm all new tests fail (RED)
Task 4.5.2: Update Prisma Schema
- [ ] Add sustainabilityScore field to Product model
  - [ ] Type: Int, default: 0
- [ ] Run pnpm db:generate
Task 4.5.3: Update Backend Service
- [ ] Update src/server/services/product.service.ts
  - [ ] Add sustainabilityScore to product queries and DTOs
  - [ ] Ensure Prisma.ProductGetPayload is used for typing
Task 4.5.4: Implement Frontend Components
- [ ] Create src/components/sustainability/Scorecard.tsx (MEP-mandated)
  - [ ] Circular score visualization
  - [ ] Breakdown bars for material/production data
  - [ ] Certification badges
  - [ ] Carbon offset toggle
- [ ] Update src/components/product/ProductCard.tsx
  - [ ] Display sustainabilityScore badge
- [ ] Update src/app/shop/[category]/[slug]/page.tsx (PDP)
  - [ ] Render <Scorecard /> component with product data
Task 4.5.5: Validation & Quality Gates
- [ ] Run pnpm typecheck — zero errors
- [ ] Run pnpm lint — all checks pass
- [ ] Run pnpm test — all new tests pass
- [ ] Run pnpm build — production build succeeds
- [ ] MEP Gate: Sustainability score is sourced from schema, not hardcoded
---
Sub-Phase 4.6: Account Hub & Dashboard
Task 4.6.1: Write Failing Tests
- [ ] Create src/app/(account)/page.test.tsx
  - [ ] Test: Authenticated user sees their name, tier, and points
  - [ ] Test: Order history is displayed
  - [ ] Test: Profile update form works
- [ ] Run pnpm test — confirm all new tests fail (RED)
Task 4.6.2: Implement Route Group & Page
- [ ] Create src/app/(account)/page.tsx (MEP-mandated route group)
  - [ ] Implement generateMetadata for SEO
  - [ ] Fetch user data server-side (RSC)
- [ ] Create src/app/(account)/layout.tsx
  - [ ] Shared layout for account pages
Task 4.6.3: Implement Components
- [ ] Create src/components/account/AccountOverview.tsx
  - [ ] Displays user profile, tier, points
- [ ] Create src/components/account/OrderHistory.tsx
  - [ ] Lists orders with status, total, and earned points
- [ ] Create src/components/account/ProfileSettings.tsx
  - [ ] Form for updating name, email, password
  - [ ] Uses useActionState + Zod v4
Task 4.6.4: Implement Zustand Store
- [ ] Create / update src/stores/account.ts
  - [ ] Store: user data, orders list
  - [ ] CRITICAL: partialize MUST EXCLUDE UI state (isOpen, isLoading)
  - [ ] Use useAccountStore((s) => s.user) selector in JSX
Task 4.6.5: Validation & Quality Gates
- [ ] Run pnpm typecheck — zero errors
- [ ] Run pnpm lint — all checks pass
- [ ] Run pnpm test — coverage > 80%
- [ ] Run pnpm build — production build succeeds
---
Final Phase-Wide Validation & Deliverables
Task 4.7.1: End-to-End Integration Tests
- [ ] Create e2e/phase4.spec.ts (or extend existing Playwright spec)
  - [ ] Full loyalty flow: Place order → earn points → view history → redeem points
  - [ ] Full i18n flow: Switch to French → navigate pages → verify text
  - [ ] Full PWA flow: Install app → go offline → verify static assets load
Task 4.7.2: Final Quality Gates
- [ ] Run pnpm typecheck — zero errors across all sub-phases
- [ ] Run pnpm lint — zero lint errors
- [ ] Run pnpm test — 100% pass rate (zero test.skip())
- [ ] Run pnpm build — production build succeeds
- [ ] Lighthouse Audit: LCP < 2.5s, CLS < 0.1, A11y >= 95
Task 4.7.3: Documentation & Handoff
- [ ] Update AGENTS.md with any new Phase 4 conventions
- [ ] Update ACCOMPLISHMENTS.md with Phase 4 completion log
- [ ] Verify all new files have inline documentation (jsdoc)
---
Execution Priority & Dependencies
Order	Sub-Phase	Priority	Blockers	Key Dependency
1	4.1 Loyalty Engine	P0 (Critical)	None	Prisma schema (existing)
2	4.5 Sustainability	P0 (Critical)	None	Prisma schema update
3	4.6 Account Hub	P1 (High)	4.1, 4.5	Loyalty + Sustainability data
4	4.2 i18n	P1 (High)	None	next-intl package
5	4.3 PWA	P2 (Medium)	None	PWA assets (icons)
6	4.4 UGC	P2 (Medium)	4.6	User authentication
Recommended Execution Order: 4.1 → 4.5 → 4.6 → 4.2 → 4.3 → 4.4
This sequential order ensures that the Account Hub (4.6) can display real loyalty and sustainability data, and that UGC (4.4) is built on top of a stable user system. 

