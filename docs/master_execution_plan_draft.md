# LuxeVerse — Master Execution Plan

**Project**: Cinematic Luxury E-Commerce Platform  
**Date**: 2026-05-14  
**Status**: Plan — Pending Validation  
**Stack**: Next.js 16 · React 19 · TypeScript 6 · Tailwind CSS v4 · Shadcn/UI · Framer Motion · Prisma 7 · PostgreSQL 17 · tRPC + GraphQL

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Architecture Overview](#2-architecture-overview)
3. [Phase 0 — Project Scaffold & Design System](#3-phase-0)
4. [Phase 1 — Core Commerce Foundation](#4-phase-1)
5. [Phase 2 — Shopping Experience](#5-phase-2)
6. [Phase 3 — Personalization & AI](#6-phase-3)
7. [Phase 4 — Scale, Loyalty & Social](#7-phase-4)
8. [Phase 5 — Polish, Testing & Launch](#8-phase-5)
9. [Cross-Cutting Concerns](#9-cross-cutting)
10. [Validation Checklist](#10-validation)

---

## 1. Executive Summary

This plan decomposes LuxeVerse into **6 independently executable phases**, each producing a deployable increment. The phases follow the PRD's 36-week roadmap but are structured so that any phase can be staffed and executed in parallel once its prerequisites are met.

**Guiding Principles** (from AGENTS.md + Skills):
- **Anti-Generic Mandate** — No template aesthetics. Every UI is bespoke, editorial, cinematic.
- **Library Discipline** — Use Shadcn/Radix primitives; wrap, don't rebuild.
- **TypeScript Strict** — No `any`, no `enum`, no `namespace`. `erasableSyntaxOnly`.
- **Accessibility as Law** — WCAG 2.1 AA minimum, AAA where feasible.
- **Performance as Luxury** — LCP < 2.5s, CLS < 0.1, INP < 200ms.
- **ANALYZE → PLAN → VALIDATE → IMPLEMENT → VERIFY → DELIVER** — No code without plan alignment.

---

## 2. Architecture Overview

```
┌──────────────────────────────────────────────────────────────┐
│                     CLIENT (Next.js 16 App Router)            │
│  ┌─────────┐ ┌──────────┐ ┌──────────┐ ┌──────────────────┐ │
│  │ Pages   │ │ Components│ │ Stores   │ │ Hooks            │ │
│  │ (RSC)   │ │ (Client) │ │ (Zustand)│ │ (Custom)         │ │
│  └────┬────┘ └────┬─────┘ └────┬─────┘ └──────┬───────────┘ │
│       └───────────┴────────────┴───────────────┘              │
└──────────────────────────────┬───────────────────────────────┘
                               │ tRPC (type-safe) + GraphQL
┌──────────────────────────────┴───────────────────────────────┐
│                     API LAYER (tRPC + GraphQL)                │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐        │
│  │ Product  │ │  Cart    │ │  User    │ │  Order   │        │
│  │ Router   │ │  Router  │ │  Router  │ │  Router  │        │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘        │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐        │
│  │ Search   │ │   AI     │ │ Content  │ │ Loyalty  │        │
│  │ Router   │ │  Router  │ │  Router  │ │  Router  │        │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘        │
└──────────────────────────────┬───────────────────────────────┘
                               │
┌──────────────────────────────┴───────────────────────────────┐
│                     DATA LAYER                                │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐        │
│  │PostgreSQL│ │  Redis   │ │ Algolia/ │ │  S3/CDN  │        │
│  │ (Prisma) │ │ (Cache)  │ │Typesense │ │ (Media)  │        │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘        │
└──────────────────────────────────────────────────────────────┘
```

**Monorepo Structure** (Turborepo):
```
luxeverse/
├── apps/
│   ├── web/                    # Next.js 16 storefront
│   ├── admin/                  # Admin dashboard (Next.js)
│   └── api/                    # tRPC + GraphQL server
├── packages/
│   ├── ui/                     # Shared component library (Shadcn-based)
│   ├── design-system/          # Tokens, themes, typography
│   ├── db/                     # Prisma schema + migrations
│   ├── config/                 # Shared TypeScript, ESLint, Tailwind configs
│   └── utils/                  # Shared utilities (cn, formatPrice, etc.)
├── turbo.json
├── package.json
└── pnpm-workspace.yaml
```

---

## 3. Phase 0 — Project Scaffold & Design System

**Goal**: Bootable monorepo with a complete design system, zero-page app shell, and CI/CD pipeline.  
**Duration**: 2 weeks  
**Prerequisites**: None  
**Deliverable**: `pnpm dev` runs a styled empty app with navbar, footer, and design tokens live.

### 3.1 Files to Create

| # | File / Directory | Purpose | Key Interfaces |
|---|---|---|---|
| 0.1 | `turbo.json` | Turborepo pipeline config | `build`, `dev`, `lint`, `test` tasks |
| 0.2 | `pnpm-workspace.yaml` | Workspace definition | `apps/*`, `packages/*` |
| 0.3 | `package.json` (root) | Root scripts, devDependencies | `turbo`, `typescript`, `eslint` |
| 0.4 | `packages/config/tsconfig/base.json` | Shared TS strict config | `strict: true`, `erasableSyntaxOnly`, `verbatimModuleSyntax`, path aliases |
| 0.5 | `packages/config/tsconfig/next.json` | Next.js TS overlay | Extends base, `jsx: "react-jsx"` |
| 0.6 | `packages/config/eslint/base.js` | Shared ESLint rules | `@typescript-eslint/strict`, no-any |
| 0.7 | `packages/design-system/tokens.css` | CSS custom properties (Tailwind v4 `@theme inline`) | Color palette (obsidian, neon, metallic, atmosphere), typography scale (Cormorant Garamond + DM Sans), spacing (golden ratio), animation curves, shadow system, z-index scale, border radii |
| 0.8 | `packages/design-system/typography.css` | Font-face declarations + type scale classes | `.text-hero`, `.text-display`, `.text-headline`, `.text-title`, `.text-subtitle`, `.text-body`, `.text-caption`, `.text-overline` |
| 0.9 | `packages/design-system/animations.css` | Keyframe definitions | `fade-in-up`, `slide-reveal`, `parallax-deep`, `magnetic-hover`, `cart-badge-bounce`, `notification-slide` |
| 0.10 | `packages/ui/package.json` | UI package manifest | Depends on `@radix-ui/*`, `clsx`, `tailwind-merge`, `framer-motion` |
| 0.11 | `packages/ui/src/button.tsx` | Button primitive (Shadcn wrapper) | `variant: 'filled' | 'outlined' | 'ghost' | 'text'`, `size: 'sm' | 'md' | 'lg'`, `loading`, `icon`, `asChild` |
| 0.12 | `packages/ui/src/input.tsx` | Input primitive | `variant: 'default' | 'search' | 'textarea'`, `error`, `label`, `helperText` |
| 0.13 | `packages/ui/src/badge.tsx` | Badge/tag component | `variant: 'new' | 'exclusive' | 'limited' | 'sale' | 'sustainability'` |
| 0.14 | `packages/ui/src/avatar.tsx` | Avatar with fallback | `src`, `fallback` (initials), `size`, `shape` |
| 0.15 | `packages/ui/src/skeleton.tsx` | Loading skeleton | `variant: 'text' | 'circular' | 'rectangular'`, `width`, `height`, `animation` |
| 0.16 | `packages/ui/src/dialog.tsx` | Modal dialog (Radix) | `open`, `onOpenChange`, `title`, `description`, `children` |
| 0.17 | `packages/ui/src/drawer.tsx` | Slide-in drawer (Radix) | `side: 'left' | 'right'`, `open`, `onClose`, `children` |
| 0.18 | `packages/ui/src/dropdown-menu.tsx` | Dropdown menu (Radix) | `trigger`, `items: MenuItem[]`, `align` |
| 0.19 | `packages/ui/src/toast.tsx` | Toast notification system | `variant: 'success' | 'error' | 'info'`, `title`, `description`, `duration`, `action` |
| 0.20 | `packages/ui/src/index.ts` | Barrel exports | All components |
| 0.21 | `packages/utils/src/cn.ts` | Class merge utility | `cn(...inputs: ClassValue[]): string` |
| 0.22 | `packages/utils/src/format.ts` | Formatting helpers | `formatPrice(amount, currency)`, `formatDate(date, locale)`, `slugify(text)` |
| 0.23 | `packages/utils/src/index.ts` | Barrel exports | `cn`, `formatPrice`, `formatDate`, `slugify` |
| 0.24 | `packages/db/prisma/schema.prisma` | Full database schema (from PRD §3.4) | All models: User, Account, Session, Address, PaymentMethod, Brand, Product, ProductVariant, ProductImage, ProductVideo, Category, Collection, Tag, Material, Cart, CartItem, Wishlist, WishlistItem, Order, OrderItem, Return, Refund, StyleProfile, SizeProfile, SavedOutfit, BrowsingEvent, SearchQuery, Review, ContentInteraction, LoyaltyTransaction, LoyaltyChallenge, Badge, UserBadge, Referral, Appointment, Stylist, CMSPage, Editorial, SocialConnection + all enums |
| 0.25 | `packages/db/src/client.ts` | Prisma client singleton | `prisma` export with connection pooling |
| 0.26 | `apps/web/next.config.ts` | Next.js 16 config | `appDir: true`, `serverComponentsExternalPackages`, image domains, headers (CSP, CORS) |
| 0.27 | `apps/web/tailwind.config.ts` | Tailwind v4 CSS-first (import tokens) | `@import "../../packages/design-system/tokens.css"` |
| 0.28 | `apps/web/src/app/globals.css` | Global styles | Tailwind import, base layer, reduced-motion, focus-visible |
| 0.29 | `apps/web/src/app/layout.tsx` | Root layout (App Router) | `<html>`, `<body>`, font loading, `<SkipLink>`, `<Navbar>`, `<Footer>`, `<Toaster>` |
| 0.30 | `apps/web/src/app/page.tsx` | Homepage placeholder | Hero placeholder, "Coming Soon" |
| 0.31 | `apps/web/src/components/layout/Navbar.tsx` | Navigation bar | Logo, nav links, search trigger, cart icon with count, user menu, mobile hamburger. `sticky`, backdrop-blur, scroll-aware opacity |
| 0.32 | `apps/web/src/components/layout/Footer.tsx` | Site footer | Newsletter signup, link columns (Shop, About, Support, Legal), social icons, language/currency selector |
| 0.33 | `apps/web/src/components/layout/MobileNav.tsx` | Mobile slide-out navigation | Full-height drawer, animated links, search input |
| 0.34 | `apps/web/src/components/shared/SkipLink.tsx` | Accessibility skip link | `href="#main-content"`, sr-only → visible on focus |
| 0.35 | `apps/web/src/components/shared/ErrorBoundary.tsx` | React error boundary | `fallback` prop, `componentDidCatch` logging |
| 0.36 | `.github/workflows/ci.yml` | CI pipeline | `pnpm install`, `tsc --noEmit`, `vitest run`, `pnpm build`, lint |
| 0.37 | `.github/workflows/deploy.yml` | Deploy to Vercel | Preview on PR, production on main |
| 0.38 | `.env.example` | Environment variable template | `DATABASE_URL`, `REDIS_URL`, `NEXT_PUBLIC_*`, `STRIPE_SECRET_KEY`, etc. |
| 0.39 | `README.md` | Project readme | Setup, architecture, contributing guide |

### 3.2 Features & Interfaces

**Design System (`packages/design-system/`)**:
- Complete Tailwind v4 `@theme inline` with all PRD §4.2 color tokens (obsidian, neon, metallic, atmosphere)
- Golden-ratio spacing scale (`--space-3xs` through `--space-4xl`)
- Fluid typography scale with `clamp()` (hero through caption)
- Luxury animation curves (`--ease-out-expo`, `--ease-luxe`, `--ease-dramatic`)
- Shadow depth system (subtle → dramatic + gold glow)
- Glass/backdrop-blur tokens
- `prefers-reduced-motion` media query disabling all animations

**Component Library (`packages/ui/`)**:
- All components wrap Radix UI primitives with LuxeVerse styling
- `cn()` utility for conditional Tailwind class composition
- Every component exports TypeScript interfaces (no `any`, component-name-prefixed: `ButtonProps`, `DialogProps`)
- Storybook stories for each component (visual regression testing)

**App Shell (`apps/web/`)**:
- Navbar: sticky, scroll-aware (transparent → blurred background), responsive (desktop links → mobile hamburger)
- Footer: 4-column layout, newsletter form, social links
- Root layout: font preloading (Cormorant Garamond, DM Sans), OG meta tags, CSP headers
- SkipLink for WCAG 2.4.1
- ErrorBoundary wrapping the app

---

## 4. Phase 1 — Core Commerce Foundation

**Goal**: Functional product browsing, cart, and checkout with Stripe.  
**Duration**: 6 weeks  
**Prerequisites**: Phase 0 complete  
**Deliverable**: A user can browse products, add to cart, and complete a purchase.

### 4.1 Files to Create

| # | File / Directory | Purpose | Key Interfaces |
|---|---|---|---|
| **API Layer** | | | |
| 1.1 | `apps/api/src/routers/product.ts` | Product tRPC router | `list(filter, sort, pagination)`, `getBySlug(slug)`, `getById(id)`, `getVariants(id)`, `getRelated(id)` |
| 1.2 | `apps/api/src/routers/cart.ts` | Cart tRPC router | `get()`, `addItem(productId, variantId, qty)`, `updateItem(id, qty)`, `removeItem(id)`, `clear()`, `applyCoupon(code)`, `removeCoupon()` |
| 1.3 | `apps/api/src/routers/order.ts` | Order tRPC router | `checkout(input)`, `getById(id)`, `list(status, pagination)`, `cancel(id, reason)` |
| 1.4 | `apps/api/src/routers/user.ts` | User tRPC router | `register(input)`, `login(email, password)`, `logout()`, `me()`, `updateProfile(input)`, `addAddress(input)`, `removeAddress(id)`, `addPaymentMethod(input)` |
| 1.5 | `apps/api/src/routers/category.ts` | Category tRPC router | `list(parentId?)`, `getBySlug(slug)`, `getTree()` |
| 1.6 | `apps/api/src/routers/search.ts` | Search tRPC router | `search(query, filters, sort, pagination)`, `suggestions(query)`, `trending()` |
| 1.7 | `apps/api/src/context.ts` | tRPC context factory | `createContext(req)` → `{ prisma, session, user }` |
| 1.8 | `apps/api/src/trpc.ts` | tRPC initialization | `initTRPC.context<Context>().create()`, middleware (auth, logging, rate-limit) |
| 1.9 | `apps/api/src/auth.ts` | Authentication logic | NextAuth.js v5 config, JWT session strategy, OAuth providers (Google, Apple), email/password |
| 1.10 | `apps/api/src/services/product.service.ts` | Product business logic | `findAll(filter)`, `findBySlug(slug)`, `getInventory(id)`, `calculatePrice(id, variant)` |
| 1.11 | `apps/api/src/services/cart.service.ts` | Cart business logic | `getOrCreate(userId/sessionId)`, `addItem()`, `recalculate()`, `validateInventory()`, `applyDiscounts()` |
| 1.12 | `apps/api/src/services/order.service.ts` | Order business logic | `create(cartId, paymentInfo)`, `processPayment()`, `confirm()`, `ship(trackingInfo)`, `cancel()` |
| 1.13 | `apps/api/src/services/payment.service.ts` | Stripe integration | `createPaymentIntent(amount, currency)`, `confirmPayment(intentId)`, `refund(orderId, amount)` |
| 1.14 | `apps/api/src/services/email.service.ts` | Email notifications (Resend) | `sendOrderConfirmation(order)`, `sendShippingUpdate(order)`, `sendWelcome(user)` |
| **Product Pages** | | | |
| 1.15 | `apps/web/src/app/(shop)/page.tsx` | Shop landing / category browser | Category grid, featured collections, new arrivals |
| 1.16 | `apps/web/src/app/(shop)/[category]/page.tsx` | Category listing page | Product grid, filter sidebar, sort controls, breadcrumbs |
| 1.17 | `apps/web/src/app/(shop)/[category]/[slug]/page.tsx` | Product Detail Page (PDP) | Media gallery, product info, variant selector, add-to-cart, tabs (description, details, sustainability, reviews), sticky add-to-bar |
| 1.18 | `apps/web/src/components/product/ProductCard.tsx` | Product card component | Image with hover effect, brand, name, price, badges, quick-add button. `product: Product`, `variant: 'grid' | 'list' | 'editorial'` |
| 1.19 | `apps/web/src/components/product/ProductGrid.tsx` | Responsive product grid | Masonry/grid toggle, skeleton loading, infinite scroll. `products: Product[]`, `layout: 'grid' | 'masonry'`, `columns: 2 | 3 | 4` |
| 1.20 | `apps/web/src/components/product/ProductGallery.tsx` | Media gallery | Thumbnail navigation, zoom on hover/click, fullscreen mode, video player, 3D viewer hook. `images: ProductImage[]`, `videos: ProductVideo[]`, `model3D?: string` |
| 1.21 | `apps/web/src/components/product/VariantSelector.tsx` | Variant picker | Color swatches, size buttons, material dropdown, inventory-aware (OOS styling). `variants: ProductVariant[]`, `selected: ProductVariant`, `onChange` |
| 1.22 | `apps/web/src/components/product/PriceDisplay.tsx` | Price component | Current price, compare-at with strikethrough, savings badge, installment breakdown (Klarna). `price: Money`, `compareAtPrice?: Money`, `installments?: InstallmentOption` |
| 1.23 | `apps/web/src/components/product/SustainabilityBadge.tsx` | Sustainability score badge | Circular score indicator, tooltip with breakdown. `score: number`, `breakdown: SustainabilityBreakdown` |
| 1.24 | `apps/web/src/components/product/SizeGuide.tsx` | Size guide modal | Measurement table, fit prediction (AI hook), model info. `productId: string`, `category: string` |
| 1.25 | `apps/web/src/components/product/ReviewSummary.tsx` | AI review summary | Rating distribution bar chart, fit accuracy, key highlights. `summary: ReviewSummary` |
| 1.26 | `apps/web/src/components/product/StickyAddToBar.tsx` | Sticky bottom bar on scroll | Product thumbnail, name, price, size selector, add-to-cart. Appears when CTA scrolls out of view. |
| **Cart & Checkout** | | | |
| 1.27 | `apps/web/src/components/cart/CartDrawer.tsx` | Slide-in cart drawer | Item list, quantity controls, remove with undo, subtotal, coupon input, checkout CTA. `open: boolean`, `onClose` |
| 1.28 | `apps/web/src/components/cart/CartItem.tsx` | Individual cart item | Image, name, variant, quantity stepper, price, remove button. `item: CartItem` |
| 1.29 | `apps/web/src/components/cart/CartSummary.tsx` | Cart totals breakdown | Subtotal, shipping estimate, tax, discount, total, installment option |
| 1.30 | `apps/web/src/components/cart/FreeShippingProgress.tsx` | Free shipping threshold bar | Progress bar, amount remaining, suggested items. `current: number`, `threshold: number` |
| 1.31 | `apps/web/src/app/checkout/page.tsx` | Checkout page | Multi-step: Shipping → Payment → Review → Confirmation |
| 1.32 | `apps/web/src/components/checkout/ShippingStep.tsx` | Shipping address form | Address autocomplete, saved addresses, gift options |
| 1.33 | `apps/web/src/components/checkout/PaymentStep.tsx` | Payment form | Stripe Elements, saved cards, express pay (Apple Pay, Google Pay), BNPL options |
| 1.34 | `apps/web/src/components/checkout/ReviewStep.tsx` | Order review | Editable summary, terms acceptance, place order button |
| 1.35 | `apps/web/src/components/checkout/ConfirmationStep.tsx` | Order confirmation | Order number, estimated delivery, tracking, recommendations |
| 1.36 | `apps/web/src/components/checkout/ExpressCheckout.tsx` | Express payment buttons | Apple Pay, Google Pay, Shop Pay, PayPal — positioned at top of checkout |
| **State & Hooks** | | | |
| 1.37 | `apps/web/src/stores/cart.ts` | Cart Zustand store | `items: CartItem[]`, `addItem()`, `updateQuantity()`, `removeItem()`, `total`, `itemCount`. Persist with `partialize` (data only, no UI state) |
| 1.38 | `apps/web/src/stores/auth.ts` | Auth Zustand store | `user: User | null`, `isAuthenticated`, `login()`, `logout()`, `register()` |
| 1.39 | `apps/web/src/hooks/useProduct.ts` | Product data hook | `useProduct(slug)` → `{ product, isLoading, error }` via tRPC |
| 1.40 | `apps/web/src/hooks/useCart.ts` | Cart operations hook | `useCart()` → `{ items, addItem, updateItem, removeItem, total, itemCount }` |
| 1.41 | `apps/web/src/hooks/useSearch.ts` | Search hook | `useSearch(query, filters)` → `{ results, isLoading, suggestions, facets }` |
| 1.42 | `apps/web/src/lib/schemas.ts` | Zod validation schemas | `checkoutSchema`, `addressSchema`, `loginSchema`, `registerSchema` |
| 1.43 | `apps/web/src/lib/format.ts` | Client-side formatters | `formatPrice()`, `formatDate()`, `truncateText()` |
| **Auth Pages** | | | |
| 1.44 | `apps/web/src/app/(auth)/login/page.tsx` | Login page | Email/password form, social login buttons, "Forgot password" link, register link |
| 1.45 | `apps/web/src/app/(auth)/register/page.tsx` | Registration page | Form with validation, terms acceptance, social signup |
| 1.46 | `apps/web/src/app/(auth)/forgot-password/page.tsx` | Password reset | Email input, send reset link |

### 4.2 Features & Interfaces

**Product Listing (PLP)**:
- Server-side rendered with ISR (revalidate every 60s)
- Filter sidebar: brand, category, price range, size, color, material, sustainability score, availability
- Sort: relevance, price asc/desc, newest, bestselling, rating
- URL-synced filters (shareable/bookmarkable)
- Responsive grid: 2 cols mobile → 3 tablet → 4 desktop
- Skeleton loading during navigation
- Infinite scroll with "Load More" fallback

**Product Detail Page (PDP)**:
- Server Component shell with Client Component islands (gallery, variant selector, add-to-cart)
- Media gallery: thumbnail strip, zoom, fullscreen, video autoplay on hover
- Variant selection with real-time inventory check and image swap
- Sticky add-to-bar appears when main CTA scrolls out of viewport
- Tabs: Description (rich text), Details (specs table), Sustainability (scorecard), Reviews (placeholder)
- Breadcrumbs with schema.org markup
- OG meta tags generated from product data

**Cart**:
- Zustand store persisted to localStorage (data only, not UI state)
- Cart drawer slides in from right with backdrop blur
- Optimistic updates (instant UI, async sync)
- Undo toast on item removal (5s window)
- Free shipping progress bar with suggested items
- Coupon code input with real-time validation

**Checkout**:
- Multi-step form with progress indicator
- Stripe Elements for payment (PCI-compliant, no raw card data)
- Express checkout (Apple Pay, Google Pay) at top
- Address autocomplete via Google Places API
- Order summary sidebar (sticky)
- Guest checkout with post-purchase account creation prompt

**Authentication**:
- NextAuth.js v5 with JWT sessions
- OAuth: Google, Apple
- Email/password with bcrypt
- CSRF protection, secure httpOnly cookies
- Role-based access (CUSTOMER, ADMIN, EDITOR)

---

## 5. Phase 2 — Shopping Experience

**Goal**: Cinematic homepage, advanced search, editorial content, and rich product experiences.  
**Duration**: 6 weeks  
**Prerequisites**: Phase 1 complete  
**Deliverable**: A visually stunning, content-rich luxury shopping experience.

### 5.1 Files to Create

| # | File / Directory | Purpose | Key Interfaces |
|---|---|---|---|
| **Homepage** | | | |
| 2.1 | `apps/web/src/app/page.tsx` | Cinematic homepage (rewrite) | Hero section, featured collections, new arrivals, editorial highlights, brand stories, newsletter |
| 2.2 | `apps/web/src/components/sections/HeroSection.tsx` | Full-viewport hero | Video background (responsive), cinematic overlays (gradient, particles, grain), headline with split-reveal animation, CTA with magnetic hover, scroll indicator. `config: HeroSection` |
| 2.3 | `apps/web/src/components/sections/FeaturedCollections.tsx` | Collection showcase | Horizontal scroll or grid, image reveal on hover, collection title + count. `collections: Collection[]` |
| 2.4 | `apps/web/src/components/sections/NewArrivals.tsx` | New arrivals carousel | Auto-scroll, peek animation, product cards with hover zoom. `products: Product[]` |
| 2.5 | `apps/web/src/components/sections/EditorialHighlight.tsx` | Editorial preview block | Large image, category tag, title, excerpt, read-more. `editorial: Editorial` |
| 2.6 | `apps/web/src/components/sections/BrandStory.tsx` | Brand narrative section | Split layout (text + image), parallax scroll, brand heritage. `brand: Brand` |
| 2.7 | `apps/web/src/components/sections/NewsletterSection.tsx` | Newsletter signup | Email input, animated submit, success state, background texture |
| 2.8 | `apps/web/src/components/sections/SocialProof.tsx` | Trust indicators | Review count, rating, press logos, Instagram feed preview |
| 2.9 | `apps/web/src/components/sections/CategoryShowcase.tsx` | Category grid with imagery | Large format category cards with hover reveal. `categories: Category[]` |
| **Search & Discovery** | | | |
| 2.10 | `apps/web/src/components/search/SearchOverlay.tsx` | Full-screen search overlay | Triggered from navbar, recent searches, trending, autocomplete, voice search hook. `open: boolean`, `onClose` |
| 2.11 | `apps/web/src/components/search/SearchInput.tsx` | Search input with autocomplete | Debounced input, suggestion dropdown, visual search button. `onSearch`, `suggestions: string[]` |
| 2.12 | `apps/web/src/components/search/SearchResults.tsx` | Search results page | Product grid, facet sidebar, sort, pagination, no-results state with AI suggestions |
| 2.13 | `apps/web/src/components/search/FacetFilter.tsx` | Faceted filter component | Collapsible sections, multi-select, count display, searchable within facet. `facet: Facet`, `selected: string[]`, `onChange` |
| 2.14 | `apps/web/src/components/search/VisualSearchButton.tsx` | Visual search trigger | Camera icon, upload modal, drag-drop zone |
| 2.15 | `apps/web/src/app/search/page.tsx` | Search results page | URL-synced filters, results grid, facets sidebar |
| **Editorial / CMS** | | | |
| 2.16 | `apps/web/src/app/editorial/page.tsx` | Editorial index | Grid of articles, category filter, featured story |
| 2.17 | `apps/web/src/app/editorial/[slug]/page.tsx` | Article page | Rich text content, product embeds, related products, share buttons |
| 2.18 | `apps/web/src/components/editorial/ArticleCard.tsx` | Article preview card | Cover image, category, title, excerpt, read time, author |
| 2.19 | `apps/web/src/components/editorial/RichTextRenderer.tsx` | CMS content renderer | Structured blocks: text, image, gallery, product-card, quote, pullout, comparison, timeline |
| 2.20 | `apps/web/src/components/editorial/ProductEmbed.tsx` | Inline product in editorial | Mini product card with quick-add. `productId: string` |
| **Account Pages** | | | |
| 2.21 | `apps/web/src/app/account/page.tsx` | Account dashboard | Welcome, order summary, loyalty status, style profile prompt, quick links |
| 2.22 | `apps/web/src/app/account/orders/page.tsx` | Order history | Order list with status badges, filter by status, reorder button |
| 2.23 | `apps/web/src/app/account/orders/[id]/page.tsx` | Order detail | Order timeline, items, tracking, return request |
| 2.24 | `apps/web/src/app/account/addresses/page.tsx` | Address book | Address list, add/edit modal, set default |
| 2.25 | `apps/web/src/app/account/wishlist/page.tsx` | Wishlist page | Product grid, move-to-cart, share wishlist |
| 2.26 | `apps/web/src/app/account/profile/page.tsx` | Profile settings | Name, email, phone, avatar upload, password change |
| **Animations & Interactions** | | | |
| 2.27 | `apps/web/src/components/shared/ParallaxSection.tsx` | Parallax scroll wrapper | Multi-layer parallax with depth config. `layers: ParallaxLayer[]` |
| 2.28 | `apps/web/src/components/shared/ScrollReveal.tsx` | Scroll-triggered reveal | Fade-in, scale-in, slide-in with viewport detection. `animation`, `delay`, `threshold` |
| 2.29 | `apps/web/src/components/shared/MagneticButton.tsx` | Magnetic hover button | Element follows cursor within radius. `strength`, `radius` |
| 2.30 | `apps/web/src/components/shared/TextReveal.tsx` | Character-by-character text reveal | Staggered animation for headlines. `text`, `delay`, `stagger` |
| 2.31 | `apps/web/src/components/shared/ImageReveal.tsx` | Image curtain/wipe reveal | clipPath animation on viewport entry. `direction: 'left' | 'right' | 'center'` |
| 2.32 | `apps/web/src/components/shared/PageTransition.tsx` | Page transition wrapper | Blur + fade transition between routes. Framer Motion `AnimatePresence` |
| **3D & Media** | | | |
| 2.33 | `apps/web/src/components/product/ProductViewer3D.tsx` | 3D product viewer (R3F) | GLB/GLTF loader, orbit controls, environment maps, annotations, auto-rotate. `modelUrl: string`, `annotations: Annotation[]` |
| 2.34 | `apps/web/src/components/product/VideoPlayer.tsx` | Product video player | Mux/Cloudflare Stream embed, chapters, quality selector, autoplay on hover. `src: string`, `poster: string`, `chapters: Chapter[]` |
| 2.35 | `apps/web/src/components/shared/BeforeAfterSlider.tsx` | Before/after image comparison | Draggable divider, touch support. `before: string`, `after: string` |
| **Wishlist** | | | |
| 2.36 | `apps/web/src/stores/wishlist.ts` | Wishlist Zustand store | `items: WishlistItem[]`, `addItem()`, `removeItem()`, `isInWishlist(productId)` |
| 2.37 | `apps/web/src/hooks/useWishlist.ts` | Wishlist operations hook | Sync with API, optimistic updates |

### 5.2 Features & Interfaces

**Cinematic Homepage**:
- Full-viewport hero with responsive video (4K desktop → 720p mobile)
- Cinematic overlays: animated gradient mesh, floating particles (golden dust), film grain, vignette
- Headline: split-reveal character animation (Framer Motion `staggerChildren`)
- CTA: magnetic hover effect (element follows cursor within 100px radius)
- Scroll indicator: animated chevron with "Scroll to explore"
- Each section uses scroll-triggered reveal animations (`whileInView`)
- Film-grain texture overlay for editorial atmosphere

**Search & Discovery**:
- Full-screen search overlay (Cmd+K / Ctrl+K shortcut)
- Autocomplete with debounced API calls (300ms)
- Recent searches (localStorage), trending searches (API), personalized suggestions
- Visual search: upload image → AI returns similar products
- Faceted filters in sidebar: collapsible, searchable, multi-select, count display
- URL-synced state for shareability

**Editorial System**:
- Rich content renderer supporting 12+ block types
- Product embeds within articles (mini cards with quick-add)
- Reading time estimation
- Social sharing (OG image auto-generation)
- Related products at article end

**Animations**:
- All animations respect `prefers-reduced-motion`
- GPU-accelerated (transform, opacity only)
- Luxury easing curves from design system tokens
- Scroll-triggered: `viewport: { once: true, margin: '-100px' }`
- Parallax: 3-layer depth system (deep: -80px, mid: -50px, surface: -20px)

---

## 6. Phase 3 — Personalization & AI

**Goal**: AI stylist, style quiz, personalized recommendations, and virtual try-on.  
**Duration**: 6 weeks  
**Prerequisites**: Phase 2 complete  
**Deliverable**: Personalized shopping with AI-powered outfit generation and size recommendations.

### 6.1 Files to Create

| # | File / Directory | Purpose | Key Interfaces |
|---|---|---|---|
| **AI Service** | | | |
| 3.1 | `apps/api/src/services/ai.service.ts` | AI orchestration service | `generateOutfit(productId, occasion, style, budget)`, `getSizeRecommendation(productId, measurements)`, `getStyleAdvice(query, context)`, `generateProductDescription(product, style)`, `summarizeReviews(productId)` |
| 3.2 | `apps/api/src/services/recommendation.service.ts` | Recommendation engine | `getPersonalized(userId, limit)`, `getSimilar(productId, limit)`, `getCompleteTheLook(productId)`, `getTrending(limit)`, `getNewForYou(userId, limit)` |
| 3.3 | `apps/api/src/services/style-profile.service.ts` | Style profile management | `create(userId)`, `update(userId, data)`, `analyzeFromPurchases(userId)`, `getStylePersona(userId)` |
| 3.4 | `apps/api/src/routers/ai.ts` | AI tRPC router | `generateOutfit(input)`, `getSizeRecommendation(input)`, `getStyleAdvice(input)`, `getStyleProfile()`, `updateStyleProfile(input)`, `submitStyleQuiz(input)` |
| 3.5 | `apps/api/src/routers/recommendation.ts` | Recommendation tRPC router | `personalized(limit)`, `similar(productId, limit)`, `completeTheLook(productId)`, `trending(limit)`, `newForYou(limit)` |
| **Style Quiz** | | | |
| 3.6 | `apps/web/src/app/style-quiz/page.tsx` | Style quiz page | Multi-step visual quiz with progress bar |
| 3.7 | `apps/web/src/components/style-quiz/QuizContainer.tsx` | Quiz flow controller | Step management, back/next, progress, save draft. `steps: QuizStep[]` |
| 3.8 | `apps/web/src/components/style-quiz/VisualChoiceStep.tsx` | Visual choice question | Grid of images, multi-select, animated selection. `options: QuizOption[]`, `selected: string[]`, `onChange` |
| 3.9 | `apps/web/src/components/style-quiz/MoodBoardStep.tsx` | Mood board selection | Draggable mood boards, select favorites. `boards: MoodBoard[]` |
| 3.10 | `apps/web/src/components/style-quiz/ColorPaletteStep.tsx` | Color preference picker | Pick/rank/exclude colors. `mode: 'pick' | 'rank' | 'exclude'` |
| 3.11 | `apps/web/src/components/style-quiz/StyleIconStep.tsx` | Style icon selection | Celebrity/style icon cards, select inspirations. `icons: StyleIcon[]` |
| 3.12 | `apps/web/src/components/style-quiz/QuizResult.tsx` | Quiz result / style persona | Persona card, trait badges, recommended products CTA |
| **AI Stylist** | | | |
| 3.13 | `apps/web/src/app/ai-stylist/page.tsx` | AI stylist page | Chat interface + outfit builder |
| 3.14 | `apps/web/src/components/ai-stylist/StyleAdvisorChat.tsx` | Conversational AI stylist | Chat UI, message bubbles, product suggestions inline, outfit cards. Streaming responses. |
| 3.15 | `apps/web/src/components/ai-stylist/OutfitCard.tsx` | Generated outfit display | Flatlay/moodboard view, item list with roles, total price, save/share/swap. `outfit: Outfit` |
| 3.16 | `apps/web/src/components/ai-stylist/OutfitItemCard.tsx` | Item within outfit | Product image, role label ("Hero Piece", "Foundation"), reasoning tooltip, swap button. `item: OutfitItem` |
| 3.17 | `apps/web/src/components/ai-stylist/StylePersonaCard.tsx` | Style persona display | Persona name, traits, color palette, aesthetic scores. `profile: StyleProfile` |
| 3.18 | `apps/web/src/components/ai-stylist/CompleteTheLook.tsx` | PDP "Complete the Look" section | Horizontal scroll of outfit suggestions with bundle pricing. `productId: string` |
| **Size & Fit** | | | |
| 3.19 | `apps/web/src/components/size/SizeRecommendation.tsx` | AI size recommender | Recommended size with confidence, fit notes, comparison to similar items. `productId: string`, `profile: SizeProfile` |
| 3.20 | `apps/web/src/components/size/MeasurementInput.tsx` | Measurement input form | Fields for height, weight, chest, waist, hips, inseam with unit toggle. Guide images. |
| 3.21 | `apps/web/src/components/size/FitHeatmap.tsx` | Visual fit heatmap | Body outline with tight/loose zones colored. `fitData: FitAnalysis` |
| **Recommendations** | | | |
| 3.22 | `apps/web/src/components/recommendations/PersonalizedGrid.tsx` | Personalized product grid | "Recommended for You" section with AI reasoning. `products: Product[]`, `title: string` |
| 3.23 | `apps/web/src/components/recommendations/SimilarProducts.tsx` | Similar products carousel | Horizontal scroll, similarity score badge. `productId: string` |
| 3.24 | `apps/web/src/components/recommendations/RecentlyViewed.tsx` | Recently viewed carousel | Browser history-based, persist across sessions. |
| 3.25 | `apps/web/src/stores/style-profile.ts` | Style profile store | `profile: StyleProfile | null`, `quizCompleted`, `updateProfile()` |

### 6.2 Features & Interfaces

**Style Quiz**:
- 5-step visual quiz: style preferences → mood boards → color palette → style icons → body/fit preferences
- Adaptive questions (next depends on previous answer)
- Visual-first: images over text, mood boards over lists
- Progress bar with step indicators
- Results: style persona card with traits, color palette, recommended starting products
- Saves to `StyleProfile` model in database

**AI Stylist Chat**:
- Streaming responses via Server-Sent Events
- Context-aware: knows user's style profile, browsing history, wishlist
- Can generate complete outfits from a single product
- Inline product cards with quick-add
- Outfit visualization: flatlay view with drag-to-rearrange
- "Swap" functionality: replace any item in generated outfit

**Size Recommendation**:
- Input: manual measurements, photo-based (ML), or inferred from purchase history
- Output: recommended size per brand with confidence score (0-100)
- Fit notes: "Runs slightly large in shoulders"
- Heatmap visualization of fit zones
- Cross-brand size mapping

**Recommendations**:
- Collaborative filtering (users who bought X also bought Y)
- Content-based (product attribute similarity)
- Hybrid with dynamic weighting
- Placements: homepage, PDP, cart, email
- Fairness: brand exposure balance, price distribution, category diversity

---

## 7. Phase 4 — Scale, Loyalty & Social

**Goal**: Loyalty program, social commerce, internationalization, and mobile PWA.  
**Duration**: 6 weeks  
**Prerequisites**: Phase 3 complete  
**Deliverable**: Global-ready platform with loyalty, social features, and PWA.

### 7.1 Files to Create

| # | File / Directory | Purpose | Key Interfaces |
|---|---|---|---|
| **Loyalty** | | | |
| 4.1 | `apps/api/src/services/loyalty.service.ts` | Loyalty program logic | `earnPoints(userId, orderId)`, `redeemPoints(userId, points)`, `getTier(userId)`, `checkTierUpgrade(userId)`, `getChallenges(userId)`, `claimChallenge(userId, challengeId)` |
| 4.2 | `apps/api/src/routers/loyalty.ts` | Loyalty tRPC router | `getProfile()`, `getChallenges()`, `joinChallenge(id)`, `redeemPoints(input)`, `getTransactions()`, `getBadges()` |
| 4.3 | `apps/web/src/app/loyalty/page.tsx` | Loyalty dashboard | Tier progress, points balance, active challenges, badge showcase, referral link |
| 4.4 | `apps/web/src/components/loyalty/TierProgress.tsx` | Tier progress card | Current tier badge, progress bar to next tier, benefits list. `tier: LoyaltyTier`, `points: number`, `nextTier: LoyaltyTier` |
| 4.5 | `apps/web/src/components/loyalty/ChallengeCard.tsx` | Challenge display | Challenge icon, progress bar, reward points, deadline, join/claim button. `challenge: LoyaltyChallenge` |
| 4.6 | `apps/web/src/components/loyalty/BadgeShowcase.tsx` | Badge collection | Grid of earned/locked badges with rarity indicators. `badges: UserBadge[]` |
| 4.7 | `apps/web/src/components/loyalty/PointsHistory.tsx` | Points transaction list | Earned/redeemed history with running balance. `transactions: LoyaltyTransaction[]` |
| 4.8 | `apps/web/src/components/loyalty/ReferralCard.tsx` | Referral sharing | Copy link, share buttons, referral stats. `referralCode: string` |
| **Social Commerce** | | | |
| 4.9 | `apps/api/src/services/social.service.ts` | Social commerce logic | `getUGC(productId)`, `connectAccount(userId, platform)`, `shareOutfit(userId, outfitId, platform)` |
| 4.10 | `apps/api/src/routers/social.ts` | Social tRPC router | `getUGC(productId)`, `connectAccount(input)`, `disconnectAccount(platform)`, `shareToSocial(input)` |
| 4.11 | `apps/web/src/components/social/UGCGallery.tsx` | User-generated content gallery | Instagram + customer photos grid, product tagging, "Shop this look". `photos: UGCPhoto[]` |
| 4.12 | `apps/web/src/components/social/InfluencerCard.tsx` | Influencer mention card | Avatar, name, followers, post image, shop-the-look links. `influencer: InfluencerMention` |
| 4.13 | `apps/web/src/components/social/ShareButton.tsx` | Social share button | Native share API fallback to copy-link. `url`, `title`, `image` |
| 4.14 | `apps/web/src/components/social/SocialConnect.tsx` | Social account linking | Connect/disconnect Instagram, TikTok, Pinterest |
| **Internationalization** | | | |
| 4.15 | `apps/web/src/i18n/config.ts` | i18n configuration | Supported locales, default locale, routing strategy |
| 4.16 | `apps/web/src/i18n/locales/en.json` | English translations | All UI strings |
| 4.17 | `apps/web/src/i18n/locales/fr.json` | French translations | All UI strings |
| 4.18 | `apps/web/src/i18n/locales/ja.json` | Japanese translations | All UI strings |
| 4.19 | `apps/web/src/i18n/locales/ar.json` | Arabic translations (RTL) | All UI strings |
| 4.20 | `apps/web/src/components/shared/LanguageSwitcher.tsx` | Language picker | Dropdown with flag icons, current locale display |
| 4.21 | `apps/web/src/components/shared/CurrencySwitcher.tsx` | Currency picker | Dropdown with currency symbols, auto-detect option |
| 4.22 | `apps/web/src/middleware.ts` | Locale detection middleware | Geo-IP + Accept-Language detection, redirect to locale path |
| **Mobile PWA** | | | |
| 4.23 | `apps/web/public/manifest.json` | PWA manifest | App name, icons, theme color, display: standalone |
| 4.24 | `apps/web/src/service-worker.ts` | Service worker | Cache strategies: cache-first for assets, network-first for API, stale-while-revalidate for images |
| 4.25 | `apps/web/src/components/mobile/BottomNav.tsx` | Mobile bottom tab bar | Home, Search, Cart, Account tabs with badge counts |
| 4.26 | `apps/web/src/components/mobile/PullToRefresh.tsx` | Pull-to-refresh wrapper | Custom animation, haptic feedback |
| 4.27 | `apps/web/src/components/mobile/InstallPrompt.tsx` | PWA install prompt | Contextual prompt with incentive (discount code) |
| 4.28 | `apps/web/src/components/mobile/OfflineState.tsx` | Offline fallback page | Cached content display, retry button |
| **Sustainability** | | | |
| 4.29 | `apps/api/src/services/sustainability.service.ts` | Sustainability scoring | `calculateScore(productId)`, `getCarbonFootprint(productId)`, `getAlternatives(productId)` |
| 4.30 | `apps/web/src/components/sustainability/SustainabilityScorecard.tsx` | Full sustainability display | Circular score, breakdown bars (materials, labor, carbon, packaging), certifications. `report: SustainabilityReport` |
| 4.31 | `apps/web/src/components/sustainability/CarbonFootprint.tsx` | Carbon footprint display | kg CO₂ comparison, offset option. `carbonKg: number` |
| 4.32 | `apps/web/src/components/sustainability/CertificationBadges.tsx` | Certification badges | Organic, Fair Trade, B Corp, etc. `certifications: Certification[]` |
| **Notifications** | | | |
| 4.33 | `apps/api/src/services/notification.service.ts` | Notification service | `send(userId, type, data)`, `getUnread(userId)`, `markRead(id)` |
| 4.34 | `apps/web/src/app/account/notifications/page.tsx` | Notification center | Notification list with read/unread state, type icons |
| 4.35 | `apps/web/src/components/shared/NotificationBell.tsx` | Notification bell icon | Unread count badge, dropdown preview |

### 7.2 Features & Interfaces

**Loyalty Program ("Luxe Rewards")**:
- 5 tiers: Bronze → Silver → Gold → Platinum → Black
- Points: earn on purchases, reviews, referrals, challenges
- Challenges: gamified goals ("Buy 3 items from Sustainability collection")
- Badges: rarity-based (Common, Rare, Epic, Legendary)
- Referral system: unique codes, dual-sided rewards
- Dashboard: tier progress, points balance, challenge tracker

**Social Commerce**:
- UGC gallery: Instagram photos + customer uploads with product tagging
- "Shop this look": click on UGC photo → see tagged products
- Influencer portal: curated influencer content with attribution
- Social sharing: native Web Share API with fallback

**Internationalization**:
- `next-intl` for server-side locale detection
- RTL support for Arabic (CSS logical properties)
- Multi-currency with auto-detection
- Cultural adaptation (date formats, number formats, address formats)
- Path-based routing: `/en/products/...`, `/fr/products/...`

**PWA**:
- Service worker with cache strategies per content type
- Offline browsing for recently viewed products and wishlist
- Push notifications for order updates, price drops, back-in-stock
- Bottom tab navigation on mobile (thumb-zone optimized)
- Install prompt with incentive

---

## 8. Phase 5 — Polish, Testing & Launch

**Goal**: Production hardening, comprehensive testing, performance optimization, and launch.  
**Duration**: 4 weeks  
**Prerequisites**: Phase 4 complete  
**Deliverable**: Launch-ready platform with full test coverage, monitoring, and documentation.

### 8.1 Files to Create

| # | File / Directory | Purpose | Key Interfaces |
|---|---|---|---|
| **Testing** | | | |
| 5.1 | `apps/web/vitest.config.ts` | Vitest configuration | jsdom environment, setup files, path aliases |
| 5.2 | `apps/web/src/test/setup.ts` | Test setup | `@testing-library/jest-dom/vitest`, requestAnimationFrame mock |
| 5.3 | `apps/web/src/test/factories.ts` | Test data factories | `getMockProduct(overrides)`, `getMockUser(overrides)`, `getMockCart(overrides)` |
| 5.4 | `apps/web/src/components/product/__tests__/ProductCard.test.tsx` | Product card tests | Renders correctly, handles click, shows badges, responsive |
| 5.5 | `apps/web/src/components/product/__tests__/VariantSelector.test.tsx` | Variant selector tests | Selects variant, shows OOS, updates price |
| 5.6 | `apps/web/src/components/cart/__tests__/CartDrawer.test.tsx` | Cart drawer tests | Opens/closes, adds item, removes with undo, calculates totals |
| 5.7 | `apps/web/src/components/checkout/__tests__/CheckoutFlow.test.tsx` | Checkout E2E tests | Full flow: shipping → payment → review → confirmation |
| 5.8 | `apps/web/src/stores/__tests__/cart.test.ts` | Cart store tests | Add/update/remove, persistence, optimistic updates |
| 5.9 | `apps/web/src/hooks/__tests__/useSearch.test.ts` | Search hook tests | Debounced queries, filter changes, suggestions |
| 5.10 | `apps/api/src/services/__tests__/product.service.test.ts` | Product service tests | CRUD, filtering, sorting, pagination |
| 5.11 | `apps/api/src/services/__tests__/cart.service.test.ts` | Cart service tests | Add/remove items, coupon validation, inventory check |
| 5.12 | `apps/api/src/services/__tests__/order.service.test.ts` | Order service tests | Checkout flow, payment processing, cancellation |
| 5.13 | `e2e/homepage.spec.ts` | Homepage E2E (Playwright) | Hero loads, navigation works, products display |
| 5.14 | `e2e/product-browse.spec.ts` | Product browsing E2E | Category → PLP → PDP → Add to Cart flow |
| 5.15 | `e2e/checkout.spec.ts` | Checkout E2E | Full purchase flow with Stripe test card |
| 5.16 | `e2e/search.spec.ts` | Search E2E | Search, filter, sort, visual search |
| 5.17 | `e2e/auth.spec.ts` | Authentication E2E | Register, login, logout, password reset |
| 5.18 | `e2e/accessibility.spec.ts` | Accessibility E2E | Axe-core audit on all pages, keyboard navigation |
| **Performance** | | | |
| 5.19 | `apps/web/next.config.ts` | Performance-optimized Next.js config | Image optimization, bundle analysis, headers |
| 5.20 | `apps/web/src/components/shared/LazyLoad.tsx` | Lazy loading wrapper | Intersection Observer, skeleton fallback |
| 5.21 | `apps/web/public/sw.js` | Production service worker | Optimized caching strategies |
| 5.22 | `lighthouserc.json` | Lighthouse CI config | Performance budget, assertions |
| **Monitoring** | | | |
| 5.23 | `apps/web/src/lib/analytics.ts` | Analytics integration | GA4, custom events, conversion tracking |
| 5.24 | `apps/web/src/lib/sentry.ts` | Sentry error tracking | Client + server config, source maps |
| 5.25 | `apps/web/src/lib/datadog-rum.ts` | Datadog RUM | Real user monitoring, session replay |
| 5.26 | `apps/web/src/app/error.tsx` | Global error page | Error display, retry button, report link |
| 5.27 | `apps/web/src/app/not-found.tsx` | 404 page | Search suggestions, popular products, back home |
| 5.28 | `apps/web/src/app/loading.tsx` | Global loading state | Skeleton layout |
| **Documentation** | | | |
| 5.29 | `docs/architecture.md` | Architecture documentation | System diagram, data flow, service boundaries |
| 5.30 | `docs/design-system.md` | Design system documentation | Tokens, components, usage guidelines |
| 5.31 | `docs/api.md` | API documentation | tRPC router reference, GraphQL schema |
| 5.32 | `docs/deployment.md` | Deployment guide | Vercel setup, environment variables, CI/CD |
| 5.33 | `docs/contributing.md` | Contributing guide | Code style, PR process, testing requirements |
| 5.34 | `CHANGELOG.md` | Release changelog | Semantic versioning, feature descriptions |
| **Admin (Skeleton)** | | | |
| 5.35 | `apps/admin/src/app/layout.tsx` | Admin layout | Sidebar nav, header, auth guard |
| 5.36 | `apps/admin/src/app/page.tsx` | Admin dashboard | Revenue chart, order count, low stock alerts |
| 5.37 | `apps/admin/src/app/products/page.tsx` | Product management | Product list, search, bulk actions |
| 5.38 | `apps/admin/src/app/orders/page.tsx` | Order management | Order list, status filter, detail view |
| 5.39 | `apps/admin/src/app/customers/page.tsx` | Customer management | Customer list, profile view, order history |

### 8.2 Features & Interfaces

**Testing Strategy**:
- **Unit Tests** (Vitest): All stores, hooks, services, utilities
- **Component Tests** (Testing Library): All interactive components
- **E2E Tests** (Playwright): Critical user flows (browse → cart → checkout → confirmation)
- **Accessibility Tests** (axe-core): Every page, WCAG 2.1 AA compliance
- **Performance Tests** (Lighthouse CI): Performance budget enforcement in CI
- **Visual Regression** (Playwright screenshots): Key pages across breakpoints

**Performance Targets**:
| Metric | Target | Strategy |
|---|---|---|
| LCP | < 2.5s | SSR + image optimization + font preloading |
| CLS | < 0.1 | Reserved space for images, skeleton loading |
| INP | < 200ms | Code splitting, lazy loading, compositor-only animations |
| Bundle Size | < 200KB (initial) | Tree shaking, dynamic imports, `manualChunks` |
| Lighthouse | > 90 | Continuous monitoring via Lighthouse CI |

**Security**:
- CSP headers (no `'unsafe-inline'` in production)
- OWASP 2025 compliance
- Stripe PCI DSS SAQ-A
- Rate limiting on all API endpoints
- Input validation with Zod at all boundaries
- CSRF protection, XSS prevention, SQL injection prevention (Prisma)

---

## 9. Cross-Cutting Concerns

### 9.1 Design Tokens (Referenced by All Phases)

All components MUST use design tokens from `packages/design-system/tokens.css`:
- Colors: `var(--color-obsidian-900)`, `var(--color-neon-pink)`, `var(--color-metallic-gold)`
- Typography: `var(--font-size-hero)`, `var(--font-display)`, `var(--font-body)`
- Spacing: `var(--space-sm)`, `var(--space-md)`, `var(--space-lg)`
- Animation: `var(--ease-out-expo)`, `var(--duration-normal)`
- Shadows: `var(--shadow-subtle)`, `var(--shadow-dramatic)`, `var(--shadow-glow)`

### 9.2 Anti-Generic Checklist (Every Component)

- [ ] No purple/indigo default colors
- [ ] No `rounded-2xl` on everything
- [ ] No generic hero section templates
- [ ] No placeholder lorem ipsum text
- [ ] No oversized uniform padding
- [ ] No stock card grids without purpose
- [ ] No shadow-heavy design
- [ ] Uses project color palette, not AI defaults
- [ ] Typography follows hierarchy (no skipped heading levels)
- [ ] Spacing uses design system scale (no arbitrary pixel values)

### 9.3 Accessibility Requirements (Every Page)

- [ ] Skip-to-content link present and functional
- [ ] All interactive elements keyboard accessible (Tab, Enter, Escape)
- [ ] Focus trap in modals/drawers
- [ ] ARIA labels on all interactive elements without visible text
- [ ] Color contrast ≥ 4.5:1 (normal text), ≥ 3:1 (large text)
- [ ] `prefers-reduced-motion` respected
- [ ] Meaningful empty states with actionable guidance
- [ ] Error states with clear messaging and recovery actions
- [ ] Loading states with skeleton placeholders (not spinners for content)

### 9.4 State Management Rules

| State Type | Solution | Example |
|---|---|---|
| Component-local UI | `useState` | Modal open/close, dropdown state |
| Shared sibling | Lifted state | Filter → Product grid |
| Theme/auth/locale | Context | Dark mode, current user, language |
| URL state | `searchParams` | Filters, pagination, search query |
| Server state | TanStack Query / tRPC | Products, orders, recommendations |
| Complex client | Zustand | Cart, wishlist, UI preferences |

**Zustand Rules**:
- Selector in JSX: `useStore(s => s.field)` — never `.getState()` in render
- Persist data only: `partialize: (s) => ({ cart: s.cart })` — never persist UI state
- Store-to-store calls OK inside store logic, not in components

---

## 10. Validation Checklist

This plan is validated against:

### PRD Alignment
- [x] Phase 0 covers PRD §3 (Architecture), §4 (Design System)
- [x] Phase 1 covers PRD §5.1-5.3 (Homepage, PDP, Cart, Checkout)
- [x] Phase 2 covers PRD §5.4 (Search), §8 (CMS), animation system
- [x] Phase 3 covers PRD §6 (AI Features), style quiz, recommendations
- [x] Phase 4 covers PRD §9 (i18n), §10 (PWA), §11 (Loyalty), §12 (Social), §18 (Sustainability)
- [x] Phase 5 covers PRD §21 (Performance), §22 (Testing), §23 (DevOps)

### Skills Alignment
- [x] Tailwind v4 CSS-first config (no `tailwind.config.js`) — per `react19-ts6-vite8-tailwindv4-mvp`
- [x] TypeScript strict + `erasableSyntaxOnly` + no `any` — per all skills
- [x] Shadcn/UI + Radix primitives (library discipline) — per `frontend-ui-engineering`
- [x] Zustand with selector discipline — per `react19-ts6-vite8-tailwindv4-mvp`
- [x] Zod validation at boundaries — per `react19-ts6-vite8-tailwindv4-mvp`
- [x] Framer Motion animations with reduced-motion — per `super-frontend-design`
- [x] WCAG 2.1 AA accessibility — per `frontend-ui-engineering`
- [x] Barrel exports for clean boundaries — per `react19-ts6-vite8-tailwindv4-mvp`
- [x] Component-name-prefixed interfaces — per `react19-ts6-vite8-tailwindv4-mvp`
- [x] Error/loading/empty states for all lists — per `frontend-ui-engineering`
- [x] Mobile-first responsive design — per all skills

### Architecture Validation
- [x] Monorepo with Turborepo for code sharing
- [x] Server Components + Client Components (RSC-first)
- [x] tRPC for type-safe internal API
- [x] Prisma 7 for database (full schema from PRD §3.4)
- [x] Stripe for payments (PCI-compliant)
- [x] Zustand for client state, TanStack Query for server state
- [x] NextAuth.js v5 for authentication
- [x] Service worker for PWA capabilities

---

## TODO Checklist

### Phase 0 — Project Scaffold & Design System
- [ ] 0.1 Turborepo config
- [ ] 0.2 pnpm workspace
- [ ] 0.3 Root package.json
- [ ] 0.4-0.6 Shared TypeScript + ESLint configs
- [ ] 0.7-0.9 Design system tokens, typography, animations
- [ ] 0.10-0.20 UI component library (Button, Input, Badge, Avatar, Skeleton, Dialog, Drawer, Dropdown, Toast)
- [ ] 0.21-0.23 Utility functions (cn, formatPrice, formatDate)
- [ ] 0.24-0.25 Prisma schema + client
- [ ] 0.26-0.28 Next.js + Tailwind configuration
- [ ] 0.29-0.30 Root layout + homepage placeholder
- [ ] 0.31-0.35 Layout components (Navbar, Footer, MobileNav, SkipLink, ErrorBoundary)
- [ ] 0.36-0.39 CI/CD, env template, README

### Phase 1 — Core Commerce Foundation
- [ ] 1.1-1.9 API layer (tRPC routers, context, auth)
- [ ] 1.10-1.14 Business logic services (product, cart, order, payment, email)
- [ ] 1.15-1.17 Product pages (shop, category, PDP)
- [ ] 1.18-1.26 Product components (card, grid, gallery, variant, price, sustainability, size guide, reviews, sticky bar)
- [ ] 1.27-1.36 Cart & checkout components (drawer, item, summary, shipping, payment, review, confirmation, express)
- [ ] 1.37-1.43 State & hooks (cart store, auth store, product/cart/search hooks, schemas)
- [ ] 1.44-1.46 Auth pages (login, register, forgot password)

### Phase 2 — Shopping Experience
- [ ] 2.1-2.9 Homepage sections (hero, collections, arrivals, editorial, brand, newsletter, social, categories)
- [ ] 2.10-2.15 Search components (overlay, input, results, facets, visual search)
- [ ] 2.16-2.20 Editorial pages and components
- [ ] 2.21-2.26 Account pages (dashboard, orders, addresses, wishlist, profile)
- [ ] 2.27-2.32 Animation components (parallax, scroll-reveal, magnetic, text-reveal, image-reveal, page-transition)
- [ ] 2.33-2.35 3D & media components
- [ ] 2.36-2.37 Wishlist store & hook

### Phase 3 — Personalization & AI
- [ ] 3.1-3.5 AI & recommendation services + routers
- [ ] 3.6-3.12 Style quiz pages and components
- [ ] 3.13-3.18 AI stylist page and components
- [ ] 3.19-3.21 Size & fit components
- [ ] 3.22-3.25 Recommendation components + store

### Phase 4 — Scale, Loyalty & Social
- [ ] 4.1-4.8 Loyalty service, router, and components
- [ ] 4.9-4.14 Social commerce components
- [ ] 4.15-4.22 Internationalization (config, translations, switchers, middleware)
- [ ] 4.23-4.28 PWA (manifest, service worker, mobile components)
- [ ] 4.29-4.32 Sustainability components
- [ ] 4.33-4.35 Notification system

### Phase 5 — Polish, Testing & Launch
- [ ] 5.1-5.18 Test suite (unit, component, E2E, accessibility)
- [ ] 5.19-5.22 Performance optimization
- [ ] 5.23-5.28 Monitoring & error pages
- [ ] 5.29-5.34 Documentation
- [ ] 5.35-5.39 Admin dashboard skeleton

---

*Total files: ~175 across 6 phases*  
*Estimated timeline: 28 weeks (parallel execution possible for some phases)*
