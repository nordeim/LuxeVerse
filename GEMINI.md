# LuxeVerse — Project Instructions

Cinematic Luxury E-Commerce Platform — where AI-driven personalization meets editorial-grade design.

## Project Overview

LuxeVerse is a production-grade, cinematic luxury e-commerce platform built as a monorepo. It prioritizes emotional resonance, artistic storytelling, and technical excellence.

- **Purpose**: Redefine luxury digital retail through an immersive "digital atelier" experience.
- **Main Technologies**:
  - **Framework**: Next.js 16 (App Router, RSC-first, PPR)
  - **Language**: TypeScript 6.0+ (Strict mode, `erasableSyntaxOnly`)
  - **Styling**: Tailwind CSS v4.2+ (CSS-first, Oxide engine, OKLCH palette)
  - **DB & API**: Prisma 7, PostgreSQL 17, tRPC 11, Zod 4
  - **State**: Zustand 5 (Client state), TanStack Query 5 (Server state)
  - **3D/Media**: Three.js, React Three Fiber, Framer Motion 12
- **Architecture**:
  - **Monorepo**: Managed via `pnpm` workspaces and `Turborepo`.
  - **Apps**: `web` (Storefront), `admin` (Dashboard).
  - **Packages**: `ui` (Primitives), `design-system` (Tokens), `db` (ORM), `utils`.

## Building and Running

### Core Commands (Root)
| Command | Action |
|---------|--------|
| `pnpm install` | Install all dependencies |
| `pnpm turbo dev` | Start all apps and services in development mode |
| `pnpm turbo build` | Build all apps for production |
| `pnpm turbo test` | Run Vitest unit/component tests |
| `pnpm turbo lint` | Run custom lint validation (TW4 + colors) |
| `pnpm typecheck` | Run TypeScript check across all packages |
| `pnpm format` | Format all files with Prettier |

### Apps/Web Specifics
From `apps/web/`:
- `pnpm dev`: Start Next.js with Turbopack.
- `pnpm db:generate`: Regenerate Prisma client (Mandatory after schema changes).
- `pnpm db:migrate`: Run Prisma migrations.
- `pnpm db:seed`: Seed DB with luxury product data.

## Development Conventions

### 1. TypeScript & React 19
- **Strict Mode**: `noUnusedLocals`, `noUnusedParameters`, and `noExplicitAny` are strictly enforced.
- **Erasable Syntax**: **Zero enums** — use string union types (`type Status = "ACTIVE" | "DRAFT"`).
- **Return Types**: Prefer inferred return types for components. Avoid explicit `: JSX.Element` as it was removed from the global namespace in React 19.
- **Hooks**: Use `useActionState` for forms and `useOptimistic` + `startTransition` for instant UI updates.

### 2. Styling (Tailwind v4)
- **Zero Config**: All configuration lives in `src/app/globals.css` via `@theme inline`. **No `tailwind.config.*` files.**
- **Tokens**: Use design tokens (e.g., `bg-obsidian-900`, `text-metallic-gold`) instead of raw hex codes.
- **Negatives**: Use single-hyphen syntax (e.g., `-bottom-24`, not `bottom--24`).
- **Utilities**: `bg-linear-to-r` (v4) replaced `bg-gradient-to-r` (v3).

### 3. State Management (Zustand)
- **Selectors**: Always use selectors in JSX: `const items = useStore(s => s.items)`. **Never use `.getState()` in render.**
- **Persistence**: UI state (e.g., `isOpen`, `isLoading`) must be excluded from persistence via `partialize`.

### 4. Database (Prisma)
- **Schema Sync**: Always run `pnpm db:generate` after modifying `schema.prisma`.
- **Typing**: Use `Prisma.XGetPayload<IncludeShape>` for complex relations to ensure zero `any` in service layers.

### 5. Accessibility & Performance
- **WCAG AAA**: All interactive elements must be keyboard accessible and focus-visible.
- **Reduced Motion**: All animations must respect `prefers-reduced-motion`.
- **Budgets**: LCP < 2.5s, CLS < 0.1. `next/image` must have explicit dimensions.

### 6. Git Workflow
- **Commit Format**: `<type>: <subject>` (e.g., `feat(cart): add optimistic quantity updates`).
- **Verification**: Run `pnpm typecheck && pnpm lint && pnpm test` before any PR.

---
*This file is a living document. Update it as the project evolves.*
