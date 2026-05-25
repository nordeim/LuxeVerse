# Phase 4 Remediation Plan & MEP Alignment Report

## Executive Summary

Following a meticulous review of `status_9.md`, `PHASE4_IMPLEMENTATION_PLAN.md`, `MASTER_EXECUTION_PLAN.md`, and the current codebase, I have identified a series of inconsistencies, architectural risks, and quality misalignments that require immediate remediation before Phase 4 can be considered production-ready.

**Current Codebase Status (as of `status_9.md`):**
- All 86 tests passing (48 from Phase 3 + 38 new)
- `typecheck`, `lint`, and `build` passing
- Core Phase 4 infrastructure (i18n, PWA, loyalty) partially implemented but misaligned with the MEP

**Remediation Status:** 8 Critical items identified. 7 require code changes. 1 requires documentation update.

---

## Remediation Matrix

| # | Gap/Issue | Severity | MEP Section | Status | Fix Plan |
|---|-----------|----------|-------------|--------|----------|
| 1 | **Next.js 16 `params` Anti-Pattern** | 🔴 Critical | §4.1, Gotcha #2 | **Unfixed** | Update `page.tsx` to use direct destructuring; update `AGENTS.md` Gotcha #2 to reflect layout vs page duality |
| 2 | **Loyalty Router Incomplete** | 🔴 Critical | §4.1 | **Unfixed** | Add `addPoints`, `reverseTransaction`, `adjustPoints` to `loyalty.ts` router |
| 3 | **`reverseTransaction` Idempotency Bug** | 🟠 High | §4.1 (Atomicity) | **Unverified** | Audit existing `reverseTransaction` to reset `order.pointsEarned = 0` inside `$transaction` block |
| 4 | **i18n `dir` Hardcoding** | 🟠 High | §4.2 (RTL) | **Fixed** | `layout.tsx` uses `dir={isRTL(locale) ? "rtl" : "ltr"}` — verify this is committed |
| 5 | **PWA `sw.ts` vs Turbopack Conflict** | 🟠 High | §4.3 (PWA) | **Unfixed** | Verify `next-pwa` is using auto-generated SW mode; remove custom `sw.ts` if causing build failures; document `--webpack` flag requirement |
| 6 | **`LanguageSwitcher` Uses `window.location.href`** | 🟡 Medium | §4.4 (i18n) | **Unfixed** | Replace with `useRouter().push()` to preserve SPA state |
| 7 | **Account Page Hardcodes `locale` in Redirect** | 🟡 Medium | §4.4 (i18n) | **Unfixed** | Use current locale from `useParams()` instead of `defaultLocale` or remove hardcoded `/${defaultLocale}` prefix |
| 8 | **`status_9.md` Mentions Skill.md v3.4.0** | 🟡 Medium | Documentation | **Unfixed** | Verify `SKILL.md` at `skills/luxeverse-architect-skill/SKILL.md` exists and contains v3.4.0 Phase 4 lessons |

---

## Detailed Remediation Plan

### 1. Next.js 16 `params` Anti-Pattern (CRITICAL)

**Context:** `status_9.md` states: "Separate Next.js 16 params behavior: layouts use `Promise<...>`, pages use plain objects for direct destructuring (async pages still use await)."

**Audit Findings:**
- `src/app/[locale]/layout.tsx` correctly uses `const { locale } = await params;` (layout)
- `src/app/[locale]/page.tsx` incorrectly uses `const { locale } = await params;` (page)

**Required Fix:**
```tsx
// src/app/[locale]/page.tsx — BEFORE (WRONG)
export default async function HomePage({ params }: HomePageProps) {
  const { locale } = await params; // ❌ WRONG for pages in Next.js 16

// src/app/[locale]/page.tsx — AFTER (CORRECT)
export default function HomePage({ params }: HomePageProps) {
  const { locale } = params; // ✅ CORRECT for pages in Next.js 16
```

**AGENTS.md Update Required:**
Gotcha #2 currently states: "Pages (`page.tsx`): `params` is a plain object. Use direct destructuring."
This is contradictory with `status_9.md`'s note: "async pages still use await."

**Clarification:** In Next.js 16, `params` for pages is typed as `Promise<...>` but is already resolved at runtime. The correct pattern is direct destructuring without `await`. The types lie. Update AGENTS.md to remove the `await` from the page example and add a clear note about this discrepancy.

---

### 2. Loyalty Router Incomplete (CRITICAL)

**Context:** `loyalty.ts` router only exposes `getHistory`, `getBalance`, and `redeemPoints`.

**MEP Requirements (§4.1):**
- `createLoyaltyService()` has: `calculatePoints`, `addPoints`, `redeemPoints`, `getHistory`, `adjustPoints`, `reverseTransaction`
- Router must expose all of these to the client

**Required Fix:** Add `addPoints` (or an `earnPoints` mutation triggered by order completion), `reverseTransaction` (for order cancellation), and `adjustPoints` (for admin overrides) to the tRPC router.

```ts
// src/server/routers/loyalty.ts — ADDITIONS NEEDED
export const loyaltyRouter = router({
  // ... existing getHistory, getBalance, redeemPoints ...

  addPoints: protectedProcedure
    .input(z.object({ userId: z.string(), orderId: z.string(), points: z.number().min(1) }))
    .mutation(async ({ input }) => {
      const service = createLoyaltyService(prisma);
      return service.addPoints(input.userId, input.orderId, input.points);
    }),

  reverseTransaction: protectedProcedure
    .input(z.object({ orderId: z.string() }))
    .mutation(async ({ input }) => {
      const service = createLoyaltyService(prisma);
      return service.reverseTransaction(input.orderId);
    }),

  adjustPoints: protectedProcedure
    .input(z.object({ userId: z.string(), amount: z.number(), description: z.string() }))
    .mutation(async ({ input }) => {
      const service = createLoyaltyService(prisma);
      return service.adjustPoints(input.userId, input.amount, input.description);
    }),
});
```

---

### 3. `reverseTransaction` Idempotency Bug (HIGH)

**Context:** `status_9.md` claims: "Verified `reverseTransaction` resets `order.pointsEarned = 0` inside `$transaction` and added test coverage."

**Audit Required:** Verify that `reverseTransaction` in `src/server/loyalty.service.ts`:
1. Wraps the entire operation in `prisma.$transaction`
2. Calls `await tx.order.update({ where: { id: orderId }, data: { pointsEarned: 0 } })` BEFORE returning
3. Has a test case that asserts `order.update` was called with `pointsEarned: 0`

If any of these are missing, the bug is not actually fixed and double-reversal is possible.

---

### 4. i18n `dir` Hardcoding (FIXED — VERIFY)

**Context:** `status_9.md` claims: "Fixed `src/app/[locale]/layout.tsx` to use `dir={isRTL(locale) ? 'rtl' : 'ltr'}`"

**Audit Required:** Verify the committed file at `src/app/[locale]/layout.tsx` contains:
```tsx
<html lang={locale} dir={isRTL(locale) ? "rtl" : "ltr"}>
```
If `dir="ltr"` is hardcoded, the fix is not in place.

---

### 5. PWA `sw.ts` vs Turbopack Conflict (HIGH)

**Context:** `status_9.md` states: "Force webpack for PWA builds (`--webpack` flag) due to next-pwa's `workbox-webpack-plugin` incompatibility with Turbopack."

**Audit Required:** Verify the following are true:
1. `next.config.ts` uses `withPWA` WITHOUT `swSrc` (auto-generated SW mode)
2. `src/sw.ts` does NOT exist OR is not referenced by `withPWA`
3. The build command is documented to use `next build --webpack` (or a script)
4. `public/sw.js` and `public/workbox-*.js` are generated after build and contain valid workbox code

If `sw.ts` exists and is being used, it will cause build failures with Turbopack and must be removed.

---

### 6. `LanguageSwitcher` Uses `window.location.href` (MEDIUM)

**Context:** `status_9.md` states: "LanguageSwitcher must use `useRouter().push()`, not `window.location.href`, to preserve SPA state."

**Audit Required:** Check `src/components/shared/LanguageSwitcher.tsx`. If it uses `window.location.href = newPathname`, replace with:

```tsx
import { useRouter } from "next/navigation";

const router = useRouter();

// In handleChange:
router.push(newPathname);
```

---

### 7. Account Page Hardcodes `locale` in Redirect (MEDIUM)

**Context:** `src/app/[locale]/account/page.tsx` uses `redirect(\`/${defaultLocale}/login?...\`)`.

**Issue:** If a user is on `/fr/account`, being redirected to `/en/login` breaks the i18n experience.

**Required Fix:** Use the current locale from `useParams()` or the Next.js router, or simply redirect to `/login` and let the middleware handle locale prefixing.

```tsx
// BEFORE
redirect(`/${defaultLocale}/login?callbackUrl=/account`);

// AFTER (Option 1: Use current locale)
const { locale } = useParams<{ locale: string }>();
redirect(`/${locale}/login?callbackUrl=/${locale}/account`);

// AFTER (Option 2: Let middleware handle it)
redirect(`/login?callbackUrl=/account`);
```

---

### 8. `SKILL.md` v3.4.0 Verification (MEDIUM)

**Context:** `status_9.md` references: `skills/luxeverse-architect-skill/SKILL.md: Updated comprehensive architectural skill v3.4.0.`

**Audit Required:** Verify the file exists and contains:
- Next.js 16 `params` duality for layouts vs pages (with correct page behavior)
- `next-pwa` + Turbopack conflict and `--webpack` flag workaround
- `superjson` requirement for tRPC + Prisma Date serialization
- i18n `dir` dynamic via `isRTL(locale)`
- `reverseTransaction` idempotency via `order.pointsEarned = 0` reset
- `LanguageSwitcher` must use `useRouter().push()`

If any of these are missing, the skill is incomplete.

---

## Immediate Action Items

1. [ ] **Fix `page.tsx` `params` usage** — Remove `await` from `params` in all page components (not layout components)
2. [ ] **Update `loyalty.ts` router** — Add `addPoints`, `reverseTransaction`, `adjustPoints` mutations
3. [ ] **Audit `reverseTransaction`** — Verify idempotency fix is committed; add `deepest: 0` audit log if not
4. [ ] **Verify `layout.tsx` `dir`** — Check `isRTL` dynamic logic is in the committed file
5. [ ] **Audit PWA setup** — Ensure `sw.ts` is not causing Turbopack conflicts; document build flag
6. [ ] **Fix `LanguageSwitcher`** — Replace `window.location.href` with `router.push()`
7. [ ] **Fix Account redirect** — Use current locale or let middleware handle it
8. [ ] **Update `SKILL.md`** — Verify v3.4.0 contains all Phase 4 lessons learned
9. [ ] **Update `AGENTS.md` Gotcha #2** — Clarify page `params` behavior (no `await`)
10. [ ] **Run full verification** — `pnpm typecheck && pnpm lint && pnpm test && pnpm build`

---

## Conclusion

The Phase 4 implementation is structurally sound but contains critical misalignments with the MEP and the AGENTS.md discipline, particularly around Next.js 16 `params` behavior and tRPC router completeness. The `reverseTransaction` idempotency claim requires verification. The i18n `dir` fix, if truly committed, is a positive step, but the `LanguageSwitcher` and account redirect issues suggest the i18n integration is not yet fully compliant with the "no hardcoded locale" rule.

**Recommendation:** Do not proceed to Phase 5 until all 8 remediation items are resolved and verification passes.
