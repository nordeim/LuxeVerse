---
IMPORTANT: File is read fresh for every conversation. Be brief and practical. This is a luxury e-commerce platform — every pixel and interaction must feel premium.
---

# LuxeVerse

**Cinematic Luxury E-Commerce Platform** — An immersive, AI-driven digital boutique experience. Blending art direction, intelligent personalization, and commerce to redefine luxury digital retail.

**Tech Stack**: Next.js 16.2.6 (App Router), React 19.2.6, TypeScript 6.0.3, Tailwind CSS v4.3.0 (CSS-first), Prisma 6.19.3, PostgreSQL, tRPC 11.17.0, NextAuth v4.24.14, Zustand 5.0.13, Stripe 17.7.0

**Architecture**: Turborepo monorepo with pnpm workspaces. Headless composable commerce with RSC-first rendering.

---

## Core Identity & Purpose

LuxeVerse is a luxury e-commerce platform built on the **Anti-Generic Mandate**. Every pixel, animation, and interaction must feel intentionally crafted. Reject template-driven design. Reject purple gradients. Reject Inter + Roboto system font fallbacks. The platform delivers cinematic product storytelling, AI-driven personalization, and immersive 3D/AR shopping.

---

## Project State (2026-05-22)

| Phase | Status | Completion | Key Deliverables |
|-------|--------|------------|-----------------|
| 0: Foundation | ✅ Complete | 2026-05-15 | Monorepo, design tokens, CI pass |
| 1: Core Commerce | ✅ Complete | 2026-05-20 | Product catalog, cart, checkout, Stripe, Auth |
| 2: Cinematic UX | ✅ Complete | 2026-05-21 | Homepage, search (tRPC), editorial, 3D, wishlist |
| 3: AI Personalization | ✅ Complete | 2026-05-22 | AI service layer, style quiz, streaming chat, outfit generation, size recommendations |
| 4: Scale & Social | 📅 Planned | ETA 2026-07-30 | Loyalty, i18n, PWA, UGC |
| 5: Hardening & Launch | 📅 Planned | ETA 2026-08-30 | E2E tests, perf audit, docs, launch |

---

## Foundational Principles

### Meticulous Approach (Six-Phase Workflow)

Follow this six-phase workflow for ALL implementation tasks:

1. **ANALYZE** — Deep, multi-dimensional requirement mining
2. **PLAN** — Structured execution roadmap (present for user validation)
3. **VALIDATE** — Explicit confirmation checkpoint (user approval before code)
4. **IMPLEMENT** — Modular, tested, documented builds
5. **VERIFY** — Rigorous QA against success criteria (typecheck, lint, test, build)
6. **DELIVER** — Complete handoff with knowledge transfer

### Anti-Generic Mandate
- **Reject AI Slop**: No template layouts, no predictable card grids, no "safe" design choices
- **Intentional Minimalism**: Use whitespace as a structural element, not empty space
- **Luxury Aesthetic**: OKLCH palette (Obsidian, Neon, Metallic, Atmosphere), fluid typography, golden-ratio spacing
- **Every Pixel Justified**: Every element must have a reason to exist

---

## Critical Gotchas (Updated 2026-05-22)

### Next.js 16 `params` is a Plain Object
* **Never**: `const { slug } = await params` (Next.js 15 pattern)
* **Always**: `const { slug } = params` (direct destructuring)
* **Why**: Next.js 16 changed `params` from a Promise to a plain object. `await` on a non-Promise silently returns the original value at runtime, causing subtle bugs.

### Prisma Schema Synchronization
* **Command**: `pnpm db:generate` after EVERY schema change
* **Gotcha**: Adding a required field to a model requires updating ALL `prisma.model.create()` calls, or `tsc --noEmit` fails with `TS2322`
* **Gotcha**: Fields like `relevance` do NOT exist in the Prisma schema just because they make business sense. Check `schema.prisma` before using a field in a query.

### R3F Components Cannot Be `lazy()` Destructured
* **Never**: `const { Canvas } = lazy(() => import('@react-three/fiber'))`
* **Why**: R3F exports named components; `React.lazy()` requires `{ default }`. Destructuring a `LazyExoticComponent` fails at runtime.
* **Always**: Direct import + `<Suspense fallback={<Skeleton />}>`. The Suspense boundary defers heavy bundle load without `lazy()`.

### Search Router `orderBy` Trap
* **Bug fixed**: `search.ts` fell through to `{ relevance: "desc" }`, but Prisma has NO `relevance` field.
* **Fix**: `{ createdAt: "desc" }` as the default sort fallback. `views` can be used as a business-logic proxy for popularity.

### Zod v4 API (Not v3!)
* **Always**: `result.error.issues[0].message`
* **Never**: `result.error.errors[0].message` (Zod v3 API, removed in v4)

### Testing Library Text Matching Pitfalls
* **Symptom**: `getByText` fails with "Found multiple elements" when DOM contains duplicate text nodes (e.g., multiple cards in a list)
* **Fix**: Use `getAllByText` for multiple matches; use `container.querySelector` for precise targeting; use `toHaveTextContent` for text spanning multiple elements
* **Files**: All component test files

### TypeScript `as any` Strict Mode Violations
* **Gotcha**: `as any` anywhere subverts strict mode. Use `Record<string, never>` for unknown objects, `as const` for literal unions, and explicit typed interfaces
* **Example**: `const ctx = {} as any` → `const ctx: Record<string, never> = {}`
* **Files**: `ai.test.ts`, `PersonalizedGrid.tsx` (fixed)

---

## Monorepo Structure

```
packages/
  config/
    tsconfig/        # Shared TypeScript configs (strict, erasableSyntaxOnly)
    eslint/           # Shared ESLint flat config
  ui/                 # Reusable UI primitives (Button, Input, Badge, etc.)
    src/
      button.tsx
      input.tsx
      badge.tsx
      avatar.tsx
      skeleton.tsx
      index.ts          # Barrel export
  utils/              # Shared utilities
    src/
      cn.ts             # clsx + tailwind-merge
      index.ts
apps/
  web/                # Next.js 16 application
    src/
      app/              # App Router
      components/       # Feature components
        layout/         # Navbar, Footer
        shared/         # SkipLink, ErrorBoundary
        product/        # ProductCard, ProductGallery, etc.
        cart/           # CartDrawer, CartItem, etc.
        auth/           # AuthForm, ProtectedRoute
        checkout/       # ShippingStep, PaymentStep, etc.
        search/         # SearchInput, SearchOverlay, FacetFilter, VisualSearchButton
        editorial/      # ArticleCard, RichTextRenderer, ProductEmbed
        sections/       # HeroSection, FeaturedCollections, etc.
      hooks/            # useFocusTrap, useCart, useDebounce
      lib/              # Utilities (prisma, schemas, auth, utils.test.ts)
      server/           # tRPC routers, services
        routers/        # product.ts, cart.ts, order.ts, search.ts (+ search.test.ts)
        services/       # product.service.ts, cart.service.ts
      stores/           # Zustand stores (cart, auth, wishlist)
      test/             # Factory mocks, setup.ts
      types/            # TypeScript type definitions
    prisma/
      schema.prisma     # DB schema (no enums — string unions)
    public/             # Static assets (minimal .gitkeep for now)
    docs/
      architecture.md   # Monorepo, RSC/Client split, data flow
      runbook.md        # Commands, setup, common errors, troubleshooting
```

---

## Implementation Standards

### TypeScript 6 Strict Mode (Non-Negotiable)
- `strict: true`, `erasableSyntaxOnly: true`, `verbatimModuleSyntax: true`
- `noUnusedLocals: true`, `noUnusedParameters: true`
- Zero `any` — use `unknown` or typed interfaces
- Zero `enum` — use string union types (`type Status = "ACTIVE" | "DRAFT"`)
- Zero `namespace` — use ES modules
- Component-prefixed interfaces: `ProductCardProps`, not `Props`
- Prefer `interface` over `type` for structural definitions
- `import type` for type-only imports (verbatimModuleSyntax)

### Next.js 16 App Router (RSC-First)
- Server Components by default, "use client" only for interactivity
- `params` is a plain object (not a Promise) — no `await params`
- RSC: Never access `document`, `window`, or browser APIs
- `next/image`: always explicit `width` + `height`, no CLS
- Metadata: `generateMetadata` for SEO on all pages
- Server Actions: `useActionState` + Zod for all form mutations

### Tailwind CSS v4 (CSS-First)
- **Zero `tailwind.config.*` files** — all configuration in `globals.css`
- `@import "tailwindcss"` then `@theme inline` with design tokens
- OKLCH palette: `obsidian-*`, `neon-*`, `metallic-*`, `atmosphere-*`
- No raw hex: `bg-obsidian-900` not `bg-[#1a1a2e]`
- No arbitrary values: `w-[37px]` banned — extend `@theme` instead
- v4 utilities: `bg-linear-to-*`, `outline-hidden`, `shrink-0`

### React 19 Patterns
- `useActionState` for all form submissions
- `useOptimistic` + `startTransition` for instant UI feedback
- `useId()` for stable `aria-controls` pairs

### Zustand State Discipline
- Selectors only in JSX: `useStore(s => s.field)` not `.getState()`
- `partialize` persists domain data only, never UI state
- `.getState()` permitted ONLY inside store actions, never in JSX

---

## Backend (tRPC & Prisma)

### tRPC Routers
- Public: `publicProcedure` for unauthenticated
- Protected: `protectedProcedure` for auth-required
- Zod validation at every boundary
- `result.error.issues[0].message` for error messages (Zod v4 API)

### Prisma (Zero Enums)
- Zero `enum` in schema — use `String` + union types
- Typed includes: `Prisma.CartGetPayload<IncludeShape>` not `any`
- Factory pattern: `createProductService(db)`, `createCartService(db)`
- **Run `pnpm db:generate` after EVERY schema change**
- **Update ALL `prisma.model.create()` when adding required fields**

---

## Development Workflow

```bash
# Core commands
pnpm dev                    # Turbo dev — all apps
pnpm build                  # Production build
pnpm test                   # Vitest run
pnpm test:watch             # Watch mode
pnpm typecheck              # tsc --noEmit
pnpm lint                   # Next.js lint (shell scripts)

# Database
pnpm db:generate            # Prisma generate (MANDATORY after schema change)
pnpm db:migrate             # Prisma migrate dev
pnpm db:seed                # Seed with sample data
pnpm db:studio              # Prisma Studio

# Full verification pipeline
pnpm typecheck && pnpm lint && pnpm test && pnpm build
```

---

## Testing Strategy (Updated 2026-05-22)

| Type | Stack | Status |
|------|-------|--------|
| Unit | Vitest + Testing Library | ✅ Active (34 tests passing) |
| Router | Vitest + tRPC + Prisma mock | ✅ Active (search.test.ts, 9 tests) |
| AI Service | Vitest + OpenAI mock | ✅ Active (ai.service.test.ts, 6 tests) |
| Components | Vitest + Testing Library | ✅ Active (OutfitCard.test.tsx, 5 tests) |
| E2E | Playwright | 📅 Planned (Phase 5) |
| A11y | axe-core | 📅 Planned (Phase 5) |

### Test Setup (`src/test/setup.ts`)
- `requestAnimationFrame` mock via `vi.stubGlobal`
- `crypto.randomUUID` mock for deterministic IDs
- Fake timers with `shouldAdvanceTime: true`
- `@testing-library/jest-dom/vitest` imported for `toHaveTextContent`, `toBeDisabled`, etc.

---

## Anti-Patterns (Strictly Prohibited)

| Anti-Pattern | Why | Correct Approach |
|--------------|-----|-----------------|
| `enum` in TypeScript | Breaks erasableSyntaxOnly | String unions |
| `any` anywhere | Subverts strict mode | Explicit type or `unknown` |
| `tailwind.config.js` | Bypasses CSS-first v4 | `@theme inline` |
| `await params` (Next.js 16) | Runtime mismatch | Direct destructuring |
| `document`/`window` in RSC | SSR errors | Client Component |
| `.getState()` in JSX | No reactivity | Selector subscription |
| `lazy()` with R3F named imports | Type/runtime crash | Direct import + Suspense |
| `bg-gradient-to-*` | v3 deprecated | `bg-linear-to-*` |
| Raw hex in className | Bypasses design tokens | Custom `@theme` tokens |
| `result.error.errors` (Zod) | v3 API | `result.error.issues` (v4) |

---

## Documentation

| File | Purpose |
|------|---------|
| `docs/architecture.md` | Monorepo, RSC/Client split, data flow |
| `docs/runbook.md` | Commands, setup, common errors |
| `ACCOMPLISHMENTS.md` | Phase completion log with verification |
| `SKILL.md` | Mistakes catalog (#24-29), lessons learned |

---

## Lessons Learned (Updated 2026-05-22)

### Prisma Schema & Code Synchronization
- `prisma generate` is NOT automatic. Run it after EVERY schema change.
- When adding a required field, ALL `prisma.model.create()` calls must be updated, or `tsc --noEmit` fails.
- Fields like `relevance`, `viewCount`, `rating` must EXIST in `schema.prisma` before being used in queries. Do not assume.

### R3F and Dynamic Imports
- `@react-three/fiber` and `@react-three/drei` export named components.
- `React.lazy()` requires a `{ default }` export. Destructuring `const { Canvas } = React.lazy(...)` is a TypeScript and runtime error.
- Correct pattern: Direct import + `<Suspense fallback={<Skeleton />}>`. The `<Suspense>` boundary defers heavy load without `lazy()`.

### Next.js 16 `params`
- `params` is a **plain object** in Next.js 16, NOT a Promise.
- `const { slug } = await params` compiles but produces incorrect behavior at runtime.
- Always use: `const { slug } = params` (direct destructuring).

### Zod v4 API
- Error path: `result.error.issues[0].message` (not `.errors[0].message`)
- This is a breaking change from v3. All forms must use the v4 API.

### TDD with Component Tests
- **Mock data before implementation**: Write failing tests with mock data and THEN implement the component
- **Test state leakage**: Always reset Zustand store state in `beforeEach` unless `autoReset` is configured
- **Text matching**: `screen.getByText` performs exact match. Use `getAllByText` for duplicates, or `toHaveTextContent` for partial matches across elements
- **Interaction testing**: Use `userEvent` when possible, `fireEvent` only for edge cases. Always `await` user interactions.

### Strict Mode TypeScript
- **`as any` is banned**: Replace with `Record<string, never>`, `as const`, or explicit typed interfaces
- **`Record<string, never>`**: Use for empty testing objects where `any` would normally be used
- **Import types**: Always `import type` for type-only imports to comply with `verbatimModuleSyntax`
- **No unused locals**: Remove or use ALL local variables; prefix with `_` only if explicitly needed and `noUnusedLocals: true` is set

---

## Performance Budgets

| Metric | Target | Enforcement |
|--------|--------|-------------|
| LCP | < 2.5s | Lighthouse CI |
| CLS | < 0.1 | Lighthouse CI |
| INP | < 200ms | Lighthouse CI |
| Initial Bundle | < 150KB | Next.js analyze |
| Accessibility | ≥ 95 | axe-core / Lighthouse |

---

## Last Updated

**2026-05-22** — Post-Phase 3 Remediation: ai.service.ts with OpenAI integration + mock fallback, style-quiz page with 5-question quiz + tests, OutfitCard test suite, code quality fixes (removed `as any` x12, `z.enum()` -> `z.union(literal)`), TypeScript strict zero errors, 48 tests passing.

### Reviews Router (Added 2026-05-22)
- New tRPC router: `src/server/routers/review.ts` with full CRUD, voting, statistics, moderation, flagging (14 tests)
- Registered in `src/server/routers/index.ts`
- Legacy site testing summary: `docs/legacy-site-testing-summary.md`

### Remediation Plan Execution (Completed 2026-05-23)
- **SavedOutfit router**: `src/server/routers/savedOutfit.ts` — CRUD (create/delete/list/update), owner auth, 4 tests (`savedOutfit.test.ts`), registered in `index.ts`
- **Style-quiz `isComplete` fix**: Removed dual state (local `useState` + Zustand). `isComplete` now derived from `answers.length === totalSteps`. Removed `isComplete` from Zustand store and `partialize`
- **AI stream history**: `api/ai/stream/route.ts` accepts `messages` query param and passes user message history to `ai.service.ts`
- **E2E scaffold**: `playwright.config.ts` + `e2e/style-quiz.spec.ts` (3 tests). Vitest excludes `e2e/` from unit test runs
- **Lighthouse budgets**: `lighthouserc.json` with LCP<2500, CLS<0.1, TBT<200, Performance≥90, Accessibility≥95

### Critical Remediation Round 1 (Completed 2026-05-23)
- **CRIT-001**: `global-error.tsx` with retry button + tests
- **CRIT-002**: UI Primitives (`Button`, `Input`, `Dialog`, `Drawer`) with Radix + tests
- **CRIT-003**: `next.config.ts` enriched with CSP, security headers
- **CRIT-004**: `useCart` wired to tRPC mutations with fallback
- **CRIT-005**: `useWishlist` wired to tRPC mutations with fallback
- **CRIT-006**: Lighthouse CI config in `.github/workflows/ci.yml` (integration job pending)
- **CRIT-007**: Expand E2E (scheduled for Phase 5)
