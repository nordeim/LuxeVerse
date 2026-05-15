# LuxeVerse

[![Version](https://img.shields.io/badge/version-3.0.0-blue)](https://github.com/luxeverse/luxeverse/releases)
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
| 🔐 | Privacy-First | Zero surveillance personalization, encrypted style profiles |
| ♿ | WCAG AAA | Skip links, focus traps, reduced-motion compliance |
| ⚡ | Performance | LCP < 2.5s, CLS < 0.1, INP < 200ms via RSC + edge caching |
| 🌍 | Global Ready | Multi-currency, RTL support, regional fulfillment |

## 🏗️ Architecture

### Tech Stack

| Layer | Technology | Version | Purpose |
|-------|-----------|---------|---------|
| Framework | Next.js | 16.1.4+ | App Router, RSC, Turbopack |
| Language | TypeScript | 6.0+ | Strict mode, `erasableSyntaxOnly` |
| Styling | Tailwind CSS | 4.2+ | CSS-first `@theme inline`, OKLCH tokens |
| UI Primitives | shadcn/ui + Radix | Latest | Accessible, composable components |
| State | Zustand | 5.0+ | Client state with `partialize` discipline |
| API | tRPC + GraphQL | Hybrid | Type-safe internal + flexible public APIs |
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
    end

    subgraph Data["Data Layer"]
        L[(PostgreSQL)]
        M[(Redis)]
        N[(Algolia)]
        O[S3/CloudFront]
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
│   │   └── 📄 src/stores/      # Zustand stores (data-only persist)
│   └── 📂 admin/               # Admin dashboard (Next.js)
├── 📂 packages/
│   ├── 📂 ui/                  # Shared shadcn-based components
│   ├── 📂 design-system/       # OKLCH tokens, typography, animations
│   ├── 📂 db/                  # Prisma schema + migrations
│   └── 📂 config/              # Shared TS, ESLint, Tailwind configs
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
| 0: Foundation | ✅ Complete | 2026-05-15 | Monorepo, design tokens, CI/CD |
| 1: Core Commerce | ✅ Complete | 2026-06-26 | Product catalog, cart, checkout |
| 2: Cinematic UX | ✅ Complete | 2026-08-07 | Homepage, search, animations |
| 3: AI Personalization | 🔄 In Progress | ETA 2026-09-18 | Style quiz, AI stylist, recommendations |
| 4: Scale & Social | 📅 Planned | ETA 2026-10-30 | Loyalty, i18n, PWA, UGC |
| 5: Polish & Launch | 📅 Planned | ETA 2026-11-27 | Testing, security, docs, launch |

**Overall Progress**: 50% complete (3/6 phases delivered)  
**Latest Audit**: Security scan passed (0 high/critical), Lighthouse ≥ 90

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
| `bottom--24` not working | Use `-bottom-24` (single hyphen for negatives in Tailwind v4) |
| `tsc` errors but tests pass | Run `pnpm tsc --noEmit` FIRST — type errors cause cryptic test failures |
| Zustand store not updating in JSX | Use selector: `useStore(s => s.field)`, not `.getState()` |
| `requestAnimationFrame` fails in tests | Mock via `vi.stubGlobal('requestAnimationFrame', ...)` in `setup.ts` |
| Font-family in className breaks parser | Use `@layer utilities` (`.font-display`), never `font-["..."]` |
| Route changes not reflecting | Run `npx tsr generate` after adding TanStack Router files |
| CSS tokens unused | Run dead code audit: `grep -r "var(--token)" src/` |

## 📜 License

Proprietary. All rights reserved.  
See [LICENSE](LICENSE) for full terms.

---

> **Last Updated**: 2026-05-15  
> **Next Review**: 2026-06-01  
> **Contact**: engineering@luxeverse.com
