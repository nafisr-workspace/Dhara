---
name: dhara-backend
description: >
  Build the backend for the Dhara platform — database schema, Supabase RLS policies,
  Server Actions, API routes, and Edge Functions. Use this skill when designing or implementing
  any data layer work: creating or modifying Supabase tables, writing Row Level Security policies,
  building Server Actions for bookings/availability/payments, designing API routes, or writing
  Supabase Edge Functions. Always use this skill for any backend or data work in Dhara,
  even if the request just says "set up the database" or "write a server action for bookings".
---

# Dhara Backend Skill

## Tech Stack

- **Database**: Supabase (PostgreSQL)
- **Auth**: Supabase Auth
- **Storage**: Supabase Storage
- **Edge Functions**: Supabase Edge Functions (Deno runtime)
- **ORM/Query**: Supabase JS client with typed helpers
- **Migrations**: `supabase/migrations/` — SQL files, applied via `supabase db push`

## Database Schema

### Core Tables

```sql
-- User profiles (extends Supabase auth.users)
create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  phone text,
  role text not null check (role in ('guest', 'operator')),
  avatar_url text,
  id_type text check (id_type in ('nid', 'passport')),
  id_last_four text,
  notification_sms boolean default true,
  notification_email boolean default true,
  created_at timestamptz default now()
);

-- Organizations (NGOs)
create table organizations (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid references profiles(id),
  name text not null,
  logo_url text,
  bank_account_masked text,       -- last 4 digits only for display
  bank_account_encrypted text,    -- encrypted full account for payouts
  contact_email text,
  status text not null default 'pending' check (status in ('pending', 'approved', 'paused')),
  created_at timestamptz default now()
);

-- Organization staff
create table org_staff (
  id uuid primary key default gen_random_uuid(),
  org_id uuid references organizations(id) on delete cascade,
  user_id uuid references profiles(id),
  role text default 'staff' check (role in ('admin', 'staff', 'caretaker'))
);

-- Facilities (physical centers)
create table facilities (
  id uuid primary key default gen_random_uuid(),
  org_id uuid references organizations(id) on delete cascade,
  name text not null,
  slug text unique not null,
  description text,
  type text check (type in ('guesthouse', 'training_center', 'conference_center', 'mixed')),
  division text,
  district text,
  area text,
  -- No exact address stored publicly
  amenities jsonb default '{}',      -- { wifi: bool, meals: bool, gated: bool, ... }
  rules jsonb default '{}',          -- { checkin_time, checkout_time, id_required, ... }
  impact_story text,
  community_activities text,
  is_active boolean default false,
  created_at timestamptz default now()
);

-- Facility photos
create table facility_photos (
  id uuid primary key default gen_random_uuid(),
  facility_id uuid references facilities(id) on delete cascade,
  storage_path text not null,
  is_cover boolean default false,
  sort_order int default 0
);

-- Rooms
create table rooms (
  id uuid primary key default gen_random_uuid(),
  facility_id uuid references facilities(id) on delete cascade,
  name text not null,
  type text check (type in ('single', 'double', 'dorm', 'hall')),
  capacity int not null,
  price_partner numeric(10,2) not null,
  price_public numeric(10,2) not null,
  price_corporate numeric(10,2) not null,
  meal_addon_price numeric(10,2) default 0,
  hall_booking_price numeric(10,2) default 0,
  is_active boolean default true,
  created_at timestamptz default now()
);

-- Room photos
create table room_photos (
  id uuid primary key default gen_random_uuid(),
  room_id uuid references rooms(id) on delete cascade,
  storage_path text not null,
  sort_order int default 0
);

-- Availability blocks (operator-controlled)
-- THE MOST IMPORTANT TABLE. Operators block these dates; guests cannot book them.
create table availability_blocks (
  id uuid primary key default gen_random_uuid(),
  room_id uuid references rooms(id) on delete cascade,
  start_date date not null,
  end_date date not null,
  reason text,  -- 'training', 'workshop', 'maintenance', 'internal', etc.
  created_by uuid references profiles(id),
  created_at timestamptz default now(),
  constraint no_overlap check (start_date <= end_date)
);

-- Bookings
create table bookings (
  id uuid primary key default gen_random_uuid(),
  booking_code text unique not null,  -- format: DHARA-XXXX-XXXX
  guest_id uuid references profiles(id),
  room_id uuid references rooms(id),
  checkin_date date not null,
  checkout_date date not null,
  guest_count int not null default 1,
  meal_included boolean default false,
  price_type text check (price_type in ('partner', 'public', 'corporate')),
  room_rate numeric(10,2) not null,
  meal_charge numeric(10,2) default 0,
  platform_fee numeric(10,2) not null,
  tax_amount numeric(10,2) not null,
  total_amount numeric(10,2) not null,
  payment_status text default 'pending' check (payment_status in ('pending', 'paid', 'refunded', 'cash_pending')),
  payment_method text check (payment_method in ('bkash', 'nagad', 'card', 'cash')),
  payment_reference text,
  cash_collected_by uuid references profiles(id),
  cash_collected_at timestamptz,
  status text default 'upcoming' check (status in ('upcoming', 'checked_in', 'completed', 'cancelled')),
  special_requests text,
  actual_checkin_at timestamptz,
  actual_checkout_at timestamptz,
  checked_in_by uuid references profiles(id),  -- caretaker who checked them in
  created_at timestamptz default now()
);

-- Messages (platform communication)
create table messages (
  id uuid primary key default gen_random_uuid(),
  booking_id uuid references bookings(id) on delete cascade,
  sender_id uuid references profiles(id),
  content text not null,
  read_at timestamptz,
  created_at timestamptz default now()
);

-- Payouts (monthly earnings per org)
create table payouts (
  id uuid primary key default gen_random_uuid(),
  org_id uuid references organizations(id),
  period_month date not null,  -- first day of the month
  gross_amount numeric(10,2) not null,
  platform_fee numeric(10,2) not null,
  tax_collected numeric(10,2) not null,
  net_payout numeric(10,2) not null,
  status text default 'pending' check (status in ('pending', 'processing', 'paid')),
  paid_at timestamptz,
  booking_ids uuid[] not null
);
```

### Key Indexes

```sql
create index on availability_blocks (room_id, start_date, end_date);
create index on bookings (room_id, checkin_date, checkout_date);
create index on bookings (guest_id);
create index on bookings (booking_code);
create index on facilities (slug);
create index on org_staff (org_id, user_id);
```

## Row Level Security (RLS)

Enable RLS on ALL tables. Here are the key policies:

```sql
-- profiles: users see only their own profile
alter table profiles enable row level security;
create policy "own profile" on profiles
  for all using (auth.uid() = id);

-- organizations: operators see their own org
alter table organizations enable row level security;
create policy "own org" on organizations
  for all using (
    owner_id = auth.uid() or
    exists (select 1 from org_staff where org_id = organizations.id and user_id = auth.uid())
  );

-- facilities: public can read active ones; operators manage their own
alter table facilities enable row level security;
create policy "public read active" on facilities
  for select using (is_active = true);
create policy "operator manage" on facilities
  for all using (
    exists (select 1 from organizations o
      join org_staff s on s.org_id = o.id
      where o.id = facilities.org_id and s.user_id = auth.uid())
  );

-- availability_blocks: public read (for calendar); operators manage their own rooms
alter table availability_blocks enable row level security;
create policy "public read blocks" on availability_blocks for select using (true);
create policy "operator manage blocks" on availability_blocks
  for all using (
    exists (
      select 1 from rooms r
      join facilities f on f.id = r.facility_id
      join organizations o on o.id = f.org_id
      join org_staff s on s.org_id = o.id
      where r.id = availability_blocks.room_id and s.user_id = auth.uid()
    )
  );

-- bookings: guests see their own; operators see bookings for their facilities
alter table bookings enable row level security;
create policy "guest own bookings" on bookings
  for select using (guest_id = auth.uid());
create policy "operator facility bookings" on bookings
  for select using (
    exists (
      select 1 from rooms r
      join facilities f on f.id = r.facility_id
      join org_staff s on s.org_id = f.org_id
      where r.id = bookings.room_id and s.user_id = auth.uid()
    )
  );
```

## Supabase Client Setup

### `src/lib/supabase/server.ts`
```ts
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import type { Database } from '@/types/database'

export function createClient() {
  const cookieStore = cookies()
  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll: () => cookieStore.getAll(), setAll: (c) => c.forEach(({ name, value, options }) => cookieStore.set(name, value, options)) } }
  )
}
```

### `src/lib/supabase/client.ts`
```ts
import { createBrowserClient } from '@supabase/ssr'
import type { Database } from '@/types/database'

export function createClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
```

## Server Actions

All mutations use Server Actions in `src/lib/actions/`. Keep actions thin — validate, call DB, return result.

### Availability Actions (`src/lib/actions/availability.ts`)
```ts
'use server'
// createAvailabilityBlock(roomId, startDate, endDate, reason)
// deleteAvailabilityBlock(blockId)
// isRoomAvailable(roomId, checkinDate, checkoutDate) → boolean
```

### Booking Actions (`src/lib/actions/bookings.ts`)
```ts
'use server'
// createBooking(roomId, checkinDate, checkoutDate, guestCount, mealIncluded, priceType)
//   → validates availability, calculates price, creates booking record, returns bookingCode
// cancelBooking(bookingId)
// checkInGuest(bookingId, caretakerId)
// checkOutGuest(bookingId)
// extendBooking(bookingId, newCheckoutDate)
```

### Availability Check Logic
```ts
// CRITICAL: Always check both availability_blocks AND existing bookings
async function isRoomAvailable(roomId, checkinDate, checkoutDate) {
  // 1. Check availability_blocks — any overlap = NOT available
  // 2. Check bookings with status != 'cancelled' — any overlap = NOT available
  // Both checks required
}
```

### Booking Code Generator
```ts
function generateBookingCode(): string {
  const part1 = Math.random().toString(36).substring(2, 6).toUpperCase()
  const part2 = Math.random().toString(36).substring(2, 6).toUpperCase()
  return `DHARA-${part1}-${part2}`
}
```

## Supabase Edge Functions

Located in `supabase/functions/`. Each is a Deno module.

### `post-checkout-impact` (triggered after booking status → completed)
- Calculates impact contribution
- Sends "thank you + impact" SMS/email to guest

### `monthly-payout-processor` (cron, runs 1st of each month)
- Aggregates completed bookings per org
- Creates `payouts` records
- Triggers bank transfer (via payment provider webhook)
- Sends earnings summary email to org

### `booking-reminders` (cron, runs daily)
- Finds bookings with checkin_date = tomorrow
- Sends reminder SMS/email to guest with check-in info

## Database Helper Patterns

All raw queries go in `src/lib/supabase/queries/`. Examples:

```ts
// src/lib/supabase/queries/facilities.ts
export async function getFacilityBySlug(slug: string) { ... }
export async function getFacilitiesForOrg(orgId: string) { ... }
export async function getActiveFacilities(filters) { ... }

// src/lib/supabase/queries/bookings.ts
export async function getBookingsForGuest(guestId: string) { ... }
export async function getBookingsForFacility(facilityId: string, dateRange) { ... }
export async function getBookingByCode(bookingCode: string) { ... }

// src/lib/supabase/queries/availability.ts
export async function getBlocksForRoom(roomId: string, month: Date) { ... }
export async function getRoomAvailability(roomId: string, start: Date, end: Date) { ... }
```

## Price Calculation

```ts
const PLATFORM_FEE_RATE = 0.08  // 8%
const TAX_RATE = 0.05           // 5% VAT (adjust per local regulation)

function calculateBookingPrice(roomRate, nights, mealAddon, mealIncluded) {
  const roomTotal = roomRate * nights
  const mealTotal = mealIncluded ? (mealAddon * nights) : 0
  const subtotal = roomTotal + mealTotal
  const platformFee = subtotal * PLATFORM_FEE_RATE
  const taxAmount = (subtotal + platformFee) * TAX_RATE
  const total = subtotal + platformFee + taxAmount
  return { roomTotal, mealTotal, platformFee, taxAmount, total }
}
```

## Migration Conventions

- One migration per logical change: `YYYYMMDDHHMMSS_description.sql`
- Never edit applied migrations — only add new ones
- Always include rollback as a comment at the bottom of the migration file
- Run locally: `supabase db push` — staging/prod via CI

## Do's ✅

- Always use typed Supabase client (`Database` generic) — never raw `any`.
- Always check `availability_blocks` AND existing `bookings` before allowing a new booking.
- Always use Server Actions for mutations — never expose insert/update directly from the client.
- Always generate `booking_code` server-side.
- Store price and fee snapshot on the booking record at creation time (prices may change later).

## Don'ts ❌

- Never use the service role key in client-side code.
- Never skip RLS — every table must have it enabled.
- Never store full bank account numbers in plaintext.
- Never let a guest create a booking without first verifying room availability.
- Never delete `availability_blocks` that overlap with confirmed bookings.
