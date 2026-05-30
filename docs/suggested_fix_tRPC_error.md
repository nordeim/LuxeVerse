## Research Summary

The error `Unable to find tRPC Context. Did you forget to wrap your App inside withTRPC HoC?` occurs because:

1. **tRPC v11 uses `createTRPCReact` + `TRPCProvider`** – The client hooks (`useMutation`, `useQuery`) must be called within a React Context provided by `TRPCProvider`. Your `useCart` hook calls `trpc.cart.addItem.useMutation()`.
2. **Provider not mounted** – Your `src/providers/Providers.tsx` exists but is **never used** in any layout. The `LocaleLayout` (server component) cannot directly include client‑side providers.
3. **Classic React Query integration** – You are using `@trpc/react‑query` (the “classic” integration). While still supported, the recommended integration for the App Router is `@trpc/tanstack‑react‑query`. The classic integration can still work, but the provider must be placed correctly.

## Proposed Fix vs. My Analysis

| Aspect | Proposed Fix | My Analysis |
|--------|--------------|-------------|
| **Core diagnosis** | `TRPCProvider` is not in the component tree. | ✅ Correct. The root cause is indeed the missing provider. |
| **Solution approach** | Create a `ClientProviders` wrapper component that includes `NextIntlClientProvider` and `TRPCProvider`, then use it in `LocaleLayout`. | ✅ Correct. In Next.js App Router, any component using hooks must be a client component. Wrapping `TRPCProvider` in a `'use client'` component is the proper pattern. |
| **tRPC package** | Uses `@trpc/react‑query` and `createTRPCReact`. | ⚠️ Works but is the “classic” integration. For App Router, `@trpc/tanstack‑react‑query` is the recommended package because it is designed for RSC and provides better SSR support. |
| **Singleton QueryClient** | Includes a `browserQueryClient` singleton to avoid re‑initialization. | ✅ Good practice – prevents unnecessary re‑renders. |
| **URL resolution** | Implements `getUrl()` with environment detection. | ✅ Essential for correct API endpoint resolution in both development and production. |
| **Safety check in `useCart`** | Adds a runtime warning when context is missing. | ✅ Helpful for debugging, but does not replace the provider. |

## Potential Pitfalls & Improvements

1. **`@trpc/tanstack‑react‑query` is the official recommendation**  
   The tRPC documentation explicitly states: *“For App Router, the recommended client package is `@trpc/tanstack‑react‑query`”*. The classic `@trpc/react‑query` is still supported, but it is not optimised for React Server Components. If you encounter any further issues with SSR, prefetching, or suspense, migrating to the new package would resolve them.

2. **Ensure `ClientProviders` is a client component**  
   The proposed `ClientProviders.tsx` must include `'use client'` at the top – otherwise it will still be treated as a server component and cannot host the tRPC context. The snippet in the proposed fix does this correctly.

3. **Check import paths**  
   - The `trpc` import in `useCart.ts` should come from `@/trpc/provider` (as shown in the fix) to get the typed hooks.
   - The `TRPCProvider` must be exported from `src/trpc/provider.tsx`.

4. **Remove the root layout’s HTML tags** (unrelated to this error, but for completeness)  
   As identified in the previous hydration mismatch analysis, `app/layout.tsx` should **not** render `<html>`/`<body>`. Those belong in the locale layout.

## Final Recommendation

The proposed fix is **sound and will resolve the immediate tRPC context error**. It correctly identifies the missing provider and implements the proper App Router pattern.

### 🔧 Implementation Steps

1. **Update `src/trpc/provider.tsx`** – Ensure it uses the singleton QueryClient and proper URL resolution (as shown in the proposed fix).

2. **Create `src/components/providers/ClientProviders.tsx`** (or reuse `src/providers/Providers.tsx`) with `'use client'` and wrap both `NextIntlClientProvider` and `TRPCProvider`.

3. **Modify `src/app/[locale]/layout.tsx`** – Replace the existing client‑side provider with `<ClientProviders>`. For example:

   ```tsx
   // src/app/[locale]/layout.tsx
   import { ClientProviders } from '@/components/providers/ClientProviders';

   export default async function LocaleLayout({ children, params }) {
     // ... locale validation & message loading

     return (
       <html lang={locale} dir={isRTL(locale) ? 'rtl' : 'ltr'}>
         <body className="bg-obsidian-50 text-obsidian-900 antialiased">
           <ClientProviders locale={locale} messages={messages}>
             <SkipLink />
             <ErrorBoundary>
               <Navbar />
               <main id="main-content" className="min-h-screen pt-[var(--navbar-height)]">
                 {children}
               </main>
               <Footer locale={locale} />
             </ErrorBoundary>
           </ClientProviders>
         </body>
       </html>
     );
   }
   ```

4. **Add optional safety check** in `src/hooks/useCart.ts` (as shown) to warn when the context is missing.

### 🚀 Long‑Term Improvement

Consider migrating to `@trpc/tanstack‑react‑query` for full App Router compatibility. The setup is similar, but you would replace `createTRPCReact` with `createTRPCContext` and adjust the provider accordingly. This is not required to fix the current error, but it will improve SSR and suspense support.

## Verification Checklist

- [ ] Run `pnpm dev` – no tRPC context error in the console.
- [ ] Click “Quick Add” on the shop page – cart drawer opens and mutation succeeds.
- [ ] Open React DevTools – verify `TRPCProvider` exists in the component tree above the cart‑related components.
- [ ] Run `pnpm typecheck` – no type errors.
- [ ] (Optional) Add a temporary test mutation to confirm the client can reach the API endpoint.

By implementing the proposed fix as described, the tRPC context error will be eliminated, and your cart functionality will work as expected.

