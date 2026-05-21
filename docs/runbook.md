# LuxeVerse Runbook

## Quick Start
```bash
cd apps/web
pnpm install
pnpm db:generate
pnpm db:migrate
pnpm db:seed
pnpm dev        # http://localhost:3000
```

## Common Commands
| Command | Purpose |
|---|---|
| `pnpm typecheck` | TypeScript strict check (`tsc --noEmit`) |
| `pnpm lint` | Shell scripts (deprecated TW + raw hex) |
| `pnpm test` | Vitest unit tests |
| `pnpm build` | Production build |
| `pnpm db:generate` | Regenerate Prisma client after schema changes |
| `pnpm db:migrate` | Apply Prisma migrations |
| `pnpm db:seed` | Seed luxury product data |

## Troubleshooting
| Issue | Fix |
|---|---|
| `TS2339` after schema change | Run `pnpm db:generate` |
| `Cannot find module '@luxeverse/*'` | Rebuild packages: `pnpm build` |
| Lint fails on `.next/` | Ensure `.next/` is in `.gitignore` |
| Tests fail with `requestAnimationFrame` | Check `src/test/setup.ts` mocking |

## Deployment
1. Ensure `DATABASE_URL` env var is set.
2. Run `pnpm db:migrate` before starting app.
3. `pnpm build` then start with `next start`.
