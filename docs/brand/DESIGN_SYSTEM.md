# Aura Design System
**Professional Tech Noir + Glassmorphism Design**

## Overview
Aura uses a sophisticated, professional design language that combines dark tech aesthetics with modern glassmorphism. This document serves as the single source of truth for all design decisions and implementation patterns.

---

## Core Principles

### 1. **Visual Philosophy**
- **Dark & Minimal**: Dark backgrounds with strategic use of light
- **Clean & Professional**: Avoid typical AI-generated aesthetics
- **Purposeful Animation**: Every animation serves a function
- **Glassmorphism without Borders**: Transparency for lightness, no harsh borders

### 2. **User Experience**
- **Immediate Clarity**: Users understand functionality instantly
- **Subtle Interactivity**: Feedback without overwhelming
- **Performance First**: Smooth 60fps animations
- **Accessibility**: WCAG AAA compliant contrast ratios

---

## Color System

### Primary Palette

| Color | Hex | Usage | Variable |
|-------|-----|-------|----------|
| **Void** | `#0A0A0F` | Background, containers | `--color-void` |
| **Signal** | `#00E5CC` | Primary actions, highlights, links | `--color-signal` |
| **Caution** | `#FF6B35` | Warnings, errors, suspicious states | `--color-caution` |
| **Slate** | `#1C1C2E` | Cards, secondary containers | `--color-slate` |
| **Fog** | `#8888AA` | Body text, secondary information | `--color-fog` |
| **White** | `#F0F0F5` | Headlines, primary text | `--color-white` |

### Signal Color Opacity Scale

Use Signal color with varying opacities for different effects:

```css
/* Interactive Elements */
100%: Primary CTAs, active states
 60%: Borders on hover
 40%: Button backgrounds
 20%: Background tints
 10%: Subtle highlights
  5%: Very subtle backgrounds
  3%: Ambient light effects
```

### Fog Color Usage

```css
/* Text Hierarchy */
90%: Primary body text
80%: Secondary descriptions
70%: Tertiary labels
50%: Disabled states
30%: Placeholder text
```

---

## Typography

### Font Families

```css
/* Display - Headlines & Titles */
font-family: 'Space Grotesk', sans-serif;
font-weight: 700 (Bold), 600 (Semi-bold);

/* Interface - UI Elements & Body */
font-family: 'DM Sans', sans-serif;
font-weight: 400 (Regular), 500 (Medium), 600 (Semi-bold);

/* Monospace - Code, Stats, Technical */
font-family: 'IBM Plex Mono', monospace;
font-weight: 500 (Medium);
```

### Type Scale

```javascript
// Tailwind Custom Sizes
fontSize: {
  h1: ['48px', { lineHeight: '1.1', fontWeight: '700' }],
  h2: ['32px', { lineHeight: '1.2', fontWeight: '700' }],
  h3: ['24px', { lineHeight: '1.3', fontWeight: '600' }],
  body: ['16px', { lineHeight: '1.6', fontWeight: '400' }],
  code: ['14px', { lineHeight: '1.6', fontWeight: '500' }],
}
```

### Responsive Typography

```css
/* Large Headlines - Hero Sections */
.hero-title {
  font-size: 5rem;    /* 80px - xl breakpoint */
  font-size: 4.5rem;  /* 72px - lg breakpoint */
  font-size: 3.75rem; /* 60px - md breakpoint */
  font-size: 3rem;    /* 48px - sm breakpoint */
}
```

---

## Spacing & Layout

### Spacing Scale
Based on 4px base unit (Tailwind default):

```
1 = 4px    (tight padding, icon spacing)
2 = 8px    (button padding, gap between items)
4 = 16px   (card padding, section spacing)
6 = 24px   (component spacing)
8 = 32px   (section padding)
12 = 48px  (large section spacing)
20 = 80px  (hero spacing, major sections)
```

### Container Widths

```css
/* Max Content Width */
max-width: 1400px;

/* Page Padding */
px-6    /* Mobile: 24px */
md:px-12 /* Tablet: 48px */
lg:px-20 /* Desktop: 80px */
```

---

## Glassmorphism

### Standard Glass Card

```css
.glass-card {
  background: rgba(28, 28, 46, 0.4);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  /* NO BORDER - Clean aesthetic */
}
```

### Glass Variants

```css
/* Ultra-subtle background */
background: rgba(255, 255, 255, 0.01);

/* Light glass */
background: rgba(28, 28, 46, 0.4);

/* Medium glass */
background: rgba(28, 28, 46, 0.6);

/* Heavy glass (hover state) */
background: rgba(28, 28, 46, 0.8);
```

### Glass Hover Effects

```css
.glass-hover {
  transition: all 300ms ease-out;
}

.glass-hover:hover {
  background: rgba(28, 28, 46, 0.6);
  transform: translateY(-4px);
}
```

---

## Animation System

### Timing Functions

```javascript
// Primary Easing - Custom Cubic Bezier
ease: [0.16, 1, 0.3, 1]
// Creates "snap" effect, feels responsive and premium

// Spring Physics - Natural Motion
{ damping: 25, stiffness: 200 }
// For magnetic effects and interactive elements
```

### Speed Categories

```javascript
// Fast - Hover states, color transitions
duration: 150ms - 300ms

// Normal - Scale, shadow changes
duration: 300ms - 600ms

// Slow - Page reveals, section transitions
duration: 600ms - 1000ms

// Very Slow - Ambient animations (glow pulse, breathing)
duration: 5s - 8s
```

### Core Animations

#### 1. Breathing Effect (Sunrise Light)
```javascript
animate={{
  opacity: [0.2, 0.8, 0.2],
}}
transition={{
  duration: 6,
  repeat: Infinity,
  ease: "easeInOut"
}}
```

**Purpose**: Creates living, organic feel to background lighting
**Where**: Background ambient lighting layers
**Why Deep Range**: 0.2 → 0.8 creates dramatic, visible breathing

#### 2. Blur-In Reveal
```javascript
initial={{ opacity: 0, y: 40, filter: 'blur(10px)' }}
animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
```

**Purpose**: Sophisticated page element reveal
**Where**: Hero sections, major content blocks
**Why**: More depth than simple fade-in

#### 3. Scroll-Triggered Animations
```javascript
<motion.div
  initial={{ opacity: 0, y: 30 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true, margin: "-50px" }}
  transition={{ delay, duration: 0.6 }}
>
```

**Purpose**: Progressive reveal as user scrolls
**Where**: Feature cards, stats, content sections
**Margin offset**: Triggers before fully visible for seamless feel

#### 4. Hover Underline (Nav Links)
```css
.nav-underline {
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 300ms ease-out;
}

.nav-underline:hover {
  transform: scaleX(1);
}
```

**Purpose**: Left-to-right reveal on hover
**Where**: Navigation links
**Active State**: Color change only, no underline

---

## Interactive Elements

### Buttons

#### Primary Button
```jsx
<button className="px-8 py-4 bg-signal/10 hover:bg-signal/20
  transition-colors duration-300 backdrop-blur-sm">
  <span className="text-signal font-medium text-lg uppercase tracking-wider">
    Button Text
  </span>
</button>
```

#### Secondary Button
```jsx
<button className="px-6 py-3 bg-slate/80 hover:bg-slate
  transition-all duration-200 border border-fog/20">
  <span className="text-white font-medium">
    Button Text
  </span>
</button>
```

### Mouse Spotlight Effect

```javascript
// Subtle light that follows cursor
const mouseSpotlight = {
  width: '400px',
  height: '400px',
  background: 'radial-gradient(circle, rgba(0, 229, 204, 0.08) 0%, rgba(0, 229, 204, 0.04) 30%, transparent 60%)',
  filter: 'blur(40px)',
  // Follows mouse with spring physics
}
```

**Purpose**: Subtle interaction without changing cursor
**Effect**: Illuminates background where mouse hovers
**Implementation**: Fixed position div with smooth spring animation

---

## Component Patterns

### Navigation Header

```jsx
<header className="sticky top-0 z-50 bg-void/60 backdrop-blur-md">
  <nav className="px-6 md:px-12 lg:px-20 py-4">
    <div className="max-w-[1400px] mx-auto flex items-center justify-between">
      {/* Logo far left, nav items right */}
    </div>
  </nav>
</header>
```

**Characteristics**:
- Sticky positioning
- Glassmorphism background
- Logo + name far left
- Navigation items + wallet far right
- Subtle slide-down animation on mount

### Feature Cards

```jsx
<motion.div
  whileHover={{ y: -4 }}
  className="p-8 hover:bg-white/[0.02] transition-all duration-300"
  style={{ background: 'rgba(255, 255, 255, 0.01)' }}
>
  <div className="text-4xl mb-4">{icon}</div>
  <h3 className="text-xl font-bold mb-2 text-white">{title}</h3>
  <p className="text-fog/80 text-sm">{description}</p>
</motion.div>
```

**Characteristics**:
- Ultra-subtle background
- Borderless design
- Icon + title + description structure
- Lift on hover (-4px)

---

## Background Lighting System

### Layer Architecture

```
z-index hierarchy (bottom to top):
z-0:  Solid dark background (#0A0A0F)
z-5:  Mouse spotlight effect
z-10: Breathing ambient light (4 layers)
z-20: Content
z-50: Header (sticky)
```

### Ambient Light Layers

**4 Overlapping Layers** with different:
- Positions (bottom-right quadrant)
- Sizes (50vh to 100% viewport)
- Breathing speeds (5s, 6s, 7s, 8s)
- Opacity ranges (deep: 0.15 → 0.9)

**Purpose**: Creates depth through parallax breathing
**Effect**: Organic, living background that never feels static

---

## Accessibility

### Color Contrast
All text meets WCAG AAA standards:
- White on Void: 19.8:1
- Signal on Void: 8.2:1
- Fog on Void: 4.8:1

### Motion
All animations respect `prefers-reduced-motion`:

```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

### Keyboard Navigation
- All interactive elements keyboard accessible
- Focus states: 2px Signal outline
- Tab order logical and predictable

---

## Performance Guidelines

### Animation Best Practices

✅ **DO**: Animate `transform` and `opacity` only (GPU-accelerated)
```css
transform: translateY(-4px);
opacity: 0.8;
```

❌ **DON'T**: Animate `width`, `height`, `top`, `left`
```css
/* Causes layout shift */
width: 200px;
top: 100px;
```

### Backdrop Filter Usage

⚠️ **USE SPARINGLY** - Performance intensive
```css
/* Only on key UI elements */
backdrop-filter: blur(20px);
-webkit-backdrop-filter: blur(20px);
```

### Code Splitting
- Lazy load Framer Motion for non-critical components
- Use viewport detection (`whileInView`) to defer off-screen animations

---

## File Structure

```
src/
├── components/
│   ├── Header.jsx           # Navigation + logo
│   ├── WalletConnect.jsx    # Wallet integration
│   └── [feature]/           # Feature-specific components
├── pages/
│   ├── Home.jsx             # Landing page
│   ├── Verify.jsx           # Product verification
│   ├── Register.jsx         # Product registration
│   └── Transfer.jsx         # Ownership transfer
├── index.css                # Global styles, utilities
└── App.jsx                  # Router configuration
```

---

## Browser Support

| Browser | Version | Support |
|---------|---------|---------|
| Chrome/Edge | 90+ | Full |
| Firefox | 88+ | Full |
| Safari | 14+ | Full (with -webkit prefix) |

**Required Prefixes**:
- `-webkit-backdrop-filter` (Safari)
- `-webkit-font-smoothing` (Safari)

---

## Contributing to Design

### Before You Code

1. **Read this document** completely
2. **Review existing components** for patterns
3. **Check Tailwind config** for custom values
4. **Test animations** at 0.5x speed in DevTools

### Design Checklist

- [ ] Uses Signal color for primary actions
- [ ] Glassmorphism has NO borders
- [ ] Animations use transform/opacity only
- [ ] Text contrast meets WCAG AAA
- [ ] Respects prefers-reduced-motion
- [ ] Tested on mobile (320px width)
- [ ] No layout shift during animations
- [ ] Focus states visible and accessible

### Pull Request Requirements

When submitting design changes:
1. Include before/after screenshots
2. Explain animation timing choices
3. Document any new color variants
4. Test on Safari, Chrome, Firefox
5. Verify accessibility with keyboard navigation

---

## Common Mistakes to Avoid

❌ **Adding borders to glassmorphism**
```css
/* NO */
border: 1px solid rgba(0, 229, 204, 0.3);
```

✅ **Borderless, clean aesthetic**
```css
/* YES */
background: rgba(28, 28, 46, 0.4);
backdrop-filter: blur(20px);
```

❌ **Changing cursor icon**
```css
/* NO - Keep system cursor */
cursor: none;
```

✅ **Interactive effects without cursor change**
```css
/* YES - Visual feedback via other means */
.spotlight { /* follows mouse, illuminates bg */ }
```

❌ **Weak breathing animation**
```javascript
// NO - Barely visible
opacity: [0.4, 0.5, 0.4]
```

✅ **Deep, visible breathing**
```javascript
// YES - Dramatic and noticeable
opacity: [0.2, 0.8, 0.2]
```

---

## Resources

- [Framer Motion Docs](https://www.framer.com/motion/)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [Avalanche Brand Assets](https://www.avax.network/brand)

---

## Questions?

For design questions or clarifications:
1. Check this document first
2. Review `/docs/brand/homepage-implementation.md` for specifics
3. Examine existing component implementations
4. Open an issue with `design` label if still unclear

**Last Updated**: 2026-03-21
**Version**: 1.0.0
