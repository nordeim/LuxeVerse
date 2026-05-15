---
IMPORTANT: File is read fresh for every conversation. Be brief and practical. This is a luxury e-commerce platform — every pixel and interaction must feel premium.
---

# LuxeVerse

**Cinematic Luxury E-Commerce Platform** — An immersive, AI-driven digital boutique experience. Blending art direction, intelligent personalization, and commerce to redefine luxury digital retail.

**Tech Stack**: Next.js 16 (App Router), React 19, TypeScript 6, Tailwind CSS v4 (CSS-first), Prisma 7, PostgreSQL, tRPC, NextAuth v5, Zustand, Stripe

**Architecture**: Turborepo monorepo with pnpm workspaces. Headless composable commerce with RSC-first rendering.

---

## Core Identity & Purpose

LuxeVerse is a luxury e-commerce platform built on the **Anti-Generic Mandate**. Every pixel, animation, and interaction must feel intentionally crafted. Reject template-driven design. Reject purple gradients. Reject Inter + Roboto system font fallbacks. The platform delivers cinematic product storytelling, AI-driven personalization, and immersive 3D/AR shopping.

---

## Foundational Principles

### Meticulous Approach (Six-Phase Workflow)

Follow this six-phase workflow for ALL implementation tasks:

1. **ANALYZE** — Deep, multi-dimensional requirement mining
   - Examine PRD §matching section for full context
   - Identify explicit requirements, implicit needs, potential ambiguities
   - Review existing code for patterns and constraints
   - Perform risk assessment with mitigation strategies

2. **PLAN** — Structured execution roadmap
   - Create detailed plan with sequential phases and checklist
   - Present plan for explicit user confirmation
   - Never proceed to IMPLEMENT without user validation

3. **VALIDATE** — Explicit confirmation checkpoint
   - Obtain explicit user approval before coding
   - Address concerns or modifications
   - Ensure alignment on all aspects

4. **IMPLEMENT** — Modular, tested, documented builds
   - Set up environment: dependencies, configurations
   - Implement in logical, testable components
   - Create documentation alongside code
   - Test each component before integration

5. **VERIFY** — Rigorous QA against success criteria
   - TypeScript strict: `tsc --noEmit` must pass with 0 errors
   - Tailwind v4: no `tailwind.config.js`, `@theme inline` only
   - Accessibility: axe-core ≥ 95, WCAG AAA target
   - Security: Zod validation at all boundaries
   - Performance: LCP < 2.5s, CLS < 0.1, INP < 200ms

6. **DELIVER** — Complete handoff with knowledge transfer
   - Full solution with usage instructions
   - Document challenges and solutions
   - Suggest improvements and next steps

### Anti-Generic Mandate

- **Reject AI Slop**: No template layouts, no predictable card grids, no "safe" design choices
- **Intentional Minimalism**: Use whitespace as a structural element, not empty space
- **Luxury Aesthetic**: OKLCH palette (Obsidian, Neon, Metallic, Atmosphere), fluid typography, golden-ratio spacing
- **Anti-Purple**: No purple/indigo gradients. No safe "Inter/Roboto" pairings without typographic hierarchy
- **Every Pixel Justified**: Every element must have a reason to exist

### Anti-Generic Enforcement
- Reject convergence toward: Inter safety, purple gradients, card grid homogenization
- No generic "AI aesthetic" — oversized padding, rounded-2xl everything, stock layouts
- Bespoke at every level: typography, color, spacing, animation

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
      hooks/            # useFocusTrap, useCart
      lib/              # Utilities (prisma, schemas, auth)
      server/           # tRPC routers, services
        routers/        # product.ts, cart.ts, order.ts
        services/       # product.service.ts, cart.service.ts
      stores/           # Zustand stores (cart, auth)
      test/             # Factory mocks, setup.ts
      types/            # TypeScript type definitions
    prisma/
      schema.prisma     # DB schema (no enums — string unions)
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
- Server Components by default, `"use client"` only for interactivity
- `app/` directory with file-based routing
- `params` is a plain object (not a Promise) — no `await params`
- RSC: Never access `document`, `window`, or browser APIs — must be in Client Components
- `next/image`: always explicit `width` + `height`, no CLS
- `next/font`: always load fonts via `next/font/google` or `next/font/local`
- Metadata: `generateMetadata` for SEO on all pages
- Server Actions: `useActionState` + Zod for all form mutations
- PPR (Partial Prerendering): enable where applicable

### Tailwind CSS v4 (CSS-First)
- **Zero `tailwind.config.*` files** — all configuration in `globals.css`
- `@import "tailwindcss"` then `@theme inline` with design tokens
- Custom tokens: `--color-*`, `--text-*`, `--font-*`, `--space-*`, `--ease-*`
- OKLCH palette: `obsidian-*`, `neon-*`, `metallic-*`, `atmosphere-*`
- No raw hex in `className`: `bg-obsidian-900` not `bg-[#1a1a2e]`
- No arbitrary values: `w-[37px]` banned — extend `@theme` instead
- No deprecated v3 utilities: `bg-gradient-to-*` → `bg-linear-to-*`, `outline-none` → `outline-hidden`, `flex-shrink-0` → `shrink-0`
- Tailwind theme audit required before commit

### Tailwind v4 Rules
```css
/* Correct: Define in @theme inline */
@theme inline {
  --color-obsidian-900: oklch(0.12 0.005 260);
}

/* Wrong: Don't do this anywhere */
<div className="w-[37px] bg-[#1a1a2e]">
```

### Design System
- **Typography**: Cormorant Garamond (display), DM Sans (body), JetBrains Mono (mono)
- **Spacing**: Golden-ratio scale (`--space-3xs: 0.236rem`, `--space-2xl: 6.854rem`)
- **Easing**: `--ease-luxe`, `--ease-dramatic`, `--ease-spring`
- **Focus**: `outline: 2px solid var(--color-neon-cyan)`, offset 2px

---

## React 19 Patterns

### Hooks
- `useActionState` for all form submissions — server actions
- `useOptimistic` for instant UI feedback (cart, favorites)
- `startTransition` wraps all async setters
- `useId()` for stable `aria-controls` pairs

### Forms
```tsx
const [state, formAction, isPending] = useActionState(createAction, initialState);

<form action={formAction}>
  <input name="email" />
  <button disabled={isPending}>Submit</button>
  {state.status === "error" && <p role="alert">{state.message}</p>}
</form>
```

### Zustand State Discipline
- Selectors only in JSX: `useStore(s => s.field)` not `.getState()`
- `partialize` persists domain data only, never UI state
- Flat stores, not nested — one slice per file
- `.getState()` permitted ONLY inside store actions, never in JSX

---

## Backend (tRPC & Prisma)

### tRPC Routers
- Public: `publicProcedure` for unauthenticated
- Protected: `protectedProcedure` for auth-required
- Zod validation at every boundary using `input(...)`
- `result.error.issues[0].message` for error messages (Zod v4 API)
- Services accept injected `PrismaClient` — mockable for testing

### Prisma
- Zero `enum` in schema — use `String` + union types
- Typed includes: `Prisma.CartGetPayload<IncludeShape>` not `any`
- Factory pattern: `createProductService(db)`, `createCartService(db)`
- `Promise.all` for parallel fetches
- Raw SQL only when necessary with parameterized queries

---

## Zustand & Cart State

```ts
// cart.ts
export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      isOpen: false,
      isLoading: false,
      // ...
    }),
    {
      name: "luxeverse-cart",
      // CRITICAL: Persist ONLY domain data
      partialize: (state) => ({ items: state.items }),
    }
  )
);

// usage
const items = useCartStore((s) => s.items);  // Not .getState()
```

---

## Development Workflow

```bash
# Install dependencies (from root)
pnpm install

# Development (from root)
pnpm dev                    # Turbo dev — all apps

# From apps/web/
pnpm dev                    # Next.js dev with Turbopack
pnpm build                  # Production build
pnpm test                   # Vitest
pnpm test:watch             # Watch mode
pnpm typecheck              # tsc --noEmit
pnpm lint                   # Next.js lint

# Database
pnpm db:generate            # Prisma generate
pnpm db:migrate             # Prisma migrate dev
pnpm db:seed                # Seed with sample data
pnpm db:studio              # Prisma Studio
```

### Workflow Commands (from root)
| Command | Purpose |
|---------|---------|
| `pnpm dev` | Start all apps in dev mode |
| `pnpm build` | Production build (all apps) |
| `pnpm test` | Vitest for all packages |
| `pnpm typecheck` | TypeScript check across monorepo |
| `pnpm lint` | ESLint + Prettier across packages |
| `pnpm format` | Prettier format all files |
| `pnpm clean` | Clean build artifacts |

---

## Testing Strategy

### Stack
- **Unit**: Vitest + React Testing Library (jsdom)
- **E2E**: Playwright
- **Mock**: ts-mockito + factory patterns

### Test Commands
```bash
# Vitest (web app)
cd apps/web && pnpm test       # Run tests
cd apps/web && pnpm test:watch # Watch mode

# Factory pattern (mandatory)
import { getMockUser } from "./factories";
const user = getMockUser({ role: "ADMIN" });
```

### Test Setup
```ts
// apps/web/src/test/setup.ts
beforeEach(() => {
  vi.useFakeTimers({ shouldAdvanceTime: true });
  vi.stubGlobal("requestAnimationFrame", (cb: FrameRequestCallback) => {
    return window.setTimeout(cb, 16) as unknown as number;
  });
  Object.defineProperty(window, "crypto", {
    value: { randomUUID: () => "test-uuid" + Math.random().toString(36).slice(2) },
  });
});

afterEach(() => {
  vi.unstubAllGlobals();
  vi.useRealTimers();
});
```

---

## Code Quality Standards

### ESLint (Flat Config)
```js
// packages/config/eslint/base.js
export default [
  {
    rules: {
      "@typescript-eslint/no-explicit-any": "error",
      "no-restricted-syntax": [
        "error",
        { selector: "TSEnumDeclaration", message: "No enums — use unions" },
        { selector: "TSModuleDeclaration", message: "No namespaces — use ES modules" },
      ]
    }
  }
];
```

### CI Pipeline
```yaml
# .github/workflows/ci.yml
# Stages: typecheck → lint → test → build → Lighthouse
```

### Pre-Commit Validation
```bash
# Validate before commit
pnpm typecheck            # Must pass with 0 errors
pnpm lint                 # Must pass with 0 warnings
pnpm test                 # Must pass with 0 failures
pnpm build                # Must succeed
```

---

## Accessibility (WCAG AAA)

- **Skip Link**: `SkipLink.tsx` — first focusable element in `<body>`
- **Focus Trap**: `useFocusTrap` for modals, drawers, overlays
- **Keyboard**: All interactive elements keyboard-accessible
- **ARIA**: `role`, `aria-*` on all custom components
- **Reduced Motion**: `prefers-reduced-motion` media query — all animations must disable
- **Skeleton**: `aria-busy="true"` on loading states, never spinners for content
- **Contrast**: 7:1 for normal text, 4.5:1 for large text
- **Labels**: All form inputs properly labeled, visible or `aria-label`

### Required Accessibility in Every Component
- [ ] Loading, empty, error states handled
- [ ] Keyboard accessible
- [ ] Focus visible
- [ ] Reduced motion respected
- [ ] Semantic HTML (no `div` for buttons)

---

## Error Handling & Debugging

### Validation at Boundaries
- ALL form input validated with Zod (`result.error.issues[0].message`)
- NO manual inline validation (`if (!email.includes('@'))`)
- Server actions return `{ status: 'error', message: string }`
- React 19 `useActionState` for form state and errors

### Client Error
- `ErrorBoundary` in root layout catches runtime errors
- Graceful fallback with telemetry (Sentry/Datadog)

### Server Error
- tRPC `errorFormatter` for structured errors
- Zod validation on every procedure boundary
- NEVER expose stack traces to client

---

## Git & Version Control

### Commit Convention
- Format: `<type>: <subject>` (scope requires type)
- Types: `feat:`, `fix:`, `style:`, `refactor:`, `docs:`, `test:`, `chore:`, `ci:`, `perf:`, `revert:`
- Body: WHY, not just what. Reference #issue number
- Scope: Component/area affected (e.g., `feat(cart): add free shipping threshold`)

### Branching Strategy
- `main`: Production-ready
- `dev:feature/description`: Feature branches (merge via PR)
- `dev:fix/description`: Bug fix branches

### Before Committing
```bash
# This command must pass with NO errors
pnpm typecheck && pnpm lint && pnpm test
```

---

## Payment & Security

### Stripe Integration
- **PCI SAQ-A**: Only Stripe Elements touches card data
- `PaymentElement` (not custom card inputs)
- Server-only: `stripe.paymentIntents.create()`
- Zero raw PAN in client (violates PCI)



### Auth (NextAuth v5)
- JWT strategy with `httpOnly` cookies
- Role-based access control (RBAC): `CUSTOMER`, `ADMIN`, `EDITOR`
- Password hashing with `@node-rs/bcrypt` (12 salt rounds)
- Auth state ephemeric
- `NEXTAUTH_SECRET` and `NEXTAUTH_URL` required in `.env`

### Rate Limiting
- In-memory rate limiter: 30 req/min per IP
- **WARNING**: Replace with Redis for production
- Config in `apps/web/src/middleware.ts`

---

## Environment Variables

| Variable | Purpose | Example |
|----------|---------|---------|
| `DATABASE_URL` | Prisma/PostgreSQL | `postgresql://...` |
| `NEXTAUTH_SECRET` | JWT signing | `your-secret-key` |
| `NEXTAUTH_URL` | Auth callbacks | `http://localhost:3000` |
| `STRIPE_SECRET_KEY` | Server-side Stripe | `sk_...` |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Client-side Stripe | `pk_...` |
| `AUTH_SECRET` | NextAuth v5 | `your-secret-key` |
| `REDIS_URL` | Production cache | `redis://localhost:6379` |

---

## Design System Reference

### OKLCH Color Palette
| Token | OKLCH Value | Usage |
|-------|-------------|-------|
| `obsidian-50` | `oklch(0.98 0.002 260)` | Lightest background |
| `obsidian-900` | `oklch(0.12 0.005 260)` | Primary text |
| `obsidian-950` | `oklch(0.08 0.003 260)` | Button/dark surfaces |
| `neon-cyan` | `oklch(0.85 0.18 190)` | Focus indicators |
| `neon-pink` | `oklch(0.65 0.28 350)` | Errors/callouts |
| `metallic-champagne` | `oklch(0.88 0.06 75)` | Primary CTAs |
| `metallic-gold` | `oklch(0.78 0.14 85)` | Hover states |

### Typography
| Role | Font | Usage |
|------|------|-------|
| Display | Cormorant Garamond | Headlines, nav, hero |
| Body | DM Sans | Paragraphs, labels |
| Mono | JetBrains Mono | Code, order IDs |

### Spacing (Golden Ratio)
```
3xs: 0.236rem
2xs: 0.382rem
xs:  0.618rem
sm:  1.000rem
md:  1.618rem
lg:  2.618rem
xl:  4.236rem
2xl: 6.854rem
```

---

## Anti-Patterns (Strictly Prohibited)

| Anti-Pattern | Why | Correct Approach |
|--------------|-----|------------------|
| `enum` in TypeScript | Breaks erasableSyntaxOnly | String unions |
| `any` anywhere | Subverts strict mode | Explicit type or `unknown` |
| `tailwind.config.js` | Bypasses CSS-first v4 | `@theme inline` in `globals.css` |
| `document`/`window` in RSC | SSR errors | Move to Client Component |
| `.getState()` in JSX | No reactivity | Selector subscription |
| Persisting UI state | Leaks ephemeral state | `partialize: (s) => ({ data: s.data })` |
| `bg-gradient-to-*` | v3 deprecated | `bg-linear-to-*` |
| Raw hex in className | Bypasses design tokens | Custom `@theme` tokens |
| Emojis in UI | Non-standard, breaks a11y | Lucide icons only |
| `window.location.href` | Full page reload | `useRouter().push()` |
| Purple gradients | AI slop, generic | Bespoke OKLCH palette |
| `outline-none` | v3 deprecated | `outline-hidden` |
| `flex-shrink-0` | v3 deprecated | `shrink-0` |

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

## Documentation Files

| File | Purpose |
|------|---------|
| `docs/architecture.md` | Monorepo, RSC/Client split, data flow |
| `docs/design-tokens.md` | Color, typography, spacing, easing |
| `docs/runbook.md` | Commands, setup, common errors |
| `docs/phase-1-completion.md` | Phase 1 deliverables and fixes |
| `scripts/validate-colors.sh` | Block raw hex in className |
| `scripts/validate-deprecated-twind.sh` | Block v3 utilities |

---

## Key Project Files

| File | Purpose |
|------|---------|
| `apps/web/package.json` | App dependencies and scripts |
| `apps/web/next.config.ts` | Next.js 16 config |
| `apps/web/tsconfig.json` | Strict TypeScript config |
| `apps/web/src/app/globals.css` | Tailwind v4 theme entry |
| `apps/web/prisma/schema.prisma` | Database schema |
| `turbo.json` | Monorepo task orchestration |
| `pnpm-workspace.yaml` | Workspace definitions |
