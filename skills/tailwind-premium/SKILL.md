---
name: tailwind-premium
description: Build premium, production-grade interfaces using Tailwind CSS patterns inspired by Tailwind Plus (official Tailwind UI). Provides component patterns, layout strategies, and aesthetic guidance for high-end web interfaces.
---

# Tailwind Premium Design Skill

Build **premium, production-grade interfaces** using design patterns from Tailwind Plus — the official component library by the Tailwind CSS team.

## When to Use

Activate this skill when building:
- SaaS dashboards and application UIs
- Marketing landing pages
- Ecommerce interfaces
- Documentation sites
- Any interface that needs to look "expensive" and polished

## Technology Stack

| Tool | Version | Purpose |
|------|---------|---------|
| Tailwind CSS | v4.x | Utility-first styling |
| Headless UI | v2.x | Accessible primitives (React/Vue) |
| Heroicons | latest | Consistent iconography |
| Inter | - | Default premium typography |

For React projects, also include:
- Framer Motion for animations
- `clsx` for conditional classes

---

## Core Design Principles

### 1. Dark Mode First
Every element must work in both light and dark modes:

```css
/* Background hierarchy */
bg-white dark:bg-zinc-900          /* Page background */
bg-zinc-50 dark:bg-zinc-800        /* Elevated surfaces */
bg-zinc-100 dark:bg-zinc-700       /* Hover states */

/* Text hierarchy */
text-zinc-950 dark:text-white      /* Primary text */
text-zinc-700 dark:text-zinc-300   /* Secondary text */
text-zinc-500 dark:text-zinc-400   /* Muted text */

/* Borders */
border-zinc-200 dark:border-zinc-800
```

### 2. Spacing Scale
Use the consistent 4px base scale:

```css
/* Horizontal padding by breakpoint */
px-4 sm:px-6 lg:px-8

/* Vertical section spacing */
py-12 sm:py-16 lg:py-20

/* Container max-widths */
max-w-7xl mx-auto   /* Full-width content */
max-w-3xl mx-auto   /* Readable text */
```

### 3. Typography
Size with integrated line-height using the `/` shorthand:

```css
text-sm/5      /* 14px, 1.25rem line-height */
text-sm/6      /* 14px, 1.5rem line-height */
text-base/6    /* 16px, 1.5rem line-height */
text-lg/7      /* 18px, 1.75rem line-height */
text-xl/8      /* 20px, 2rem line-height */

/* Font weights */
font-medium    /* Labels, nav items */
font-semibold  /* Headings, buttons */
font-bold      /* Strong emphasis */

/* Tabular numbers for data */
tabular-nums
```

---

## Component Patterns

### Buttons

```jsx
// Primary (solid)
<button className="
  inline-flex items-center justify-center gap-2
  rounded-md bg-zinc-900 px-4 py-2
  text-sm font-semibold text-white
  hover:bg-zinc-700
  focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-900
  dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200
">
  Save changes
</button>

// Secondary (outline)
<button className="
  inline-flex items-center justify-center gap-2
  rounded-md border border-zinc-300 bg-white px-4 py-2
  text-sm font-semibold text-zinc-700
  hover:bg-zinc-50
  dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700
">
  Cancel
</button>

// Plain (no border)
<button className="
  inline-flex items-center justify-center gap-2
  rounded-md px-4 py-2
  text-sm font-medium text-zinc-700
  hover:bg-zinc-100
  dark:text-zinc-300 dark:hover:bg-zinc-800
">
  Learn more
</button>
```

### Cards

```jsx
<div className="
  rounded-xl bg-white p-6
  ring-1 ring-zinc-200
  shadow-sm
  dark:bg-zinc-800 dark:ring-zinc-700
">
  <h3 className="text-base/7 font-semibold text-zinc-900 dark:text-white">
    Card Title
  </h3>
  <p className="mt-2 text-sm/6 text-zinc-600 dark:text-zinc-400">
    Card description goes here.
  </p>
</div>
```

### Sidebar Navigation

```jsx
<nav className="flex flex-col gap-1">
  {/* Active item */}
  <a className="
    flex items-center gap-3 rounded-lg bg-zinc-100 px-3 py-2
    text-sm/6 font-semibold text-zinc-900
    dark:bg-zinc-800 dark:text-white
  ">
    <HomeIcon className="size-5" />
    Dashboard
  </a>
  
  {/* Inactive item */}
  <a className="
    flex items-center gap-3 rounded-lg px-3 py-2
    text-sm/6 font-medium text-zinc-700
    hover:bg-zinc-50 hover:text-zinc-900
    dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-white
  ">
    <UsersIcon className="size-5" />
    Team
  </a>
</nav>
```

### Tables

```jsx
<table className="min-w-full divide-y divide-zinc-200 dark:divide-zinc-700">
  <thead>
    <tr>
      <th className="
        px-3 py-3.5 text-left text-sm font-semibold text-zinc-900
        dark:text-white
      ">
        Name
      </th>
    </tr>
  </thead>
  <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
    <tr className="hover:bg-zinc-50 dark:hover:bg-zinc-800/50">
      <td className="
        whitespace-nowrap px-3 py-4 text-sm text-zinc-900
        dark:text-white
      ">
        Leslie Alexander
      </td>
    </tr>
  </tbody>
</table>
```

### Input Fields

```jsx
<div>
  <label className="block text-sm/6 font-medium text-zinc-900 dark:text-white">
    Email
  </label>
  <input
    type="email"
    className="
      mt-2 block w-full rounded-md border-0 px-3 py-1.5
      text-zinc-900 ring-1 ring-inset ring-zinc-300
      placeholder:text-zinc-400
      focus:ring-2 focus:ring-inset focus:ring-zinc-900
      dark:bg-zinc-800 dark:text-white dark:ring-zinc-700
      dark:focus:ring-white
    "
    placeholder="you@example.com"
  />
</div>
```

### Badges

```jsx
// Status badges
<span className="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
  Active
</span>

<span className="inline-flex items-center rounded-md bg-yellow-50 px-2 py-1 text-xs font-medium text-yellow-800 ring-1 ring-inset ring-yellow-600/20">
  Pending
</span>

<span className="inline-flex items-center rounded-md bg-red-50 px-2 py-1 text-xs font-medium text-red-700 ring-1 ring-inset ring-red-600/20">
  Failed
</span>
```

---

## Layout Patterns

### Application Shell (Sidebar)

```jsx
<div className="flex min-h-screen">
  {/* Sidebar */}
  <aside className="
    flex w-64 flex-col
    border-r border-zinc-200 bg-white
    dark:border-zinc-800 dark:bg-zinc-900
  ">
    {/* Logo */}
    <div className="flex h-16 items-center px-6">
      <Logo className="h-8" />
    </div>
    
    {/* Navigation */}
    <nav className="flex-1 overflow-y-auto p-4">
      {/* ... nav items */}
    </nav>
    
    {/* User footer */}
    <div className="border-t border-zinc-200 p-4 dark:border-zinc-800">
      {/* ... user menu */}
    </div>
  </aside>
  
  {/* Main content */}
  <main className="flex-1 overflow-y-auto bg-zinc-50 dark:bg-zinc-900">
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Page content */}
    </div>
  </main>
</div>
```

### Hero Section (Simple Centered)

```jsx
<section className="relative isolate px-6 py-24 sm:py-32 lg:px-8">
  <div className="mx-auto max-w-2xl text-center">
    {/* Badge */}
    <p className="text-sm font-semibold text-indigo-600">Announcing v2.0</p>
    
    {/* Headline */}
    <h1 className="
      mt-4 text-4xl font-bold tracking-tight text-zinc-900 
      sm:text-6xl dark:text-white
    ">
      Build faster with better tools
    </h1>
    
    {/* Subheadline */}
    <p className="mt-6 text-lg/8 text-zinc-600 dark:text-zinc-400">
      Everything you need to ship your next project quickly.
    </p>
    
    {/* CTAs */}
    <div className="mt-10 flex items-center justify-center gap-x-6">
      <a className="rounded-md bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500">
        Get started
      </a>
      <a className="text-sm font-semibold text-zinc-900 dark:text-white">
        Learn more <span aria-hidden="true">→</span>
      </a>
    </div>
  </div>
</section>
```

### Bento Grid

```jsx
<div className="grid grid-cols-1 gap-4 lg:grid-cols-3 lg:grid-rows-2">
  {/* Large featured card */}
  <div className="
    lg:col-span-2 lg:row-span-2
    rounded-2xl bg-zinc-900 p-8 text-white
  ">
    {/* Featured content */}
  </div>
  
  {/* Two smaller cards */}
  <div className="rounded-2xl bg-zinc-100 p-6 dark:bg-zinc-800">
    {/* Card 1 */}
  </div>
  <div className="rounded-2xl bg-zinc-100 p-6 dark:bg-zinc-800">
    {/* Card 2 */}
  </div>
</div>
```

---

## Icon Sizing

Use Heroicons with consistent sizing:

```jsx
// Buttons and inline elements: 16×16
import { PlusIcon } from '@heroicons/react/16/solid'
<PlusIcon className="size-4" />

// Navigation items: 20×20
import { HomeIcon } from '@heroicons/react/20/solid'
<HomeIcon className="size-5" />

// Decorative/hero: 24×24
import { SparklesIcon } from '@heroicons/react/24/outline'
<SparklesIcon className="size-6" />
```

---

## Focus & Accessibility

Always include visible focus states:

```css
/* Standard focus ring */
focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-900

/* For dark backgrounds */
focus-visible:outline-white

/* Screen reader only text */
sr-only
```

---

## Animation Patterns

Use subtle, purposeful animations:

```css
/* Smooth transitions */
transition-colors duration-150
transition-all duration-200

/* Hover scale for cards */
hover:scale-[1.02] transition-transform

/* Loading pulse */
animate-pulse

/* Respect motion preferences */
motion-safe:animate-bounce
```

---

## Color Accent Palette

Beyond zinc, use these semantic colors:

| Color | Use Case |
|-------|----------|
| **indigo-600** | Primary actions, links |
| **green-600** | Success states |
| **yellow-500** | Warnings |
| **red-600** | Errors, destructive actions |
| **blue-600** | Information |

---

## Quick Reference

### Container Pattern
```css
mx-auto max-w-7xl px-4 sm:px-6 lg:px-8
```

### Responsive Gutter
```css
[--gutter:--spacing(4)] sm:[--gutter:--spacing(6)] lg:[--gutter:--spacing(8)]
```

### Card Ring (Light Shadow)
```css
ring-1 ring-zinc-200 dark:ring-zinc-700
```

### Gradient Background
```css
bg-gradient-to-b from-zinc-50 to-white dark:from-zinc-900 dark:to-zinc-800
```

### Glass Effect (Overlays)
```css
bg-white/80 backdrop-blur-xl dark:bg-zinc-900/80
```

---

## Avoid These Patterns

❌ Generic system fonts — use Inter or a distinctive font  
❌ Pure black `#000000` — use `zinc-950` for softer contrast  
❌ Missing dark mode — all elements need `dark:` variants  
❌ Hard-coded colors — use the Tailwind color palette  
❌ Inconsistent spacing — stick to the 4px scale  
❌ Missing focus states — every interactive element needs them
