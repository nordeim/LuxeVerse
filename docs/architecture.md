# LuxeVerse Architecture

## Stack

- **Framework:** Next.js 16 (App Router, RSC-first, PPR incremental)
- **Language:** TypeScript 6.0 (`strict`, `erasableSyntaxOnly`, `verbatimModuleSyntax`)
- **Styling:** Tailwind CSS v4.0 (CSS-first `@theme inline`, OKLCH tokens)
- **State:** Zustand 5 (flat stores, selectors, `partialize` for data only)
- **Validation:** Zod v4 (`.issues` API at boundaries)
- **Testing:** Vitest + Testing Library + Playwright
- **Monorepo:** Turborepo + pnpm workspaces

## Monorepo Structure

```
packages/
  config/
    tsconfig/      Shared TS strict configs
    eslint/        Shared ESLint flat config
  ui/              Reusable UI primitives (Button, Input, Badge, etc.)
  utils/           Shared utilities (cn, formatters)
apps/
  web/             Next.js 16 application
```

## RSC/Client Boundary Strategy

- **Server Components:** Data fetching, layout, static content, SEO metadata
- **Client Components:** Interactivity, state, animations, forms (explicitly marked with `"use client"`)
- **Rule:** Start with RSC, hoist to client only when interactivity is required

## State Management Rules

- Zustand selectors only: `useStore(s => s.field)`
- `.getState()` permitted only inside store actions
- `partialize` persists domain data only (never UI state)
- URL state for shareable filters (`searchParams`)

## Quality Gates

- `tsc --noEmit` must pass with 0 errors
- Zero `any`, `enum`, `namespace`
- No raw hex in `className`
- No deprecated TW v3 utilities
- axe-core score >= 95
