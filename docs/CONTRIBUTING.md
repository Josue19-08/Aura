# Contributing to Aura

Thank you for your interest in contributing to Aura! This document provides guidelines and standards for contributing to the project.

---

## Table of Contents

1. [Getting Started](#getting-started)
2. [Code Style](#code-style)
3. [Design System](#design-system)
4. [Component Guidelines](#component-guidelines)
5. [Git Workflow](#git-workflow)
6. [Pull Request Process](#pull-request-process)
7. [Testing](#testing)

---

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Git
- Basic knowledge of React, Tailwind CSS, and Framer Motion

### Local Development Setup

```bash
# Clone the repository
git clone https://github.com/yourusername/aura.git
cd aura

# Install dependencies
cd frontend && npm install
cd ../backend && npm install

# Start development servers
# Terminal 1 - Frontend
cd frontend && npm run dev

# Terminal 2 - Backend
cd backend && npm run dev
```

Frontend runs on: `http://localhost:5173`
Backend runs on: `http://localhost:3000`

---

## Code Style

### JavaScript/React

#### General Rules

- Use functional components with hooks (no class components)
- Use ES6+ features (arrow functions, destructuring, spread operator)
- Prefer `const` over `let`, never use `var`
- Use meaningful, descriptive variable names

#### Example Component Structure

```jsx
import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'

export default function ComponentName({ prop1, prop2 }) {
  // 1. Hooks
  const [state, setState] = useState(initialValue)

  useEffect(() => {
    // Effect logic
  }, [dependencies])

  // 2. Event handlers
  const handleClick = () => {
    // Handler logic
  }

  // 3. Render
  return (
    <motion.div
      className="..."
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {/* Component content */}
    </motion.div>
  )
}

// 4. Sub-components (if any)
function SubComponent({ children }) {
  return <div>{children}</div>
}
```

### CSS/Tailwind

#### Class Ordering Convention

```jsx
<div className="
  {/* Layout */}
  relative flex items-center justify-between

  {/* Spacing */}
  px-6 py-4 gap-4

  {/* Sizing */}
  w-full max-w-[1400px]

  {/* Appearance */}
  bg-void/60 backdrop-blur-md
  text-white font-medium

  {/* Transitions */}
  transition-all duration-300

  {/* Responsive */}
  md:px-12 lg:px-20
">
```

#### Custom Classes

Only create custom CSS classes when:
- Pattern is used 3+ times
- Tailwind utilities become too verbose
- Browser-specific prefixes needed

```css
/* Good - Reusable utility */
.glass {
  background: rgba(28, 28, 46, 0.4);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
}

/* Bad - Should use Tailwind */
.my-button {
  padding: 1rem 2rem;
  background-color: #00E5CC;
}
```

---

## Design System

### MUST READ

Before making any UI changes, **thoroughly read**:
- `/docs/brand/DESIGN_SYSTEM.md` - Complete design system documentation
- `/docs/brand/homepage-implementation.md` - Implementation specifics

### Key Design Principles

1. **Dark Tech Noir Aesthetic**
   - Dark backgrounds (#0A0A0F)
   - Strategic use of Signal color (#00E5CC)
   - Glassmorphism WITHOUT borders

2. **Animation Philosophy**
   - Every animation has purpose
   - Use transform/opacity only (GPU-accelerated)
   - Respect `prefers-reduced-motion`

3. **Accessibility First**
   - WCAG AAA contrast ratios
   - Keyboard navigation support
   - Screen reader friendly

### Color Usage

```javascript
// Primary Colors
Signal: '#00E5CC'  // Actions, highlights, success
Caution: '#FF6B35' // Warnings, errors
Fog: '#8888AA'     // Body text, secondary
White: '#F0F0F5'   // Headlines, primary text

// Always use with proper opacity
className="text-signal"           // Full opacity
className="bg-signal/10"          // 10% opacity
className="border-signal/30"      // 30% opacity
```

---

## Component Guidelines

### Creating New Components

1. **File Naming**: PascalCase (e.g., `FeatureCard.jsx`)
2. **Single Responsibility**: One component, one purpose
3. **Props Validation**: Document expected props in comments
4. **Export**: Default export for main component

```jsx
/**
 * FeatureCard - Displays a single feature with icon, title, description
 *
 * @param {string} icon - Emoji or icon component
 * @param {string} title - Feature title
 * @param {string} description - Feature description
 * @param {number} delay - Animation delay for stagger effect
 */
export default function FeatureCard({ icon, title, description, delay }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.6 }}
      className="p-8 hover:bg-white/[0.02] transition-all"
    >
      <div className="text-4xl mb-4">{icon}</div>
      <h3 className="text-xl font-bold mb-2 text-white">{title}</h3>
      <p className="text-fog/80 text-sm">{description}</p>
    </motion.div>
  )
}
```

### Animation Guidelines

**✅ DO:**
```jsx
// Animate transform and opacity
<motion.div
  whileHover={{ y: -4, opacity: 0.8 }}
  transition={{ duration: 0.3 }}
>
```

**❌ DON'T:**
```jsx
// Don't animate layout properties
<motion.div
  whileHover={{ width: 200, height: 100 }}
>
```

### Responsive Design

Use Tailwind breakpoints consistently:

```jsx
<div className="
  px-6          {/* Mobile: 24px */}
  md:px-12      {/* Tablet: 48px */}
  lg:px-20      {/* Desktop: 80px */}

  text-3xl      {/* Mobile */}
  md:text-4xl   {/* Tablet */}
  lg:text-5xl   {/* Desktop */}
">
```

---

## Git Workflow

### Branch Naming

```bash
feature/add-wallet-integration
fix/header-mobile-overflow
design/update-button-styles
docs/add-api-documentation
```

### Commit Messages

Follow conventional commits format:

```bash
# Format
<type>(<scope>): <description>

[optional body]

[optional footer]

# Examples
feat(verify): add QR code scanning functionality
fix(header): correct mobile navigation overflow
design(home): update breathing animation timing
docs(api): document authentication endpoints
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `design`: Design/UI changes
- `docs`: Documentation
- `refactor`: Code refactoring
- `test`: Adding tests
- `chore`: Maintenance tasks

### NO Co-Authored-By

**IMPORTANT**: Do not include AI attribution in commits:

```bash
# ❌ DON'T
git commit -m "Add feature

Co-Authored-By: Claude Sonnet <noreply@anthropic.com>"

# ✅ DO
git commit -m "feat(verify): add QR code scanning"
```

---

## Pull Request Process

### Before Submitting

- [ ] Code follows style guidelines
- [ ] Design adheres to design system
- [ ] All tests pass
- [ ] No console errors or warnings
- [ ] Tested on Chrome, Firefox, Safari
- [ ] Tested on mobile (responsive)
- [ ] Keyboard navigation works
- [ ] Meets accessibility standards

### PR Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] New feature
- [ ] Bug fix
- [ ] Design update
- [ ] Documentation

## Screenshots
Include before/after screenshots for UI changes

## Testing
- [ ] Tested locally
- [ ] Tested on mobile
- [ ] Tested keyboard navigation
- [ ] Tested across browsers

## Checklist
- [ ] Follows design system guidelines
- [ ] Code is well-commented
- [ ] No breaking changes
- [ ] Documentation updated (if needed)
```

### Review Process

1. Automated checks must pass
2. At least one approval required
3. Design changes reviewed by design lead
4. Merge to `main` after approval

---

## Testing

### Frontend Testing

```bash
cd frontend
npm run test
```

### Manual Testing Checklist

- [ ] All links navigate correctly
- [ ] Forms validate properly
- [ ] Animations run smoothly (60fps)
- [ ] No layout shift during load
- [ ] Images load correctly
- [ ] Wallet connection works
- [ ] Responsive on 320px, 768px, 1440px
- [ ] Dark mode only (no light mode bugs)

### Accessibility Testing

```bash
# Use keyboard only
Tab       - Navigate forward
Shift+Tab - Navigate backward
Enter     - Activate buttons/links
Esc       - Close modals

# Test with screen reader
# macOS: VoiceOver (Cmd+F5)
# Windows: NVDA (free)
```

---

## Common Issues & Solutions

### Issue: Animations janky or slow

**Solution**:
- Only animate `transform` and `opacity`
- Check for layout shifts
- Reduce blur amounts
- Test performance in DevTools

### Issue: Glassmorphism not working

**Solution**:
- Add `-webkit-backdrop-filter` prefix
- Check browser support
- Verify rgba background is set

### Issue: Cursor changed unexpectedly

**Solution**:
- Don't add `cursor: none` or custom cursor styles
- System cursor should always be visible
- Interactive feedback via other visual means

---

## Questions or Problems?

1. **Check Documentation First**
   - `/docs/brand/DESIGN_SYSTEM.md`
   - `/docs/brand/homepage-implementation.md`
   - This file

2. **Search Existing Issues**
   - Someone may have asked already

3. **Open New Issue**
   - Use appropriate labels
   - Provide context and examples
   - Include screenshots if UI-related

4. **Join Discussions**
   - GitHub Discussions for questions
   - Issues for bugs/features only

---

## Code of Conduct

- Be respectful and inclusive
- Provide constructive feedback
- Focus on the code, not the person
- Help newcomers feel welcome

---

## License

By contributing, you agree that your contributions will be licensed under the same license as the project (MIT).

---

**Thank you for contributing to Aura!** 🚀

Every contribution, no matter how small, helps make Aura better for everyone.
