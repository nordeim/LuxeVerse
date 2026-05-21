- Implement Phase 3 "AI & Personalization" — AI stylist, style quiz, size prediction, personalized recommendations — with TDD, validating against MASTER_EXECUTION_PLAN.md.
Constraints & Preferences
- TypeScript 6 strict (erasableSyntaxOnly, noUnusedLocals, noUnusedParameters)
- Tailwind v4 CSS-first, zero JS config
- NextAuth v4 API (v5 upgrade deferred)
- Zod v4 boundary validation with result.error.issues[0].message
- RSC-first architecture; client islands only for interactivity
- No raw card data in client bundle (PCI SAQ-A)
- TDD: tests before implementation, red → green → refactor
- partialize for data-only persistence in Zustand stores
Progress
Done
- Completed re-validation of codebase against MEP, phase-2.md, status_2.md
- Fixed search.ts runtime bug: { relevance: "desc" } → { createdAt: "desc" } (Prisma has no relevance field)
- Renamed sort enum "relevance" → "relevant" in search.ts
- Created apps/web/public/.gitkeep (directory was missing, causing 404s)
- Created apps/web/src/app/loading.tsx (global suspense boundary)
- Wired ProductEmbed to useCartStore((s) => s.addItem) with full CartItem shape
- Verified <Suspense> around <Canvas> defers R3F load; documented lazy() anti-pattern
- Added 9 tests in search.test.ts (query, suggestions, facets, trending)
- Updated status_2.md: Phase 2 revised from ~95% to ~90%
- Created docs/architecture.md and docs/runbook.md
- Updated README.md with new troubleshooting (Next.js 16 params, R3F lazy, search orderBy)
- Updated CLAUDE.md with latest state, critical gotchas, lessons learned
- Updated ACCOMPLISHMENTS.md with Phase 2 remediation and search log
- Full verification: pnpm typecheck ✅, pnpm lint ✅, pnpm test ✅ (11 → 16 → 20 tests)
- Phase 3 Foundation:
  - Created src/lib/ai.types.ts (OutfitRequest, OutfitResponse, SizeAdviceRequest, ChatMessage, etc.)
  - Created src/server/routers/ai.ts with generateOutfit, getSizeAdvice, streamStyleChat (mock fallback)
  - Created src/server/routers/ai.test.ts (5 tests, all passing)
  - Registered aiRouter in src/server/routers/index.ts
  - Created src/stores/style-quiz.ts (Zustand + partialize) + style-quiz.test.ts (4 tests)
  - Created src/stores/style-profile.ts (Zustand + partialize) for persona, colors, preferences
  - Created src/components/ai-stylist/StyleChat.tsx (SSE streaming UI with AbortController)
  - Created src/components/ai-stylist/OutfitCard.tsx (outfit display with confidence bar)
  - Created src/components/size/SizeRecommendation.tsx (size advice with confidence score)
  - Created src/components/recommendations/PersonalizedGrid.tsx (integration layout)
In Progress
- None
Blocked
- None
Key Decisions
- AI router uses mock data when OPENAI_API_KEY is absent, enabling CI/CD without secrets
- streamStyleChat returns { stream: AsyncGenerator } in tRPC; real SSE via api/ai/stream/route.ts
- partialize pattern applied to style-quiz and style-profile stores (only domain data persisted)
- R3F components cannot be lazy() destructured; <Suspense> boundary is the correct pattern
- Next.js 16: params is a plain object, not a Promise — never await params
Next Steps
- Add OpenAI/Anthropic real implementation to ai.ts (replacing mocks when OPENAI_API_KEY is set)
- Integrate StyleChat, OutfitCard, SizeRecommendation into actual pages (quiz, account, PDP)
- Wire generateOutfit to real product catalog for contextual outfit generation
- Add Web Worker for AI inference if needed (heavy model support)
Critical Context
- prisma generate must run after every schema.prisma change or TypeScript will throw TS2339
- When adding a required field to a Prisma model, ALL prisma.model.create() calls must be updated
- R3F named exports cannot be lazy() destructured; use <Suspense> fallback instead
- Next.js 16 params is a plain object — const { slug } = params, never await params
- Search orderBy fallback must use existing Prisma fields (createdAt, views), not relevance
- Zod v4 uses result.error.issues[0].message, not .errors[0].message
Relevant Files
- src/server/routers/ai.ts: tRPC router with generateOutfit, getSizeAdvice, streamStyleChat
- src/server/routers/ai.test.ts: 5 tests for AI router
- src/lib/ai.types.ts: AI service type definitions (OutfitRequest, SizeAdviceRequest, ChatMessage, etc.)
- src/stores/style-quiz.ts: Zustand store for style quiz state + persistence
- src/stores/style-profile.ts: Zustand store for persona, colors, preferences + persistence
- src/components/ai-stylist/StyleChat.tsx: SSE streaming chat UI component
- src/components/ai-stylist/OutfitCard.tsx: Outfit display with confidence bar
- src/components/size/SizeRecommendation.tsx: Size advice with confidence score
- src/components/recommendations/PersonalizedGrid.tsx: Integration layout for AI features
- src/app/api/ai/stream/route.ts: SSE endpoint for streaming chat
- apps/web/src/server/routers/search.ts: Fixed search sort (createdAt desc)
- apps/web/src/app/loading.tsx: Global suspense boundary
- docs/architecture.md: Monorepo structure, tech stack, data flow
- docs/runbook.md: Commands, troubleshooting, deployment
