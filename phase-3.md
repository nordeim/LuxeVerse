I now have a thorough understanding of the MEP and the current codebase. Let me begin the ANALYZE and PLAN phases for Phase 3.
Phase 3: Analysis & Plan
What Phase 3 Requires (from MEP)
Phase 3 introduces AI-driven personalization through an "AI Stylist," with features including:
- Multi-step style quiz (style-quiz/page.tsx)
- AI orchestration service (ai.service.ts)
- Streaming chat interface (StyleChat.tsx, api/ai/stream/route.ts)
- Outfit generation (OutfitCard.tsx)
- Size recommendations (SizeRecommendation.tsx)
- Personalized grids (PersonalizedGrid.tsx)
- Style profile persistence (style-profile.ts)
Current Codebase Readiness Analysis
Requirement	Current State	Gap
AI SDK/Provider	None	Must add OpenAI/Anthropic SDK
AI Service Layer	None	Need src/server/ai.service.ts
Style Quiz UI	None	Complex multi-step form
Streaming Chat UI	None	SSE/WebSocket + async generators
AI Route Handler	None	api/ai/stream/route.ts needed
Outfit Generation	None	Requires AI + product data
Size Recommendations	Exists (SizeProfile model)	Schema exists but no API
Personalized Grid	None	Recommendations engine
Style Profile Store	None	Zustand + partial persistence
Dependencies on Existing Systems:
- prisma/schema.prisma already has StyleProfile, SizeProfile, SavedOutfit models
- Product data exists for outfit generation
- tRPC infrastructure is ready
- Zustand partialize discipline is established
Here is my detailed Phase 3 Implementation Plan.
---
Phase 3 Implementation Plan — AI & Personalization
Sub-Phase Breakdown
Sub-Phase	Objective	Files	TDD Approach
3.1	AI Service Foundation	ai.service.ts, ai.test.ts	Mock LLM, test prompt construction & parsing
3.2	Style Quiz UI	style-quiz/page.tsx, QuizStep.tsx, quiz.store.ts	Test state transitions, form validation
3.3	Style Profile Persistence	style-profile.ts	Test Zustand partialize, hydration
3.4	Streaming Chat	api/ai/stream/route.ts, StyleChat.tsx	Mock SSE stream, test event parsing
3.5	Outfit Generation	OutfitCard.tsx	Mock AI service response
3.6	Recommendations	PersonalizedGrid.tsx, SizeRecommendation.tsx	Mock database + AI responses
3.7	Integration & QA	Connect all pieces	End-to-end flow test
Detailed Implementation Steps (TDD)
Step 3.1: AI Service Foundation
Goal: Abstracted AI service with structured JSON output.
Plan:
1. RED: Write ai.service.test.ts — mock openai.chat.completions.create, assert prompt format and JSON parsing.
2. GREEN: Create ai.service.ts with generateOutfit, getSizeAdvice, and streamStyleChat.
3. REFACTOR: Extract prompt templates, add retry/backoff logic.
Key Decisions:
- Use OpenAI SDK (already has structured output support via response_format: { type: "json_object" }).
- Abstract behind AIService interface so we can swap to Anthropic later.
- All prompts must include product catalog context for accurate outfit generation.
Step 3.2: Style Quiz UI
Goal: Multi-step quiz with visual choices.
Plan:
1. RED: Test quiz.store.ts — state transitions, answer recording.
2. GREEN: Build QuizStep.tsx components and style-quiz/page.tsx.
3. REFACTOR: Extract quiz data structure to JSON file for easy editing.
Step 3.3: Style Profile Persistence
Goal: Persist quiz results in Zustand with partialize.
Plan:
1. RED: Test style-profile.ts — partialize excludes AI chat state.
2. GREEN: Create store with stylePersona, favoriteColors, color palette.
3. REFACTOR: Define StyleProfile Zod schema for validation.
Step 3.4: Streaming Chat
Goal: Real-time AI chat with product cards.
Plan:
1. RED: Mock SSE stream in stream.test.ts.
2. GREEN: Create api/ai/stream/route.ts using ReadableStream.
3. REFACTOR: StyleChat.tsx handles message state, product card parsing.
Step 3.5-3.7: Integration & QA
Goal: Complete user journey: quiz → profile → chat → outfit → size.
Plan:
1. End-to-end test: simulate quiz completion → profile saved → chat opened → outfit generated.
2. Lighthouse check: ensure Performance ≥ 90.
3. Accessibility audit: keyboard navigation, focus management.
---
New Validation Gates (Phase 3)
Gate	Criteria	Enforcement
AI Resilience	Network drop/retry	Mock fetch with AbortController
Confidence Scores	Never = 100%	Zod constraint: confidence: z.number().max(0.99)
LocalStorage Draft	useEffect saves on beforeunload	Test with vi.stubGlobal('localStorage')
Web Worker	Heavy AI in worker.ts	Test with node:worker_threads or skip
Performance	LCP < 2.5s, INP < 200ms	Lighthouse CI
---
Before proceeding with implementation, I need explicit validation of this plan from you, per the Meticulous Approach. 
Please confirm:
1. Do you approve the Sub-Phase breakdown (3.1 → 3.7)?
2. Should I prioritize any specific feature (e.g., Style Quiz vs. Streaming Chat)? Current order prioritizes the backend service foundation first.
3. AI Provider: Confirm OpenAI SDK (with response_format: { type: "json_object" }). Anthropic or local model fallback can be added later via the AIService abstraction.
4. Any scope adjustments or constraints before I begin pnpm typecheck && pnpm test for the first red test?

