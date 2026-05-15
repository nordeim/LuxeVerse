# LuxeVerse Runbook

## Environment Setup

```bash
# Install dependencies
pnpm install

# Start development
pnpm dev

# Build for production
pnpm build

# Run tests
pnpm test

# Type check
pnpm typecheck

# Lint
pnpm lint

# Format
pnpm format
```

## Common Errors

### `tsc --noEmit` fails with `any` or `enum`

- Search for `any` and replace with proper types or `unknown`
- Replace `enum` with string union types

### Tailwind v4 class not found

- Ensure token is defined in `globals.css` `@theme inline`
- No `tailwind.config.js` should exist

### jsdom test fails with `crypto.randomUUID`

- Polyfill is in `apps/web/src/test/setup.ts`
- Use `vi.stubGlobal` if additional globals are needed

## CI/CD Flow

1. `pnpm install --frozen-lockfile`
2. `pnpm turbo typecheck`
3. `pnpm turbo lint`
4. `pnpm turbo test`
5. `pnpm turbo build`
6. Lighthouse CI budget check
