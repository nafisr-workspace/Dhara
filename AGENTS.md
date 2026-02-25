# AGENTS.md

> Instructions for AI coding agents working in this repository.
> Last updated: 2026-02-25

## Project Overview

Dhara is a lightweight booking platform — think "Airbnb for NGO facilities." It connects travelers (guests) with organizations (NGOs, development centers) that have unused accommodation capacity. Guests discover and book rooms; organizations earn sustainable income without changing their core mission. The platform handles payments, tax records, communication, and safety documentation transparently.

There are two main user roles:
- **Guest** — discovers places, books rooms, checks in/out, leaves feedback
- **Operator (NGO/Org)** — lists facilities, manages availability, views earnings, uses front-desk tools

## Architecture

Standard Next.js application using the **App Router** (`/src/app`). The frontend and backend (API routes / Server Actions) live in the same repo. Supabase handles all persistence, auth, and file storage. Supabase Edge Functions handle any async or server-side logic that should run outside the Next.js request cycle (e.g. payment webhooks, post-checkout impact summaries).

Key data domains:
- **Organizations** — NGO profiles, facilities, room listings
- **Bookings** — reservations, check-in/out state, payment status
- **Users** — guests and operators, managed via Supabase Auth
- **Availability** — room blocks set by operators; only unblocked dates/rooms are visible to guests
- **Payments** — collected via bKash/Nagad/card; payouts distributed to org bank accounts monthly

## Tech Stack

- **Language:** TypeScript
- **Framework:** Next.js (App Router)
- **Database & Auth:** Supabase (PostgreSQL + Supabase Auth + Supabase Storage)
- **Edge Functions:** Supabase Edge Functions (Deno)
- **Package manager:** pnpm

## Repo Structure

```
/
├── src/
│   ├── app/                  # Next.js App Router — pages and layouts
│   │   ├── (guest)/          # Guest-facing routes (discovery, booking, profile)
│   │   ├── (operator)/       # Operator dashboard (facility mgmt, front desk, earnings)
│   │   ├── api/              # API route handlers
│   │   └── layout.tsx        # Root layout
│   ├── components/           # Shared UI components
│   ├── lib/                  # Utility functions, Supabase client setup, helpers
│   │   ├── supabase/         # Supabase client (browser + server), typed DB helpers
│   │   └── utils/            # General utility functions
│   ├── types/                # Global TypeScript types and interfaces
│   └── middleware.ts         # Auth middleware (route protection)
├── supabase/
│   ├── migrations/           # SQL migration files — source of truth for DB schema
│   ├── functions/            # Supabase Edge Functions (Deno)
│   └── seed.sql              # Optional seed data
├── public/                   # Static assets
├── .env.local                # Local env vars (never commit)
├── .env.example              # Env var template (commit this)
└── AGENTS.md
```

## Commands

```bash
# Install dependencies
pnpm install

# Run in development
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start

# Run Supabase locally (requires Supabase CLI)
supabase start

# Apply DB migrations
supabase db push

# Deploy an Edge Function
supabase functions deploy <function-name>
```

## Environment & Secrets

- Copy `.env.example` to `.env.local` and fill in all values before running locally.
- Required variables:

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=       # Server-side only — never expose to client
```

- `NEXT_PUBLIC_*` variables are safe for the browser. Everything else is server-only.
- **Never commit `.env.local` or any file containing real secrets.**
- The `SUPABASE_SERVICE_ROLE_KEY` must only be used in Server Actions, API routes, or Edge Functions — never in client components.

## Data Model Notes

These are the core tables agents should understand:

- `organizations` — NGO/operator profiles
- `facilities` — physical centers belonging to an organization
- `rooms` — individual bookable units within a facility
- `availability_blocks` — date ranges blocked by operators (guests cannot book these)
- `bookings` — guest reservations (linked to room, guest user, dates, payment)
- `users` — managed by Supabase Auth; extended via a `profiles` table for guest/operator metadata
- `payouts` — monthly earning records per organization

**Always query availability by checking that requested dates do not overlap any `availability_blocks` for the target room.** This is the core business rule — operators always have priority over guests.

## Code Style & Conventions

- Use **TypeScript strictly** — no `any`, no implicit types. Define types in `src/types/`.
- Use **Server Actions** for form submissions and mutations where possible, rather than client-side fetch calls to API routes.
- Use the **Supabase server client** (from `src/lib/supabase/server.ts`) in Server Components, Server Actions, and API routes. Use the **browser client** only in Client Components.
- Keep Supabase query logic inside `src/lib/supabase/` helper files — do not write raw Supabase queries inline in components or pages.
- Use **named exports** only — no default exports except for Next.js page/layout files (which require default exports).
- Route groups: `(guest)` for traveler flows, `(operator)` for NGO dashboard flows. Keep these separate and never mix concerns.
- All DB schema changes must go through a **Supabase migration file** in `supabase/migrations/`. Never alter the database schema directly through the Supabase dashboard in a way that isn't captured in a migration.

## Agent Do's ✅

- Always check `availability_blocks` before marking a room as bookable — operator-blocked dates must never be shown as available to guests.
- Always use the typed Supabase helpers in `src/lib/supabase/` rather than writing raw queries inline.
- Always use the server-side Supabase client for any operation that touches protected data or uses the service role key.
- Always protect operator routes via `src/middleware.ts` — verify the user has an operator role before rendering any `(operator)` pages.
- When adding a new DB table or column, create a proper migration file under `supabase/migrations/`.
- Keep the guest experience frictionless — booking confirmation must be immediate (no manual approval steps).
- Ensure all prices displayed to guests are **final and inclusive of taxes** — no hidden fees at checkout.
- All guest-to-org communication must route through the platform (no personal phone numbers exposed).

## Agent Don'ts ❌

- **Never expose `SUPABASE_SERVICE_ROLE_KEY` to the client bundle** — it must only exist in server-side code.
- **Never bypass `availability_blocks`** — this is the #1 business rule. Operators must always have full control over their facility.
- **Never allow direct guest-to-operator contact** outside the platform messaging system.
- **Never hardcode prices, fees, or tax rates** — these must come from the database or environment config.
- **Never skip auth checks** on operator dashboard routes, booking mutations, or payout data.
- **Never modify files inside `supabase/migrations/` that have already been applied** — only add new migration files.
- **Never use `any` in TypeScript** — define proper types in `src/types/` instead.
- **Never write Supabase queries directly in page or component files** — always go through the lib helpers.

## Gotchas & Notes

- **Availability priority is everything.** The system is designed so that an NGO's internal operations (training, workshops, meetings) always override guest bookings. When building or modifying any availability or booking logic, this invariant must hold.
- **Two Supabase clients exist** — one for the browser, one for the server. Using the wrong one in a context will cause auth or permission errors. Check `src/lib/supabase/` for the correct import.
- **Supabase Edge Functions run on Deno** — Node.js-specific packages won't work there. Use Deno-compatible imports.
- **Operator front desk is intentionally simple** — the caretaker screen only shows today's arrivals/departures and needs search by phone or booking code. Don't over-engineer this UI.
- **Payment flow** targets local Bangladeshi payment methods (bKash, Nagad) in addition to card — keep this in mind when integrating any payment provider; don't assume Stripe-only.
- **Feedback/review system is controlled** — negative reviews should not be publicly posted without a moderation step, to protect NGO reputations. Don't implement an open public review system.
- **Impact messaging** (e.g. "your stay funded 3 days of health clinic service") is shown post-checkout and is a key UX feature — don't remove or skip it when building the checkout completion flow.
