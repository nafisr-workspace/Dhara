---
name: dhara-ui-operator
description: >
  Build the post-login operator/NGO UI for the Dhara platform. Use this skill when building
  any page or component inside the authenticated operator experience: the operator dashboard,
  facility listing and management, room management, availability/blocking calendar, front desk
  (check-in/out), earnings and payout reports, organization profile, or impact/story section.
  Always use this skill for operator-facing pages in Dhara. Combine with dhara-components
  for Shadcn UI conventions and dhara-backend for data patterns.
---

# Dhara Operator UI Skill

This covers all UI for authenticated operators (NGOs / organizations) on the Dhara platform.

## Design Direction

- **Tone**: Professional, functional, efficient. Operators are NGO staff — not tech-savvy marketers.
  Interfaces must be dead simple. Zero confusion.
- **Color**: Same green palette but with more neutral grays in the dashboard chrome.
  Primary: `#2D6A4F`, accent: `#52B788`, surface: `#FFFFFF`, bg: `#F5F5F5`, border: `#E0E0E0`.
- **Density**: Slightly higher info density than guest UI — operators manage data, not browse.
- **Front desk view**: Must work on a tablet. Large touch targets. High contrast.

## Route Group

All operator routes live under `src/app/(operator)/`. Protected by middleware —
requires auth + `role: operator` + `org_status: approved`.

```
(operator)/
├── dashboard/              → /operator/dashboard
├── facilities/
│   ├── page.tsx            → /operator/facilities (list)
│   ├── new/page.tsx        → /operator/facilities/new
│   └── [id]/
│       ├── page.tsx        → /operator/facilities/[id] (overview)
│       ├── rooms/          → /operator/facilities/[id]/rooms
│       ├── availability/   → /operator/facilities/[id]/availability
│       └── settings/       → /operator/facilities/[id]/settings
├── bookings/               → /operator/bookings
├── front-desk/             → /operator/front-desk
├── earnings/               → /operator/earnings
├── messages/               → /operator/messages
└── profile/                → /operator/profile
```

## Pages to Build

### 1. Operator Dashboard (`/operator/dashboard`)

Layout: sidebar nav (always visible desktop), hamburger on mobile.

Sidebar nav:
- Dashboard
- Facilities
- Bookings
- Front Desk ← highlight this for daily use
- Earnings
- Messages
- Profile / Settings

Dashboard sections:
- **Stats row** (4 cards): Today's arrivals | Today's departures | This month's earnings | Occupancy %
- **Today's activity**: Quick view of check-ins and check-outs today (mini version of front desk)
- **Upcoming bookings**: Next 7 days — table with guest name, facility, room, dates
- **Earnings chart**: Bar chart — last 6 months (use Recharts or a simple SVG)
- **Pending actions**: Any rooms needing attention (maintenance flags, etc.)

### 2. Facilities List (`/operator/facilities`)

- Grid of facility cards (photo, name, location, room count, active/paused status)
- "Add New Facility" button → `/operator/facilities/new`
- Status toggle per facility (active / paused)

### 3. Add / Edit Facility (`/operator/facilities/new` and `settings`)

Multi-section form (not multi-step — all on one scrollable page with anchored sections):

**Basic Info**
- Facility name
- Location (division + district + area)
- Description (rich text or textarea)
- Type: Guesthouse / Training Center / Conference Center / Mixed

**Photos**
- Drag-and-drop image uploader (uploads to Supabase Storage)
- Min 3 photos required, max 10
- First photo = cover photo (drag to reorder)

**Amenities**
- Checkbox grid: WiFi, Meals available, Generator backup, Gated compound,
  24hr security, Women-safe designation, Accessible facilities

**Rules**
- Check-in time, Check-out time
- ID required toggle
- Alcohol policy
- Noise curfew

**Impact Story** (optional)
- History/background textarea
- Community activities textarea
- Link to project photos (Supabase Storage upload)

**Save** → creates facility, goes to room setup

### 4. Room Management (`/operator/facilities/[id]/rooms`)

- List of rooms with: name, type (single/double/dorm/hall), capacity, price tiers, status
- "Add Room" → inline form or modal:
  - Room name
  - Type
  - Capacity (max guests)
  - Partner price | Public price | Corporate price
  - Meal add-on charge (optional)
  - Hall booking charge (if applicable)
  - Photos (upload to Supabase Storage)
  - Edit / Delete actions per room

### 5. Availability Calendar (`/operator/facilities/[id]/availability`)

**This is the most critical feature.**

- Full-month calendar view (like a real booking calendar)
- Each room shown as a row OR toggle between room views
- Color coding:
  - 🟢 Available (guest can book)
  - 🔴 Blocked by operator
  - 🔵 Guest booking confirmed
  - ⚪ Past date
- **Block dates**: Click and drag on calendar → creates `availability_block` record instantly
- **Unblock**: Click on blocked range → confirm dialog → deletes block
- Blocking must be instant — no page reload
- Show upcoming guest bookings read-only (can't delete confirmed bookings here)
- "Block All Rooms" shortcut: block all rooms for a date range in one action

Implementation:
- Use a custom calendar built with `date-fns` or adapt `react-day-picker`
- Optimistic UI updates for block/unblock actions
- Server Action: `createAvailabilityBlock(roomId, startDate, endDate)`
- Server Action: `deleteAvailabilityBlock(blockId)`

### 6. Bookings List (`/operator/bookings`)

Table with columns: Guest name | Room | Check-in | Check-out | Guests | Payment status | Actions

- Filter by: facility, date range, status
- Click row → booking detail modal or drawer
- Booking detail shows: guest phone, booking code, room, dates, payment, ID type
- No manual approval needed — just view

### 7. Front Desk (`/operator/front-desk`) ⭐ Most used daily

**Design for tablet use. Large text and buttons.**

Layout:
- Top: Today's date + facility selector (if operator has multiple)
- Two columns:
  - **Arrivals today**: List of expected check-ins
  - **Departures today**: List of expected check-outs

Each guest card shows:
- Guest name (large)
- Room name
- Booking code
- Check-in / Check-out time

**Check-in flow:**
1. Caretaker taps "Check In" on guest card
2. Modal opens: "Search guest" — type name or booking code
3. Guest record appears — shows ID type required
4. If `payment_method = 'cash'`: show **"Collect Cash: ৳ XXXX"** section prominently
   - Caretaker confirms cash received → checkbox "Cash collected"
   - This sets `payment_status: 'paid'`, records `cash_collected_by` + `cash_collected_at`
5. Tap "Confirm ID Verified" checkbox
6. Tap "Check In" → records check-in time in DB
7. Card moves to "Checked In" section

Cash booking cards show a **yellow ৳ badge** in the arrivals list so caretakers know to collect payment.

**Check-out flow:**
1. Tap "Check Out" on guest card
2. Confirm dialog: "Check out [Name] from [Room]?"
3. Confirm → records checkout time
4. Card moves to "Departed" section

**Search bar** at top: search any guest by name, phone, or booking code (for walk-ups / unscheduled arrivals).

### 8. Earnings (`/operator/earnings`)

- **Summary row**: Current month earnings | Last month | Total all time
- **Monthly breakdown table**: Month | Bookings | Gross | Platform fee | Tax | Net payout
- **Payout status**: next payout date, amount, bank account (last 4 digits)
- **Download statement**: CSV or PDF per month
- **Earnings chart**: Last 12 months bar chart

### 9. Operator Profile (`/operator/profile`)

- Organization name + logo upload
- Authorized staff list (name + role + email) — add/remove
- Bank account details (for payouts) — masked display, "Update" button
- Contact email for platform communications
- Account status: Approved / Pending / Paused

## Key Components (Operator)

### `StatsCard`
```tsx
// Props: label, value, delta (vs last period), icon
// Used in dashboard stats row
```

### `AvailabilityCalendar`
```tsx
// The core availability management component
// Props: roomId, facilityId, month
// Manages blocks via Server Actions
// THIS IS THE MOST IMPORTANT COMPONENT — build with care
```

### `FrontDeskGuestCard`
```tsx
// Props: booking, type: 'arrival' | 'departure'
// Large, tablet-friendly card
// Shows check-in/out action button
```

### `RoomCard`
```tsx
// Props: room (name, type, capacity, prices)
// Used in room management list
```

### `EarningsTable`
```tsx
// Props: payouts[]
// Monthly breakdown with download per row
```

### `PhotoUploader`
```tsx
// Drag-and-drop, uploads to Supabase Storage
// Returns array of storage paths
// Used in facility and room forms
```

## Implementation Notes

- The availability calendar is Client-heavy — use `useState` for optimistic updates,
  then confirm with Server Actions. Roll back on error.
- Front desk page should auto-refresh every 60 seconds (or use Supabase Realtime).
- Photo uploads: upload to Supabase Storage bucket `facility-photos` or `room-photos`,
  store the storage path in DB, render via Supabase signed URLs or public URLs.
- Earnings data is read-only for operators — calculated server-side.
- Operator must have `org_status: approved` to list facilities. Show a "pending approval"
  state if not yet approved.

## Do's ✅

- Front desk must work on tablet — minimum 44px touch targets everywhere.
- Always show confirmation dialogs before destructive actions (unblock dates, delete room).
- Availability blocking must be instant and obvious — this is the #1 business rule.
- Show "Platform will not interfere with your blocked dates" messaging on availability page
  to reassure operators.

## Don'ts ❌

- Never allow operators to see other organizations' data.
- Never let operators modify confirmed guest bookings (view only).
- Never skip the pending approval gate for new operators.
- Never expose guest full ID numbers — only type and last 4 digits.
- Never auto-approve bookings on dates that overlap `availability_blocks`.
