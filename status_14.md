All verification gates pass:
Command	Result
pnpm typecheck	✅ Zero errors
pnpm lint	✅ No deprecated utilities, no raw hex
pnpm test	✅ 93 passed (19 test files)
pnpm build	✅ Production build succeeds
SKILL.md v5.0.0 Update — Complete & Verified
The skill has been successfully updated with all learnings from the next-intl v4 migration. Here's what was accomplished:
What Was Preserved (Original Valid Content)
Section	Status
§1. The 6-Phase Execution Framework	✅ Preserved
§2. Complete Architecture Blueprint	✅ Preserved
§3. Phase 5 Hardening (Server-Side Auth, Service Factories)	✅ Preserved
§4. TypeScript & React 19 Strict Mode	✅ Preserved
§5. Tailwind CSS v4 CSS-First	✅ Preserved
§6. Zustand State Discipline	✅ Preserved
§7. Prisma Zero-Enum Pattern	✅ Preserved
§9 (now §10). Verification Commands	✅ Preserved
What Was Added (New Knowledge from next-intl v4 Migration)
Section	Key Insight	Prevents
§8. next-intl v4 Configuration	Complete architecture for routing/request split	Runtime crashes
§8.1 Mandatory Split	routing.ts (Edge) vs. request.ts (Node.js)	Bundler errors
§8.2 routing.ts	defineRouting with Array<string> cast	TS2345 readonly tuple error
§8.3 request.ts	getRequestConfig factory with dynamic import	Plugin target mismatch crash
§8.4 next.config.ts	createNextIntlPlugin + turbopack.resolveAlias	"Couldn't find config file"
§8.5 proxy.ts	middleware.ts → proxy.ts rename	Deprecation warning
§8.6 Dynamic Import Path	Aliased files resolve paths from alias target	"Module not found"
§9 (renumbered). Next.js 16 params Duality	Layout vs page params types	Next.js 16 gotcha
§10 (renumbered). Verification	Added createNextIntlPlugin scan	Config validation
Key Anti-Patterns Codified
Anti-Pattern	Why It Fails	Correct Approach
Monolithic i18n.ts	Deprecated in v4, causes TypeError	Split to routing.ts + request.ts
Plugin pointing to routing.ts	Exports static object, not factory	Point to request.ts with getRequestConfig
Missing turbopack.resolveAlias	Turbopack can't resolve next-intl/config	Add explicit alias in next.config.ts
messages/ at project root	Aliased file resolves from node_modules/	Move messages/ into src/
locales without cast	TypeScript readonly tuple rejected	Cast: locales as unknown as Array<string>
The skill is now complete with all original content preserved and new next-intl v4 knowledge added as §8.

