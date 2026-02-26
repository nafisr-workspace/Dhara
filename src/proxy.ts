import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function proxy(request: NextRequest) {
  // For the UI phase without real Supabase env vars, we bypass auth checks.
  // When connecting the real backend, uncomment the Supabase logic below.

  /*
  let response = NextResponse.next({ request })
  
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
          response = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          )
        },
      },
    }
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
    const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
    if (profile?.role !== 'operator') return NextResponse.redirect(new URL('/dashboard', request.url))
    
    // Allow /operator/pending without approval check
    if (!path.startsWith('/operator/pending')) {
      const { data: org } = await supabase
        .from('organizations')
        .select('status')
        .eq('owner_id', user.id)
        .single()
      if (org?.status !== 'approved') return NextResponse.redirect(new URL('/operator/pending', request.url))
    }
  }

  // Redirect logged-in users away from auth pages
  if ((path === '/login' || path === '/signup') && user) {
    const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
    return NextResponse.redirect(new URL(
      profile?.role === 'operator' ? '/operator/dashboard' : '/dashboard',
      request.url
    ))
  }

  return response
  */

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|api/|auth/).*)'],
}
