import { NextResponse } from 'next/server'
// import { createClient } from '@/lib/supabase/server'
// import { cookies } from 'next/headers'

export async function GET(request: Request) {
  const { origin } = new URL(request.url)
  // const code = searchParams.get('code')
  // const cookieStore = await cookies()

  // MOCK CALLBACK HANDLER for UI phase
  // In reality, this exchanges code for session and checks profile existence
  
  // Just redirecting to complete-profile for demonstration
  return NextResponse.redirect(`${origin}/auth/complete-profile`)
}
