# LuxeVerse Architecture

## Overview
A cinematic luxury e-commerce platform built on a Turborepo monorepo with Next.js 16 App Router, tRPC, Prisma, and Tailwind v4.

## Monorepo Structure
```
├── apps/web/          # Next.js 16 application (RSC-first)
├── packages/ui/       # Reusable UI primitives (Button, Input, etc.)
├── packages/utils/    # Shared utilities (cn, formatters)
└── packages/config/   # Shared tsconfig, eslint
```

## Architecture Decisions
- **RSC-First**: Server Components by default; client islands for interactivity.
- **tRPC + Zod**: End-to-end type-safe API with boundary validation.
- **Prisma + PostgreSQL**: Zero enums (String + union types per `erasableSyntaxOnly`).
- **Zustand**: Flat stores, `partialize` for data only, selectors in JSX.
- **Tailwind v4**: CSS-first `@theme inline`, zero JS config.

## Key Boundaries
| Layer | Tech |
|---|---|
| UI | React 19, Framer Motion, Radix/Shadcn |
| State | Zustand (client) + React Server Cache (catalog) |
| API | tRPC routers + Zod v4 |
| DB | Prisma 7 + PostgreSQL 17 |
| Payments | Stripe PaymentElement (PCI SAQ-A) |

## Data Flow
```
User → Next.js App Router → RSC → tRPC → Prisma → PostgreSQL
                ↓
         Client Island → Zustand → localStorage
```

## Environment
See `runbook.md` for setup and deployment.
