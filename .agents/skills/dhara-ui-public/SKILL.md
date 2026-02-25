---
name: dhara-ui-public
description: >
  Build the public-facing (pre-login) UI for the Dhara platform — a booking platform for NGO facilities.
  Use this skill when building the landing page, place discovery flow, search/filter pages, individual
  facility or room listing pages, guided discovery questionnaire, or any page that is accessible without
  logging in. Always use this skill for Dhara public pages, even if the request just says "build the
  homepage" or "create the search page". Combine with dhara-components for Shadcn UI conventions.
---

# Dhara Public UI Skill

Dhara is a booking platform for NGO/organization facilities — like a lightweight Airbnb specifically
for trusted NGO accommodations. The public UI is what travelers see before they log in.

## Design Direction

- **Tone**: Warm, trustworthy, purposeful. Not corporate. Not flashy. Think: calm confidence.
- **Color palette**: Earthy greens and warm neutrals — evoke sustainability, travel, nature.
  Suggested: `#2D6A4F` (forest green primary), `#52B788` (accent), `#F8F4EF` (warm off-white bg),
  `#1B1B1B` (dark text). Use CSS variables.
- **Typography**: Pair a humanist serif for headings (e.g. Lora, Playfair Display) with a clean
  sans-serif for body (e.g. DM Sans, Nunito). Conveys trust + readability.
- **Imagery**: Always show compound/facility photos. Never stock hotel photos.
- **Impact messaging**: Every listing subtly shows what the stay supports
  (e.g. "funds health clinic operations").

## Pages to Build

### 1. Landing Page (`/`)

Sections:
- **Hero**: Headline + subline + two CTAs ("Find a Place" / "List Your Facility").
  Background: soft image of a green compound or garden.
- **How it works**: 3-step visual for guests. Simple icons.
- **Featured places**: 3–4 place cards (use `PlaceCard` component).
- **Impact section**: Show total nights booked → impact generated. Numbers animate on scroll.
- **For organizations**: Brief pitch to NGOs. CTA to "Join as Operator".
- **Footer**: Links, contact, legal.

### 2. Guided Discovery (`/discover`)

A conversational questionnaire — NOT a search form.
Steps (show one at a time, with smooth transition):
1. "What brings you here?" → Working / Resting / Family travel / Retreat
2. "Where are you headed?" → Region/division selector or map pins
3. "When are you arriving?" → Date range picker
4. "How many guests?" → Number selector

On completion → redirect to `/places?type=...&region=...&checkin=...&guests=...`

UI notes:
- Full-screen card per step, large readable text
- Progress dots at bottom
- Back button always visible
- Use `RadioGroup` from Shadcn for choices

### 3. Search & Browse (`/places`)

Layout:
- Left: filter sidebar (collapsible on mobile)
  - Location (region dropdown)
  - Date range picker
  - Budget slider
  - Guests count
  - Amenities checkboxes (WiFi, meals, women-safe, gated)
- Right: grid of `PlaceCard` components (2 col desktop, 1 col mobile)
- Top: result count + sort dropdown ("Recommended / Price: Low / Price: High")
- Map toggle button (show/hide map view — map is a bonus, not MVP)

### 4. Place Detail Page (`/places/[slug]`)

Sections:
- **Photo gallery**: 4–6 photos in a masonry or hero+grid layout
- **Header**: Name, location badge, safety badges (women-safe, gated, etc.)
- **About**: Description + impact statement
- **Rooms**: List of room cards with capacity, price, meal options
- **Availability calendar**: Read-only calendar showing blocked vs available dates
- **Amenities grid**: WiFi, food, bathroom, security etc.
- **Location**: Approximate area (not exact address for safety)
- **Booking sidebar** (sticky on desktop): date picker + room selector + total price + "Book Now" CTA
  → CTA goes to `/book/[roomId]` if logged in, else → `/login?redirect=/book/[roomId]`

### 5. Static Pages

- `/about` — Platform mission
- `/for-organizations` — Operator pitch page
- `/login` — Google sign-in button (see `dhara-auth` skill)
- `/signup` — Role selection → Google OAuth (see `dhara-auth` skill)

## Key Components (Public)

### `PlaceCard`
```tsx
// Props: name, location, price, imageUrl, safetyTags[], impactLine, slug
// Shows: image, name, location, price/night, safety badges, impact line
// Hover: subtle lift shadow
```

### `SafetyBadge`
```tsx
// Props: type: 'women-safe' | 'gated' | 'security' | 'verified'
// Small pill badge with icon
```

### `ImpactLine`
```tsx
// Props: text (e.g. "Supports 3 days of health clinic service")
// Subtle green text with leaf icon
```

### `GuidedStep`
```tsx
// Full-screen step card for guided discovery flow
// Props: question, options[], onSelect, onBack, step, totalSteps
```

## Routing

```
/                       → Landing page
/discover               → Guided discovery questionnaire
/places                 → Browse/search results
/places/[slug]          → Place detail
/about                  → About Dhara
/for-organizations      → Operator marketing page
```

## Implementation Notes

- All pages are **Server Components** by default. Use Client Components only for interactive
  elements (date pickers, questionnaire steps, filter sidebar).
- Place data is fetched server-side via Supabase server client.
- Use `next/image` for all facility photos (served from Supabase Storage).
- The booking sidebar on place detail page should be a Client Component for interactivity.
- Meta tags and OG images should be set per place using Next.js `generateMetadata`.
- Availability calendar fetches `availability_blocks` — blocked ranges render as greyed-out.

## Do's ✅

- Always show the impact line on every place card and listing.
- Always show safety tags prominently — this is a trust signal.
- Keep the guided discovery flow to max 4 steps.
- Show total inclusive price (with taxes) before the user clicks Book.

## Don'ts ❌

- Never show exact GPS coordinates or full street address publicly.
- Never hide fees — show all-inclusive price early.
- Never use generic hotel/Airbnb visual language (no "Superhost" etc.).
