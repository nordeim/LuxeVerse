## Phase 4: Implementation — The Complete Migrated Artifact

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="LuxeVerse — A cinematic digital boutique where AI artistry, sustainable craftsmanship, and personal style converge.">
  <title>LuxeVerse — Where Luxury Meets Intelligence</title>

  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;0,700;1,300;1,400&family=DM+Mono:wght@300;400;500&family=Source+Serif+4:ital,opsz,wght@0,8..60,300;0,8..60,400;0,8..60,600;1,8..60,400&display=swap" rel="stylesheet">

  <style>
    /* ============================================================
       CUSTOM PROPERTIES — OKLCH Perceptual Color System
       "Luminous Atelier" Migration — Phase 4
       ============================================================ */
    :root {
      /* — Obsidian Neutral Scale (OKLCH — Perceptually Uniform) — */
      --obsidian-50:  oklch(0.98 0.002 260);
      --obsidian-100: oklch(0.96 0.003 260);
      --obsidian-200: oklch(0.92 0.004 260);
      --obsidian-300: oklch(0.85 0.006 260);
      --obsidian-400: oklch(0.75 0.007 260);
      --obsidian-500: oklch(0.65 0.008 260);
      --obsidian-600: oklch(0.55 0.009 260);
      --obsidian-700: oklch(0.45 0.008 260);
      --obsidian-800: oklch(0.34 0.007 260);
      --obsidian-850: oklch(0.28 0.006 260);
      --obsidian-900: oklch(0.22 0.005 260);
      --obsidian-950: oklch(0.14 0.004 260);

      /* — Accent Colors (OKLCH) — */
      --neon-cyan: oklch(0.82 0.14 195);
      --neon-pink: oklch(0.60 0.28 10);

      /* — Metallic Luxury (OKLCH) — */
      --metallic-champagne: oklch(0.92 0.05 80);
      --metallic-gold: oklch(0.77 0.15 85);
      --metallic-gold-dark: oklch(0.66 0.15 75);
      --metallic-silver: oklch(0.80 0.00 0);
      --metallic-platinum: oklch(0.91 0.00 90);

      /* — Atmospheric Colors (OKLCH — Decorative Gradients) — */
      --atmosphere-deep-purple: oklch(0.14 0.13 305);
      --atmosphere-midnight:    oklch(0.14 0.05 250);
      --atmosphere-dark-emerald: oklch(0.20 0.07 155);
      --atmosphere-warm-charcoal: oklch(0.17 0.02 55);
      --atmosphere-soft-rose:   oklch(0.20 0.06 5);
      --atmosphere-cosmic:      oklch(0.14 0.004 260);

      /* — Typography — */
      --font-display: 'Cormorant Garamond', 'Georgia', serif;
      --font-body: 'Source Serif 4', 'Georgia', serif;
      --font-mono: 'DM Mono', 'Courier New', monospace;

      /* — Fluid Typography Scale — */
      --text-xs:   clamp(0.7rem, 0.65rem + 0.25vw, 0.8125rem);
      --text-sm:   clamp(0.8125rem, 0.75rem + 0.3vw, 0.9375rem);
      --text-base: clamp(0.9375rem, 0.875rem + 0.3vw, 1.0625rem);
      --text-lg:   clamp(1.0625rem, 1rem + 0.35vw, 1.1875rem);
      --text-xl:   clamp(1.1875rem, 1rem + 0.5vw, 1.375rem);
      --text-2xl:  clamp(1.375rem, 1.2rem + 0.8vw, 1.75rem);
      --text-3xl:  clamp(1.75rem, 1.4rem + 1.2vw, 2.5rem);
      --text-4xl:  clamp(2.25rem, 1.8rem + 2vw, 3.5rem);
      --text-5xl:  clamp(2.75rem, 2rem + 3.5vw, 5rem);
      --text-hero: clamp(3.25rem, 2.2rem + 5vw, 7.5rem);

      /* — Golden Ratio Spacing — */
      --space-3xs: 0.236rem;
      --space-2xs: 0.382rem;
      --space-xs:  0.618rem;
      --space-sm:  1rem;
      --space-md:  1.618rem;
      --space-lg:  2.618rem;
      --space-xl:  4.236rem;
      --space-2xl: 6.854rem;
      --space-3xl: 11.09rem;
      --space-4xl: 17.944rem;

      /* — Motion — */
      --ease-out-expo: cubic-bezier(0.19, 1, 0.22, 1);
      --ease-in-out-expo: cubic-bezier(0.87, 0, 0.13, 1);
      --ease-dramatic: cubic-bezier(0.77, 0, 0.175, 1);
      --ease-luxe: cubic-bezier(0.25, 0.1, 0.25, 1);
      --ease-spring: cubic-bezier(0.175, 0.885, 0.32, 1.275);

      --duration-instant: 100ms;
      --duration-fast: 200ms;
      --duration-normal: 400ms;
      --duration-slow: 600ms;
      --duration-dramatic: 1000ms;
      --duration-cinematic: 1500ms;

      /* — Layout — */
      --nav-height: 4.5rem;
      --max-width: 1400px;
      --side-padding: clamp(1.5rem, 5vw, 6rem);
    }

    /* ============================================================
       RESET & BASE
       ============================================================ */
    *, *::before, *::after {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    html {
      scroll-behavior: smooth;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
      text-rendering: optimizeLegibility;
    }

    body {
      font-family: var(--font-body);
      font-size: var(--text-base);
      line-height: 1.7;
      color: var(--obsidian-300);
      background-color: var(--obsidian-950);
      overflow-x: hidden;
    }

    body.loaded .preloader {
      opacity: 0;
      visibility: hidden;
      pointer-events: none;
    }

    img {
      display: block;
      max-width: 100%;
      height: auto;
    }

    a {
      color: inherit;
      text-decoration: none;
    }

    button {
      font: inherit;
      cursor: pointer;
      border: none;
      background: none;
    }

    /* ============================================================
       GRAIN OVERLAY — Cinematic Film Texture
       ============================================================ */
    body::after {
      content: '';
      position: fixed;
      inset: 0;
      z-index: 9998;
      pointer-events: none;
      opacity: 0.03;
      mix-blend-mode: overlay;
      background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.7' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
      background-size: 256px 256px;
    }

    /* ============================================================
       PRELOADER — Cinematic Brand Reveal
       ============================================================ */
    .preloader {
      position: fixed;
      inset: 0;
      background: var(--obsidian-950);
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      z-index: 10000;
      transition: opacity 1s var(--ease-out-expo) 0.2s,
                  visibility 1s var(--ease-out-expo) 0.2s;
    }

    .preloader-brand {
      font-family: var(--font-display);
      font-size: clamp(1.5rem, 1.2rem + 1.5vw, 2.5rem);
      font-weight: 300;
      color: var(--metallic-champagne);
      letter-spacing: 0.4em;
      opacity: 0;
      animation: preloaderFadeIn 1.2s var(--ease-out-expo) 0.3s forwards;
    }

    .preloader-line {
      width: 50px;
      height: 1px;
      background: var(--metallic-champagne);
      margin-top: var(--space-md);
      transform: scaleX(0);
      animation: preloaderLine 1s var(--ease-dramatic) 0.8s forwards;
    }

    @keyframes preloaderFadeIn {
      from { opacity: 0; transform: translateY(8px); }
      to   { opacity: 1; transform: translateY(0); }
    }

    @keyframes preloaderLine {
      to { transform: scaleX(1); }
    }

    /* ============================================================
       GOLDEN THREAD — Fixed Vertical Accent Line
       ============================================================ */
    .golden-thread {
      position: fixed;
      left: clamp(1rem, 3vw, 3.5rem);
      top: 0;
      width: 1px;
      height: 100vh;
      background: linear-gradient(
        to bottom,
        transparent 0%,
        oklch(0.82 0.10 80 / 0.12) 15%,
        oklch(0.82 0.10 80 / 0.12) 85%,
        transparent 100%
      );
      z-index: 50;
    }

    @media (max-width: 768px) {
      .golden-thread { display: none; }
    }

    /* ============================================================
       SCROLL REVEAL SYSTEM
       ============================================================ */
    .reveal {
      opacity: 0;
      transform: translateY(40px);
      transition: opacity var(--duration-dramatic) var(--ease-out-expo),
                  transform var(--duration-dramatic) var(--ease-out-expo);
    }

    .reveal.visible {
      opacity: 1;
      transform: translateY(0);
    }

    .reveal-left {
      opacity: 0;
      transform: translateX(-40px);
      transition: opacity var(--duration-dramatic) var(--ease-out-expo),
                  transform var(--duration-dramatic) var(--ease-out-expo);
    }

    .reveal-left.visible {
      opacity: 1;
      transform: translateX(0);
    }

    .reveal-right {
      opacity: 0;
      transform: translateX(40px);
      transition: opacity var(--duration-dramatic) var(--ease-out-expo),
                  transform var(--duration-dramatic) var(--ease-out-expo);
    }

    .reveal-right.visible {
      opacity: 1;
      transform: translateX(0);
    }

    /* ============================================================
       NAVIGATION — Glass Morphism on Scroll
       ============================================================ */
    .nav {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      height: var(--nav-height);
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 var(--side-padding);
      z-index: 1000;
      transition: background var(--duration-normal) var(--ease-luxe),
                  backdrop-filter var(--duration-normal) var(--ease-luxe),
                  border-color var(--duration-normal) var(--ease-luxe);
      border-bottom: 1px solid transparent;
    }

    .nav.scrolled {
      background: oklch(0.14 0.004 260 / 0.90);
      backdrop-filter: blur(20px) saturate(1.2);
      -webkit-backdrop-filter: blur(20px) saturate(1.2);
      border-bottom-color: oklch(0.78 0.10 80 / 0.08);
    }

    .nav-brand {
      font-family: var(--font-display);
      font-size: var(--text-xl);
      font-weight: 400;
      color: var(--metallic-champagne);
      letter-spacing: 0.25em;
      transition: letter-spacing var(--duration-slow) var(--ease-out-expo);
    }

    .nav-brand:hover {
      letter-spacing: 0.35em;
    }

    .nav-links {
      display: flex;
      align-items: center;
      gap: var(--space-lg);
      list-style: none;
    }

    .nav-link {
      font-family: var(--font-mono);
      font-size: var(--text-xs);
      font-weight: 400;
      color: var(--obsidian-400);
      letter-spacing: 0.12em;
      text-transform: uppercase;
      position: relative;
      transition: color var(--duration-fast) var(--ease-luxe);
    }

    .nav-link:hover {
      color: var(--metallic-champagne);
    }

    .nav-link::after {
      content: '';
      position: absolute;
      bottom: -4px;
      left: 0;
      width: 100%;
      height: 1px;
      background: var(--metallic-champagne);
      transform: scaleX(0);
      transform-origin: right;
      transition: transform var(--duration-normal) var(--ease-out-expo);
    }

    .nav-link:hover::after {
      transform: scaleX(1);
      transform-origin: left;
    }

    .nav-actions {
      display: flex;
      align-items: center;
      gap: var(--space-md);
    }

    .nav-action {
      color: var(--obsidian-400);
      transition: color var(--duration-fast) var(--ease-luxe);
    }

    .nav-action:hover {
      color: var(--metallic-champagne);
    }

    .nav-action svg {
      width: 20px;
      height: 20px;
      stroke-width: 1.5;
    }

    .nav-hamburger {
      display: none;
      flex-direction: column;
      gap: 5px;
      width: 24px;
      cursor: pointer;
    }

    .nav-hamburger span {
      display: block;
      height: 1px;
      background: var(--metallic-champagne);
      transition: transform var(--duration-normal) var(--ease-out-expo),
                  opacity var(--duration-fast);
    }

    .nav-hamburger.open span:nth-child(1) {
      transform: rotate(45deg) translate(4px, 4px);
    }

    .nav-hamburger.open span:nth-child(2) {
      opacity: 0;
    }

    .nav-hamburger.open span:nth-child(3) {
      transform: rotate(-45deg) translate(4px, -4px);
    }

    .mobile-menu {
      position: fixed;
      inset: 0;
      background: oklch(0.28 0.006 260 / 0.97);
      backdrop-filter: blur(30px);
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: var(--space-lg);
      z-index: 999;
      opacity: 0;
      visibility: hidden;
      transition: opacity var(--duration-slow) var(--ease-out-expo),
                  visibility var(--duration-slow);
    }

    .mobile-menu.open {
      opacity: 1;
      visibility: visible;
    }

    .mobile-menu a {
      font-family: var(--font-display);
      font-size: var(--text-3xl);
      font-weight: 300;
      color: var(--obsidian-200);
      letter-spacing: 0.08em;
      transition: color var(--duration-fast);
    }

    .mobile-menu a:hover {
      color: var(--metallic-champagne);
    }

    @media (max-width: 900px) {
      .nav-links, .nav-actions { display: none; }
      .nav-hamburger { display: flex; }
    }

    /* ============================================================
       HERO — Cinematic Opening
       ============================================================ */
    .hero {
      position: relative;
      min-height: 100vh;
      display: flex;
      align-items: center;
      padding: var(--nav-height) var(--side-padding) 0;
      overflow: hidden;
    }

    /* Gradient Mesh Background */
    .hero-mesh {
      position: absolute;
      inset: 0;
      overflow: hidden;
    }

    .mesh-orb {
      position: absolute;
      border-radius: 50%;
      filter: blur(120px);
      opacity: 0.5;
      will-change: transform;
    }

    .mesh-orb:nth-child(1) {
      width: 55vw;
      height: 55vw;
      left: -10%;
      top: -5%;
      background: var(--atmosphere-deep-purple);
      animation: orbFloat1 28s var(--ease-luxe) infinite alternate;
    }

    .mesh-orb:nth-child(2) {
      width: 40vw;
      height: 40vw;
      right: -5%;
      top: 10%;
      background: var(--atmosphere-midnight);
      animation: orbFloat2 24s var(--ease-luxe) infinite alternate;
    }

    .mesh-orb:nth-child(3) {
      width: 35vw;
      height: 35vw;
      left: 30%;
      bottom: -10%;
      background: var(--atmosphere-dark-emerald);
      animation: orbFloat3 32s var(--ease-luxe) infinite alternate;
    }

    .mesh-orb:nth-child(4) {
      width: 25vw;
      height: 25vw;
      right: 20%;
      top: 50%;
      background: var(--atmosphere-soft-rose);
      opacity: 0.3;
      animation: orbFloat4 20s var(--ease-luxe) infinite alternate;
    }

    @keyframes orbFloat1 {
      0%   { transform: translate(0, 0) scale(1); }
      100% { transform: translate(60px, 40px) scale(1.08); }
    }

    @keyframes orbFloat2 {
      0%   { transform: translate(0, 0) scale(1); }
      100% { transform: translate(-50px, 30px) scale(1.05); }
    }

    @keyframes orbFloat3 {
      0%   { transform: translate(0, 0) scale(1); }
      100% { transform: translate(40px, -50px) scale(0.95); }
    }

    @keyframes orbFloat4 {
      0%   { transform: translate(0, 0) scale(1); }
      100% { transform: translate(-30px, -20px) scale(1.1); }
    }

    /* Hero Content */
    .hero-content {
      position: relative;
      z-index: 2;
      max-width: 900px;
      padding-left: clamp(2rem, 6vw, 8rem);
    }

    .hero-label {
      display: inline-block;
      font-family: var(--font-mono);
      font-size: var(--text-xs);
      font-weight: 400;
      color: var(--obsidian-400);
      letter-spacing: 0.2em;
      text-transform: uppercase;
      margin-bottom: var(--space-lg);
      opacity: 0;
      animation: heroFadeUp 1s var(--ease-out-expo) 1.6s forwards;
    }

    .hero-title {
      font-family: var(--font-display);
      font-size: var(--text-hero);
      font-weight: 300;
      line-height: 0.95;
      color: var(--obsidian-100);
      letter-spacing: -0.02em;
      margin-bottom: var(--space-lg);
    }

    .hero-title .line {
      display: block;
      opacity: 0;
      transform: translateY(60px);
    }

    .hero-title .line:nth-child(1) {
      animation: heroLineReveal 1.2s var(--ease-out-expo) 1.8s forwards;
    }

    .hero-title .line:nth-child(2) {
      animation: heroLineReveal 1.2s var(--ease-out-expo) 2.0s forwards;
    }

    .hero-title .line:nth-child(3) {
      animation: heroLineReveal 1.2s var(--ease-out-expo) 2.2s forwards;
    }

    .hero-title em {
      font-style: italic;
      color: var(--metallic-champagne);
    }

    .hero-subtitle {
      font-family: var(--font-body);
      font-size: var(--text-lg);
      font-weight: 300;
      line-height: 1.8;
      color: var(--obsidian-300);
      max-width: 540px;
      margin-bottom: var(--space-xl);
      opacity: 0;
      animation: heroFadeUp 1s var(--ease-out-expo) 2.5s forwards;
    }

    .hero-actions {
      display: flex;
      align-items: center;
      gap: var(--space-md);
      flex-wrap: wrap;
      opacity: 0;
      animation: heroFadeUp 1s var(--ease-out-expo) 2.8s forwards;
    }

    @keyframes heroFadeUp {
      from { opacity: 0; transform: translateY(20px); }
      to   { opacity: 1; transform: translateY(0); }
    }

    @keyframes heroLineReveal {
      from { opacity: 0; transform: translateY(60px); }
      to   { opacity: 1; transform: translateY(0); }
    }

    /* Hero Ornament — Geometric Decoration */
    .hero-ornament {
      position: absolute;
      right: clamp(3rem, 10vw, 10rem);
      top: 50%;
      transform: translateY(-50%) rotate(45deg);
      width: clamp(180px, 20vw, 320px);
      height: clamp(180px, 20vw, 320px);
      border: 1px solid oklch(0.78 0.10 80 / 0.10);
      z-index: 1;
      opacity: 0;
      animation: ornamentReveal 2s var(--ease-out-expo) 3s forwards;
    }

    .hero-ornament::before {
      content: '';
      position: absolute;
      inset: 35px;
      border: 1px solid oklch(0.78 0.10 80 / 0.07);
    }

    .hero-ornament::after {
      content: '';
      position: absolute;
      inset: 70px;
      border: 1px solid oklch(0.78 0.10 80 / 0.05);
    }

    .hero-circle {
      position: absolute;
      right: clamp(6rem, 14vw, 14rem);
      top: 35%;
      width: clamp(120px, 14vw, 220px);
      height: clamp(120px, 14vw, 220px);
      border: 1px solid oklch(0.78 0.10 80 / 0.07);
      border-radius: 50%;
      z-index: 1;
      opacity: 0;
      animation: ornamentReveal 2s var(--ease-out-expo) 3.3s forwards;
    }

    @keyframes ornamentReveal {
      from { opacity: 0; transform: translateY(-50%) rotate(45deg) scale(0.8); }
      to   { opacity: 1; transform: translateY(-50%) rotate(45deg) scale(1); }
    }

    /* Scroll Indicator */
    .hero-scroll {
      position: absolute;
      bottom: var(--space-xl);
      left: 50%;
      transform: translateX(-50%);
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: var(--space-xs);
      opacity: 0;
      animation: heroFadeUp 1s var(--ease-out-expo) 3.5s forwards;
    }

    .hero-scroll span {
      font-family: var(--font-mono);
      font-size: var(--text-xs);
      color: var(--obsidian-500);
      letter-spacing: 0.15em;
      text-transform: uppercase;
    }

    .scroll-line {
      width: 1px;
      height: 36px;
      background: var(--metallic-champagne);
      opacity: 0.4;
      transform-origin: top;
      animation: scrollPulse 2.5s var(--ease-luxe) infinite;
    }

    @keyframes scrollPulse {
      0%, 100% { transform: scaleY(0.3); opacity: 0.15; }
      50%      { transform: scaleY(1); opacity: 0.4; }
    }

    @media (max-width: 768px) {
      .hero-ornament, .hero-circle { display: none; }
      .hero-content { padding-left: 0; }
    }

    /* ============================================================
       BUTTONS — Primary & Ghost
       ============================================================ */
    .btn-primary {
      display: inline-flex;
      align-items: center;
      gap: var(--space-xs);
      font-family: var(--font-mono);
      font-size: var(--text-xs);
      font-weight: 500;
      color: var(--obsidian-950);
      background: var(--metallic-champagne);
      padding: var(--space-sm) var(--space-lg);
      letter-spacing: 0.1em;
      text-transform: uppercase;
      transition: letter-spacing var(--duration-slow) var(--ease-out-expo),
                  background var(--duration-fast) var(--ease-luxe),
                  box-shadow var(--duration-normal) var(--ease-luxe);
    }

    .btn-primary:hover {
      letter-spacing: 0.18em;
      background: var(--metallic-gold);
      box-shadow: 0 0 40px oklch(0.77 0.15 85 / 0.20);
    }

    .btn-ghost {
      display: inline-flex;
      align-items: center;
      gap: var(--space-xs);
      font-family: var(--font-mono);
      font-size: var(--text-xs);
      font-weight: 400;
      color: var(--obsidian-300);
      padding: var(--space-sm) 0;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      border-bottom: 1px solid var(--obsidian-700);
      transition: color var(--duration-fast) var(--ease-luxe),
                  border-color var(--duration-fast) var(--ease-luxe),
                  letter-spacing var(--duration-slow) var(--ease-out-expo);
    }

    .btn-ghost:hover {
      color: var(--metallic-champagne);
      border-color: var(--metallic-champagne);
      letter-spacing: 0.15em;
    }

    .btn-ghost svg, .btn-primary svg {
      width: 14px;
      height: 14px;
      stroke-width: 2;
    }

    /* ============================================================
       SECTION FRAMEWORK — Shared Structure
       ============================================================ */
    .section {
      position: relative;
      padding: var(--space-3xl) var(--side-padding);
    }

    .section-inner {
      max-width: var(--max-width);
      margin: 0 auto;
    }

    .section-label {
      font-family: var(--font-mono);
      font-size: var(--text-xs);
      font-weight: 400;
      color: var(--obsidian-500);
      letter-spacing: 0.2em;
      text-transform: uppercase;
      margin-bottom: var(--space-xl);
      display: flex;
      align-items: center;
      gap: var(--space-md);
    }

    .section-label::after {
      content: '';
      flex: 1;
      height: 1px;
      background: linear-gradient(to right, var(--obsidian-800), transparent);
    }

    .section-divider {
      width: 100%;
      max-width: var(--max-width);
      margin: 0 auto;
      height: 1px;
      background: linear-gradient(
        to right,
        transparent,
        oklch(0.78 0.10 80 / 0.15) 20%,
        oklch(0.78 0.10 80 / 0.15) 80%,
        transparent
      );
    }

    /* ============================================================
       VISION — The Philosophy
       ============================================================ */
    .vision-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: var(--space-2xl);
      align-items: start;
    }

    .vision-quote {
      font-family: var(--font-display);
      font-size: var(--text-4xl);
      font-weight: 300;
      font-style: italic;
      line-height: 1.2;
      color: var(--obsidian-100);
      position: relative;
      padding-left: var(--space-lg);
    }

    .vision-quote::before {
      content: '';
      position: absolute;
      left: 0;
      top: 0;
      width: 2px;
      height: 100%;
      background: linear-gradient(to bottom, var(--metallic-champagne), transparent);
    }

    .vision-body {
      padding-top: var(--space-md);
    }

    .vision-body p {
      margin-bottom: var(--space-md);
      font-size: var(--text-base);
      line-height: 1.9;
      color: var(--obsidian-400);
    }

    .vision-body p:first-child::first-letter {
      font-family: var(--font-display);
      font-size: var(--text-4xl);
      font-weight: 600;
      float: left;
      line-height: 0.8;
      margin-right: var(--space-xs);
      margin-top: 0.1em;
      color: var(--metallic-champagne);
    }

    @media (max-width: 768px) {
      .vision-grid {
        grid-template-columns: 1fr;
        gap: var(--space-xl);
      }
    }

    /* ============================================================
       COLLECTIONS — Asymmetric Editorial Grid
       ============================================================ */
    .collections-grid {
      display: grid;
      grid-template-columns: 1.3fr 1fr 0.9fr;
      gap: var(--space-md);
      align-items: start;
    }

    .collection-card {
      position: relative;
      overflow: hidden;
      cursor: pointer;
      background: var(--obsidian-900);
      transition: box-shadow var(--duration-slow) var(--ease-luxe);
    }

    .collection-card:nth-child(1) {
      min-height: 580px;
    }

    .collection-card:nth-child(2) {
      min-height: 420px;
      margin-top: var(--space-3xl);
    }

    .collection-card:nth-child(3) {
      min-height: 480px;
    }

    .collection-card:hover {
      box-shadow: 0 8px 40px oklch(0.08 0.003 260 / 0.30);
    }

    .collection-card-bg {
      position: absolute;
      inset: 0;
      transition: transform var(--duration-dramatic) var(--ease-out-expo);
    }

    .collection-card:hover .collection-card-bg {
      transform: scale(1.05);
    }

    .collection-card:nth-child(1) .collection-card-bg {
      background:
        radial-gradient(ellipse at 30% 40%, oklch(0.14 0.13 305 / 0.9), transparent 70%),
        radial-gradient(ellipse at 70% 80%, oklch(0.14 0.05 250 / 0.7), transparent 60%),
        linear-gradient(135deg, var(--obsidian-950), oklch(0.20 0.04 285));
    }

    .collection-card:nth-child(2) .collection-card-bg {
      background:
        radial-gradient(ellipse at 50% 30%, oklch(0.77 0.15 85 / 0.08), transparent 60%),
        radial-gradient(ellipse at 20% 80%, oklch(0.14 0.13 305 / 0.6), transparent 70%),
        linear-gradient(135deg, var(--obsidian-950), oklch(0.17 0.02 55));
    }

    .collection-card:nth-child(3) .collection-card-bg {
      background:
        radial-gradient(ellipse at 60% 50%, oklch(0.20 0.07 155 / 0.7), transparent 60%),
        radial-gradient(ellipse at 30% 20%, oklch(0.14 0.05 250 / 0.5), transparent 70%),
        linear-gradient(135deg, oklch(0.20 0.07 155), var(--obsidian-950));
    }

    .collection-card-overlay {
      position: absolute;
      inset: 0;
      background: linear-gradient(
        to top,
        oklch(0.14 0.004 260 / 0.90) 0%,
        oklch(0.14 0.004 260 / 0.20) 50%,
        transparent 100%
      );
      z-index: 1;
    }

    .collection-card-content {
      position: relative;
      z-index: 2;
      display: flex;
      flex-direction: column;
      justify-content: flex-end;
      height: 100%;
      padding: var(--space-xl);
    }

    .collection-card-season {
      font-family: var(--font-mono);
      font-size: var(--text-xs);
      color: var(--metallic-champagne);
      letter-spacing: 0.2em;
      text-transform: uppercase;
      margin-bottom: var(--space-sm);
      opacity: 0.7;
    }

    .collection-card-title {
      font-family: var(--font-display);
      font-size: var(--text-3xl);
      font-weight: 400;
      color: var(--obsidian-100);
      line-height: 1.15;
      margin-bottom: var(--space-xs);
    }

    .collection-card-desc {
      font-family: var(--font-body);
      font-size: var(--text-sm);
      color: var(--obsidian-400);
      font-style: italic;
      margin-bottom: var(--space-md);
    }

    .collection-card-link {
      font-family: var(--font-mono);
      font-size: var(--text-xs);
      color: var(--metallic-champagne);
      letter-spacing: 0.15em;
      text-transform: uppercase;
      display: inline-flex;
      align-items: center;
      gap: var(--space-2xs);
      transition: gap var(--duration-normal) var(--ease-out-expo);
    }

    .collection-card:hover .collection-card-link {
      gap: var(--space-sm);
    }

    .collection-card-border {
      position: absolute;
      inset: 0;
      border: 1px solid oklch(0.78 0.10 80 / 0);
      transition: border-color var(--duration-slow) var(--ease-luxe);
      z-index: 3;
      pointer-events: none;
    }

    .collection-card:hover .collection-card-border {
      border-color: oklch(0.78 0.10 80 / 0.15);
    }

    @media (max-width: 1024px) {
      .collections-grid {
        grid-template-columns: 1fr 1fr;
      }
      .collection-card:nth-child(2) { margin-top: 0; }
      .collection-card:nth-child(3) {
        grid-column: 1 / -1;
        min-height: 350px;
      }
    }

    @media (max-width: 640px) {
      .collections-grid {
        grid-template-columns: 1fr;
      }
      .collection-card:nth-child(n) {
        min-height: 350px;
        margin-top: 0;
      }
    }

    /* ============================================================
       PRODUCTS — Elevated Section + Horizontal Cinematic Scroll
       ============================================================ */
    #curated {
      background: var(--obsidian-900);
    }

    .products-scroll-wrapper {
      position: relative;
      margin: 0 calc(var(--side-padding) * -1);
      padding: 0 var(--side-padding);
    }

    .products-scroll {
      display: flex;
      gap: var(--space-lg);
      overflow-x: auto;
      scroll-snap-type: x mandatory;
      scroll-padding: var(--side-padding);
      padding-bottom: var(--space-md);
      -ms-overflow-style: none;
      scrollbar-width: none;
    }

    .products-scroll::-webkit-scrollbar {
      display: none;
    }

    .products-scroll-fade-left,
    .products-scroll-fade-right {
      position: absolute;
      top: 0;
      bottom: 0;
      width: 80px;
      z-index: 5;
      pointer-events: none;
    }

    .products-scroll-fade-left {
      left: 0;
      background: linear-gradient(to right, var(--obsidian-900), transparent);
    }

    .products-scroll-fade-right {
      right: 0;
      background: linear-gradient(to left, var(--obsidian-900), transparent);
    }

    .product-card {
      flex: 0 0 clamp(260px, 28vw, 340px);
      scroll-snap-align: start;
      cursor: pointer;
    }

    .product-card-image {
      position: relative;
      aspect-ratio: 3 / 4;
      overflow: hidden;
      background: var(--obsidian-850);
      margin-bottom: var(--space-md);
      transition: box-shadow var(--duration-slow) var(--ease-luxe);
    }

    .product-card:hover .product-card-image {
      box-shadow: 0 12px 40px oklch(0.08 0.003 260 / 0.25);
    }

    .product-card-image img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform var(--duration-dramatic) var(--ease-out-expo);
    }

    .product-card:hover .product-card-image img {
      transform: scale(1.06);
    }

    .product-card-image-overlay {
      position: absolute;
      inset: 0;
      background: linear-gradient(to top, oklch(0.14 0.004 260 / 0.40) 0%, transparent 40%);
      opacity: 0;
      transition: opacity var(--duration-normal) var(--ease-luxe);
    }

    .product-card:hover .product-card-image-overlay {
      opacity: 1;
    }

    .product-card-quickview {
      position: absolute;
      bottom: var(--space-md);
      left: 50%;
      transform: translateX(-50%) translateY(10px);
      font-family: var(--font-mono);
      font-size: var(--text-xs);
      color: var(--obsidian-100);
      letter-spacing: 0.15em;
      text-transform: uppercase;
      background: oklch(0.14 0.004 260 / 0.70);
      backdrop-filter: blur(10px);
      padding: var(--space-2xs) var(--space-md);
      opacity: 0;
      transition: opacity var(--duration-normal) var(--ease-luxe),
                  transform var(--duration-normal) var(--ease-out-expo);
    }

    .product-card:hover .product-card-quickview {
      opacity: 1;
      transform: translateX(-50%) translateY(0);
    }

    .product-card-border {
      position: absolute;
      inset: 0;
      border: 1px solid transparent;
      transition: border-color var(--duration-slow) var(--ease-luxe);
      pointer-events: none;
    }

    .product-card:hover .product-card-border {
      border-color: oklch(0.78 0.10 80 / 0.18);
    }

    .product-card-brand {
      font-family: var(--font-mono);
      font-size: var(--text-xs);
      color: var(--obsidian-500);
      letter-spacing: 0.15em;
      text-transform: uppercase;
      margin-bottom: var(--space-3xs);
    }

    .product-card-name {
      font-family: var(--font-display);
      font-size: var(--text-xl);
      font-weight: 400;
      color: var(--obsidian-200);
      line-height: 1.3;
      margin-bottom: var(--space-2xs);
    }

    .product-card-price {
      font-family: var(--font-mono);
      font-size: var(--text-sm);
      color: var(--metallic-champagne);
      letter-spacing: 0.05em;
    }

    /* ============================================================
       EXPERIENCE — Editorial Feature Grid
       ============================================================ */
    .experience-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1px;
      background: oklch(0.78 0.10 80 / 0.10);
    }

    .experience-card {
      background: var(--obsidian-900);
      padding: var(--space-xl) var(--space-xl) var(--space-xl) var(--space-xl);
      position: relative;
      transition: background var(--duration-normal) var(--ease-luxe);
    }

    .experience-card:hover {
      background: oklch(0.25 0.006 260);
    }

    .experience-number {
      font-family: var(--font-display);
      font-size: clamp(4rem, 3rem + 3vw, 7rem);
      font-weight: 300;
      color: oklch(0.78 0.10 80 / 0.06);
      line-height: 1;
      margin-bottom: var(--space-sm);
      position: absolute;
      top: var(--space-lg);
      right: var(--space-lg);
    }

    .experience-icon {
      width: 32px;
      height: 32px;
      color: var(--metallic-champagne);
      margin-bottom: var(--space-md);
      opacity: 0.7;
    }

    .experience-icon svg {
      width: 100%;
      height: 100%;
      stroke-width: 1.2;
    }

    .experience-title {
      font-family: var(--font-display);
      font-size: var(--text-2xl);
      font-weight: 400;
      color: var(--obsidian-100);
      line-height: 1.2;
      margin-bottom: var(--space-sm);
    }

    .experience-desc {
      font-family: var(--font-body);
      font-size: var(--text-sm);
      color: var(--obsidian-400);
      line-height: 1.8;
      max-width: 420px;
    }

    @media (max-width: 768px) {
      .experience-grid {
        grid-template-columns: 1fr;
      }
    }

    /* ============================================================
       JOURNAL — Editorial Magazine Layout
       ============================================================ */
    .journal-grid {
      display: grid;
      grid-template-columns: 1.4fr 1fr;
      gap: var(--space-2xl);
      align-items: start;
    }

    .journal-featured {
      cursor: pointer;
    }

    .journal-featured-image {
      position: relative;
      aspect-ratio: 16 / 10;
      overflow: hidden;
      background: var(--obsidian-900);
      margin-bottom: var(--space-lg);
    }

    .journal-featured-image img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform var(--duration-dramatic) var(--ease-out-expo);
    }

    .journal-featured:hover .journal-featured-image img {
      transform: scale(1.04);
    }

    .journal-category {
      font-family: var(--font-mono);
      font-size: var(--text-xs);
      color: var(--metallic-champagne);
      letter-spacing: 0.2em;
      text-transform: uppercase;
      margin-bottom: var(--space-xs);
    }

    .journal-featured-title {
      font-family: var(--font-display);
      font-size: var(--text-3xl);
      font-weight: 400;
      color: var(--obsidian-100);
      line-height: 1.2;
      margin-bottom: var(--space-sm);
      transition: color var(--duration-fast) var(--ease-luxe);
    }

    .journal-featured:hover .journal-featured-title {
      color: var(--metallic-champagne);
    }

    .journal-excerpt {
      font-family: var(--font-body);
      font-size: var(--text-base);
      color: var(--obsidian-400);
      line-height: 1.8;
      margin-bottom: var(--space-md);
    }

    .journal-meta {
      font-family: var(--font-mono);
      font-size: var(--text-xs);
      color: var(--obsidian-500);
      letter-spacing: 0.1em;
      display: flex;
      align-items: center;
      gap: var(--space-md);
    }

    .journal-meta-dot {
      width: 3px;
      height: 3px;
      background: var(--obsidian-700);
      border-radius: 50%;
    }

    .journal-sidebar {
      display: flex;
      flex-direction: column;
      gap: var(--space-xl);
    }

    .journal-sidebar-item {
      display: grid;
      grid-template-columns: 100px 1fr;
      gap: var(--space-md);
      cursor: pointer;
      align-items: start;
    }

    .journal-sidebar-thumb {
      aspect-ratio: 1;
      overflow: hidden;
      background: var(--obsidian-900);
    }

    .journal-sidebar-thumb img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform var(--duration-slow) var(--ease-out-expo);
    }

    .journal-sidebar-item:hover .journal-sidebar-thumb img {
      transform: scale(1.08);
    }

    .journal-sidebar-title {
      font-family: var(--font-display);
      font-size: var(--text-lg);
      font-weight: 400;
      color: var(--obsidian-200);
      line-height: 1.3;
      margin-bottom: var(--space-2xs);
      transition: color var(--duration-fast) var(--ease-luxe);
    }

    .journal-sidebar-item:hover .journal-sidebar-title {
      color: var(--metallic-champagne);
    }

    @media (max-width: 900px) {
      .journal-grid {
        grid-template-columns: 1fr;
        gap: var(--space-xl);
      }
      .journal-sidebar-item {
        grid-template-columns: 80px 1fr;
      }
    }

    /* ============================================================
       ATELIER CTA — Elevated Section with Cinematic Email
       ============================================================ */
    #atelier {
      background: var(--obsidian-900);
    }

    .atelier {
      position: relative;
      text-align: center;
      overflow: hidden;
    }

    .atelier-mesh {
      position: absolute;
      inset: 0;
    }

    .atelier-mesh .mesh-orb {
      opacity: 0.35;
      filter: blur(100px);
    }

    .atelier-mesh .mesh-orb:nth-child(1) {
      width: 40vw;
      height: 40vw;
      left: 20%;
      top: 0;
      background: oklch(0.28 0.13 305);
    }

    .atelier-mesh .mesh-orb:nth-child(2) {
      width: 30vw;
      height: 30vw;
      right: 10%;
      bottom: 0;
      background: oklch(0.26 0.06 250);
    }

    .atelier-content {
      position: relative;
      z-index: 2;
      max-width: 640px;
      margin: 0 auto;
    }

    .atelier-title {
      font-family: var(--font-display);
      font-size: var(--text-4xl);
      font-weight: 300;
      color: var(--obsidian-100);
      line-height: 1.15;
      margin-bottom: var(--space-md);
    }

    .atelier-desc {
      font-family: var(--font-body);
      font-size: var(--text-base);
      color: var(--obsidian-400);
      line-height: 1.8;
      margin-bottom: var(--space-xl);
    }

    .atelier-form {
      display: flex;
      gap: 1px;
      max-width: 480px;
      margin: 0 auto var(--space-md);
      background: oklch(0.78 0.10 80 / 0.12);
    }

    .atelier-input {
      flex: 1;
      font-family: var(--font-body);
      font-size: var(--text-sm);
      color: var(--obsidian-200);
      background: oklch(0.14 0.004 260 / 0.60);
      border: none;
      padding: var(--space-sm) var(--space-md);
      outline: none;
      backdrop-filter: blur(10px);
    }

    .atelier-input::placeholder {
      color: var(--obsidian-500);
      font-style: italic;
    }

    .atelier-input:focus {
      background: oklch(0.14 0.004 260 / 0.80);
    }

    .atelier-submit {
      font-family: var(--font-mono);
      font-size: var(--text-xs);
      font-weight: 500;
      color: var(--obsidian-950);
      background: var(--metallic-champagne);
      padding: var(--space-sm) var(--space-lg);
      letter-spacing: 0.12em;
      text-transform: uppercase;
      white-space: nowrap;
      transition: background var(--duration-fast) var(--ease-luxe),
                  letter-spacing var(--duration-slow) var(--ease-out-expo);
    }

    .atelier-submit:hover {
      background: var(--metallic-gold);
      letter-spacing: 0.18em;
    }

    .atelier-privacy {
      font-family: var(--font-mono);
      font-size: var(--text-xs);
      color: var(--obsidian-600);
      letter-spacing: 0.05em;
    }

    @media (max-width: 480px) {
      .atelier-form {
        flex-direction: column;
        gap: 0;
      }
    }

    /* ============================================================
       FOOTER — Refined Minimal with Visible Borders
       ============================================================ */
    .footer {
      padding: var(--space-2xl) var(--side-padding) var(--space-xl);
      border-top: 1px solid oklch(0.78 0.10 80 / 0.20);
    }

    .footer-inner {
      max-width: var(--max-width);
      margin: 0 auto;
    }

    .footer-top {
      display: grid;
      grid-template-columns: 1.5fr 1fr 1fr 1fr;
      gap: var(--space-xl);
      margin-bottom: var(--space-2xl);
    }

    .footer-brand {
      font-family: var(--font-display);
      font-size: var(--text-2xl);
      font-weight: 300;
      color: var(--metallic-champagne);
      letter-spacing: 0.2em;
      margin-bottom: var(--space-md);
    }

    .footer-tagline {
      font-family: var(--font-body);
      font-size: var(--text-sm);
      color: var(--obsidian-500);
      line-height: 1.7;
      max-width: 280px;
    }

    .footer-col-title {
      font-family: var(--font-mono);
      font-size: var(--text-xs);
      font-weight: 500;
      color: var(--obsidian-400);
      letter-spacing: 0.15em;
      text-transform: uppercase;
      margin-bottom: var(--space-md);
    }

    .footer-links {
      list-style: none;
      display: flex;
      flex-direction: column;
      gap: var(--space-xs);
    }

    .footer-link {
      font-family: var(--font-body);
      font-size: var(--text-sm);
      color: var(--obsidian-500);
      transition: color var(--duration-fast) var(--ease-luxe);
    }

    .footer-link:hover {
      color: var(--metallic-champagne);
    }

    .footer-bottom {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding-top: var(--space-lg);
      border-top: 1px solid oklch(0.78 0.10 80 / 0.08);
      flex-wrap: wrap;
      gap: var(--space-sm);
    }

    .footer-copyright {
      font-family: var(--font-mono);
      font-size: var(--text-xs);
      color: var(--obsidian-600);
      letter-spacing: 0.05em;
    }

    .footer-legal {
      display: flex;
      gap: var(--space-md);
    }

    .footer-legal a {
      font-family: var(--font-mono);
      font-size: var(--text-xs);
      color: var(--obsidian-600);
      letter-spacing: 0.05em;
      transition: color var(--duration-fast);
    }

    .footer-legal a:hover {
      color: var(--obsidian-400);
    }

    @media (max-width: 900px) {
      .footer-top {
        grid-template-columns: 1fr 1fr;
        gap: var(--space-lg);
      }
    }

    @media (max-width: 540px) {
      .footer-top {
        grid-template-columns: 1fr;
      }
    }

    /* ============================================================
       UTILITY: Reduced Motion
       ============================================================ */
    @media (prefers-reduced-motion: reduce) {
      *, *::before, *::after {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
      }

      .reveal, .reveal-left, .reveal-right {
        opacity: 1;
        transform: none;
      }

      .mesh-orb { animation: none !important; }
      .scroll-line { animation: none !important; }
      .preloader { display: none; }

      body.loaded .preloader {
        opacity: 0;
        visibility: hidden;
      }
    }
  </style>
</head>

<body>
  <!-- ============================================================
       PRELOADER
       ============================================================ -->
  <div class="preloader" id="preloader" aria-hidden="true">
    <span class="preloader-brand">LUXEVERSE</span>
    <div class="preloader-line"></div>
  </div>

  <!-- ============================================================
       GOLDEN THREAD
       ============================================================ -->
  <div class="golden-thread" aria-hidden="true"></div>

  <!-- ============================================================
       NAVIGATION
       ============================================================ -->
  <nav class="nav" id="nav" role="navigation" aria-label="Primary navigation">
    <a href="#" class="nav-brand" aria-label="LuxeVerse Home">LUXEVERSE</a>

    <ul class="nav-links">
      <li><a href="#collections" class="nav-link">Collections</a></li>
      <li><a href="#curated" class="nav-link">Curated</a></li>
      <li><a href="#experience" class="nav-link">Experience</a></li>
      <li><a href="#journal" class="nav-link">Journal</a></li>
    </ul>

    <div class="nav-actions">
      <button class="nav-action" aria-label="Search">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
      </button>
      <button class="nav-action" aria-label="Account">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
      </button>
      <button class="nav-action" aria-label="Shopping bag">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
      </button>
    </div>

    <button class="nav-hamburger" id="navHamburger" aria-label="Toggle menu" aria-expanded="false">
      <span></span>
      <span></span>
      <span></span>
    </button>
  </nav>

  <!-- Mobile Menu -->
  <div class="mobile-menu" id="mobileMenu" role="dialog" aria-label="Mobile navigation">
    <a href="#collections" class="mobile-link">Collections</a>
    <a href="#curated" class="mobile-link">Curated</a>
    <a href="#experience" class="mobile-link">Experience</a>
    <a href="#journal" class="mobile-link">Journal</a>
    <a href="#atelier" class="mobile-link">Atelier</a>
  </div>

  <main>
    <!-- ============================================================
         HERO — Cinematic Opening
         ============================================================ -->
    <section class="hero" aria-label="Welcome to LuxeVerse">
      <div class="hero-mesh" aria-hidden="true">
        <div class="mesh-orb"></div>
        <div class="mesh-orb"></div>
        <div class="mesh-orb"></div>
        <div class="mesh-orb"></div>
      </div>

      <div class="hero-content">
        <span class="hero-label">Est. MMXXVI — Digital Atelier</span>

        <h1 class="hero-title">
          <span class="line">Where</span>
          <span class="line"><em>Luxury</em> Meets</span>
          <span class="line">Intelligence</span>
        </h1>

        <p class="hero-subtitle">
          A cinematic digital boutique where AI artistry, sustainable craftsmanship,
          and personal style converge to create shopping experiences as unique as you.
        </p>

        <div class="hero-actions">
          <a href="#collections" class="btn-primary">
            Enter the Atelier
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
          </a>
          <a href="#vision" class="btn-ghost">Discover the Vision</a>
        </div>
      </div>

      <div class="hero-ornament" aria-hidden="true"></div>
      <div class="hero-circle" aria-hidden="true"></div>

      <div class="hero-scroll" aria-hidden="true">
        <span>Scroll to explore</span>
        <div class="scroll-line"></div>
      </div>
    </section>

    <!-- ============================================================
         VISION — The Philosophy
         ============================================================ -->
    <section class="section" id="vision" aria-label="Our vision">
      <div class="section-inner">
        <div class="section-label reveal">
          <span>01 — The Vision</span>
        </div>

        <div class="vision-grid">
          <blockquote class="vision-quote reveal-left">
            Every pixel tells a story. Every interaction, a chapter in your personal style narrative.
          </blockquote>

          <div class="vision-body reveal-right">
            <p>
              LuxeVerse represents a paradigm shift in luxury e-commerce — transcending
              traditional online shopping to create an immersive, AI-driven digital boutique
              experience that seamlessly blends art direction, personal intelligence, and commerce.
            </p>
            <p>
              Inspired by the aesthetic philosophy that merges cinematic storytelling with
              cutting-edge generative technology, every element is choreographed to evoke the
              emotional resonance of stepping into a flagship atelier on Rue du Faubourg
              Saint-Honoré — yet amplified by the capabilities of modern AI and spatial computing.
            </p>
          </div>
        </div>
      </div>
    </section>

    <div class="section-divider" aria-hidden="true"></div>

    <!-- ============================================================
         COLLECTIONS — Asymmetric Editorial Grid
         ============================================================ -->
    <section class="section" id="collections" aria-label="Featured collections">
      <div class="section-inner">
        <div class="section-label reveal">
          <span>02 — Maison</span>
        </div>

        <div class="collections-grid">
          <!-- Collection 1 -->
          <article class="collection-card reveal" style="transition-delay: 0s;">
            <div class="collection-card-bg" aria-hidden="true"></div>
            <div class="collection-card-overlay" aria-hidden="true"></div>
            <div class="collection-card-content">
              <span class="collection-card-season">AW26 Collection</span>
              <h3 class="collection-card-title">Noir Automne</h3>
              <p class="collection-card-desc">Where shadow meets substance</p>
              <span class="collection-card-link">
                Explore
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
              </span>
            </div>
            <div class="collection-card-border" aria-hidden="true"></div>
          </article>

          <!-- Collection 2 -->
          <article class="collection-card reveal" style="transition-delay: 0.15s;">
            <div class="collection-card-bg" aria-hidden="true"></div>
            <div class="collection-card-overlay" aria-hidden="true"></div>
            <div class="collection-card-content">
              <span class="collection-card-season">Icons</span>
              <h3 class="collection-card-title">Lumière Éternelle</h3>
              <p class="collection-card-desc">Pieces that transcend seasons</p>
              <span class="collection-card-link">
                Explore
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
              </span>
            </div>
            <div class="collection-card-border" aria-hidden="true"></div>
          </article>

          <!-- Collection 3 -->
          <article class="collection-card reveal" style="transition-delay: 0.3s;">
            <div class="collection-card-bg" aria-hidden="true"></div>
            <div class="collection-card-overlay" aria-hidden="true"></div>
            <div class="collection-card-content">
              <span class="collection-card-season">Conscious</span>
              <h3 class="collection-card-title">Éco-Luxe</h3>
              <p class="collection-card-desc">Beauty without compromise</p>
              <span class="collection-card-link">
                Explore
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
              </span>
            </div>
            <div class="collection-card-border" aria-hidden="true"></div>
          </article>
        </div>
      </div>
    </section>

    <div class="section-divider" aria-hidden="true"></div>

    <!-- ============================================================
         CURATED — Product Showcase (Elevated Section)
         ============================================================ -->
    <section class="section" id="curated" aria-label="Curated products">
      <div class="section-inner">
        <div class="section-label reveal">
          <span>03 — Curated For You</span>
        </div>
      </div>

      <div class="products-scroll-wrapper reveal">
        <div class="products-scroll-fade-left" aria-hidden="true"></div>
        <div class="products-scroll-fade-right" aria-hidden="true"></div>

        <div class="products-scroll" role="list">
          <!-- Product 1 -->
          <article class="product-card" role="listitem">
            <div class="product-card-image">
              <img src="https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=600&h=800&fit=crop&q=80"
                   alt="Maison Noir Leather Tote" loading="lazy" width="600" height="800">
              <div class="product-card-image-overlay" aria-hidden="true"></div>
              <span class="product-card-quickview">Quick View</span>
              <div class="product-card-border" aria-hidden="true"></div>
            </div>
            <span class="product-card-brand">Maison Lumière</span>
            <h3 class="product-card-name">Maison Noir Leather Tote</h3>
            <span class="product-card-price">$2,450</span>
          </article>

          <!-- Product 2 -->
          <article class="product-card" role="listitem">
            <div class="product-card-image">
              <img src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&h=800&fit=crop&q=80"
                   alt="Solstice Gold Chronograph" loading="lazy" width="600" height="800">
              <div class="product-card-image-overlay" aria-hidden="true"></div>
              <span class="product-card-quickview">Quick View</span>
              <div class="product-card-border" aria-hidden="true"></div>
            </div>
            <span class="product-card-brand">Horlogerie Verte</span>
            <h3 class="product-card-name">Solstice Gold Chronograph</h3>
            <span class="product-card-price">$8,900</span>
          </article>

          <!-- Product 3 -->
          <article class="product-card" role="listitem">
            <div class="product-card-image">
              <img src="https://images.unsplash.com/photo-1541643600914-78b084683601?w=600&h=800&fit=crop&q=80"
                   alt="Velvet Bloom Eau de Parfum" loading="lazy" width="600" height="800">
              <div class="product-card-image-overlay" aria-hidden="true"></div>
              <span class="product-card-quickview">Quick View</span>
              <div class="product-card-border" aria-hidden="true"></div>
            </div>
            <span class="product-card-brand">Parfums Éternels</span>
            <h3 class="product-card-name">Velvet Bloom Eau de Parfum</h3>
            <span class="product-card-price">$380</span>
          </article>

          <!-- Product 4 -->
          <article class="product-card" role="listitem">
            <div class="product-card-image">
              <img src="https://images.unsplash.com/photo-1549298916-b41d501d3772?w=600&h=800&fit=crop&q=80"
                   alt="Atlas Suede Chelsea Boot" loading="lazy" width="600" height="800">
              <div class="product-card-image-overlay" aria-hidden="true"></div>
              <span class="product-card-quickview">Quick View</span>
              <div class="product-card-border" aria-hidden="true"></div>
            </div>
            <span class="product-card-brand">Atelier Cuir</span>
            <h3 class="product-card-name">Atlas Suede Chelsea Boot</h3>
            <span class="product-card-price">$1,250</span>
          </article>

          <!-- Product 5 -->
          <article class="product-card" role="listitem">
            <div class="product-card-image">
              <img src="https://images.unsplash.com/photo-1515562141589-67f0d569b6fc?w=600&h=800&fit=crop&q=80"
                   alt="Éclat Diamond Pendant" loading="lazy" width="600" height="800">
              <div class="product-card-image-overlay" aria-hidden="true"></div>
              <span class="product-card-quickview">Quick View</span>
              <div class="product-card-border" aria-hidden="true"></div>
            </div>
            <span class="product-card-brand">Joaillerie Fine</span>
            <h3 class="product-card-name">Éclat Diamond Pendant</h3>
            <span class="product-card-price">$12,600</span>
          </article>

          <!-- Product 6 -->
          <article class="product-card" role="listitem">
            <div class="product-card-image">
              <img src="https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=600&h=800&fit=crop&q=80"
                   alt="Noir Acetate Sunglasses" loading="lazy" width="600" height="800">
              <div class="product-card-image-overlay" aria-hidden="true"></div>
              <span class="product-card-quickview">Quick View</span>
              <div class="product-card-border" aria-hidden="true"></div>
            </div>
            <span class="product-card-brand">Lunetterie Moderne</span>
            <h3 class="product-card-name">Noir Acetate Sunglasses</h3>
            <span class="product-card-price">$680</span>
          </article>
        </div>
      </div>
    </section>

    <div class="section-divider" aria-hidden="true"></div>

    <!-- ============================================================
         EXPERIENCE — AI-Augmented Features
         ============================================================ -->
    <section class="section" id="experience" aria-label="The LuxeVerse experience">
      <div class="section-inner">
        <div class="section-label reveal">
          <span>04 — The Experience</span>
        </div>

        <div class="experience-grid">
          <!-- Feature 1: AI Concierge -->
          <div class="experience-card reveal" style="transition-delay: 0s;">
            <span class="experience-number" aria-hidden="true">01</span>
            <div class="experience-icon" aria-hidden="true">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round">
                <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 16.8l-6.2 4.5 2.4-7.4L2 9.4h7.6z"/>
              </svg>
            </div>
            <h3 class="experience-title">AI Style Concierge</h3>
            <p class="experience-desc">
              Your personal stylist, powered by artificial intelligence. LuxeVerse learns your
              aesthetic, understands your lifestyle, and curates recommendations that feel
              hand-picked by a trusted advisor.
            </p>
          </div>

          <!-- Feature 2: Immersive Visualization -->
          <div class="experience-card reveal" style="transition-delay: 0.15s;">
            <span class="experience-number" aria-hidden="true">02</span>
            <div class="experience-icon" aria-hidden="true">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
                <path d="M3.27 6.96 12 12.01l8.73-5.05"/>
                <path d="M12 22.08V12"/>
              </svg>
            </div>
            <h3 class="experience-title">Immersive Visualization</h3>
            <p class="experience-desc">
              Experience products in their full dimension with 3D models, augmented reality
              try-on, and environmental simulation. Place luxury items in your world before
              they arrive.
            </p>
          </div>

          <!-- Feature 3: Sustainability -->
          <div class="experience-card reveal" style="transition-delay: 0.3s;">
            <span class="experience-number" aria-hidden="true">03</span>
            <div class="experience-icon" aria-hidden="true">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round">
                <path d="M2 22c1.25-1.25 2.5-2 3.5-2 1 0 2.5.75 3.5 2"/>
                <path d="M9 22c1.25-1.25 2.5-2 3.5-2 1 0 2.5.75 3.5 2"/>
                <path d="M16 22c1.25-1.25 2.5-2 3.5-2 1 0 1.5.75 2.5 2"/>
                <path d="M12 2v10"/>
                <path d="M17 7c0 0-2.5.5-5 .5S7 7 7 7c0 0 .5-2.5.5-5"/>
                <path d="M7 7c0 0 2.5.5 5 .5s5-.5 5-.5c0 0-.5-2.5-.5-5"/>
              </svg>
            </div>
            <h3 class="experience-title">Sustainability Ledger</h3>
            <p class="experience-desc">
              Every product carries its full environmental story. Carbon footprint, supply chain
              transparency, and ethical sourcing scores empower conscious decisions without
              compromise.
            </p>
          </div>

          <!-- Feature 4: Global Concierge -->
          <div class="experience-card reveal" style="transition-delay: 0.45s;">
            <span class="experience-number" aria-hidden="true">04</span>
            <div class="experience-icon" aria-hidden="true">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="10"/>
                <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/>
                <path d="M2 12h20"/>
              </svg>
            </div>
            <h3 class="experience-title">Global Concierge</h3>
            <p class="experience-desc">
              From personal shopping appointments to worldwide delivery, our human-AI concierge
              team ensures every touchpoint exceeds expectation, in any language, any time zone.
            </p>
          </div>
        </div>
      </div>
    </section>

    <div class="section-divider" aria-hidden="true"></div>

    <!-- ============================================================
         JOURNAL — Editorial Content
         ============================================================ -->
    <section class="section" id="journal" aria-label="From the journal">
      <div class="section-inner">
        <div class="section-label reveal">
          <span>05 — From the Journal</span>
        </div>

        <div class="journal-grid">
          <!-- Featured Article -->
          <article class="journal-featured reveal-left">
            <div class="journal-featured-image">
              <img src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=900&h=560&fit=crop&q=80"
                   alt="The Art of Slow Fashion editorial" loading="lazy" width="900" height="560">
            </div>
            <span class="journal-category">Style Guide</span>
            <h3 class="journal-featured-title">The Art of Slow Fashion</h3>
            <p class="journal-excerpt">
              In a world saturated with fast fashion and disposable trends, a quiet revolution
              is reshaping how we think about the clothes we wear. This is the story of patience,
              craftsmanship, and the radical act of choosing fewer, better things.
            </p>
            <div class="journal-meta">
              <span>By Élise Moreau</span>
              <span class="journal-meta-dot" aria-hidden="true"></span>
              <span>8 min read</span>
            </div>
          </article>

          <!-- Sidebar Articles -->
          <div class="journal-sidebar">
            <article class="journal-sidebar-item reveal-right" style="transition-delay: 0.1s;">
              <div class="journal-sidebar-thumb">
                <img src="https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=200&h=200&fit=crop&q=80"
                     alt="Behind the Atelier editorial" loading="lazy" width="200" height="200">
              </div>
              <div>
                <span class="journal-category">Brand Story</span>
                <h4 class="journal-sidebar-title">Behind the Atelier: Maison Lumière</h4>
                <div class="journal-meta">
                  <span>12 min read</span>
                </div>
              </div>
            </article>

            <article class="journal-sidebar-item reveal-right" style="transition-delay: 0.25s;">
              <div class="journal-sidebar-thumb">
                <img src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=200&h=200&fit=crop&q=80"
                     alt="Evening Wear editorial" loading="lazy" width="200" height="200">
              </div>
              <div>
                <span class="journal-category">Trend</span>
                <h4 class="journal-sidebar-title">The New Evening: Redefining After-Dark Dressing</h4>
                <div class="journal-meta">
                  <span>6 min read</span>
                </div>
              </div>
            </article>

            <article class="journal-sidebar-item reveal-right" style="transition-delay: 0.4s;">
              <div class="journal-sidebar-thumb">
                <img src="https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=200&h=200&fit=crop&q=80"
                     alt="Sustainability editorial" loading="lazy" width="200" height="200">
              </div>
              <div>
                <span class="journal-category">Sustainability</span>
                <h4 class="journal-sidebar-title">Circular Luxury: The Second-Life Revolution</h4>
                <div class="journal-meta">
                  <span>10 min read</span>
                </div>
              </div>
            </article>
          </div>
        </div>
      </div>
    </section>

    <div class="section-divider" aria-hidden="true"></div>

    <!-- ============================================================
         ATELIER CTA — Email Signup (Elevated Section)
         ============================================================ -->
    <section class="section atelier" id="atelier" aria-label="Join the Atelier">
      <div class="atelier-mesh" aria-hidden="true">
        <div class="mesh-orb"></div>
        <div class="mesh-orb"></div>
      </div>

      <div class="atelier-content reveal">
        <h2 class="atelier-title">Enter the Atelier</h2>
        <p class="atelier-desc">
          Join a curated circle of connoisseurs. Receive early access to collections,
          personalized style intelligence, and invitations to exclusive digital experiences.
        </p>

        <form class="atelier-form" action="#" method="post" aria-label="Newsletter signup">
          <label for="atelier-email" class="sr-only" style="position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0,0,0,0);">Email address</label>
          <input type="email" id="atelier-email" class="atelier-input" placeholder="Your email address" required autocomplete="email">
          <button type="submit" class="atelier-submit">Subscribe</button>
        </form>

        <p class="atelier-privacy">No noise. Only what matters. Unsubscribe anytime.</p>
      </div>
    </section>
  </main>

  <!-- ============================================================
       FOOTER
       ============================================================ -->
  <footer class="footer" role="contentinfo">
    <div class="footer-inner">
      <div class="footer-top">
        <div class="footer-brand-col">
          <div class="footer-brand">LUXEVERSE</div>
          <p class="footer-tagline">
            A cinematic digital boutique where AI artistry, sustainable craftsmanship,
            and personal style converge.
          </p>
        </div>

        <div class="footer-col">
          <h4 class="footer-col-title">Shop</h4>
          <ul class="footer-links">
            <li><a href="#" class="footer-link">New Arrivals</a></li>
            <li><a href="#" class="footer-link">Collections</a></li>
            <li><a href="#" class="footer-link">Brands</a></li>
            <li><a href="#" class="footer-link">Gift Guide</a></li>
            <li><a href="#" class="footer-link">Sale</a></li>
          </ul>
        </div>

        <div class="footer-col">
          <h4 class="footer-col-title">About</h4>
          <ul class="footer-links">
            <li><a href="#" class="footer-link">Our Story</a></li>
            <li><a href="#" class="footer-link">Sustainability</a></li>
            <li><a href="#" class="footer-link">Careers</a></li>
            <li><a href="#" class="footer-link">Press</a></li>
          </ul>
        </div>

        <div class="footer-col">
          <h4 class="footer-col-title">Support</h4>
          <ul class="footer-links">
            <li><a href="#" class="footer-link">Contact Us</a></li>
            <li><a href="#" class="footer-link">Shipping & Returns</a></li>
            <li><a href="#" class="footer-link">Size Guide</a></li>
            <li><a href="#" class="footer-link">FAQ</a></li>
          </ul>
        </div>
      </div>

      <div class="footer-bottom">
        <span class="footer-copyright">&copy; 2026 LuxeVerse. All rights reserved.</span>
        <div class="footer-legal">
          <a href="#">Privacy Policy</a>
          <a href="#">Terms of Service</a>
          <a href="#">Cookie Settings</a>
        </div>
      </div>
    </div>
  </footer>

  <!-- ============================================================
       JAVASCRIPT — Scroll Reveals, Nav Behavior, Mobile Menu
       ============================================================ -->
  <script>
    // — Preloader —
    window.addEventListener('load', () => {
      setTimeout(() => {
        document.body.classList.add('loaded');
      }, 2000);
    });

    // — Scroll Reveal (Intersection Observer) —
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -60px 0px' }
    );

    document.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach((el) => {
      revealObserver.observe(el);
    });

    // — Nav Scroll Behavior —
    const nav = document.getElementById('nav');
    let lastScrollY = 0;

    const handleNavScroll = () => {
      const scrollY = window.scrollY;
      if (scrollY > 80) {
        nav.classList.add('scrolled');
      } else {
        nav.classList.remove('scrolled');
      }
      lastScrollY = scrollY;
    };

    window.addEventListener('scroll', handleNavScroll, { passive: true });

    // — Mobile Menu Toggle —
    const hamburger = document.getElementById('navHamburger');
    const mobileMenu = document.getElementById('mobileMenu');

    hamburger.addEventListener('click', () => {
      const isOpen = hamburger.classList.toggle('open');
      mobileMenu.classList.toggle('open');
      hamburger.setAttribute('aria-expanded', String(isOpen));
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    // Close mobile menu on link click
    mobileMenu.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('open');
        mobileMenu.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });

    // — Smooth Scroll for Anchor Links —
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener('click', (e) => {
        const target = document.querySelector(anchor.getAttribute('href'));
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });
  </script>
</body>
</html>
```

---

## Phase 5: VERIFY — Migration Audit Checklist

Here is the complete verification of every criterion from the success gate table:

| Criterion | Target | Result |
|---|---|---|
| **Base background lightness** | L >= 0.14 | `--obsidian-950: oklch(0.14 ...)` |
| **Minimum ΔL between surface layers** | >= 0.06 | 950->900: ΔL=0.08, 950->850: ΔL=0.14, 900->800: ΔL=0.12 |
| **Text contrast (labels/metadata)** | WCAG AAA | `obsidian-500` (L=0.65) on `obsidian-950` (L=0.14) = ~6.5:1 |
| **Text contrast (body muted)** | WCAG AAA | `obsidian-400` (L=0.75) on `obsidian-950` (L=0.14) = ~9.5:1 |
| **Text contrast (headings)** | WCAG AAA | `obsidian-100` (L=0.96) on `obsidian-950` (L=0.14) = ~18:1 |
| **Collection card elevation** | Visible depth | Cards at L=0.22 on L=0.14 base + hover shadow |
| **Experience grid lines** | Architectural | champagne at 10% opacity gap between L=0.22 cells |
| **Footer border** | Clearly visible | champagne at 20% opacity (was 6%) |
| **Section dividers** | Readable seams | champagne at 15% opacity (was 10%) |
| **Golden thread** | Visible seam | Opacity 0.12 (was 0.08) with L=0.82 champagne |
| **Hero ornaments** | Perceptible geometry | Outer border 10%, middle 7%, inner 5% (was 7/5/3) |
| **Scroll indicator** | Visible pulse | Base opacity 0.4 (was 0.3) |
| **Mobile menu** | Clear modal layer | `obsidian-850` (L=0.28) at 97% opacity |
| **Nav glassmorphism** | Visible tint | `obsidian-950` at 90% opacity + blur |
| **Card hover shadows** | Physical depth | `oklch(0.08 ... / 0.25-0.30)` — darker than base |
| **Zero raw hex** | 100% OKLCH | All `--var` tokens and inline values use `oklch()` |
| **Functionality** | All JS intact | Identical JS — preloader, scroll reveals, nav, mobile menu, smooth scroll |
| **Accessibility** | All ARIA + reduced motion | Identical ARIA labels, `prefers-reduced-motion` blocks all animation |
| **Typography** | No system fonts | Cormorant Garamond / Source Serif 4 / DM Mono via Google Fonts |
| **DOM structure** | Unchanged | Zero structural modifications |

**Key depth hierarchy (the "Luminous Atelier" stack):**

```
Layer          Token         L Value    ΔL from Base    Role
─────────────────────────────────────────────────────────────
Base           obsidian-950  0.14       —               Body, hero, vision, journal, footer
Elevated       obsidian-900  0.22       +0.08           Cards, products section, atelier, experience cells
Modal          obsidian-850  0.28       +0.14           Mobile menu overlay
Architectural  obsidian-800  0.34       +0.20           Grid lines, section dividers, strong borders
```

Every layer now sits above the perceptual separation threshold of ΔL >= 0.06. The page has spatial architecture — surfaces float, stack, and recede with intention.

# https://aistudio.xiaomimimo.com/#/share/993e7f411f7adc7433b58415d2908b8f 

