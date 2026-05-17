# Phase 0 Remediation Plan

## Executive Summary

**Source**: Validated findings from `phase-0_audit.md` × MEP × `CLAUDE.md` × codebase  
**Confirmed bugs/gaps**: 17 issues (5 Critical + 9 High + 3 Medium/Low)  
**Estimated effort**: ~2.5 hours focused work  
**Pre-requisite**: Step 1 must complete first (unblocks TypeScript tooling for all other steps)  

---

## Dependencies & Execution Order

```
STEP 1 ──▶ Foundation Unblock (15 min)
   │         • turbo.json (L-2)
   │         • .gitignore (P1-2)
   │         • tsconfig/next.json (P1-1)
   │         • .env.example (L-1)
   │         • Prettier config (L-3)
   │    └──── triggers: all build/validation tooling
   │
STEP 2 ──▶ TypeScript Safety (15 min)
   │         • Upgrade TS ^6.0.0 (P2-4)
   │         • Fix deps in utils pkg (P0-4)
   │         • Fix QuickAddButton type (P1-4)
   │         • Fix PriceDisplay assertion (P1-5)
   │    └──── triggers: pnpm typecheck must pass 0 errors
   │
STEP 3 ──▶ Tailwind & Design System (20 min)
   │         • flex-shrink-0 → shrink-0 (P0-1)
   │         • Add slide-up keyframes (P0-2)
   │         • Define scrollbar-hide (P0-3)
   │         • Restrict image domains (P1-3)
   │         • Move arbitrary values → tokens (P2-1)
   │    └──── triggers: visual regression check
   │
STEP 4 ──▶ Component Hardening (25 min)
   │         • Inline SVGs → Lucide (P1-6)
   │         • Hardcoded $ → formatCurrency (P1-7)
   │         • README emojis (P2-2)
   │         • README TanStack Router (P2-3)
   │    └──── triggers: a11y audit, i18n check
   │
STEP 5 ──▶ Verification (10 min)
            • pnpm typecheck — 0 errors
            • pnpm lint — 0 warnings
            • pnpm test — 0 failures
            • pnpm build — succeeds
            • manual visual regression (pdp + cart + homepage)
```

---

## Step 1: Foundation Unblock (15 min)

### L-2: Fix `turbo.json` dependency graph
**Why**: `lint`, `test`, `typecheck` depend on `^build` — this forces sequential wait of 30–60s per build before lint/test can start. TypeScript checking and linting are fast and should run in parallel.

**File**: `turbo.json`

**Current**:
```json
{
  "lint": { "dependsOn": ["^build"] },
  "test": { "dependsOn": ["^build"] },
  "typecheck": { "dependsOn": ["^build"] }
}
```

**Target**:
```json
{
  "build": { "dependsOn": ["^build"], "outputs": [".next/**", "!/.next/cache/**", "dist/**"] },
  "lint": { "dependsOn": [] },
  "test": { "dependsOn": [] },
  "typecheck": { "dependsOn": [] },
  "test:e2e": { "dependsOn": ["build"] }
}
```

### P1-1: Fix unquoted JSON path in `tsconfig/next.json`
**Why**: `../../packages/ui/src/*` without quotes is silently accepted by `tsc` but JSON spec requires arrays of strings. Type-dependent toolchains may break.

**File**: `packages/config/tsconfig/next.json`

**Current**:
```json
"@ui/*": [../../packages/ui/src/*"]
```

**Target**:
```json
"@ui/*": ["../../packages/ui/src/*"]
```

### P1-2: Update `.gitignore`
**Why**: Missing entries allow committing build artifacts, env secrets, and incremental build cache.

**File**: `.gitignore` (root)

**Add**:
```
# Build artifacts
dist/
*.tsbuildinfo

# Environment (never commit)
.env.local
.env.*.local
```

### L-1: Create `.env.example`
**File**: `.env.example` (root, not ignored)

**Content**:
```env
# === DATABASE ===
DATABASE_URL="postgresql://user:pass@localhost:5432/luxeverse_dev"

# === NEXTAUTH ===
NEXTAUTH_SECRET="generate-with-openssl-rand-base64-32"
NEXTAUTH_URL="http://localhost:3000"
AUTH_SECRET="generate-with-openssl-rand-base64-32"

# === STRIPE ===
STRIPE_SECRET_KEY="sk_test_..."
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."

# === OPTIONAL (production) ===
# REDIS_URL="redis://localhost:6379"
```

### L-3: Add Prettier Config
**File**: `.prettierrc` (root)

```json
{
  "semi": true,
  "singleQuote": false,
  "tabWidth": 2,
  "trailingComma": "es5"
}
```

---

## Step 2: TypeScript Safety (15 min)

### P2-4: Upgrade TypeScript
**File**: `package.json` (root)

**Current**: `"typescript": "^5.9.3"`  
**Target**: `"typescript": "^6.0.0"`

**Follow-up**:
```bash
cd /home/project/LuxeVerse && pnpm install
```

### P0-4: Move `clsx` and `tailwind-merge` to `dependencies`
**Why**: `@luxeverse/ui` depends on `@luxeverse/utils` at runtime. Anything `ui` needs from `utils` at runtime must be in `dependencies`.

**File**: `packages/utils/package.json`

**Current**:
```json
"devDependencies": {
  "typescript": "^6.0.0",
  "clsx": "^2.1.0",
  "tailwind-merge": "^3.0.0"
}
```

**Target**:
```json
"dependencies": {
  "clsx": "^2.1.0",
  "tailwind-merge": "^3.0.0"
},
"devDependencies": {
  "typescript": "^6.0.0"
}
```

### P1-4: Fix `QuickAddButton.tsx` type assertion
**What**: `setOptimisticAdded(null as unknown as never)` is a type hole.

**File**: `apps/web/src/components/product/QuickAddButton.tsx`

**Current**:
```tsx
setOptimisticAdded(null as unknown as never);
```

**Target**:
```tsx
setOptimisticAdded(false);
```

### P1-5: Fix `PriceDisplay.tsx` non-null assertion
**What**: `compareAt!` suppresses TypeScript's null check.

**File**: `apps/web/src/components/product/PriceDisplay.tsx`

**Current**:
```tsx
{formatCurrency(compareAt!, currency)}
```

**Target**: Safe — `hasDiscount` already guards (`compareAt !== null && compareAt > current`) so `!` is unnecessary.
```tsx
{formatCurrency(compareAt, currency)}
```

---

## Step 3: Tailwind & Design System (20 min)

### P0-1: Replace `flex-shrink-0` → `shrink-0`
**Files**:
- `apps/web/src/components/cart/CartItem.tsx` line 36
- `apps/web/src/components/product/ProductGallery.tsx` line 47

Replace `flex-shrink-0` with `shrink-0` in both files.

### P0-2: Add `@keyframes slide-up`
**File**: `apps/web/src/app/globals.css`

**Add after `@theme inline` block**:
```css
@keyframes slide-up {
  from { transform: translateY(100%); opacity: 0; }
  to   { transform: translateY(0);     opacity: 1; }
}
```

### P0-3: Define `scrollbar-hide` utility
**File**: `apps/web/src/app/globals.css`

**Add**:
```css
@layer utilities {
  .scrollbar-hide {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
  .scrollbar-hide::-webkit-scrollbar {
    display: none;
  }
}
```

### P1-3: Restrict image domains in `next.config.ts`
**File**: `apps/web/next.config.ts`

**Current**:
```ts
images: {
  remotePatterns: [
    { protocol: "https", hostname: "**" },
  ],
}
```

**Target** (replace with known CDNs):
```ts
images: {
  remotePatterns: [
    { protocol: "https", hostname: "cdn.luxeverse.com" },
    { protocol: "https", hostname: "images.unsplash.com" },
    { protocol: "https", hostname: "**.vercel.app" },
  ],
}
```

### P2-1: Move arbitrary values → `@theme inline` tokens
**File**: `apps/web/src/app/globals.css`

**Add to `@theme inline`**:
```css
@theme inline {
  /* ... existing ... */
  --aspect-product: 3/4;
  --min-h-hero: 80vh;
  --min-w-btn-sm: 2.5rem;
}
```

**Replace in files**:
- `ProductCard.tsx`: `aspect-[3/4]` → `aspect-product`
- `page.tsx`: `min-h-[80vh]` → `min-h-hero`
- `StickyAddToBar.tsx`: `min-w-[2.5rem]` → `min-w-btn-sm`

---

## Step 4: Component Hardening (25 min)

### P1-6: Inline SVGs → Lucide icons
**File**: `apps/web/src/components/cart/CartDrawer.tsx`

**Import**:
```tsx
import { X, ShoppingBag } from "lucide-react";
```

**Replace close button SVG** (line 65–67):
```tsx
<X className="h-5 w-5" aria-hidden="true" />
```

**Replace empty state SVG** (line 76–78):
```tsx
<ShoppingBag className="h-16 w-16" aria-hidden="true" />
```

### P1-7: Replace hardcoded `$` with `formatCurrency`
**File**: `apps/web/src/components/product/ProductCard.tsx`

**Current**:
```tsx
<span>${(product.price / 100).toFixed(2)}</span>
...
<span className="...">${(product.compareAtPrice / 100).toFixed(2)}</span>
```

**Target**: Import `formatCurrency` from `@/lib/utils` and use it.

**Also**: `apps/web/src/components/cart/CartItem.tsx` — replace `$${item.total.toFixed(2)}` with `formatCurrency(item.total)`.

### P2-2: Remove emojis from `README.md`
Replace 🎬, 🤖, 🔐, ♿, ⚡, 🌍 with text labels (e.g., "Cinematic UI", "AI Stylist", etc.).

### P2-3: Remove TanStack Router reference
Delete or replace line 339 of `README.md`.

---

## Step 5: Final Verification (10 min)

Run the following and expect 0 errors / 0 warnings / all passes:

```bash
cd /home/project/LuxeVerse
pnpm install        # Pick up TS upgrade + dep move
pnpm typecheck       # tsc --noEmit → 0 errors
pnpm lint            # Next.js lint → 0 warnings
pnpm test            # Vitest → 0 failures
pnpm build           # Next.js build → succeeds
```

**Manual checks**:
- [ ] `grep "flex-shrink-0" apps/web/src/` returns nothing
- [ ] `grep "bg-gradient-to-\|outline-none\b" apps/web/src/` returns nothing
- [ ] `grep -rn "^export enum" apps/web/src/` returns nothing
- [ ] `grep -rn ": any" apps/web/src/` returns nothing
- [ ] Homepage `/` renders without horizontal scrollbar
- [ ] CartDrawer close button shows Lucide `X` icon
- [ ] ProductCard prices read `$1,234.56` (formatted, not raw `123456`)
- [ ] All `<Link href>` uses `next/link` (no `<a href="/..."`)

---

## Risk Assessment

| Risk | Probability | Impact | Mitigation |
|---|---|---|---|
| TS ^6.0 breaks existing `@types/react` peer dep | Medium | High | Pin `@types/react` to compatible range BEFORE install |
| Moving `clsx`/`tailwind-merge` breaks other consuming packages | Low | Medium | Test `pnpm test` after move; `ui` package imports via `utils` |
| Removing `^build` from turbo.json breaks test:e2e | Low | High | Leave `test:e2e` dependent on `build` (only it needs it) |
| Lucide `ShoppingBag` icon size differs from inline SVG | Low | Low | Check visually after swap; can adjust `className` size |
| `formatCurrency` needs import route adjustment | Low | Low | Verify `formatCurrency` is exported from `lib/utils.ts` |
