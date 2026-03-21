# Quick Reference Guide
Fast lookup for common patterns and values in Aura

---

## Colors

```javascript
// Copy-paste ready
className="text-signal"     // #00E5CC - Primary actions
className="text-caution"    // #FF6B35 - Warnings
className="text-fog"        // #8888AA - Body text
className="text-white"      // #F0F0F5 - Headlines
className="bg-void"         // #0A0A0F - Background
className="bg-slate"        // #1C1C2E - Cards
```

## Opacity Scale

```javascript
// Signal color with opacity
bg-signal/100   // Full
bg-signal/60    // Borders hover
bg-signal/40    // Button backgrounds
bg-signal/20    // Background tints
bg-signal/10    // Subtle highlights
bg-signal/5     // Very subtle
bg-signal/3     // Ambient light
```

---

## Typography

```javascript
// Font families
font-display    // Space Grotesk - Headlines
font-sans       // DM Sans - UI/Body
font-mono       // IBM Plex Mono - Code/Stats
```

---

## Glassmorphism

```jsx
// Standard glass card
<div className="bg-slate/40 backdrop-blur-xl">
  {/* NO BORDERS */}
</div>

// Subtle glass
<div style={{ background: 'rgba(255, 255, 255, 0.01)' }}>
  {/* Ultra-subtle */}
</div>
```

---

## Animations

### Common Patterns

```jsx
// Fade + Slide up on scroll
<motion.div
  initial={{ opacity: 0, y: 30 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true }}
  transition={{ duration: 0.6 }}
>

// Hover lift
<motion.div
  whileHover={{ y: -4 }}
  transition={{ duration: 0.3 }}
>

// Breathing (background lights)
animate={{
  opacity: [0.2, 0.8, 0.2],
}}
transition={{
  duration: 6,
  repeat: Infinity,
  ease: "easeInOut"
}}
```

### Easing

```javascript
// Custom cubic-bezier
ease: [0.16, 1, 0.3, 1]

// Spring physics
{ damping: 25, stiffness: 200 }
```

---

## Spacing

```javascript
// Page padding
px-6 md:px-12 lg:px-20

// Container max-width
max-w-[1400px]

// Section spacing
py-12    // Small
py-20    // Medium
py-32    // Large
```

---

## Buttons

```jsx
// Primary
<button className="px-8 py-4 bg-signal/10 hover:bg-signal/20
  transition-colors duration-300 backdrop-blur-sm">
  <span className="text-signal font-medium text-lg uppercase tracking-wider">
    Action
  </span>
</button>

// Secondary
<button className="px-6 py-3 bg-slate/80 hover:bg-slate
  transition-all duration-200 border border-fog/20">
  <span className="text-white font-medium">
    Action
  </span>
</button>
```

---

## Navigation

```jsx
// Active state - Color only, NO underline
className={active ? 'text-signal' : 'text-fog hover:text-white'}

// Hover underline - Left to right animation
<span className="absolute -bottom-1 left-0 h-0.5 bg-signal w-full
  origin-left scale-x-0 group-hover:scale-x-100
  transition-transform duration-300 ease-out"
/>
```

---

## Z-Index Stack

```javascript
z-0   // Solid background
z-5   // Mouse spotlight
z-10  // Ambient lighting
z-20  // Page content
z-50  // Sticky header
```

---

## Responsive Breakpoints

```javascript
// Tailwind defaults
sm:   640px
md:   768px
lg:   1024px
xl:   1280px
2xl:  1536px
```

---

## Common Mistakes

❌ **DON'T:**
```jsx
// No borders on glass
border border-signal

// Don't animate layout
whileHover={{ width: 200 }}

// Don't change cursor
cursor: none

// Weak breathing
opacity: [0.4, 0.5, 0.4]
```

✅ **DO:**
```jsx
// Borderless glass
backdrop-blur-xl

// Animate transform/opacity
whileHover={{ y: -4, opacity: 0.9 }}

// Keep system cursor
// (add spotlight effect instead)

// Deep breathing
opacity: [0.2, 0.8, 0.2]
```

---

## File Locations

```
docs/brand/DESIGN_SYSTEM.md          # Full design docs
docs/brand/homepage-implementation.md # Implementation details
docs/CONTRIBUTING.md                  # Contribution guide
tailwind.config.js                    # Custom theme
src/index.css                         # Global styles
```

---

## Performance Checklist

- [ ] Animate only `transform` and `opacity`
- [ ] Use `backdrop-filter` sparingly
- [ ] Lazy load Framer Motion where possible
- [ ] Use `viewport={{ once: true }}` for scroll animations
- [ ] Test at 0.5x speed in Chrome DevTools

---

## Accessibility Quick Check

```javascript
// Keyboard navigation
Tab, Shift+Tab, Enter, Esc

// Focus states
focus:outline focus:outline-2 focus:outline-signal

// Color contrast (all meet WCAG AAA)
White on Void: 19.8:1 ✓
Signal on Void: 8.2:1 ✓
Fog on Void: 4.8:1 ✓
```

---

## Need More Detail?

👉 See `/docs/brand/DESIGN_SYSTEM.md` for complete documentation
