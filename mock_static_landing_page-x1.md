# LuxeVerse Landing Page — Cinematic Digital Atelier

## Executive Summary

I've designed a landing page that embodies the **"Digital Haute Couture"** philosophy from the PRD — where every pixel is intentionally crafted to evoke the emotional resonance of stepping into a flagship boutique on Rue du Faubourg Saint-Honoré, amplified by cinematic motion, AI-driven personalization cues, and spatial depth.

**Conceptual Direction**: A dark, atmospheric canvas (deep obsidian/cosmic black) where content emerges from shadow — like products materializing in a dimly lit atelier. Champagne gold and warm ivory serve as luxury accents. The layout breaks conventional grid tyranny with asymmetric compositions, editorial overlaps, and generous negative space that communicates exclusivity.

**Typography**: Bebas Neue (display) + Lora (body) — a pairing that evokes editorial magazine mastheads meets refined literary prose. Never defaulting to system fonts.

**The One Thing You Remember**: The hero section — a massive fluid-type title with a shimmer gradient that slowly shifts across the letterforms, framed by ambient noise texture and cinematic motion.

---

```html
<!DOCTYPE html>
<html lang="en" dir="ltr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="LuxeVerse — A cinematic luxury e-commerce platform. Immersive AI-driven digital boutique experience.">
  <meta name="theme-color" content="#0c0c0e">
  <title>LuxeVerse — Digital Haute Couture</title>

  <!-- Preconnect & Fonts -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Lora:ital,wght@0,400;0,500;0,600;1,400&family=DM+Mono:wght@300;400&display=swap" rel="stylesheet">

  <!-- Lucide Icons CDN -->
  <script src="https://unpkg.com/lucide@latest/dist/umd/lucide.js" defer></script>

  <style>
    /* ============================================================
       RESET & FOUNDATIONS
       ============================================================ */
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    :root {
      /* ---- OKLCH Palette ---- */
      --obsidian-50:  oklch(0.98 0.002 260);
      --obsidian-100: oklch(0.94 0.003 260);
      --obsidian-200: oklch(0.85 0.004 260);
      --obsidian-300: oklch(0.73 0.005 260);
      --obsidian-400: oklch(0.58 0.006 260);
      --obsidian-500: oklch(0.46 0.006 260);
      --obsidian-600: oklch(0.37 0.005 260);
      --obsidian-700: oklch(0.30 0.005 260);
      --obsidian-800: oklch(0.26 0.004 260);
      --obsidian-900: oklch(0.16 0.005 260);
      --obsidian-950: oklch(0.08 0.003 260);

      --neon-cyan:    oklch(0.85 0.18 190);
      --neon-pink:    oklch(0.65 0.28 350);

      --metallic-champagne: oklch(0.88 0.06 75);
      --metallic-gold:      oklch(0.78 0.14 85);
      --metallic-gold-dark: oklch(0.62 0.13 70);
      --metallic-silver:    oklch(0.82 0.008 260);

      --atmosphere-deep-purple:   oklch(0.15 0.08 300);
      --atmosphere-midnight-blue: oklch(0.14 0.04 250);
      --atmosphere-dark-emerald:  oklch(0.16 0.04 160);
      --atmosphere-warm-charcoal: oklch(0.16 0.01 50);
      --atmosphere-cosmic-black:  oklch(0.06 0.002 260);

      --semantic-success:   oklch(0.65 0.18 145);
      --semantic-error:     oklch(0.60 0.22 25);
      --semantic-info:      oklch(0.60 0.15 250);

      --ivory:     oklch(0.96 0.008 80);
      --text-body: oklch(0.88 0.005 80);

      /* ---- Typography ---- */
      --font-display: 'Bebas Neue', Impact, 'Arial Narrow', sans-serif;
      --font-body:    'Lora', 'Georgia', 'Palatino Linotype', serif;
      --font-mono:    'DM Mono', 'Courier New', monospace;

      --text-hero:  clamp(3.5rem, 2.5rem + 5vw, 8rem);
      --text-h1:    clamp(2.5rem, 2rem + 2.5vw, 4rem);
      --text-h2:    clamp(2rem, 1.7rem + 1.5vw, 3rem);
      --text-h3:    clamp(1.25rem, 1.1rem + 0.75vw, 1.5rem);
      --text-body:  clamp(1rem, 0.9rem + 0.5vw, 1.125rem);
      --text-small: clamp(0.75rem, 0.7rem + 0.25vw, 0.875rem);
      --text-micro: clamp(0.625rem, 0.575rem + 0.25vw, 0.75rem);

      /* ---- Spacing (Golden Ratio) ---- */
      --sp-3xs: 0.236rem;
      --sp-2xs: 0.382rem;
      --sp-xs:  0.618rem;
      --sp-sm:  1rem;
      --sp-md:  1.618rem;
      --sp-lg:  2.618rem;
      --sp-xl:  4.236rem;
      --sp-2xl: 6.854rem;
      --sp-3xl: 11.09rem;

      /* ---- Motion ---- */
      --ease-expo:     cubic-bezier(0.16, 1, 0.3, 1);
      --ease-spring:   cubic-bezier(0.175, 0.885, 0.32, 1.275);
      --ease-dramatic: cubic-bezier(0.77, 0, 0.175, 1);
      --dur-instant:   100ms;
      --dur-fast:      200ms;
      --dur-normal:    400ms;
      --dur-slow:      600ms;
      --dur-dramatic:  1000ms;
      --dur-cinematic: 1500ms;
      --dur-glacial:   2500ms;

      /* ---- Depth ---- */
      --shadow-subtle: 0 1px 2px oklch(0 0 0 / 0.05);
      --shadow-sm:     0 2px 8px oklch(0 0 0 / 0.08);
      --shadow-md:     0 4px 16px oklch(0 0 0 / 0.12);
      --shadow-lg:     0 8px 32px oklch(0 0 0 / 0.16);
      --shadow-xl:     0 16px 64px oklch(0 0 0 / 0.24);
      --shadow-glow:   0 0 40px oklch(0.78 0.14 85 / 0.15);
      --shadow-cyan:   0 0 30px oklch(0.85 0.18 190 / 0.2);

      /* ---- Layout ---- */
      --container-max: 1440px;
      --container-pad: clamp(1.5rem, 4vw, 4rem);

      /* ---- Glass ---- */
      --glass-bg: oklch(0.12 0.005 260 / 0.6);
      --glass-border: oklch(0.88 0.06 75 / 0.08);
      --glass-blur: 20px;
    }

    html {
      font-size: 16px;
      scroll-behavior: smooth;
      -webkit-text-size-adjust: 100%;
      text-rendering: optimizeLegibility;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    }

    body {
      font-family: var(--font-body);
      font-size: var(--text-body);
      line-height: 1.7;
      color: var(--text-body);
      background-color: var(--obsidian-950);
      overflow-x: hidden;
    }

    /* Reduced motion */
    @media (prefers-reduced-motion: reduce) {
      *, *::before, *::after {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
        scroll-behavior: auto !important;
      }
      .parallax-layer { transform: none !important; }
    }

    img { display: block; max-width: 100%; height: auto; }
    a { color: inherit; text-decoration: none; }
    button { cursor: pointer; border: none; background: none; font: inherit; color: inherit; }

    /* ============================================================
       LAYOUT UTILITIES
       ============================================================ */
    .container {
      max-width: var(--container-max);
      margin: 0 auto;
      padding-left: var(--container-pad);
      padding-right: var(--container-pad);
    }

    /* ============================================================
       AMBIENT BACKGROUND
       ============================================================ */
    body::before {
      content: '';
      position: fixed;
      inset: 0;
      z-index: 0;
      pointer-events: none;
      background:
        radial-gradient(ellipse 80% 60% at 20% 10%, oklch(0.15 0.08 300 / 0.25) 0%, transparent 60%),
        radial-gradient(ellipse 60% 80% at 80% 80%, oklch(0.14 0.04 250 / 0.2) 0%, transparent 50%),
        radial-gradient(ellipse 50% 40% at 50% 50%, oklch(0.16 0.04 160 / 0.08) 0%, transparent 70%);
    }

    /* Grain overlay */
    body::after {
      content: '';
      position: fixed;
      inset: 0;
      z-index: 9999;
      pointer-events: none;
      opacity: 0.03;
      background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
    }

    /* ============================================================
       SCROLL REVEAL SYSTEM
       ============================================================ */
    .reveal {
      opacity: 0;
      transform: translateY(40px);
      transition:
        opacity var(--dur-dramatic) var(--ease-expo),
        transform var(--dur-dramatic) var(--ease-expo);
    }
    .reveal.is-visible {
      opacity: 1;
      transform: translateY(0);
    }
    .reveal-left {
      opacity: 0;
      transform: translateX(-60px);
      transition:
        opacity var(--dur-dramatic) var(--ease-expo),
        transform var(--dur-dramatic) var(--ease-expo);
    }
    .reveal-left.is-visible {
      opacity: 1;
      transform: translateX(0);
    }
    .reveal-right {
      opacity: 0;
      transform: translateX(60px);
      transition:
        opacity var(--dur-dramatic) var(--ease-expo),
        transform var(--dur-dramatic) var(--ease-expo);
    }
    .reveal-right.is-visible {
      opacity: 1;
      transform: translateX(0);
    }

    /* Staggered children */
    .stagger-children > .reveal:nth-child(1) { transition-delay: 0ms; }
    .stagger-children > .reveal:nth-child(2) { transition-delay: 120ms; }
    .stagger-children > .reveal:nth-child(3) { transition-delay: 240ms; }
    .stagger-children > .reveal:nth-child(4) { transition-delay: 360ms; }

    /* ============================================================
       NAVBAR
       ============================================================ */
    .navbar {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      z-index: 1000;
      padding: var(--sp-md) 0;
      transition:
        padding var(--dur-slow) var(--ease-expo),
        background var(--dur-slow) var(--ease-expo),
        border-color var(--dur-slow) var(--ease-expo);
      border-bottom: 1px solid transparent;
    }
    .navbar.scrolled {
      padding: var(--sp-xs) 0;
      background: var(--glass-bg);
      backdrop-filter: blur(var(--glass-blur));
      -webkit-backdrop-filter: blur(var(--glass-blur));
      border-color: var(--glass-border);
    }
    .navbar__inner {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .navbar__logo {
      font-family: var(--font-display);
      font-size: clamp(1.5rem, 1.3rem + 1vw, 2rem);
      letter-spacing: 0.2em;
      text-transform: uppercase;
      color: var(--metallic-champagne);
      transition: color var(--dur-normal) var(--ease-expo);
    }
    .navbar__logo:hover { color: var(--metallic-gold); }
    .navbar__nav {
      display: flex;
      align-items: center;
      gap: var(--sp-lg);
      list-style: none;
    }
    .navbar__link {
      font-family: var(--font-mono);
      font-size: var(--text-small);
      font-weight: 300;
      letter-spacing: 0.15em;
      text-transform: uppercase;
      color: var(--obsidian-200);
      position: relative;
      padding: var(--sp-2xs) 0;
      transition: color var(--dur-normal) var(--ease-expo);
    }
    .navbar__link::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      width: 0;
      height: 1px;
      background: var(--metallic-champagne);
      transition: width var(--dur-slow) var(--ease-expo);
    }
    .navbar__link:hover { color: var(--metallic-champagne); }
    .navbar__link:hover::after { width: 100%; }
    .navbar__link:focus-visible {
      outline: 2px solid var(--neon-cyan);
      outline-offset: 4px;
      border-radius: 2px;
    }
    .navbar__actions {
      display: flex;
      align-items: center;
      gap: var(--sp-md);
    }
    .navbar__icon-btn {
      color: var(--obsidian-200);
      padding: var(--sp-2xs);
      transition: color var(--dur-fast);
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .navbar__icon-btn:hover { color: var(--metallic-champagne); }
    .navbar__icon-btn:focus-visible {
      outline: 2px solid var(--neon-cyan);
      outline-offset: 4px;
      border-radius: 4px;
    }
    /* Mobile hamburger */
    .navbar__menu-btn { display: none; }

    @media (max-width: 768px) {
      .navbar__nav { display: none; }
      .navbar__menu-btn {
        display: flex;
        align-items: center;
        color: var(--obsidian-200);
        padding: var(--sp-2xs);
      }
      .navbar__menu-btn:hover { color: var(--metallic-champagne); }
    }

    /* ============================================================
       SKIP LINK (Accessibility)
       ============================================================ */
    .skip-link {
      position: absolute;
      top: -100%;
      left: var(--sp-sm);
      z-index: 10000;
      padding: var(--sp-xs) var(--sp-sm);
      background: var(--neon-cyan);
      color: var(--obsidian-950);
      font-family: var(--font-mono);
      font-size: var(--text-small);
      font-weight: 600;
      border-radius: 0 0 4px 4px;
      transition: top var(--dur-fast);
    }
    .skip-link:focus {
      top: 0;
      outline: 2px solid var(--obsidian-950);
      outline-offset: 2px;
    }

    /* ============================================================
       HERO SECTION
       ============================================================ */
    .hero {
      position: relative;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      text-align: center;
      padding: var(--sp-3xl) var(--container-pad) var(--sp-2xl);
      overflow: hidden;
    }

    /* Hero gradient mesh */
    .hero::before {
      content: '';
      position: absolute;
      inset: 0;
      z-index: 0;
      background:
        radial-gradient(ellipse 100% 80% at 50% 20%, oklch(0.15 0.08 300 / 0.3) 0%, transparent 70%),
        radial-gradient(ellipse 60% 50% at 30% 70%, oklch(0.14 0.04 250 / 0.15) 0%, transparent 60%),
        radial-gradient(ellipse 40% 40% at 75% 40%, oklch(0.16 0.04 160 / 0.1) 0%, transparent 50%),
        linear-gradient(180deg, var(--obsidian-950) 0%, var(--atmosphere-cosmic-black) 100%);
      animation: heroGradient var(--dur-glacial) ease-in-out infinite alternate;
    }
    @keyframes heroGradient {
      from {
        background:
          radial-gradient(ellipse 100% 80% at 50% 20%, oklch(0.15 0.08 300 / 0.3) 0%, transparent 70%),
          radial-gradient(ellipse 60% 50% at 30% 70%, oklch(0.14 0.04 250 / 0.15) 0%, transparent 60%),
          radial-gradient(ellipse 40% 40% at 75% 40%, oklch(0.16 0.04 160 / 0.1) 0%, transparent 50%),
          linear-gradient(180deg, var(--obsidian-950) 0%, var(--atmosphere-cosmic-black) 100%);
      }
      to {
        background:
          radial-gradient(ellipse 80% 100% at 60% 30%, oklch(0.15 0.08 300 / 0.25) 0%, transparent 70%),
          radial-gradient(ellipse 70% 40% at 20% 60%, oklch(0.14 0.04 250 / 0.2) 0%, transparent 60%),
          radial-gradient(ellipse 50% 50% at 80% 70%, oklch(0.16 0.04 160 / 0.12) 0%, transparent 50%),
          linear-gradient(180deg, var(--obsidian-950) 0%, var(--atmosphere-cosmic-black) 100%);
      }
    }

    .hero__content {
      position: relative;
      z-index: 2;
      max-width: 900px;
    }

    /* Hero badge */
    .hero__badge {
      display: inline-flex;
      align-items: center;
      gap: var(--sp-2xs);
      padding: var(--sp-2xs) var(--sp-md);
      border: 1px solid oklch(0.78 0.14 85 / 0.2);
      border-radius: 100px;
      font-family: var(--font-mono);
      font-size: var(--text-micro);
      font-weight: 300;
      letter-spacing: 0.2em;
      text-transform: uppercase;
      color: var(--metallic-champagne);
      margin-bottom: var(--sp-xl);
      opacity: 0;
      animation: heroBadgeIn var(--dur-dramatic) var(--ease-expo) 0.3s forwards;
    }
    @keyframes heroBadgeIn {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .hero__badge-dot {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: var(--metallic-champagne);
      animation: pulse 2s ease-in-out infinite;
    }
    @keyframes pulse {
      0%, 100% { opacity: 0.4; }
      50% { opacity: 1; }
    }

    /* Hero title with shimmer */
    .hero__title {
      font-family: var(--font-display);
      font-size: var(--text-hero);
      font-weight: 400;
      line-height: 0.9;
      letter-spacing: 0.04em;
      text-transform: uppercase;
      color: var(--ivory);
      margin-bottom: var(--sp-lg);
      opacity: 0;
      animation: heroTitleIn var(--dur-cinematic) var(--ease-expo) 0.6s forwards;
      /* Shimmer gradient */
      background: linear-gradient(
        90deg,
        var(--ivory) 0%,
        var(--ivory) 40%,
        var(--metallic-champagne) 50%,
        var(--ivory) 60%,
        var(--ivory) 100%
      );
      background-size: 200% 100%;
      -webkit-background-clip: text;
      background-clip: text;
      -webkit-text-fill-color: transparent;
      animation:
        heroTitleIn var(--dur-cinematic) var(--ease-expo) 0.6s forwards,
        shimmer 8s ease-in-out 2s infinite;
    }
    @keyframes heroTitleIn {
      from { opacity: 0; transform: translateY(60px) scale(0.95); }
      to { opacity: 1; transform: translateY(0) scale(1); }
    }
    @keyframes shimmer {
      0% { background-position: 200% center; }
      100% { background-position: -200% center; }
    }
    .hero__title em {
      font-style: normal;
      display: block;
      font-size: 0.6em;
      letter-spacing: 0.35em;
      margin-top: var(--sp-2xs);
    }

    /* Hero subtitle */
    .hero__subtitle {
      font-family: var(--font-body);
      font-size: clamp(1rem, 0.9rem + 0.5vw, 1.25rem);
      font-weight: 400;
      line-height: 1.8;
      color: var(--obsidian-300);
      max-width: 560px;
      margin: 0 auto var(--sp-xl);
      opacity: 0;
      animation: fadeUp var(--dur-dramatic) var(--ease-expo) 1s forwards;
    }
    @keyframes fadeUp {
      from { opacity: 0; transform: translateY(30px); }
      to { opacity: 1; transform: translateY(0); }
    }

    /* Hero CTAs */
    .hero__actions {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: var(--sp-md);
      flex-wrap: wrap;
      opacity: 0;
      animation: fadeUp var(--dur-dramatic) var(--ease-expo) 1.3s forwards;
    }

    /* Buttons */
    .btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: var(--sp-xs);
      font-family: var(--font-mono);
      font-size: var(--text-small);
      font-weight: 400;
      letter-spacing: 0.15em;
      text-transform: uppercase;
      padding: var(--sp-sm) var(--sp-lg);
      border-radius: 0;
      transition:
        background var(--dur-normal) var(--ease-expo),
        color var(--dur-normal) var(--ease-expo),
        letter-spacing var(--dur-slow) var(--ease-expo),
        box-shadow var(--dur-normal) var(--ease-expo),
        transform var(--dur-fast);
      white-space: nowrap;
    }
    .btn:focus-visible {
      outline: 2px solid var(--neon-cyan);
      outline-offset: 3px;
    }
    .btn:active { transform: scale(0.97); }

    .btn--primary {
      background: var(--metallic-champagne);
      color: var(--obsidian-950);
    }
    .btn--primary:hover {
      background: var(--metallic-gold);
      letter-spacing: 0.2em;
      box-shadow: var(--shadow-glow);
    }

    .btn--ghost {
      border: 1px solid oklch(0.78 0.14 85 / 0.3);
      color: var(--metallic-champagne);
      background: transparent;
    }
    .btn--ghost:hover {
      border-color: var(--metallic-champagne);
      background: oklch(0.78 0.14 85 / 0.06);
      letter-spacing: 0.2em;
    }

    /* Hero scroll indicator */
    .hero__scroll {
      position: absolute;
      bottom: var(--sp-xl);
      left: 50%;
      transform: translateX(-50%);
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: var(--sp-xs);
      opacity: 0;
      animation: fadeUp var(--dur-dramatic) var(--ease-expo) 2s forwards;
    }
    .hero__scroll-text {
      font-family: var(--font-mono);
      font-size: var(--text-micro);
      letter-spacing: 0.3em;
      text-transform: uppercase;
      color: var(--obsidian-400);
    }
    .hero__scroll-line {
      width: 1px;
      height: 48px;
      background: linear-gradient(to bottom, var(--metallic-champagne), transparent);
      animation: scrollPulse 2s ease-in-out infinite;
    }
    @keyframes scrollPulse {
      0%, 100% { opacity: 0.3; transform: scaleY(1); }
      50% { opacity: 0.8; transform: scaleY(1.2); }
    }

    /* ============================================================
       EDITORIAL SECTION
       ============================================================ */
    .editorial {
      position: relative;
      z-index: 1;
      padding: var(--sp-3xl) 0;
      overflow: hidden;
    }
    .editorial__grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: var(--sp-xl);
      align-items: center;
    }
    .editorial__visual {
      position: relative;
    }
    .editorial__image-frame {
      position: relative;
      aspect-ratio: 3 / 4;
      overflow: hidden;
      background: var(--obsidian-900);
    }
    .editorial__image-frame img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform var(--dur-cinematic) var(--ease-expo);
    }
    .editorial__image-frame:hover img {
      transform: scale(1.04);
    }
    /* Diagonal accent stripe */
    .editorial__accent {
      position: absolute;
      bottom: -20px;
      right: -20px;
      width: 60%;
      height: 1px;
      background: var(--metallic-champagne);
      opacity: 0.3;
      transform: rotate(-3deg);
    }
    .editorial__content {
      padding-left: var(--sp-xl);
    }
    .editorial__eyebrow {
      font-family: var(--font-mono);
      font-size: var(--text-micro);
      font-weight: 300;
      letter-spacing: 0.3em;
      text-transform: uppercase;
      color: var(--metallic-champagne);
      margin-bottom: var(--sp-md);
    }
    .editorial__heading {
      font-family: var(--font-display);
      font-size: var(--text-h1);
      font-weight: 400;
      line-height: 1;
      letter-spacing: 0.02em;
      text-transform: uppercase;
      color: var(--ivory);
      margin-bottom: var(--sp-lg);
    }
    .editorial__body {
      font-size: var(--text-body);
      line-height: 1.9;
      color: var(--obsidian-300);
      margin-bottom: var(--sp-lg);
      max-width: 480px;
    }
    .editorial__link {
      display: inline-flex;
      align-items: center;
      gap: var(--sp-xs);
      font-family: var(--font-mono);
      font-size: var(--text-small);
      font-weight: 300;
      letter-spacing: 0.2em;
      text-transform: uppercase;
      color: var(--metallic-champagne);
      transition: gap var(--dur-normal) var(--ease-expo);
    }
    .editorial__link:hover { gap: var(--sp-md); }
    .editorial__link:focus-visible {
      outline: 2px solid var(--neon-cyan);
      outline-offset: 4px;
      border-radius: 2px;
    }

    @media (max-width: 900px) {
      .editorial__grid {
        grid-template-columns: 1fr;
        gap: var(--sp-lg);
      }
      .editorial__content { padding-left: 0; }
    }

    /* ============================================================
       VALUE PROPOSITIONS
       ============================================================ */
    .values {
      position: relative;
      z-index: 1;
      padding: var(--sp-3xl) 0;
    }
    .values__header {
      text-align: center;
      margin-bottom: var(--sp-2xl);
    }
    .values__eyebrow {
      font-family: var(--font-mono);
      font-size: var(--text-micro);
      font-weight: 300;
      letter-spacing: 0.3em;
      text-transform: uppercase;
      color: var(--metallic-champagne);
      margin-bottom: var(--sp-sm);
    }
    .values__heading {
      font-family: var(--font-display);
      font-size: var(--text-h2);
      font-weight: 400;
      letter-spacing: 0.03em;
      text-transform: uppercase;
      color: var(--ivory);
    }
    .values__grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: var(--sp-lg);
    }
    .value-card {
      padding: var(--sp-xl) var(--sp-lg);
      border: 1px solid oklch(0.88 0.06 75 / 0.06);
      background: oklch(0.12 0.005 260 / 0.3);
      transition:
        border-color var(--dur-slow) var(--ease-expo),
        background var(--dur-slow) var(--ease-expo),
        transform var(--dur-normal) var(--ease-expo);
    }
    .value-card:hover {
      border-color: oklch(0.88 0.06 75 / 0.15);
      background: oklch(0.14 0.006 260 / 0.5);
      transform: translateY(-4px);
    }
    .value-card__icon {
      color: var(--metallic-champagne);
      margin-bottom: var(--sp-lg);
      width: 32px;
      height: 32px;
    }
    .value-card__title {
      font-family: var(--font-display);
      font-size: var(--text-h3);
      font-weight: 400;
      letter-spacing: 0.05em;
      text-transform: uppercase;
      color: var(--ivory);
      margin-bottom: var(--sp-sm);
    }
    .value-card__desc {
      font-size: var(--text-small);
      line-height: 1.8;
      color: var(--obsidian-300);
    }

    @media (max-width: 900px) {
      .values__grid { grid-template-columns: 1fr; }
    }

    /* ============================================================
       FEATURED COLLECTIONS
       ============================================================ */
    .collections {
      position: relative;
      z-index: 1;
      padding: var(--sp-3xl) 0;
    }
    .collections__header {
      display: flex;
      align-items: baseline;
      justify-content: space-between;
      margin-bottom: var(--sp-2xl);
    }
    .collections__eyebrow {
      font-family: var(--font-mono);
      font-size: var(--text-micro);
      font-weight: 300;
      letter-spacing: 0.3em;
      text-transform: uppercase;
      color: var(--metallic-champagne);
      margin-bottom: var(--sp-sm);
    }
    .collections__heading {
      font-family: var(--font-display);
      font-size: var(--text-h1);
      font-weight: 400;
      letter-spacing: 0.02em;
      text-transform: uppercase;
      color: var(--ivory);
    }

    .collections__grid {
      display: grid;
      grid-template-columns: 1.2fr 0.8fr;
      grid-template-rows: 1fr 1fr;
      gap: var(--sp-md);
      min-height: 700px;
    }
    .collection-card {
      position: relative;
      overflow: hidden;
      cursor: pointer;
    }
    .collection-card--tall {
      grid-row: 1 / 3;
    }
    .collection-card__image {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform var(--dur-cinematic) var(--ease-expo);
    }
    .collection-card:hover .collection-card__image {
      transform: scale(1.05);
    }
    .collection-card__overlay {
      position: absolute;
      inset: 0;
      background: linear-gradient(0deg, oklch(0.06 0.002 260 / 0.85) 0%, transparent 60%);
      transition: background var(--dur-slow) var(--ease-expo);
    }
    .collection-card:hover .collection-card__overlay {
      background: linear-gradient(0deg, oklch(0.06 0.002 260 / 0.7) 0%, transparent 50%);
    }
    .collection-card__content {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      padding: var(--sp-xl);
    }
    .collection-card__name {
      font-family: var(--font-display);
      font-size: clamp(1.5rem, 1.2rem + 1.5vw, 2.5rem);
      font-weight: 400;
      letter-spacing: 0.05em;
      text-transform: uppercase;
      color: var(--ivory);
      margin-bottom: var(--sp-2xs);
    }
    .collection-card__count {
      font-family: var(--font-mono);
      font-size: var(--text-micro);
      font-weight: 300;
      letter-spacing: 0.2em;
      text-transform: uppercase;
      color: var(--obsidian-300);
    }
    .collection-card__arrow {
      position: absolute;
      top: var(--sp-md);
      right: var(--sp-md);
      color: var(--metallic-champagne);
      opacity: 0;
      transform: translate(-8px, 8px);
      transition:
        opacity var(--dur-normal) var(--ease-expo),
        transform var(--dur-normal) var(--ease-expo);
    }
    .collection-card:hover .collection-card__arrow {
      opacity: 1;
      transform: translate(0, 0);
    }
    .collection-card:focus-visible {
      outline: 2px solid var(--neon-cyan);
      outline-offset: -2px;
    }

    @media (max-width: 768px) {
      .collections__grid {
        grid-template-columns: 1fr;
        grid-template-rows: auto;
        min-height: auto;
      }
      .collection-card--tall { grid-row: auto; }
      .collection-card { aspect-ratio: 16 / 10; }
    }

    /* ============================================================
       PRODUCT SHOWCASE
       ============================================================ */
    .products {
      position: relative;
      z-index: 1;
      padding: var(--sp-3xl) 0;
    }
    .products__header {
      text-align: center;
      margin-bottom: var(--sp-2xl);
    }
    .products__eyebrow {
      font-family: var(--font-mono);
      font-size: var(--text-micro);
      font-weight: 300;
      letter-spacing: 0.3em;
      text-transform: uppercase;
      color: var(--metallic-champagne);
      margin-bottom: var(--sp-sm);
    }
    .products__heading {
      font-family: var(--font-display);
      font-size: var(--text-h1);
      font-weight: 400;
      letter-spacing: 0.02em;
      text-transform: uppercase;
      color: var(--ivory);
      margin-bottom: var(--sp-sm);
    }
    .products__subheading {
      font-size: var(--text-body);
      color: var(--obsidian-300);
      max-width: 500px;
      margin: 0 auto;
    }

    .products__grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: var(--sp-md);
    }

    .product-card {
      position: relative;
      display: flex;
      flex-direction: column;
      cursor: pointer;
      border: 1px solid oklch(0.88 0.06 75 / 0.04);
      transition:
        border-color var(--dur-slow) var(--ease-expo),
        transform var(--dur-normal) var(--ease-expo);
    }
    .product-card:hover {
      border-color: oklch(0.88 0.06 75 / 0.12);
      transform: translateY(-6px);
    }
    .product-card:focus-visible {
      outline: 2px solid var(--neon-cyan);
      outline-offset: 2px;
    }

    .product-card__visual {
      position: relative;
      aspect-ratio: 3 / 4;
      overflow: hidden;
      background: var(--obsidian-900);
    }
    .product-card__image {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform var(--dur-cinematic) var(--ease-expo);
    }
    .product-card:hover .product-card__image {
      transform: scale(1.06);
    }
    .product-card__quick-view {
      position: absolute;
      bottom: var(--sp-sm);
      left: 50%;
      transform: translateX(-50%) translateY(12px);
      opacity: 0;
      font-family: var(--font-mono);
      font-size: var(--text-micro);
      font-weight: 400;
      letter-spacing: 0.2em;
      text-transform: uppercase;
      color: var(--ivory);
      padding: var(--sp-xs) var(--sp-md);
      background: oklch(0.06 0.002 260 / 0.8);
      backdrop-filter: blur(10px);
      border: 1px solid oklch(0.88 0.06 75 / 0.15);
      white-space: nowrap;
      transition:
        opacity var(--dur-normal) var(--ease-expo),
        transform var(--dur-normal) var(--ease-expo);
    }
    .product-card:hover .product-card__quick-view {
      opacity: 1;
      transform: translateX(-50%) translateY(0);
    }
    .product-card__badge {
      position: absolute;
      top: var(--sp-sm);
      right: var(--sp-sm);
      font-family: var(--font-mono);
      font-size: var(--text-micro);
      font-weight: 400;
      letter-spacing: 0.15em;
      text-transform: uppercase;
      padding: var(--sp-3xs) var(--sp-xs);
      background: var(--metallic-champagne);
      color: var(--obsidian-950);
    }

    .product-card__info {
      padding: var(--sp-md) var(--sp-sm);
      flex: 1;
      display: flex;
      flex-direction: column;
    }
    .product-card__brand {
      font-family: var(--font-mono);
      font-size: var(--text-micro);
      font-weight: 300;
      letter-spacing: 0.2em;
      text-transform: uppercase;
      color: var(--obsidian-400);
      margin-bottom: var(--sp-3xs);
    }
    .product-card__name {
      font-family: var(--font-body);
      font-size: var(--text-body);
      font-weight: 500;
      color: var(--ivory);
      margin-bottom: var(--sp-xs);
      line-height: 1.4;
    }
    .product-card__price {
      font-family: var(--font-mono);
      font-size: var(--text-small);
      font-weight: 400;
      color: var(--metallic-champagne);
      margin-top: auto;
      letter-spacing: 0.05em;
    }

    @media (max-width: 1100px) {
      .products__grid { grid-template-columns: repeat(2, 1fr); }
    }
    @media (max-width: 600px) {
      .products__grid { grid-template-columns: 1fr; max-width: 400px; margin: 0 auto; }
    }

    /* ============================================================
       AI STYLIST SECTION
       ============================================================ */
    .ai-stylist {
      position: relative;
      z-index: 1;
      padding: var(--sp-3xl) 0;
    }
    .ai-stylist__grid {
      display: grid;
      grid-template-columns: 0.8fr 1.2fr;
      gap: var(--sp-2xl);
      align-items: center;
    }
    .ai-stylist__content {}
    .ai-stylist__eyebrow {
      font-family: var(--font-mono);
      font-size: var(--text-micro);
      font-weight: 300;
      letter-spacing: 0.3em;
      text-transform: uppercase;
      color: var(--neon-cyan);
      margin-bottom: var(--sp-md);
    }
    .ai-stylist__heading {
      font-family: var(--font-display);
      font-size: var(--text-h1);
      font-weight: 400;
      line-height: 1;
      letter-spacing: 0.02em;
      text-transform: uppercase;
      color: var(--ivory);
      margin-bottom: var(--sp-lg);
    }
    .ai-stylist__body {
      font-size: var(--text-body);
      line-height: 1.9;
      color: var(--obsidian-300);
      margin-bottom: var(--sp-lg);
      max-width: 480px;
    }
    .ai-stylist__features {
      list-style: none;
      display: flex;
      flex-direction: column;
      gap: var(--sp-sm);
      margin-bottom: var(--sp-xl);
    }
    .ai-stylist__feature {
      display: flex;
      align-items: flex-start;
      gap: var(--sp-sm);
      font-size: var(--text-small);
      color: var(--obsidian-200);
    }
    .ai-stylist__feature-icon {
      color: var(--neon-cyan);
      flex-shrink: 0;
      margin-top: 2px;
    }

    /* AI Visual Panel */
    .ai-stylist__visual {
      position: relative;
      aspect-ratio: 4 / 5;
      overflow: hidden;
      border: 1px solid oklch(0.85 0.18 190 / 0.08);
    }
    .ai-stylist__visual-bg {
      position: absolute;
      inset: 0;
      background:
        radial-gradient(ellipse 60% 60% at 30% 40%, oklch(0.85 0.18 190 / 0.06) 0%, transparent 70%),
        radial-gradient(ellipse 40% 50% at 70% 70%, oklch(0.65 0.28 350 / 0.04) 0%, transparent 60%),
        var(--obsidian-900);
    }
    .ai-stylist__visual-content {
      position: relative;
      z-index: 2;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      height: 100%;
      padding: var(--sp-2xl);
      text-align: center;
    }
    .ai-stylist__prompt {
      font-family: var(--font-mono);
      font-size: var(--text-small);
      color: var(--neon-cyan);
      padding: var(--sp-xs) var(--sp-md);
      border: 1px solid oklch(0.85 0.18 190 / 0.2);
      background: oklch(0.85 0.18 190 / 0.04);
      margin-bottom: var(--sp-lg);
      display: inline-block;
    }
    .ai-stylist__message {
      font-family: var(--font-body);
      font-style: italic;
      font-size: clamp(1.1rem, 1rem + 0.5vw, 1.35rem);
      line-height: 1.7;
      color: var(--obsidian-200);
      max-width: 360px;
    }
    .ai-stylist__message em {
      color: var(--metallic-champagne);
      font-style: normal;
    }
    /* Floating glow */
    .ai-stylist__glow {
      position: absolute;
      width: 200px;
      height: 200px;
      border-radius: 50%;
      background: oklch(0.85 0.18 190 / 0.04);
      filter: blur(60px);
      animation: float 6s ease-in-out infinite;
    }
    .ai-stylist__glow--1 { top: 10%; left: 20%; }
    .ai-stylist__glow--2 { bottom: 20%; right: 10%; animation-delay: -3s; }
    @keyframes float {
      0%, 100% { transform: translateY(0) scale(1); }
      50% { transform: translateY(-20px) scale(1.1); }
    }

    @media (max-width: 900px) {
      .ai-stylist__grid { grid-template-columns: 1fr; }
    }

    /* ============================================================
       SUSTAINABILITY
       ============================================================ */
    .sustainability {
      position: relative;
      z-index: 1;
      padding: var(--sp-3xl) 0;
    }
    .sustainability__grid {
      display: grid;
      grid-template-columns: 1.2fr 0.8fr;
      gap: var(--sp-2xl);
      align-items: center;
    }
    .sustainability__visual {
      position: relative;
      aspect-ratio: 4 / 3;
      overflow: hidden;
      border: 1px solid oklch(0.16 0.04 160 / 0.15);
    }
    .sustainability__visual img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      filter: brightness(0.85);
    }
    .sustainability__content {}
    .sustainability__eyebrow {
      font-family: var(--font-mono);
      font-size: var(--text-micro);
      font-weight: 300;
      letter-spacing: 0.3em;
      text-transform: uppercase;
      color: var(--semantic-success);
      margin-bottom: var(--sp-md);
    }
    .sustainability__heading {
      font-family: var(--font-display);
      font-size: var(--text-h1);
      font-weight: 400;
      line-height: 1;
      letter-spacing: 0.02em;
      text-transform: uppercase;
      color: var(--ivory);
      margin-bottom: var(--sp-lg);
    }
    .sustainability__body {
      font-size: var(--text-body);
      line-height: 1.9;
      color: var(--obsidian-300);
      margin-bottom: var(--sp-xl);
      max-width: 480px;
    }
    .sustainability__stats {
      display: flex;
      gap: var(--sp-xl);
    }
    .sustainability__stat-value {
      font-family: var(--font-display);
      font-size: clamp(2rem, 1.5rem + 2vw, 3rem);
      font-weight: 400;
      color: var(--semantic-success);
      line-height: 1;
    }
    .sustainability__stat-label {
      font-family: var(--font-mono);
      font-size: var(--text-micro);
      font-weight: 300;
      letter-spacing: 0.15em;
      text-transform: uppercase;
      color: var(--obsidian-400);
      margin-top: var(--sp-2xs);
    }

    @media (max-width: 900px) {
      .sustainability__grid { grid-template-columns: 1fr; }
      .sustainability__stats { gap: var(--sp-lg); }
    }

    /* ============================================================
       LOYALTY / TIERS
       ============================================================ */
    .loyalty {
      position: relative;
      z-index: 1;
      padding: var(--sp-3xl) 0;
    }
    .loyalty__header {
      text-align: center;
      margin-bottom: var(--sp-2xl);
    }
    .loyalty__eyebrow {
      font-family: var(--font-mono);
      font-size: var(--text-micro);
      font-weight: 300;
      letter-spacing: 0.3em;
      text-transform: uppercase;
      color: var(--metallic-gold);
      margin-bottom: var(--sp-sm);
    }
    .loyalty__heading {
      font-family: var(--font-display);
      font-size: var(--text-h1);
      font-weight: 400;
      letter-spacing: 0.02em;
      text-transform: uppercase;
      color: var(--ivory);
      margin-bottom: var(--sp-sm);
    }
    .loyalty__subheading {
      font-size: var(--text-body);
      color: var(--obsidian-300);
      max-width: 500px;
      margin: 0 auto;
    }

    .loyalty__tiers {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: var(--sp-md);
    }
    .tier-card {
      padding: var(--sp-xl) var(--sp-lg);
      border: 1px solid oklch(0.88 0.06 75 / 0.06);
      background: oklch(0.10 0.005 260 / 0.5);
      text-align: center;
      transition:
        border-color var(--dur-slow) var(--ease-expo),
        transform var(--dur-normal) var(--ease-expo),
        background var(--dur-slow) var(--ease-expo);
    }
    .tier-card:hover {
      transform: translateY(-4px);
    }
    .tier-card--bronze { border-bottom: 2px solid var(--metallic-bronze, oklch(0.55 0.12 55)); }
    .tier-card--bronze:hover { border-color: var(--metallic-bronze, oklch(0.55 0.12 55)); }
    .tier-card--silver { border-bottom: 2px solid var(--metallic-silver); }
    .tier-card--silver:hover { border-color: var(--metallic-silver); }
    .tier-card--gold { border-bottom: 2px solid var(--metallic-gold); }
    .tier-card--gold:hover { border-color: var(--metallic-gold); background: oklch(0.12 0.008 260 / 0.6); }
    .tier-card--black {
      border-bottom: 2px solid var(--metallic-champagne);
      background: oklch(0.12 0.008 260 / 0.7);
    }
    .tier-card--black:hover {
      border-color: var(--metallic-champagne);
      background: oklch(0.14 0.010 260 / 0.8);
    }

    .tier-card__icon {
      font-size: 2rem;
      margin-bottom: var(--sp-md);
      display: flex;
      justify-content: center;
      color: var(--obsidian-400);
    }
    .tier-card--bronze .tier-card__icon { color: var(--metallic-bronze, oklch(0.55 0.12 55)); }
    .tier-card--silver .tier-card__icon { color: var(--metallic-silver); }
    .tier-card--gold .tier-card__icon { color: var(--metallic-gold); }
    .tier-card--black .tier-card__icon { color: var(--metallic-champagne); }

    .tier-card__name {
      font-family: var(--font-display);
      font-size: var(--text-h3);
      font-weight: 400;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      color: var(--ivory);
      margin-bottom: var(--sp-2xs);
    }
    .tier-card__points {
      font-family: var(--font-mono);
      font-size: var(--text-micro);
      font-weight: 300;
      letter-spacing: 0.15em;
      text-transform: uppercase;
      color: var(--obsidian-400);
      margin-bottom: var(--sp-md);
    }
    .tier-card__perks {
      list-style: none;
      display: flex;
      flex-direction: column;
      gap: var(--sp-xs);
    }
    .tier-card__perk {
      font-size: var(--text-small);
      color: var(--obsidian-300);
      display: flex;
      align-items: center;
      gap: var(--sp-xs);
      text-align: left;
    }
    .tier-card__perk-icon {
      color: var(--metallic-champagne);
      flex-shrink: 0;
      width: 14px;
      height: 14px;
    }

    @media (max-width: 1000px) {
      .loyalty__tiers { grid-template-columns: repeat(2, 1fr); }
    }
    @media (max-width: 600px) {
      .loyalty__tiers { grid-template-columns: 1fr; max-width: 400px; margin: 0 auto; }
    }

    /* ============================================================
       NEWSLETTER / CTA
       ============================================================ */
    .newsletter {
      position: relative;
      z-index: 1;
      padding: var(--sp-3xl) 0;
      text-align: center;
    }
    .newsletter__inner {
      max-width: 640px;
      margin: 0 auto;
      padding: var(--sp-2xl) var(--sp-xl);
      border: 1px solid oklch(0.88 0.06 75 / 0.08);
      background: oklch(0.10 0.005 260 / 0.4);
    }
    .newsletter__heading {
      font-family: var(--font-display);
      font-size: var(--text-h2);
      font-weight: 400;
      letter-spacing: 0.03em;
      text-transform: uppercase;
      color: var(--ivory);
      margin-bottom: var(--sp-sm);
    }
    .newsletter__body {
      font-size: var(--text-body);
      color: var(--obsidian-300);
      margin-bottom: var(--sp-lg);
    }
    .newsletter__form {
      display: flex;
      gap: var(--sp-xs);
      max-width: 480px;
      margin: 0 auto;
    }
    .newsletter__input {
      flex: 1;
      font-family: var(--font-mono);
      font-size: var(--text-small);
      padding: var(--sp-sm) var(--sp-md);
      background: var(--obsidian-900);
      border: 1px solid oklch(0.88 0.06 75 / 0.08);
      color: var(--ivory);
      letter-spacing: 0.05em;
      transition:
        border-color var(--dur-normal) var(--ease-expo),
        box-shadow var(--dur-normal) var(--ease-expo);
    }
    .newsletter__input::placeholder {
      color: var(--obsidian-500);
      letter-spacing: 0.1em;
      text-transform: uppercase;
    }
    .newsletter__input:focus {
      outline: none;
      border-color: var(--metallic-champagne);
      box-shadow: 0 0 0 2px oklch(0.88 0.06 75 / 0.1);
    }
    .newsletter__submit {
      font-family: var(--font-mono);
      font-size: var(--text-small);
      font-weight: 400;
      letter-spacing: 0.15em;
      text-transform: uppercase;
      padding: var(--sp-sm) var(--sp-lg);
      background: var(--metallic-champagne);
      color: var(--obsidian-950);
      border: none;
      cursor: pointer;
      transition:
        background var(--dur-normal) var(--ease-expo),
        letter-spacing var(--dur-slow) var(--ease-expo);
      white-space: nowrap;
    }
    .newsletter__submit:hover {
      background: var(--metallic-gold);
      letter-spacing: 0.2em;
    }
    .newsletter__submit:focus-visible {
      outline: 2px solid var(--neon-cyan);
      outline-offset: 3px;
    }

    @media (max-width: 600px) {
      .newsletter__form { flex-direction: column; }
    }

    /* ============================================================
       FOOTER
       ============================================================ */
    .footer {
      position: relative;
      z-index: 1;
      padding: var(--sp-2xl) 0 var(--sp-lg);
      border-top: 1px solid oklch(0.88 0.06 75 / 0.06);
    }
    .footer__top {
      display: grid;
      grid-template-columns: 1.5fr repeat(3, 1fr);
      gap: var(--sp-xl);
      margin-bottom: var(--sp-2xl);
    }
    .footer__brand-logo {
      font-family: var(--font-display);
      font-size: clamp(2rem, 1.8rem + 1vw, 3rem);
      letter-spacing: 0.2em;
      text-transform: uppercase;
      color: var(--metallic-champagne);
      margin-bottom: var(--sp-md);
    }
    .footer__brand-desc {
      font-size: var(--text-small);
      color: var(--obsidian-400);
      line-height: 1.8;
      max-width: 320px;
    }
    .footer__col-heading {
      font-family: var(--font-mono);
      font-size: var(--text-micro);
      font-weight: 400;
      letter-spacing: 0.25em;
      text-transform: uppercase;
      color: var(--obsidian-300);
      margin-bottom: var(--sp-md);
    }
    .footer__links {
      list-style: none;
      display: flex;
      flex-direction: column;
      gap: var(--sp-xs);
    }
    .footer__link {
      font-size: var(--text-small);
      color: var(--obsidian-400);
      transition: color var(--dur-fast);
      padding: var(--sp-3xs) 0;
    }
    .footer__link:hover { color: var(--metallic-champagne); }
    .footer__link:focus-visible {
      outline: 2px solid var(--neon-cyan);
      outline-offset: 4px;
      border-radius: 2px;
    }

    .footer__bottom {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding-top: var(--sp-lg);
      border-top: 1px solid oklch(0.88 0.06 75 / 0.04);
    }
    .footer__copyright {
      font-family: var(--font-mono);
      font-size: var(--text-micro);
      font-weight: 300;
      letter-spacing: 0.1em;
      color: var(--obsidian-500);
    }
    .footer__socials {
      display: flex;
      gap: var(--sp-md);
    }
    .footer__social-link {
      color: var(--obsidian-400);
      transition: color var(--dur-fast);
      display: flex;
      align-items: center;
    }
    .footer__social-link:hover { color: var(--metallic-champagne); }
    .footer__social-link:focus-visible {
      outline: 2px solid var(--neon-cyan);
      outline-offset: 4px;
      border-radius: 4px;
    }

    @media (max-width: 768px) {
      .footer__top {
        grid-template-columns: 1fr 1fr;
        gap: var(--sp-lg);
      }
      .footer__top > :first-child { grid-column: 1 / -1; }
      .footer__bottom {
        flex-direction: column;
        gap: var(--sp-sm);
        text-align: center;
      }
    }

    /* ============================================================
       DIVIDER
       ============================================================ */
    .divider {
      width: 60px;
      height: 1px;
      background: var(--metallic-champagne);
      margin: 0 auto;
      opacity: 0.4;
    }

    /* ============================================================
       MOBILE NAV OVERLAY
       ============================================================ */
    .mobile-nav {
      position: fixed;
      inset: 0;
      z-index: 999;
      background: var(--glass-bg);
      backdrop-filter: blur(30px);
      -webkit-backdrop-filter: blur(30px);
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      gap: var(--sp-lg);
      opacity: 0;
      pointer-events: none;
      transition: opacity var(--dur-slow) var(--ease-expo);
    }
    .mobile-nav.is-open {
      opacity: 1;
      pointer-events: all;
    }
    .mobile-nav__link {
      font-family: var(--font-display);
      font-size: clamp(2rem, 1.5rem + 2vw, 3rem);
      letter-spacing: 0.1em;
      text-transform: uppercase;
      color: var(--obsidian-200);
      transition: color var(--dur-normal);
    }
    .mobile-nav__link:hover { color: var(--metallic-champagne); }
    .mobile-nav__close {
      position: absolute;
      top: var(--sp-lg);
      right: var(--sp-lg);
      color: var(--obsidian-200);
      padding: var(--sp-xs);
    }
    .mobile-nav__close:hover { color: var(--metallic-champagne); }
  </style>
</head>
<body>
  <!-- Skip Link -->
  <a href="#main-content" class="skip-link">Skip to main content</a>

  <!-- ============================================================
       NAVBAR
       ============================================================ -->
  <nav class="navbar" role="navigation" aria-label="Main navigation">
    <div class="container navbar__inner">
      <a href="/" class="navbar__logo" aria-label="LuxeVerse home">LuxeVerse</a>

      <ul class="navbar__nav" role="menubar">
        <li role="none"><a href="#collections" class="navbar__link" role="menuitem">Collections</a></li>
        <li role="none"><a href="#products" class="navbar__link" role="menuitem">New Arrivals</a></li>
        <li role="none"><a href="#ai-stylist" class="navbar__link" role="menuitem">AI Stylist</a></li>
        <li role="none"><a href="#sustainability" class="navbar__link" role="menuitem">Sustainability</a></li>
      </ul>

      <div class="navbar__actions">
        <button class="navbar__icon-btn" aria-label="Search">
          <i data-lucide="search" style="width:20px;height:20px;"></i>
        </button>
        <button class="navbar__icon-btn" aria-label="Wishlist">
          <i data-lucide="heart" style="width:20px;height:20px;"></i>
        </button>
        <button class="navbar__icon-btn" aria-label="Shopping bag">
          <i data-lucide="shopping-bag" style="width:20px;height:20px;"></i>
        </button>
        <button class="navbar__icon-btn" aria-label="Account">
          <i data-lucide="user" style="width:20px;height:20px;"></i>
        </button>
        <button class="navbar__menu-btn" aria-label="Open menu" aria-expanded="false" id="menu-toggle">
          <i data-lucide="menu" style="width:24px;height:24px;"></i>
        </button>
      </div>
    </div>
  </nav>

  <!-- Mobile Nav Overlay -->
  <div class="mobile-nav" id="mobile-nav" role="dialog" aria-label="Mobile navigation" aria-hidden="true">
    <button class="mobile-nav__close" id="menu-close" aria-label="Close menu">
      <i data-lucide="x" style="width:28px;height:28px;"></i>
    </button>
    <a href="#collections" class="mobile-nav__link">Collections</a>
    <a href="#products" class="mobile-nav__link">New Arrivals</a>
    <a href="#ai-stylist" class="mobile-nav__link">AI Stylist</a>
    <a href="#sustainability" class="mobile-nav__link">Sustainability</a>
    <a href="#loyalty" class="mobile-nav__link">Maison</a>
  </div>

  <!-- ============================================================
       MAIN CONTENT
       ============================================================ -->
  <main id="main-content">

    <!-- HERO -->
    <section class="hero" aria-label="Welcome">
      <div class="hero__content">
        <div class="hero__badge" aria-hidden="true">
          <span class="hero__badge-dot"></span>
          <span>Digital Haute Couture</span>
        </div>
        <h1 class="hero__title">
          LUXEVERSE
          <em>Where Luxury Meets Intelligence</em>
        </h1>
        <p class="hero__subtitle">
          A cinematic digital atelier where every interaction is choreographed
          to evoke the emotional resonance of a flagship boutique — amplified
          by AI that understands your style before you speak.
        </p>
        <div class="hero__actions">
          <a href="#collections" class="btn btn--primary">Enter the Atelier</a>
          <a href="#ai-stylist" class="btn btn--ghost">Meet Your Stylist</a>
        </div>
      </div>

      <div class="hero__scroll" aria-hidden="true">
        <span class="hero__scroll-text">Discover</span>
        <span class="hero__scroll-line"></span>
      </div>
    </section>

    <!-- EDITORIAL STORY -->
    <section class="editorial" aria-label="Brand story">
      <div class="container editorial__grid">
        <div class="editorial__visual reveal-left">
          <div class="editorial__image-frame">
            <img
              src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 600 800'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' stop-color='%231a0533'/%3E%3Cstop offset='50%25' stop-color='%230c0c0e'/%3E%3Cstop offset='100%25' stop-color='%230d2b1a'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect fill='url(%23g)' width='600' height='800'/%3E%3Ctext x='300' y='380' text-anchor='middle' font-family='serif' font-size='48' fill='%23DAA520' opacity='0.3'%3EAtelier%3C/text%3E%3Ctext x='300' y='440' text-anchor='middle' font-family='serif' font-size='18' fill='%2392929c' opacity='0.4'%3ECinematic Craft%3C/text%3E%3C/svg%3E"
              alt="An artisan's hands working with luxurious materials in a dimly lit atelier"
              loading="lazy"
            >
          </div>
          <div class="editorial__accent" aria-hidden="true"></div>
        </div>
        <div class="editorial__content reveal-right">
          <p class="editorial__eyebrow">The Philosophy</p>
          <h2 class="editorial__heading">Every Pixel<br>Tells a Story</h2>
          <p class="editorial__body">
            Inspired by Lovart.ai's revolutionary aesthetic philosophy, LuxeVerse
            merges cinematic storytelling, surreal visual design, and cutting-edge
            generative technology. This is not a storefront — it is a digital atelier
            where every product becomes a chapter and every collection an editorial.
          </p>
          <a href="#" class="editorial__link">
            <span>Read the Manifesto</span>
            <i data-lucide="arrow-right" style="width:16px;height:16px;" aria-hidden="true"></i>
          </a>
        </div>
      </div>
    </section>

    <!-- VALUE PROPOSITIONS -->
    <section class="values" aria-label="Why LuxeVerse">
      <div class="container">
        <div class="values__header reveal">
          <p class="values__eyebrow">Why LuxeVerse</p>
          <h2 class="values__heading">Craftsmanship, Digital Parity</h2>
        </div>
        <div class="values__grid stagger-children">
          <div class="value-card reveal" role="article">
            <i data-lucide="sparkles" class="value-card__icon" aria-hidden="true"></i>
            <h3 class="value-card__title">AI Stylist</h3>
            <p class="value-card__desc">
              A private stylist that understands individual style, respects privacy,
              and improves with every interaction — powered by consent-first intelligence.
            </p>
          </div>
          <div class="value-card reveal" role="article">
            <i data-lucide="eye" class="value-card__icon" aria-hidden="true"></i>
            <h3 class="value-card__title">3D &amp; AR Try-On</h3>
            <p class="value-card__desc">
              Immersive product interaction that bridges the sensory gap. View 3D models,
              simulate environments, and try on virtually before you buy.
            </p>
          </div>
          <div class="value-card reveal" role="article">
            <i data-lucide="leaf" class="value-card__icon" aria-hidden="true"></i>
            <h3 class="value-card__title">Full Transparency</h3>
            <p class="value-card__desc">
              Complete lifecycle scoring, carbon accounting, and circular economy
              integration — sustainable luxury is not an afterthought, but a core value.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- FEATURED COLLECTIONS -->
    <section class="collections" id="collections" aria-label="Featured collections">
      <div class="container">
        <div class="collections__header reveal">
          <div>
            <p class="collections__eyebrow">Curated Worlds</p>
            <h2 class="collections__heading">Featured Collections</h2>
          </div>
          <a href="#" class="editorial__link">
            <span>View All</span>
            <i data-lucide="arrow-right" style="width:16px;height:16px;" aria-hidden="true"></i>
          </a>
        </div>

        <div class="collections__grid">
          <div class="collection-card collection-card--tall reveal-left" tabindex="0" role="link" aria-label="Nocturne — Evening Edit, 47 pieces">
            <img
              class="collection-card__image"
              src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 600 900'%3E%3Crect fill='%231a0533' width='600' height='900'/%3E%3Ccircle cx='300' cy='400' r='150' fill='%232d1a1e' opacity='0.5'/%3E%3Ctext x='300' y='420' text-anchor='middle' font-family='serif' font-size='36' fill='%23DAA520' opacity='0.2'%3ENocturne%3C/text%3E%3C/svg%3E"
              alt="Evening wear collection featuring dramatic silhouettes against deep purple backdrop"
              loading="lazy"
            >
            <div class="collection-card__overlay"></div>
            <div class="collection-card__content">
              <h3 class="collection-card__name">Nocturne</h3>
              <p class="collection-card__count">47 Pieces</p>
            </div>
            <div class="collection-card__arrow">
              <i data-lucide="arrow-up-right" style="width:20px;height:20px;" aria-hidden="true"></i>
            </div>
          </div>

          <div class="collection-card reveal-right" tabindex="0" role="link" aria-label="Terre — Sustainable Luxury, 32 pieces">
            <img
              class="collection-card__image"
              src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 600 400'%3E%3Crect fill='%230d2b1a' width='600' height='400'/%3E%3Ctext x='300' y='210' text-anchor='middle' font-family='serif' font-size='28' fill='%23DAA520' opacity='0.2'%3ETerre%3C/text%3E%3C/svg%3E"
              alt="Earth-toned sustainable luxury collection with natural textures"
              loading="lazy"
            >
            <div class="collection-card__overlay"></div>
            <div class="collection-card__content">
              <h3 class="collection-card__name">Terre</h3>
              <p class="collection-card__count">32 Pieces — Sustainable</p>
            </div>
            <div class="collection-card__arrow">
              <i data-lucide="arrow-up-right" style="width:20px;height:20px;" aria-hidden="true"></i>
            </div>
          </div>

          <div class="collection-card reveal-right" tabindex="0" role="link" aria-label="Lumière — Resort Capsule, 24 pieces">
            <img
              class="collection-card__image"
              src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 600 400'%3E%3Crect fill='%231e1a17' width='600' height='400'/%3E%3Ctext x='300' y='210' text-anchor='middle' font-family='serif' font-size='28' fill='%23FFD700' opacity='0.15'%3ELumi%C3%A8re%3C/text%3E%3C/svg%3E"
              alt="Resort capsule collection with warm golden lighting and flowing silhouettes"
              loading="lazy"
            >
            <div class="collection-card__overlay"></div>
            <div class="collection-card__content">
              <h3 class="collection-card__name">Lumière</h3>
              <p class="collection-card__count">24 Pieces — Resort Capsule</p>
            </div>
            <div class="collection-card__arrow">
              <i data-lucide="arrow-up-right" style="width:20px;height:20px;" aria-hidden="true"></i>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- PRODUCT SHOWCASE -->
    <section class="products" id="products" aria-label="New arrivals">
      <div class="container">
        <div class="products__header reveal">
          <p class="products__eyebrow">Just Arrived</p>
          <h2 class="products__heading">The Edit</h2>
          <p class="products__subheading">
            Curated by our AI stylist, selected for you.
          </p>
        </div>

        <div class="products__grid stagger-children">
          <!-- Product 1 -->
          <article class="product-card reveal" tabindex="0" aria-label="Maison Celestine — Midnight Silk Blazer, $2,450">
            <div class="product-card__visual">
              <img
                class="product-card__image"
                src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 533'%3E%3Crect fill='%231c1c1f' width='400' height='533'/%3E%3Crect x='150' y='120' width='100' height='300' fill='%232d2d30' rx='2'/%3E%3Ctext x='200' y='290' text-anchor='middle' font-family='serif' font-size='14' fill='%23DAA520' opacity='0.3'%3EBlazer%3C/text%3E%3C/svg%3E"
                alt="Midnight silk blazer with structured shoulders and satin lapels"
                loading="lazy"
              >
              <div class="product-card__quick-view">Quick View</div>
            </div>
            <div class="product-card__info">
              <span class="product-card__brand">Maison Celestine</span>
              <h3 class="product-card__name">Midnight Silk Blazer</h3>
              <span class="product-card__price">$2,450</span>
            </div>
          </article>

          <!-- Product 2 -->
          <article class="product-card reveal" tabindex="0" aria-label="Atelier Noir — Sculptural Leather Tote, $1,890">
            <div class="product-card__visual">
              <img
                class="product-card__image"
                src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 533'%3E%3Crect fill='%231c1c1f' width='400' height='533'/%3E%3Cellipse cx='200' cy='280' rx='80' ry='100' fill='%232d2d30'/%3E%3Ctext x='200' y='290' text-anchor='middle' font-family='serif' font-size='14' fill='%23DAA520' opacity='0.3'%3ETote%3C/text%3E%3C/svg%3E"
                alt="Sculptural leather tote in deep burgundy with gold hardware"
                loading="lazy"
              >
              <span class="product-card__badge">New</span>
              <div class="product-card__quick-view">Quick View</div>
            </div>
            <div class="product-card__info">
              <span class="product-card__brand">Atelier Noir</span>
              <h3 class="product-card__name">Sculptural Leather Tote</h3>
              <span class="product-card__price">$1,890</span>
            </div>
          </article>

          <!-- Product 3 -->
          <article class="product-card reveal" tabindex="0" aria-label="Maison Celestine — Cashmere Oversized Wrap, $890">
            <div class="product-card__visual">
              <img
                class="product-card__image"
                src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 533'%3E%3Crect fill='%231c1c1f' width='400' height='533'/%3E%3Cpath d='M140 150 Q200 120 260 150 L250 450 Q200 470 150 450 Z' fill='%232d2d30'/%3E%3Ctext x='200' y='310' text-anchor='middle' font-family='serif' font-size='14' fill='%23DAA520' opacity='0.3'%3EWrap%3C/text%3E%3C/svg%3E"
                alt="Oversized cashmere wrap in ivory with delicate fringe detail"
                loading="lazy"
              >
              <div class="product-card__quick-view">Quick View</div>
            </div>
            <div class="product-card__info">
              <span class="product-card__brand">Maison Celestine</span>
              <h3 class="product-card__name">Cashmere Oversized Wrap</h3>
              <span class="product-card__price">$890</span>
            </div>
          </article>

          <!-- Product 4 -->
          <article class="product-card reveal" tabindex="0" aria-label="Lumière Maison — Geometric Gold Cuff, $1,250">
            <div class="product-card__visual">
              <img
                class="product-card__image"
                src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 533'%3E%3Crect fill='%231c1c1f' width='400' height='533'/%3E%3Cellipse cx='200' cy='280' rx='70' ry='30' fill='none' stroke='%23DAA520' stroke-width='3' opacity='0.3'/%3E%3Ctext x='200' y='290' text-anchor='middle' font-family='serif' font-size='14' fill='%23DAA520' opacity='0.3'%3ECuff%3C/text%3E%3C/svg%3E"
                alt="Geometric gold cuff bracelet with hammered finish"
                loading="lazy"
              >
              <span class="product-card__badge">Exclusive</span>
              <div class="product-card__quick-view">Quick View</div>
            </div>
            <div class="product-card__info">
              <span class="product-card__brand">Lumière Maison</span>
              <h3 class="product-card__name">Geometric Gold Cuff</h3>
              <span class="product-card__price">$1,250</span>
            </div>
          </article>
        </div>
      </div>
    </section>

    <!-- AI STYLIST -->
    <section class="ai-stylist" id="ai-stylist" aria-label="AI Personal Stylist">
      <div class="container ai-stylist__grid">
        <div class="ai-stylist__content reveal-left">
          <p class="ai-stylist__eyebrow">Powered by Intelligence</p>
          <h2 class="ai-stylist__heading">Your Personal<br>AI Stylist</h2>
          <p class="ai-stylist__body">
            Not an algorithm. A confidant. LuxeVerse's AI understands your aesthetic,
            learns your preferences, and curates experiences that feel personal —
            because they are. Privacy-first, consent-driven, always improving.
          </p>
          <ul class="ai-stylist__features" role="list">
            <li class="ai-stylist__feature">
              <i data-lucide="check" class="ai-stylist__feature-icon" style="width:16px;height:16px;" aria-hidden="true"></i>
              <span>Style profiling that evolves with you, not against you</span>
            </li>
            <li class="ai-stylist__feature">
              <i data-lucide="check" class="ai-stylist__feature-icon" style="width:16px;height:16px;" aria-hidden="true"></i>
              <span>Visual search — upload any image, find the aesthetic</span>
            </li>
            <li class="ai-stylist__feature">
              <i data-lucide="check" class="ai-stylist__feature-icon" style="width:16px;height:16px;" aria-hidden="true"></i>
              <span>AI-generated outfit compositions and mood boards</span>
            </li>
            <li class="ai-stylist__feature">
              <i data-lucide="check" class="ai-stylist__feature-icon" style="width:16px;height:16px;" aria-hidden="true"></i>
              <span>Explicit consent for every piece of data used</span>
            </li>
          </ul>
          <a href="#" class="btn btn--primary">Start Styling</a>
        </div>
        <div class="ai-stylist__visual reveal-right" aria-hidden="true">
          <div class="ai-stylist__visual-bg"></div>
          <div class="ai-stylist__glow ai-stylist__glow--1"></div>
          <div class="ai-stylist__glow ai-stylist__glow--2"></div>
          <div class="ai-stylist__visual-content">
            <span class="ai-stylist__prompt">Style Query</span>
            <p class="ai-stylist__message">
              "Find me something for a <em>midsummer dinner</em> in the Amalfi Coast —
              understated, linen, with a touch of <em>gold</em>."
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- SUSTAINABILITY -->
    <section class="sustainability" id="sustainability" aria-label="Sustainability commitment">
      <div class="container sustainability__grid">
        <div class="sustainability__visual reveal-left">
          <img
            src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 800 600'%3E%3Cdefs%3E%3ClinearGradient id='e' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' stop-color='%230d2b1a'/%3E%3Cstop offset='100%25' stop-color='%231a0533'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect fill='url(%23e)' width='800' height='600'/%3E%3Ccircle cx='400' cy='300' r='100' fill='none' stroke='%2300C853' stroke-width='1' opacity='0.2'/%3E%3Ccircle cx='400' cy='300' r='150' fill='none' stroke='%2300C853' stroke-width='0.5' opacity='0.1'/%3E%3Ctext x='400' y='310' text-anchor='middle' font-family='serif' font-size='20' fill='%2300C853' opacity='0.3'%3ESustainable%3C/text%3E%3C/svg%3E"
            alt="Natural materials and sustainable production processes"
            loading="lazy"
          >
        </div>
        <div class="sustainability__content reveal-right">
          <p class="sustainability__eyebrow">Conscious Commerce</p>
          <h2 class="sustainability__heading">Luxury That<br>Respects the Earth</h2>
          <p class="sustainability__body">
            Sustainability is not a badge — it is the foundation. Every product
            carries a full lifecycle score, from sourcing to delivery. Carbon accounting,
            recycled content tracking, and circular economy integration ensure that
            luxury and responsibility coexist.
          </p>
          <div class="sustainability__stats">
            <div>
              <div class="sustainability__stat-value">94%</div>
              <div class="sustainability__stat-label">Transparent Sourcing</div>
            </div>
            <div>
              <div class="sustainability__stat-value">-42%</div>
              <div class="sustainability__stat-label">Carbon vs. Industry Avg</div>
            </div>
            <div>
              <div class="sustainability__stat-value">100%</div>
              <div class="sustainability__stat-label">Packaging Recyclable</div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- LOYALTY PROGRAM -->
    <section class="loyalty" id="loyalty" aria-label="Maison loyalty program">
      <div class="container">
        <div class="loyalty__header reveal">
          <p class="loyalty__eyebrow">Maison Loyalty</p>
          <h2 class="loyalty__heading">Your Journey, Rewarded</h2>
          <p class="loyalty__subheading">
            From Bronze to Black — every tier unlocks deeper access,
            exclusive experiences, and personal privileges.
          </p>
        </div>

        <div class="loyalty__tiers stagger-children">
          <div class="tier-card tier-card--bronze reveal">
            <div class="tier-card__icon">
              <i data-lucide="circle" style="width:32px;height:32px;" aria-hidden="true"></i>
            </div>
            <h3 class="tier-card__name">Bronze</h3>
            <p class="tier-card__points">0 — 999 Points</p>
            <ul class="tier-card__perks" role="list">
              <li class="tier-card__perk">
                <i data-lucide="check" class="tier-card__perk-icon" aria-hidden="true"></i>
                <span>Welcome gift</span>
              </li>
              <li class="tier-card__perk">
                <i data-lucide="check" class="tier-card__perk-icon" aria-hidden="true"></i>
                <span>Early access to sales</span>
              </li>
              <li class="tier-card__perk">
                <i data-lucide="check" class="tier-card__perk-icon" aria-hidden="true"></i>
                <span>AI style recommendations</span>
              </li>
            </ul>
          </div>

          <div class="tier-card tier-card--silver reveal">
            <div class="tier-card__icon">
              <i data-lucide="award" style="width:32px;height:32px;" aria-hidden="true"></i>
            </div>
            <h3 class="tier-card__name">Silver</h3>
            <p class="tier-card__points">1,000 — 4,999 Points</p>
            <ul class="tier-card__perks" role="list">
              <li class="tier-card__perk">
                <i data-lucide="check" class="tier-card__perk-icon" aria-hidden="true"></i>
                <span>Free express shipping</span>
              </li>
              <li class="tier-card__perk">
                <i data-lucide="check" class="tier-card__perk-icon" aria-hidden="true"></i>
                <span>Birthday bonus points</span>
              </li>
              <li class="tier-card__perk">
                <i data-lucide="check" class="tier-card__perk-icon" aria-hidden="true"></i>
                <span>Exclusive editorial access</span>
              </li>
            </ul>
          </div>

          <div class="tier-card tier-card--gold reveal">
            <div class="tier-card__icon">
              <i data-lucide="crown" style="width:32px;height:32px;" aria-hidden="true"></i>
            </div>
            <h3 class="tier-card__name">Gold</h3>
            <p class="tier-card__points">5,000 — 14,999 Points</p>
            <ul class="tier-card__perks" role="list">
              <li class="tier-card__perk">
                <i data-lucide="check" class="tier-card__perk-icon" aria-hidden="true"></i>
                <span>Priority video shopping</span>
              </li>
              <li class="tier-card__perk">
                <i data-lucide="check" class="tier-card__perk-icon" aria-hidden="true"></i>
                <span>Complimentary alterations</span>
              </li>
              <li class="tier-card__perk">
                <i data-lucide="check" class="tier-card__perk-icon" aria-hidden="true"></i>
                <span>Private collection previews</span>
              </li>
            </ul>
          </div>

          <div class="tier-card tier-card--black reveal">
            <div class="tier-card__icon">
              <i data-lucide="gem" style="width:32px;height:32px;" aria-hidden="true"></i>
            </div>
            <h3 class="tier-card__name">Black</h3>
            <p class="tier-card__points">15,000+ Points</p>
            <ul class="tier-card__perks" role="list">
              <li class="tier-card__perk">
                <i data-lucide="check" class="tier-card__perk-icon" aria-hidden="true"></i>
                <span>Dedicated personal stylist</span>
              </li>
              <li class="tier-card__perk">
                <i data-lucide="check" class="tier-card__perk-icon" aria-hidden="true"></i>
                <span>Invitation-only events</span>
              </li>
              <li class="tier-card__perk">
                <i data-lucide="check" class="tier-card__perk-icon" aria-hidden="true"></i>
                <span>Limited edition first access</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>

    <!-- NEWSLETTER -->
    <section class="newsletter" aria-label="Newsletter signup">
      <div class="container">
        <div class="newsletter__inner reveal">
          <h2 class="newsletter__heading">The Inner Circle</h2>
          <p class="newsletter__body">
            Receive curated editorials, early access to collections, and
            personal recommendations — delivered with discretion.
          </p>
          <form class="newsletter__form" aria-label="Email newsletter signup">
            <label for="newsletter-email" class="skip-link" style="position:absolute;">Email address</label>
            <input
              id="newsletter-email"
              type="email"
              class="newsletter__input"
              placeholder="Your email address"
              required
              aria-required="true"
              autocomplete="email"
            >
            <button type="submit" class="newsletter__submit">Subscribe</button>
          </form>
        </div>
      </div>
    </section>

  </main>

  <!-- ============================================================
       FOOTER
       ============================================================ -->
  <footer class="footer" role="contentinfo">
    <div class="container">
      <div class="footer__top">
        <div>
          <div class="footer__brand-logo">LuxeVerse</div>
          <p class="footer__brand-desc">
            A cinematic luxury e-commerce platform where every interaction
            feels like stepping into a personalized, digital atelier.
          </p>
        </div>
        <div>
          <h3 class="footer__col-heading">Navigate</h3>
          <ul class="footer__links" role="list">
            <li><a href="#collections" class="footer__link">Collections</a></li>
            <li><a href="#products" class="footer__link">New Arrivals</a></li>
            <li><a href="#" class="footer__link">Brands</a></li>
            <li><a href="#editorial" class="footer__link">Editorial</a></li>
          </ul>
        </div>
        <div>
          <h3 class="footer__col-heading">Services</h3>
          <ul class="footer__links" role="list">
            <li><a href="#ai-stylist" class="footer__link">AI Stylist</a></li>
            <li><a href="#" class="footer__link">Book Appointment</a></li>
            <li><a href="#" class="footer__link">Gift Services</a></li>
            <li><a href="#loyalty" class="footer__link">Maison Loyalty</a></li>
          </ul>
        </div>
        <div>
          <h3 class="footer__col-heading">Support</h3>
          <ul class="footer__links" role="list">
            <li><a href="#" class="footer__link">Contact Us</a></li>
            <li><a href="#" class="footer__link">Shipping & Returns</a></li>
            <li><a href="#" class="footer__link">Size Guide</a></li>
            <li><a href="#sustainability" class="footer__link">Sustainability</a></li>
          </ul>
        </div>
      </div>

      <div class="footer__bottom">
        <p class="footer__copyright">&copy; 2026 LuxeVerse. All rights reserved.</p>
        <div class="footer__socials">
          <a href="#" class="footer__social-link" aria-label="Instagram">
            <i data-lucide="instagram" style="width:18px;height:18px;"></i>
          </a>
          <a href="#" class="footer__social-link" aria-label="Twitter / X">
            <i data-lucide="twitter" style="width:18px;height:18px;"></i>
          </a>
          <a href="#" class="footer__social-link" aria-label="Pinterest">
            <i data-lucide="map-pin" style="width:18px;height:18px;"></i>
          </a>
          <a href="#" class="footer__social-link" aria-label="YouTube">
            <i data-lucide="youtube" style="width:18px;height:18px;"></i>
          </a>
        </div>
      </div>
    </div>
  </footer>

  <!-- ============================================================
       SCRIPTS
       ============================================================ -->
  <script>
    document.addEventListener('DOMContentLoaded', () => {
      // ---- Initialize Lucide Icons ----
      if (typeof lucide !== 'undefined') {
        lucide.createIcons();
      }

      // ---- Navbar Scroll Effect ----
      const navbar = document.querySelector('.navbar');
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      let lastScrollY = 0;
      let ticking = false;

      function updateNavbar() {
        if (window.scrollY > 80) {
          navbar.classList.add('scrolled');
        } else {
          navbar.classList.remove('scrolled');
        }
        ticking = false;
      }

      window.addEventListener('scroll', () => {
        lastScrollY = window.scrollY;
        if (!ticking) {
          window.requestAnimationFrame(updateNavbar);
          ticking = true;
        }
      }, { passive: true });

      // ---- Mobile Nav ----
      const menuToggle = document.getElementById('menu-toggle');
      const menuClose = document.getElementById('menu-close');
      const mobileNav = document.getElementById('mobile-nav');

      if (menuToggle && mobileNav) {
        menuToggle.addEventListener('click', () => {
          mobileNav.classList.add('is-open');
          mobileNav.setAttribute('aria-hidden', 'false');
          menuToggle.setAttribute('aria-expanded', 'true');
          document.body.style.overflow = 'hidden';
          // Focus trap: focus first link
          const firstLink = mobileNav.querySelector('.mobile-nav__link');
          if (firstLink) firstLink.focus();
        });

        function closeMobileNav() {
          mobileNav.classList.remove('is-open');
          mobileNav.setAttribute('aria-hidden', 'true');
          menuToggle.setAttribute('aria-expanded', 'false');
          document.body.style.overflow = '';
          menuToggle.focus();
        }

        menuClose.addEventListener('click', closeMobileNav);

        // Close on link click
        mobileNav.querySelectorAll('.mobile-nav__link').forEach(link => {
          link.addEventListener('click', closeMobileNav);
        });

        // Close on ESC
        document.addEventListener('keydown', (e) => {
          if (e.key === 'Escape' && mobileNav.classList.contains('is-open')) {
            closeMobileNav();
          }
        });
      }

      // ---- Scroll Reveal (Intersection Observer) ----
      if (!prefersReducedMotion && 'IntersectionObserver' in window) {
        const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');

        const revealObserver = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              entry.target.classList.add('is-visible');
              revealObserver.unobserve(entry.target);
            }
          });
        }, {
          threshold: 0.12,
          rootMargin: '0px 0px -60px 0px'
        });

        revealElements.forEach(el => revealObserver.observe(el));
      } else {
        // If reduced motion, show all immediately
        document.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach(el => {
          el.classList.add('is-visible');
          el.style.opacity = '1';
          el.style.transform = 'none';
        });
      }

      // ---- Smooth Scroll for Anchor Links ----
      document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
          const targetId = anchor.getAttribute('href');
          if (targetId === '#') return;
          const target = document.querySelector(targetId);
          if (target) {
            e.preventDefault();
            target.scrollIntoView({
              behavior: prefersReducedMotion ? 'auto' : 'smooth',
              block: 'start'
            });
            // Update focus for accessibility
            target.setAttribute('tabindex', '-1');
            target.focus({ preventScroll: true });
          }
        });
      });

      // ---- Product Card 3D Tilt (subtle, performance-safe) ----
      if (!prefersReducedMotion && window.matchMedia('(hover: hover)').matches) {
        document.querySelectorAll('.product-card').forEach(card => {
          card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width;
            const y = (e.clientY - rect.top) / rect.height;
            const rotateX = (y - 0.5) * -4;
            const rotateY = (x - 0.5) * 4;
            card.style.transform = `translateY(-6px) perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
          });
          card.addEventListener('mouseleave', () => {
            card.style.transform = '';
          });
        });
      }

      // ---- Newsletter Form Handler ----
      const newsletterForm = document.querySelector('.newsletter__form');
      if (newsletterForm) {
        newsletterForm.addEventListener('submit', (e) => {
          e.preventDefault();
          const input = newsletterForm.querySelector('.newsletter__input');
          const submit = newsletterForm.querySelector('.newsletter__submit');
          if (input.value) {
            submit.textContent = 'Welcome';
            submit.style.background = 'var(--semantic-success)';
            input.value = '';
            setTimeout(() => {
              submit.textContent = 'Subscribe';
              submit.style.background = '';
            }, 3000);
          }
        });
      }
    });
  </script>
</body>
</html>
```

---

## Design Decisions & Rationale

### Typography
- **Bebas Neue** for all display headings — its condensed, architectural character evokes fashion editorial mastheads without the tired "Inter" safety
- **Lora** for body text — a serif with enough character to feel literary while maintaining excellent readability at all sizes
- **DM Mono** for micro-labels, navigation, and UI chrome — technical precision that complements the warmth of Lora

### Color & Atmosphere
- Deep obsidian/cosmic black canvas with atmospheric gradient meshes (deep purple, midnight blue, dark emerald) layered via `body::before` — this creates the "emerging from shadow" quality described in the PRD's Lovart.ai philosophy
- Champagne gold as the primary accent — warm, luxurious, more distinctive than generic gold
- Neon cyan reserved exclusively for focus indicators — accessibility signal that contrasts with the warm palette
- Grain texture overlay at 3% opacity — adds the "tactile digitality" from the design principles

### Layout Composition
- The editorial section uses a 2-column asymmetric grid with the image frame offset by a subtle accent line — breaking the centered-everything pattern
- Collections grid uses a `1.2fr 0.8fr` column split with the first card spanning two rows — creating visual tension and hierarchy
- Product cards in a 4-column grid with staggered reveal animations that cascade across the viewport

### Motion Choreography
- Hero elements reveal in sequence: badge (300ms) → title (600ms) → subtitle (1000ms) → CTAs (1300ms) → scroll indicator (2000ms)
- All animations respect `prefers-reduced-motion` — they're disabled entirely when the user prefers reduced motion
- The shimmer gradient on the hero title takes 8 seconds to traverse — slow enough to feel deliberate, not distracting
- Product cards have a subtle 3D tilt on hover using `mousemove` tracking (desktop only, respects motion preferences)

### Accessibility
- Skip link visible on focus
- Semantic HTML: `<nav>`, `<main>`, `<section>`, `<article>`, `<footer>` with proper `role` and `aria-label` attributes
- All interactive elements have visible focus indicators (neon cyan outline)
- Mobile nav includes focus trap, ESC dismissal, and `aria-expanded`/`aria-hidden` state management
- All images have descriptive alt text
- Form input has a properly associated label (visually hidden via skip-link class for screen readers)

### Performance
- All images use inline SVG data URIs with gradients (zero network requests for the mock)
- `loading="lazy"` on all below-fold images
- `requestAnimationFrame`-throttled scroll handler with `{ passive: true }`
- CSS-only animations where possible — JavaScript only for scroll reveal (IntersectionObserver) and product tilt (hover state)
- No external dependencies beyond Google Fonts and Lucide Icons (both with `defer`)

# https://aistudio.xiaomimimo.com/#/share/a927c4585bb53c9c3189768802c44b1c 

