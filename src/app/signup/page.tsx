"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import {
  Backpack, Building, ArrowLeft, Smartphone, Landmark, Upload, FileText,
  CheckCircle2, AlertCircle, Phone, ArrowRight, Loader2, ShieldCheck, Mail,
} from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  Form, FormControl, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form"
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"
import { PublicHeader } from "@/components/layout/public-header"
import { PublicFooter } from "@/components/layout/public-footer"
import { OtpInput } from "@/components/shared/otp-input"
import {
  signupAsGuest,
  signupAsOperator,
  getRedirectForRole,
  sendMockOtp,
  verifyMockOtp,
} from "@/lib/mock-auth"
import type { MfsAccountType } from "@/lib/mock-data"

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

// ── Schemas ─────────────────────────────────────────────────────────────────

const guestSchema = z.object({
  fullName: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email"),
  accountType: z.enum(["bkash", "nagad", "bank"], { message: "Please select an account type" }),
  accountNumber: z.string().min(5, "Please enter a valid account number"),
})

const operatorSchema = z.object({
  fullName: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email"),
  orgName: z.string().min(2, "Organization name is required"),
  orgType: z.string().min(1, "Please select an organization type"),
  orgDescription: z.string().optional(),
  acceptTerms: z.literal(true, { message: "You must accept the Terms & Conditions" }),
  acceptPrivacy: z.literal(true, { message: "You must accept the Privacy Policy" }),
  acceptVerification: z.literal(true, { message: "You must acknowledge the verification requirement" }),
})

type GuestFormValues = z.infer<typeof guestSchema>
type OperatorFormValues = z.infer<typeof operatorSchema>

// ── Helpers ─────────────────────────────────────────────────────────────────

function AccountTypeIcon({ type }: { type: MfsAccountType }) {
  if (type === "bank") return <Landmark className="h-4 w-4" />
  return <Smartphone className="h-4 w-4" />
}

function accountTypeLabel(type: MfsAccountType): string {
  const labels: Record<MfsAccountType, string> = { bkash: "bKash", nagad: "Nagad", bank: "Bank Account" }
  return labels[type]
}

// ── Phone + OTP step ────────────────────────────────────────────────────────

function PhoneOtpStep({
  initialPhone,
  onVerified,
}: {
  initialPhone: string
  onVerified: (phone: string) => void
}) {
  const [step, setStep] = React.useState<"phone" | "otp">(initialPhone ? "otp" : "phone")
  const [phone, setPhone] = React.useState(initialPhone)
  const [otp, setOtp] = React.useState("")
  const [otpHint, setOtpHint] = React.useState(initialPhone ? sendMockOtp(initialPhone).hint : "")
  const [error, setError] = React.useState("")
  const [loading, setLoading] = React.useState(false)

  function handleSendOtp(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    const cleaned = phone.trim()
    if (cleaned.length < 10) { setError("Please enter a valid phone number"); return }

    setLoading(true)
    setTimeout(() => {
      const result = sendMockOtp(cleaned)
      setOtpHint(result.hint)
      setStep("otp")
      setLoading(false)
    }, 600)
  }

  function handleVerifyOtp(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    if (otp.length !== 6) { setError("Please enter the 6-digit code"); return }

    setLoading(true)
    setTimeout(() => {
      if (!verifyMockOtp(phone, otp)) {
        setError("Invalid OTP code. Try 123456")
        setLoading(false)
        return
      }
      onVerified(phone.trim())
    }, 600)
  }

  if (step === "phone") {
    return (
      <form onSubmit={handleSendOtp} className="space-y-4">
        <div className="text-center mb-2">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <Phone className="h-6 w-6 text-primary" />
          </div>
          <h3 className="font-semibold text-lg">Verify your mobile number</h3>
          <p className="text-sm text-muted-foreground mt-1">
            We&apos;ll send a one-time code to verify your number
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="signup-phone">Mobile Number</Label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="signup-phone"
              type="tel"
              placeholder="+880 1712 345678"
              value={phone}
              onChange={(e) => { setPhone(e.target.value); setError("") }}
              className="pl-10"
              autoFocus
            />
          </div>
        </div>

        {error && <p className="text-sm text-destructive">{error}</p>}

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? (
            <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Sending...</>
          ) : (
            <>Send OTP <ArrowRight className="ml-2 h-4 w-4" /></>
          )}
        </Button>
      </form>
    )
  }

  return (
    <form onSubmit={handleVerifyOtp} className="space-y-5">
      <div className="text-center mb-2">
        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
          <ShieldCheck className="h-6 w-6 text-primary" />
        </div>
        <h3 className="font-semibold text-lg">Enter Verification Code</h3>
        <p className="text-sm text-muted-foreground mt-1">
          Sent to <span className="font-medium text-foreground">{phone}</span>
        </p>
      </div>

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
          "Verify & Continue"
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
  )
}

// ── Guest Signup Form ───────────────────────────────────────────────────────

function GuestSignupForm({ phone, redirect, prefilledEmail }: { phone: string; redirect: string | null; prefilledEmail?: string }) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  const form = useForm<GuestFormValues>({
    resolver: zodResolver(guestSchema),
    defaultValues: {
      fullName: "",
      email: prefilledEmail || "",
      accountType: "bkash",
      accountNumber: "",
    },
  })

  function onSubmit(values: GuestFormValues) {
    setIsSubmitting(true)
    const maskedNum = "****" + values.accountNumber.slice(-4)
    signupAsGuest({
      fullName: values.fullName,
      email: values.email,
      phone,
      linkedAccount: {
        type: values.accountType,
        accountNumber: values.accountNumber,
        accountNumberMasked: maskedNum,
      },
    })
    setTimeout(() => {
      router.push(redirect || getRedirectForRole("guest"))
    }, 500)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        <div className="space-y-2">
          {phone && (
            <div className="rounded-lg bg-muted/50 px-3 py-2.5 flex items-center gap-2">
              <Phone className="h-4 w-4 text-muted-foreground shrink-0" />
              <span className="text-sm font-medium">{phone}</span>
              <CheckCircle2 className="h-4 w-4 text-success-foreground ml-auto shrink-0" />
              <span className="text-xs text-success-foreground">Verified</span>
            </div>
          )}
          {prefilledEmail && (
            <div className="rounded-lg bg-muted/50 px-3 py-2.5 flex items-center gap-2">
              <Mail className="h-4 w-4 text-muted-foreground shrink-0" />
              <span className="text-sm font-medium">{prefilledEmail}</span>
              <CheckCircle2 className="h-4 w-4 text-success-foreground ml-auto shrink-0" />
              <span className="text-xs text-success-foreground">Verified</span>
            </div>
          )}
        </div>

        <FormField
          control={form.control}
          name="fullName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g. Nadia Rahman" {...field} autoFocus />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="you@example.com" {...field} disabled={!!prefilledEmail} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="space-y-4 rounded-lg border p-4 bg-muted/30">
          <div>
            <h4 className="text-sm font-semibold">Link Payment Account</h4>
            <p className="text-xs text-muted-foreground mt-0.5">
              Required for receiving refunds and making payments
            </p>
          </div>

          <FormField
            control={form.control}
            name="accountType"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <RadioGroup
                    value={field.value}
                    onValueChange={field.onChange}
                    className="flex gap-3"
                  >
                    {(["bkash", "nagad", "bank"] as const).map((t) => (
                      <Label
                        key={t}
                        htmlFor={`acct-${t}`}
                        className={`flex cursor-pointer items-center gap-2 rounded-lg border px-4 py-2.5 transition-colors ${
                          field.value === t ? "border-primary bg-primary/5" : "hover:bg-muted/50"
                        }`}
                      >
                        <RadioGroupItem value={t} id={`acct-${t}`} />
                        <AccountTypeIcon type={t} />
                        <span className="text-sm font-medium">{accountTypeLabel(t)}</span>
                      </Label>
                    ))}
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="accountNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  {form.watch("accountType") === "bank"
                    ? "Bank Account Number"
                    : `${accountTypeLabel(form.watch("accountType"))} Number`}
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder={form.watch("accountType") === "bank" ? "e.g. 1234567890" : "e.g. 01712345678"}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "Creating account..." : "Create Guest Account"}
        </Button>
      </form>
    </Form>
  )
}

// ── Operator Signup Form ────────────────────────────────────────────────────

const REQUIRED_DOCS = [
  "NGO Registration Certificate",
  "TIN Certificate",
  "Organization Constitution / Bylaws",
  "Authorized Signatory NID",
  "Facility Ownership / Lease Document",
]

function MockDocUpload({ label, uploaded, onUpload }: { label: string; uploaded: boolean; onUpload: () => void }) {
  return (
    <div className={`flex items-center gap-3 rounded-lg border p-3 transition-colors ${uploaded ? "border-success/30 bg-success/5" : "border-dashed"}`}>
      <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${uploaded ? "bg-success/15 text-success-foreground" : "bg-muted text-muted-foreground"}`}>
        {uploaded ? <CheckCircle2 className="h-4 w-4" /> : <FileText className="h-4 w-4" />}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium truncate">{label}</p>
        {uploaded
          ? <p className="text-xs text-success-foreground">Uploaded</p>
          : <p className="text-xs text-muted-foreground">PDF, JPG, or PNG (max 5MB)</p>
        }
      </div>
      <button
        type="button"
        onClick={onUpload}
        className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
          uploaded ? "bg-muted text-muted-foreground hover:bg-muted/80" : "bg-primary/10 text-primary hover:bg-primary/20"
        }`}
      >
        <Upload className="h-3 w-3" />
        {uploaded ? "Replace" : "Upload"}
      </button>
    </div>
  )
}

function OperatorSignupForm({ phone, redirect, prefilledEmail }: { phone: string; redirect: string | null; prefilledEmail?: string }) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [uploadedDocs, setUploadedDocs] = React.useState<Record<string, boolean>>({})

  const form = useForm<OperatorFormValues>({
    resolver: zodResolver(operatorSchema),
    defaultValues: {
      fullName: "",
      email: prefilledEmail || "",
      orgName: "",
      orgType: "",
      orgDescription: "",
      acceptTerms: undefined as unknown as true,
      acceptPrivacy: undefined as unknown as true,
      acceptVerification: undefined as unknown as true,
    },
  })

  function onSubmit(values: OperatorFormValues) {
    setIsSubmitting(true)
    signupAsOperator({
      fullName: values.fullName,
      email: values.email,
      phone,
      orgName: values.orgName,
      orgType: values.orgType,
      orgDescription: values.orgDescription ?? "",
    })
    setTimeout(() => {
      router.push(redirect || "/operator/pending")
    }, 500)
  }

  const uploadedCount = Object.values(uploadedDocs).filter(Boolean).length

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        <div className="space-y-2">
          {phone && (
            <div className="rounded-lg bg-muted/50 px-3 py-2.5 flex items-center gap-2">
              <Phone className="h-4 w-4 text-muted-foreground shrink-0" />
              <span className="text-sm font-medium">{phone}</span>
              <CheckCircle2 className="h-4 w-4 text-success-foreground ml-auto shrink-0" />
              <span className="text-xs text-success-foreground">Verified</span>
            </div>
          )}
          {prefilledEmail && (
            <div className="rounded-lg bg-muted/50 px-3 py-2.5 flex items-center gap-2">
              <Mail className="h-4 w-4 text-muted-foreground shrink-0" />
              <span className="text-sm font-medium">{prefilledEmail}</span>
              <CheckCircle2 className="h-4 w-4 text-success-foreground ml-auto shrink-0" />
              <span className="text-xs text-success-foreground">Verified</span>
            </div>
          )}
        </div>

        <FormField
          control={form.control}
          name="fullName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Name</FormLabel>
              <FormControl><Input placeholder="e.g. Kamal Hossain" {...field} autoFocus /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl><Input type="email" placeholder="you@organization.org" {...field} disabled={!!prefilledEmail} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="space-y-4 pt-4 border-t">
          <h4 className="text-sm font-semibold">Organization Details</h4>

          <FormField
            control={form.control}
            name="orgName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Organization Name</FormLabel>
                <FormControl><Input placeholder="e.g. Shanti Neer Development Society" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="orgType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Organization Type</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="ngo">Local NGO</SelectItem>
                    <SelectItem value="ingo">International NGO</SelectItem>
                    <SelectItem value="trust">Trust / Foundation</SelectItem>
                    <SelectItem value="coop">Cooperative</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="orgDescription"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Brief Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="What does your organization do? What impact will the bookings support?"
                    className="resize-none"
                    rows={3}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Verification Documents */}
        <div className="space-y-4 pt-4 border-t">
          <div>
            <h4 className="text-sm font-semibold">Verification Documents</h4>
            <p className="text-xs text-muted-foreground mt-1">
              Upload documents to verify your organization. You can also submit these later from your dashboard.
            </p>
          </div>

          <div className="space-y-2.5">
            {REQUIRED_DOCS.map((docLabel) => (
              <MockDocUpload
                key={docLabel}
                label={docLabel}
                uploaded={!!uploadedDocs[docLabel]}
                onUpload={() => setUploadedDocs((prev) => ({ ...prev, [docLabel]: true }))}
              />
            ))}
          </div>

          <div className="flex items-center gap-2 rounded-lg bg-muted/50 px-3 py-2">
            <AlertCircle className="h-4 w-4 text-muted-foreground shrink-0" />
            <p className="text-xs text-muted-foreground">
              {uploadedCount} of {REQUIRED_DOCS.length} documents uploaded.
              {uploadedCount < REQUIRED_DOCS.length
                ? " You can upload the remaining documents from your profile after signing up."
                : " All documents uploaded!"}
            </p>
          </div>
        </div>

        {/* Terms & Conditions */}
        <div className="space-y-4 pt-4 border-t">
          <h4 className="text-sm font-semibold">Terms & Agreements</h4>

          <FormField
            control={form.control}
            name="acceptTerms"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-start gap-3">
                  <FormControl>
                    <Checkbox
                      checked={field.value === true}
                      onCheckedChange={(checked) => field.onChange(checked === true ? true : undefined)}
                      className="mt-0.5"
                    />
                  </FormControl>
                  <div className="space-y-1">
                    <FormLabel className="text-sm font-normal leading-snug cursor-pointer">
                      I agree to the{" "}
                      <button type="button" className="text-primary underline underline-offset-2 hover:text-primary/80" onClick={() => alert("Terms & Conditions\n\n1. Platform Usage\nBy registering as an Operator on Dhara, you agree to list only facilities that you own or have legal authority to manage.\n\n2. Listing Accuracy\nAll listing information must be accurate and current.\n\n3. Booking Obligations\nOnce a booking is confirmed, the Operator must honor the reservation.\n\n4. Safety Standards\nFacilities must meet minimum safety standards.\n\n5. Payment Processing\nDhara charges a platform fee on each booking. Payouts are processed monthly.\n\n6. Guest Communication\nAll communication must occur through the Dhara platform.\n\n7. Termination\nDhara reserves the right to suspend accounts that violate these terms.\n\n8. Governing Law\nThese terms are governed by the laws of the People's Republic of Bangladesh.")}>
                        Terms & Conditions
                      </button>
                    </FormLabel>
                    <FormMessage />
                  </div>
                </div>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="acceptPrivacy"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-start gap-3">
                  <FormControl>
                    <Checkbox
                      checked={field.value === true}
                      onCheckedChange={(checked) => field.onChange(checked === true ? true : undefined)}
                      className="mt-0.5"
                    />
                  </FormControl>
                  <div className="space-y-1">
                    <FormLabel className="text-sm font-normal leading-snug cursor-pointer">
                      I agree to the{" "}
                      <button type="button" className="text-primary underline underline-offset-2 hover:text-primary/80" onClick={() => alert("Privacy Policy\n\n1. Data Collection\nWe collect personal information for verification and booking purposes.\n\n2. Data Usage\nYour information is used to verify your organization and process bookings.\n\n3. Data Storage\nAll data is stored securely using industry-standard encryption.\n\n4. Third-Party Sharing\nWe do not sell your data.\n\n5. Your Rights\nYou can request to view, update, or delete your data.")}>
                        Privacy Policy
                      </button>
                    </FormLabel>
                    <FormMessage />
                  </div>
                </div>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="acceptVerification"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-start gap-3">
                  <FormControl>
                    <Checkbox
                      checked={field.value === true}
                      onCheckedChange={(checked) => field.onChange(checked === true ? true : undefined)}
                      className="mt-0.5"
                    />
                  </FormControl>
                  <div className="space-y-1">
                    <FormLabel className="text-sm font-normal leading-snug cursor-pointer">
                      I understand that my organization will be{" "}
                      <span className="font-medium">manually verified</span>{" "}
                      by the Dhara team before my listing goes live.
                    </FormLabel>
                    <FormMessage />
                  </div>
                </div>
              </FormItem>
            )}
          />
        </div>

        <Separator />

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "Creating account..." : "Submit Application"}
        </Button>

        <p className="text-[11px] text-center text-muted-foreground">
          Your account will be reviewed within 1-2 business days.
        </p>
      </form>
    </Form>
  )
}

// ── Main Signup Page ────────────────────────────────────────────────────────

function SignupContent() {
  const searchParams = useSearchParams()
  const redirect = searchParams.get("redirect")
  const phoneFromLogin = searchParams.get("phone") ?? ""

  const [selectedRole, setSelectedRole] = React.useState<"guest" | "operator" | null>(null)
  const [authMethod, setAuthMethod] = React.useState<"choose" | "phone" | "google" | null>(null)
  const [verifiedPhone, setVerifiedPhone] = React.useState<string | null>(null)
  const [verifiedEmail, setVerifiedEmail] = React.useState<string | null>(null)

  // If redirected from login with a verified phone, skip OTP
  React.useEffect(() => {
    if (phoneFromLogin) {
      setVerifiedPhone(phoneFromLogin)
      setAuthMethod("phone")
    }
  }, [phoneFromLogin])

  // Step 1: Role selection
  if (!selectedRole) {
    return (
      <main className="flex-1 flex flex-col items-center justify-center bg-muted/10 p-4 md:p-8">
        <div className="max-w-4xl w-full">
          <div className="text-center mb-12">
            <h1 className="font-heading text-3xl font-bold tracking-tight md:text-4xl mb-4">
              Join Dhara
            </h1>
            <p className="text-lg text-muted-foreground">
              Choose how you want to use the platform
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card
              className="cursor-pointer hover:border-primary/50 hover:shadow-md transition-all group"
              onClick={() => setSelectedRole("guest")}
            >
              <CardHeader className="text-center pb-4">
                <div className="mx-auto bg-primary/10 w-20 h-20 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Backpack className="w-10 h-10 text-primary" />
                </div>
                <CardTitle className="text-2xl">I&apos;m a Traveler</CardTitle>
                <CardDescription className="text-base mt-2">
                  I want to book affordable, safe accommodations and support local causes.
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <span className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors group-hover:bg-primary/90">
                  Sign up as Guest
                </span>
              </CardContent>
            </Card>

            <Card
              className="cursor-pointer hover:border-primary/50 hover:shadow-md transition-all group"
              onClick={() => setSelectedRole("operator")}
            >
              <CardHeader className="text-center pb-4">
                <div className="mx-auto bg-primary/10 w-20 h-20 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Building className="w-10 h-10 text-primary" />
                </div>
                <CardTitle className="text-2xl">I want to list my facility</CardTitle>
                <CardDescription className="text-base mt-2">
                  I represent an NGO or organization with unused guesthouse capacity.
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <span className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors group-hover:bg-primary/90">
                  Sign up as Operator
                </span>
              </CardContent>
            </Card>
          </div>

          <p className="text-center mt-12 text-muted-foreground">
            Already have an account?{" "}
            <Link
              href={`/login${redirect ? `?redirect=${redirect}` : ""}`}
              className="text-primary hover:underline font-medium"
            >
              Log in
            </Link>
          </p>
        </div>
      </main>
    )
  }

  const isVerified = verifiedPhone || verifiedEmail

  // Step 2: Auth method chooser → Phone OTP or Google
  if (!isVerified) {
    return (
      <main className="flex-1 flex flex-col items-center justify-center bg-muted/10 p-4 md:p-8">
        <div className="w-full max-w-md">
          <button
            onClick={() => {
              if (authMethod === "phone") {
                setAuthMethod("choose")
              } else {
                setSelectedRole(null)
                setAuthMethod(null)
              }
            }}
            className="mb-6 flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            {authMethod === "phone" ? "Back to sign-up options" : "Back to role selection"}
          </button>

          <div className="bg-card rounded-xl border shadow-sm p-6 md:p-8">
            {authMethod === "phone" ? (
              <PhoneOtpStep
                initialPhone=""
                onVerified={(p) => setVerifiedPhone(p)}
              />
            ) : (
              <div className="space-y-5">
                <div className="text-center">
                  <h2 className="font-heading text-2xl font-bold">Verify Your Identity</h2>
                  <p className="text-sm text-muted-foreground mt-1">
                    Choose how you&apos;d like to create your{" "}
                    {selectedRole === "guest" ? "guest" : "operator"} account
                  </p>
                </div>

                <Button
                  variant="outline"
                  className="w-full h-12 text-base"
                  disabled
                >
                  <GoogleIcon className="mr-2 h-5 w-5" />
                  Continue with Google
                </Button>
                <p className="text-center text-[11px] text-muted-foreground -mt-2">
                  Google sign-up requires Supabase Auth — coming soon
                </p>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center"><Separator /></div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-card px-2 text-muted-foreground">or</span>
                  </div>
                </div>

                <Button
                  variant="outline"
                  className="w-full h-12 text-base"
                  onClick={() => setAuthMethod("phone")}
                >
                  <Phone className="mr-2 h-5 w-5" />
                  Continue with Mobile Number
                </Button>
              </div>
            )}
          </div>
        </div>
      </main>
    )
  }

  // Step 3: Profile form
  const displayPhone = verifiedPhone ?? ""
  const displayEmail = verifiedEmail ?? ""

  return (
    <main className="flex-1 flex flex-col items-center justify-center bg-muted/10 p-4 md:p-8">
      <div className="w-full max-w-lg">
        <button
          onClick={() => { setVerifiedPhone(null); setVerifiedEmail(null); setAuthMethod("choose") }}
          className="mb-6 flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>

        <div className="bg-card rounded-xl border shadow-sm p-6 md:p-8">
          <div className="mb-6 text-center">
            <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
              {selectedRole === "guest"
                ? <Backpack className="h-7 w-7 text-primary" />
                : <Building className="h-7 w-7 text-primary" />
              }
            </div>
            <h1 className="font-heading text-2xl font-bold">
              {selectedRole === "guest" ? "Create Guest Account" : "Apply as Operator"}
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              {selectedRole === "guest"
                ? "Book affordable stays and support local causes"
                : "List your facility and start earning"
              }
            </p>
          </div>

          {selectedRole === "guest"
            ? <GuestSignupForm phone={displayPhone} redirect={redirect} prefilledEmail={displayEmail} />
            : <OperatorSignupForm phone={displayPhone} redirect={redirect} prefilledEmail={displayEmail} />
          }
        </div>

        <p className="text-center mt-6 text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link
            href={`/login${redirect ? `?redirect=${redirect}` : ""}`}
            className="text-primary hover:underline font-medium"
          >
            Log in
          </Link>
        </p>
      </div>
    </main>
  )
}

export default function SignupPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <PublicHeader />
      <React.Suspense
        fallback={<main className="flex-1 flex flex-col items-center justify-center">Loading...</main>}
      >
        <SignupContent />
      </React.Suspense>
      <PublicFooter />
    </div>
  )
}
