## Validated Research Findings

### 1. Root Cause Confirmed: `@ducanh2912/next-pwa` Does NOT Support Turbopack

The maintainer explicitly states: **"@ducanh2912/next-pwa currently doesn't support Turbopack"**. The plugin unconditionally injects a `webpack()` hook into the Next.js config, which conflicts with Next.js 16's default Turbopack bundler.

Multiple real‑world projects report the identical error:

> `⨯ ERROR: This build is using Turbopack, with a webpack config and no turbopack config.`

### 2. Fix #1 — `--webpack` Flag (VALIDATED ✅)

Adding `--webpack` to the build script forces Next.js to use the legacy Webpack bundler, which is fully compatible with `@ducanh2912/next-pwa`. This is confirmed by:

- **Production project (kronix):** The fix "Adicionar `--webpack` flag ao script build" was applied and confirmed working: "O build com `next build --webpack` funciona ✅"
- **Payload CMS issue (#14354):** "When running with: `pnpm next dev --webpack` everything works fine, confirming it's related to the injected webpack hook"
- **Serwist project (habits #209):** "Serwist requires webpack (Turbopack not yet supported), so build uses `--webpack` flag"
- **Another Turbopack regression (next.js #88842):** "Using `next build --webpack` restores the previous behavior"
- **LinkedIn tutorial on @ducanh2912/next-pwa:** "Run `npm run build` (without `--turbopack` for next-pwa compatibility)"

**Implementation:**
```json
// apps/web/package.json
"build": "next build --webpack"
```

### 3. Fix #2 — Empty `turbopack: {}` Config (PARTIALLY VALIDATED ⚠️)

The official Next.js documentation states you can add an empty `turbopack` property. However, this only **silences the error** — it does **not** make webpack‑based plugins work with Turbopack. The Next.js team describes this as a compatibility workaround, and Payload CMS's fix similarly adds a `turbopack` property to allow webpack configs to coexist.

**Verdict:** `turbopack: {}` suppresses the warning but is insufficient alone. It must be paired with `--webpack` for actual webpack functionality, or used only when you've verified the plugin works without webpack hooks.

### 4. Fix #3 — Serwist Configurator Mode (VALIDATED as Long‑Term Option ✅)

Serwist (the successor to `next-pwa`) **does support Turbopack** starting from v9.4 via its **Configurator mode**:

> "Since configurator mode does not depend on webpack internals, it works with Turbopack as well, eliminating the need for a separate implementation like `@serwist/turbopack`."

Configurator mode runs Serwist as an external build step **after** Next.js has finished, making it bundler‑agnostic:

```json
"build": "next build && serwist build"
```

However, Serwist's **classic `withSerwist` wrapper** (akin to `withPWA`) still requires webpack. The `@serwist/turbopack` package exists but has unresolved bugs (Issue #339, Issue #342). The feature request for Turbopack support in `@serwist/next` (Issue #54) remains open since January 2024. Migrating to Serwist Configurator mode is a Phase 2 effort.

### 5. Custom Service Worker & TypeScript Support (VALIDATED ✅)

`@ducanh2912/next-pwa` supports custom TypeScript workers via the `customWorkerSrc` option, which looks for a worker directory (default `"worker"`) relative to the project root. The original `next-pwa` (shadowwalker/next-pwa) supported `worker/index.ts` auto‑detection. The package also supports code splitting and TypeScript for custom workers. Our `src/sw.ts` file is valid and will be processed when `--webpack` is used.

Workbox packages must be installed as explicit dependencies for custom service workers that import them — this was done correctly.

### 6. The `--webpack` Flag is NOT Documented in Official CLI Reference

The official Next.js CLI docs do **not** list `--webpack` as a documented flag. However, Next.js accepts it as a **passthrough** for backward compatibility, and Vercel‑maintained plugins like Payload CMS explicitly instruct users to use it. This is a de facto standard in the ecosystem.


## Final Recommendation: Two-Phase Approach

### Phase 1 — Immediate Fix (Today)
**Use `next build --webpack`** in `apps/web/package.json`. This is confirmed working by multiple production projects and requires no code changes beyond the build script. Remove `turbopack: {}` from `next.config.ts` (it's unnecessary noise when using `--webpack`).

### Phase 2 — Future Migration (After Phase 4 Completion)
**Migrate to Serwist Configurator mode** (`@serwist/next` + `serwist build`). This is the only PWA solution that natively supports Turbopack, aligns with Next.js 16's long‑term direction, and eliminates dependency on the deprecated Webpack bundler. The migration involves:
1. Replacing `@ducanh2912/next-pwa` with `@serwist/next` and `@serwist/cli`
2. Creating a `serwist.config.js` file
3. Updating build scripts to `next build && serwist build`
4. Adapting `src/sw.ts` to use Serwist's API

