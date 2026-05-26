# LuxeVerse Architect Skill

## Comprehensive Architectural & Execution Framework for Cinematic, Production-Grade, Anti-Generic Web Platforms

**Version**: 4.1.0
**Date**: 2026-05-26
**Scope**: Phases 0–5 verified (Foundation, Core Commerce, Cinematic Experience, AI Integration, Scale & Social Remediation, Hardening & Production Data Integration)
**New Since v4.0.0**: 
- Next.js 15+ `cookies()` API returns `Promise<ReadonlyRequestCookies>` instead of synchronous object — causes TS2339 "Property 'get' does not exist"
- Server-side auth extraction for checkout actions using `getToken` + cookie header assembly (balances SSR compatibility with NextAuth v5)
- Prisma `Decimal` (PostgreSQL `@db.Decimal(10, 2)`) type conversion strategy (`Number()`) required in service layers
- Service factory pattern validated for RSC data flow (`createEditorialService()`, `createProductService()`)
- Sentry integration via dynamic import + fallback stub to avoid hard dependency on `@sentry/nextjs`
- Client Component data boundaries — real data vs. client state in `next/image` consumers
- Test mocking of `next/headers` `cookies()` and `next-auth/jwt` `getToken` in Vitest environment

**Source**: Distilled from Phase 5 Hardening (2026-05-26) — checkout auth binding, Prisma data integration, visual search API wiring, newsletter subscription, Sentry error tracking, and comprehensive TDD coverage.

**Triggers**: `build luxury e-commerce`, `cinematic UI architecture`, `Next.js 16 phased rollout`, `anti-generic design system`, `tRPC Zustand commerce`, `NextAuth v4 App Router tRPC`, `Prisma Decimal service pattern`, `RSC factory service`, `cookies() Promise Next.js 15`

---

## 0. Preface: What This Skill Is

This skill encodes every hard-won lesson, every corrected anti-pattern, and every validated architectural decision from the LuxeVerse project — a cinematic luxury e-commerce platform. **It is not a template. It is a field-tested execution manual forged from real implementation, real review cycles, and real corrections.**

Every section below was validated in battle. Skipping any section risks reproducing the exact same mistakes we caught and fixed.

---

## 1. The 6-Phase Execution Framework (Non-Negotiable)

Follow this exact sequence for every task. No code without plan alignment. No "done" without verification.

| Phase | Objective | Gate | Must Pass Before Proceeding |
|---|---|---|---|
| **ANALYZE** | Deep requirement mining, risk assessment, ambiguity identification | PRD/skill section read cover to cover. Existing code audited. Multiple approaches explored. | Never skip |
| **PLAN** | File matrix, success criteria, timeline, effort estimation | Explicit user sign-off. Confirmation question asked. | Gate: no code without documented plan |
| **VALIDATE** | Confirm alignment, address concerns, modify if needed | Documented approval. User explicitly confirms. | Gate: address all concerns |
| **IMPLEMENT** | Modular components, TDD, inline docs | Component tests pass before integration. No error patterns present. | Gate: zero console errors, all states handled |
| **VERIFY** | `tsc --noEmit`, a11y, perf, security | Axe-core ≥ 95, LCP < 2.5s, no critical audit, zero `test.skip` | Gate: all checks green |
| **DELIVER** | Handoff docs, runbook, next steps, knowledge transfer | Complete documentation. Nothing ambiguous. | Gate: future agent can onboard from docs alone |

---

## 2. Complete Architecture Blueprint

### 2.1 Monorepo Structure (Exact)
```
/
├── apps/
│   └── web/                          # Next.js 16 application (RSC-first)
│       ├── app/                      # App Router (RSC default, "use client" for islands)
│       │   ├── globals.css           # Tailwind v4 @theme inline (OKLCH, fluid type, golden ratio)
│       │   ├── layout.tsx            # Root layout: Providers, SkipLink, Navbar, Footer
│       │   ├── page.tsx              # Homepage
│       │   ├── (auth)/               # Auth route group
│       │   │   ├── login/page.tsx
│       │   │   └── register/page.tsx
│       │   ├── shop/
│       │   │   ├── loading.tsx       # ProductGridSkeleton
│       │   │   ├── page.tsx          # PLP (RSC)
│       │   │   └── [category]/[slug]/
│       │   │       └── page.tsx      # PDP (RSC, params as plain object)
│       │   ├── checkout/
│       │   │   └── page.tsx          # Multi-step checkout shell
│       │   ├── editorial/
│       │   │   └── page.tsx          # Editorial articles (RSC with Prisma service)
│       │   └── api/
│       │       └── trpc/
│       │           └── route.ts      # tRPC app handler
│       ├── components/
│       │   ├── layout/
│       │   │   ├── Navbar.tsx        # RSC (no "use client" — scroll via CSS only)
│       │   │   └── Footer.tsx        # RSC
│       │   ├── shared/
│       │   │   ├── SkipLink.tsx      # First child in <body>, focus-visible ring
│       │   │   └── ErrorBoundary.tsx # Client component for error catching
│       │   ├── product/
│       │   │   ├── ProductCard.tsx     # RSC (image + link + price display)
│       │   │   ├── ProductGallery.tsx  # "use client" — interactive carousel
│       │   │   ├── VariantSelector.tsx # "use client" — stateful size/color picker
│       │   │   ├── StickyAddToBar.tsx  # "use client" — IntersectionObserver
│       │   │   ├── QuickAddButton.tsx  # "use client" — optimistic add to cart
│       │   │   ├── PriceDisplay.tsx    # RSC (formatted price)
│       │   │   ├── ProductGridSkeleton.tsx
│       │   │   └── PDPSkeleton.tsx
│       │   ├── cart/
│       │   │   ├── CartDrawer.tsx      # "use client" — focus trap, ESC dismiss
│       │   │   ├── CartItem.tsx        # "use client" — optimistic quantity update
│       │   │   └── FreeShippingProgress.tsx
│       │   ├── auth/
│       │   │   ├── AuthForm.tsx        # "use client" — login/register toggle
│       │   │   └── ProtectedRoute.tsx  # "use client" — guards routes
│       │   └── checkout/
│       │       ├── ShippingStep.tsx   # "use client" — avoid race conditions (see §8)
│       │       ├── PaymentStep.tsx    # "use client" — Stripe PaymentElement
│       │       ├── ReviewStep.tsx     # "use client"
│       │       └── ConfirmationStep.tsx # "use client" — useRouter.push()
│       ├── hooks/
│       │   ├── useFocusTrap.ts        # Zero dependencies
│       │   └── useCart.ts             # Zustand selector hook
│       ├── lib/
│       │   ├── prisma.ts              # Singleton PrismaClient
│       │   ├── schemas.ts             # Zod v4 schemas (flat for FormData)
│       │   ├── auth.ts                # NextAuth v5 config (JWT, roles, bcrypt)
│       │   ├── sentry.ts              # Error tracking stub (see §14.16)
│       │   ├── crypto.ts              # @node-rs/bcrypt wrapper
│       │   └── utils.ts               # cn(), formatCurrency(), etc.
│       ├── server/
│       │   ├── trpc.ts                # createTRPCContext, createCaller
│       │   ├── context.ts             # Context builder (req, res, DB)
│       │   ├── index.ts               # App router
│       │   ├── routers/
│       │   │   ├── product.ts         # getBySlug, listByCategory, search
│       │   │   ├── cart.ts            # get, addItem, removeItem, updateQuantity
│       │   │   ├── visualSearch.ts    # AI visual search (base64 image)
│       │   │   ├── newsletter.ts      # Newsletter subscription tRPC router
│       │   │   ├── order.ts           # create, get by id, list for user
│       │   │   └── ...                # other routers
│       │   └── services/
│       │       ├── editorial.service.ts      # Factory: createEditorialService()
│       │       ├── featuredCollections.service.ts # Factory: createFeaturedCollectionsService()
│       │       ├── newArrivals.service.ts      # Factory: createNewArrivalsService()
│       │       ├── newsletter.service.ts     # Factory: createNewsletterService()
│       │       ├── product.service.ts        # Factory: createProductService()
│       │       └── cart.service.ts           # Factory: createCartService(), typed mapCart()
│       ├── stores/
│       │   ├── cart.ts                # Zustand: items[], isOpen, isLoading (partialize items ONLY)
│       │   └── auth.ts                # Zustand: ephemeral (NO persist), tracks auth status
│       ├── types/
│       │   └── index.ts               # UserRole, Product, CartItem, Order, etc. (not enums — unions)
│       ├── test/
│       │   ├── setup.ts               # rAF mock, crypto mock, vi globals
│       │   └── factories.ts           # getMockProduct(), getMockUser()
│       ├── trpc/
│       │   ├── provider.tsx           # TRPCProvider (React Query + tRPC)
│       │   ├── server.ts            # createCaller for RSC
│       │   └── index.ts             # createTRPCReact, utility type exports
│       ├── actions/
│       │   ├── checkout.actions.ts  # useActionState + Zod + Stripe (see §14.12 for auth)
│       │   └── auth.actions.ts      # useActionState + Zod + bcrypt
│       └── prisma/
│           └── schema.prisma          # ZERO enums, String for status/pricingType/orderStatus
├── packages/
│   ├── config/
│   │   ├── tsconfig/
│   │   │   ├── base.json              # strict, erasableSyntaxOnly, verbatimModuleSyntax
│   │   │   └── next.json              # extends base.json + next-specific
│   │   ├── eslint/
│   │   │   └── base.js                # Flat config: no-any, no-enum, no-namespace, no-console-except-error
│   │   └── tsconfig/package.json      # exports base.json as dependency
│   ├── ui/
│   │   ├── src/
│   │   │   ├── button.tsx             # CVA: default, outline, ghost, luxury
│   │   │   ├── input.tsx              # Label, error state, helperText, ARIA
│   │   │   ├── badge.tsx              # product, status, sustainability variants
│   │   │   ├── avatar.tsx             # Image + initials fallback, square/round
│   │   │   ├── skeleton.tsx           # aria-busy + pulse animation
│   │   │   └── index.ts               # Barrel export
│   │   ├── tsconfig.json              # MUST exist — extends ../config/tsconfig/base.json
│   │   └── package.json               # Side-effect free, shared deps
│   └── utils/
│       ├── src/
│       │   ├── cn.ts                  # clsx + tailwind-merge wrapper
│       │   └── index.ts               # Barrel export
│       └── package.json
├── .github/
│   └── workflows/
│       └── ci.yml                     # typecheck → lint → test → build
├── docs/
│   ├── architecture.md              # Monorepo, RSC/Client, data flow
│   ├── design-tokens.md             # Color, type, spacing, easing
│   ├── runbook.md                   # Commands, setup, common errors
│   └── phase-completion.md          # Current phase, checklist, next steps
├── scripts/
│   ├── validate-colors.sh           # Block raw hex in className
│   └── validate-deprecated-twind.sh # Block v3 utilities (bg-gradient-to-*, etc.)
├── turbo.json                       # Pipeline: typecheck → lint → test → build (cached)
├── pnpm-workspace.yaml              # App + packages
└── CLAUDE.md                        # Full project conventions (corollary to this skill)
```

---

## 3. Phase 5 Hardening: Server-Side Auth, Real Data & Service Factories

### 3.1 Server-Side Auth in Server Actions (NextAuth v5)

**Problem**: `getServerSession` is Pages Router-only. In App Router Server Actions, it throws `TypeError: Cannot read properties of undefined (reading 'headers')`.

**Solution**: Use `getToken` from `next-auth/jwt` + cookie header assembly

```typescript
"use server";
import { getToken } from "next-auth/jwt";
import { cookies } from "next/headers";
import { type NextRequest } from "next/server";

async function getUserFromSession() {
  const sessionToken = (await cookies()).get("next-auth.session-token")?.value;
  if (!sessionToken || !process.env.AUTH_SECRET) return null;

  const token = await getToken({
    req: {
      headers: { cookie: `next-auth.session-token=${sessionToken}` },
    } as unknown as NextRequest,
    secret: process.env.AUTH_SECRET,
  });

  if (token?.id && typeof token.id === "string") {
    return { id: token.id, email: (token.email as string) ?? "", role: (token.role as string) || "CUSTOMER" };
  }
  return null;
}
```

**Critical Gotchas**
| Issue | Root Cause | Fix |
|---|---|---|
| `Property 'get' does not exist on type Promise<ReadonlyRequestCookies>` | Next.js 15+ `cookies()` is async | `const cookieStore = await cookies();` |
| `Type 'NextRequest' is not assignable...` | `getToken` expects `req` with headers, not NextAuth's Pages Router type | Cast via `as unknown as NextRequest` |
| Hardcoded `userId: "user_mock_id"` | Forgotten mock data in server action | Extract from session or generate guest UUID |

---

### 3.2 Service Factory Pattern for Reproducible Data

**Problem**: Components hardcode mock data arrays instead of fetching from Prisma
**Solution**: `create*Service()` factory functions with typed `map*` helper, Decimal conversion

```typescript
// src/server/services/newArrivals.service.ts
import { prisma } from "@/lib/prisma";

export interface NewArrival { id: string; ... }

export function createNewArrivalsService() {
  return {
    async list() {
      const products = await prisma.product.findMany({
        where: { status: "ACTIVE", newArrival: true },
        orderBy: { createdAt: "desc" },
        take: 8,
        select: {
          id: true, slug: true, name: true, price: true, compareAtPrice: true,
          images: { where: { isPrimary: true }, select: { url: true }, take: 1 },
          category: { select: { name: true } },
          newArrival: true,
        },
      });
      // Map Decimal to number to avoid toJSON serialization issues
      return products.map(p => ({
        ...p,
        price: Number(p.price),
        compareAtPrice: p.compareAtPrice ? Number(p.compareAtPrice) : null,
        image: p.images[0]?.url ?? null,
        category: p.category.name,
      }));
    },
  };
}
```

**Key Insight**: Prisma `Decimal` (PostgreSQL `@db.Decimal(10, 2)`) serializes as string over JSON, breaking client-side math. Always convert to `Number()` in service layer.

---

### 3.3 RSC → Client Component Data Boundaries

```tsx
// src/components/sections/NewArrivals.tsx (Server Component)
import { createNewArrivalsService } from "@/server/services/newArrivals.service";
import { NewArrivalsClient } from "./NewArrivalsClient";

export async function NewArrivals() {
  const service = createNewArrivalsService();
  const products = await service.list(); // Fetches on server
  return <NewArrivalsClient products={products} />; // Passes to client
}
```

**Rationale**: RSC fetches data (zero client waterfall). Client Component receives data via props (handles scroll, interactivity). tRPC is for mutations, not initial page data.

---

### 3.4 Next.js 15+ `cookies()` API: `Promise<ReadonlyRequestCookies>`

| Next.js Version | API | Code |
|---|---|---|
| **Next.js 14** | `cookies()` returns `ReadonlyRequestCookies` | `cookies().get("key")` |
| **Next.js 15+** | `cookies()` returns `Promise<ReadonlyRequestCookies>` | `(await cookies()).get("key")` |

**Fix**: Always `await cookies()` in App Router Server Actions, Route Handlers, and Server Components.

---

### 3.5 Error Tracking with Zero Hard Dependencies

**Problem**: `@sentry/nextjs` adds ~100KB to bundle and requires complex Webpack/Vite configuration
**Solution**: Dynamic import with fallback stub

```typescript
// src/lib/sentry.ts
export function captureException(error: Error, _context?: { extra: Record<string, unknown> }): void {
  console.error("[Telemetry] Captured exception:", error);
}

// src/app/global-error.tsx
export default function GlobalError({ error }: { error: Error & { digest?: string } }) {
  useEffect(() => {
    if (process.env.NEXT_PUBLIC_SENTRY_DSN) {
      import("@sentry/nextjs")
        .then((Sentry) => Sentry.captureException(error))
        .catch(() => import("@/lib/sentry").then(({ captureException }) => captureException(error)));
    }
  }, [error]);
  // ...
}
```

---

### 3.6 Testing Mock Patterns for Server Actions

```typescript
import { vi } from "vitest";

// Mock next/headers (Next.js 15+ returns a Promise)
vi.mock("next/headers", () => ({
  cookies: vi.fn(() => Promise.resolve({ get: vi.fn().mockReturnValue(undefined) })),
}));

// Mock next-auth/jwt
vi.mock("next-auth/jwt", () => ({
  getToken: vi.fn(() => Promise.resolve(null)),
}));

// Mock prisma
vi.mock("@/lib/prisma", () => ({
  prisma: {
    order: { create: vi.fn().mockResolvedValue({ id: "order-test-123" }) },
  },
}));
```

---

## 4. TypeScript & React 19 Strict Mode (Non-Negotiable)

### 4.1 `erasableSyntaxOnly` — Zero Enums or Namespaces

```typescript
// ❌ WRONG — erasableSyntaxOnly rejects these
enum Status { ACTIVE = "ACTIVE", DRAFT = "DRAFT" }
namespace MyNamespace { export const x = 1; }

// ✅ CORRECT — string unions and ES modules only
type Status = "ACTIVE" | "DRAFT";
```

### 4.2 `verbatimModuleSyntax` — `import type` for Type-Only

```typescript
// ❌ WRONG — imported as module, not type
import { User } from "@/types";
const user: User = { ... };

// ✅ CORRECT — type-only import
import type { User } from "@/types";
```

### 4.3 React 19 Return Types

```typescript
// ❌ WRONG — JSX namespace removed in React 19
function Component(): JSX.Element { ... }

// ✅ CORRECT — inferred return type (preferred)
function Component() { ... }
```

---

## 5. Tailwind CSS v4 CSS-First

### 5.1 `@theme inline` in `globals.css`

```css
@import "tailwindcss";

@theme inline {
  --color-obsidian-50: oklch(0.98 0.002 260);
  --color-obsidian-900: oklch(0.12 0.005 260);
  --color-metallic-gold: oklch(0.78 0.14 85);
  --color-neon-cyan: oklch(0.85 0.18 190);
  --font-display: "Cormorant Garamond", Georgia, serif;
  --font-body: "DM Sans", system-ui, sans-serif;
}
```

### 5.2 Tailwind v3 → v4 Migration

| v3 Utility | v4 Utility | Files |
|------------|-----------|-------|
| `bg-gradient-to-r` | `bg-linear-to-r` | `HeroSection.tsx` |
| `bg-gradient-to-t` | `bg-linear-to-t` | `UGCGallery.tsx`, `CategoryShowcase.tsx` |
| `outline-none` | `outline-hidden` | `Input.tsx`, `Button.tsx`, `LanguageSwitcher.tsx` |
| `flex-shrink-0` | `shrink-0` | `ProductEmbed.tsx`, `NewArrivals.tsx` |

---

## 6. Zustand State Discipline

### 6.1 Selector Subscription in JSX

```typescript
// ✅ CORRECT — reactive, re-renders on state change
const items = useCartStore((s) => s.items);

// ❌ WRONG — no reactivity, stale data
const items = useCartStore.getState().items; // Never in JSX
```

### 6.2 `partialize` — Persist Data Only

```typescript
persist(
  (set, get) => ({ ... }),
  {
    name: "luxeverse-cart",
    partialize: (state) => ({ items: state.items }), // Only persist domain data
  }
)
```

---

## 7. Prisma Zero-Enum Pattern

### 7.1 Schema: `String` + TypeScript Unions

```prisma
model Product {
  id     String @id @default(cuid())
  status String @default("ACTIVE") // TypeScript: type Status = "ACTIVE" | "DRAFT" | "ARCHIVED"
}
```

### 7.2 Service Factory with Typed Includes

```typescript
type CartWithItems = Prisma.CartGetPayload<{
  include: { items: { include: { product: true } } }
}>;
```

---

## 8. Next.js 16 `params` Duality

| File Type | `params` Type | Access Pattern |
|---|---|---|
| `layout.tsx` | `Promise<{ locale: string }>` | `const { locale } = await params` |
| `page.tsx` | Plain object `{}` | `const { slug } = params` |
| `.next/types/*.ts` | `Promise<{...}>` | Type as `Promise<T>` to satisfy tsc |

---

## 9. Verification Commands Cheat Sheet

```bash
# Full verification pipeline
pnpm typecheck && pnpm lint && pnpm test && pnpm build

# Prisma type sync check
cd apps/web && pnpm db:generate && pnpm typecheck

# Tailwind v3 utility scan
grep -rEn 'bg-gradient-to-(r|l|t|b)|outline-none[^-]|flex-shrink-0' src/ packages/ apps/

# Raw hex color scan
grep -rEn 'text-\[#[0-9A-Fa-f]{3,6}\]|bg-\[#[0-9A-Fa-f]{3,6}\]' src/ packages/ apps/

# `getServerSession` / `getToken` usage check
grep -rn 'getServerSession' src/ --include="*.ts" --include="*.tsx"

# `enum` / `namespace` scan
grep -rn 'enum ' src/ packages/ apps/ --include="*.ts" --include="*.tsx"
```

---

> **Final Directive**: Every element must justify its existence. Reject generic AI tropes. Prioritize intentionality over trends. Accessibility is non-negotiable. Performance is luxury. Deliver nothing less than production-grade, meticulously verified, and architecturally sound.
