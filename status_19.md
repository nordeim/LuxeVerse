I see the issue clearly now. The hydration mismatch is happening because app/layout.tsx renders <html lang="en"> with dir="ltr" and some font classes, while the locale layout renders <html lang={locale}> with dir={isRTL(locale)} and its own font classes. Next.js is detecting the discrepancy.
Looking at the error trace, the mismatch occurs on the <html> element:
- Server renders: lang="en", dir="ltr", className="cormorant_garamond_7c0fb06e-module__fZGTPa__variable dm_sans_fd62f040-module__0..."
- Client expects: different attributes
The root cause identified in suggested_fix_runtime_hydration_error.md is correct. However, we cannot simply remove <html> and <body> from the root layout, because that would break Next.js's "missing root layout tags" requirement. Instead, the approach should match the suggested_fix exactly: remove the <html> and <body> elements from the root layout, and keep the metadata object. The [locale]/layout.tsx will then provide the <html> and <body> elements.
Let me analyze the current state of app/layout.tsx and confirm the proposed fix. I'll look at how to cleanly separate the metadata (which can stay in the root layout) from the <html>/<body> structure.
Let me read both layouts to confirm the exact
→ Read apps/web/src/app/layout.tsx 
→ Read apps/web/src/app/[locale]/layout.tsx 
I have identified the root cause. The hydration mismatch occurs because app/layout.tsx and app/[locale]/layout.tsx both render <html> and <body> tags, causing Next.js to see conflicting attributes.
Root Cause Confirmed:
- app/layout.tsx renders <html lang="en"> (static)
- app/[locale]/layout.tsx renders <html lang={locale}>... (dynamic, with fonts, dir, etc.)
- Next.js sees both and reports a hydration mismatch because the server-rendered attributes don't match the client's expectations for the same element.
Proposed Optimal Fix:
Remove <html>/<body> from the root layout. The [locale]/layout.tsx will become the sole provider of these tags, preventing the conflict.
Plan:
1. Remove <html>/<body> from app/layout.tsx
2. Keep metadata in root layout
3. Verify [locale]/layout.tsx already has <html>/<body>
4. Run pnpm typecheck && pnpm test && pnpm lint
5. Document the pattern in `SK
# Todos
[•] FIX: Remove <html>/<body> from root layout.tsx to resolve hydration mismatch
[ ] VERIFY: Run typecheck, lint, test after hydration fix
[ ] DOCUMENT: Add hydration mismatch prevention to SKILL.md (root layout should not render <html>/<body> when locale layout handles them)

