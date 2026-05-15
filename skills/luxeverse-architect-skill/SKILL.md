---
name: luxeverse-architect-skill
description: >
  Comprehensive architectural & execution framework for cinematic, production-grade, anti-generic web platforms. 
  Distills 15+ years of frontend architecture, luxury e-commerce engineering, and modern stack discipline into a repeatable, phased delivery system. 
  Covers Next.js 16 App Router, React 19, TypeScript 6, Tailwind v4, Zustand 5, Zod v4, tRPC/GraphQL, and rigorous QA gates.
  Triggers: 
   - `build luxury e-commerce platform` / `cinematic UI architecture`
   - `Next.js 16 + React 19 + Tailwind v4 phased rollout`
   - `anti-generic design system with WCAG AAA & Core Web Vitals`
   - `production-grade state management & server/client boundaries`
   - `AI-augmented commerce with strict validation & accessibility`
allowed-tools: Read, Write, Edit, Glob, Grep, Bash, SearchWeb, FetchURL 
license: MIT
version: 1.0.0 
---

## 1. Core Philosophy & Engineering Guardrails

| Principle | Enforcement Rule | Why |
|-----------|------------------|-----|
| **Anti-Generic Mandate** | Reject bento grids, purple gradients, `rounded-2xl` everything, stock hero templates, and Inter/Roboto safety defaults. Every UI must have a distinct conceptual direction. | AI homogenization signals low quality. Luxury requires intentional whitespace, asymmetric layouts, and bespoke typographical hierarchy. |
| **Accessibility as Law** | WCAG 2.1 AA minimum, AAA where feasible. Skip links mandatory. Focus traps in overlays. Roving `tabIndex` for tabs. `prefers-reduced-motion` absolute disable. | Legal requirement (ADA Title II), engineering quality standard, and non-negotiable for premium audiences. |
| **Performance as Luxury** | LCP < 2.5s, CLS < 0.1, INP < 200ms. Compositor-only animations (`transform`/`opacity`/`clipPath`). Skeleton loading > spinners. | Sub-second response is the modern equivalent of white-glove service. Layout shift breaks cinematic immersion. |
| **Library Discipline** | Use Shadcn/Radix primitives. Wrap, never rebuild from scratch. Zero redundant CSS. | Prevents bundle bloat, guarantees keyboard/a11y compliance, accelerates delivery. |
| **TypeScript Strictness** | `strict: true`, `erasableSyntaxOnly: true`, `verbatimModuleSyntax: true`. Zero `any`, `enum`, `namespace`. Explicit return types. | Catches architectural drift early. Enables fearless refactoring. Guarantees end-to-end type safety. |
| **Phased Delivery** | `ANALYZE → PLAN → VALIDATE → IMPLEMENT → VERIFY → DELIVER`. No code without plan alignment. No "done" without QA gates. | Prevents scope creep, ensures testable increments, guarantees production readiness at every milestone. |

---

## 2. Architecture Blueprint & Stack

```
┌──────────────────────────────────────────────────────────────┐
│                     CLIENT (Next.js 16 App Router)            │
│  ┌─────────┐ ┌──────────┐ ┌──────────┐ ┌──────────────────┐ │
│  │ Pages   │ │ Components│ │ Stores   │ │ Hooks            │ │
│  │ (RSC)   │ │ (Client) │ │ (Zustand)│ │ (Custom)         │ │
│  └────┬────┘ └────┬─────┘ └────┬─────┘ └──────┬───────────┘ │
│       └───────────┴────────────┴───────────────┘              │
└──────────────────────────────┬───────────────────────────────┘
                               │ tRPC (internal) + GraphQL (external)
┌──────────────────────────────┴───────────────────────────────┐
│                     API LAYER (tRPC + GraphQL)                │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐        │
│  │ Product  │ │  Cart    │ │  User    │ │  Order   │        │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘        │
└──────────────────────────────┬───────────────────────────────┘
                               │
┌──────────────────────────────┴───────────────────────────────┐
│                     DATA LAYER                                │
│  PostgreSQL 17 (Prisma 7) • Redis 7 • S3/CDN • Algolia       │
└──────────────────────────────────────────────────────────────┘
```

**Validated Stack:**
| Layer | Technology | Version | Purpose |
|-------|------------|---------|---------|
| Framework | Next.js 16 | `^16.1.4` | RSC, Streaming SSR, App Router, Turbopack |
| Language | TypeScript | `^6.0` | Strict mode, `erasableSyntaxOnly`, `verbatimModuleSyntax` |
| UI Library | React | `^19.2` | `useActionState`, `useOptimistic`, `useId`, Suspense |
| Styling | Tailwind CSS | `^4.2` | CSS-first `@theme inline`, Oxide engine, zero config file |
| State | Zustand | `^5.0` | Flat stores, selector subscriptions, `partialize` |
| Validation | Zod | `^4.4` | Runtime schema validation at boundaries |
| Routing/API | tRPC + GraphQL | Latest | Type-safe internal, flexible external queries |
| Animation | Framer Motion | `^12.29` | GPU-accelerated, gesture, layout, reduced-motion |
| Primitives | Shadcn/ui + Radix | Latest | Accessible headless components |
| Testing | Vitest + Playwright | Latest | jsdom unit, E2E critical flows, axe-core audit |

---

## 3. The 6-Phase Execution Framework

Each phase is independently deployable, strictly gated, and produces verifiable deliverables. **Do not proceed until all gates pass.**

| Phase | Objective | Duration | Deliverables | Validation Gates |
|-------|-----------|----------|--------------|------------------|
| **0. Foundation & Design System** | Bootable monorepo, TS/TW config, UI primitives, CI/CD | 2w | `pnpm dev` runs styled shell, tokens live, zero console errors | `tsc --noEmit` ✅, `@theme inline` only ✅, Lighthouse A11y ≥95 ✅ |
| **1. Core Commerce** | Catalog, Cart, Checkout, Auth, Stripe PCI | 6w | Browse → Add → Checkout → Order. Guest/Logged-in flows | Zod v4 `.issues` ✅, PCI SAQ-A ✅, `Promise.all` ✅, `useActionState` ✅ |
| **2. Cinematic Experience** | Hero, Search, Editorial, Motion, 3D/AR | 6w | URL-synced filters, scroll reveals, dynamic 3D import, reduced-motion | `transform`/`opacity` only ✅, `ssr: false` 3D ✅, compositor-only ✅ |
| **3. AI & Personalization** | Stylist, Quiz, Size Fit, Recommendations | 6w | Streaming AI, confidence scores, outfit generation, profile sync | Streaming retry ✅, `startTransition` ✅, no 100% claims ✅ |
| **4. Scale, Loyalty & Social** | Tiers, UGC, i18n/RTL, PWA, Sustainability | 6w | Global routing, offline cache, loyalty engine, RTL logical props | RTL CSS logical ✅, PWA offline ✅, atomic redemption ✅ |
| **5. Polish, Testing & Launch** | TDD, E2E, Lighthouse CI, Security, Monitoring | 4w | 100% test pass, LCP<2.5s, CSP enforced, runbooks delivered | Zero `test.skip()` ✅, `npm audit` clean ✅, Sentry/Datadog live ✅ |

---

## 4. Design System & Anti-Generic Mandate

### 4.1 CSS-First Configuration (Tailwind v4)
```css
/* globals.css */
@import "tailwindcss";
@theme inline {
  --color-obsidian-50: oklch(0.98 0.002 260);
  --color-obsidian-950: oklch(0.08 0.003 260);
  --color-metallic-champagne: oklch(0.88 0.06 75);
  --ease-luxe: cubic-bezier(0.25, 0.1, 0.25, 1);
  --space-lg: 2.618rem; /* Golden ratio */
}
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

### 4.2 Strict Rules
- **NO `tailwind.config.js`**. All tokens in `@theme inline`.
- **NO arbitrary values** like `w-[37px]`. Use `@theme` extensions.
- **Single-hyphen negatives only**: `-bottom-24` ✅, `bottom--24` ❌ (silently ignored).
- **Fluid Typography**: `clamp(2.5rem, 5vw, 4.5rem)` for headings.
- **Easing**: Use `[0.19, 1, 0.22, 1]` (expo-out) for entry, `[0.77, 0, 0.175, 1]` for dramatic exits.
- **Whitespace**: Structural voice, not empty space. Scale: `0.236 → 0.382 → 0.618 → 1 → 1.618 → 2.618`.

---

## 5. State, Data & Validation Architecture

### 5.1 RSC/Client Boundaries
- **Server Components** fetch data, render static markup, handle SEO/OG.
- **Client Islands** (`"use client"`) handle interactivity: galleries, forms, animations, cart sync.
- **Never** fetch in `useEffect`. Use RSC + `Suspense` streaming.

### 5.2 Zustand Discipline
```typescript
// ✅ CORRECT
const items = useCartStore(s => s.items);
const addItem = useCartStore(s => s.addItem);

// ❌ WRONG (no re-renders, stale reads)
const items = useCartStore.getState().items;
```
- **`partialize` ONLY domain data**: `{ items, userId }`. Never `{ isOpen, isLoading, toasts }`.
- **Flat stores**. No nested state trees.
- **Store-to-store calls OK internally**, forbidden in components.

### 5.3 React 19 Form & Mutation Patterns
- **`useActionState`** for all form submissions. Disable buttons during `isPending`.
- **`useOptimistic` + `startTransition`** for instant UI feedback.
- **Zod v4 API**: `result.error.issues[0].message` ✅, `result.error.errors` ❌ (v3 legacy).
- **Validation at boundaries only**. Internal code trusts typed contracts.

---

## 6. Critical Patterns & Anti-Patterns

| Pattern | Implementation | Why |
|---------|----------------|-----|
| **Repository Pattern** | `createProductService(db)` returns typed interface. Swappable for mocking/testing. | Decouples data access from consumers. Enables TDD without DB. |
| **Barrel Exports** | `components/index.ts` exports public API. Internal files use direct paths. | Prevents deep-path coupling. Stable refactors. |
| **Promise.all Parallelism** | `[product, variants, images] = await Promise.all([...])` | Eliminates 100-500ms sequential waterfalls. |
| **Factory Test Data** | `getMockProduct(overrides)` | Deterministic, isolated tests. No shared state leaks. |
| **Skeleton > Spinners** | `aria-busy="true"` + structured placeholder layout | Predictable layout shift (CLS < 0.1). Better UX. |

| Anti-Pattern | Fix | Consequence |
|--------------|-----|-------------|
| `tailwind.config.js` in v4 | Move to `@theme inline` | Breaks Oxide engine, bloats bundle |
| `enum` / `namespace` in TS | Use string unions + `interface` | `erasableSyntaxOnly` rejects build |
| Persisting `isOpen`/`toasts` | `partialize: (s) => ({ items: s.items })` | Stale UI, hydration mismatches |
| `transition: all` | `transition-transform duration-300` | Forces repaint, breaks 60fps |
| `autoFocus` without justification | Use `useFocusTrap` in overlays | Mobile UX disruption, a11y violation |
| Deep relative imports | Barrel `index.ts` at directory root | Brittle imports, refactor nightmares |

---

## 7. Troubleshooting & Real-World Gotchas

| Issue | Root Cause | Fix | Prevention |
|-------|------------|-----|------------|
| **jsdom `requestAnimationFrame` fails** | jsdom lacks browser APIs | `vi.stubGlobal('requestAnimationFrame', (cb) => setTimeout(cb, 16))` | Add to `setup.ts` |
| **Test console leaks across files** | `consoleSpy` at module scope | Wrap in `beforeAll`/`afterAll` inside `describe` | Scope spies per suite |
| **`useActionState` TS2322** | Missing generic types | `useActionState<CheckoutState, FormData>` | Explicit type params |
| **Scroll jank (60fps re-renders)** | `useState` tied to `window.scroll` | `useThrottledScroll` (rAF + throttle) | Never bind scroll directly |
| **Hydration mismatch on IDs** | SSR/CSR ID generation differs | `useId()` for `aria-controls` pairs | React 19 hook |
| **3D/Heavy component bloats initial JS** | Static import in route | `next/dynamic` with `ssr: false` | Dynamic import gate |
| **Focus trap escapes overlay** | `Tab` not intercepted | `useFocusTrap` with `keydown` listener | Manual or `react-focus-lock` |
| **Vite 8 `manualChunks` error** | Object form used | Function form: `manualChunks: (id) => { ... }` | Follow Rolldown spec |

---

## 8. Quality Gates & Verification Protocol

### 8.1 Pre-Commit
```bash
npx tsc --noEmit && npm run lint && npm test && npm run build
```

### 8.2 CI/CD Pipeline Stages
1. `pnpm install --frozen-lockfile`
2. `tsc --noEmit` (Zero errors)
3. `vitest run` (100% pass, zero `test.skip`)
4. `next build` (Production bundle)
5. Lighthouse CI (Perf≥90, A11y≥95, BestPractices≥95, SEO≥95)
6. `npm audit` (Zero high/critical)
7. Playwright E2E (Critical flows)

### 8.3 Accessibility & Security Gates
- [ ] `aria-busy`, `role="dialog"`, `aria-label` on all interactive elements
- [ ] Contrast ≥ 4.5:1 (normal), ≥ 3:1 (large)
- [ ] CSP headers enforced (`'unsafe-inline'` removed in prod)
- [ ] Stripe PCI SAQ-A (Elements only, zero PAN handling)
- [ ] OWASP 2025: Rate limiting, secure cookies (`HttpOnly`, `SameSite=Strict`), Zod input sanitization

---

## 9. Agent Execution Workflow

When invoked, follow this exact sequence:

1. **ANALYZE**: Mine PRD for explicit/implicit requirements. Identify ambiguities. Map to stack constraints.
2. **PLAN**: Decompose into 6-phase roadmap. Define file matrix, interfaces, success criteria, estimated effort.
3. **VALIDATE**: Present plan for explicit user sign-off. **Do not code until approved.**
4. **IMPLEMENT**: Execute sub-phases sequentially. TDD first. Use library primitives. Enforce strict TS/TW v4. Handle all UI states (`loading | error | empty | success`).
5. **VERIFY**: Run QA gates. Fix failures. Audit accessibility/performance/security. Ensure zero console errors.
6. **DELIVER**: Handoff with runbooks, architecture docs, troubleshooting guide, and next-step recommendations.

**Domain Adaptation Note:** This skill is architecture-agnostic beyond the stack. Swap commerce models for SaaS, portfolios, or dashboards while preserving the phased gates, state discipline, a11y mandates, and anti-generic rules.

---

## 10. Pre-Ship Hardening Checklists

### 🚀 Performance
- [ ] `useThrottledScroll` for all scroll listeners
- [ ] `manualChunks` function form in build config
- [ ] Dynamic `import()` for 3D/AI/heavy libs
- [ ] `next/image` explicit `width`/`height` (zero CLS)
- [ ] Lighthouse CI passes budgets

### ♿ Accessibility
- [ ] `<SkipLink />` functional
- [ ] `useFocusTrap` in all overlays
- [ ] Roving `tabIndex` + arrow keys for tabs/menus
- [ ] `prefers-reduced-motion` disables ALL animations
- [ ] axe-core zero violations

### 🔒 Security & SEO
- [ ] CSP configured, `'unsafe-inline'` removed
- [ ] OG/Twitter meta tags populated
- [ ] `rel="noopener noreferrer"` on external links
- [ ] Zod validation at every boundary
- [ ] `npm audit` clean, dependencies updated

### 🧪 Testing & Code Quality
- [ ] `requestAnimationFrame` mocked in jsdom
- [ ] `consoleSpy` scoped per suite
- [ ] All store mutations wrapped in `act()`
- [ ] Barrel exports at public boundaries
- [ ] Zero `any`, `enum`, `namespace`, `.getState()` in JSX
- [ ] Component-name-prefixed interfaces (`ErrorBoundaryProps`)

---

> **Final Directive:** Every element must justify its existence. Reject generic AI tropes. Prioritize intentionality over trends. Accessibility is non-negotiable. Performance is luxury. Deliver nothing less than production-grade, meticulously verified, and architecturally sound.
