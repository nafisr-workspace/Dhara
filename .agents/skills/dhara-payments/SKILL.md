---
name: dhara-payments
description: >
  Implement the payment flow for the Dhara platform. Use this skill when building the
  payment step of the booking flow, integrating bKash/Nagad/card payment methods,
  handling payment webhooks, generating booking confirmations after successful payment,
  processing refunds for cancellations, or implementing monthly payout logic for operators.
  Always use this skill for any payment or financial transaction work in Dhara.
---

# Dhara Payments Skill

## Payment Methods

Dhara targets users in Bangladesh. Supported payment methods:
1. **bKash** — most common mobile banking, must be supported
2. **Nagad** — second most common, must be supported
3. **Card** (Visa/Mastercard) — via a payment gateway (SSLCommerz or ShurjoPay are common in BD)
4. **Cash** — pay at the facility on arrival (special flow, see below)

> **SSLCommerz** is the recommended payment gateway for Bangladesh — it supports bKash, Nagad,
> card, and other local methods in one integration. ShurjoPay is a good alternative.
> Check `https://sslcommerz.com` for latest docs and sandbox credentials.

## Payment Flow Architecture

### Online Payment (bKash / Nagad / Card)
```
Guest selects room + dates
  → Price calculated server-side
  → Booking record created with status: 'pending', payment_status: 'pending'
  → Guest redirected to payment gateway (SSLCommerz hosted page or inline)
  → Payment gateway processes payment
  → Gateway sends webhook to our Edge Function
  → Edge Function verifies + updates booking: payment_status: 'paid', status: 'upcoming'
  → Guest redirected to /book/[roomId]/confirm
```

**Never trust client-side payment success.** Always verify via webhook from the gateway.

### Cash Payment Flow
```
Guest selects room + dates + chooses "Cash on Arrival"
  → Price calculated server-side
  → Booking record created with status: 'upcoming', payment_status: 'cash_pending'
  → Booking confirmation shown immediately (no gateway redirect)
  → Guest arrives at facility and pays caretaker in cash
  → Caretaker marks payment received via front desk UI
  → Booking updated: payment_status: 'paid'
```

**Cash bookings are confirmed immediately** — the guest gets a booking code and can arrive.
The caretaker collects and records payment at check-in via the front desk screen.

Cash bookings require extra fields on the booking record:
```sql
payment_method: 'cash'
payment_status: 'cash_pending'  -- before arrival
-- On check-in, caretaker marks as 'paid'
cash_collected_by: uuid  -- caretaker's profile id
cash_collected_at: timestamptz
```

## Booking + Payment Integration

### Step 1: Create Pending Booking (Server Action)

```ts
// src/lib/actions/bookings.ts
'use server'
export async function initBooking(input: {
  roomId: string
  checkinDate: string
  checkoutDate: string
  guestCount: number
  mealIncluded: boolean
  priceType: 'partner' | 'public' | 'corporate'
  paymentMethod: 'bkash' | 'nagad' | 'card' | 'cash'
}) {
  // 1. Verify room availability (check availability_blocks + existing bookings)
  // 2. Calculate price
  // 3. Generate booking code
  // 4. If cash: insert booking with payment_status: 'cash_pending', status: 'upcoming'
  //            → return { type: 'cash', bookingId } (no gateway redirect)
  // 5. If online: insert booking with payment_status: 'pending'
  //              → initiate SSLCommerz session → return { type: 'online', paymentUrl }
}
```

### Step 2: SSLCommerz Integration

```ts
// src/lib/payments/sslcommerz.ts
export async function initiatePayment(booking: Booking) {
  const payload = {
    store_id: process.env.SSLCOMMERZ_STORE_ID,
    store_passwd: process.env.SSLCOMMERZ_STORE_PASSWORD,
    total_amount: booking.total_amount,
    currency: 'BDT',
    tran_id: booking.id,  // Use booking UUID as transaction ID
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/api/payment/success`,
    fail_url: `${process.env.NEXT_PUBLIC_APP_URL}/api/payment/fail`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/api/payment/cancel`,
    ipn_url: `${process.env.NEXT_PUBLIC_APP_URL}/api/payment/webhook`,
    cus_name: booking.guest_name,
    cus_email: booking.guest_email,
    cus_phone: booking.guest_phone,
    product_name: `Dhara Stay - ${booking.facility_name}`,
    product_category: 'Accommodation',
    product_profile: 'general',
    // ... other required fields
  }
  
  const response = await fetch('https://sandbox.sslcommerz.com/gwprocess/v4/api.php', {
    method: 'POST',
    body: new URLSearchParams(payload),
  })
  
  const data = await response.json()
  return data.GatewayPageURL  // Redirect guest here
}
```

### Step 3: Webhook Handler (API Route)

```ts
// src/app/api/payment/webhook/route.ts
export async function POST(request: Request) {
  const body = await request.formData()
  const transactionId = body.get('tran_id') as string
  const status = body.get('status') as string
  const valId = body.get('val_id') as string
  
  // ALWAYS verify with SSLCommerz validation endpoint
  const isValid = await verifyPayment(valId)
  if (!isValid) return new Response('Invalid', { status: 400 })
  
  if (status === 'VALID' || status === 'VALIDATED') {
    // Update booking: payment_status = 'paid', status = 'upcoming'
    // Store payment_reference = valId
    // Trigger post-payment Edge Function (send confirmation SMS/email)
  }
  
  return new Response('OK', { status: 200 })
}
```

### Step 4: Success/Fail Redirects

```ts
// src/app/api/payment/success/route.ts
// SSLCommerz redirects here after payment — DO NOT trust this alone
// Just redirect to confirmation page; let webhook handle DB update
export async function POST(request: Request) {
  const body = await request.formData()
  const bookingId = body.get('tran_id') as string
  return NextResponse.redirect(`/book/confirmation?id=${bookingId}`)
}

// Confirmation page polls booking status (or uses Supabase Realtime)
// until payment_status = 'paid' before showing success UI
```

## Payment UI Components

### Payment Method Selector

```tsx
// Used in booking step 3
// Shadcn RadioGroup with custom cards per method

<RadioGroup value={method} onValueChange={setMethod}>
  <PaymentMethodCard value="bkash" label="bKash" icon={<BkashIcon />} />
  <PaymentMethodCard value="nagad" label="Nagad" icon={<NagadIcon />} />
  <PaymentMethodCard value="card" label="Card (Visa / Mastercard)" icon={<CardIcon />} />
  <PaymentMethodCard
    value="cash"
    label="Cash on Arrival"
    description="Pay directly at the facility when you arrive"
    icon={<BanknoteIcon />}
  />
</RadioGroup>

// When 'cash' is selected, hide the price summary's "Redirecting to gateway" note
// and instead show: "Your booking will be confirmed immediately. Pay at check-in."
```

### Price Summary (pre-payment)

Show before redirecting to gateway:
```
Room rate (৳X × N nights)     ৳ XXXX
Meals (if included)             ৳ XXX
Platform fee (8%)               ৳ XXX
VAT (5%)                        ৳ XXX
─────────────────────────────────────
Total                           ৳ XXXX
```
Currency symbol: ৳ (Bangladeshi Taka)

### Confirmation Polling Component

After payment gateway redirect, show a loading state while polling:
```tsx
// Polls booking every 2 seconds until payment_status = 'paid' (max 30s)
// On success → show confirmation UI
// On timeout → show "check your bookings" message
```

## Refunds & Cancellations

Refund policy is set per facility. Typical tiers:
- Cancel 48h+ before checkin → full refund
- Cancel 24–48h → 50% refund
- Cancel <24h → no refund

```ts
// src/lib/actions/bookings.ts
export async function cancelBooking(bookingId: string) {
  // 1. Check cancellation policy for this facility
  // 2. Calculate refund amount
  // 3. Update booking status: 'cancelled'
  // 4. Initiate refund via SSLCommerz refund API (if applicable)
  // 5. Update payment_status: 'refunded' (or 'partially_refunded')
}
```

## Monthly Payouts (Edge Function)

```ts
// supabase/functions/monthly-payout-processor/index.ts
// Runs: 1st of each month via pg_cron or Supabase scheduled functions

// For each organization:
// 1. Find all bookings with status='completed', payment_status='paid'
//    for the previous month that haven't been included in a payout yet
// 2. Calculate: gross = sum of total_amount
//              platform_fee = sum of platform_fee
//              tax_collected = sum of tax_amount
//              net_payout = gross - platform_fee  (tax is remitted separately)
// 3. Create payout record
// 4. Trigger bank transfer via payment provider payout API
// 5. Send earnings summary email to org contact
```

## Environment Variables

```env
SSLCOMMERZ_STORE_ID=             # From SSLCommerz dashboard
SSLCOMMERZ_STORE_PASSWORD=       # From SSLCommerz dashboard
SSLCOMMERZ_IS_SANDBOX=true       # Set false in production
NEXT_PUBLIC_APP_URL=https://...  # For callback URLs
```

## Do's ✅

- Always verify payments server-side via the gateway's validation endpoint.
- Always show prices in BDT (৳) throughout the UI.
- Always create the booking record as `pending` before redirecting to payment.
- Always use the booking `id` (UUID) as the transaction ID with the gateway.
- Show a clear loading/polling state after payment redirect — don't assume instant confirmation.

## Don'ts ❌

- Never trust client-side payment success — always wait for webhook verification.
- Never hardcode platform fee or tax rates — keep in config constants.
- Never process a payout for a booking that isn't `status: 'completed'`.
- Never expose SSLCommerz store password in client-side code.
- Never allow a booking to remain in `pending` state indefinitely — add a cleanup job for
  stale pending bookings older than 2 hours.
