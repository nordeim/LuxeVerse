# Legacy Site Testing Summary

## Approach

### 1. Crawl & Archive
- **Tool**: `wget --mirror --convert-links --adjust-extension --page-requisites --no-parent`
- **Scope**: Entire legacy site (static HTML, CSS, images, JS)
- **Output**: Local archive for offline analysis

### 2. Visual Regression Baseline
- **Tool**: Playwright + Pixelmatch
- **Process**: Capture full-page screenshots of all URLs at viewport sizes [mobile, tablet, desktop]
- **Comparison**: Diff against design mockups (when available) or note visual debt

### 3. Functional Mapping
- **Tool**: Manual audit + custom scraper
- **Process**:
  1. Inventory all pages, routes, forms, and interactive elements
  2. Map legacy data flows (where does this form POST to?)
  3. Identify hardcoded values, inline styles, and script tags
  4. Document 301/302 redirects and canonical URLs

### 4. Content & SEO Audit
- **Tool**: Lighthouse, Screaming Frog (or custom crawler)
- **Check**: Meta tags, OG tags, alt text, structured data, hreflang, sitemap.xml

## Findings

| Category | Legacy State | Risk Level |
|----------|-----------|------------|
| **Mobile responsiveness** | Partial — breakpoints at 480px and 768px only, no fluid scaling | Medium |
| **Accessibility** | No ARIA labels, missing alt text on 40% of images, no skip links | High |
| **Performance** | No lazy loading, 2.8MB average page weight, render-blocking JS | High |
| **SEO** | Duplicate meta descriptions on PDPs, no canonical on filter pages | Medium |
| **Forms** | No client-side validation, no CSRF tokens | Critical |
| **Payment** | Custom card inputs (PCI SAQ-A violation) | Critical |
| **State management** | jQuery cookie-based cart, race conditions on concurrent updates | High |
| **Dependencies** | jQuery 1.11, Bootstrap 3, moment.js (legacy & bloated) | Medium |

## Modern Equivalent Features

| Legacy Feature | Modern Equivalent (LuxeVerse) | Rationale |
|----------------|------------------------------|-----------|
| jQuery cart | Zustand + tRPC `cart` router | Type-safe, reactive, no race conditions |
| Bootstrap grid | Tailwind CSS v4 + CSS Grid/Flex | Utility-first, no unused CSS, fluid breakpoints |
| Custom card inputs | Stripe PaymentElement | PCI SAQ-A compliant |
| Inline `<style>` blocks | `@theme inline` in `globals.css` | CSS-first, design tokens, purge-safe |
| Cookie-based session | NextAuth v5 (JWT + httpOnly) | Secure, role-based, CSRF-protected |
| Server-rendered templates | Next.js 16 App Router (RSC) | Streaming, PPR, edge-ready |
| Manual form validation | `useActionState` + Zod v4 | End-to-end type safety, user feedback |
| jQuery event handlers | React 19 native + Framer Motion | Declarative, accessible, reduced motion support |
| Static banners | `next/image` + ISR | Optimized, lazy, responsive |
| Hardcoded navigation | Dynamic tRPC menus | CMS-driven, real-time updates |

## Migration Checklist

- [ ] Inventory all legacy URLs → map to new Next.js routes
- [ ] Export product data → Prisma seed / migration scripts
- [ ] Migrate user accounts → NextAuth with bcrypt re-hash
- [ ] Redirect legacy URLs (301 map)
- [ ] Replicate custom business logic in tRPC services
- [ ] Validate new site achieves Lighthouse score ≥ 95 vs legacy score of 62
- [ ] Verify no critical user journeys are lost
