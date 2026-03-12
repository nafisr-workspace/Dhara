"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { Phone, ArrowRight, Loader2, ShieldCheck, Backpack, Building } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { PublicHeader } from "@/components/layout/public-header"
import { PublicFooter } from "@/components/layout/public-footer"
import { OtpInput } from "@/components/shared/otp-input"
import {
  loginAs,
  sendMockOtp,
  verifyMockOtp,
  loginWithPhone,
  findUserByPhone,
  getRedirectForRole,
} from "@/lib/mock-auth"

function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
      <path d="M1 1h22v22H1z" fill="none" />
    </svg>
  )
}

type Step = "main" | "phone" | "otp"

function LoginContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirect = searchParams.get("redirect")

  const [step, setStep] = React.useState<Step>("main")
  const [phone, setPhone] = React.useState("")
  const [otp, setOtp] = React.useState("")
  const [otpHint, setOtpHint] = React.useState("")
  const [error, setError] = React.useState("")
  const [loading, setLoading] = React.useState(false)

  function handleGoogleLogin() {
    // Mock: Google login currently bypasses to role selection
    // In production, this would call supabase.auth.signInWithOAuth({ provider: 'google' })
  }

  function handleMockLogin(role: "guest" | "operator") {
    loginAs(role)
    const target = redirect || getRedirectForRole(role)
    router.push(target)
  }

  function handleSendOtp(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    const cleaned = phone.trim()
    if (cleaned.length < 10) {
      setError("Please enter a valid phone number")
      return
    }
    setLoading(true)
    setTimeout(() => {
      const result = sendMockOtp(cleaned)
      if (result.success) {
        setOtpHint(result.hint)
        setStep("otp")
      }
      setLoading(false)
    }, 600)
  }

  function handleVerifyOtp(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    if (otp.length !== 6) {
      setError("Please enter the 6-digit code")
      return
    }
    setLoading(true)
    setTimeout(() => {
      const valid = verifyMockOtp(phone, otp)
      if (!valid) {
        setError("Invalid OTP code. Try 123456")
        setLoading(false)
        return
      }
      const session = loginWithPhone(phone)
      if (session) {
        const target = redirect || getRedirectForRole(session.role)
        router.push(target)
      } else {
        router.push(`/signup?phone=${encodeURIComponent(phone.trim())}${redirect ? `&redirect=${redirect}` : ""}`)
      }
    }, 600)
  }

  const existingUser = phone.trim().length >= 10 ? findUserByPhone(phone.trim()) : null

  return (
    <main className="flex-1 flex items-center justify-center bg-muted/10 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <Link href="/" className="font-heading text-3xl font-bold text-primary mb-4 block">
            Dhara
          </Link>
          <CardTitle className="text-2xl">
            {step === "main" && "Welcome Back"}
            {step === "phone" && "Sign in with Mobile"}
            {step === "otp" && "Enter Verification Code"}
          </CardTitle>
          <CardDescription>
            {step === "main" && "Sign in to manage your bookings or your facility"}
            {step === "phone" && "We'll send you a one-time verification code"}
            {step === "otp" && (
              <>We sent a 6-digit code to <span className="font-medium text-foreground">{phone}</span></>
            )}
          </CardDescription>
        </CardHeader>

        <CardContent>
          {/* ── Step: Main (Google + Phone options) ── */}
          {step === "main" && (
            <div className="space-y-4">
              {/* Google Sign-In */}
              <Button
                variant="outline"
                className="w-full h-12 text-base"
                onClick={handleGoogleLogin}
                disabled
              >
                <GoogleIcon className="mr-2 h-5 w-5" />
                Continue with Google
              </Button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center"><Separator /></div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-2 text-muted-foreground">or</span>
                </div>
              </div>

              {/* Phone OTP Sign-In */}
              <Button
                variant="outline"
                className="w-full h-12 text-base"
                onClick={() => setStep("phone")}
              >
                <Phone className="mr-2 h-5 w-5" />
                Continue with Mobile Number
              </Button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center"><Separator /></div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-2 text-muted-foreground">Dev bypass</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Button
                  variant="outline"
                  className="h-20 flex-col gap-2"
                  onClick={() => handleMockLogin("guest")}
                >
                  <Backpack className="h-6 w-6 text-primary" />
                  <span className="text-xs font-medium">Login as Guest</span>
                </Button>
                <Button
                  variant="outline"
                  className="h-20 flex-col gap-2"
                  onClick={() => handleMockLogin("operator")}
                >
                  <Building className="h-6 w-6 text-primary" />
                  <span className="text-xs font-medium">Login as Operator</span>
                </Button>
              </div>
            </div>
          )}

          {/* ── Step: Phone number input ── */}
          {step === "phone" && (
            <form onSubmit={handleSendOtp} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="phone">Mobile Number</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+880 1712 345678"
                    value={phone}
                    onChange={(e) => { setPhone(e.target.value); setError("") }}
                    className="pl-10"
                    autoFocus
                  />
                </div>
                {existingUser && (
                  <p className="text-xs text-muted-foreground">
                    Welcome back, <span className="font-medium text-foreground">{existingUser.user.fullName}</span>
                  </p>
                )}
              </div>

              {error && <p className="text-sm text-destructive">{error}</p>}

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? (
                  <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Sending...</>
                ) : (
                  <>Send OTP <ArrowRight className="ml-2 h-4 w-4" /></>
                )}
              </Button>

              <div className="rounded-lg bg-muted/50 p-3 text-center">
                <p className="text-xs text-muted-foreground">
                  <ShieldCheck className="inline h-3.5 w-3.5 mr-1 -mt-0.5" />
                  We&apos;ll send a one-time verification code to this number
                </p>
              </div>

              <button
                type="button"
                className="w-full text-center text-sm text-muted-foreground hover:text-foreground transition-colors"
                onClick={() => { setStep("main"); setError("") }}
              >
                ← Back to all sign-in options
              </button>
            </form>
          )}

          {/* ── Step: OTP input ── */}
          {step === "otp" && (
            <form onSubmit={handleVerifyOtp} className="space-y-5">
              <OtpInput
                value={otp}
                onChange={(v) => { setOtp(v); setError("") }}
                disabled={loading}
              />

              {error && <p className="text-sm text-destructive text-center">{error}</p>}

              <div className="rounded-lg border border-dashed border-primary/30 bg-primary/5 p-3 text-center">
                <p className="text-xs text-primary font-medium">
                  Mock OTP: <span className="font-mono text-sm tracking-widest">{otpHint}</span>
                </p>
              </div>

              <Button type="submit" className="w-full" disabled={loading || otp.length !== 6}>
                {loading ? (
                  <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Verifying...</>
                ) : (
                  "Verify & Sign In"
                )}
              </Button>

              <div className="flex items-center justify-between text-sm">
                <button
                  type="button"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                  onClick={() => { setStep("phone"); setOtp(""); setError("") }}
                >
                  Change number
                </button>
                <button
                  type="button"
                  className="text-primary hover:text-primary/80 font-medium transition-colors"
                  onClick={() => { setOtp(""); setOtpHint(sendMockOtp(phone).hint) }}
                >
                  Resend code
                </button>
              </div>
            </form>
          )}
        </CardContent>

        <CardFooter className="flex justify-center">
          <p className="text-sm text-muted-foreground">
            Don&apos;t have an account?{" "}
            <Link href={`/signup${redirect ? `?redirect=${redirect}` : ""}`} className="text-primary hover:underline font-medium">
              Sign up
            </Link>
          </p>
        </CardFooter>
      </Card>
    </main>
  )
}

export default function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <PublicHeader />
      <React.Suspense fallback={<main className="flex-1 flex items-center justify-center">Loading...</main>}>
        <LoginContent />
      </React.Suspense>
      <PublicFooter />
    </div>
  )
}
