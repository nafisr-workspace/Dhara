# Dhara — Client Onboarding & Requirements Checklist

> Everything the client (Dhara team / project owner) needs to provide before we go live.
> Last updated: 2026-03-12

---

## Table of Contents

1. [Supabase & Infrastructure](#1-supabase--infrastructure)
2. [Google OAuth (Login)](#2-google-oauth-login)
3. [Payment Gateway (SSLCommerz)](#3-payment-gateway-sslcommerz)
4. [Domain & Hosting](#4-domain--hosting)
5. [SMS / Notification Service](#5-sms--notification-service)
6. [Branding & Assets](#6-branding--assets)
7. [Legal & Compliance Documents](#7-legal--compliance-documents)
8. [Business Configuration](#8-business-configuration)
9. [Operator (NGO) Verification Requirements](#9-operator-ngo-verification-requirements)
10. [Test Data & Seed Content](#10-test-data--seed-content)
11. [Go-Live Checklist](#11-go-live-checklist)

---

## 1. Supabase & Infrastructure

| # | Item | Status | Notes |
|---|------|--------|-------|
| 1.1 | Supabase project created | ✅ Done | `doakxarkdaalkazzjzkw.supabase.co` |
| 1.2 | `NEXT_PUBLIC_SUPABASE_URL` | ✅ Done | Populated in `.env.local` |
| 1.3 | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | ✅ Done | Populated in `.env.local` |
| 1.4 | `SUPABASE_SERVICE_ROLE_KEY` | ⬜ Pending | Dashboard → Settings → API → service_role key |
| 1.5 | Supabase plan confirmed (Free / Pro) | ⬜ Pending | Pro recommended for production (backups, more storage, no pause) |
| 1.6 | Database region confirmed | ⬜ Pending | Closest to Bangladesh: Singapore (`ap-southeast-1`) recommended |

---

## 2. Google OAuth (Login)

Users sign in with Google. Client needs to set up credentials in Google Cloud Console.

| # | Item | Status | Notes |
|---|------|--------|-------|
| 2.1 | Google Cloud project created | ⬜ Pending | [console.cloud.google.com](https://console.cloud.google.com) |
| 2.2 | OAuth consent screen configured | ⬜ Pending | App name: "Dhara", Logo, Support email, Privacy policy URL, Terms URL |
| 2.3 | OAuth 2.0 Client ID created | ⬜ Pending | Type: Web application |
| 2.4 | Authorized redirect URI added | ⬜ Pending | `https://doakxarkdaalkazzjzkw.supabase.co/auth/v1/callback` |
| 2.5 | Client ID & Secret pasted into Supabase | ⬜ Pending | Supabase Dashboard → Authentication → Providers → Google → Enable → paste |
| 2.6 | OAuth consent screen published | ⬜ Pending | Must be "Published" (not Testing) for anyone to log in |

**Step-by-step for your client:**
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project (name: "Dhara")
3. Go to **APIs & Services → OAuth consent screen** → Fill in app name, email, logo
4. Go to **APIs & Services → Credentials → Create Credentials → OAuth 2.0 Client ID**
5. Application type: **Web application**
6. Authorized redirect URIs: add `https://doakxarkdaalkazzjzkw.supabase.co/auth/v1/callback`
7. Copy the **Client ID** and **Client Secret**
8. Go to **Supabase Dashboard → Authentication → Providers → Google**
9. Toggle ON, paste Client ID and Client Secret, Save

---

## 3. Payment Gateway (SSLCommerz)

For accepting bKash, Nagad, and card payments in Bangladesh.

| # | Item | Status | Notes |
|---|------|--------|-------|
| 3.1 | SSLCommerz merchant account created | ⬜ Pending | [sslcommerz.com](https://sslcommerz.com) — apply as a business |
| 3.2 | Sandbox credentials received | ⬜ Pending | For testing — SSLCommerz provides test Store ID & Password |
| 3.3 | `SSLCOMMERZ_STORE_ID` | ⬜ Pending | From SSLCommerz dashboard |
| 3.4 | `SSLCOMMERZ_STORE_PASSWORD` | ⬜ Pending | From SSLCommerz dashboard |
| 3.5 | Live credentials received | ⬜ Pending | After merchant verification — needed for production |
| 3.6 | IPN (webhook) URL registered | ⬜ Pending | Will be: `https://<domain>/api/payment/webhook` |
| 3.7 | Bank account for settlement | ⬜ Pending | SSLCommerz will settle funds to this account |

**Documents SSLCommerz typically requires from the business:**
- Trade license / business registration
- TIN certificate
- Bank account details (for settlement)
- NID of authorized signatory
- Company letterhead (for agreement signing)

**Alternative:** If SSLCommerz is difficult to get, **ShurjoPay** ([shurjopay.com.bd](https://shurjopay.com.bd)) is a viable alternative with similar coverage.

---

## 4. Domain & Hosting

| # | Item | Status | Notes |
|---|------|--------|-------|
| 4.1 | Domain name purchased | ⬜ Pending | Suggested: `dhara.com.bd` or `dhara.travel` or `staydhara.com` |
| 4.2 | DNS access available | ⬜ Pending | Need to point domain to hosting |
| 4.3 | Hosting platform decided | ⬜ Pending | Recommended: **Vercel** (free tier works, Pro for custom domain + analytics) |
| 4.4 | SSL certificate | ⬜ Auto | Vercel and most hosts provide this automatically |
| 4.5 | Custom email domain | ⬜ Pending | e.g. `support@dhara.com.bd` — for transactional emails |

---

## 5. SMS / Notification Service

For sending booking confirmations, reminders, and check-in info via SMS (critical for Bangladesh where users rely on SMS more than email).

| # | Item | Status | Notes |
|---|------|--------|-------|
| 5.1 | SMS provider chosen | ⬜ Pending | Options: **BulkSMS BD**, **Infobip**, **SSL Wireless**, or **Twilio** |
| 5.2 | SMS API credentials obtained | ⬜ Pending | API key / sender ID from chosen provider |
| 5.3 | Sender ID / mask registered | ⬜ Pending | e.g. "DHARA" — requires BTRC approval in Bangladesh |
| 5.4 | SMS templates drafted | ⬜ Pending | Booking confirmation, reminder, check-in code, cancellation |
| 5.5 | Email service chosen | ⬜ Pending | Options: **Resend**, **SendGrid**, **AWS SES** |
| 5.6 | Email API credentials obtained | ⬜ Pending | |
| 5.7 | Transactional email templates | ⬜ Pending | Booking confirmation, receipt, impact summary, payout report |

---

## 6. Branding & Assets

| # | Item | Status | Notes |
|---|------|--------|-------|
| 6.1 | Logo (SVG + PNG) | ⬜ Pending | For header, favicon, emails, receipts |
| 6.2 | Favicon (ICO / PNG) | ⬜ Pending | 32x32 and 180x180 (Apple touch icon) |
| 6.3 | Brand colors confirmed | ⬜ Pending | Primary, secondary, accent — currently using defaults |
| 6.4 | App name finalized | ⬜ Pending | "Dhara" confirmed? Any tagline? |
| 6.5 | Social media preview image | ⬜ Pending | Open Graph image for link sharing (1200x630) |
| 6.6 | App description (short) | ⬜ Pending | For meta tags, app stores, SEO |

---

## 7. Legal & Compliance Documents

The client needs to provide or approve these. They will be displayed on the platform.

| # | Document | Status | Notes |
|---|----------|--------|-------|
| 7.1 | **Terms of Service** (for guests) | ⬜ Pending | Covers booking, cancellation, liability |
| 7.2 | **Terms of Service** (for operators/NGOs) | ⬜ Pending | Covers listing, payouts, responsibilities |
| 7.3 | **Privacy Policy** | ⬜ Pending | GDPR-style; covers data collection, storage, sharing |
| 7.4 | **Cancellation & Refund Policy** | ⬜ Pending | Tiered policy (48h / 24h / <24h) — confirm tiers & percentages |
| 7.5 | **Cookie Policy** | ⬜ Pending | If using analytics or tracking |
| 7.6 | **Operator Agreement** | ⬜ Pending | The contract NGOs agree to when listing facilities |
| 7.7 | **Platform Fee Disclosure** | ⬜ Pending | Currently 8% — needs to be approved and disclosed |
| 7.8 | **Tax Compliance** | ⬜ Pending | VAT registration? Currently assuming 5% — confirm with accountant |
| 7.9 | **Dispute Resolution Policy** | ⬜ Pending | How guest-operator disputes are handled |

> **Recommendation:** Hire a local lawyer familiar with Bangladesh e-commerce / marketplace regulations to draft items 7.1–7.9. These are critical for legal protection.

---

## 8. Business Configuration

Decisions that affect how the platform works. Client needs to confirm these.

| # | Decision | Current Default | Status |
|---|----------|----------------|--------|
| 8.1 | Platform fee rate | 8% | ⬜ Confirm |
| 8.2 | VAT / tax rate | 5% | ⬜ Confirm with accountant |
| 8.3 | Cancellation tiers | 48h → full, 24-48h → 50%, <24h → 0% | ⬜ Confirm |
| 8.4 | Payout frequency | Monthly (1st of each month) | ⬜ Confirm |
| 8.5 | Payout method | Bank transfer / bKash / Nagad | ⬜ Confirm |
| 8.6 | Minimum payout threshold | Not set | ⬜ Decide (e.g. ৳500 minimum) |
| 8.7 | Booking approval mode | Manual (operator approves) | ⬜ Confirm — or instant booking? |
| 8.8 | Cash booking allowed? | Yes | ⬜ Confirm |
| 8.9 | Review moderation threshold | Ratings < 4 require admin review | ⬜ Confirm |
| 8.10 | Maximum advance booking window | Not set | ⬜ Decide (e.g. 90 days ahead?) |
| 8.11 | Maximum stay duration | Not set | ⬜ Decide (e.g. 30 nights max?) |
| 8.12 | Support contact email | Not set | ⬜ Provide |
| 8.13 | Support phone number | Not set | ⬜ Provide |
| 8.14 | Admin user email(s) | Not set | ⬜ Provide — for Dhara team members who verify orgs & moderate reviews |

---

## 9. Operator (NGO) Verification Requirements

These are the documents Dhara will require from every NGO/operator before approving their account. Client needs to confirm this list.

| # | Required Document | Purpose | Status |
|---|-------------------|---------|--------|
| 9.1 | NGO Registration Certificate | Prove the org is legally registered (NGOAB / DSS / Joint Stock) | ⬜ Confirm |
| 9.2 | TIN Certificate | Tax compliance (NBR-issued) | ⬜ Confirm |
| 9.3 | Organization Constitution / Bylaws | Verify governance structure | ⬜ Confirm |
| 9.4 | Authorized Signatory NID | Verify the person managing the account | ⬜ Confirm |
| 9.5 | Facility Ownership / Lease Document | Prove they have the right to list the facility | ⬜ Confirm |
| 9.6 | Bank account details | For monthly payouts | ⬜ Confirm |
| 9.7 | Facility photos (minimum count?) | Ensure listing quality | ⬜ Decide (e.g. minimum 3 photos?) |

**Questions for client:**
- Should any of these be optional?
- Are there additional documents specific to certain org types?
- What's the expected review turnaround time? (e.g. "within 3 business days")
- Who on the Dhara team will review documents?

---

## 10. Test Data & Seed Content

For staging/demo environment before launch.

| # | Item | Status | Notes |
|---|------|--------|-------|
| 10.1 | 2-3 real NGO partners identified for beta | ⬜ Pending | Need real orgs willing to test |
| 10.2 | Real facility photos from beta partners | ⬜ Pending | Replace Unsplash stock photos |
| 10.3 | Real room descriptions and pricing | ⬜ Pending | From beta partner facilities |
| 10.4 | Real impact stories | ⬜ Pending | What each NGO's mission is |
| 10.5 | Test bKash/Nagad numbers | ⬜ Pending | SSLCommerz provides sandbox test numbers |
| 10.6 | Sample booking scenarios documented | ⬜ Pending | For QA testing |

---

## 11. Go-Live Checklist

Final checks before making the platform public.

| # | Item | Status |
|---|------|--------|
| 11.1 | All `.env` variables set for production | ⬜ |
| 11.2 | Supabase upgraded to Pro plan (if needed) | ⬜ |
| 11.3 | Google OAuth consent screen published (not "Testing") | ⬜ |
| 11.4 | SSLCommerz live credentials active | ⬜ |
| 11.5 | Domain configured and SSL working | ⬜ |
| 11.6 | SMS sender ID approved by BTRC | ⬜ |
| 11.7 | Legal pages (Terms, Privacy, Refund) published | ⬜ |
| 11.8 | At least 1 verified operator with live facility | ⬜ |
| 11.9 | Admin accounts created for Dhara team | ⬜ |
| 11.10 | Backup strategy confirmed (Supabase Pro auto-backups) | ⬜ |
| 11.11 | Error monitoring set up (e.g. Sentry) | ⬜ |
| 11.12 | Analytics set up (e.g. Vercel Analytics, PostHog) | ⬜ |
| 11.13 | End-to-end booking flow tested with real payment | ⬜ |
| 11.14 | Mobile responsiveness verified | ⬜ |
| 11.15 | Load tested for expected concurrent users | ⬜ |

---

## Priority Order

If the client is busy, here's what to tackle first:

### Must-have before development continues
1. **`SUPABASE_SERVICE_ROLE_KEY`** (Section 1.4) — I need this to wire up the backend
2. **Google OAuth credentials** (Section 2) — needed for real login to work
3. **Platform fee & tax rate confirmed** (Section 8.1, 8.2) — affects pricing logic

### Must-have before beta testing
4. **SSLCommerz sandbox credentials** (Section 3) — needed to test payments
5. **Cancellation policy confirmed** (Section 8.3) — affects refund logic
6. **2-3 beta NGO partners** (Section 10.1) — need real facilities to test

### Must-have before public launch
7. **All legal documents** (Section 7) — non-negotiable for a marketplace
8. **Domain & hosting** (Section 4) — for the public URL
9. **SMS provider** (Section 5) — for booking confirmations
10. **SSLCommerz live credentials** (Section 3.5) — for real payments

---

*Share this document with your client. Items marked ⬜ need their input.*
