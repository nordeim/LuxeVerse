# LuxeVerse Design Tokens

## OKLCH Color Palette

| Token | OKLCH Value | Usage |
|---|---|---|
| `obsidian-50` | `oklch(0.98 0.002 260)` | Primary background |
| `obsidian-900` | `oklch(0.12 0.005 260)` | Primary text |
| `obsidian-950` | `oklch(0.08 0.003 260)` | Dark backgrounds, luxury buttons |
| `neon-cyan` | `oklch(0.85 0.18 190)` | Focus rings, accents |
| `neon-pink` | `oklch(0.65 0.28 350)` | Sale, alerts |
| `metallic-champagne` | `oklch(0.88 0.06 75)` | Primary CTA, luxury accents |
| `metallic-gold` | `oklch(0.78 0.14 85)` | Hover states, highlights |

## Typography

| Role | Font | Weight |
|---|---|---|
| Display | Cormorant Garamond | 300-700 |
| Body | DM Sans | 400-700 |
| Mono | JetBrains Mono | 400 |

## Spacing (Golden Ratio)

```
3xs: 0.236rem
2xs: 0.382rem
xs:  0.618rem
sm:  1rem
md:  1.618rem
lg:  2.618rem
xl:  4.236rem
2xl: 6.854rem
```

## Easing Curves

| Name | Value | Usage |
|---|---|---|
| `ease-out-expo` | `cubic-bezier(0.19, 1, 0.22, 1)` | Exits, fades |
| `ease-spring` | `cubic-bezier(0.175, 0.885, 0.32, 1.275)` | Buttons, toggles |
| `ease-luxe` | `cubic-bezier(0.25, 0.1, 0.25, 1)` | General transitions |
| `ease-dramatic` | `cubic-bezier(0.77, 0, 0.175, 1)` | Hero reveals |

## Anti-Generic Litmus Test

- [ ] No purple/indigo gradients
- [ ] No rounded-2xl everything
- [ ] No stock card grids without purpose
- [ ] No Inter/Roboto without typographic hierarchy
- [ ] Every pixel justifies its existence
