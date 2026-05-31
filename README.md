# LuxeVerse

[![Version](https://img.shields.io/badge/version-5.0.0-blue)](https://github.com/luxeverse/luxeverse/releases)
[![CI](https://img.shields.io/github/actions/workflow/status/luxeverse/luxeverse/ci.yml?branch=main&label=CI)](https://github.com/luxeverse/luxeverse/actions)
[![License](https://img.shields.io/badge/license-proprietary-red)](LICENSE)
[![Node](https://img.shields.io/badge/node-%3E%3D22-green)](https://nodejs.org)
[![TypeScript](https://img.shields.io/badge/typescript-6.0-blue)](https://www.typescriptlang.org)

> Cinematic luxury e-commerce platform — where AI-driven personalization meets editorial-grade design.

## Overview

LuxeVerse redefines luxury shopping by merging **cinematic storytelling**, **AI-powered styling**, and **production-grade engineering**. Built for discerning brands and consumers, it delivers a digital atelier experience with sub-2.5s LCP, WCAG AAA accessibility, and zero "AI-slop" aesthetics.

**Problem**: Traditional luxury e-commerce replicates mass-market patterns, losing the emotional resonance of physical boutiques.  
**Solution**: A composable, headless platform with RSC-first architecture, bespoke design tokens, and privacy-first AI that enhances rather than replaces human curation.

## ✨ Key Features

| Emoji | Feature | Description |
|-------|---------|-------------|
| 🎬 | Cinematic UI | Editorial layouts, luxury animation curves, intentional whitespace |
| 🤖 | AI Stylist | Outfit generation, size recommendations, conversational shopping |
| 💎 | Loyalty Program | Tiered points (BRONZE→PLATINUM), redeemable rewards, history tracking |
| 🌍 | i18n PWA | Multi-language (EN/FR/AR), offline-capable installable app |
| ♻️ | Sustainability | Product eco-scoring, carbon footprint, recycled content tracking |
| 👥 | Social | User-generated content gallery, product tagging, moderation |
| 🔐 | Privacy-First | Zero surveillance personalization, encrypted style profiles |
| ♿ | WCAG AAA | Skip links, focus traps, reduced-motion compliance |
| ⚡ | Performance | LCP < 2.5s, CLS < 0.1, INP < 200ms via RSC + edge caching |

## 🏗️ Architecture

### Tech Stack

| Layer | Technology | Version | Purpose |
|-------|-----------|---------|---------|
| Framework | Next.js | 16.2.6+ | App Router, RSC, Turbopack |
| Language | TypeScript | 5.8+ | Strict mode, `erasableSyntaxOnly` |
| Styling | Tailwind CSS | 4.3+ | CSS-first `@theme inline`, OKLCH tokens |
| UI Primitives | shadcn/ui + Radix | Latest | Accessible, composable components |
| State | Zustand | 5.0+ | Client state with `partialize` discipline |
| API | tRPC + GraphQL | Hybrid | Type-safe internal + flexible public APIs |
| i18n | next-intl | 4.12+ | Path-based routing (`/en/shop`, `/fr/shop`) |
| PWA | @ducanh2912/next-pwa | 10.2.9+ | Service worker with Workbox caching |
| Database | PostgreSQL | 17 | Primary datastore with Prisma 7 ORM |
| Cache | Redis | 7+ | Session store, rate limiting, pub/sub |
| Search | Algolia + Typesense | Hybrid | Faceted + semantic + visual search |
| AI | OpenAI + Claude | GPT-4o, 3.5 | Content generation, recommendations |
| Payments | Stripe + Adyen | Latest | PCI-compliant, multi-currency |
| Monitoring | Datadog + Sentry | Latest | APM, RUM, error tracking |

### System Diagram

```mermaid
flowchart TB
    subgraph Client["Client Layer (Next.js 16)"]
        A[Web App] --> B[Admin Dashboard]
        A --> C[PWA Mobile]
    end

    subgraph API["API Gateway"]
        D[tRPC Router] --> E[GraphQL Endpoint]
        D --> F[REST Webhooks]
    end

    subgraph Services["Service Mesh"]
        G[Product Service]
        H[Cart Service]
        I[Order Service]
        J[AI Service]
        K[Search Service]
        L[Loyalty Service]
        M[i18n Router]
        N[UGC Service]
    end

    subgraph Data["Data Layer"]
        O[(PostgreSQL)]
        P[(Redis)]
        Q[(Algolia)]
        R[S3/CloudFront]
    end

    Client --> API
    API --> Services
    Services --> Data
```

## 📁 File Hierarchy

```
luxeverse/
├── 📂 apps/
│   ├── 📂 web/                 # Next.js 16 storefront (RSC-first)
│   │   ├── 📄 src/app/         # App Router pages & layouts
│   │   ├── 📄 src/components/  # Client/Server components
│   │   ├── 📄 src/stores/      # Zustand stores (data-only persist)
│   │   ├── 📄 src/i18n/        # next-intl routing & config
│   │   ├── 📄 src/server/      # tRPC routers + services
│   │   └── 📄 public/          # PWA manifest, icons, static assets
│   └── 📂 admin/               # Admin dashboard (Next.js)
├── 📂 packages/
│   ├── 📂 ui/                  # Shared shadcn-based components
│   ├── 📂 design-system/       # OKLCH tokens, typography, animations
│   ├── 📂 db/                  # Prisma schema + migrations
│   └── 📂 config/              # Shared TS, ESLint, Tailwind configs
├── 📄 skills/luxeverse-architect-skill/SKILL.md # Battle-tested architectural decisions & gotchas
├── 📄 turbo.json               # Turborepo pipeline config
├── 📄 pnpm-workspace.yaml      # Monorepo workspace definition
├── 📄 .env.example             # Environment variable template
└── 📄 README.md                # This file
```

## 🚀 Quick Start

### Prerequisites
- Node.js ≥ 22 (`nvm use 22`)
- pnpm ≥ 9 (`corepack enable`)
- Docker (optional, for local PostgreSQL/Redis)

### Clone & Install
```bash
git clone https://github.com/luxeverse/luxeverse.git
cd luxeverse
pnpm install
```

### Environment Setup
```bash
cp .env.example .env.local
# Edit .env.local with your values (see Environment Variables below)
```

### Run Locally
```bash
# Start all services (web, admin, API)
pnpm turbo dev

# Or run web app only
cd apps/web && pnpm dev
```

### Verify Setup
```bash
# TypeScript check (zero errors)
pnpm tsc --noEmit

# Run tests (100% pass rate)
pnpm turbo test

# Build production bundle (< 1s via Rolldown)
pnpm turbo build

# Open app
open http://localhost:3000
```

✅ **Expected Output**: Styled homepage with navbar, footer, and design tokens loaded. No console errors.

## 🔐 Environment Variables

### Database
```env
DATABASE_URL=postgresql://user:pass@localhost:5432/luxeverse
```

### Authentication
```env
NEXTAUTH_SECRET=your-secret-here
NEXTAUTH_URL=http://localhost:3000
```

### Payments
```env
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
```

### AI Services
```env
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-ant-...
```

### i18n & PWA
```env
# next-intl path-based routing
NEXT_PUBLIC_DEFAULT_LOCALE=en

# PWA requires no extra env vars
# Service worker auto-registers via next-pwa
```

### Monitoring
```env
SENTRY_DSN=https://...@sentry.io/...
DATADOG_API_KEY=...
```

### Optional
```env
# Enable analytics
NEXT_PUBLIC_GA_ID=G-XXXXXX

# Enable visual search
CLOUDINARY_URL=cloudinary://...
```

## 🧪 Testing

### Commands
```bash
# Unit + component tests (Vitest + Testing Library)
pnpm turbo test

# E2E tests (Playwright)
pnpm e2e:run

# Accessibility audit (axe-core)
pnpm test:a11y

# Coverage report (80% statements, 75% branches)
pnpm test:coverage
```

### CI Pipeline
```yaml
# .github/workflows/ci.yml
- pnpm install
- pnpm tsc --noEmit          # TypeScript check FIRST
- pnpm turbo test            # Unit + component tests
- pnpm turbo build           # Production build
- lighthouse-ci              # Performance budget enforcement
```

### Test Prerequisites
- Redis running for cache tests (`docker run -p 6379:6379 redis:7`)
- Mock Stripe for payment tests (`STRIPE_SECRET_KEY=sk_test_mock`)

## 🎨 Design System

### Color Tokens (OKLCH)
| Token | Value | Usage |
|-------|-------|-------|
| `--color-obsidian-900` | `oklch(0.12 0.005 260)` | Primary text |
| `--color-neon-pink` | `oklch(0.65 0.28 350)` | Accent CTAs |
| `--color-metallic-gold` | `oklch(0.78 0.14 85)` | Luxury highlights |
| `--color-atmosphere-deep` | `oklch(0.15 0.04 280)` | Background gradients |

### Typography
| Role | Font | Scale | Usage |
|------|------|-------|-------|
| Display | Cormorant Garamond | `clamp(2.5rem, 5vw, 4.5rem)` | Hero headlines |
| Body | DM Sans | `clamp(1rem, 0.9rem + 0.5vw, 1.125rem)` | Paragraphs, UI text |
| Mono | JetBrains Mono | `0.875rem` | Code, technical data |

### Animation Curves
| Token | Value | Usage |
|-------|-------|-------|
| `--ease-out-expo` | `cubic-bezier(0.19, 1, 0.22, 1)` | Entry animations |
| `--ease-luxe` | `cubic-bezier(0.25, 0.1, 0.25, 1)` | Standard transitions |
| `--ease-dramatic` | `cubic-bezier(0.77, 0, 0.175, 1)` | Hero reveals |

> All animations respect `@media (prefers-reduced-motion: reduce)`.

## 🚢 Deployment

### Production Architecture
```mermaid
graph LR
    A[CloudFront CDN] --> B[Vercel Edge]
    B --> C[Next.js App Router]
    C --> D[tRPC/GraphQL API]
    D --> E[AWS EKS Services]
    E --> F[PostgreSQL RDS]
    E --> G[Redis ElastiCache]
    E --> H[S3 Media Storage]
```

### Deploy Steps
```bash
# 1. Build & test locally
pnpm turbo build
pnpm turbo test

# 2. Push to main (triggers CI/CD)
git push origin main

# 3. Monitor deployment
open https://vercel.com/luxeverse/web/deployments

# 4. Canary rollout (10% → 50% → 100%)
# Auto-rollback on Sentry error spike
```

### Scaling Considerations
- Auto-scaling EKS nodes based on CPU/memory thresholds
- Redis cluster mode for high-availability caching
- Database read replicas for analytics queries

## 📊 Project Status

| Phase | Status | Completion | Key Deliverables |
|-------|--------|------------|-----------------|
| 0: Foundation | ✅ Complete | 2026-05-15 | Monorepo, design tokens, CSS-first TW v4 |
| 1: Core Commerce | ✅ Complete | 2026-05-20 | Product catalog, cart, checkout, Stripe, Auth |
| 2: Cinematic UX | ✅ Complete | 2026-05-21 | Homepage, search (tRPC), editorial, 3D, wishlist |
| 3: AI Personalization | ✅ Complete | 2026-05-22 | AI service layer, style quiz, streaming chat, outfit generation, size recommendations |
| 4: Scale, Loyalty & Social | ✅ Complete | 2026-05-24 | Loyalty engine (12 tests), i18n (EN/FR/AR), PWA (webpack mode), UGC, Sustainability, Account Hub |
| 5: Hardening & Launch | ✅ Complete | 2026-05-26 | E2E tests, perf audit, docs, launch |

## ✅ Phase 7: Route Architecture & Provider Integration (Completed 2026-05-28)

| Fix | Description | Impact |
|-----|-------------|--------|
| **ROUTES-001** | Moved all root-level pages to `app/[locale]/(routes)/` | i18n context correctly inherited by all pages; no duplicate routes |
| **HYDRATE-001** | Removed `<html>`/`<body>` from root layout | Eliminated hydration mismatch between `app/layout.tsx` and `app/[locale]/layout.tsx` |
| **HYDRATE-002** | Locale layout exclusively owns `<html>`/`<body>` | Single source of truth for document structure; `lang`, `dir`, `className` consistent on SSR + client |
| **tRPC-001** | Created `ClientProviders` component (`'use client'`) | Wraps `NextIntlClientProvider` + `TRPCProvider` for correct React Context propagation |
| **tRPC-002** | Mounted `ClientProviders` in `app/[locale]/layout.tsx` | `useCart` hook now has tRPC context; `trpc.cart.addItem.useMutation()` works |

### Verification (Phase 7)
| Command | Result |
|---------|--------|
| `pnpm typecheck` | ✅ Zero errors |
| `pnpm lint` | ✅ All scripts passed |
| `pnpm test` | ✅ 92/92 tests passing (19 test files) |

## ✅ Critical Remediation Round 1 (Completed 2026-05-23)

| Fix | Description | Status |
|-----|-------------|--------|
| **CRIT-001** | `global-error.tsx` — Root error boundary | ✅ + tests |
| **CRIT-002** | UI Primitives (`Button`, `Input`, `Dialog`, `Drawer`) — Radix-based | ✅ + tests |
| **CRIT-003** | `next.config.ts` — CSP & security headers | ✅ |
| **CRIT-004** | `useCart` — Wired to tRPC mutations | ✅ |
| **CRIT-005** | `useWishlist` — Wired to tRPC mutations | ✅ |
| **CRIT-006** | Lighthouse CI — Config present | 🟡 |
| **CRIT-007** | E2E expansion — Scheduled | 📅 Phase 5 |

## ✅ Phase 4 Remediation (Completed 2026-05-24)

| Fix | Description | Impact |
|-----|-------------|--------|
| **PWA-001** | Fixed `next-pwa` + Turbopack incompatibility | `--webpack` flag, auto-generated SW |
| **i18n-001** | Fixed `params` anti-pattern in `[locale]/layout.tsx` | Removed `await params`, used direct destructuring |
| **i18n-002** | Replaced `window.location.href` with `router.push()` in `LanguageSwitcher` | SPA state preserved |
| **LOYALTY-001** | Fixed `reverseTransaction` double point reversal | Added `order.pointsEarned = 0` reset |
| **TYPE-001** | Integrated `superjson` for tRPC date serialization | Prisma `Date` fields correctly deserialized |
| **TYPE-002** | Fixed case-sensitive import issues (Linux) | `button.test.tsx` → `Button.tsx`, `input.test.tsx` → `Input.tsx` |

## 📋 Troubleshooting (Updated 2026-05-25)

### Prisma Schema Issues
If you modify `prisma/schema.prisma`, you **must** regenerate the Prisma Client types:
* **Command**: `cd apps/web && pnpm db:generate`
* **Symptom**: TypeScript errors like `TS2339: Property 'X' does not exist on type 'Y'`
* **Context**: This occurs because Prisma's TypeScript types are generated from the schema. If the schema changes but the types aren't regenerated, any new or modified fields will be missing from the generated type definitions.

### Prisma Schema Issues
* **Symptom**: TypeScript errors like `TS2339: Property 'X' does not exist on type 'Y'`
* **Root cause**: Prisma Client types are generated from the schema. If the schema changes but types aren't regenerated, new/modified fields are missing.
* **Fix**: Run `cd apps/web && pnpm db:generate` after any `prisma/schema.prisma` change.
* **Context**: This is the single most common cause of cryptic type errors after schema modifications.

### next-intl v4 Configuration (Critical)
* **Symptom**: `Couldn't find next-intl config file` error at runtime
* **Fix**: Split monolithic `i18n.ts` into `routing.ts` (`defineRouting`) + `request.ts` (`getRequestConfig`), add `turbopack.resolveAlias` in `next.config.ts`
* **Files**: `src/i18n/routing.ts`, `src/i18n/request.ts`, `next.config.ts`

### Turbopack Alias Required for next-intl v4
* **Symptom**: `Error: Couldn't find next-intl config file` in Next.js 16 with Turbopack
* **Fix**: Add explicit alias in `next.config.ts`: `turbopack: { resolveAlias: { 'next-intl/config': './src/i18n/request.ts' } }`
* **File**: `next.config.ts`

### middleware.ts → proxy.ts Rename (Next.js 16)
* **Symptom**: Deprecation warning: `The "middleware" file convention is deprecated. Please use "proxy" instead`
* **Fix**: Rename `src/middleware.ts` to `src/proxy.ts`, update imports to use `routing` from `i18n/routing.ts`
* **File**: `src/proxy.ts` (renamed from `src/middleware.ts`)

### Dynamic Import Path Resolution in Aliased Files
* **Symptom**: `Module not found: Can't resolve '../../../messages'` when using dynamic imports in `request.ts`
* **Root cause**: When `next-intl/config` is aliased, dynamic imports resolve relative to the alias target (inside `node_modules/next-intl/`), not the source file
* **Fix**: Move `messages/` directory into `src/` and update import paths: `import(\`../messages/${locale}.json\`)` from `src/i18n/request.ts`
* **File**: `src/i18n/request.ts`, `src/messages/` (moved from root)

### Readonly Tuple → Array Cast for defineRouting
* **Symptom**: `Type 'readonly ["en", "fr", "ar"]' is not assignable to type 'string[]'`
* **Fix**: Cast through `unknown`: `locales: locales as unknown as Array<string>`
* **File**: `src/i18n/routing.ts`

### Tailwind v4 Migration
| v3 Utility | v4 Replacement | Notes |
|------------|----------------|-------|
| `bg-gradient-to-r` | `bg-linear-to-r` | Build error if not migrated |
| `bg-gradient-to-t` | `bg-linear-to-t` | Build error if not migrated |
| `outline-none` | `outline-hidden` | **Critical a11y fix** — preserves Forced Colors Mode |
| `flex-shrink-0` | `shrink-0` | Silent style failure otherwise |

* **Symptom**: Styles not applying or build errors mentioning `bg-gradient-to-r`
* **Context**: Tailwind v4 is CSS-first and uses different utility names for some properties. The `outline-none` → `outline-hidden` migration is not cosmetic — it preserves accessibility.
* **Files found with deprecated utilities**: `UGCGallery.tsx`, `AccountOverview.tsx`, `LanguageSwitcher.tsx`, `Input.tsx`, `Button.tsx` — all fixed.

### Monorepo Search Path Gotchas in Lint Scripts
* **Symptom**: Lint scripts fail silently with `grep: src/: No such file or directory`
* **Root cause**: In a monorepo, running `grep ... src/` from the root searches a non-existent `src/` directory at root, not the one inside `apps/web/`
* **Fix**: Use per-workspace search paths. Exclude build directories:
  ```bash
  grep -rEn --exclude-dir=.next --exclude-dir=node_modules --exclude-dir=dist --exclude-dir=.turbo "PATTERN" packages/ apps/
  ```
* **Files**: `scripts/validate-deprecated-twind.sh`, `scripts/validate-colors.sh`

### PWA Build with next-pwa
* **Symptom**: `This build is using Turbopack, with a webpack config and no turbopack config`
* **Fix**: Add `--webpack` to the build script: `"build": "next build --webpack"` in `package.json`. Keep `swSrc` undefined (auto-generated SW) for reliability.
* **Context**: `@ducanh2912/next-pwa` relies on `workbox-webpack-plugin`, which Turbopack cannot process.

### Next.js 16 `params` — The Runtime vs. Type Duality

**CRITICAL**: Next.js 16's `.next/types/` generator types `params` as `Promise<any>` for page components, even though at runtime `params` is a plain object.

| Layer | Type | Must Use |
|-------|------|---------|
| **Runtime** | Plain object `{}` | `const { slug } = params` (direct destructuring) |
| **Generated Types** (`.next/types/`) | `Promise<{ ... }>` | `params: Promise<{...}>` + `await` to satisfy tsc |

**For Pages (Updated for Next.js 16.2+)**:
```tsx
// ✅ CORRECT — satisfies both runtime and generated types
interface PageProps {
  params: Promise<{ slug: string }>;
}
export default async function Page({ params }: PageProps) {
  const { slug } = await params; // Required by .next/types/ Promise<T>
}
```

**For Layouts** (always a real Promise):
```tsx
// ✅ CORRECT — layouts always receive a Promise
export default async function Layout({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params; // Always correct for layouts
}
```

* **Why the duality**: `.next/types/` generates `Promise<any>` to enable async prop resolution. At runtime, `await` on a non-Promise returns the same value (no runtime bug). TypeScript just needs the `Promise<T>` annotation to pass `tsc --noEmit`.
* **Files**: All `page.tsx` files in the monorepo were updated.

### tRPC + NextAuth v4 in App Router — Use `getToken`, Not `getServerSession`

* **Symptom**: Type error when using `getServerSession(authOptions)` in tRPC context: `Type 'NextRequest' is not assignable to parameter of type 'GetServerSidePropsContext'`
* **Root cause**: `getServerSession` is designed for **Pages Router** (`NextApiRequest`/`NextApiResponse`), not App Router's `NextRequest`
* **Fix**: Use `getToken` from `next-auth/jwt` in tRPC context. It reads the `next-auth.session-token` cookie, verifies it with `AUTH_SECRET`, and returns the JWT payload.
* **File**: `src/server/context.ts`

### tRPC Date Serialization with superjson
* **Symptom**: `Type 'string' is not assignable to type 'Date'` on client when using Prisma types
* **Fix**: Ensure `superjson` is registered in BOTH server `initTRPC` AND client `httpBatchLink`
* **File**: `src/server/trpc.ts` + `src/trpc/provider.tsx`
* **Context**: Without `superjson`, tRPC serializes dates as ISO strings over the wire. Prisma types expect Date objects, causing type mismatches.

### Root Layout `lang` Attribute
* **Symptom**: Accessibility audit fails with "HTML lang attribute does not match page language"
* **Fix**: Use `defaultLocale` from `i18n/config` in root `layout.tsx`, and `locale` from `params` in `[locale]/layout.tsx`
  ```tsx
  // Root layout (fallback — must NOT render <html>/<body> when locale layout handles them)
  // ❌ DON'T: return <html lang="en"><body>{children}</body></html> — causes hydration mismatch
  // ✅ DO: return <>{children}</>;
  
  // Locale layout (localized — SOLE owner of <html>/<body>)
  <html lang={locale} dir={isRTL(locale) ? "rtl" : "ltr"}>
    <body>{children}</body>
  </html>
  ```
* **File**: `src/app/layout.tsx`, `src/app/[locale]/layout.tsx`

### Route Restructuring: Move Root-Level Pages to `[locale]/(routes)/`
**Issue**: Pages placed at the root level (`app/shop/page.tsx`) do not inherit i18n context and may hit the root layout which lacks `<html>`/`<body>` (if removed to prevent hydration mismatch).

**Fix**: Move all locale-dependent pages into a `(routes)` group inside `[locale]`:
```
app/
├── layout.tsx              # Root shell (no <html>/<body>)
└── [locale]/
    ├── layout.tsx          # Locale shell (owns <html>/<body>)
    └── (routes)/            # Group for locale-dependent pages
        ├── shop/
        ├── editorial/
        └── ...
```
* **Why**: The `(routes)` group does not affect the URL path but ensures all pages inside it inherit the `[locale]/layout.tsx` (which has `<html>`/`<body>` and `NextIntlClientProvider`).
* **After restructuring**: `pnpm typecheck` — zero errors; `pnpm lint` — all scripts pass; `pnpm test` — all tests pass.
* **Files**: `src/app/[locale]/(routes)/` (created), `src/app/shop/` (moved), `src/app/editorial/` (moved), etc.

### tRPC Provider Must Be Mounted in Layout
**Issue**: `useCart` hook throws `Unable to find tRPC Context` because `TRPCProvider` was defined but never included in any layout.

**Fix**: Create a single `'use client'` `ClientProviders` component that wraps both `NextIntlClientProvider` and `TRPCProvider`, then use it in the locale layout:

```tsx
// src/components/providers/ClientProviders.tsx
"use client";
import { NextIntlClientProvider } from "next-intl";
import { TRPCProvider } from "@/trpc/provider";

export function ClientProviders({ locale, messages, children }) {
  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <TRPCProvider>{children}</TRPCProvider>
    </NextIntlClientProvider>
  );
}
```

```tsx
// src/app/[locale]/layout.tsx
import { ClientProviders } from "@/components/providers/ClientProviders";

export default async function LocaleLayout({ children, params }) {
  const { locale } = await params;
  const messages = (await import(`../../messages/${locale}.json`)).default;
  return (
    <html lang={locale} dir={isRTL(locale) ? "rtl" : "ltr"}>
      <body>
        <ClientProviders locale={locale} messages={messages}>
          {children}
        </ClientProviders>
      </body>
    </html>
  );
}
```
* **Files**: `src/components/providers/ClientProviders.tsx` (created), `src/app/[locale]/layout.tsx` (updated)

### Hydration Mismatch: Root Layout vs. Locale Layout
**Issue**: Both `app/layout.tsx` and `app/[locale]/layout.tsx` render `<html>`/`<body>`, causing React to see conflicting attributes during client-side hydration.

**Fix**: Root layout returns only `children` or a fragment. Locale layout exclusively owns `<html>`/`<body>`.

```tsx
// app/layout.tsx — minimal pass-through
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
```

```tsx
// app/[locale]/layout.tsx — SOLE provider of <html>/<body>
export default async function LocaleLayout({ children, params }: LocaleLayoutProps) {
  const { locale } = await params;
  return (
    <html lang={locale} dir={isRTL(locale) ? "rtl" : "ltr"}>
      <body className="bg-obsidian-50 text-obsidian-900 antialiased">
        {children}
      </body>
    </html>
  );
}
```
* **Why**: Next.js allows only one layout in the tree to be the "document root". When the root layout removes `<html>`/`<body>`, the locale layout becomes the effective document root, eliminating the hydration conflict.
* **Files**: `src/app/layout.tsx`, `src/app/[locale]/layout.tsx`

### Duplicate i18n Routes
* **Symptom**: Both `/account` and `/en/account` exist, serving duplicate content with potential SEO penalties
* **Fix**: Remove the non-localized route (`src/app/account/page.tsx`) and keep only the localized one (`src/app/[locale]/account/page.tsx`)
* **Context**: Phase 4 remediation removed the non-localized `/account` route to prevent duplicate-content issues
* **File**: `src/app/account/page.tsx` (deleted), `src/app/[locale]/account/page.tsx`

### i18n Locale Switching
* **Symptom**: Full page reload or lost state when switching languages
* **Fix**: Use `useRouter().push(newPathname)` NOT `window.location.href`
* **File**: `src/components/shared/LanguageSwitcher.tsx`

### R3F Components and `lazy()`
* **Symptom**: TypeScript errors when destructuring `const { Canvas } = lazy(() => import('@react-three/fiber'))`
* **Fix**: R3F components export named components. `React.lazy()` requires `{ default }` export. Wrap R3F with `<Suspense>` instead — the `<Suspense>` boundary defers heavy lib load without needing `lazy()`.
* **Correct**: Direct import + `<Suspense fallback={<Skeleton />}>`. Never `lazy()` R3F exports.

### Search `orderBy` Runtime Error
* **Symptom**: Search query crashes with "Unknown field `relevance`"
* **Fix**: Prisma schema has NO `relevance` field. Fallback to `{ createdAt: "desc" }` (or `{ views: "desc" }` as a business-logic proxy for popularity).
* **File**: `src/server/routers/search.ts`

### `as any` in Tests and Components
* **Symptom**: `as any` undermines TypeScript strict mode
* **Fix**: Replace with explicit types (`Record<string, never>` for unknown objects, `as const` for literal unions)
* **Files**: `src/server/routers/ai.test.ts`, `src/components/recommendations/PersonalizedGrid.tsx`

### Testing Library `getByText` with Multi-Element Matches
* **Symptom**: `Found multiple elements with the text: X` in component tests
* **Fix**: Use `getAllByText` or `container.querySelector` for elements rendered multiple times; use `toHaveTextContent` on `container` for text spanning multiple nodes
* **Files**: All component test files

## 🤝 Contributing

### Development Flow (TDD)
1. **RED**: Write failing test (`vitest` or `playwright`)
2. **GREEN**: Implement minimal code to pass
3. **REFACTOR**: Clean up while keeping tests green
4. **VERIFY**: Run `pnpm tsc --noEmit` + `pnpm turbo test`

### Framework-Specific Conventions
- **TypeScript 6**: `strict: true`, `erasableSyntaxOnly`, no `any`/`enum`/`namespace`
- **Tailwind v4**: CSS-first `@theme inline`, no `tailwind.config.js`, single-hyphen negatives (`-bottom-24`)
- **React 19**: `useActionState` for forms, `useOptimistic` + `startTransition` for instant UI
- **Zustand**: Selectors only in JSX (`useStore(s => s.field)`), `partialize` for data-only persistence

### Pre-Commit Hooks
```bash
# Install hooks
pnpm prepare

# Hooks run automatically:
# - eslint (zero warnings)
# - prettier (format)
# - tsc --noEmit (type check)
# - vitest run (affected tests)
```

### Anti-Generic Checklist
Before submitting a PR, verify:
- [ ] No purple/indigo default colors
- [ ] No `rounded-2xl` on everything
- [ ] No generic hero section templates
- [ ] No placeholder lorem ipsum text
- [ ] Spacing uses design system scale (no arbitrary pixels)
- [ ] Typography follows hierarchy (no skipped heading levels)

## 🔧 Troubleshooting

| Issue | Solution |
|-------|----------|
| `Couldn't find next-intl config file` | Split `i18n.ts` → `routing.ts` + `request.ts`, add `turbopack.resolveAlias` |
| `Type 'readonly [...]' is not assignable to type 'string[]'` | Cast: `locales as unknown as Array<string>` |
| `Module not found: Can't resolve '../../../messages'` | Move `messages/` into `src/`, update import paths |
| `middleware.ts deprecation warning` | Rename to `proxy.ts`, import from `i18n/routing.ts` |
| `bottom--24` not working | Use `-bottom-24` (single hyphen for negatives in Tailwind v4) |
| `tsc` errors but tests pass | Run `pnpm tsc --noEmit` FIRST — type errors cause cryptic test failures |
| Zustand store not updating in JSX | Use selector: `useStore(s => s.field)`, not `.getState()` |
| `requestAnimationFrame` fails in tests | Mock via `vi.stubGlobal('requestAnimationFrame', ...)` in `setup.ts` |
| Font-family in className breaks parser | Use `@layer utilities` (`.font-display`), never `font-["..."]` |
| Route changes not reflecting | Run `npx tsr generate` after adding TanStack Router files |
| CSS tokens unused | Run dead code audit: `grep -r "var(--token)" src/` |
| `next-pwa` build fails | Add `--webpack` to build script; remove `swSrc` (use auto-generated SW) |
| Dates are strings on client | Verify `superjson` is configured in BOTH server and client tRPC |
| Hydration mismatch on `<html>` | Remove `<html>`/`<body>` from root layout; let locale layout own them |
| `Unable to find tRPC Context` | Mount `TRPCProvider` in a `'use client'` component inside the layout |

## 📜 License

Proprietary. All rights reserved.  
See [LICENSE](LICENSE) for full terms.

---

## 📜 License

Proprietary. All rights reserved.  
See [LICENSE](LICENSE) for full terms.

---

> **Last Updated**: 2026-05-28 (route restructuring: locale route groups `[locale]/(routes)/`, hydration fix: removed `<html>`/`<body>` from root layout, tRPC provider fix: mounted `TRPCProvider` in `ClientProviders`)
> **Next Review**: 2026-06-15
> **Env**: Node 22, Next.js 16.2.6, React 19.2.6, TypeScript 6.0.3, Tailwind 4.3.0, Prisma 6.19.3
> **Status**: Phases 0-5 complete (93 tests passing, all gates green), Phase 5.1 (E2E + Lighthouse) pending
> **Contact**: engineering@luxeverse.com
