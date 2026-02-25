---
name: dhara-auth
description: >
  Implement authentication and authorization for the Dhara platform. Use this skill when
  building login, signup, password reset, or any auth-related pages; when setting up
  Next.js middleware for role-based route protection; when handling post-login redirects
  based on user role (guest vs operator); when implementing the operator approval gate;
  or when managing Supabase Auth session handling in Next.js App Router. Always use this
  skill for any auth or access control work in Dhara.
---

# Dhara Auth Skill

## Auth Stack

- **Provider**: Supabase Auth with **Google OAuth** (no email/password)
- **Session management**: `@supabase/ssr` package — handles cookies in Next.js App Router
- **Route protection**: Next.js `middleware.ts`
- **Role storage**: `profiles.role` column (`'guest'` | `'operator'`)

## Google OAuth Setup

1. In Google Cloud Console: create OAuth 2.0 credentials, add authorized redirect URI:
   `https://<your-supabase-project>.supabase.co/auth/v1/callback`
2. In Supabase dashboard → Authentication → Providers → Google: enable and paste Client ID + Secret.
3. No additional env vars needed in Next.js — Supabase handles the OAuth dance.

## User Roles

| Role | Description | Post-login redirect |
|------|-------------|-------------------|
| `guest` | Traveler booking stays | `/dashboard` |
| `operator` | NGO/org managing facilities | `/operator/dashboard` |

A user is one or the other — no dual roles. Role is set at signup.

## Auth Pages

```
src/app/
├── login/page.tsx               ← Google sign-in button
├── signup/page.tsx              ← Role selection → Google sign-in
├── signup/operator/page.tsx     ← Operator org details form (post-Google-auth)
├── auth/callback/route.ts       ← Supabase OAuth callback handler
└── auth/complete-profile/       ← Post-signup profile completion
    page.tsx
```

### Login Page (`/login`)

Single button UI — no email/password forms:
```tsx
// Clean centered card with Dhara logo
// "Sign in with Google" button (Shadcn Button + Google icon)
// Small text: "New here? Sign up as a traveler or list your facility"

async function signInWithGoogle() {
  const supabase = createClient()
  await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback`,
    },
  })
}
```

### Signup Flow

Because Google OAuth doesn't tell us the user's intended role, signup is a two-step process:

**Step 1 — Role selection page (`/signup`)**
- Two large cards: "I'm a Traveler" / "I want to list my facility"
- Each triggers Google OAuth with a `role` hint stored in a cookie before redirect:
  ```ts
  // Set role cookie before OAuth redirect so callback knows what to create
  cookies().set('signup_role', 'guest' | 'operator', { maxAge: 600 })
  await supabase.auth.signInWithOAuth({ provider: 'google', ... })
  ```

**Step 2 — Auth callback (`/auth/callback/route.ts`)**
- Exchanges code for session
- Checks if `profiles` row exists for this user
- If not (new user): reads `signup_role` cookie → creates `profiles` record
  - If `operator`: also creates `organizations` record with `status: 'pending'`
  - Redirects to `/auth/complete-profile` to collect extra info (phone, org name)
- If yes (returning user): reads role → redirects to correct dashboard

```ts
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const cookieStore = cookies()

  if (code) {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.exchangeCodeForSession(code)

    if (user) {
      // Check if profile exists
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()

      if (!profile) {
        // New user — create profile from cookie hint
        const role = cookieStore.get('signup_role')?.value ?? 'guest'
        await supabase.from('profiles').insert({
          id: user.id,
          full_name: user.user_metadata.full_name,
          role,
        })
        if (role === 'operator') {
          // Create pending org shell — user fills details on next page
          await supabase.from('organizations').insert({ owner_id: user.id, name: '', status: 'pending' })
        }
        cookieStore.delete('signup_role')
        return NextResponse.redirect(`${origin}/auth/complete-profile`)
      }

      // Returning user
      return NextResponse.redirect(
        `${origin}${profile.role === 'operator' ? '/operator/dashboard' : '/dashboard'}`
      )
    }
  }

  return NextResponse.redirect(`${origin}/login`)
}
```

**Step 3 — Complete profile (`/auth/complete-profile`)**

For guests:
- Phone number (optional but encouraged)
- That's it → redirect to `/dashboard`

For operators:
- Organization name (required)
- Organization type
- Brief description
- Phone
→ Updates `organizations` record → redirect to `/operator/pending`

### Pending Approval Page (`/operator/pending`)

Shown to operators whose org `status = 'pending'`:
- "Your application is under review" message
- What happens next explanation
- Contact email for questions
- Logout button

## Middleware (`src/middleware.ts`)

```ts
import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({ request })
  
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { /* cookie helpers */ } }
  )

  const { data: { user } } = await supabase.auth.getUser()
  const path = request.nextUrl.pathname

  // Protected guest routes
  if (path.startsWith('/dashboard') || path.startsWith('/bookings') || path.startsWith('/book')) {
    if (!user) return NextResponse.redirect(new URL(`/login?redirect=${path}`, request.url))
  }

  // Protected operator routes
  if (path.startsWith('/operator')) {
    if (!user) return NextResponse.redirect(new URL('/login?redirect=' + path, request.url))
    
    // Check operator role + org status
    const { data: profile } = await supabase.from('profiles').select('role').single()
    if (profile?.role !== 'operator') return NextResponse.redirect(new URL('/dashboard', request.url))
    
    // Allow /operator/pending without approval check
    if (!path.startsWith('/operator/pending')) {
      const { data: org } = await supabase
        .from('organizations')
        .select('status')
        .single()
      if (org?.status !== 'approved') return NextResponse.redirect(new URL('/operator/pending', request.url))
    }
  }

  // Redirect logged-in users away from auth pages
  if ((path === '/login' || path === '/signup') && user) {
    const { data: profile } = await supabase.from('profiles').select('role').single()
    return NextResponse.redirect(new URL(
      profile?.role === 'operator' ? '/operator/dashboard' : '/dashboard',
      request.url
    ))
  }

  return response
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|api/|auth/).*)'],
}
```

## Auth Context / Hook

For Client Components that need the current user:

```ts
// src/lib/hooks/useUser.ts
'use client'
import { createClient } from '@/lib/supabase/client'
import { useEffect, useState } from 'react'

export function useUser() {
  const [user, setUser] = useState(null)
  const supabase = createClient()
  
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user))
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user ?? null)
    })
    return () => subscription.unsubscribe()
  }, [])
  
  return user
}
```

## Logout

```ts
// Server Action
'use server'
async function logoutAction() {
  const supabase = createClient()
  await supabase.auth.signOut()
  redirect('/login')
}
```

## Do's ✅

- Always use `@supabase/ssr` — never `@supabase/supabase-js` directly in App Router.
- Always store the intended role in a short-lived cookie before the Google OAuth redirect.
- Always check if a `profiles` row exists in the callback — determines new vs returning user.
- Always gate `/operator/*` routes with both role check AND org approval check in middleware.
- On the login page, also handle the `?redirect=` param — pass it through to the callback so users land where they intended after Google auth.

## Don'ts ❌

- Never store JWT tokens manually — `@supabase/ssr` handles this via cookies.
- Never expose the service role key — only anon key in client, service key in server actions.
- Never skip the org `status: approved` check for operator routes.
- Never redirect to external URLs from the `?redirect=` param — validate it starts with `/`.
- Never assume `user.user_metadata.full_name` is always set from Google — handle empty gracefully.
