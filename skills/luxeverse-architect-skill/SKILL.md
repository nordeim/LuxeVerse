# LuxeVerse Architect Skill

## Comprehensive Architectural & Execution Framework for Cinematic, Production-Grade, Anti-Generic Web Platforms

**Version**: 3.0.0
**Source**: Distilled from full Phase 0–1 execution on LuxeVerse v3.0, plus cross-skill synthesis from claude-md, super-frontend-design, react19-ts6-vite8-tailwindv4-mvp, nextjs16-tailwind4, frontend-ui-engineering, clean-code, framework-templates
**Triggers**: `build luxury e-commerce`, `cinematic UI architecture`, `Next.js 16 phased rollout`, `anti-generic design system`, `tRPC Zustand commerce`
**When to Use**: Any project requiring Next.js 16, React 19, TypeScript 6, Tailwind v4, Prisma, tRPC, Zustand, NextAuth v5, or any subset thereof. The phased approach, RSC/Client split, and design system are universally applicable.

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

```
ANALYZE → PLAN → VALIDATE → IMPLEMENT → VERIFY → DELIVER
   ↑______________________________________________↓
              (loop back if verify fails)
```

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
│       │   ├── crypto.ts              # @node-rs/bcrypt wrapper
│       │   └── utils.ts               # cn(), formatCurrency(), etc.
│       ├── server/
│       │   ├── trpc.ts                # createTRPCContext, createCaller
│       │   ├── context.ts             # Context builder (req, res, DB)
│       │   ├── index.ts               # App router
│       │   ├── routers/
│       │   │   ├── product.ts         # getBySlug, listByCategory, search
│       │   │   ├── cart.ts            # get, addItem, removeItem, updateQuantity
│       │   │   └── order.ts           # create, get by id, list for user
│       │   └── services/
│       │       ├── product.service.ts   # Factory: createProductService()
│       │       └── cart.service.ts      # Factory: createCartService(), typed mapCart()
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
│       │   ├── checkout.actions.ts  # useActionState + Zod + Stripe
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
│   ├── runbook.md                   # Commands, common errors, onboarding
│   └── phase-completion.md          # Current phase, checklist, next steps
├── scripts/
│   ├── validate-colors.sh           # Block raw hex in className
│   └── validate-deprecated-twind.sh # Block v3 utilities (bg-gradient-to-*, etc.)
├── turbo.json                       # Pipeline: typecheck → lint → test → build (cached)
├── pnpm-workspace.yaml              # App + packages
└── CLAUDE.md                        # Full project conventions (corollary to this skill)
```

### 2.2 Dependency Matrix (Exact Rationale)
| Technology | Version | Purpose | Why, Not (Bayesian Reasoning) |
|---|---|---|---|
| next | ^16.0.0 | Framework | App Router + RSC + Turbopack + PPR. No Vite — SSR required for SEO + auth. |
| react | ^19.2.0 | UI library | useActionState, useOptimistic, useId. No Vue/Svelte — team React expertise. |
| @types/react | ^19.2.0 | Types | Required even for React 19 (not self-published yet). |
| @types/react-dom | ^19.2.0 | Types | Required even for React 19. |
| typescript | ^6.0.0 | Language | erasableSyntaxOnly, verbatimModuleSyntax, no-inferrable-return. No tsc v5 — v6 has necessary strictness. |
| tailwindcss | ^4.2.0 | Styling | CSS-first @theme inline, Oxide engine, no config file. No v3 — Oxide requires v4. |
| zustand | ^5.0.0 | Client state | Minimal, no boilerplate, persist middleware. No Redux — overkill for this scope. |
| zod | ^4.4.0 | Validation | Runtime validation at boundaries. schemas.ts single source of truth. No Yup — type inference weaker. |
| @trpc/server, @trpc/react-query | ^11.0.0 | API | End-to-end typesafe. No REST — manual TypeScript defense impossible to maintain at this schema size. |
| @auth/prisma-adapter | ^2.0.0 | Auth bridge | Links NextAuth to Prisma schema. |
| next-auth | ^5.0.0 | Authentication | JWT strategy, edge-compatible, role-based. No Auth0 SDK — vendor lock-in, we control schema. |
| @node-rs/bcrypt | ^1.0.0 | Password hashing | Binary (not native) — node_modules install <5s on M1. No bcryptjs — pure JS is 15x slower. |
| stripe | ^17.0.0 | Payments | PaymentElement (PCI SAQ-A). No custom card inputs — violates PCI. |
| vitest | ^4.1.0 | Testing | jsdom, Vite-native config. |
| @testing-library/react | ^16.3.0 | Testing | User-centric component testing. |
| playwright | ^1.51.0 | E2E | Critical flow testing (checkout, auth). |
| turbo | ^2.5.0 | Monorepo | Parallel dev builds, shared cache, task orchestration. |

---

## 3. Phase 0: Foundation & Design System (Exact Execution)

### 3.1 TypeScript Configuration (Non-Negotiable)
```json
// packages/config/tsconfig/base.json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "erasableSyntaxOnly": true,
    "verbatimModuleSyntax": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "esModuleInterop": true
  }
}
```
**`erasableSyntaxOnly: true` — This BANS `enum` and `namespace`. Zero exceptions.**
**`verbatimModuleSyntax: true` — Forces `import type` for type-only imports.**

### 3.2 Tailwind CSS v4 — CSS-First ONLY
```css
/* apps/web/src/app/globals.css */
@import "tailwindcss";

@theme inline {
  --color-obsidian-50: oklch(0.98 0.002 260);
  --color-obsidian-100: oklch(0.95 0.005 260);
  --color-obsidian-200: oklch(0.88 0.008 260);
  --color-obsidian-300: oklch(0.76 0.012 260);
  --color-obsidian-400: oklch(0.64 0.016 260);
  --color-obsidian-500: oklch(0.52 0.020 260);
  --color-obsidian-600: oklch(0.40 0.018 260);
  --color-obsidian-700: oklch(0.30 0.015 260);
  --color-obsidian-800: oklch(0.20 0.010 260);
  --color-obsidian-900: oklch(0.12 0.005 260);
  --color-obsidian-950: oklch(0.08 0.003 260);
  --color-neon-pink: oklch(0.65 0.28 350);
  --color-neon-cyan: oklch(0.85 0.18 190);
  --color-neon-lime: oklch(0.88 0.22 130);
  --color-metallic-gold: oklch(0.78 0.14 85);
  --color-metallic-silver: oklch(0.82 0.02 260);
  --color-metallic-champagne: oklch(0.88 0.06 75);
  --color-atmosphere-deep: oklch(0.15 0.04 280);
  --color-atmosphere-midnight: oklch(0.18 0.03 240);
  --color-error: oklch(0.55 0.22 25);
  --color-error-light: oklch(0.95 0.05 25);
  --color-success: oklch(0.60 0.18 145);
  --color-success-light: oklch(0.95 0.05 145);

  --text-xs: clamp(0.75rem, 0.7rem + 0.25vw, 0.875rem);
  --text-sm: clamp(0.875rem, 0.8rem + 0.375vw, 1rem);
  --text-base: clamp(1rem, 0.9rem + 0.5vw, 1.125rem);
  --text-lg: clamp(1.125rem, 1rem + 0.625vw, 1.25rem);
  --text-xl: clamp(1.25rem, 1.1rem + 0.75vw, 1.5rem);
  --text-2xl: clamp(1.5rem, 1.3rem + 1vw, 2rem);
  --text-3xl: clamp(2rem, 1.7rem + 1.5vw, 3rem);
  --text-4xl: clamp(2.5rem, 2rem + 2.5vw, 4rem);
  --text-hero: clamp(3.5rem, 2.5rem + 5vw, 8rem);

  --font-display: "Cormorant Garamond", Georgia, serif;
  --font-body: "DM Sans", system-ui, sans-serif;
  --font-mono: "JetBrains Mono", monospace;

  --space-3xs: 0.236rem;
  --space-2xs: 0.382rem;
  --space-xs: 0.618rem;
  --space-sm: 1.000rem;
  --space-md: 1.618rem;
  --space-lg: 2.618rem;
  --space-xl: 4.236rem;
  --space-2xl: 6.854rem;

  --ease-out-expo: cubic-bezier(0.19, 1, 0.22, 1);
  --ease-in-out-expo: cubic-bezier(0.87, 0, 0.13, 1);
  --ease-spring: cubic-bezier(0.175, 0.885, 0.32, 1.275);
  --ease-luxe: cubic-bezier(0.25, 0.1, 0.25, 1);
  --ease-dramatic: cubic-bezier(0.77, 0, 0.175, 1);

  --navbar-height: 64px;
}

@layer base {
  html { scroll-behavior: smooth; }
  body {
    font-family: var(--font-body);
    color: var(--color-obsidian-900);
    background-color: var(--color-obsidian-50);
    -webkit-font-smoothing: antialiased;
  }
  h1, h2, h3, h4, h5, h6 { font-family: var(--font-display); }
  :focus-visible {
    outline: 2px solid var(--color-neon-cyan);
    outline-offset: 2px;
  }
}

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

**Critical Rules Governing This File**:
1. **NO `tailwind.config.js` anywhere.** v4 reads ALL tokens from CSS.
2. **No arbitrary values in className**: `w-[37px]` is BANNED. Add to `--space-*` tokens.
3. **No raw hex in className**: `bg-[#1a1a2e]` is BANNED. Use `bg-obsidian-900`.
4. **v3 utility migrations**:
   - `bg-gradient-to-r` → `bg-linear-to-r`
   - `outline-none` → `outline-hidden`
   - `flex-shrink-0` → `shrink-0`
5. **Prefer `cn()` to raw `className` string assembly** for toggleable state classes.

---

## 4. Phase 1: Core Commerce (Exact Execution)

### 4.1 Prisma Zero-Enum Pattern
```prisma
// apps/web/prisma/schema.prisma
model Product {
  id           String   @id @default(cuid())
  name         String
  slug         String   @unique
  description  String?
  price        Decimal  @db.Decimal(10, 2)
  // ❌ WRONG: enum Genre { ... }
  genre        String   // TypeScript: type Genre = "ROMANCE" | "THRILLER" | "DRAMA"
  // ❌ WRONG: enum ProductStatus { ... }
  status       String   @default("ACTIVE") // "ACTIVE" | "DRAFT" | "ARCHIVED"
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt
  images       ProductImage[]
  variants     ProductVariant[]
  cartItems    CartItem[]
  orderItems   OrderItem[]
}

model ProductVariant {
  id        String  @id @default(cuid())
  productId String
  name      String
  sku       String  @unique
  price     Decimal @db.Decimal(10, 2)
  product   Product @relation(fields: [productId], references: [id])
  cartItems CartItem[]
}

model CarItem {
  id        String  @id @default(cuid())
  cartId    String
  productId String
  variantId String?
  quantity  Int     @default(1)
  unitPrice Decimal @db.Decimal(10, 2)
  // ...
}

// String, NOT enum, for status
model Order {
  id       String @id @default(cuid())
  status   String @default("PENDING") // "PENDING" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED" | "REFUNDED"
  // ...
}
```
**Rationale**: `erasableSyntaxOnly` rejects `enum`. Prisma enums compile to TypeScript enums, which are erased at compile time but still fail the constraint. Using `String` + union types in TypeScript gives the same runtime safety with `strict` + SAUCE.

### 4.2 Service Factory Pattern (Zero `any`)
```typescript
// server/services/cart.service.ts
import { prisma } from "@/lib/prisma";
import type { Prisma } from "@prisma/client";
import type { CartData, CartItem } from "@/types";

// ✅ Typed Prisma include — NEVER use `any`
type CartWithItems = Prisma.CartGetPayload<{
  include: {
    items: {
      include: {
        product: { select: { name: true; images: { where: { isPrimary: true }; select: { url: true }; take: 1 } } };
        variant: { select: { name: true } };
      };
    };
  };
}>;

// Zero `any` — all Prisma shape fully typed
function mapCart(cart: CartWithItems): CartData {
  const items: CartItem[] = cart.items.map((item) => ({
    id: item.id,
    productId: item.productId,
    productName: item.product.name,
    variantId: item.variantId,
    variantName: item.variant?.name ?? null,
    quantity: item.quantity,
    unitPrice: Number(item.unitPrice),
    totalPrice: Number(item.unitPrice) * item.quantity,
    imageUrl: item.product.images[0]?.url ?? null,
  }));
  return {
    id: cart.id,
    items,
    subtotal: items.reduce((sum, i) => sum + i.totalPrice, 0),
    itemCount: items.reduce((sum, i) => sum + i.quantity, 0),
    currency: "USD",
  };
}

export interface CartService {
  getOrCreate(userId: string | null, sessionId: string): Promise<CartData>;
  addItem(cartId: string, productId: string, variantId: string | null, quantity: number): Promise<CartData>;
  updateItem(itemId: string, quantity: number): Promise<CartData>;
  removeItem(itemId: string): Promise<CartData>;
  clearCart(cartId: string): Promise<CartData>;
}

// Factory — injectable, mockable, testable
export function createCartService(): CartService {
  return {
    async getOrCreate(userId, sessionId) { /* ...prisma... */ },
    async addItem(cartId, productId, variantId, quantity) { /* ...prisma... */ },
    // ...
  };
}
```

### 4.3 Zod v4 Boundary Validation
```typescript
// lib/schemas.ts
import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().min(1, "Email is required.").email("Invalid email format."),
  password: z.string().min(8, "Password must be at least 8 characters."),
});

export const registerSchema = loginSchema.extend({
  name: z.string().min(2, "Name must be at least 2 characters."),
  confirmPassword: z.string().min(8, "Password confirmation is required."),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match.",
  path: ["confirmPassword"],
});

// ✅ Flat schema for flat FormData
export const checkoutSchema = z.object({
  firstName: z.string().min(1, "First name is required."),
  lastName: z.string().min(1, "Last name is required."),
  line1: z.string().min(5, "Address line is required."),
  line2: z.string().optional(),
  city: z.string().min(1, "City is required."),
  state: z.string().min(1, "State is required."),
  postalCode: z.string().min(1, "Postal code is required."),
  country: z.string().min(2, "Country is required."),
  email: z.string().email("Valid email is required."),
  saveAddress: z.boolean().optional(),
  createAccount: z.boolean().optional(),
});
```
**ZOD V4 API**: `result.error.issues[0].message` (not `.errors[0].message` from v3).

### 4.4 Server Actions with `useActionState`
```typescript
// app/actions/checkout.actions.ts
"use server";
import { z } from "zod";
import { checkoutSchema } from "@/lib/schemas";

export interface CheckoutState { status: "initial" | "error" | "success"; message?: string; }

export async function checkoutAction(
  _prev: CheckoutState,
  formData: FormData
): Promise<CheckoutState> {
  const rawData = Object.fromEntries(formData.entries());
  const parsed = checkoutSchema.safeParse(rawData);
  if (!parsed.success) {
    return { status: "error", message: parsed.error.issues[0].message };
  }
  // ... process checkout ...
  return { status: "success" };
}
```

```tsx
// Client component
const [checkoutState, formAction, isPending] = useActionState(checkoutAction, { status: "initial" });

<form action={formAction}>
  <input name="firstName" />
  <button disabled={isPending}>{isPending ? "Processing..." : "Submit"}</button>
  {checkoutState.status === "error" && <p role="alert">{checkoutState.message}</p>}
</form>
```

**Critical**: `Object.fromEntries(formData.entries())` returns flat key-value pairs. If your Zod schema expects `{ address: { firstName: ... } }`, it will ALWAYS fail because FormData is flat.

### 4.5 Zustand — Selector Discipline Is Law
```typescript
// stores/cart.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface CartItem { /* ... */ }

export interface CartState {
  items: CartItem[];
  isOpen: boolean;
  isLoading: boolean;
  // actions
  addItem: (item: CartItem) => void;
  updateQuantity: (id: string, quantity: number) => void;
  removeItem: (id: string) => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      isLoading: false,
      addItem: (item) => {
        const { items } = get(); // ✅ .getState() OK inside action
        const existing = items.find((i) => i.id === item.id);
        if (existing) {
          set({
            items: items.map((i) =>
              i.id === item.id ? { ...i, quantity: i.quantity + item.quantity } : i
            ),
          });
        } else {
          set({ items: [...items, item] });
        }
      },
      updateQuantity: (id, quantity) => {
        const { items } = get();
        set({ items: items.map((i) => (i.id === id ? { ...i, quantity } : i)) });
      },
      removeItem: (id) => {
        const { items } = get();
        set({ items: items.filter((i) => i.id !== id) });
      },
    }),
    {
      name: "luxeverse-cart",
      // CRITICAL: Persist ONLY domain data. UI state is ephemeral.
      partialize: (state) => ({ items: state.items }),
    }
  )
);

// Use in components — ALWAYS use selector
// ✅ Correct: reactive subscription
const items = useCartStore((s) => s.items);
const addItem = useCartStore((s) => s.addItem);

// ❌ Wrong: no re-renders, stale data
const items = useCartStore.getState().items; // Never in JSX
```

### 4.6 NextAuth v5 with JWT & Role-Based Access
```typescript
// lib/auth.ts
import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import { comparePassword } from "@/lib/crypto";
import type { Adapter } from "next-auth/adapters";
import type { Session, User, NextAuthOptions } from "next-auth";

export interface AuthenticatedSession extends Session{
  user: {
    id: string;
    email: string;
    name: string | null;
    image: string | null;
    role: "USER" | "ADMIN";
  };
}

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma) as Adapter,
  session: { strategy: "jwt" },
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });
        if (!user || !user.passwordHash) return null;
        const isValid = await comparePassword(credentials.password as string, user.passwordHash);
        if (!isValid) return null;
        return { id: user.id, email: user.email, name: user.name, role: user.role };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) { token.role = user.role; }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token.role) {
        (session.user as AuthenticatedSession["user"]).role = token.role as "USER" | "ADMIN";
      }
      return session;
    },
  },
  pages: { signIn: "/login", error: "/login" },
};

export const { handlers, auth } = NextAuth(authOptions);
```

### 4.7 tRPC with React Query Provider
```typescript
// lib/server/trpc.ts
import { initTRPC } from "@trpc/server";
import type { NextRequest } from "next/server";
import { createContext } from "./context";

const t = initTRPC.create();

export const router = t.router;
export const publicProcedure = t.procedure;
export const protectedProcedure = t.procedure.use(t.middleware(({ ctx, next }) => {
  if (!ctx.session) throw new Error("UNAUTHORIZED");
  return next({ ctx: { ...ctx, session: ctx.session } });
}));

// app/api/trpc/route.ts
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { appRouter } from "@/server/routers";

export async function GET(req: NextRequest) {
  return fetchRequestHandler({ req, router: appRouter, createContext: () => createContext(req) });
}
export async function POST(req: NextRequest) { /* same */ }

// trpc/provider.tsx
"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { httpBatchLink } from "@trpc/react-query";
import { useState } from "react";
import { trpc } from "./index";

export function TRPCProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());
  const [trpcClient] = useState(() =>
    trpc.createClient({ links: [httpBatchLink({ url: "/api/trpc" })] })
  );
  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </trpc.Provider>
  );
}
```

### 4.8 Middleware — Auth, CSP, HSTS, Rate Limiting, Nonce
```typescript
// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const RATE_LIMIT = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT_MAX = 30; // per minute per IP

function getClientIP(req: NextRequest): string {
  return req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "127.0.0.1";
}

function generateNonce(): string {
  return crypto.randomUUID();
}

export async function middleware(req: NextRequest) {
  const nonce = generateNonce();
  const ip = getClientIP(req);
  const now = Date.now();
  const entry = RATE_LIMIT.get(ip);

  if (!entry || now > entry.resetAt) {
    RATE_LIMIT.set(ip, { count: 1, resetAt: now + 60_000 });
  } else if (entry.count >= RATE_LIMIT_MAX) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  } else {
    entry.count++;
  }

  const response = NextResponse.next();

  // CSP with nonce
  response.headers.set("Content-Security-Policy",
    `default-src 'self'; script-src 'nonce-${nonce}' 'self'; style-src 'nonce-${nonce}' 'self' 'unsafe-inline'; frame-ancestors 'none';`);
  response.headers.set("Strict-Transport-Security", "max-age=63072000; includeSubDomains; preload");
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");

  return response;
}

export const config = { matcher: ["/((?!_next|api|static|.*\\.).*)", "/api/:path*"] };
```

---

## 5. The 15 Critical Agent Mistakes (Field-Tested Fixes)

### Mistake #1: `any` in Service Layer
**Fix**: See §4.2. Use `Prisma.CartGetPayload<IncludeShape>`.

### Mistake #2: `document.getElementById` / `window.scrollTo` in RSC
**Fix**: Wrap in Client Component or use native CSS `scroll-behavior: smooth`.

### Mistake #3: Stripe `elements.on("ready")` Null Deref
**Fix**: Use `onReady` prop only. Never both.
```tsx
// ❌ WRONG: elements can be null initially
const handleReady = () => setIsReady(true);
// ❌ WRONG
if (elements) elements.on("ready", handleReady);
// ✅ CORRECT: onReady prop is safe
<PaymentElement onReady={() => setIsReady(true)} />
```

### Mistake #4: `ShippingStep` Race Condition
**Fix**: `useEffect` watches state, not synchronous check after action.
```tsx
// ❌ WRONG
if (state.status !== "error") onNext();
// ✅ CORRECT
useEffect(() => { if (state.status === "success") onNext(); }, [state.status, onNext]);
```

### Mistake #5: Checkout Schema Doesn't Match FormData
**Fix**: Flat schema matching flat FormData keys exactly. See §4.3.

### Mistake #6: `<a href>` for Internal Navigation
**Fix**: `import Link from "next/link"`. `<Link href="/shop">` for all internal routing.

### Mistake #7: `window.location.href` in Next.js
**Fix**: `import { useRouter } from "next/navigation"; router.push("/path")`.

### Mistake #8: `useOptimistic` Type Mismatch
**Fix**: Match state type exactly. `useOptimistic(false, () => true)` → update with `true` not `null`.

### Mistake #9: Tailwind v3 Utilities in v4 Project
**Fix**: `bg-gradient-to-r` → `bg-linear-to-r`, `outline-none` → `outline-hidden`, `flex-shrink-0` → `shrink-0`.

### Mistake #10: `enum` or `namespace` in TypeScript
**Fix**: `type Status = "ACTIVE" | "DRAFT"`. `erasableSyntaxOnly` rejects these.

### Mistake #11: `.getState()` in JSX
**Fix**: Always use selector: `useCartStore((s) => s.items)`. `.getState()` only inside store actions.

### Mistake #12: Persisting UI State in Zustand
**Fix**: `partialize: (state) => ({ items: state.items })` — data only, never `isOpen`/`isLoading`.

### Mistake #13: Using `<button>` Without `type="button"`
**Fix**: Default is `submit`. Always add `type="button"` for non-form buttons.

### Mistake #14: Forgetting `useCallback` for Stable Props
**Fix**: Wrap event handlers and callbacks in `useCallback` to prevent unnecessary re-renders of child components. Especially critical for `onClick`, `onSubmit`, `onChange` passed to memoized children.

### Mistake #15: Ignoring `useId()` for ARIA Pairs
**Fix**: `const id = useId();` then `<label htmlFor={id}>` + `<input id={id} />`. Never hardcode IDs in reusable components.

---

## 6. Component Architecture (RSC-First, Client Islands)

### The "Islands" Model
Next.js App Router renders Server Components by default. Client Components are opt-in islands.

**Server Component (default)**:
- Fetch data directly: `const products = await prisma.product.findMany();`
- Generate metadata: `export async function generateMetadata() { ... }`
- Access Node.js APIs: `fs`, `path`, `crypto` (server-side)
- **Cannot**: `useState`, `useEffect`, `useRef`, browser APIs (`window`, `document`, `localStorage`)

**Client Component (`"use client"`)**:
- All React hooks: `useState`, `useEffect`, `useId`, `useCallback`, `useMemo`
- All browser APIs: `IntersectionObserver`, `ResizeObserver`, `fetch` (use `useSWR` or tRPC instead)
- Zustand, tRPC React Query, Formik, React Hook Form
- **Cannot**: `async function`, data fetching at module level, `generateMetadata`

### The Pattern
```tsx
// app/shop/page.tsx — RSC, fetches data
import { ProductGrid } from "@/components/product/ProductGrid";
import { prisma } from "@/lib/prisma";
export default async function ShopPage() {
  const products = await prisma.product.findMany({ where: { status: "ACTIVE" } });
  return <ProductGrid products={products} />;
}

// components/product/ProductGrid.tsx — RSC, renders data
export function ProductGrid({ products }: ProductGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}

// components/product/ProductCard.tsx — RSC, link to PDP
import Link from "next/link";
export function ProductCard({ product }: ProductCardProps) {
  return (
    <Link href={`/shop/${product.category}/${product.slug}`} className="group">
      <ProductImage src={product.images[0]?.url} alt={product.name} />
      <h3 className="font-display">{product.name}</h3>
      <PriceDisplay price={product.price} />
    </Link>
  );
}

// components/product/QuickAddButton.tsx — Client Component
"use client";
export function QuickAddButton({ productId, variantId }: QuickAddButtonProps) {
  const [isAdding, setIsAdding] = useState(false);
  const addToCart = useCartStore((s) => s.addItem);

  const handleClick = useCallback(async () => {
    setIsAdding(true);
    try {
      await addToCart({ productId, variantId, quantity: 1 });
    } finally {
      setIsAdding(false);
    }
  }, [productId, variantId, addToCart]);

  return (
    <button type="button" onClick={handleClick} disabled={isAdding}>
      {isAdding ? "Adding..." : "Quick Add"}
    </button>
  );
}
```

---

## 7. Testing & QA

### Vitest Setup
```typescript
// src/test/setup.ts
import "@testing-library/jest-dom/vitest";
import { vi, beforeEach, afterEach } from "vitest";

beforeEach(() => {
  vi.useFakeTimers({ shouldAdvanceTime: true });
  vi.stubGlobal("requestAnimationFrame", (cb: FrameRequestCallback) => {
    return window.setTimeout(cb, 16) as unknown as number;
  });
  vi.stubGlobal("cancelAnimationFrame", (id: number) => {
    window.clearTimeout(id);
  });
  Object.defineProperty(window, "crypto", {
    value: { randomUUID: () => "test-uuid-" + Math.random().toString(36).slice(2) },
  });
});

afterEach(() => {
  vi.unstubAllGlobals();
  vi.useRealTimers();
});
```

### Factory Mocks
```typescript
// src/test/factories.ts
import type { Product, User } from "@/types";

export function getMockProduct(overrides?: Partial<Product>): Product {
  return {
    id: "prod-" + crypto.randomUUID(),
    name: "Test Product",
    slug: "test-product",
    price: 10000,
    images: [],
    category: "APPAREL",
    status: "ACTIVE",
    ...overrides,
  };
}

export function getMockUser(overrides?: Partial<User>): User {
  return {
    id: "user-" + crypto.randomUUID(),
    email: "test@example.com",
    name: "Test User",
    role: "USER",
    ...overrides,
  };
}
```

### Key Testing Rules
- **Mock services, not implementation**: `vi.mock("@/server/services/cart.service")` not `vi.spyOn(prisma, "findMany")`.
- **Test behavior, not structure**: `expect(screen.getByText("Quick Add")).toBeInTheDocument()` not `expect(container.querySelector("button")).toHaveClass("...")`.
- **Factory pattern**: `getMockProduct({ name: "Custom" })` for deterministic, isolated tests.
- **Never skip tests**: Zero `test.skip` or `describe.skip` in committed code.

---

## 8. CI/CD & Quality Gates

### GitHub Actions Pipeline
```yaml
# .github/workflows/ci.yml
name: CI
on: [push, pull_request]
jobs:
  quality:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'pnpm'
      - run: pnpm install --frozen-lockfile
      - run: pnpm typecheck   # tsc --noEmit — must pass zero errors
      - run: pnpm lint        # Next.js lint + Prettier
      - run: pnpm test        # Vitest — must pass zero failures
      - run: pnpm build       # Production build — must succeed
      - run: npm audit --audit-level moderate  # Zero high/critical
      # Optional: Lighthouse CI
      # - run: npx lhci autorun
```

### Pre-Commit Checklist (Run Before Every Commit)
| # | Check | Command |
|---|---|---|
| 1 | TypeScript zero errors | `pnpm typecheck` |
| 2 | ESLint with Prettier | `pnpm lint` |
| 3 | Tests pass | `pnpm test` |
| 4 | Build succeeds | `pnpm build` |
| 5 | No `any`, `enum`, `namespace` | `grep -rn "enum\\|namespace\\|: any" src/` |
| 6 | No `tailwind.config.js` | `find . -name "tailwind.config.*"` |
| 7 | No v3 utilities | `grep -rn "bg-gradient-to-\\|outline-none\\b\\|flex-shrink-0" src/` |
| 8 | No raw hex in className | `grep -rn "#[0-9A-Fa-f]\\{3,6\\}" src/ --include="*.tsx"` |
| 9 | No emojis | `grep -rn "[😀-🿿]" src/` |
| 10 | All internal nav uses `<Link>` | `grep "<a " src/ -rl | xargs grep 'href="/'` |
| 11 | No `document`/`window` in RSC | `grep "window\\.,document\\." src/ --include="*.tsx"` |

### Shell Validation Scripts
```bash
# scripts/validate-colors.sh
#!/bin/bash
echo "Checking for raw hex in className..."
grep -rn "#[0-9A-Fa-f]\{3,6\}" src/ --include="*.tsx" && echo "❌ Found raw hex. Use design tokens." || echo "✅ No raw hex."

# scripts/validate-deprecated-twind.sh
#!/bin/bash
echo "Checking for deprecated Tailwind v3 utilities..."
grep -rn "bg-gradient-to-\|outline-none\b\|flex-shrink-0" src/ && echo "❌ Found deprecated utilities." || echo "✅ Clean."
```

---

## 9. Design System & Anti-Generic Mandate

### Color Palette (OKLCH — Perceptually Uniform)
| Token | OKLCH Value | Usage |
|-------|-------------|-------|
| `obsidian-50` | `oklch(0.98 0.002 260)` | Lightest background |
| `obsidian-900` | `oklch(0.12 0.005 260)` | Primary text |
| `obsidian-950` | `oklch(0.08 0.003 260)` | Button/dark surfaces |
| `neon-cyan` | `oklch(0.85 0.18 190)` | Focus indicators |
| `neon-pink` | `oklch(0.65 0.28 350)` | Errors/callouts |
| `metallic-champagne` | `oklch(0.88 0.06 75)` | Primary CTAs |
| `metallic-gold` | `oklch(0.78 0.14 85)` | Hover states |

### Typography (Fluid Scale)
```
hero:  clamp(3.5rem, 2.5rem + 5vw, 8rem)  — Page hero
h1:    clamp(2.5rem, 2rem + 2.5vw, 4rem)   — Page titles
h2:    clamp(2rem, 1.7rem + 1.5vw, 3rem)    — Section headers
h3:    clamp(1.5rem, 1.3rem + 1vw, 2rem)    — Card titles
body:  clamp(1rem, 0.9rem + 0.5vw, 1.125rem)
small: clamp(0.75rem, 0.7rem + 0.25vw, 0.875rem)
```

### Spacing (Golden Ratio)
```
--space-3xs: 0.236rem
--space-2xs: 0.382rem
--space-xs:  0.618rem
--space-sm:  1.000rem
--space-md:  1.618rem
--space-lg:  2.618rem
--space-xl:  4.236rem
--space-2xl: 6.854rem
```

---

## 10. Troubleshooting Encyclopedia

### Zod v4 API Changes
**Error**: `zodErrors.map is not a function`
**Root**: Zod v4 changed the error structure.
**Fix**: Use `result.error.issues[0].message` instead of `result.error.errors[0].message`.

### Tailwind v4: `No config file found`
**Root**: `tailwind.config.js` exists but v4 doesn't read it.
**Fix**: Delete `tailwind.config.js` and move all tokens to `globals.css` using `@theme inline`.

### NextAuth v4 ❌ → v5 ✅
**Migrating to Auth.js (NextAuth v5) from v4**
**Critical Differences**:
1. **Environment variables**: `NEXTAUTH_SECRET` → `AUTH_SECRET`, `NEXTAUTH_URL` → `AUTH_TRUST_HOST` (or remove `NEXTAUTH_URL` if using `trustHost: true`).
2. **Imports**: `import NextAuth from "next-auth"` → `import NextAuth from "next-auth"` is the same, but the return is different. In v5, `NextAuth()` doesn't export `GET`/`POST` directly in the same way.
3. **API Route**: In v5, auth is mounted differently. The `api/auth/[...nextauth]/route.ts` is handled automatically by the framework, and you don't manually create it for App Router.
4. **Session**: `getServerSession` is deprecated in favor of `auth()` from `next-auth`.
5. **Config**: The `authOptions` structure is different. In v5, you define a `config` and pass it to `NextAuth`.

### React 19: `Cannot find namespace 'JSX'`
**Root**: React 19 removed the global `JSX` namespace.
**Fix 1**: Import types for ReactElement: `import type { ReactElement } from "react"`.
**Fix 2**: Prefer inferred return types over explicit `JSX.Element` / `React.ReactElement` for simple components.

### TypeScript `noUnusedLocals` / `noUnusedParameters`
**Issue**: `error TS6133: 'X' is declared but its value is never read.`
**Root**: Strict TypeScript settings. The `_` prefix convention used by some linters does NOT suppress TypeScript's `noUnusedLocals` or `noUnusedParameters` errors.
**Fix**:
1. **Remove the variable/parameter entirely** (if truly not needed).
2. **Use the variable** (e.g., `_input.amount` instead of ignoring it).
3. **Rename to `_[name]`**: While not suppressing the compiler, it indicates intent. However, the compiler may still flag it depending on the exact configuration. The standard approach is to either use it or remove it.
4. **Don't disable**: Keep `noUnusedLocals: true` and `noUnusedParameters: true` in `tsconfig.json` — they catch real bugs. Only disable if you are in a quick prototype and willing to pay the tech debt later.

### Monorepo: `Cannot find module '@luxeverse/utils'`
**Root**: Workspace dependency is linked, but TypeScript can't resolve its types.
**Fix 1**: Ensure `packages/utils/tsconfig.json` exists and has `"compilerOptions"` set up for declaration generation if needed.
**Fix 2**: In `packages/utils/package.json`, make sure `main` and `types` point to the built files or source files.
**Fix 3**: In root `tsconfig.json`, add the workspace to `references` or ensure `baseUrl` + `paths` are configured.
**Fix 4**: If the package has no build step, point `main` to the source: `"main": "./src/index.ts"` and `"types": "./src/index.ts"`.

### `window` / `document` in RSC
**Error**: `ReferenceError: window is not defined`
**Fix 1**: Add `"use client"` to the top of the file.
**Fix 2**: If it's just a small logical check (not an API call), replace with:
```tsx
if (typeof window !== "undefined") { ... }
```

### Stripe `onReady` vs `elements.on("ready")`
**Error**: `Cannot read properties of undefined (reading 'on')` or Null Deref.
**Fix**: Stripe's `PaymentElement` has an `onReady` prop. Use that instead of `elements.on("ready")` which can fail during initial render. If using `useStripe()` + `useElements()`, the `elements` object might not be ready when the hook first runs.

---

## 11. Environment Variables

| Variable | Purpose | Example |
|---|---|---|
| `DATABASE_URL` | Prisma/PostgreSQL | `postgresql://localhost:5432/luxeverse` |
| `NEXTAUTH_SECRET` | JWT signing | `a-256-bit-secret-key` |
| `NEXTAUTH_URL` | Auth callbacks | `http://localhost:3000` |
| `STRIPE_SECRET_KEY` | Server-side Stripe | `sk_test_...` |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Client-side Stripe | `pk_test_...` |
| `AUTH_SECRET` | NextAuth v5 | `a-256-bit-secret-key` |
| `REDIS_URL` | Production cache | `redis://localhost:6379` |

---

## 12. Lessons Learned (Phase 0–1 Deep Dive)

### Phase 0
1. **Tailwind v4 CSS-first is non-negotiable**: `tailwind.config.js` causes Oxide engine failure. All tokens in `@theme inline`.
2. **RSC/Client boundaries must be declared**: Every interactive component needs `"use client"`. Server Components cannot use `document`, `window`, or `localStorage`.
3. **Zustand `partialize` is a foot-gun**: `isOpen`, `isLoading`, `toasts` must NOT be persisted. Only domain data.
4. **Focus rings are non-negotiable**: `outline: 2px solid var(--color-neon-cyan)` with 2px offset.
5. **Lucide icons only**: No emojis. No inline SVGs without `aria-hidden`.

### Phase 1
1. **Never persist UI state in Zustand**: `partialize: (state) => ({ items: state.items })` only.
2. **Zod v4 `.issues[0].message` not `.errors[0]`**: API changed between v3 and v4.
3. **Flat `checkoutSchema` for flat `FormData`**: Match `name` attribute to schema key exactly.
4. **Stripe `PaymentElement` uses `onReady` prop**: `elements.on("ready")` can null-deref.
5. **ShippingStep race**: `useEffect` watches state transition, never synchronous `if (state.status !== "error")`.
6. **Always use `<Link>` for internal nav**: `<a href="/shop">` triggers full page reload.
7. **Always use `useRouter().push()` not `window.location.href`**: Preserves SPA state.
8. **Service factories not singletons**: `createCartService()` for testability.
9. **`params` is plain object in Next.js 16**: No `await params`. Direct destructuring.
10. **TypeScript `paths` are compile-time only**: Vite/Next.js config must also define runtime aliases.
11. **`useCallback` for stable props passed to memoized children**: Prevents re-render cascades.
12. **`useId()` for all ARIA pairs**: Never hardcode IDs in reusable components.
13. **`noUnusedLocals` catches dead code early**: Disabled underscore prefix convention — TypeScript ignores `_` prefixes by default in modern versions, but `noUnusedLocals` still catches them. Remove or use the variable.
14. **`React.ReactElement` /** `ReactElement` vs `JSX.Element`**: React 19 removed the global `JSX` namespace. Always `import type { ReactElement } from 'react'` and use `ReactElement`.
15. **Prisma types after schema change**: Run `pnpm db:generate` to update types before `tsc --noEmit`.
16. **Workspace packages need explicit build/export**: Returning `PaymentIntentResult` from `createPaymentService` requires the interface to be exported. If `payment.service.ts` adds a new export, update `index.ts` or `package.json` exports map.

---

## 13. Quick Reference Card

### TypeScript
```
❌ enum, namespace                     → ✅ union type
❌ function(x: any)                   → ✅ function(x: unknown)
❌ import { UIState } from '...'       → ✅ import type { UIState } from '...'
❌ : Props (generic names)              → ✅ interface ProductCardProps
```

### Tailwind v4
```
❌ tailwind.config.js                   → ✅ @theme inline in globals.css
❌ bg-gradient-to-r                    → ✅ bg-linear-to-r
❌ outline-none                        → ✅ outline-hidden
❌ flex-shrink-0                       → ✅ shrink-0
❌ w-[37px]                            → ✅ extend @theme inline
❌ bg-[#1a1a2e]                        → ✅ bg-obsidian-900
```

### Zustand
```
❌ useCartStore.getState().items       → ✅ useCartStore((s) => s.items)
❌ partialize: (s) => s               → ✅ partialize: (s) => ({ items: s.items })
```

### Next.js App Router
```
❌ async function Page({ params }) { const p = await params }  → ✅ const { slug } = params
❌ <a href="/shop">                     → ✅ <Link href="/shop">
❌ window.location.href                → ✅ router.push("/path")
```

### Prisma
```
❌ enum Genre                           → ✅ genre String  // type Genre = "ROMANCE" | "THRILLER"
❌ cart: any                            → ✅ type CartWithItems = Prisma.CartGetPayload<{ include: {...} }>
```

---

> **Final Directive**: Every element must justify its existence. Reject generic AI tropes. Prioritize intentionality over trends. Accessibility is non-negotiable. Performance is luxury. Deliver nothing less than production-grade, meticulously verified, and architecturally sound.
