---
name: dhara-components
description: >
  Build and use the shared component system for the Dhara platform using Shadcn UI.
  Use this skill when setting up Shadcn UI, configuring the design system and theme,
  building shared/reusable components used across guest and operator interfaces, or
  when unsure which Shadcn components to use for a given UI pattern. Always use this
  skill alongside other Dhara UI skills to ensure consistent component usage and theming.
---

# Dhara Components & Design System Skill

## Shadcn UI Setup

Dhara uses **Shadcn UI** as the component foundation. All Shadcn components live in `src/components/ui/`.
Custom shared components live in `src/components/`.

### Installation

```bash
pnpm dlx shadcn@latest init
```

Config choices:
- Style: **Default**
- Base color: **Neutral** (we apply our own brand colors via CSS vars)
- CSS variables: **Yes**
- Tailwind config: `tailwind.config.ts`
- Components path: `src/components/ui`
- Utils path: `src/lib/utils`

### Adding components:
```bash
pnpm dlx shadcn@latest add button input form card badge dialog sheet tabs select calendar
pnpm dlx shadcn@latest add dropdown-menu avatar separator skeleton toast progress radio-group
pnpm dlx shadcn@latest add accordion table alert alert-dialog popover command
```

## Brand Theme (CSS Variables)

Update `src/app/globals.css`:

```css
@layer base {
  :root {
    /* Dhara brand palette */
    --background: 40 30% 97%;       /* #F8F4EF warm off-white */
    --foreground: 0 0% 11%;         /* #1B1B1B near-black */

    --primary: 155 41% 30%;         /* #2D6A4F forest green */
    --primary-foreground: 0 0% 100%;

    --secondary: 148 43% 51%;       /* #52B788 light green accent */
    --secondary-foreground: 0 0% 100%;

    --muted: 40 20% 93%;
    --muted-foreground: 0 0% 40%;

    --accent: 148 43% 51%;
    --accent-foreground: 0 0% 100%;

    --card: 0 0% 100%;
    --card-foreground: 0 0% 11%;

    --border: 0 0% 87%;
    --input: 0 0% 87%;
    --ring: 155 41% 30%;

    --destructive: 0 72% 51%;
    --destructive-foreground: 0 0% 100%;

    --radius: 0.5rem;
  }
}
```

### Typography

Add to `tailwind.config.ts`:
```ts
import { fontFamily } from 'tailwindcss/defaultTheme'

theme: {
  extend: {
    fontFamily: {
      sans: ['DM Sans', ...fontFamily.sans],
      heading: ['Lora', ...fontFamily.serif],
    }
  }
}
```

Add to `src/app/layout.tsx`:
```tsx
import { DM_Sans, Lora } from 'next/font/google'

const dmSans = DM_Sans({ subsets: ['latin'], variable: '--font-sans' })
const lora = Lora({ subsets: ['latin'], variable: '--font-heading' })
```

## Component Library

### Shadcn Components Usage Guide

| UI Pattern | Use This Shadcn Component |
|-----------|--------------------------|
| Page forms | `Form` + `Input` + `Button` |
| Modal/dialog | `Dialog` or `AlertDialog` for destructive actions |
| Mobile nav drawer | `Sheet` |
| Tabs (bookings list) | `Tabs` |
| Dropdowns | `Select` for forms, `DropdownMenu` for actions |
| Date picker | `Calendar` + `Popover` |
| Status badges | `Badge` with variant |
| Data tables | `Table` |
| Loading states | `Skeleton` |
| Notifications | `Toast` (Sonner) |
| Accordion (rules/policy) | `Accordion` |
| Confirmation dialogs | `AlertDialog` |
| Command/search | `Command` + `Popover` |

### Custom Shared Components

#### Layout Components (`src/components/layout/`)

```tsx
// GuestLayout — sidebar + main content for authenticated guest pages
// Props: children
// Mobile: bottom nav (4 items)
// Desktop: left sidebar (collapsible)

// OperatorLayout — sidebar + main for operator pages
// Heavier chrome, more nav items
// Always show facility name in header

// PageHeader
// Props: title, description?, actions? (ReactNode)
// Consistent page title area across all pages

// SectionCard
// Wrapper for content sections with consistent padding/border
// Props: title?, children, className?
```

#### Shared Feature Components (`src/components/shared/`)

```tsx
// PlaceCard
// Used on public browse + guest favorites
// Props: facility { name, slug, location, coverImageUrl, priceFrom, safetyTags, impactLine }
// Link wraps entire card → /places/[slug]

// SafetyBadge
// Props: type: 'women-safe' | 'gated' | 'security' | 'verified'
// Small colored pill with icon

// ImpactLine
// Props: text: string
// Green text with leaf emoji or icon
// Used on cards + confirmation pages

// BookingStatusBadge
// Props: status: 'upcoming' | 'checked_in' | 'completed' | 'cancelled' | 'pending'
// Color map:
//   upcoming → blue
//   checked_in → green
//   completed → gray
//   cancelled → red
//   pending → yellow

// PriceDisplay
// Props: amount: number, period?: string (e.g. '/ night')
// Renders in BDT with ৳ symbol
// Large variant for booking flow, small for cards

// PhotoGallery
// Props: photos: { url, alt }[]
// Hero image + 3-4 thumbnail grid
// Click → full screen modal with navigation

// DateRangePicker
// Custom built on Shadcn Calendar + Popover
// Props: value, onChange, disabledDates (from availability_blocks)
// Blocks unavailable dates (grayed out, not selectable)

// LoadingSpinner
// Simple centered spinner for async states

// EmptyState
// Props: icon, title, description, action?
// Used for empty bookings lists, no facilities, etc.

// ConfirmDialog
// Wraps AlertDialog for destructive action confirmations
// Props: title, description, onConfirm, trigger, variant: 'danger' | 'warning'
```

#### Form Utilities (`src/components/forms/`)

```tsx
// FormField wrapper that adds label + error message consistently
// PhotoUploader — drag/drop, upload to Supabase Storage, return paths
// PhoneInput — Bangladesh phone format (+880)
// PriceInput — numeric input with ৳ prefix
```

## Tailwind Conventions

```ts
// Prefer semantic color names over raw values
// ✅  className="bg-primary text-primary-foreground"
// ❌  className="bg-green-700 text-white"

// Spacing scale
// xs gaps: gap-2 (8px)
// sm gaps: gap-4 (16px)  
// md gaps: gap-6 (24px)
// lg gaps: gap-8 (32px)
// page padding: px-4 md:px-8 lg:px-12

// Card pattern (consistent across all cards)
// className="rounded-lg border bg-card shadow-sm p-6"

// Section headings use font-heading
// className="font-heading text-2xl font-semibold"
```

## Responsive Breakpoints

Tailwind defaults — use consistently:
- Mobile first: default styles = mobile
- `md:` = tablet (768px+)
- `lg:` = desktop (1024px+)

Key responsive patterns:
```
// Navigation
mobile → bottom tab bar (4 icons)
desktop → left sidebar

// Grid layouts
mobile → 1 col
tablet → 2 col
desktop → 3-4 col

// Booking flow
mobile → full screen steps
desktop → max-w-2xl centered

// Facility detail
mobile → stacked
desktop → main content + sticky sidebar
```

## Icon Library

Use `lucide-react` (included with Shadcn):
```ts
import { MapPin, Wifi, Shield, Leaf, Check, X, ChevronRight } from 'lucide-react'
```

Consistent icon sizes:
- Inline icons: `size={16}` (`w-4 h-4`)
- Button icons: `size={18}` (`w-4.5 h-4.5`)  
- Card icons: `size={20}` (`w-5 h-5`)
- Feature icons: `size={24}` (`w-6 h-6`)

## Accessibility

- All interactive elements must have visible focus rings (Shadcn handles this by default)
- Images: always provide meaningful `alt` text
- Form fields: always connected to labels via `htmlFor` / `id`
- Color is never the only indicator — always pair with text or icon
- Front desk components: minimum 44px touch targets

## Do's ✅

- Always use Shadcn `Form` with `react-hook-form` + `zod` validation for all forms.
- Always use `font-heading` class for page and section headings.
- Always show `Skeleton` during loading states — never blank space.
- Use `ConfirmDialog` for any destructive action (delete, cancel, block dates).
- Use `Toast` for transient success/error notifications after actions.

## Don'ts ❌

- Never use raw Tailwind color values like `bg-green-700` — use semantic vars.
- Never build custom modal from scratch — use Shadcn `Dialog` or `Sheet`.
- Never skip mobile responsive design — start mobile-first always.
- Never use bare `<button>` — always use Shadcn `Button` with appropriate variant.
