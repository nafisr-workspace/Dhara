# Dhara — Database Schema & Backend Architecture

> Complete technical reference for the Supabase/PostgreSQL backend.
> For review before implementation.
> Last updated: 2026-03-12

---

## Table of Contents

1. [Architecture Overview](#1-architecture-overview)
2. [Entity Relationship Map](#2-entity-relationship-map)
3. [Tables — Full Definitions](#3-tables--full-definitions)
4. [Indexes](#4-indexes)
5. [Row Level Security (RLS) Policies](#5-row-level-security-rls-policies)
6. [Supabase Storage Buckets](#6-supabase-storage-buckets)
7. [Auth Configuration](#7-auth-configuration)
8. [Server Actions (Mutations)](#8-server-actions-mutations)
9. [Edge Functions](#9-edge-functions)
10. [Price Calculation Logic](#10-price-calculation-logic)
11. [Migration Plan](#11-migration-plan)
12. [Security Checklist](#12-security-checklist)

---

## 1. Architecture Overview

```
┌───────────────────────────────────────────────────────────┐
│  Next.js App Router (frontend + API routes)               │
│  ┌──────────────────┐ ┌──────────────────────────────┐    │
│  │ Server Components │ │ Client Components            │    │
│  │ (read via server  │ │ (read via browser client,    │    │
│  │  Supabase client) │ │  mutations via Server        │    │
│  └──────────────────┘ │  Actions only)               │    │
│                        └──────────────────────────────┘    │
│  ┌─────────────────────────────────────┐                   │
│  │ Server Actions (src/lib/actions/)   │                   │
│  │ — bookings, availability, payments  │                   │
│  └──────────────┬──────────────────────┘                   │
│                 │                                           │
│  ┌──────────────▼──────────────────────┐                   │
│  │ Supabase Helpers (src/lib/supabase/)│                   │
│  │ — typed query functions             │                   │
│  └──────────────┬──────────────────────┘                   │
└─────────────────┼─────────────────────────────────────────┘
                  │ HTTPS
┌─────────────────▼─────────────────────────────────────────┐
│  Supabase                                                  │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────────┐  │
│  │ Auth     │ │ Database │ │ Storage  │ │ Edge         │  │
│  │ (Google  │ │ (Postgres│ │ (photos, │ │ Functions    │  │
│  │  OAuth)  │ │  + RLS)  │ │  docs)   │ │ (Deno)       │  │
│  └──────────┘ └──────────┘ └──────────┘ └──────────────┘  │
└───────────────────────────────────────────────────────────┘
                  │
                  │ Webhooks / API
┌─────────────────▼─────────────────────────────────────────┐
│  SSLCommerz Payment Gateway (bKash, Nagad, Card)           │
└───────────────────────────────────────────────────────────┘
```

**Key principles:**

- All schema changes go through tracked **migrations** (`supabase/migrations/`).
- All data access is mediated through **RLS policies** — no open tables.
- All mutations go through **Server Actions** — no direct client-side inserts/updates.
- The **service role key** never appears in client-side code.
- **Availability blocks always take priority** over guest bookings (core business rule).

---

## 2. Entity Relationship Map

```
auth.users (Supabase Auth)
    │
    │ 1:1  (id → id)
    ▼
┌──────────┐
│ profiles  │ ← extended user info (name, phone, role, ID doc, avatar)
└──────────┘
    │
    │ 1:N  (owner_id)
    ▼
┌────────────────┐       ┌──────────────────────────┐
│ organizations  │──────▶│ org_staff                │  (N staff per org)
└────────────────┘       │ maps user_id + org_id    │
    │                    │ + role + page_access      │
    │ 1:N               └──────────────────────────┘
    │                    ┌──────────────────────────┐
    │───────────────────▶│ verification_documents   │  (N docs per org)
    │                    └──────────────────────────┘
    │ 1:N               ┌──────────────────────────┐
    │───────────────────▶│ payouts                  │  (monthly earnings)
    │                    └──────────────────────────┘
    ▼
┌──────────────┐
│ facilities   │
└──────────────┘
    │
    ├── 1:N ──▶ facility_photos
    │
    ├── 1:N ──▶ facility_safety_tags
    │
    └── 1:N
        ▼
    ┌────────┐
    │ rooms  │
    └────────┘
        │
        ├── 1:N ──▶ room_photos
        │
        ├── 1:N ──▶ availability_blocks  (operator-controlled date blocks)
        │
        └── 1:N
            ▼
        ┌──────────┐
        │ bookings │
        └──────────┘
            │
            ├── 1:N ──▶ messages  (platform communication)
            │
            └── 1:N ──▶ reviews   (guest ↔ facility reviews)
```

---

## 3. Tables — Full Definitions

### 3.1 `profiles`

Extends Supabase `auth.users`. Created automatically on first login via the auth callback.

| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| `id` | `uuid` | PK, FK → `auth.users(id)` ON DELETE CASCADE | Same as auth user ID |
| `full_name` | `text` | NOT NULL | From Google profile or manual entry |
| `email` | `text` | | Synced from auth.users on creation |
| `phone` | `text` | | Bangladeshi format: `+880 1XXX XXXXXX` |
| `role` | `text` | NOT NULL, CHECK `('guest','operator')` | Set at signup, immutable |
| `avatar_url` | `text` | | Supabase Storage path or Google avatar URL |
| `id_type` | `text` | CHECK `('nid','passport')` | For ID verification at check-in |
| `id_last_four` | `text` | | Last 4 digits of NID or passport number |
| `notification_sms` | `boolean` | DEFAULT `true` | |
| `notification_email` | `boolean` | DEFAULT `true` | |
| `created_at` | `timestamptz` | DEFAULT `now()` | |
| `updated_at` | `timestamptz` | DEFAULT `now()` | Auto-updated via trigger |

---

### 3.2 `organizations`

One organization per operator. Created as a shell on operator signup, filled in during profile completion.

| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| `id` | `uuid` | PK, DEFAULT `gen_random_uuid()` | |
| `owner_id` | `uuid` | FK → `profiles(id)` | The user who created this org |
| `name` | `text` | NOT NULL | Legal org name |
| `logo_url` | `text` | | Storage path |
| `contact_email` | `text` | | Public contact email |
| `contact_phone` | `text` | | Public contact phone |
| `description` | `text` | | Brief description of the org |
| `website_url` | `text` | | Org website |
| `bank_account_masked` | `text` | | Last 4 digits for display: `****4567` |
| `bank_account_encrypted` | `text` | | Encrypted full account for payouts |
| `bank_name` | `text` | | e.g. "BRAC Bank" |
| `bank_branch` | `text` | | |
| `mfs_type` | `text` | CHECK `('bkash','nagad')` | Mobile financial service for payouts |
| `mfs_number` | `text` | | Mobile number for bKash/Nagad |
| `status` | `text` | NOT NULL, DEFAULT `'pending'`, CHECK `('pending','approved','paused','suspended')` | Platform approval status |
| `verification_status` | `text` | NOT NULL, DEFAULT `'pending_documents'`, CHECK `('pending_documents','under_review','verified','rejected')` | Document verification state |
| `terms_accepted_at` | `timestamptz` | | When T&C were accepted |
| `approved_at` | `timestamptz` | | When Dhara team approved |
| `approved_by` | `uuid` | FK → `profiles(id)` | Admin who approved |
| `rejection_reason` | `text` | | If rejected, why |
| `created_at` | `timestamptz` | DEFAULT `now()` | |
| `updated_at` | `timestamptz` | DEFAULT `now()` | |

---

### 3.3 `verification_documents`

Documents submitted by operators for org verification.

| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| `id` | `uuid` | PK, DEFAULT `gen_random_uuid()` | |
| `org_id` | `uuid` | FK → `organizations(id)` ON DELETE CASCADE | |
| `document_type` | `text` | NOT NULL | `'ngo_registration'`, `'tin_certificate'`, `'constitution'`, `'signatory_nid'`, `'facility_ownership'` |
| `label` | `text` | NOT NULL | Human-readable label |
| `description` | `text` | | Helper text |
| `status` | `text` | NOT NULL, DEFAULT `'not_uploaded'`, CHECK `('not_uploaded','uploaded','verified','rejected')` | |
| `storage_path` | `text` | | Supabase Storage path for the uploaded file |
| `file_name` | `text` | | Original file name |
| `file_size_bytes` | `bigint` | | |
| `rejection_reason` | `text` | | Admin feedback on rejection |
| `reviewed_by` | `uuid` | FK → `profiles(id)` | Admin who reviewed |
| `reviewed_at` | `timestamptz` | | |
| `uploaded_at` | `timestamptz` | | |
| `created_at` | `timestamptz` | DEFAULT `now()` | |

---

### 3.4 `org_staff`

Maps users to organizations with role-based access.

| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| `id` | `uuid` | PK, DEFAULT `gen_random_uuid()` | |
| `org_id` | `uuid` | FK → `organizations(id)` ON DELETE CASCADE | |
| `user_id` | `uuid` | FK → `profiles(id)` ON DELETE CASCADE | |
| `role` | `text` | NOT NULL, DEFAULT `'staff'`, CHECK `('admin','staff','caretaker')` | |
| `page_access` | `text[]` | DEFAULT `'{}'` | Array of allowed page IDs: `front_desk`, `dashboard`, `facilities`, `calendar`, `bookings`, `earnings`, `messages`, `profile` |
| `invited_by` | `uuid` | FK → `profiles(id)` | Who added this staff member |
| `is_active` | `boolean` | DEFAULT `true` | Soft disable without removing |
| `created_at` | `timestamptz` | DEFAULT `now()` | |

**Unique constraint:** `(org_id, user_id)` — a user can only have one role per org.

---

### 3.5 `facilities`

Physical accommodation centers belonging to an organization.

| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| `id` | `uuid` | PK, DEFAULT `gen_random_uuid()` | |
| `org_id` | `uuid` | FK → `organizations(id)` ON DELETE CASCADE | |
| `name` | `text` | NOT NULL | |
| `slug` | `text` | UNIQUE, NOT NULL | URL-friendly name, auto-generated |
| `description` | `text` | | |
| `type` | `text` | CHECK `('guesthouse','training_center','conference_center','mixed')` | |
| `location_label` | `text` | | Display string: "Sylhet Sadar, Sylhet" |
| `division` | `text` | | Major administrative division |
| `district` | `text` | | |
| `area` | `text` | | |
| `lat` | `double precision` | | Map coordinates |
| `lng` | `double precision` | | |
| `amenities` | `jsonb` | DEFAULT `'[]'` | `[{ "icon": "wifi", "label": "Free WiFi" }, ...]` |
| `rules` | `jsonb` | DEFAULT `'[]'` | `[{ "label": "Check-in", "value": "2:00 PM" }, ...]` |
| `impact_line` | `text` | | Short impact tagline |
| `impact_story` | `text` | | Longer impact narrative |
| `community_activities` | `text` | | What the org does in the community |
| `price_from` | `numeric(10,2)` | | Lowest room price (denormalized for search) |
| `rating` | `numeric(3,2)` | DEFAULT `0` | Average rating (denormalized) |
| `review_count` | `integer` | DEFAULT `0` | Total review count (denormalized) |
| `is_active` | `boolean` | DEFAULT `false` | Only active facilities visible to guests |
| `created_at` | `timestamptz` | DEFAULT `now()` | |
| `updated_at` | `timestamptz` | DEFAULT `now()` | |

---

### 3.6 `facility_photos`

| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| `id` | `uuid` | PK, DEFAULT `gen_random_uuid()` | |
| `facility_id` | `uuid` | FK → `facilities(id)` ON DELETE CASCADE | |
| `storage_path` | `text` | NOT NULL | Path in Supabase Storage |
| `alt_text` | `text` | | Accessibility alt text |
| `is_cover` | `boolean` | DEFAULT `false` | The main display image |
| `sort_order` | `integer` | DEFAULT `0` | Display order |
| `created_at` | `timestamptz` | DEFAULT `now()` | |

---

### 3.7 `facility_safety_tags`

Normalized safety/trust badges per facility.

| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| `id` | `uuid` | PK, DEFAULT `gen_random_uuid()` | |
| `facility_id` | `uuid` | FK → `facilities(id)` ON DELETE CASCADE | |
| `tag` | `text` | NOT NULL, CHECK `('women-safe','gated','security','verified')` | |

**Unique constraint:** `(facility_id, tag)` — no duplicate tags.

---

### 3.8 `rooms`

Bookable units within a facility.

| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| `id` | `uuid` | PK, DEFAULT `gen_random_uuid()` | |
| `facility_id` | `uuid` | FK → `facilities(id)` ON DELETE CASCADE | |
| `name` | `text` | NOT NULL | e.g. "Deluxe Twin", "6-Bed Dormitory" |
| `type` | `text` | NOT NULL, CHECK `('single','double','dorm','hall')` | |
| `capacity` | `integer` | NOT NULL, CHECK `(capacity > 0)` | Max guests |
| `price_partner` | `numeric(10,2)` | NOT NULL | NGO partner rate |
| `price_public` | `numeric(10,2)` | NOT NULL | Standard guest rate |
| `price_corporate` | `numeric(10,2)` | NOT NULL | Corporate/group rate |
| `meal_addon_price` | `numeric(10,2)` | DEFAULT `0` | Per-night meal add-on |
| `is_active` | `boolean` | DEFAULT `true` | Inactive rooms not shown to guests |
| `created_at` | `timestamptz` | DEFAULT `now()` | |
| `updated_at` | `timestamptz` | DEFAULT `now()` | |

---

### 3.9 `room_photos`

| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| `id` | `uuid` | PK, DEFAULT `gen_random_uuid()` | |
| `room_id` | `uuid` | FK → `rooms(id)` ON DELETE CASCADE | |
| `storage_path` | `text` | NOT NULL | Path in Supabase Storage |
| `alt_text` | `text` | | |
| `sort_order` | `integer` | DEFAULT `0` | |
| `created_at` | `timestamptz` | DEFAULT `now()` | |

---

### 3.10 `availability_blocks`

**The most critical table.** Operators block date ranges on specific rooms. Guests cannot book any room on a blocked date. This enforces the core business rule that the NGO's internal operations always override guest bookings.

| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| `id` | `uuid` | PK, DEFAULT `gen_random_uuid()` | |
| `room_id` | `uuid` | FK → `rooms(id)` ON DELETE CASCADE | |
| `start_date` | `date` | NOT NULL | |
| `end_date` | `date` | NOT NULL | |
| `reason` | `text` | | `'training'`, `'workshop'`, `'maintenance'`, `'internal'`, etc. |
| `created_by` | `uuid` | FK → `profiles(id)` | Staff member who created the block |
| `created_at` | `timestamptz` | DEFAULT `now()` | |

**Check constraint:** `start_date <= end_date`

**Exclusion constraint (recommended):** Prevent overlapping blocks for the same room using a GiST index:

```sql
ALTER TABLE availability_blocks
  ADD CONSTRAINT no_overlapping_blocks
  EXCLUDE USING gist (
    room_id WITH =,
    daterange(start_date, end_date, '[]') WITH &&
  );
```

This requires the `btree_gist` extension.

---

### 3.11 `bookings`

| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| `id` | `uuid` | PK, DEFAULT `gen_random_uuid()` | Also used as `tran_id` for SSLCommerz |
| `booking_code` | `text` | UNIQUE, NOT NULL | Format: `DHARA-XXXX-XXXX` (generated server-side) |
| `guest_id` | `uuid` | FK → `profiles(id)` | |
| `room_id` | `uuid` | FK → `rooms(id)` | |
| `facility_id` | `uuid` | FK → `facilities(id)` | Denormalized for query efficiency |
| `checkin_date` | `date` | NOT NULL | |
| `checkout_date` | `date` | NOT NULL | |
| `guest_count` | `integer` | NOT NULL, DEFAULT `1`, CHECK `(guest_count > 0)` | |
| `meal_included` | `boolean` | DEFAULT `false` | |
| `price_type` | `text` | CHECK `('partner','public','corporate')` | Which rate was applied |
| `room_rate` | `numeric(10,2)` | NOT NULL | Per-night rate snapshot at booking time |
| `meal_charge` | `numeric(10,2)` | DEFAULT `0` | Total meal charge for the stay |
| `platform_fee` | `numeric(10,2)` | NOT NULL | 8% of subtotal |
| `tax_amount` | `numeric(10,2)` | NOT NULL | 5% VAT |
| `total_amount` | `numeric(10,2)` | NOT NULL | Final guest-facing total |
| `payment_status` | `text` | DEFAULT `'pending'`, CHECK `('pending','paid','refunded','partially_refunded','cash_pending')` | |
| `payment_method` | `text` | CHECK `('bkash','nagad','card','cash')` | |
| `payment_reference` | `text` | | SSLCommerz `val_id` or transaction ref |
| `cash_collected_by` | `uuid` | FK → `profiles(id)` | Caretaker who collected cash |
| `cash_collected_at` | `timestamptz` | | |
| `status` | `text` | DEFAULT `'pending_approval'`, CHECK `('pending_approval','upcoming','checked_in','completed','cancelled','no_show')` | |
| `source` | `text` | DEFAULT `'platform'`, CHECK `('platform','manual')` | Manual = operator-created booking |
| `special_requests` | `text` | | Free-text guest notes |
| `actual_checkin_at` | `timestamptz` | | Real check-in timestamp |
| `actual_checkout_at` | `timestamptz` | | Real check-out timestamp |
| `checked_in_by` | `uuid` | FK → `profiles(id)` | Caretaker who performed check-in |
| `checked_out_by` | `uuid` | FK → `profiles(id)` | Caretaker who performed check-out |
| `cancelled_at` | `timestamptz` | | |
| `cancellation_reason` | `text` | | |
| `refund_amount` | `numeric(10,2)` | | Amount refunded (if any) |
| `created_at` | `timestamptz` | DEFAULT `now()` | |
| `updated_at` | `timestamptz` | DEFAULT `now()` | |

**Check constraint:** `checkin_date < checkout_date`

---

### 3.12 `messages`

Platform messaging between guests and facility staff, scoped to a booking.

| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| `id` | `uuid` | PK, DEFAULT `gen_random_uuid()` | |
| `booking_id` | `uuid` | FK → `bookings(id)` ON DELETE CASCADE | Messages are scoped to bookings |
| `sender_id` | `uuid` | FK → `profiles(id)` | `NULL` for system messages |
| `content` | `text` | NOT NULL | |
| `type` | `text` | NOT NULL, DEFAULT `'text'`, CHECK `('text','booking_request','system')` | |
| `metadata` | `jsonb` | | For `booking_request` type: request details |
| `read_at` | `timestamptz` | | When the recipient read this message |
| `created_at` | `timestamptz` | DEFAULT `now()` | |

---

### 3.13 `reviews`

Bi-directional reviews: guests review facilities, operators review guests. Reviews are moderated — negative reviews require admin approval before becoming public.

| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| `id` | `uuid` | PK, DEFAULT `gen_random_uuid()` | |
| `booking_id` | `uuid` | FK → `bookings(id)` | One review per booking per direction |
| `reviewer_id` | `uuid` | FK → `profiles(id)` | Who wrote the review |
| `target_type` | `text` | NOT NULL, CHECK `('facility','guest')` | |
| `target_id` | `uuid` | NOT NULL | `facility.id` or `profiles.id` depending on target_type |
| `rating` | `integer` | NOT NULL, CHECK `(rating >= 1 AND rating <= 5)` | 1-5 stars |
| `comment` | `text` | | |
| `is_public` | `boolean` | DEFAULT `false` | `true` after moderation for negative reviews |
| `moderation_status` | `text` | DEFAULT `'auto_approved'`, CHECK `('auto_approved','pending_review','approved','rejected')` | Ratings ≥ 4 auto-approved; < 4 go to moderation |
| `moderated_by` | `uuid` | FK → `profiles(id)` | Admin who moderated |
| `moderated_at` | `timestamptz` | | |
| `created_at` | `timestamptz` | DEFAULT `now()` | |

**Unique constraint:** `(booking_id, reviewer_id)` — one review per reviewer per booking.

**Moderation rule:** Reviews with `rating >= 4` are auto-approved and immediately public. Reviews with `rating < 4` go to `pending_review` and require a Dhara admin to approve before they appear publicly. This protects NGO reputations per platform policy.

---

### 3.14 `payouts`

Monthly earnings aggregated per organization.

| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| `id` | `uuid` | PK, DEFAULT `gen_random_uuid()` | |
| `org_id` | `uuid` | FK → `organizations(id)` | |
| `period_month` | `date` | NOT NULL | First day of the month: `2026-03-01` |
| `booking_count` | `integer` | NOT NULL | Number of completed bookings in period |
| `gross_amount` | `numeric(10,2)` | NOT NULL | Sum of `total_amount` for included bookings |
| `platform_fee` | `numeric(10,2)` | NOT NULL | Sum of `platform_fee` |
| `tax_collected` | `numeric(10,2)` | NOT NULL | Sum of `tax_amount` |
| `net_payout` | `numeric(10,2)` | NOT NULL | `gross - platform_fee` (tax remitted separately) |
| `status` | `text` | DEFAULT `'pending'`, CHECK `('pending','processing','paid','failed')` | |
| `paid_at` | `timestamptz` | | |
| `payment_reference` | `text` | | Bank transfer reference |
| `booking_ids` | `uuid[]` | NOT NULL | Which bookings are included |
| `created_at` | `timestamptz` | DEFAULT `now()` | |

**Unique constraint:** `(org_id, period_month)` — one payout record per org per month.

---

## 4. Indexes

```sql
-- Performance-critical: availability + booking overlap checks
CREATE INDEX idx_availability_blocks_room_dates
  ON availability_blocks (room_id, start_date, end_date);

CREATE INDEX idx_bookings_room_dates
  ON bookings (room_id, checkin_date, checkout_date)
  WHERE status NOT IN ('cancelled');

-- Booking lookups
CREATE INDEX idx_bookings_guest ON bookings (guest_id);
CREATE INDEX idx_bookings_facility ON bookings (facility_id);
CREATE UNIQUE INDEX idx_bookings_code ON bookings (booking_code);

-- Facility search / discovery
CREATE UNIQUE INDEX idx_facilities_slug ON facilities (slug);
CREATE INDEX idx_facilities_active_division ON facilities (division, is_active)
  WHERE is_active = true;
CREATE INDEX idx_facilities_org ON facilities (org_id);

-- Room lookups
CREATE INDEX idx_rooms_facility ON rooms (facility_id);

-- Staff lookups
CREATE UNIQUE INDEX idx_org_staff_unique ON org_staff (org_id, user_id);
CREATE INDEX idx_org_staff_user ON org_staff (user_id);

-- Messages (for thread loading)
CREATE INDEX idx_messages_booking ON messages (booking_id, created_at);

-- Reviews
CREATE INDEX idx_reviews_target ON reviews (target_type, target_id)
  WHERE is_public = true;
CREATE INDEX idx_reviews_booking ON reviews (booking_id);

-- Verification docs
CREATE INDEX idx_verification_docs_org ON verification_documents (org_id);

-- Payouts
CREATE INDEX idx_payouts_org ON payouts (org_id, period_month);

-- Photos
CREATE INDEX idx_facility_photos_facility ON facility_photos (facility_id, sort_order);
CREATE INDEX idx_room_photos_room ON room_photos (room_id, sort_order);
```

---

## 5. Row Level Security (RLS) Policies

**Every table has RLS enabled.** No exceptions.

### 5.1 `profiles`

```sql
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Users can read and update their own profile
CREATE POLICY "Users manage own profile"
  ON profiles FOR ALL
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Operators can read profiles of guests who booked their facilities
-- (needed for check-in, messaging)
CREATE POLICY "Operators read guest profiles for their bookings"
  ON profiles FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM bookings b
      JOIN rooms r ON r.id = b.room_id
      JOIN facilities f ON f.id = r.facility_id
      JOIN org_staff s ON s.org_id = f.org_id
      WHERE b.guest_id = profiles.id
        AND s.user_id = auth.uid()
    )
  );
```

### 5.2 `organizations`

```sql
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;

-- Org owner and staff can read/manage their org
CREATE POLICY "Org members manage own org"
  ON organizations FOR ALL
  USING (
    owner_id = auth.uid()
    OR EXISTS (SELECT 1 FROM org_staff WHERE org_id = organizations.id AND user_id = auth.uid())
  );
```

### 5.3 `verification_documents`

```sql
ALTER TABLE verification_documents ENABLE ROW LEVEL SECURITY;

-- Org members can read and insert/update their own docs
CREATE POLICY "Org members manage verification docs"
  ON verification_documents FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM organizations o
      LEFT JOIN org_staff s ON s.org_id = o.id
      WHERE o.id = verification_documents.org_id
        AND (o.owner_id = auth.uid() OR s.user_id = auth.uid())
    )
  );
```

### 5.4 `org_staff`

```sql
ALTER TABLE org_staff ENABLE ROW LEVEL SECURITY;

-- Org admins can manage staff; staff can read their own entry
CREATE POLICY "Org admin manages staff"
  ON org_staff FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM organizations o
      WHERE o.id = org_staff.org_id AND o.owner_id = auth.uid()
    )
    OR
    EXISTS (
      SELECT 1 FROM org_staff s2
      WHERE s2.org_id = org_staff.org_id
        AND s2.user_id = auth.uid()
        AND s2.role = 'admin'
    )
  );

CREATE POLICY "Staff reads own membership"
  ON org_staff FOR SELECT
  USING (user_id = auth.uid());
```

### 5.5 `facilities`

```sql
ALTER TABLE facilities ENABLE ROW LEVEL SECURITY;

-- Public: anyone can read active facilities (discovery)
CREATE POLICY "Public reads active facilities"
  ON facilities FOR SELECT
  USING (is_active = true);

-- Operators manage their own org's facilities
CREATE POLICY "Operators manage own facilities"
  ON facilities FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM org_staff s
      WHERE s.org_id = facilities.org_id AND s.user_id = auth.uid()
    )
    OR
    EXISTS (
      SELECT 1 FROM organizations o
      WHERE o.id = facilities.org_id AND o.owner_id = auth.uid()
    )
  );
```

### 5.6 `facility_photos` / `room_photos`

```sql
-- Public read (needed for discovery + booking pages)
CREATE POLICY "Public reads photos"
  ON facility_photos FOR SELECT USING (true);

CREATE POLICY "Public reads room photos"
  ON room_photos FOR SELECT USING (true);

-- Operators manage photos for their facilities/rooms
CREATE POLICY "Operators manage facility photos"
  ON facility_photos FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM facilities f
      JOIN org_staff s ON s.org_id = f.org_id
      WHERE f.id = facility_photos.facility_id AND s.user_id = auth.uid()
    )
  );

CREATE POLICY "Operators manage room photos"
  ON room_photos FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM rooms r
      JOIN facilities f ON f.id = r.facility_id
      JOIN org_staff s ON s.org_id = f.org_id
      WHERE r.id = room_photos.room_id AND s.user_id = auth.uid()
    )
  );
```

### 5.7 `rooms`

```sql
ALTER TABLE rooms ENABLE ROW LEVEL SECURITY;

-- Public reads rooms of active facilities
CREATE POLICY "Public reads rooms"
  ON rooms FOR SELECT
  USING (
    EXISTS (SELECT 1 FROM facilities f WHERE f.id = rooms.facility_id AND f.is_active = true)
  );

-- Operators manage their rooms
CREATE POLICY "Operators manage own rooms"
  ON rooms FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM facilities f
      JOIN org_staff s ON s.org_id = f.org_id
      WHERE f.id = rooms.facility_id AND s.user_id = auth.uid()
    )
  );
```

### 5.8 `availability_blocks`

```sql
ALTER TABLE availability_blocks ENABLE ROW LEVEL SECURITY;

-- Public read (guests need to see which dates are blocked)
CREATE POLICY "Public reads blocks"
  ON availability_blocks FOR SELECT
  USING (true);

-- Operators manage blocks for their rooms
CREATE POLICY "Operators manage blocks"
  ON availability_blocks FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM rooms r
      JOIN facilities f ON f.id = r.facility_id
      JOIN org_staff s ON s.org_id = f.org_id
      WHERE r.id = availability_blocks.room_id AND s.user_id = auth.uid()
    )
  );
```

### 5.9 `bookings`

```sql
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- Guests see their own bookings
CREATE POLICY "Guests read own bookings"
  ON bookings FOR SELECT
  USING (guest_id = auth.uid());

-- Guests can create bookings (insert only, not update/delete)
CREATE POLICY "Guests create bookings"
  ON bookings FOR INSERT
  WITH CHECK (guest_id = auth.uid());

-- Operators see bookings for their facilities
CREATE POLICY "Operators read facility bookings"
  ON bookings FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM rooms r
      JOIN facilities f ON f.id = r.facility_id
      JOIN org_staff s ON s.org_id = f.org_id
      WHERE r.id = bookings.room_id AND s.user_id = auth.uid()
    )
  );

-- Operators can update bookings (check-in, check-out, status changes)
CREATE POLICY "Operators update facility bookings"
  ON bookings FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM rooms r
      JOIN facilities f ON f.id = r.facility_id
      JOIN org_staff s ON s.org_id = f.org_id
      WHERE r.id = bookings.room_id AND s.user_id = auth.uid()
    )
  );
```

### 5.10 `messages`

```sql
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Participants of a booking can read messages
CREATE POLICY "Booking participants read messages"
  ON messages FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM bookings b
      WHERE b.id = messages.booking_id
        AND (
          b.guest_id = auth.uid()
          OR EXISTS (
            SELECT 1 FROM rooms r
            JOIN facilities f ON f.id = r.facility_id
            JOIN org_staff s ON s.org_id = f.org_id
            WHERE r.id = b.room_id AND s.user_id = auth.uid()
          )
        )
    )
  );

-- Participants can send messages
CREATE POLICY "Booking participants send messages"
  ON messages FOR INSERT
  WITH CHECK (
    sender_id = auth.uid()
    AND EXISTS (
      SELECT 1 FROM bookings b
      WHERE b.id = messages.booking_id
        AND (
          b.guest_id = auth.uid()
          OR EXISTS (
            SELECT 1 FROM rooms r
            JOIN facilities f ON f.id = r.facility_id
            JOIN org_staff s ON s.org_id = f.org_id
            WHERE r.id = b.room_id AND s.user_id = auth.uid()
          )
        )
    )
  );
```

### 5.11 `reviews`

```sql
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- Public reads approved reviews
CREATE POLICY "Public reads public reviews"
  ON reviews FOR SELECT
  USING (is_public = true);

-- Reviewers can read their own (even if not yet public)
CREATE POLICY "Reviewers read own reviews"
  ON reviews FOR SELECT
  USING (reviewer_id = auth.uid());

-- Guests can create reviews for completed bookings
CREATE POLICY "Guests create reviews"
  ON reviews FOR INSERT
  WITH CHECK (
    reviewer_id = auth.uid()
    AND EXISTS (
      SELECT 1 FROM bookings b
      WHERE b.id = reviews.booking_id
        AND b.status = 'completed'
        AND b.guest_id = auth.uid()
    )
  );
```

### 5.12 `payouts`

```sql
ALTER TABLE payouts ENABLE ROW LEVEL SECURITY;

-- Org members can view their payouts (read-only; payouts are system-generated)
CREATE POLICY "Org members read payouts"
  ON payouts FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM org_staff s
      WHERE s.org_id = payouts.org_id AND s.user_id = auth.uid()
    )
    OR
    EXISTS (
      SELECT 1 FROM organizations o
      WHERE o.id = payouts.org_id AND o.owner_id = auth.uid()
    )
  );
```

---

## 6. Supabase Storage Buckets

| Bucket | Access | Max file size | Allowed types | Purpose |
|--------|--------|---------------|---------------|---------|
| `facility-photos` | Public read, authenticated write | 5 MB | `image/jpeg`, `image/png`, `image/webp` | Facility gallery images |
| `room-photos` | Public read, authenticated write | 5 MB | `image/jpeg`, `image/png`, `image/webp` | Room-specific photos |
| `verification-docs` | Private (org members only) | 10 MB | `application/pdf`, `image/jpeg`, `image/png` | NGO registration docs, TIN, NID scans |
| `avatars` | Public read, authenticated write | 2 MB | `image/jpeg`, `image/png`, `image/webp` | User profile photos |
| `org-logos` | Public read, authenticated write | 2 MB | `image/jpeg`, `image/png`, `image/webp`, `image/svg+xml` | Organization logos |

### Storage RLS Policies

```sql
-- facility-photos: anyone reads, org staff uploads
CREATE POLICY "Public reads facility photos" ON storage.objects
  FOR SELECT USING (bucket_id = 'facility-photos');

CREATE POLICY "Org staff uploads facility photos" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'facility-photos'
    AND auth.role() = 'authenticated'
  );

-- verification-docs: only org members access
CREATE POLICY "Org members access verification docs" ON storage.objects
  FOR ALL USING (
    bucket_id = 'verification-docs'
    AND auth.role() = 'authenticated'
  );
```

---

## 7. Auth Configuration

### Provider

- **Google OAuth only** — no email/password authentication.
- Google Cloud Console OAuth 2.0 credentials with redirect URI: `https://<project>.supabase.co/auth/v1/callback`

### Signup Flow

```
1. User chooses role on /signup page (Guest or Operator)
2. Role stored in short-lived cookie (signup_role, max-age 600s)
3. Google OAuth initiated → Supabase handles token exchange
4. /auth/callback checks if profiles row exists:
   - New user → create profiles record with role from cookie
     - If operator → also create organizations record (status: 'pending')
     - Redirect to /auth/complete-profile
   - Returning user → redirect to appropriate dashboard
5. Complete profile page collects remaining info (phone, org name, etc.)
6. Operators land on /operator/pending until org approved
```

### Middleware Route Protection

| Route Pattern | Rule |
|---------------|------|
| `/dashboard`, `/bookings/*`, `/book/*` | Must be authenticated |
| `/operator/*` (except `/operator/pending`) | Must be authenticated + `role = 'operator'` + `org.status = 'approved'` |
| `/operator/pending` | Must be authenticated + `role = 'operator'` |
| `/login`, `/signup` | Redirect to dashboard if already logged in |
| `/`, `/discover`, `/places/*`, `/about` | Public, no auth required |

---

## 8. Server Actions (Mutations)

All located in `src/lib/actions/`. Each action uses the server-side Supabase client.

### `bookings.ts`

| Action | Parameters | Key Logic |
|--------|-----------|-----------|
| `initBooking` | `roomId, checkinDate, checkoutDate, guestCount, mealIncluded, priceType, paymentMethod` | 1. Check `availability_blocks` overlap. 2. Check existing `bookings` overlap. 3. Calculate price. 4. Generate `booking_code`. 5. Insert booking. 6. If online payment → init SSLCommerz → return payment URL. If cash → return booking directly. |
| `cancelBooking` | `bookingId` | Check cancellation policy window, calculate refund, update status, initiate refund via gateway if applicable. |
| `checkInGuest` | `bookingId, caretakerId` | Update `status → 'checked_in'`, set `actual_checkin_at`, set `checked_in_by`. |
| `checkOutGuest` | `bookingId` | Update `status → 'completed'`, set `actual_checkout_at`. Trigger post-checkout Edge Function. |
| `approveBooking` | `bookingId` | Update `status → 'upcoming'` (for `pending_approval` bookings). |
| `declineBooking` | `bookingId, reason` | Update `status → 'cancelled'`, initiate refund. |
| `collectCash` | `bookingId, caretakerId` | Update `payment_status → 'paid'`, set `cash_collected_by` and `cash_collected_at`. |

### `availability.ts`

| Action | Parameters | Key Logic |
|--------|-----------|-----------|
| `createBlock` | `roomId, startDate, endDate, reason` | Insert `availability_blocks` row. Check no confirmed bookings overlap (warn operator). |
| `deleteBlock` | `blockId` | Delete block (operators can unblock). |

### `facilities.ts`

| Action | Parameters | Key Logic |
|--------|-----------|-----------|
| `createFacility` | `orgId, name, description, type, location, ...` | Insert facility, auto-generate slug. |
| `updateFacility` | `facilityId, fields` | Update editable fields. |
| `toggleFacilityActive` | `facilityId` | Toggle `is_active`. |

### `rooms.ts`

| Action | Parameters | Key Logic |
|--------|-----------|-----------|
| `createRoom` | `facilityId, name, type, capacity, prices` | Insert room. Update facility `price_from` if needed. |
| `updateRoom` | `roomId, fields` | Update room. |
| `toggleRoomActive` | `roomId` | Toggle `is_active`. |

### `reviews.ts`

| Action | Parameters | Key Logic |
|--------|-----------|-----------|
| `submitReview` | `bookingId, rating, comment, targetType` | Insert review. If `rating >= 4` → auto-approve. Else → `pending_review`. Update facility `rating` and `review_count` (denormalized). |

### `messages.ts`

| Action | Parameters | Key Logic |
|--------|-----------|-----------|
| `sendMessage` | `bookingId, content` | Insert message with `sender_id = auth.uid()`. |
| `markRead` | `messageId` | Update `read_at` to `now()`. |

### `organizations.ts`

| Action | Parameters | Key Logic |
|--------|-----------|-----------|
| `updateOrganization` | `orgId, fields` | Update org info (name, contact, bank details). |
| `uploadVerificationDoc` | `orgId, documentType, file` | Upload to `verification-docs` bucket, update `verification_documents` row. |
| `addStaffMember` | `orgId, email, role, pageAccess` | Find or invite user → insert `org_staff` row. |
| `removeStaffMember` | `staffId` | Delete `org_staff` row (cannot remove owner). |
| `updateStaffMember` | `staffId, role, pageAccess` | Update role and page access. |

---

## 9. Edge Functions

Located in `supabase/functions/`. Each runs on Deno runtime.

### `post-checkout-impact`

- **Trigger:** After booking `status` changes to `completed`
- **Logic:** Calculate impact contribution amount, generate impact statement, send "thank you + impact" SMS/email to guest
- **Example output:** "Your 3-night stay funded 2 days of health clinic service at Coastal Climate Centre"

### `monthly-payout-processor`

- **Trigger:** Cron — 1st of each month
- **Logic:** For each org: aggregate completed+paid bookings from previous month → create `payouts` record → initiate bank/MFS transfer → send earnings summary email

### `booking-reminders`

- **Trigger:** Cron — daily at 9 AM
- **Logic:** Find bookings with `checkin_date = tomorrow` → send reminder SMS/email with check-in time, address, booking code

### `stale-booking-cleanup`

- **Trigger:** Cron — every 2 hours
- **Logic:** Find bookings with `payment_status = 'pending'` older than 2 hours → update `status = 'cancelled'` (guest never completed payment)

---

## 10. Price Calculation Logic

```
Constants (stored in config, not hardcoded):
  PLATFORM_FEE_RATE = 0.08  (8%)
  TAX_RATE          = 0.05  (5% VAT)

Inputs:
  roomRate     = room.price_[partner|public|corporate]   (per night)
  nights       = checkout_date - checkin_date
  mealAddon    = room.meal_addon_price                   (per night)
  mealIncluded = boolean

Calculation:
  roomTotal    = roomRate × nights
  mealTotal    = mealIncluded ? (mealAddon × nights) : 0
  subtotal     = roomTotal + mealTotal
  platformFee  = subtotal × PLATFORM_FEE_RATE
  taxAmount    = (subtotal + platformFee) × TAX_RATE
  totalAmount  = subtotal + platformFee + taxAmount

All amounts stored as numeric(10,2).
All prices displayed in BDT (৳).
Price snapshot is taken at booking creation time — future rate changes don't affect existing bookings.
```

---

## 11. Migration Plan

Migrations will be applied in this order. Each is a separate file in `supabase/migrations/`.

| # | Migration | Description |
|---|-----------|-------------|
| 1 | `00001_enable_extensions.sql` | Enable `btree_gist` (for exclusion constraints), `pg_trgm` (for text search) |
| 2 | `00002_create_profiles.sql` | Create `profiles` table, trigger for `updated_at`, RLS policies |
| 3 | `00003_create_organizations.sql` | Create `organizations` table, RLS policies |
| 4 | `00004_create_verification_documents.sql` | Create `verification_documents` table, RLS policies |
| 5 | `00005_create_org_staff.sql` | Create `org_staff` table, unique constraint, RLS policies |
| 6 | `00006_create_facilities.sql` | Create `facilities`, `facility_photos`, `facility_safety_tags` tables, RLS policies |
| 7 | `00007_create_rooms.sql` | Create `rooms`, `room_photos` tables, RLS policies |
| 8 | `00008_create_availability_blocks.sql` | Create `availability_blocks` table, exclusion constraint, RLS policies |
| 9 | `00009_create_bookings.sql` | Create `bookings` table, RLS policies |
| 10 | `00010_create_messages.sql` | Create `messages` table, RLS policies |
| 11 | `00011_create_reviews.sql` | Create `reviews` table, moderation logic, RLS policies |
| 12 | `00012_create_payouts.sql` | Create `payouts` table, RLS policies |
| 13 | `00013_create_indexes.sql` | All performance indexes |
| 14 | `00014_create_storage_buckets.sql` | Storage bucket setup and policies |
| 15 | `00015_seed_data.sql` | Optional: seed test data (facilities, rooms, bookings) for development |

### `updated_at` Auto-Update Trigger

Applied to all tables with an `updated_at` column:

```sql
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Applied per table:
CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
```

---

## 12. Security Checklist

### Environment Variables

| Variable | Scope | Notes |
|----------|-------|-------|
| `NEXT_PUBLIC_SUPABASE_URL` | Client + Server | Safe to expose |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Client + Server | Safe to expose (RLS enforced) |
| `SUPABASE_SERVICE_ROLE_KEY` | Server ONLY | **Never in client bundle** |
| `SSLCOMMERZ_STORE_ID` | Server ONLY | Payment gateway credential |
| `SSLCOMMERZ_STORE_PASSWORD` | Server ONLY | Payment gateway credential |
| `NEXT_PUBLIC_APP_URL` | Client + Server | For callback URLs |

### Data Protection Rules

- [ ] RLS enabled on every table — no open reads/writes
- [ ] `service_role` key only used in Server Actions, API routes, Edge Functions
- [ ] Bank account numbers encrypted at rest (`bank_account_encrypted`)
- [ ] Only last 4 digits of NID/passport stored (`id_last_four`)
- [ ] Verification documents in private storage bucket
- [ ] Guest personal info (phone, email) not exposed in public facility listings
- [ ] No direct guest-to-operator contact outside platform messaging
- [ ] Negative reviews moderated before public display
- [ ] Payment verification always server-side (webhook, never client-side callback)
- [ ] Stale pending bookings cleaned up to prevent inventory locking

### Business Rule Enforcement

- [ ] Availability blocks checked before every booking creation
- [ ] Existing confirmed bookings checked before every booking creation
- [ ] Operator org must be `status: 'approved'` to access dashboard
- [ ] Operator org must be `verification_status: 'verified'` for facility to go active
- [ ] Booking code generated server-side, never client-side
- [ ] All prices displayed to guests are final and inclusive (no hidden fees)
- [ ] Cash bookings confirmed immediately (no manual approval needed)
- [ ] Platform fee rate and tax rate from config, never hardcoded

---

## Appendix: Database Function Reference

### Availability Check (used in booking creation)

```sql
CREATE OR REPLACE FUNCTION is_room_available(
  p_room_id uuid,
  p_checkin date,
  p_checkout date
) RETURNS boolean AS $$
DECLARE
  has_block boolean;
  has_booking boolean;
BEGIN
  -- Check availability blocks
  SELECT EXISTS (
    SELECT 1 FROM availability_blocks
    WHERE room_id = p_room_id
      AND daterange(start_date, end_date, '[]')
       && daterange(p_checkin, p_checkout, '[)')
  ) INTO has_block;

  IF has_block THEN RETURN false; END IF;

  -- Check existing bookings
  SELECT EXISTS (
    SELECT 1 FROM bookings
    WHERE room_id = p_room_id
      AND status NOT IN ('cancelled', 'no_show')
      AND daterange(checkin_date, checkout_date, '[)')
       && daterange(p_checkin, p_checkout, '[)')
  ) INTO has_booking;

  RETURN NOT has_booking;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

### Booking Code Generator

```sql
CREATE OR REPLACE FUNCTION generate_booking_code()
RETURNS text AS $$
DECLARE
  code text;
  chars text := 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  i int;
  part1 text := '';
  part2 text := '';
BEGIN
  LOOP
    part1 := '';
    part2 := '';
    FOR i IN 1..4 LOOP
      part1 := part1 || substr(chars, floor(random() * length(chars) + 1)::int, 1);
      part2 := part2 || substr(chars, floor(random() * length(chars) + 1)::int, 1);
    END LOOP;
    code := 'DHARA-' || part1 || '-' || part2;
    -- Ensure uniqueness
    IF NOT EXISTS (SELECT 1 FROM bookings WHERE booking_code = code) THEN
      RETURN code;
    END IF;
  END LOOP;
END;
$$ LANGUAGE plpgsql;
```

### Denormalized Rating Update (trigger after review insert)

```sql
CREATE OR REPLACE FUNCTION update_facility_rating()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.target_type = 'facility' AND NEW.is_public = true THEN
    UPDATE facilities SET
      rating = (
        SELECT COALESCE(AVG(rating), 0)
        FROM reviews
        WHERE target_type = 'facility'
          AND target_id = NEW.target_id
          AND is_public = true
      ),
      review_count = (
        SELECT COUNT(*)
        FROM reviews
        WHERE target_type = 'facility'
          AND target_id = NEW.target_id
          AND is_public = true
      )
    WHERE id = NEW.target_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_update_facility_rating
  AFTER INSERT OR UPDATE OF is_public ON reviews
  FOR EACH ROW EXECUTE FUNCTION update_facility_rating();
```

---

*End of schema document. Ready for review.*
