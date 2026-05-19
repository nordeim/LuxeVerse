Now let me continue reading the rest of `phase-
→ Read phase-2.md [offset=1051]
Now let me read the remaining parts of `phase-
→ Read phase-2.md [offset=2161]
Now let me update the todo list and perform a full review and validation of phase-2.md against the three controlling documents.
Summary of Analysis
I have read phase-2.md in its entirety (2426 lines), along with the key controlling documents. Let me now perform a rigorous cross-audit.
🔍 Phase 2 Validation — Critical Findings & Alignment Report
1. ✅ Overall Alignment
Area	Phase-2.md Claim	MEP / PRD / SKILL Validation	Status
Phase 2 Scope	Cinematic Experience & Advanced Discovery (Homepage, Search, Editorial, Motion/3D, Wishlist)	MEP §Phase 2: "Visually stunning homepage, advanced search, editorial system, 3D/AR viewers"	✅ Aligned
Sub-Phases	2.1 Homepage, 2.2 Search, 2.3 Editorial, 2.4 Motion/3D, 2.5 Wishlist	MEP lists 2.1–2.9 as file matrix only, no sub-phase breakdown	✅ Enhanced granularity
Duration	~6 weeks (implied by sub-phase count)	MEP: "6 weeks"	✅ Aligned
Deliverables	31 files across 5 sub-phases	MEP: 2.1–2.10 key files	✅ Superset (expanded)
2. 🚨 Critical Issues Requiring Correction BEFORE Implementation
Issue 1: Next.js 16 params API — ASYNC vs PLAIN OBJECT
Problem: phase-2.md uses params: Promise<{ slug: string }> and await params — This is INCORRECT for Next.js 16.
In Next.js 16 with App Router, params is a plain object, NOT a Promise. The await params syntax was briefly considered for a future version but is NOT implemented.
Evidence from SKILL.md §2.1 Next.js App Router:
❌ async function Page({ params }) { const p = await params }  → ✅ const { slug } = params
Files Affected:
- src/app/editorial/[slug]/page.tsx (lines 1312–1314): const { slug } = await params; ❌
- src/app/shop/[category]/[slug]/page.tsx (referenced in 2.4.10 dynamic import example): const { slug } = params; ✅ Correct
Action Required: Change const { slug } = await params; to const { slug } = params; in all page components.
Issue 2: JSX.Element Return Type — BANNED in React 19
Problem: phase-2.md extensively uses JSX.Element as explicit return type — This will fail in React 19.
React 19 removed the global JSX namespace. The correct pattern is inferred return types OR ReactElement (imported).
Evidence from SKILL.md §Phase 0/1 Lessons Learned:
React 19: `Cannot find namespace 'JSX'`
Fix 1: Import types for ReactElement: `import type { ReactElement } from "react"`.
Fix 2: Prefer inferred return types over explicit `JSX.Element` / `React.ReactElement` for simple components.
Files Affected (ALL sub-phases):
- src/app/page.tsx (line 139): export default function HomePage(): JSX.Element { ❌
- src/components/sections/HeroSection.tsx (line 190): export function HeroSection(): JSX.Element { ❌
- src/components/search/SearchOverlay.tsx (line 685): export function SearchOverlay(...): JSX.Element { ❌
- src/app/editorial/[slug]/page.tsx (line 1312): Promise<JSX.Element> ❌
- src/components/editorial/ArticleCard.tsx (line 1239): ...ArticleCardProps): JSX.Element { ❌
- src/stores/wishlist.ts (line 2227): Doesn't affect (Zustand types are internal)
Action Required: Remove explicit JSX.Element return types entirely (TypeScript infers them) OR import ReactElement from 'react' and use that.
Issue 3: SEARCH PAGE — params vs searchParams TypeScript Typing
Problem: src/app/search/page.tsx defines SearchPageProps with searchParams: Promise<{ [key: string]: string | string[] | undefined }> — Next.js 16 searchParams is NOT a Promise.
In Next.js 16 App Router, searchParams is a read-only plain object at render time. The async behavior is handled by the framework, not by the component.
Correct pattern (per SKILL.md):
// ❌ WRONG (Next.js 16)
interface SearchPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}
// ✅ CORRECT (Next.js 16)
interface SearchPageProps {
  searchParams: { [key: string]: string | string[] | undefined };
}
Also, in search/page.tsx (line 1093):
// ❌ WRONG
export default async function SearchPage({ searchParams }: SearchPageProps): Promise<JSX.Element> {
  const resolvedParams = await searchParams; // ❌ NO await!
  
// ✅ CORRECT
export default function SearchPage({ searchParams }: SearchPageProps) {
  // Use searchParams directly — it's already resolved
Action Required: Remove await, simplify to plain destructuring.
Issue 4: window.location.href for Internal Navigation
Problem: src/components/search/SearchInput.tsx (line 808–810) uses window.location.href for internal navigation:
window.location.href = `/search?${params.toString()}`;
Evidence from SKILL.md §Critical Gotchas:
❌ window.location.href  → ✅ router.push("/path") (from next/navigation)
This causes a full page reload, breaking SPA state and losing scroll position.
Action Required: This is a Client Island ("use client"), so use const router = useRouter(); router.push("/search...").
Issue 5: <a href="/..."> for Internal Navigation
Problem: Multiple files use raw <a href="/shop"> instead of next/link's <Link>:
- src/components/sections/FeaturedCollections.tsx (line 310): <a href={/collections/${col.slug}}... ❌
- src/components/sections/EditorialHighlight.tsx (line 434): <a href="/editorial/architecture-of-silence"... ❌
- src/components/sections/CategoryShowcase.tsx (line 580): <a href={/shop/${cat.slug}}... ❌
- src/app/account/page.tsx (line 1489): <a href="/style-quiz"... ❌ (within skeleton, but still)
Evidence from SKILL.md §Critical Gotchas:
❌ <a href="/shop">  →  ✅ <Link href="/shop"> (from next/link)
Action Required: Replace all internal <a href> with next/link's <Link> component. External links (to social, external editorial) can remain as <a> with target="_blank" and rel="noopener noreferrer".
Issue 6: <button> Without type="button"
Problem: Several buttons use atypical HTML structure:
- src/components/search/SearchInput.tsx (line 850): Enter key search triggers form submission without a type="button" attribute.
Action Required: Ensure all buttons have clear type values.
Issue 7: useOptimistic Misuse in WishlistButton.tsx
Problem: src/components/shared/WishlistButton.tsx (line 2347):
const [optimisticFavorited, setOptimisticFavorited] = useOptimistic(isInWishlist, () => !isInWishlist);
useOptimistic signature is:
const [optimisticState, addOptimistic] = useOptimistic(state, (currentState, optimisticValue) => newState);
The reducer function receives (currentState, optimisticValue), NOT () => boolean. The correct use would be:
const [optimisticFavorited, addOptimistic] = useOptimistic(isInWishlist, (current, value) => value);
// Then: addOptimistic(true); or addOptimistic(false);
However, for a simple toggle, useState is simpler and less error-prone (as learned in Phase 1:
- QuickAddButton.tsx replaced useOptimistic with useState because React 19's API strictness)
Action Required: Replace useOptimistic with simple useState in WishlistButton.tsx (consistent with Phase 1 remediation).
Issue 8: Emojis in UI — Accessibility & Anti-Generic Violation
Problem: Emojis are present in:
- src/components/search/VisualSearchButton.tsx (line 889): 📷
- src/components/search/VisualSearchButton.tsx (line 909): 🖼️
- src/components/shared/BeforeAfterSlider.tsx (line 1218): ↔
Evidence from SKILL.md §Design System:
Lucide icons only. No emojis. No inline SVGs without aria-hidden.
And from AGENTS.md §The 10 Mistake Magnets:
❌ 🛍️ ✕ 🎉 in JSX → ✅ Lucide icons only
Action Required: Replace ALL emojis with Lucide icons (lucide-react package; imported icons).
Issue 9: play symbol in VideoPlayer.tsx
Problem: src/components/product/VideoPlayer.tsx (line 1255): Uses ▶ Unicode play symbol inline.
While technically not an emoji, this is a raw Unicode character without a text alternative. Better to use a Lucide Play icon.
Action Required: Replace ▶ with <Play className="h-5 w-5" /> from lucide-react.
Issue 10: SearchInput.tsx — Mixed form and Manual Search
Problem: The SearchInput component has a <form onSubmit={handleSubmit}> but also handles debounced search via tRPC. The handleSubmit does:
const handleSubmit = (e: React.FormEvent): void => {
  e.preventDefault();
  if (value.trim()) {
    const params = new URLSearchParams(window.location.search);
    params.set("q", value.trim());
    window.location.href = `/search?${params.toString()}`; // ❌ Full reload
  }
};
This could be confusing with the suggestion dropdown showing, and the form submission should probably trigger the same debounced search or use router.push.
Action Required: Decouple manual search input from tRPC debounced search. Use single source of truth.
Issue 11: ProductEmbed.tsx — useOptimistic with null
Problem: src/components/editorial/ProductEmbed.tsx (line 1410):
const [optimisticAdded, setOptimisticAdded] = useOptimistic(false, () => true);
1. 
Reducer signature is wrong (as in Issue #7)
2. 
setOptimisticAdded(null) on line 1414 passes null to a boolean reducer — type mismatch
Action Required: Replace useOptimistic with useState for simple boolean states.
Issue 12: VideoPlayer.tsx — SVG Play Button Not Accessible
Problem: The inline ▶ in VideoPlayer.tsx (line 1255) lacks semantic meaning.
Action Required: Use a <Play /> icon from lucide-react with proper aria-label on the parent button.
Issue 13: SearchOverlay.tsx — useFocusTrap Not Implemented Yet
Problem: SearchOverlay.tsx (line 690) calls useFocusTrap(isOpen, overlayRef, triggerRef) but there's no useFocusTrap hook file defined in the hooks/ directory.
Action Required: Create src/hooks/useFocusTrap.ts before implementing SearchOverlay.tsx.
Issue 14: NewsletterSection.tsx — type="submit" Missing on Button
Problem: In NewsletterSection.tsx (line 526), the button is inside a <form action={formAction}>. The button should have type="submit" to be explicit, though in this case it would default to submit. More critically, the form doesn't have explicit method or action attributes beyond the server action.
The button already has type="submit" implicitly since it's inside a form without type="button". However, the skill mandates being explicit.
Actually, checking again (line 526), the code is:
<Button type="submit" variant="luxury" disabled={isPending} loading={isPending}>
Wait, that looks correct. Let me re-check what the Button component supports. If Button from @ui/button is a wrapper around a <button>, it should pass type through. This might be fine, but the loading prop isn't standard HTML — verify the UI library supports it.
Issue 15: searchParams is a Read-Only Object in Next.js 16
Problem: In FacetFilter.tsx (line 960):
const params = new URLSearchParams(searchParams.toString());
While this works, mutating searchParams through router.replace with new params is the correct pattern. However, the larger issue is that searchParams in Next.js 16 is already resolved — no need for async handling.
This seems okay for the Client Component, but searchParams in a Server Component page should not be mutated. Since FacetFilter is a Client Island, it reads from useSearchParams(), which is correct.
Issue 16: CategoryShowcase.tsx and FeaturedCollections.tsx — Semantically async but don't fetch data
Problem: CategoryShowcase.tsx (line 573):
export async function CategoryShowcase(): Promise<JSX.Element> {
And FeaturedCollections.tsx (line 299):
export async function FeaturedCollections(): Promise<JSX.Element> {
These are RSC components (not Client Islands), but they have async keyword and Promise<JSX.Element> return type despite not using await on any external calls (they use mock data).
Action Required: RSC can be async if they fetch data, but for components with static/mock data, remove async and Promise<JSX.Element> return type — just return JSX.Element (or better, use inferred return types).
Actually, since React 19 bans JSX.Element explicitly, the return types should simply be inferred (remove Promise<JSX.Element> and JSX.Element).
Issue 17: account/page.tsx Skeleton Uses Static Data Instead of Dynamic
Problem: src/app/account/page.tsx (line 1455) is a Server Component that shows a "skeleton" with hardcoded numbers ("2", "8,450", "14").
This should:
1. 
Fetch real data from tRPC or fetch user session
2. 
OR be clearly a loading state with aria-busy="true" and animate-pulse class
Action Required: The account page should be a real dashboard or clearly marked as a skeleton/loading state.
3. ⚠️ Minor Issues & Best Practice Deviations
#	Issue	Location	Severity	Action
18	No key={url} in VideoPlayer.tsx — but it's not in a list	N/A	Low	N/A
19	console.log in VisualSearchButton.tsx (line 876)	console.log("Uploading for visual search:", file.name);	Low	Replace with proper tRPC call or toast
20	VideoPlayer doesn't use next/image for poster	poster={poster} is a string path, not Next.js Image	Low	Acceptable for <video>
21	BrandStory uses useRef but might not need it	Could be state-driven	Info	Review if ref is necessary
22	MagneticButton.tsx uses direct SVG instead of icon lib	Could use lucide-react	Low	Optional
23	ParallaxSection.tsx uses willChange transform	Performance best practice says avoid will-change	Info	Remove or test
24	FacetFilter uses Array.from(searchParams) — should work fine	Next.js 16 searchParams is read-only plain object	Low	Verify compatibility
25	useDebounce in SearchInput.tsx only used for suggestions, not API calls	Could leverage tRPC for live search	Medium	Consider tRPC integration
26	ProductViewer3D imports @react-three/fiber and @react-three/drei without dynamic import wrapper in its OWN file	Only the PARENT does dynamic import	Medium	The component itself is fine, but verify parent wraps it
27	RichTextRenderer.tsx — blocks are typed inline, not imported from shared types	RichTextBlock is exported from same file	Low	Consider extracting to types/
28	ArticlePageProps uses await params pattern	Line 1312	High	Already covered in #1
29	SearchResults function is nested inside another function in search/page.tsx	Line 1048	Low	OK for closure, but consider extracting
30	ProductEmbed.tsx uses setOptimisticAdded(null) — type mismatch with boolean	Line 1414	High	Already covered in #11
4. ✅ Well-Implemented Patterns (Worth Highlighting)
Pattern	Example	Comment
RSC/Client Split	page.tsx = RSC, HeroSection.tsx = "use client"	Correctly isolated
useReducedMotion	All motion components check useReducedMotion()	Excellent a11y
prefers-reduced-motion CSS	globals.css media query	Global enforcement
next/image explicit dims	All images have width/height	Zero CLS
useId() for ARIA	SearchOverlay.tsx, WishlistButton.tsx	Stable hydration
startTransition in FacetFilter	URL updates wrapped in startTransition	Non-blocking UI
Suspense boundaries	Around FeaturedCollections, EditorialHighlight	Correct streaming
Zustand partialize	useWishlistStore — only items persisted	Correct data-only persistence
Component-prefixed interfaces	HeroSectionProps, MagneticButtonProps	TS 6 strict compliance
Discriminated unions for CMS	RichTextBlock type	Type-safe CMS blocks
5. 📋 Corrected Phase 2 File Matrix
Below is the corrected, skill-validated file matrix with all critical issues fixed:
#	File	Status	Critical Fix Needed
2.1.1	src/app/page.tsx	✅ Good	Remove JSX.Element return type
2.1.2	src/components/sections/HeroSection.tsx	✅ Good	Remove JSX.Element return type
2.1.3	src/components/sections/FeaturedCollections.tsx	⚠️ Fix	Remove async, use <Link> not <a>, remove JSX.Element
2.1.4	src/components/sections/NewArrivals.tsx	✅ Good	Remove JSX.Element return type
2.1.5	src/components/sections/EditorialHighlight.tsx	⚠️ Fix	Use <Link> not <a>, remove JSX.Element
2.1.6	src/components/sections/BrandStory.tsx	✅ Good	Remove JSX.Element return type
2.1.7	src/components/sections/NewsletterSection.tsx	✅ Good	Remove JSX.Element return type
2.1.8	src/components/sections/SocialProof.tsx	✅ Good	Remove JSX.Element return type
2.1.9	src/components/sections/CategoryShowcase.tsx	⚠️ Fix	Remove async, use <Link> not <a>, remove JSX.Element
2.2.1	src/hooks/useDebounce.ts	✅ Good	—
2.2.2	src/components/search/SearchOverlay.tsx	⚠️ Fix	Create useFocusTrap.ts hook, remove JSX.Element
2.2.3	src/components/search/SearchInput.tsx	🚨 Fix	Replace window.location.href with router.push, remove JSX.Element
2.2.4	src/components/search/VisualSearchButton.tsx	🚨 Fix	Replace emojis with Lucide icons, remove JSX.Element
2.2.5	src/components/search/FacetFilter.tsx	✅ Good	Remove JSX.Element return type
2.2.6	src/app/search/page.tsx	🚨 Fix	Remove Promise<> from searchParams, remove await, use inferred return type
2.3.1	src/app/editorial/page.tsx	✅ Good	Remove JSX.Element return type
2.3.2	src/components/editorial/ArticleCard.tsx	✅ Good	Remove JSX.Element return type
2.3.3	src/app/editorial/[slug]/page.tsx	🚨 Fix	Remove await params, use const { slug } = params, use inferred return type
2.3.4	src/components/editorial/RichTextRenderer.tsx	✅ Good	Remove JSX.Element return type
2.3.5	src/components/editorial/ProductEmbed.tsx	🚨 Fix	Replace useOptimistic with useState, remove JSX.Element
2.3.6	src/app/account/page.tsx	⚠️ Fix	Use Link instead of <a>, remove JSX.Element
2.4.1	src/components/shared/ParallaxSection.tsx	✅ Good	Remove JSX.Element return type
2.4.2	src/components/shared/ScrollReveal.tsx	✅ Good	Remove JSX.Element return type
2.4.3	src/components/shared/TextReveal.tsx	✅ Good	Remove JSX.Element return type
2.4.4	src/components/shared/ImageReveal.tsx	✅ Good	Remove JSX.Element return type
2.4.5	src/components/shared/MagneticButton.tsx	✅ Good	Remove JSX.Element return type
2.4.6	src/components/shared/PageTransition.tsx	✅ Good	Remove JSX.Element return type
2.4.7	src/components/product/ProductViewer3D.tsx	⚠️ Fix	Remove JSX.Element return type
2.4.8	src/components/product/VideoPlayer.tsx	⚠️ Fix	Replace ▶ with Lucide Play icon, remove JSX.Element
2.4.9	src/components/shared/BeforeAfterSlider.tsx	⚠️ Fix	Replace ↔ with Lucide icon or custom SVG, remove JSX.Element
2.5.1	src/stores/wishlist.ts	✅ Good	—
2.5.2	src/hooks/useWishlist.ts	✅ Good	—
2.5.3	src/components/shared/WishlistButton.tsx	🚨 Fix	Replace useOptimistic with useState, remove JSX.Element
6. 📋 Detailed Corrected Implementation Plan (With ToDo List)
Based on the validation above, here is the reconciled, ready-to-execute plan:
Phase 2.1: Cinematic Homepage (Sub-Phase 2.1 — EST 3–4 days)
#	Task	File	Effort	Blockers
2.1.1	Create src/app/page.tsx (RSC shell, OG meta, Suspense boundaries)	app/page.tsx	2h	—
2.1.2	Create src/components/sections/HeroSection.tsx (Client Island: video bg, scroll, text reveal)	components/sections/HeroSection.tsx	4h	—
2.1.3	Create src/components/sections/FeaturedCollections.tsx (RSC: editorial grid, <Link>)	components/sections/FeaturedCollections.tsx	3h	—
2.1.4	Create src/components/sections/NewArrivals.tsx (Client Island: carousel)	components/sections/NewArrivals.tsx	4h	—
2.1.5	Create src/components/sections/EditorialHighlight.tsx (RSC: magazine layout, <Link>)	components/sections/EditorialHighlight.tsx	3h	—
2.1.6	Create src/components/sections/BrandStory.tsx (Client Island: parallax, narrative)	components/sections/BrandStory.tsx	3h	Depends on ParallaxSection
2.1.7	Create src/components/sections/NewsletterSection.tsx (Client Island: form, useActionState)	components/sections/NewsletterSection.tsx	2h	—
2.1.8	Create src/components/sections/SocialProof.tsx (RSC: trust indicators)	components/sections/SocialProof.tsx	2h	—
2.1.9	Create src/components/sections/CategoryShowcase.tsx (RSC: category grid, <Link>)	components/sections/CategoryShowcase.tsx	3h	—
Phase 2.2: Advanced Search & Discovery (Sub-Phase 2.2 — EST 2–3 days)
#	Task	File	Effort	Blockers
2.2.1	Create src/hooks/useDebounce.ts (generic typed hook)	hooks/useDebounce.ts	1h	—
2.2.2	Create src/hooks/useFocusTrap.ts (keyboard accessibility hook)	hooks/useFocusTrap.ts	2h	—
2.2.3	Create src/components/search/SearchOverlay.tsx (Client Island: focus trap, Escape key)	components/search/SearchOverlay.tsx	4h	Depends on useFocusTrap
2.2.4	Create src/components/search/SearchInput.tsx (Client Island: debounce, suggestions, router.push)	components/search/SearchInput.tsx	3h	Depends on useDebounce
2.2.5	Create src/components/search/VisualSearchButton.tsx (Client Island: upload trigger, Lucide icons)	components/search/VisualSearchButton.tsx	2h	—
2.2.6	Create src/components/search/FacetFilter.tsx (Client Island: URL sync, startTransition)	components/search/FacetFilter.tsx	4h	—
2.2.7	Create src/app/search/page.tsx (RSC: results shell, searchParams-driven)	app/search/page.tsx	3h	—
Phase 2.3: Editorial & Content System (Sub-Phase 2.3 — EST 2–3 days)
#	Task	File	Effort	Blockers
2.3.1	Create src/app/editorial/page.tsx (RSC: asymmetric grid)	app/editorial/page.tsx	2h	—
2.3.2	Create src/components/editorial/ArticleCard.tsx (Presentational: semantic <article>)	components/editorial/ArticleCard.tsx	2h	—
2.3.3	Create src/app/editorial/[slug]/page.tsx (RSC: article page, params plain obj)	app/editorial/[slug]/page.tsx	3h	—
2.3.4	Create src/components/editorial/RichTextRenderer.tsx (Client: discriminated union blocks)	components/editorial/RichTextRenderer.tsx	3h	—
2.3.5	Create src/components/editorial/ProductEmbed.tsx (Client: quick-add, useState)	components/editorial/ProductEmbed.tsx	2h	—
2.3.6	Create src/app/account/page.tsx (RSC: dashboard skeleton)	app/account/page.tsx	2h	—
Phase 2.4: Motion, 3D & Media (Sub-Phase 2.4 — EST 3–4 days)
#	Task	File	Effort	Blockers
2.4.1	Create src/hooks/useReducedMotion.ts (Framer Motion wrapper)	hooks/useReducedMotion.ts	1h	—
2.4.2	Create src/components/shared/ParallaxSection.tsx (Client: multi-layer depth)	components/shared/ParallaxSection.tsx	3h	Depends on useReducedMotion
2.4.3	Create src/components/shared/ScrollReveal.tsx (Client: viewport entry animation)	components/shared/ScrollReveal.tsx	2h	Depends on useReducedMotion
2.4.4	Create src/components/shared/TextReveal.tsx (Client: character-by-character)	components/shared/TextReveal.tsx	2h	Depends on useReducedMotion
2.4.5	Create src/components/shared/ImageReveal.tsx (Client: clipPath reveal)	components/shared/ImageReveal.tsx	2h	—
2.4.6	Create src/components/shared/MagneticButton.tsx (Client: cursor attraction)	components/shared/MagneticButton.tsx	2h	Depends on useReducedMotion
2.4.7	Create src/components/shared/PageTransition.tsx (Client: blur+fade route transitions)	components/shared/PageTransition.tsx	2h	—
2.4.8	Create src/components/product/ProductViewer3D.tsx (Client: R3F + Drei, MUST be dynamically imported)	components/product/ProductViewer3D.tsx	4h	—
2.4.9	Create src/components/product/VideoPlayer.tsx (Client: native <video>)	components/product/VideoPlayer.tsx	2h	—
2.4.10	Create dynamic import wrapper example in parent	(multiple)	2h	Depends on ProductViewer3D
Phase 2.5: Wishlist & State Integration (Sub-Phase 2.5 — EST 1–2 days)
#	Task	File	Effort	Blockers
2.5.1	Create src/stores/wishlist.ts (Zustand: partialize items only)	stores/wishlist.ts	2h	—
2.5.2	Create src/hooks/useWishlist.ts (Operations: selector discipline, useMemo)	hooks/useWishlist.ts	2h	Depends on stores/wishlist
2.5.3	Create src/components/shared/WishlistButton.tsx (Client: useState toggle, aria-pressed)	components/shared/WishlistButton.tsx	2h	Depends on hooks/useWishlist
7. 📊 Reconciliation with MEP — What's New in phase-2.md
MEP File (2.1–2.9)	Mapped to phase-2.md	Status
src/components/sections/HeroSection.tsx	Sub-Phase 2.1.2	✅ Aligned, expanded
src/components/shared/MagneticButton.tsx	Sub-Phase 2.4.6	✅ Aligned
src/components/shared/ScrollReveal.tsx	Sub-Phase 2.4.2	✅ Aligned
src/components/product/ProductViewer3D.tsx	Sub-Phase 2.4.7	✅ Aligned
src/components/search/SearchOverlay.tsx	Sub-Phase 2.2.2	✅ Aligned, expanded
src/app/search/page.tsx	Sub-Phase 2.2.6	✅ Aligned, expanded
src/components/editorial/RichTextRenderer.tsx	Sub-Phase 2.3.4	✅ Aligned, expanded
src/components/shared/PageTransition.tsx	Sub-Phase 2.4.7	✅ Aligned
src/stores/wishlist.ts	Sub-Phase 2.5.1	✅ Aligned
NEW: useDebounce.ts	Sub-Phase 2.2.1	⚠️ Not in MEP, but necessary
NEW: useFocusTrap.ts	Sub-Phase 2.2.2	⚠️ Not in MEP, but necessary
NEW: VisualSearchButton.tsx	Sub-Phase 2.2.5	⚠️ Not in MEP, PRD mentions visual search
NEW: ProductEmbed.tsx	Sub-Phase 2.3.5	⚠️ Not in MEP, but needed for CMS
NEW: useWishlist.ts	Sub-Phase 2.5.2	⚠️ Not in MEP, but good practice
NEW: WishlistButton.tsx	Sub-Phase 2.5.3	⚠️ Not in MEP, but good practice
8. 📋 Final Validated ToDo List
Before beginning Phase 2 implementation, the following
# Todos
[ ] Fix all `JSX.Element` return types → remove or use inferred return types (React 19)
[ ] Fix `params` usage: remove `await params`, use plain destructuring (Next.js 16)
[ ] Fix `searchParams` usage: remove `Promise<>`, remove `await`, use plain object (Next.js 16)
[ ] Replace all `<a href>` for internal nav with `next/link` `<Link>` component
[ ] Replace `window.location.href` with `useRouter().push()` in Client Islands
[ ] Create missing `useFocusTrap.ts` hook before `SearchOverlay`
[ ] Replace all `useOptimistic` with `useState` in simple boolean toggle scenarios
[ ] Replace ALL emojis with Lucide icons (📷, 🖼️, ↔, ▶)
[ ] Remove `async`/`Promise<>` from components that don't actually fetch data
[ ] Remove standalone `▶` play button Unicode, use Lucide `Play` icon
[ ] Verify `Button` component supports `type`, `loading`, `disabled` prop passthrough
[ ] Update `NewsletterSection` form: ensure Zod v4 `result.error.issues[0].message` pattern
[ ] Add `aria-busy="true"` to `account/page.tsx` skeleton state
[ ] Document corrected Phase 2 plan with verified gates
[ ] Phase 2.1: Implement Cinematic Homepage (8 files)
[ ] Phase 2.2: Implement Search & Discovery (7 files)
[ ] Phase 2.3: Implement Editorial & Content (6 files)
[ ] Phase 2.4: Implement Motion, 3D & Media (10 files)
[ ] Phase 2.5: Implement Wishlist & State (3 files)
[ ] Run final verification: typecheck, lint, test, build (per Phase 2 gates)
✅ Phase 2 Review Complete — Critical Findings Summary
I have meticulously reviewed phase-2.md against MASTER_EXECUTION_PLAN.md, Project_Requirements_Document.md, and skills/luxeverse-architect-skill/SKILL.md. The plan is largely aligned with the MEP and PRD, but 17 critical issues must be resolved before any code is written.
🚨 Critical Issues Found (Must Fix Before Implementation)
#	Issue	Severity	Files Affected	Fix
1	JSX.Element return types — BANNED in React 19	🔴 High	ALL 31 components	Remove explicit : JSX.Element / : Promise<JSX.Element> → use inferred return types
2	await params — Next.js 16 params is a plain object, NOT a Promise	🔴 High	editorial/[slug]/page.tsx	Change const { slug } = await params; → const { slug } = params;
3	searchParams is NOT a Promise	🔴 High	search/page.tsx	Remove Promise<> wrapper, remove await
4	<a href> for internal navigation	🔴 High	FeaturedCollections, EditorialHighlight, CategoryShowcase, account/page.tsx	Replace with next/link <Link>
5	window.location.href in Client Islands	🔴 High	SearchInput.tsx	Replace with const router = useRouter(); router.push(...)
6	useFocusTrap hook missing	🔴 High	SearchOverlay.tsx	Create src/hooks/useFocusTrap.ts before implementing overlay
7	useOptimistic misuse	🔴 High	WishlistButton.tsx, ProductEmbed.tsx	Replace with useState (learned in Phase 1)
8	Emojis in UI	🔴 High	VisualSearchButton.tsx, VideoPlayer.tsx, BeforeAfterSlider.tsx	Replace with Lucide icons
9	async on components without external fetch	🟡 Medium	FeaturedCollections.tsx, CategoryShowcase.tsx	Remove async/Promise<> — these use mock data
10	Play button ▶ Unicode	🟡 Medium	VideoPlayer.tsx	Replace with <Play /> Lucide icon
⚠️ Minor Issues
#	Issue	Files
11	console.log in VisualSearchButton	Replace with tRPC call/toast
12	NewsletterSection Zod v4 API	Verify result.error.issues[0].message
13	aria-busy="true" on skeleton	account/page.tsx
14	willChange in ParallaxSection	Consider removing (performance)
📊 Phase 2 Execution Duration
Sub-Phase	Components	EST Duration	Dependencies
2.1 Cinematic Homepage	8 files	3–4 days	—
2.2 Search & Discovery	7 files	2–3 days	useDebounce, useFocusTrap
2.3 Editorial & Content	6 files	2–3 days	—
2.4 Motion, 3D & Media	10 files	3–4 days	Framer Motion, R3F (optional)
2.5 Wishlist & State	3 files	1–2 days	Zustand
Total	34 files	11–16 days	 
🎯 Next Steps — Please Confirm
I will NOT generate Phase 2 code until you explicitly approve this corrected plan.
Please confirm:
1.  ✅ Approve the corrected Phase 2 execution plan with all 17 critical fixes applied to the spec?
2.  ✅ Confirm sub-phase execution order (Homepage → Search → Editorial → Motion/3D → Wishlist), or prefer a different sequence?
3.  ✅ Proceed with Sub-Phase 2.1 (Cinematic Homepage) immediately upon approval?
4.  ✅ Any additional constraints, priority shifts, or scope adjustments before implementation begins?

