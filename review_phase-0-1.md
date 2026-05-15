        outline-offset: 2px;  
      }  
    }  
  ```  
  Good base styles. ✅  
  ```css  
    @media (prefers-reduced-motion: reduce) {  
      *, *::before, *::after {  
        animation-duration: 0.01ms !important;  
        animation-iteration-count: 1 !important;  
        transition-duration: 0.01ms !important;  
        scroll-behavior: auto !important;  
      }  
    }  
  ```  
  Correct prefers-reduced-motion handling per skills. ✅  
  
CRITICAL TAILWIND v4 ISSUE:  
The design uses custom tokens like --color-obsidian-50, --font-display, etc. In Tailwind v4, the @theme inline block generates utility classes. This looks correct in theory, BUT:  
  
Tailwind v4 CSS-first requires specific syntax for @theme inline. The shown code uses:  
  
```css  
  @theme inline {  
    --color-obsidian-50: oklch(0.98 0.002 260);  
    ...  
  }  
```  
  
This is correct for v4. Values inside @theme inline become available as utilities like bg-obsidian-50, text-obsidian-900, etc. ✅  
  
However, one potential issue: font-display won't work as a utility unless defined as --font-display. Tailwind v4 can access --font-display as font-display utility, which is shown in the base styles. This seems correct.  
  
### Sub-Phase 0.3: Core Utilities & UI Primitives  
  
cn.ts:  
  
```typescript  
  import { clsx, type ClassValue } from "clsx";  
  import { twMerge } from "tailwind-merge";  
  export function cn(...inputs: ClassValue[]): string {  
    return twMerge(clsx(inputs));  
  }  
```  
  
This is correct but look at the import: import { clsx, type ClassValue } from "clsx"; — type ClassValue is used, which is fine.  
  
packages/ui/src/button.tsx:  
  
```typescript  
  import { forwardRef, type ButtonHTMLAttributes } from "react";  
  import { cva, type VariantProps } from "class-variance-authority";  
  import { cn } from "@utils/cn";  
  
  const buttonVariants = cva(  
    "inline-flex items-center justify-center rounded-lg font-medium transition-all focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-neon-cyan disabled:pointer-events-none disabled:opacity-50",  
    {  
      variants: {  
        variant: {  
          default: "bg-metallic-champagne text-obsidian-950 hover:bg-metallic-gold",  
          outline: "border border-obsidian-900/20 bg-transparent hover:bg-obsidian-900/5",  
          ghost: "hover:bg-obsidian-900/5",  
          luxury: "bg-obsidian-950 text-metallic-champagne hover:bg-obsidian-900 shadow-sm",  
        },  
        size: {  
          default: "h-10 px-4 py-2",  
          sm: "h-8 px-3 text-sm",  
          lg: "h-12 px-6 text-lg",  
          icon: "h-10 w-10",  
        },  
      },  
      defaultVariants: { variant: "default", size: "default" },  
    }  
  );  
  
  export interface ButtonProps  
    extends ButtonHTMLAttributes<HTMLButtonElement>,  
      VariantProps<typeof buttonVariants> {  
    loading?: boolean;  
  }  
  
  export const Button = forwardRef<HTMLButtonElement, ButtonProps>(  
    ({ className, variant, size, loading, children, ...props }, ref) => (  
      <button  
        ref={ref}  
        className={cn(buttonVariants({ variant, size }), className)}  
        disabled={props.disabled || loading}  
        {...props}  
      >  
        {loading && (  
          <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />  
        )}  
        {children}  
      </button>  
    )  
  );  
  
  Button.displayName = "Button";  
```  
  
Issues found:  
1. focus-visible:outline-hidden: In Tailwind v4, outline-hidden is the correct replacement for outline-none. However, button elements by default may not always show focus-visible rings in all browsers when using outline-hidden. This   
should be tested especially with keyboard navigation. The intent is correct per Tailwind v4. ✅  
2. VariantProps import: import { cva, type VariantProps } from "class-variance-authority"; — This is correct TypeScript. ✅  
3. ButtonProps interface: Extends ButtonHTMLAttributes and VariantProps. Uses component-prefixed interface. ✅  
4. No type=button default: When rendering a <button> without explicit type, it defaults to submit inside forms. This should have type="button" as default via ...props, but if the user passes type="submit" it should work. The component 
should probably default to type="button" unless explicitly overridden.  
  ```tsx  
    <button type={props.type ?? "button"} ... />  
  ```  
  This is missing. ISSUE: Without explicit type="button", buttons inside forms will submit. This is a common but important bug. ButtonHTMLAttributes defaults type to "submit", so this is technically correct behavior but may surprise   
consumers.  
5. loading state: Uses inline spinner inside button. Accessible if properly implemented with aria-busy and aria-label. The spinner is purely visual (animate-spin). The button is disabled during loading, which removes it from tab  
order. This is acceptable but consider using aria-busy="true" on the button itself when loading. Minor enhancement.  
  
use-focus-trap.ts:  
This is the manual focus trap from the MVP skill. It looks correct:  
- Gets focusable elements ✅  
- Handles Tab (forward) and Shift+Tab (backward) ✅  
- Returns focus to trigger on close ✅  
  
One minor issue: The trap doesn't prevent focus from leaving the window (e.g., via Alt+Tab). This is fine for most use cases but not a comprehensive trap. The MVP skill §19 notes: "For complex cases (iframes, portals), use  
react-focus-lock." Since this is a luxury e-commerce app with potentially complex modals, this might need upgrading later.  
  
SkipLink.tsx:  
  
```tsx  
  export function SkipLink(): JSX.Element {  
    return (  
      <a  
        href="#main-content"  
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[600] focus:bg-obsidian-50 focus:text-obsidian-950 focus:px-4 focus:py-2 focus:rounded-md focus:shadow-lg"  
      >  
        Skip to main content  
      </a>  
    );  
  }  
```  
  
This looks correct per WCAG 2.4.1. ✅  
  
However, note that SkipLink is rendered inside <Navbar> in the example. The MEP and skills require it to be the first focusable element in the document, before <Navbar>. The layout.tsx should have:  
  
```tsx  
  <body>  
    <SkipLink />  
    <Navbar />  
    ...  
  </body>  
```  
  
Currently, SkipLink is inside Navbar, which means if there are other elements before Navbar (there shouldn't be), the skip link might not be first. Also, Navbar is fixed, so special attention to z-index ordering is needed. The z-600   
is appropriate.  
  
ErrorBoundary.tsx:  
  
```tsx  
  export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {  
    constructor(props: ErrorBoundaryProps) {  
      super(props);  
      this.state = { hasError: false };  
    }  
  
    static getDerivedStateFromError(): ErrorBoundaryState {  
      return { hasError: true };  
    }  
  
    componentDidCatch(error: Error, info: React.ErrorInfo): void {  
      console.error("[ErrorBoundary] Caught:", error, info);  
    }  
  
    render(): ReactNode {  
      if (this.state.hasError) {  
        return this.props.fallback ?? (  
          <div className="flex min-h-screen items-center justify-center bg-obsidian-50 p-8 text-center">  
            <h2 className="text-2xl font-display text-obsidian-900">Something went wrong.</h2>  
            <button onClick={() => this.setState({ hasError: false })} className="mt-4 rounded-lg bg-metallic-champagne px-4 py-2 text-obsidian-950">  
              Try again  
            </button>  
          </div>  
        );  
      }  
      return this.props.children;  
    }  
  }  
```  
  
Issues:  
1. The fallback prop is ReactNode and children is ReactNode. No componentDidCatch telemetry integration. The PRD mentions Datadog + Sentry for monitoring. For a production luxury e-commerce, failing silently to console.error is  
insufficient. Should pass error and info to a logging service. This is acceptable for Phase 0 but noted as a gap.  
2. The reset button has no type, so it's a submit button if placed inside a form. The component as shown is fine as a standalone, but the button itself should have type="button". Minor.  
3. No ARIA live region for error announcement. Screen readers won't be notified of the error unless focus is moved to the error message.  
  
### Sub-Phase 0.4: App Shell & Layout  
  
Navbar.tsx:  
  
```tsx  
  "use client";  
  import { useState, useEffect, useRef } from "react";  
  import { cn } from "@utils/cn";  
  import { Button } from "@ui/button";  
  import { SkipLink } from "@shared/SkipLink";  
  
  export function Navbar(): JSX.Element {  
    const [isScrolled, setIsScrolled] = useState(false);  
    const navRef = useRef<HTMLElement>(null);  
  
    useEffect(() => {  
      const handleScroll = (): void => {  
        setIsScrolled(window.scrollY > 20);  
      };  
      window.addEventListener("scroll", handleScroll, { passive: true });  
      return () => window.removeEventListener("scroll", handleScroll);  
    }, []);  
  
    return (  
      <>  
        <SkipLink />  
        <nav  
          ref={navRef}  
          className={cn(  
            "fixed top-0 left-0 right-0 z-[200] transition-all duration-300 ease-luxe",  
            isScrolled ? "bg-obsidian-50/80 backdrop-blur-md shadow-sm" : "bg-transparent"  
          )}  
        >  
          ...  
        </nav>  
      </>  
    );  
  }  
```  
  
Issues:  
1. Raw window scroll listener with useState: This triggers a re-render on every scroll event. While the setIsScrolled will only change state after passing the threshold, the event listener fires continuously. The MVP skill §19  
provides useThrottledScroll for this exact purpose. Using raw window.addEventListener('scroll') with useState causes 60fps re-renders. The MEP specifically warns against this in the "Critical Re-Evaluation" section: "No raw useState   
tied to window.scroll or resize." This is a direct violation of the skill's performance guidance.  
2. Emoji in button labels: <Button variant="ghost" size="icon" aria-label="Search">🔍</Button> — Using emoji as button content is acceptable, but for luxury e-commerce, SVG icons (Lucide React) should be used. The PRD §3.3 lists  
Lucide React as the icon set. Emojis have inconsistent rendering across systems and do not match the anti-generic mandate.  
3. max-w-7xl: In Tailwind v4, max-w-7xl should resolve from the default theme unless overridden. Since no max-w tokens are defined in @theme, it would use the default. This is fine for now, but should there be a custom max-width token 
for luxury layouts? Minor.  
4. Navigation links use <a> instead of <Link>: The Navbar uses <a href> for navigation items, which in Next.js causes full page reloads. While this is a placeholder, it's important to use next/link (or the Next.js 13+ Link component)  
for SPA navigation. In a real luxury e-commerce experience, full page reloads between Shop/Collections/Editorial would break the immersive, cinematic feel.  
  
Footer.tsx:  
- Uses standard Tailwind classes.  
- text-xs for copyright is fine.  
- Input in newsletter form is raw HTML, not using the Input primitive. Missing type in some places. Minor inconsistency.  
  
layout.tsx:  
  
```tsx  
  export default function RootLayout({ children }: { children: React.ReactNode }): JSX.Element {  
    return (  
      <html lang="en" className={`${cormorant.variable} ${dmSans.variable} ${jetbrains.variable}`}>  
        <body className="bg-obsidian-50 text-obsidian-900 antialiased">  
          <ErrorBoundary>  
            <Navbar />  
            <main id="main-content" className="min-h-screen pt-16">  
              {children}  
            </main>  
            <Footer />  
          </ErrorBoundary>  
        </body>  
      </html>  
    );  
  }  
```  
  
Issues:  
1. HTML lang="en": For a platform with i18n (PRD §9, Phase 4), this should be dynamic. Acceptable for Phase 0.  
2. pt-16 offset: Fixed padding for fixed navbar. This is mentioned in the MVP skill §6: "Sync pt value with Navbar height. Use CSS var for single source of truth." Using a magic number pt-16 (64px) instead of a CSS variable or token   
is brittle. If nav height changes, this breaks.  
3. ErrorBoundary wrapping everything: Good for resilience, but in Next.js App Router, there's a preferred error.tsx convention. An ErrorBoundary class component might not catch all errors in RSC boundaries. However, for client-side    
errors it's fine.  
  
page.tsx:  
- Placeholder hero section. Uses bg-metallic-champagne for CTA. This is fine for Phase 0.  
- Buttons are raw <button> instead of the Button primitive. Minor inconsistency but acceptable for a placeholder page.  
  
### Sub-Phase 0.5: Testing & CI/CD  
  
vitest.config.ts:  
  
```typescript  
  import { defineConfig } from "vitest/config";  
  import react from "@vitejs/plugin-react";  
  import tailwindcss from "@tailwindcss/vite";  
  import path from "path";  
```  
  
Issues:  
1. @tailwindcss/vite plugin in vitest config: Vitest is a test runner. It doesn't need Tailwind CSS processing for most tests unless testing DOM with styles. Importing tailwindcss into the vitest config might cause issues or be  
unnecessary. The CSS processing is handled by Next.js, not Vitest. This might just work or might cause warnings. Worth testing.  
2. globals: false: Correctly not using globals, per skill. ✅  
3. @shared alias: Included in resolve alias. Good. ✅  
  
setup.ts:  
  
```typescript  
  import "@testing-library/jest-dom/vitest";  
  import { vi, beforeEach, afterEach } from "vitest";  
```  
  
Issues:  
1. requestAnimationFrame polyfill:  
  ```ts  
    vi.stubGlobal("requestAnimationFrame", (cb: FrameRequestCallback) => {  
      return window.setTimeout(cb, 16) as unknown as number;  
    });  
  ```  
  The FrameRequestCallback type is used, which is a DOM type. In jsdom, this is fine if types are available. The mock returns a timeout ID, which is correct. ✅  
2. crypto.randomUUID polyfill:  
  ```ts  
    Object.defineProperty(window, "crypto", {  
      value: { randomUUID: () => "test-uuid-" + Math.random().toString(36).slice(2) },  
    });  
  ```  
  This overwrites the entire window.crypto object, which may remove other crypto methods (like getRandomValues, subtle). It's safer to:  
  ```ts  
    if (!window.crypto?.randomUUID) {  
      Object.defineProperty(window.crypto, "randomUUID", {  
        value: () => "test-uuid-" + Math.random().toString(36).slice(2),  
      });  
    }  
  ```  
  This is a minor robustness concern.  
  
.github/workflows/ci.yml:  
  
```yaml  
  - name: Lighthouse CI  
    uses: treosh/lighthouse-ci-action@v12  
```  
  
Good integration.Note: The budgetPath: ./apps/web/lighthouserc.json is referenced but no lighthouserc.json is shown in the plan. Need to ensure it exists.  
  
### Sub-Phase 0.6: Documentation  
  
Brief but adequate.  
  
────────────────────────────────────────────────────────────────────────────────  
  
Now let me review Phase 1. This is significantly more content.  
  
Phase 1 Review  
  
### Overall Structure  
  
Phase 1 is broken into 5 sub-phases:  
1. Data & API Foundation  
2. Product Discovery UI (PLP/PDP)  
3. Cart & State Management  
4. Checkout & Payments  
5. Authentication & Security  
  
This matches the MEP Phase 1 structure. ✅  
  
### Sub-Phase 1.1: Data & API Foundation  
  
prisma/schema.prisma:  
- Models: User, Address, Product, ProductVariant, ProductImage, Cart, CartItem, Order, OrderItem  
- Uses String for enums with comments (// ACTIVE | DRAFT | ARCHIVED | OUT_OF_STOCK)  
- This complies with erasableSyntaxOnly because .prisma files are not TypeScript. ✅  
  
Issues:  
1. Missing fields from PRD: The PRD §3.4 shows a much richer Product schema with sustainability scoring, carbon footprint, certifications, 3D models, AR data, etc. The Phase 1 schema is minimal. This is acceptable for an MVP commerce  
core, but a note should be made that these fields will be added in later phases.  
2. Decimal with @db.Decimal(10, 2): Good for exact monetary values. ✅  
3. Order model is incomplete: Missing shippingAddress as JSON, billingAddress, paymentMethod, etc. listed in the PRD. The skeleton is fine for Phase 1 but should acknowledge expansion.  
4. No Category model: The PRD shows a Category model, but the PLP/PDP implementation later assumes categories.  
  
src/lib/schemas.ts:  
- loginSchema, registerSchema, addressSchema, checkoutSchema — all look correct.  
- Uses result.error.issues[0].message. ✅  
- One issue: postalCode regex /^\d{3,6}$/ assumes numeric postal codes only. Many countries have alphanumeric postal codes (UK, Canada). The PRD is global. Zod's .regex here would reject valid non-US postal codes. ISSUE: International 
postal code validation.  
  
src/server/trpc.ts:  
- tRPC initialization with initTRPC. ✅  
- publicProcedure and protectedProcedure defined. ✅  
- Error formatter suppresses zod errors: zodError: ... ? null : null — This always returns null. Not an error, just an unused mapping.  
  
src/server/context.ts:  
- Creates context with prisma, user, sessionId. ✅  
- Uses crypto.randomUUID() for fallback session ID. This will fail in older Node versions or environments without crypto. Acceptable for modern Node.  
- NextRequest and cookies used correctly per Next.js App Router.  
  
Product Service (product.service.ts):  
- Implements ProductService interface with list and getBySlug. ✅  
- getBySlug uses Promise.all for parallel fetching. ✅  
- mapCart function at the bottom has cart: any — uses any! This directly violates strict: true and no any rules. The mapCart function signature should use proper types.  
  
Product Router (product.ts):  
- Validates input with Zod. ✅  
- Delegates to service layer. ✅  
  
Cart Service (cart.service.ts):  
- Service interface with getOrCreate, addItem, updateItem, removeItem. ✅  
- mapCart function has any parameter: function mapCart(cart: any): CartData. VIOLATION: Uses any.  
- mapCart function also has item: any in the map callback. VIOLATION.  
- The Prisma query result is not typed with any. The service should use properly typed Prisma results (e.g., Prisma.CartGetPayload<...>) or at least a typed interface.  
  
Cart Router (cart.ts):  
- Uses tRPC router. ✅  
- addItem uses createCartService(ctx.prisma) twice — constructs new instance in both lines. Minor performance hit, should reuse.  
- crypto.randomUUID() called directly without check — OK in Node 18+.  
  
### Sub-Phase 1.2: Product Discovery UI  
  
useProductFilters.ts:  
- URL-synced filters using useSearchParams and useRouter. ✅  
- useTransition for non-blocking UI. ✅  
- useMemo for derived filters. ✅  
- Filter updates use router.replace with scroll: false. ✅  
  
Issue: The ProductFilters interface has color, size, material, sort, page. But the updateFilter function only handles string values. If page is a number, the type signature says string | null, which would require page to be a string.  
This works for URL params (all strings), but the interface allows page: number. Type inconsistency. Minor type safety issue.  
  
ProductCard.tsx:  
- Server Component that renders ProductListItem. ✅  
- Image component used with explicit width/height. ✅  
- loading="lazy" for PLP cards. ✅  
- QuickAddButton imported and rendered inside. But QuickAddButton is NOT imported at the top of the file. It shows import { QuickAddButton } from "./QuickAddButton"; which is there. ✅  
  
QuickAddButton.tsx:  
- Uses useOptimistic with startTransition. ✅  
- setOptimisticAdded(null) is called but null is not valid if the state is typed as boolean. Wait:  
  ```ts  
    const [optimisticAdded, setOptimisticAdded] = useOptimistic(false, () => true);  
  ```  
  The setOptimisticAdded takes the type of the new state, which is boolean. Then in handleQuickAdd:  
  ```ts  
    setOptimisticAdded(null);  
  ```  
  null is passed to a function expecting boolean. TypeScript error. This should probably be an updater function form:  
  ```ts  
    setOptimisticAdded(() => true);  
  ```  
  or the state type should be boolean | null. This is a clear type error.  
  
PriceDisplay.tsx:  
- formatCurrency utility function. ✅  
- Shows compare-at price when present. ✅  
- Shows installment info. ✅  
- Clean early returns pattern. ✅  
  
VariantSelector.tsx:  
- role="radiogroup" for color/size picker. ✅  
- aria-checked, aria-disabled on buttons. ✅  
- useId() for stable group IDs. ✅  
- useTransition for non-blocking selection. ✅  
- Uses cn() for conditional classes. ✅  
  
Issue: The selectedId state management is handled via props onSelect and external control. This is normal, but the useOptimistic is only used for the optimisticId state, while selectedId (external) controls the actual display. Wait,   
looking again:  
  
```ts  
  const activeId = isPending ? optimisticId : selectedId;  
```  
  
This means during transitions, it shows optimisticId, otherwise selectedId. This is a good pattern for optimistic UI. ✅  
  
Minor: The disabled state for OOS uses opacity-40 cursor-not-allowed. In Tailwind v4, might need to verify cursor-not-allowed is available as a utility (it should be). ✅  
  
ProductGallery.tsx:  
- useClient. ✅  
- Main image + thumbnail strip. ✅  
- Click-to-zoom with scale. ✅  
- aria-label on thumbnail buttons. ✅  
- Image from next/image used. ✅  
  
Issues:  
1. "Zoom" just toggles scale-150. This is a visual effect only; does not actually zoom to the cursor position or allow panning. This is fine for a basic implementation but should be noted as "basic zoom" in the documentation.  
2. onClick={() => setIsZoomed(!isZoomed)} toggles zoom. There's no cursor-zoom-in class applied. Minor UX enhancement.  
  
StickyAddToBar.tsx:  
- Uses IntersectionObserver (not scroll listener). ✅  
- useRef for the bar. ✅  
- Shows bar when main CTA scrolls out. ✅  
- aria-label on bar. ✅  
  
Issues:  
1. targetRef={{ current: document.getElementById("pdp-cta-target") }} — This creates a fake ref with document.getElementById. This would work in the client but not be valid TypeScript because current on a RefObject should be readonly? 
Actually, in React, you shouldn't be creating refs like this. It's trying to pass a DOM element as a ref. In the PDP implementation (1.2.10), this is called:  
  ```tsx  
    <StickyAddToBar  
      ...  
      targetRef={{ current: document.getElementById("pdp-cta-target") }}  
    />  
  ```  
  This is creating a fake React ref. Anti-pattern: document.getElementById should not be called directly in React; instead, a ref callback or useRef should be used. This is brittle because it assumes the DOM element exists at render   
time.  
2. animate-slide-up class is used but not defined in globals.css. Missing animation definition.  
  
ProductGridSkeleton / PDPSkeleton:  
- aria-busy="true". ✅  
- Grid structure matches layout. ✅  
- No spinners. ✅  
  
PLP Server Component ([category]/page.tsx):  
- Suspense with ProductGridSkeleton. ✅  
- RSC fetches data directly. ✅  
- notFound() for invalid categories (placeholder logic). ✅  
- Empty state with actionable message. ✅  
  
Issues:  
1. CategoryPageProps has params: Promise<{ category: string }> — In Next.js 16, params are no longer automatically Promises. Wait, actually in Next.js 15/16, with the dynamicParams / dynamic changes, params might or might not be  
Promises depending on exact version. The code does const { category } = await params;, which suggests params is a Promise. This is correct for Next.js 15+ where params were temporarily made Promises in dev/canary, but this is an  
unstable API. In the standard Next.js 15+ App Router, params is a plain object, not a Promise. Using await params would error. Need to verify the exact Next.js 16 API here.  
  
PDP Server Component ([category]/[slug]/page.tsx):  
- Uses Suspense with PDPSkeleton. ✅  
- Fetches product data. ✅  
- Maps variants to color/size options. ✅  
- notFound() when product doesn't exist. ✅  
  
Issues:  
1. Critical bug in StickyAddToBar usage:  
  ```tsx  
    <StickyAddToBar  
      productId={product.id}  
      ...  
      targetRef={{ current: document.getElementById("pdp-cta-target") }}  
      onAddToCart={() => {}}  
      isAdding={false}  
    />  
  ```  
  document.getElementById is called during render (which is fine on client but not server). However, in an RSC context, document doesn't exist! This code is in a Server Component. document is a browser global. This would throw  
ReferenceError: document is not defined during SSR. Critical server/client mismatch.  
  Even more, the element pdp-cta-target is defined as:  
  ```tsx  
    <div id="pdp-cta-target" ref={(el) => { /* IntersectionObserver target for sticky bar */ }}>  
  ```  
  Wait, this is in the same component! But ref callback won't have executed by the time the component renders StickyAddToBar. This is a fundamental misunderstanding of React render timing. The ref callback fires after the DOM is  
created, but at this point in the render tree, the DOM doesn't exist yet.  
  Also, StickyAddToBar is a "use client" component, but its props are being computed in an RSC. The targetRef approach is problematic. A better approach: use a shared ref from a React context or lift the ref to a parent client  
component, or simply have StickyAddToBar find the target element itself using document.getElementById inside its own useEffect.  
2. ref={(el) => { /* IntersectionObserver target for sticky bar */ }}: This ref does nothing. It's an empty callback.  
3. VariantSelector for color/size references product.variants: In the schema, ProductVariant is queried in getBySlug, but service.getBySlug returns ProductDetail which includes variants array. Then it's mapped to colorOptions and  
sizeOptions. However, the VariantSelector component takes selectedId and onSelect props. In the RSC, onSelect={() => {}} is a no-op. This means the variant selector on the PDP doesn't actually do anything yet. This is acknowledged as  
a TODO but should be documented.  
4. prose prose-obsidian: Using @tailwindcss/typography or similar? This class is not defined anywhere. If the prose plugin isn't installed, this won't work.  
  
### Sub-Phase 1.3: Cart & State Management  
  
src/stores/cart.ts:  
- Zustand store with persist middleware. ✅  
- partialize: (state) => ({ items: state.items }) — persists only domain data. ✅  
- Flat structure with actions. ✅  
- Component-prefixed interface (CartState, CartItem). ✅  
  
Issues:  
1. TypeScript erasableSyntaxOnly: The file uses type-only imports like import { create } from "zustand";. This is fine because zustand exports create as a value. But there are no type imports to worry about here.  
2. clearCart action: Calls clearCartStore() which does clearCartStore() inside the hook. But clearCart is defined with useCallback that also calls setLoading. This is correct.  
3. No tRPC integration yet: The hook has // TODO: Wire to tRPC mutation comments. This is acknowledged in the plan.  
4. lastRemovedItem stored in state: Is this a UI state leak? It's persisted via partialize which only persists items, so lastRemovedItem would be lost on refresh. This means the "undo" toast wouldn't survive a refresh, which is  
acceptable UX.  
  
src/hooks/useCart.ts:  
- Multiple selector calls:  
  ```ts  
    const items = useCartStore((s) => s.items);  
    const isOpen = useCartStore((s) => s.isOpen);  
  ```  
  This creates multiple subscriptions. While each is a separate hook call and Zustand optimizes them, in a performance-critical path it might cause extra re-renders. Using a single selector or shallow from zustand could be better, but 
this is acceptable for a cart hook.  
  
5. addItem mock: Creates a mock item with hardcoded unitPrice: 100. This is clearly marked as a TODO for tRPC wiring. ✅  
  
FreeShippingProgress.tsx:  
- role="progressbar" with aria-valuenow. ✅  
- useMemo for progress calculations. ✅  
- Uses OKLCH gradient via Tailwind v4 classes: bg-gradient-to-r from-metallic-champagne to-metallic-gold. Wait — bg-gradient-to-r is deprecated in Tailwind v4! The skill documentation says: "Tailwind v3 → v4 utility rename:  
bg-gradient-to-* → bg-linear-to-*". ISSUE: Using deprecated bg-gradient-to-r instead of bg-linear-to-r.  
  
CartItem.tsx:  
- Uses useOptimistic for quantity and remove states. ✅  
- useId() for stable ARIA labels. ✅  
- startTransition for async mutations. ✅  
- aria-label on +/- buttons. ✅  
  
Issues:  
1. optimisticRemoved state:  
  ```ts  
    const [optimisticRemoved, setOptimisticRemoved] = useOptimistic(false, () => true);  
  ```  
  The updater returns true always, so optimisticRemoved becomes true immediately on setOptimisticRemoved. But then:  
  ```ts  
    if (optimisticRemoved) return <></>;  
  ```  
  This immediately removes the item from the DOM without animation. For a luxury experience, a smooth exit animation would be better, but this is acceptable for functional implementation.  
2. Quantity buttons: − and + are literal characters. On some systems, − (U+2212, minus sign) might not render correctly. Better to use aria-label and hide the character, or use actual icons. The aria-label is already there, so  
functionally accessible. ✅  
  
CartDrawer.tsx:  
- useFocusTrap with drawerRef and triggerRef. ✅  
- Escape key handler. ✅  
- role="dialog", aria-modal="true", aria-label. ✅  
- Empty state with guidance and CTA. ✅  
  
Issues:  
1. Close button inside drawer: The triggerRef is assigned to the close button. When the drawer closes, focus should return to whatever element opened it (e.g., cart icon in navbar). The useFocusTrap implementation returns focus to     
savedTrigger on close. But the triggerRef is set to the close button, not the opener. Looking at the focus trap:  
  ```ts  
    const savedTrigger = triggerRef?.current ?? (document.activeElement as HTMLElement);  
  ```  
  This captures the active element when the effect runs. If the close button gets focus, then on close it returns focus to... the close button? That seems wrong. Actually, when the drawer opens, useFocusTrap runs and  
document.activeElement is likely the cart trigger button (since that's what was clicked). So savedTrigger would be the cart trigger unless the triggerRef is explicitly set to something else. But triggerRef is passed from the drawer to 
useFocusTrap... wait, in the code:  
  ```ts  
    useFocusTrap(isOpen, drawerRef, triggerRef);  
  ```  
  And triggerRef is:  
  ```ts  
    const triggerRef = useRef<HTMLButtonElement>(null);  
    // later...  
    <button ref={triggerRef} onClick={closeCart}>...  
  ```  
  Hmm, triggerRef references the close button, not the open button. This means focus returns to the close button instead of the cart trigger. This is a bug. The focus trap's triggerRef should reference the element that opens the  
drawer (the cart icon), not the element that closes it. Or, the useFocusTrap should capture document.activeElement on open, not rely on the triggerRef.  
2. Transition classes: transition-transform duration-300 ease-luxe. The ease-luxe token is defined as a custom CSS variable but not registered as a Tailwind v4 animate or transition-timing-function token. It should work if --ease-luxe 
 is used via transition-[timing-function:var(--ease-luxe)] or if Tailwind v4 automatically picks up custom timing functions... actually, Tailwind v4 transition-* utilities use the CSS property directly. But ease-luxe might not be  
recognized as a timing function utility in Tailwind v4. Need to check if ease-luxe works. In v4, you can use ease-[var(--ease-luxe)] for an arbitrary value, but ease-luxe by itself needs --ease-luxe in @theme. Looking at the  
globals.css, ease-luxe is not declared in @theme inline. It's declared as a regular CSS custom property (--ease-luxe). For Tailwind v4 to generate an ease-luxe utility, it would need to be in @theme or in the transitionTimingFunction  
theme key. This likely won't work as a Tailwind utility class.  
  Wait, actually Tailwind v4 CSS-first approach defines theme values differently. The @theme inline block defines theme keys, but transitionTimingFunction values should be something like --ease-luxe: ... inside @theme? Let me think... 
  In Tailwind v4, utilities map to CSS custom properties. ease-luxe would look for --ease-luxe. But the transition-timing-function property requires the full cubic-bezier(...) value. The way Tailwind maps utilities is:  
  ```css  
    @theme {  
      --ease-luxe: cubic-bezier(0.25, 0.1, 0.25, 1);  
    }  
  ```  
  And then you can use ease-luxe directly. But this is for transition-timing-function. So it might work if --ease-luxe is defined in the theme. It's defined in globals.css:  
  ```css  
    --ease-luxe: cubic-bezier(0.25, 0.1, 0.25, 1);  
  ```  
  This is inside @theme inline. According to Tailwind v4 docs, yes, this should work and expose as an ease-luxe utility. ✅  
3. isOpen ? "translate-x-0" : "translate-x-full": Slide-in animation. ✅  
  
### Sub-Phase 1.4: Checkout & Payments  
  
checkout.actions.ts:  
- Server action with use server. ✅  
- Zod v4 validation with .issues[0].message. ✅  
- Stripe PaymentIntent mock. ✅  
- Order creation with Prisma. ✅  
- revalidatePath for cache invalidation. ✅  
  
Issues:  
1. crypto.randomUUID() in action: Server actions run in Node.js runtime in Next.js. crypto.randomUUID() is available in Node 14.17+. Should be fine.  
2. Hardcoded values: subtotal = 10000, tax = 800, etc. These are clearly mocks, but for a production system, the order totals should be calculated server-side from the actual cart.  
3. orderNumber: LV-${Date.now().toString().slice(-6)} — This can collide if two orders are placed in the same millisecond. Should use a more robust ID generation (CUID/UUID with human-readable prefix).  
4. Missing userId extraction: "user_mock_id" is hardcoded. The action should extract the authenticated user from the session.  
  
checkout/page.tsx (Client Component):  
- Multi-step checkout with useState for step management. ✅  
- useActionState for server action integration. ✅  
- useEffect for focus management on step change. ✅  
- Stepper with aria-current="step". ✅  
  
Issues:  
1. "use client" on page: This makes the entire checkout page a client component. For a multi-step checkout, the initial shell should ideally be an RSC, with each step as a client component or using Server Actions for progressive  
enhancement. However, for a complex interactive flow, using a client component is pragmatic.  
2. state.status check in handleSubmit: The ShippingStep does:  
  ```ts  
    const handleSubmit = (formData: FormData): void => {  
      if (state.status !== "error") onNext();  
    };  
  ```  
  But state.status lags by one render. The formAction is asynchronous, and checking state.status in the same render cycle is a race condition. The correct approach with useActionState is to check state in useEffect and trigger  
onNext() there when status is "success". The component does this partially in the parent:  
  ```ts  
    useEffect(() => {  
      if (state.status === "success" && currentStep === "review") {  
        setCurrentStep("confirmation");  
      }  
    }, [state.status, currentStep]);  
  ```  
  But the ShippingStep tries to do it inline. This is buggy.  
3. Focus ref: stepRef.current?.focus() focuses the container div. If the container is tabIndex={-1}, it can receive programmatic focus but not tab focus. This is a good pattern for stepper accessibility. ✅  
4. PaymentStep Stripe integration: Uses @stripe/react-stripe-js with PaymentElement. ✅  
Zero raw card data in client. ✅  
clientSecret loaded from parent state. ✅  
5. ReviewStep: Shows order summary with hardcoded values. The button has loading={isPending} disabled={isPending} which is correct. ✅  
6. ConfirmationStep: window.location.href for redirects. In Next.js, useRouter from next/navigation should be used. Using window.location.href causes full page reloads, breaking SPA UX. ISSUE.  
  Also, for the "Continue Shopping" button:  
  ```tsx  
    <Button variant="outline" onClick={() => window.location.href = "/"}>  
  ```  
  Same issue.  
  
### Sub-Phase 1.5: Authentication & Security  
  
lib/crypto.ts:  
- @node-rs/bcrypt for edge-compatible hashing. ✅  
- Good separation of concerns. ✅  
  
lib/auth.ts (NextAuth v5):  
- Credentials provider with Zod validation. ✅  
- JWT strategy with role callbacks. ✅  
- Edge-compatible. ✅  
  
Issues:  
1. Password in session callback: The authorize method never returns the password, which is correct. ✅  
2. trustHost: true in production: trustHost: true is only appropriate for local development. In production, this should be removed or made conditional. Security concern.  
Actually, Auth.js v5 docs say trustHost is needed when behind a proxy, but setting it unconditionally could mask security issues.  
3. Missing CSRF protection: NextAuth v5 handles this automatically, but should double-check.  
  
actions/auth.actions.ts:  
- Server actions for login/register. ✅  
- Zod validation at boundaries. ✅  
- signIn called server-side. ✅  
- Error handling with AuthError. ✅  
  
Issues:  
1. redirectTo in signIn: In Next.js App Router + NextAuth v5, redirectTo works differently. Calling redirect or return from a server action after signIn might need careful handling to avoid "cannot redirect after response" errors.     
  
middleware.ts:  
- Rate limiting with in-memory map. ✅  
- Auth protection for protected routes. ✅  
- Security headers (CSP, HSTS, X-Frame-Options, etc.). ✅  
  
Issues:  
1. In-memory rate limiter: const rateLimitMap = new Map<string, { count: number; resetAt: number }>(); — This won't work across serverless invocations. In a serverless environment (Vercel/Next.js), each request may run in a different  
Lambda instance. The map will be reset on every cold start. For production, this needs Redis/Upstash KV.  
2. CSP header: Contains script-src 'self' 'unsafe-inline' 'unsafe-eval'. 'unsafe-eval' is dangerous and should only be allowed if absolutely necessary (e.g., for some bundling tools). Next.js itself doesn't need 'unsafe-eval' in  
production. 'unsafe-inline' for scripts is also against best practices. For Stripe, only https://js.stripe.com and https://api.stripe.com should be in script/connect-src. 'unsafe-inline' should be avoided in production CSP. Security   
concern.  
3. X-Content-Type-Options and X-Frame-Options: ✅ Correct.  
4. Referrer-Policy: strict-origin-when-cross-origin ✅  
5. Permissions-Policy: camera=(), microphone=(), geolocation=() ✅ Good defaults.  
  
stores/auth.ts:  
- Ephemeral only (no persist middleware). ✅  
- Selector discipline. ✅  
  
AuthForm.tsx:  
- useActionState with useId. ✅  
- autoComplete attributes. ✅  
- Loading state with disabled button. ✅  
  
Issues:  
1. Password field lacks show/hide toggle. Not critical but common in luxury UIs.  
2. a href instead of Next.js Link: The form uses <a href="/register"> instead of <Link href="/register">. This causes full page reloads. UX issue.  
The same issue exists in login/page.tsx and register/page.tsx.  
  
ProtectedRoute.tsx:  
- Role-based access control. ✅  
- Redirect on auth failure. ✅  
  
Issues:  
1. PDPSkeleton as loading state: Using PDPSkeleton for auth loading state is unexpected. A generic skeleton or spinner would be better, but not critical.  
2. Client-side redirect flash: The redirect happens after isLoading resolves, which can cause a flash of content before redirect. Using middleware (which is already done) is better for this.  
3. useEffect with router replace: If isLoading is false and user is not authenticated, it redirects. This should ideally read from a server session or use server-side redirect.  
  
────────────────────────────────────────────────────────────────────────────────  
  
Cross-Cutting Analysis  
  
### Tailwind v4 Compliance  
  
1. Deprecated utilities:  
    - bg-gradient-to-r in FreeShippingProgress.tsx should be bg-linear-to-r (v3 → v4 migration). ISSUE.  
    - focus-visible:outline-hidden is correct per v4. ✅  
2. ease-luxe token: Defined in @theme inline, used in multiple classes. Should work. ✅  
3. Arbitrary values: I couldn't find any w-[37px] or similar arbitrary values. ✅  
4. Double-hyphen negatives: No bottom--24 found. ✅  
  
### TypeScript Strict  
  
1. any usage:  
    - function mapCart(cart: any): CartData in cart.service.ts — VIOLATION  
    - const mapCart = (cart: any) in product.service.ts — VIOLATION  
    - item: any in map callbacks — VIOLATION  
  These are critical because they break the strict + no any rules explicitly mandated in CI gates.  
2. enum / namespace: None found in .ts files. ✅  
3. Component-prefixed interfaces: All interfaces are prefixed (e.g., ButtonProps, CartState). ✅  
  
### React 19 Compliance  
  
1. useActionState: Used in checkout, auth forms. ✅  
2. useOptimistic: Used in QuickAddButton, CartItem, VariantSelector. ✅  
3. startTransition: Used alongside optimistic setters. ✅  
4. useId: Used for ARIA labels. ✅  
  
### Accessibility (WCAG)  
  
1. Skip Link: Present. ✅  
2. Focus Trap: Present but has return-to-trigger issue in CartDrawer. ⚠  
3. Reduced motion: Present in globals.css. ✅  
4. aria-busy: On skeletons. ✅  
5. aria-label/aria-labelledby: Present on most interactive elements. ✅  
6. Semantic HTML: Generally good use of <nav>, <main>, <article>, <h1>. ✅  
7. Error states: role="alert" on errors. ✅  
  
### Performance  
  
1. Raw scroll listener in Navbar: Violates skill guidance. Should use useThrottledScroll. ISSUE.  
2. next/image: Explicit dimensions used. ✅  
3. Dynamic imports: Not yet used (no 3D/AI yet). N/A for Phase 1.  
4. Skeleton loading: Used with Suspense. ✅  
5. Parallel fetching: Promise.all used in services. ✅  
  
### Security  
  
1. PCI compliance: Stripe Elements used correctly. ✅  
2. CSP: 'unsafe-eval' and 'unsafe-inline' are present but should be hardened for production. ⚠  
3. Rate limiting: In-memory only, won't work in serverless. ⚠  
4. Password hashing: @node-rs/bcrypt used. ✅  
5. Auth store: No localStorage persistence. ✅  
  
### Anti-Generic  
  
1. Typography: Cormorant Garamond + DM Sans. Excellent pairing. ✅  
2. Colors: OKLCH luxury palette. ✅  
3. Spacing: Golden ratio. ✅  
4. Easing curves: Luxury-specific. ✅  
5. Micro-copy: "Atelier", "complimentary shipping", "prepared with care". ✅  
6. No bento grids or purple gradients: ✅  
7. Glassmorphism in auth forms: Subtle backdrop blur. ✅  
  
────────────────────────────────────────────────────────────────────────────────  
  
Summary of Issues  
  
Let me compile the critical issues:  
  
### Critical (🔴 Blockers)  
  
┌───┬──────────────────────────────────────────┬──────────────────────────────────────────┬──────────────────────────────────────────────────────────────────────────┐  
│ # │ Issue                                    │ Location                                 │ Consequence                                                              │  
├───┼──────────────────────────────────────────┼──────────────────────────────────────────┼──────────────────────────────────────────────────────────────────────────┤  
│ 1 │ any types in service layer               │ product.service.ts, cart.service.ts      │ Breaks tsc --noEmit in CI. Direct violation of no any rule.              │  
├───┼──────────────────────────────────────────┼──────────────────────────────────────────┼──────────────────────────────────────────────────────────────────────────┤  
│ 2 │ Raw window scroll listener with useState │ Navbar.tsx                               │ 60fps re-renders. Direct violation of useThrottledScroll skill guidance. │  
├───┼──────────────────────────────────────────┼──────────────────────────────────────────┼──────────────────────────────────────────────────────────────────────────┤  
│ 3 │ document referenced in RSC               │ PDP [slug]/page.tsx using StickyAddToBar │ ReferenceError: document is not defined during SSR.                      │  
└───┴──────────────────────────────────────────┴──────────────────────────────────────────┴──────────────────────────────────────────────────────────────────────────┘  
  
### High (🟠 Significant)  
  
┌────┬──────────────────────────────────────────────┬──────────────────────────────────┬───────────────────────────────────────────────────┐  
│ #  │ Issue                                        │ Location                         │ Consequence                                       │  
├────┼──────────────────────────────────────────────┼──────────────────────────────────┼───────────────────────────────────────────────────┤  
│ 4  │ bg-gradient-to-r (deprecated v3 utility)     │ FreeShippingProgress.tsx         │ Will fail in Tailwind v4 or produce no output.    │  
├────┼──────────────────────────────────────────────┼──────────────────────────────────┼───────────────────────────────────────────────────┤  
│ 5  │ CSP includes unsafe-eval and unsafe-inline   │ middleware.ts                    │ Security risk in production.                      │  
├────┼──────────────────────────────────────────────┼──────────────────────────────────┼───────────────────────────────────────────────────┤  
│ 6  │ window.location.href for Next.js navigation  │ ConfirmationStep.tsx, auth forms │ Full page reloads, breaks SPA feel.               │  
├────┼──────────────────────────────────────────────┼──────────────────────────────────┼───────────────────────────────────────────────────┤  
│ 7  │ <a> instead of <Link>                        │ Auth forms, navbar               │ Full page reloads, breaks SPA feel.               │  
├────┼──────────────────────────────────────────────┼──────────────────────────────────┼───────────────────────────────────────────────────┤  
│ 8  │ In-memory rate limiter won't work serverless │ midddleware.ts                   │ Rate limiting doesn't persist across invocations. │  
├────┼──────────────────────────────────────────────┼──────────────────────────────────┼───────────────────────────────────────────────────┤  
│ 9  │ QuickAddButton passes null to boolean state  │ QuickAddButton.tsx               │ TypeScript error.                                 │  
├────┼──────────────────────────────────────────────┼──────────────────────────────────┼───────────────────────────────────────────────────┤  
│ 10 │ trustHost: true unconditionally              │ lib/auth.ts                      │ Security concern in production.                   │  
└────┴──────────────────────────────────────────────┴──────────────────────────────────┴───────────────────────────────────────────────────┘  
  
### Medium (🟡 Moderate)  
  
┌────┬────────────────────────────────────────────────────────────┬──────────────────────┬──────────────────────────────────────────────────────┐  
│ #  │ Issue                                                      │ Location             │ Consequence                                          │  
├────┼────────────────────────────────────────────────────────────┼──────────────────────┼──────────────────────────────────────────────────────┤  
│ 11 │ Emoji instead of Lucide icons                              │ Navbar.tsx           │ Inconsistent with icon library, unprofessional look. │  
├────┼────────────────────────────────────────────────────────────┼──────────────────────┼──────────────────────────────────────────────────────┤  
│ 12 │ targetRef assigned to close button instead of open trigger │ CartDrawer.tsx       │ Focus returns to wrong element on close.             │  
├────┼────────────────────────────────────────────────────────────┼──────────────────────┼──────────────────────────────────────────────────────┤  
│ 13 │ className with prose prose-obsidian                        │ PDP page.tsx         │ Unknown if @tailwindcss/typography is installed.     │  
├────┼────────────────────────────────────────────────────────────┼──────────────────────┼──────────────────────────────────────────────────────┤  
│ 14 │ params as Promise                                          │ PLP/PDP page props   │ May be incorrect for stable Next.js 16 API.          │  
├────┼────────────────────────────────────────────────────────────┼──────────────────────┼──────────────────────────────────────────────────────┤  
│ 15 │ ShippingStep inline status check race condition            │ checkout/page.tsx    │ Step progression may be unreliable.                  │  
├────┼────────────────────────────────────────────────────────────┼──────────────────────┼──────────────────────────────────────────────────────┤  
│ 16 │ Missing max-w luxury token                                 │ page.tsx, layout.tsx │ Hardcoded max-w-7xl assumes default theme.           │  
├────┼────────────────────────────────────────────────────────────┼──────────────────────┼──────────────────────────────────────────────────────┤  
│ 17 │ Newsletter input not using Input primitive                 │ Footer.tsx           │ Inconsistency in form components.                    │  
├────┼────────────────────────────────────────────────────────────┼──────────────────────┼──────────────────────────────────────────────────────┤  
│ 18 │ Button missing default type="button"                       │ Button.tsx           │ Risk of accidental form submission.                  │  
├────┼────────────────────────────────────────────────────────────┼──────────────────────┼──────────────────────────────────────────────────────┤  
│ 19 │ crypto.randomUUID polyfill overwrites entire window.crypto │ setup.ts             │ May remove other crypto methods in tests.            │  
├────┼────────────────────────────────────────────────────────────┼──────────────────────┼──────────────────────────────────────────────────────┤  
│ 20 │ ErrorBoundary uses console.error only, no Sentry           │ ErrorBoundary.tsx    │ Missing error monitoring.                            │  
└────┴────────────────────────────────────────────────────────────┴──────────────────────┴──────────────────────────────────────────────────────┘  
  
────────────────────────────────────────────────────────────────────────────────  
  
Now I have a comprehensive analysis. Let me write this up concisely but with sufficient detail.  

Here is the meticulous review of phase-0.md and phase-1.md against the PRD, MEP, and all three skills.  
  
────────────────────────────────────────────────────────────────────────────────  
  
Phase 0 & Phase 1 Review — Validation Report  
  
Executive Summary  
  
Phase 0 delivers a strong foundation — a well-structured Turborepo, an anti-generic OKLCH design system, correctly configured Tailwind v4 CSS-first theming, and robust accessibility primitives. It sets a high standard for the luxury   
aesthetic.  
  
Phase 1 builds correctly on that foundation with tRPC services, Zustand cart state, PCI-compliant Stripe integration, and NextAuth v5. However, it contains three critical issues that would block CI or break at runtime, plus several    
high-severity findings around Tailwind v4 migration, Next.js navigation, and production security.  
  
────────────────────────────────────────────────────────────────────────────────  
  
Phase 0 — Detailed Review  
  
### What Was Done Exceptionally Well  
  
┌──────────────────────────┬───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐  
│ Area                     │ Assessment                                                                                                                                                            │  
├──────────────────────────┼───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤  
│ Monorepo Structure       │ turbo.json, pnpm-workspace.yaml, and shared tsconfig packages are correctly structured for deterministic builds.                                                      │  
├──────────────────────────┼───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤  
│ Tailwind v4 CSS-First    │ @theme inline with OKLCH tokens, fluid clamp() typography, golden-ratio spacing (--space-3xs through --space-2xl), and luxury easing curves. Zero tailwind.config.js. │  
├──────────────────────────┼───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤  
│ Design System Tokens     │ Obsidian base, metallic/champagne accents, neon cyan for focus. Cormorant Garamond + DM Sans pairing is editorial and anti-generic.                                   │  
├──────────────────────────┼───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤  
│ Accessibility Primitives │ SkipLink (WCAG 2.4.1), manual useFocusTrap (zero dependencies), prefers-reduced-motion media query, focus-visible rings.                                              │  
├──────────────────────────┼───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤  
│ Path Alias Hygiene       │ @/, @ui/, @utils/, @shared/ aliases defined.                                                                                                                          │  
└──────────────────────────┴───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┘  
  
### Phase 0 Issues Found  
  
┌───────────┬────────────────────────────────┬───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┬───────────────────┐ 
│ Severity  │ Issue                          │ Details                                                                                                                                                               │ Location          │ 
├───────────┼────────────────────────────────┼───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┼───────────────────┤ 
│ 🔴 High   │ Raw window scroll listener +   │ The Navbar uses window.addEventListener('scroll', () => setIsScrolled(...)). This triggers re-renders at 60fps. The react19-ts6-vite8-tailwindv4-mvp skill §19        │ Navbar.tsx        │ 
│           │ useState                       │ provides useThrottledScroll specifically to prevent this. MEP "Critical Re-Evaluation" explicitly bans raw useState tied to scroll.                                   │                   │ 
├───────────┼────────────────────────────────┼───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┼───────────────────┤ 
│ 🟡 Medium │ Emoji in place of SVG icons    │ 🔍 and 🛍 are used in nav buttons. PRD §3.3 specifies Lucide React as the icon library. Emojis render inconsistently across OSs and break the luxury visual standard. │ Navbar.tsx        │ 
├───────────┼────────────────────────────────┼───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┼───────────────────┤ 
│ 🟡 Medium │ pt-16 magic number for navbar  │ Uses pt-16 (64px) to offset the fixed navbar. The MVP skill §6 recommends using a CSS variable for this. If nav height changes (responsive, different sizes), layout  │ layout.tsx        │ 
│           │ offset                         │ breaks.                                                                                                                                                               │                   │ 
├───────────┼────────────────────────────────┼───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┼───────────────────┤ 
│ 🟡 Medium │ SkipLink rendered inside       │ While z-index is handled, the skip link should be the very first focusable element in <body>, before Navbar, not inside it.                                           │ layout.tsx        │ 
│           │ <Navbar>                       │                                                                                                                                                                       │                   │ 
├───────────┼────────────────────────────────┼───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┼───────────────────┤ 
│ 🟢 Low    │ vitest.config.ts imports       │ Vitest does not need Tailwind compilation. Unnecessary and may cause warnings.                                                                                        │ vitest.config.ts  │ 
│           │ @tailwindcss/vite              │                                                                                                                                                                       │                   │ 
├───────────┼────────────────────────────────┼───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┼───────────────────┤ 
│ 🟢 Low    │ Button defaults to             │ ButtonHTMLAttributes default type is submit. Component should default to type="button" to prevent accidental form submissions when used outside forms.                │ Button.tsx        │ 
│           │ type="submit"                  │                                                                                                                                                                       │                   │ 
├───────────┼────────────────────────────────┼───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┼───────────────────┤ 
│ 🟢 Low    │ ErrorBoundary only logs to     │ PRD §3.3 lists Datadog + Sentry. The boundary should accept an onError prop or integrate with a telemetry service.                                                    │ ErrorBoundary.tsx │ 
│           │ console.error                  │                                                                                                                                                                       │                   │ 
└───────────┴────────────────────────────────┴───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┴───────────────────┘ 
  
────────────────────────────────────────────────────────────────────────────────  
  
Phase 1 — Detailed Review  
  
### 1.1 Data & API Foundation  
  
What was done well:  
- ProductService and CartService typed interfaces with factory pattern (createProductService(db)). ✅  
- Promise.all parallel fetching in getBySlug. ✅  
- tRPC routers with Zod input validation. ✅  
- NextAuth v5 context extraction in createContext. ✅  
  
Critical Issues:  
  
┌─────────────┬───────────────────────────────────────────────────────┬──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐ 
│ Severity    │ Issue                                                 │ Details                                                                                                                                                          │ 
├─────────────┼───────────────────────────────────────────────────────┼──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤ 
│ 🔴 Critical │ Service mapCart uses any                              │ function mapCart(cart: any) and item: any in cart.service.ts. Also cart: any in product.service.ts. These will fail tsc --noEmit under strict mode. Must be      │ 
│             │                                                       │ replaced with Prisma.CartGetPayload or custom typed interfaces.                                                                                                  │ 
├─────────────┼───────────────────────────────────────────────────────┼──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤ 
│ 🟡 Medium   │ Postal code regex ^\d{3,6}$ rejects international     │ UK (SW1A 1AA), Canada (K1A 0B1), and other countries use alphanumeric postal codes. The PRD §9 targets global i18n. Should use a looser validation or            │ 
│             │ formats                                               │ country-specific rules.                                                                                                                                          │ 
├─────────────┼───────────────────────────────────────────────────────┼──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤ 
│ 🟢 Low      │ createCartService(ctx.prisma) instantiated twice per  │ In cart.ts router, addItem creates two service instances. Minor perf hit.                                                                                        │ 
│             │ router call                                           │                                                                                                                                                                  │ 
├─────────────┼───────────────────────────────────────────────────────┼──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤ 
│ 🟢 Low      │ Order number LV-${Date.now().slice(-6)} can collide   │ Millisecond collisions possible under load. Should use CUID/UUID with readable prefix.                                                                           │ 
└─────────────┴───────────────────────────────────────────────────────┴──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┘ 
  
### 1.2 Product Discovery UI (PLP/PDP)  
  
What was done well:  
- RSC-first with client islands ("use client") isolated to interactivity (gallery, variant selector, quick add). ✅  
- URL-synced filters via useSearchParams + useTransition. ✅  
- next/image with explicit width/height for CLS prevention. ✅  
- aria-busy skeleton grids matching actual layout. ✅  
- useOptimistic + startTransition in QuickAddButton and VariantSelector. ✅  
  
Critical Issues:  
  
┌────────────┬──────────────────────────────────────┬────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐ 
│ Severity   │ Issue                                │ Details                                                                                                                                                                            │ 
├────────────┼──────────────────────────────────────┼────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤ 
│ 🔴         │ document.getElementById called in    │ In PDP [slug]/page.tsx, StickyAddToBar is passed targetRef={{ current: document.getElementById("pdp-cta-target") }}. In a Server Component, document does not exist. Throws        │ 
│ Critical   │ RSC context                          │ ReferenceError: document is not defined during SSR/ISR.                                                                                                                            │ 
├────────────┼──────────────────────────────────────┼────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤ 
│ 🔴         │ ref callback timing with targetRef   │ The targetRef passed to StickyAddToBar uses ref={(el) => { /* ... */ }} on the target div. This empty ref never assigns to anything, and even if it did, refs execute after DOM    │ 
│ Critical   │                                      │ creation while the component renders StickyAddToBar before the DOM exists. This entire approach needs to be a Client Component that manages its own useRef + useEffect.            │ 
├────────────┼──────────────────────────────────────┼────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤ 
│ 🟡 High    │ QuickAddButton passes null to        │ setOptimisticAdded(null) where useOptimistic<boolean, ...>(false, ...) expects a boolean. TypeScript error. Should be setOptimisticAdded(() => true) or update the type.           │ 
│            │ boolean state                        │                                                                                                                                                                                    │ 
├────────────┼──────────────────────────────────────┼────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤ 
│ 🟡 High    │ params treated as a Promise          │ const { category } = await params; assumes Next.js params are Promises. In Next.js 15+ stable, params is a plain object, not a Promise. The await is unnecessary and may cause     │ 
│            │                                      │ runtime errors. Verify against the exact Next.js 16 API or remove the await.                                                                                                       │ 
├────────────┼──────────────────────────────────────┼────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤ 
│ 🟡 High    │ <a> used instead of <Link> for       │ Navbar, auth forms, and footer use <a href> which causes full page reloads in Next.js. Breaks SPA luxury experience. Must use next/link Link.                                      │ 
│            │ internal navigation                  │                                                                                                                                                                                    │ 
├────────────┼──────────────────────────────────────┼────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤ 
│ 🟡 High    │ prose prose-obsidian class is        │ The prose class requires the @tailwindcss/typography plugin. There is no evidence this plugin is installed in Phase 0. If not installed, utility is silently ignored.              │ 
│            │ undefined                            │                                                                                                                                                                                    │ 
└────────────┴──────────────────────────────────────┴────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┘ 
  
### 1.3 Cart & State Management  
  
What was done well:  
- Zustand partialize: (state) => ({ items: state.items }) correctly persists only domain data. ✅  
- Selector discipline: useCartStore((s) => s.items). ✅  
- useOptimistic for quantity and remove interactions in CartItem. ✅  
- FreeShippingProgress with role="progressbar" and aria-valuenow. ✅  
  
Issues:  
  
┌───────────┬──────────────────────────────────────────┬─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐ 
│ Severity  │ Issue                                    │ Details                                                                                                                                                                         │ 
├───────────┼──────────────────────────────────────────┼─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤ 
│ 🟡 High   │ Deprecated bg-gradient-to-r              │ FreeShippingProgress.tsx uses bg-gradient-to-r which is Tailwind v3 syntax. Tailwind v4 renamed this to bg-linear-to-r (per skill §16 Gotchas). Will fail silently or not       │ 
│           │                                          │ render correctly.                                                                                                                                                               │ 
├───────────┼──────────────────────────────────────────┼─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤ 
│ 🟡 Medium │ Focus trap triggerRef points to close    │ useFocusTrap(isOpen, drawerRef, triggerRef) where triggerRef is the close button (✕). The focus trap's savedTrigger should capture the element that opened the drawer (cart     │ 
│           │ button, not opener                       │ icon), so focus returns there on close. Currently returns focus to the close button, which no longer exists.                                                                    │ 
├───────────┼──────────────────────────────────────────┼─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤ 
│ 🟢 Low    │ animate-slide-up is undefined            │ Referenced in StickyAddToBar.tsx but no @keyframes slide-up is defined in globals.css.                                                                                          │ 
└───────────┴──────────────────────────────────────────┴─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┘ 
  
### 1.4 Checkout & Payments  
  
What was done well:  
- useActionState for all form mutations with Zod v4 validation using .issues[0].message. ✅  
- Stripe PaymentElement for PCI SAQ-A compliance (zero raw card data). ✅  
- Focus management with stepRef.current?.focus() on step transitions. ✅  
- aria-current="step" on stepper. ✅  
  
Issues:  
  
┌───────────┬─────────────────────────────────────────────┬──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐ 
│ Severity  │ Issue                                       │ Details                                                                                                                                                                      │ 
├───────────┼─────────────────────────────────────────────┼──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤ 
│ 🟡 High   │ window.location.href for navigation         │ ConfirmationStep and auth forms use window.location.href = "/..." instead of useRouter().push("/"). Triggers full page reloads. In a Next.js App Router app, this is         │ 
│           │                                             │ anti-pattern.                                                                                                                                                                │ 
├───────────┼─────────────────────────────────────────────┼──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤ 
│ 🟡 Medium │ ShippingStep race condition with            │ Checks if (state.status !== "error") onNext() synchronously after form action. useActionState updates state asynchronously. The check may read stale state. Should use       │ 
│           │ state.status                                │ useEffect to watch actionState and call onNext() when it transitions to success.                                                                                             │ 
├───────────┼─────────────────────────────────────────────┼──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤ 
│ 🟡 Medium │ Checkout page is "use client"               │ The entire checkout flow is a client component. For a multi-step form, this is acceptable pragmatically, but results in a larger client bundle. Server Actions should still  │ 
│           │                                             │ be used for mutations.                                                                                                                                                       │ 
├───────────┼─────────────────────────────────────────────┼──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤ 
│ 🟡 Medium │ Missing orderItems relation handling in     │ The mock order creation passes hardcoded items: { create: [...] } with a mock product. In production, this must pull from the actual cart.                                   │ 
│           │ checkout action                             │                                                                                                                                                                              │ 
└───────────┴─────────────────────────────────────────────┴──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┘ 
  
### 1.5 Authentication & Security 

