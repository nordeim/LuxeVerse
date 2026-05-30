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

---

# Todos
[✓] FIX: Remove <html>/<body> from root layout.tsx to resolve hydration mismatch
[✓] VERIFY: Run typecheck, lint, test after hydration fix
[✓] DOCUMENT: Add hydration mismatch prevention to SKILL.md (root layout should not render <html>/<body> when locale layout handles them)
Hydration Mismatch Fix: COMPLETE ✅
Root Cause
The hydration mismatch occurred because both app/layout.tsx and app/[locale]/layout.tsx were rendering <html> and <body> tags with conflicting attributes.
- Root layout: <html lang="en"> (static)
- Locale layout: <html lang={locale} dir={isRTL(locale)} className={fontVars}> (dynamic)
When Next.js server-rendered the page using the root layout's <html lang="en">, the client then re-hydrated expecting the locale layout's <html lang={locale}> with additional attributes. This produced conflicting attribute values for the same DOM elements, triggering the React hydration warning.
Fix Applied
Removed <html> and <body> from the root layout, returning only <>{children}</>. The locale layout remains the sole owner of <html>/<body>, ensuring a single source of truth for document-level attributes.
Before (broken):
// app/layout.tsx
return (
  <html lang="en">
    <body>{children}</body>
  </html>
);
After (fixed):
// app/layout.tsx
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
Skill.md Updated
- §7.3: Added new section "Hydration Mismatch: Root Layout vs. Locale Layout" documenting the exact error, root cause, and fix with code examples.
- §13 (Anti-Patterns Index): Added entry: "Root layout with <html>/<body> when [locale]/layout.tsx also has them → Hydration mismatch → Remove from root, let locale layout own them."
Verification
Check	Command	Result
TypeScript	pnpm typecheck	✅ Zero errors
Lint	pnpm lint	✅ All checks passed
Test	pnpm test	✅ 92/92 tests passing
The architecture now follows the correct Next.js App Router i18n pattern, eliminating the hydration warning while maintaining type safety and all verification gates green.

---

The tRPC context error is unambiguous: Unable to find tRPC Context. Did you forget to wrap your App inside TRPCProvider HoC?. This confirms that the TRPCProvider is not mounted high enough in the component tree.
I reviewed suggested_fix_tRPC_error.md and found that it accurately identifies the root cause: the TRPCProvider wrapper exists but isn't used in the layout. The proposed fix of creating a 'use client' ClientProviders component is correct, though the file has likely been moved since the last pnpm dev run.
Let me examine the actual codebase to verify the current state of the providers.</think>I have carefully analyzed the provided error.txt and suggested_fix_tRPC_error.md. The root cause is clear: the tRPC provider is not mounted in the component tree, specifically because the LocaleLayout contains a server-side QueryClient that isn't shared with the client.
I will now audit the current tRPC setup and provider usage in the codebase to confirm this and plan the fix
✱ Glob "**/trpc/**" in apps/web/src (5 matches)
→ Read apps/web/src/trpc/provider.tsx 
→ Read apps/web/src/app/[locale]/layout.tsx 
I have confirmed that src/trpc/provider.tsx correctly exports a TRPCProvider component. However, app/[locale]/layout.tsx does not import or use it. The useCart hook at src/hooks/useCart.ts uses trpc.cart.addItem.useMutation() without the required context. Additionally, src/hooks/useCart.ts needs to import trpc from src/trpc/provider instead of src/trpc/client. I will now read these files to plan the specific changes and fix them.</think>I have confirmed that the TRPCProvider is exported but never mounted in the layout. I will now examine the useCart hook and the tRPC client setup to plan the exact changes needed to fix the context
→ Read apps/web/src/hooks/useCart.ts 
→ Read apps/web/src/trpc/client.ts 
→ Read apps/web/src/trpc/server.ts 
I have now deeply analyzed the error log and the codebase. Here's the root cause and the detailed remediation plan:
Root Cause:
The tRPC Context error occurs because src/hooks/useCart.ts imports trpc from src/trpc/provider, but the TRPCProvider exported from there is never included in the component tree. In app/[locale]/layout.tsx, only NextIntlClientProvider is used, but TRPCProvider is not present as a wrapper. Therefore, when useCart tries to call trpc.cart.addItem.useMutation(), it fails because it is not inside a <trpc.Provider> node.
Analysis of suggested_fix_tRPC_error.md:
The suggested fix is correct: create a client-side ClientProviders component that wraps both NextIntlClientProvider and TRPCProvider, and then include it in app/[locale]/layout.tsx.
Remediation Tasks:
1. Create src/components/providers/ClientProviders.tsx with 'use client'.
2. Modify src/app/[locale]/layout.tsx to replace <NextIntlClientProvider> with <ClientProviders>.
3. Update src/hooks/useCart.ts to correctly import trpc after the provider is properly mounted (it should already work, but I will verify).
I will now create the ClientProviders component, modify the layout, update the hook, and run the verification.
# Todos
[•] Create src/components/providers/ClientProviders.tsx with TRPCProvider + NextIntlClientProvider
[ ] Update app/[locale]/layout.tsx to use ClientProviders
[ ] Update src/hooks/useCart.ts to import trpc correctly
[ ] Verify typecheck, lint, and build pass
# Create providers directory
$ mkdir -p /home/project/LuxeVerse/apps/web/src/components/providers

→ Read apps/web/src/app/[locale]/layout.tsx 
→ Read apps/web/src/components/providers/ClientProviders.tsx 
→ Read apps/web/src/hooks/useCart.ts 
Good. The useCart.ts import import { trpc } from "@/trpc/provider"; is correct. The issue wasn't the import path, but the fact that the TRPCProvider component from @/trpc/provider was never mounted in the layout. Now that we've added ClientProviders which wraps TRPCProvider around the app, the trpc instance from @/trpc/provider will have the correct React Context to provide its hooks. 
I will now verify the changes by running the verification pipeline.</think>The import in useCart.ts is correct. The core issue was the TRPCProvider not being mounted in the layout. I've now created ClientProviders and updated the layout to use it. Next, I will run the verification pipeline to confirm the fix.
# Run TypeScript check after tRPC fix
$ pnpm typecheck 2>&1 | tail -n 10


