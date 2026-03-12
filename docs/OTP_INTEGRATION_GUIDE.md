# Dhara — Phone OTP Authentication Integration Guide

> For the developer implementing real SMS OTP login/signup to replace the current mock system.
> Last updated: 2026-03-12

---

## Table of Contents

1. [Current Mock System (What Exists)](#1-current-mock-system-what-exists)
2. [Target Architecture](#2-target-architecture)
3. [Option A: Supabase Phone Auth (Recommended)](#3-option-a-supabase-phone-auth-recommended)
4. [Option B: Custom OTP with SMS Provider](#4-option-b-custom-otp-with-sms-provider)
5. [SMS Provider Options for Bangladesh](#5-sms-provider-options-for-bangladesh)
6. [Database Changes Required](#6-database-changes-required)
7. [Frontend Changes Required](#7-frontend-changes-required)
8. [Security Considerations](#8-security-considerations)
9. [Testing](#9-testing)

---

## 1. Current Mock System (What Exists)

The app currently uses a **fully mock auth system** stored in `localStorage`. No real authentication happens.

### Key Files

| File | Purpose |
|------|---------|
| `src/lib/mock-auth.ts` | Mock session management, phone lookup, fake OTP verification |
| `src/app/login/page.tsx` | Login page — phone number → OTP → session |
| `src/app/signup/page.tsx` | Signup page — role selection → phone OTP → profile form |
| `src/components/shared/otp-input.tsx` | Reusable 6-digit OTP input component (keep this) |

### How the Mock Works

1. User enters phone number on login page
2. `sendMockOtp()` returns `{ success: true, hint: "123456" }` — the hint is shown on screen
3. User enters `123456` (hardcoded mock OTP)
4. `verifyMockOtp()` checks if code === `"123456"`
5. `loginWithPhone()` looks up phone in a hardcoded map of mock users
6. If found → creates `localStorage` session → redirects to dashboard
7. If not found → redirects to `/signup?phone=xxx`

### What to Keep

- **`src/components/shared/otp-input.tsx`** — the OTP input UI component. It's clean, handles paste, arrow keys, backspace. Reuse it.
- **The overall UX flow** — phone → OTP → dashboard/signup. This is the right pattern; just replace the mock functions with real ones.

---

## 2. Target Architecture

```
┌─────────────┐     ┌──────────────┐     ┌──────────────────┐
│  User enters │────▶│  Backend     │────▶│  SMS Provider     │
│  phone number│     │  generates   │     │  sends OTP via    │
│              │     │  OTP + stores│     │  SMS to phone     │
└─────────────┘     └──────┬───────┘     └──────────────────┘
                           │
                    ┌──────▼───────┐
                    │  User enters │
                    │  OTP code    │
                    └──────┬───────┘
                           │
                    ┌──────▼───────┐
                    │  Backend     │
                    │  verifies    │──── ✅ Match → Create/return session
                    │  OTP code    │──── ❌ No match → Error
                    └──────────────┘
```

There are two approaches. Pick the one that fits your needs.

---

## 3. Option A: Supabase Phone Auth (Recommended)

Supabase has **built-in phone OTP authentication**. This is the easiest path — Supabase handles OTP generation, storage, expiry, and rate limiting. You just need to plug in an SMS provider.

### Step 1: Enable Phone Auth in Supabase

1. Go to **Supabase Dashboard → Authentication → Providers → Phone**
2. Toggle **Enable Phone provider** ON
3. Choose SMS provider (see [Section 5](#5-sms-provider-options-for-bangladesh) for Bangladesh options)
4. Enter the SMS provider credentials

Supabase supports these SMS providers natively:
- **Twilio** (international, reliable, more expensive)
- **MessageBird**
- **Vonage**
- **Custom SMS hook** (for any provider — this is what you'll use for local BD providers)

### Step 2: Set Up Custom SMS Hook (for BD providers)

Since Twilio is expensive for Bangladesh, you'll likely use a local provider (BulkSMS BD, SSL Wireless, etc.). Use Supabase's **custom SMS hook** feature:

1. Go to **Supabase Dashboard → Authentication → Hooks**
2. Enable **Custom SMS sender** hook
3. Point it to a **Supabase Edge Function** that calls your SMS provider

**Edge Function: `supabase/functions/send-sms/index.ts`**

```typescript
import { serve } from "https://deno.land/std@0.177.0/http/server.ts"

interface SMSHookPayload {
  user: {
    phone: string
  }
  sms: {
    otp: string
  }
}

serve(async (req) => {
  const payload: SMSHookPayload = await req.json()
  const phone = payload.user.phone
  const otp = payload.sms.otp

  // ── Replace with your SMS provider's API ──
  // Example: BulkSMS BD
  const response = await fetch("https://bulksmsbd.net/api/smsapi", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      api_key: Deno.env.get("SMS_API_KEY"),
      senderid: Deno.env.get("SMS_SENDER_ID"),
      number: phone,
      message: `Your Dhara verification code is: ${otp}. Valid for 5 minutes. Do not share this code.`,
    }),
  })

  if (!response.ok) {
    return new Response(
      JSON.stringify({ error: "Failed to send SMS" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    )
  }

  return new Response(
    JSON.stringify({ success: true }),
    { status: 200, headers: { "Content-Type": "application/json" } }
  )
})
```

### Step 3: Frontend Implementation

Replace the mock functions in a new file `src/lib/auth/phone-auth.ts`:

```typescript
import { createClient } from "@/lib/supabase/client"

/**
 * Send OTP to a phone number.
 * Supabase handles OTP generation, storage, and sending via the SMS hook.
 */
export async function sendOtp(phone: string): Promise<{ success: boolean; error?: string }> {
  const supabase = createClient()

  const { error } = await supabase.auth.signInWithOtp({
    phone,
    options: {
      // If the user doesn't exist, this will create a new user
      shouldCreateUser: true,
    },
  })

  if (error) {
    return { success: false, error: error.message }
  }

  return { success: true }
}

/**
 * Verify the OTP code and sign in.
 * Returns the session if successful.
 */
export async function verifyOtp(
  phone: string,
  code: string
): Promise<{ success: boolean; isNewUser: boolean; error?: string }> {
  const supabase = createClient()

  const { data, error } = await supabase.auth.verifyOtp({
    phone,
    token: code,
    type: "sms",
  })

  if (error) {
    return { success: false, isNewUser: false, error: error.message }
  }

  // Check if this user has a profile (existing user) or needs to create one (new user)
  const { data: profile } = await supabase
    .from("profiles")
    .select("id, role")
    .eq("id", data.user?.id)
    .single()

  return {
    success: true,
    isNewUser: !profile,
  }
}

/**
 * Sign out the current user.
 */
export async function signOut(): Promise<void> {
  const supabase = createClient()
  await supabase.auth.signOut()
}
```

### Step 4: Update Login Page

Replace the mock calls in `src/app/login/page.tsx`:

```typescript
// Before (mock):
import { sendMockOtp, verifyMockOtp, loginWithPhone } from "@/lib/mock-auth"

// After (real):
import { sendOtp, verifyOtp } from "@/lib/auth/phone-auth"

// In handleSendOtp:
const result = await sendOtp(phone)
if (result.success) {
  setStep("otp")
} else {
  setError(result.error || "Failed to send OTP")
}

// In handleVerifyOtp:
const result = await verifyOtp(phone, otp)
if (result.success) {
  if (result.isNewUser) {
    router.push(`/signup?phone=${encodeURIComponent(phone)}`)
  } else {
    router.push(redirect || "/dashboard")  // Middleware handles role-based redirect
  }
} else {
  setError(result.error || "Invalid OTP")
}
```

### Step 5: Update Signup Page

After OTP verification in signup, create the profile:

```typescript
import { createClient } from "@/lib/supabase/client"

// After form submission:
const supabase = createClient()
const { data: { user } } = await supabase.auth.getUser()

if (user) {
  // Create profile
  await supabase.from("profiles").insert({
    id: user.id,
    full_name: values.fullName,
    email: values.email,
    phone: phone,
    role: selectedRole,  // 'guest' or 'operator'
  })

  if (selectedRole === "operator") {
    // Create org shell
    await supabase.from("organizations").insert({
      owner_id: user.id,
      name: values.orgName,
      status: "pending",
    })
  }
}
```

### Step 6: Auth Callback & Middleware

Since phone auth doesn't use redirects (unlike OAuth), you don't need an `/auth/callback` route. But you DO need middleware to protect routes:

```typescript
// src/middleware.ts
import { createServerClient } from "@supabase/ssr"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll: (cookiesToSet) => {
          cookiesToSet.forEach(({ name, value, options }) => {
            request.cookies.set(name, value)
            response.cookies.set(name, value, options)
          })
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()
  const path = request.nextUrl.pathname

  // Protected routes
  if (path.startsWith("/dashboard") || path.startsWith("/bookings") || path.startsWith("/book")) {
    if (!user) return NextResponse.redirect(new URL(`/login?redirect=${path}`, request.url))
  }

  if (path.startsWith("/operator")) {
    if (!user) return NextResponse.redirect(new URL(`/login?redirect=${path}`, request.url))

    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single()

    if (profile?.role !== "operator") {
      return NextResponse.redirect(new URL("/dashboard", request.url))
    }

    if (!path.startsWith("/operator/pending")) {
      const { data: org } = await supabase
        .from("organizations")
        .select("status")
        .eq("owner_id", user.id)
        .single()

      if (org?.status !== "approved") {
        return NextResponse.redirect(new URL("/operator/pending", request.url))
      }
    }
  }

  return response
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|api/|auth/).*)"],
}
```

---

## 4. Option B: Custom OTP with SMS Provider

If you want **full control** over the OTP flow (your own table, your own rate limiting, your own expiry logic) without relying on Supabase's built-in phone auth.

### Architecture

```
Phone number
  → Server Action: generate 6-digit OTP, store in `otp_codes` table, send via SMS API
  → User enters OTP
  → Server Action: verify OTP against `otp_codes` table
  → If valid: create Supabase session manually using service role
```

### Step 1: Create OTP Table

```sql
-- Migration: create_otp_codes.sql
CREATE TABLE otp_codes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  phone text NOT NULL,
  code text NOT NULL,
  expires_at timestamptz NOT NULL,
  verified boolean DEFAULT false,
  attempts int DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX idx_otp_codes_phone ON otp_codes (phone, created_at DESC);

-- Auto-cleanup expired codes
CREATE OR REPLACE FUNCTION cleanup_expired_otps()
RETURNS void AS $$
BEGIN
  DELETE FROM otp_codes WHERE expires_at < now() - interval '1 hour';
END;
$$ LANGUAGE plpgsql;
```

### Step 2: Server Action — Send OTP

```typescript
// src/lib/actions/auth.ts
"use server"

import { createClient } from "@/lib/supabase/server"

const OTP_EXPIRY_MINUTES = 5
const MAX_ATTEMPTS = 5
const RATE_LIMIT_SECONDS = 60  // 1 OTP per minute per phone

function generateOtp(): string {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

export async function sendOtp(phone: string): Promise<{ success: boolean; error?: string }> {
  const supabase = createClient()

  // Rate limiting: check if OTP was sent recently
  const { data: recent } = await supabase
    .from("otp_codes")
    .select("created_at")
    .eq("phone", phone)
    .order("created_at", { ascending: false })
    .limit(1)
    .single()

  if (recent) {
    const elapsed = Date.now() - new Date(recent.created_at).getTime()
    if (elapsed < RATE_LIMIT_SECONDS * 1000) {
      const waitSeconds = Math.ceil((RATE_LIMIT_SECONDS * 1000 - elapsed) / 1000)
      return { success: false, error: `Please wait ${waitSeconds} seconds before requesting another code` }
    }
  }

  const code = generateOtp()
  const expiresAt = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000).toISOString()

  // Store OTP
  const { error: insertError } = await supabase
    .from("otp_codes")
    .insert({ phone, code, expires_at: expiresAt })

  if (insertError) {
    return { success: false, error: "Failed to generate code" }
  }

  // Send SMS via your provider
  const smsResult = await sendSms(phone, `Your Dhara code is: ${code}. Valid for ${OTP_EXPIRY_MINUTES} minutes.`)

  if (!smsResult.success) {
    return { success: false, error: "Failed to send SMS. Please try again." }
  }

  return { success: true }
}

export async function verifyOtp(phone: string, code: string): Promise<{
  success: boolean
  error?: string
}> {
  const supabase = createClient()

  // Find the latest unused OTP for this phone
  const { data: otpRecord, error } = await supabase
    .from("otp_codes")
    .select("*")
    .eq("phone", phone)
    .eq("verified", false)
    .gt("expires_at", new Date().toISOString())
    .order("created_at", { ascending: false })
    .limit(1)
    .single()

  if (error || !otpRecord) {
    return { success: false, error: "No valid code found. Please request a new one." }
  }

  // Check attempt limit
  if (otpRecord.attempts >= MAX_ATTEMPTS) {
    return { success: false, error: "Too many attempts. Please request a new code." }
  }

  // Increment attempts
  await supabase
    .from("otp_codes")
    .update({ attempts: otpRecord.attempts + 1 })
    .eq("id", otpRecord.id)

  // Verify code
  if (otpRecord.code !== code) {
    return { success: false, error: "Invalid code. Please try again." }
  }

  // Mark as verified
  await supabase
    .from("otp_codes")
    .update({ verified: true })
    .eq("id", otpRecord.id)

  return { success: true }
}
```

### Step 3: SMS Sending Function

```typescript
// src/lib/sms/provider.ts

interface SmsResult {
  success: boolean
  error?: string
}

// ── BulkSMS BD ──
export async function sendSms(phone: string, message: string): Promise<SmsResult> {
  try {
    const response = await fetch("https://bulksmsbd.net/api/smsapi", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        api_key: process.env.SMS_API_KEY,
        senderid: process.env.SMS_SENDER_ID,
        number: phone.replace(/[\s\-+]/g, ""),  // Clean phone format
        message,
      }),
    })

    const data = await response.json()

    if (data.response_code === 202) {
      return { success: true }
    }

    return { success: false, error: data.error_message || "SMS failed" }
  } catch (err) {
    return { success: false, error: "SMS service unavailable" }
  }
}

// ── Alternative: SSL Wireless ──
export async function sendSmsSslWireless(phone: string, message: string): Promise<SmsResult> {
  try {
    const params = new URLSearchParams({
      user: process.env.SSL_SMS_USER!,
      pass: process.env.SSL_SMS_PASS!,
      sid: process.env.SSL_SMS_SID!,
      msisdn: phone.replace(/[\s\-+]/g, ""),
      sms: message,
      csmsid: `dhara_${Date.now()}`,
    })

    const response = await fetch(
      `https://smsplus.sslwireless.com/api/v3/send-sms?${params.toString()}`
    )

    const data = await response.json()
    return data.status === "SUCCESS"
      ? { success: true }
      : { success: false, error: data.message }
  } catch {
    return { success: false, error: "SMS service unavailable" }
  }
}
```

### Step 4: Creating a Supabase Session After Custom OTP

If using Option B (custom OTP), you need to create a Supabase Auth session after verification. Use the **admin API** with the service role:

```typescript
// src/lib/actions/auth.ts (continued)
import { createServiceClient } from "@/lib/supabase/admin"

export async function createSessionForPhone(phone: string): Promise<{
  success: boolean
  isNewUser: boolean
  error?: string
}> {
  const admin = createServiceClient()

  // Check if user exists with this phone
  const { data: existingUsers } = await admin.auth.admin.listUsers()
  const existingUser = existingUsers?.users.find((u) => u.phone === phone)

  if (existingUser) {
    // Existing user — generate a magic link or session token
    // Note: You might use a custom JWT approach here
    return { success: true, isNewUser: false }
  }

  // New user — create auth user with phone
  const { data: newUser, error } = await admin.auth.admin.createUser({
    phone,
    phone_confirm: true,
  })

  if (error) {
    return { success: false, isNewUser: false, error: error.message }
  }

  return { success: true, isNewUser: true }
}

// src/lib/supabase/admin.ts
import { createClient } from "@supabase/supabase-js"
import type { Database } from "@/types/database"

export function createServiceClient() {
  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!  // Server-side only!
  )
}
```

---

## 5. SMS Provider Options for Bangladesh

| Provider | Website | Cost (approx.) | API Quality | Notes |
|----------|---------|----------------|-------------|-------|
| **BulkSMS BD** | bulksmsbd.net | ~৳0.25/SMS | Simple REST API | Popular in BD, good docs |
| **SSL Wireless** | sslwireless.com | ~৳0.30/SMS | REST API | Part of SSL group (same as SSLCommerz) |
| **Infobip** | infobip.com | ~৳0.50/SMS | Excellent API | International, reliable, more expensive |
| **Twilio** | twilio.com | ~$0.05/SMS (~৳5.50) | Excellent API | International, expensive for BD |
| **Muthofun** | muthofun.com | ~৳0.20/SMS | Basic API | Budget option |
| **Reve Systems** | revecloud.com | ~৳0.25/SMS | REST API | BD-based, good support |

### Recommendation

- **For development/testing:** Use **Twilio** (best documentation, sandbox mode available)
- **For production in Bangladesh:** Use **BulkSMS BD** or **SSL Wireless** (cheapest, local support)
- **BTRC Sender ID:** You MUST register a sender ID (e.g. "DHARA") with BTRC through your SMS provider. Without it, SMS will come from a random number or may be blocked.

### Environment Variables to Add

```env
# SMS Provider
SMS_PROVIDER=bulksmsbd                 # or 'sslwireless', 'twilio', 'infobip'
SMS_API_KEY=your_api_key_here
SMS_SENDER_ID=DHARA                    # Registered with BTRC
SMS_API_URL=https://bulksmsbd.net/api/smsapi

# If using Twilio
TWILIO_ACCOUNT_SID=
TWILIO_AUTH_TOKEN=
TWILIO_PHONE_NUMBER=

# If using SSL Wireless
SSL_SMS_USER=
SSL_SMS_PASS=
SSL_SMS_SID=
```

---

## 6. Database Changes Required

### If Using Option A (Supabase Phone Auth)

Minimal changes — Supabase handles the `auth.users` table automatically. You just need to make sure the `profiles` table is created on first login:

```sql
-- profiles table already designed (see DATABASE_SCHEMA.md)
-- The auth callback / trigger creates the profile row

-- Optional: trigger to auto-create profile on signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, phone, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    NEW.phone,
    COALESCE(NEW.raw_user_meta_data->>'role', 'guest')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();
```

### If Using Option B (Custom OTP)

You need the `otp_codes` table (see Section 4, Step 1) plus the same `profiles` setup.

---

## 7. Frontend Changes Required

### Files to Modify

| File | What to Change |
|------|---------------|
| `src/lib/mock-auth.ts` | Replace with real auth functions (or delete entirely) |
| `src/app/login/page.tsx` | Replace `sendMockOtp` / `verifyMockOtp` / `loginWithPhone` with real functions |
| `src/app/signup/page.tsx` | Replace `sendMockOtp` / `verifyMockOtp` / `signupAsGuest` / `signupAsOperator` with real functions |
| `src/components/shared/otp-input.tsx` | **No changes needed** — keep as-is |
| `src/components/layout/operator-layout.tsx` | Remove `StaffSwitcher` dev tool (or keep behind env flag) |
| `src/middleware.ts` | Replace mock auth check with real Supabase auth check |
| All pages using `getMockSession()` | Replace with Supabase `getUser()` or `useUser()` hook |

### Search for All Mock Auth Usage

Run this to find every file that imports from mock-auth:

```bash
grep -r "mock-auth" src/ --include="*.tsx" --include="*.ts" -l
```

Each of these files needs to be updated to use real Supabase auth instead.

### Shared Auth Hook for Client Components

```typescript
// src/lib/hooks/use-user.ts
"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import type { User } from "@supabase/supabase-js"

export function useUser() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user)
      setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [supabase])

  return { user, loading }
}
```

---

## 8. Security Considerations

### OTP Security

- **Expiry:** OTP must expire after 5 minutes maximum
- **Attempt limit:** Max 5 attempts per OTP code, then invalidate
- **Rate limiting:** Max 1 OTP request per phone number per 60 seconds
- **Brute force protection:** After 10 failed verifications in 1 hour, block the phone for 1 hour
- **OTP length:** 6 digits minimum (999,999 combinations)
- **No OTP in URL:** Never pass OTP as a URL parameter
- **Clean up:** Delete verified and expired OTP codes regularly

### Session Security

- Use **httpOnly cookies** for session tokens (Supabase SSR handles this)
- **Never store tokens in localStorage** in production (mock only)
- Set **short session expiry** (e.g. 7 days) with refresh tokens
- Implement **sign out on all devices** capability

### Phone Number Validation

```typescript
function isValidBangladeshiPhone(phone: string): boolean {
  // Bangladesh mobile numbers: +880 1XXXXXXXXX (13 digits with country code)
  const cleaned = phone.replace(/[\s\-()]/g, "")
  return /^(\+?880)?01[3-9]\d{8}$/.test(cleaned)
}
```

---

## 9. Testing

### Manual Test Cases

| # | Scenario | Expected Result |
|---|----------|----------------|
| 1 | Enter valid BD phone, receive OTP, enter correct code | Login succeeds, redirects to dashboard |
| 2 | Enter valid phone, enter wrong OTP 5 times | "Too many attempts" error |
| 3 | Enter valid phone, wait > 5 minutes, enter OTP | "Code expired" error |
| 4 | Request OTP twice within 60 seconds | Rate limit error on second request |
| 5 | Login with phone that has no account | Redirected to signup page with phone pre-filled |
| 6 | Complete signup as guest with verified phone | Profile created, redirected to guest dashboard |
| 7 | Complete signup as operator with verified phone | Org created with status "pending", redirected to pending page |
| 8 | Login as operator with unapproved org | Redirected to /operator/pending |
| 9 | Login as operator with approved org | Redirected to /operator/dashboard |
| 10 | Invalid phone format (too short, wrong prefix) | Validation error before OTP is sent |

### Automated Testing

```typescript
// Example test with Playwright
test("login with phone OTP", async ({ page }) => {
  await page.goto("/login")

  // Enter phone
  await page.fill('[id="phone"]', "+8801712345678")
  await page.click('button:has-text("Send OTP")')

  // Wait for OTP input to appear
  await page.waitForSelector('[data-testid="otp-input"]')

  // Enter OTP (use test number if provider supports it)
  // ...

  // Verify redirect
  await page.waitForURL("/dashboard")
})
```

---

## Migration Checklist

When you're ready to switch from mock to real auth:

- [ ] Choose Option A or B
- [ ] Set up SMS provider account and get API credentials
- [ ] Register sender ID with BTRC (if BD provider)
- [ ] Add SMS env vars to `.env.local` and production environment
- [ ] If Option A: Enable phone auth in Supabase dashboard, deploy SMS hook Edge Function
- [ ] If Option B: Run OTP table migration, implement server actions
- [ ] Create `src/lib/auth/phone-auth.ts` with real functions
- [ ] Update `src/app/login/page.tsx` to use real functions
- [ ] Update `src/app/signup/page.tsx` to use real functions
- [ ] Update middleware for real auth
- [ ] Replace all `getMockSession()` calls across the codebase
- [ ] Remove `src/lib/mock-auth.ts` (or keep behind `NEXT_PUBLIC_USE_MOCK_AUTH` flag)
- [ ] Remove mock OTP hint from UI
- [ ] Test all flows end-to-end
- [ ] Test rate limiting and security edge cases
- [ ] Deploy to staging and test with real SMS

---

*Hand this document to the developer handling OTP integration. The mock system is functional and demonstrates the exact UX flow — they just need to swap the mock functions with real ones.*
