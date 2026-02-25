---
name: dhara-ui-guest
description: >
  Build the post-login guest/traveler UI for the Dhara platform. Use this skill when building
  any page or component inside the authenticated guest experience: the booking flow (room selection,
  payment, confirmation), guest dashboard (upcoming stays, past stays), booking detail pages,
  profile/account settings, or the in-stay messaging interface. Always use this skill for
  authenticated guest pages in Dhara. Combine with dhara-components for Shadcn UI conventions
  and dhara-payments for the payment step.
---

# Dhara Guest UI Skill

This covers all UI for authenticated travelers (guests) on the Dhara platform.

## Design Direction

- Same warm, trustworthy palette as public UI: `#2D6A4F` primary, `#52B788` accent, `#F8F4EF` bg.
- Guest dashboard feels calm and personal — like a well-organized travel journal.
- Focus: **clarity and confidence**. The guest must always know what's happening with their booking.
- No clutter. Show what matters: upcoming stay, confirmation status, arrival info.

## Route Group

All guest routes live under `src/app/(guest)/`. Protected by middleware — requires auth + `role: guest`.

```
(guest)/
├── dashboard/          → /dashboard
├── bookings/
│   ├── page.tsx        → /bookings (list)
│   └── [id]/page.tsx   → /bookings/[id] (detail)
├── book/
│   └── [roomId]/
│       ├── page.tsx    → /book/[roomId] (booking flow)
│       └── confirm/    → /book/[roomId]/confirm (post-payment)
├── messages/           → /messages
└── profile/            → /profile
```

## Pages to Build

### 1. Guest Dashboard (`/dashboard`)

Layout: sidebar nav (desktop) / bottom nav (mobile)

Sections:
- **Upcoming stay card** (if any): Place name, dates, check-in time, directions CTA, booking code.
  Prominent — top of page.
- **Past stays**: Compact list with place name, dates, receipt link, impact summary.
- **Quick actions**: "Find a new place" → `/discover`
- **Welcome message**: "Welcome back, [name]" with avatar

Sidebar nav items:
- Dashboard (home icon)
- My Bookings
- Messages
- Profile

### 2. Booking Flow (`/book/[roomId]`)

Multi-step flow — show progress bar at top (Step 1 of 3):

**Step 1 — Review & Confirm**
- Room summary card: photo, room name, facility name, dates selected
- Guest count confirmation
- Meal option selector (if facility offers meals)
- Cancellation policy (expandable accordion)
- Price breakdown table:
  - Room rate × nights
  - Meal charges (if selected)
  - Platform fee
  - Tax
  - **Total** (bold, prominent)
- Impact message: "This stay will contribute to [X]"
- CTA: "Proceed to Payment"

**Step 2 — Guest Details**
- Name (pre-filled from profile)
- Phone number (pre-filled)
- ID type selector (NID / Passport)
- Special requests (optional textarea)
- CTA: "Continue"

**Step 3 — Payment** (see `dhara-payments` skill for payment UI details)
- Payment method selector
- Confirmation CTA

### 3. Booking Confirmation (`/book/[roomId]/confirm`)

Full-screen success state:
- Large checkmark animation (CSS or Framer Motion)
- Booking code (large, copyable)
- Summary: place, dates, room
- Impact message: "Your stay funds [X days] of [cause]"
- What to bring: ID reminder
- Directions button
- "View My Booking" → `/bookings/[id]`
- "Find another place" → `/discover`

### 4. Booking Detail (`/bookings/[id]`)

Shows:
- Status badge: `upcoming` / `checked-in` / `completed` / `cancelled`
- Place info + photo
- Dates, room, guests
- Booking code (copyable)
- Check-in time and gate instructions (shown 24h before arrival)
- Local contact (platform number, not personal)
- Impact summary (for completed stays)
- Receipt download button
- Cancel booking button (if cancellable per policy) — confirm dialog before action
- "Extend stay" button (if stay is active and rooms available)

### 5. Bookings List (`/bookings`)

Tabs: **Upcoming** | **Past** | **Cancelled**

Each booking card shows:
- Place thumbnail, name, location
- Dates
- Status badge
- Total paid
- CTA: "View Details"

### 6. Messages (`/messages`)

Simple inbox UI:
- Left: conversation list (one thread per booking/facility)
- Right: message thread
- Input at bottom — textarea + send button
- All messages go through platform (Supabase Realtime or polling)
- Show booking context at top of thread (place name, dates)

### 7. Profile (`/profile`)

Sections:
- **Personal info**: Name, email (read-only from auth), phone, avatar upload
- **ID on file**: Type + last 4 digits (not full number)
- **Notification preferences**: SMS / Email toggles
- **Past stays count + total nights** (stats row)
- **Danger zone**: Delete account (confirm dialog)

## Key Components (Guest)

### `BookingCard`
```tsx
// Props: booking (id, place, dates, status, totalPaid)
// Used in /bookings list
```

### `UpcomingStayCard`
```tsx
// Hero card on dashboard — shows next stay prominently
// Props: booking with check-in time, directions, booking code
```

### `PriceBreakdown`
```tsx
// Props: roomRate, nights, mealCharge, platformFee, tax
// Renders line-item table with total
```

### `BookingStatusBadge`
```tsx
// Props: status: 'upcoming' | 'checked-in' | 'completed' | 'cancelled'
// Color-coded Shadcn Badge variant
```

### `ImpactSummary`
```tsx
// Props: causeText, days/amount
// Post-stay impact message card with leaf icon
```

### `StepProgress`
```tsx
// Props: currentStep, totalSteps, labels[]
// Top progress bar for booking flow
```

## Implementation Notes

- Booking flow state (step, selected options) managed with `useState` in a Client Component wrapper.
  Individual step components can be Server Components if they don't need interactivity.
- After successful payment, call a Server Action to create the booking record, then redirect to
  `/book/[roomId]/confirm`.
- Booking code should be human-readable: `DHARA-XXXX-XXXX` format.
- "Extend stay" should check `availability_blocks` and open room availability before showing the button.
- Receipts are generated as PDFs and stored in Supabase Storage — provide a signed URL for download.
- Messages use Supabase Realtime `channel` subscriptions for live updates.

## Do's ✅

- Always show booking code prominently — it's how the caretaker identifies the guest.
- Always show the impact message at confirmation and on completed booking detail.
- Pre-fill all known guest info in the booking form.
- Show cancellation policy before payment — never surprise the user.
- On mobile, use bottom navigation (not sidebar).

## Don'ts ❌

- Never show personal contact details of the facility — only platform contact.
- Never allow a guest to book dates that overlap `availability_blocks`.
- Never skip the ID reminder — required for check-in per local authority rules.
- Never show "Extend stay" if no rooms are available.
