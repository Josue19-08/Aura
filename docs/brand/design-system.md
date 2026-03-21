# Aura Design System
## Tech Noir + Glassmorphism Hybrid

### Core Principles
1. **Sophistication over Flash** - Subtle, refined interactions
2. **Transparency as Trust** - Glassmorphism represents blockchain transparency
3. **Depth through Layering** - Visual hierarchy through z-space
4. **Purposeful Animation** - Every motion has intent

---

## Visual Language

### Background System
**Sunrise Gradient (Bottom-up)**
- Base: `#0A0A0F` (Void)
- Mid: `#00E5CC` at 15% opacity
- Glow: Radial gradient from bottom center
- Creates ethereal "dawn" effect symbolizing new trust era

### Glassmorphism Specifications
```css
.glass-card {
  background: rgba(28, 28, 46, 0.4);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(0, 229, 204, 0.1);
  box-shadow:
    0 8px 32px rgba(0, 0, 0, 0.4),
    inset 0 1px 1px rgba(255, 255, 255, 0.05);
}

.glass-card-hover {
  border: 1px solid rgba(0, 229, 204, 0.3);
  box-shadow:
    0 8px 32px rgba(0, 229, 204, 0.15),
    inset 0 1px 1px rgba(0, 229, 204, 0.1);
}
```

### Glow Effects
**Signal Glow** (Primary accent)
```css
.signal-glow {
  box-shadow: 0 0 20px rgba(0, 229, 204, 0.3);
}

.signal-glow-intense {
  box-shadow:
    0 0 30px rgba(0, 229, 204, 0.4),
    0 0 60px rgba(0, 229, 204, 0.2);
}
```

---

## Animation Principles

### Motion Values
- **Duration Fast:** 150ms - Micro-interactions
- **Duration Normal:** 300ms - Standard transitions
- **Duration Slow:** 500ms - Page transitions
- **Easing:** cubic-bezier(0.4, 0, 0.2, 1) - Natural motion

### Signature Animations

**1. Fade-in-up with blur**
```
opacity: 0 → 1
translateY: 20px → 0
filter: blur(10px) → blur(0)
duration: 500ms
```

**2. Scale with glow**
```
scale: 0.98 → 1
box-shadow: none → signal-glow
duration: 300ms
```

**3. Reveal with clip-path**
```
clip-path: inset(0 100% 0 0) → inset(0 0 0 0)
duration: 600ms
stagger: 100ms
```

---

## Interactive Elements

### Cursor Effects
**Magnetic Hover** - Elements subtly move toward cursor
```javascript
// Max movement: 10px
// Smooth transition: 150ms
// Applies to: CTA buttons, cards
```

**Glow Trail** - Subtle signal glow follows cursor on interactive areas
```javascript
// Glow radius: 100px
// Opacity: 0.1
// Blur: 40px
```

### Button Variants

**Primary (Glass)**
- Base: Glass card with signal border
- Hover: Scale 1.02 + signal glow
- Active: Scale 0.98
- Ripple effect on click (signal color)

**Secondary (Outline)**
- Base: Transparent with signal border
- Hover: Fill with signal at 10% opacity
- Border glow increases

**Tertiary (Ghost)**
- Base: Transparent
- Hover: Background fog at 5% opacity
- Text color: fog → signal

---

## Typography Hierarchy

### Display (Space Grotesk)
```css
.display-1 {
  font-size: 4.5rem;      /* 72px */
  font-weight: 700;
  line-height: 1.1;
  letter-spacing: -0.02em;
}

.display-2 {
  font-size: 3rem;        /* 48px */
  font-weight: 700;
  line-height: 1.2;
}
```

### Technical (IBM Plex Mono)
```css
.code {
  font-family: 'IBM Plex Mono';
  font-size: 0.875rem;
  background: rgba(0, 229, 204, 0.05);
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
}
```

---

## Component Patterns

### Hero Section
- Full viewport height
- Sunrise gradient background
- Centered content with fade-in-up animation
- Floating glass cards with parallax
- Subtle particle system (optional)

### Feature Cards
- 3-column grid on desktop
- Glass effect with signal border
- Hover: Lift (translateY: -8px) + glow
- Icon with signal glow
- Stagger animation on scroll

### Stats Display
- Monospace numbers (IBM Plex Mono)
- Count-up animation on viewport enter
- Signal accent on significant metrics
- Glass container with subtle border

---

## Accessibility

### Focus States
```css
.focus-visible {
  outline: 2px solid #00E5CC;
  outline-offset: 4px;
  border-radius: 4px;
}
```

### Motion Preferences
```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## Dark Mode (Default)
All designs default to dark theme. Light mode not planned for v1.

## Performance
- Use `will-change` sparingly
- Prefer `transform` and `opacity` for animations
- Use `backdrop-filter` with caution (GPU intensive)
- Lazy load images
- Code-split animations

---

## Implementation Checklist
- [ ] Sunrise gradient background
- [ ] Glass card components
- [ ] Cursor tracking system
- [ ] Scroll-triggered animations
- [ ] Magnetic button effects
- [ ] Signal glow on interaction
- [ ] Blur-in page transitions
- [ ] Particle system (optional)
- [ ] Smooth scroll
- [ ] Responsive breakpoints
