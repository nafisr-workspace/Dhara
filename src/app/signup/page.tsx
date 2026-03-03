"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Backpack, Building, ArrowLeft, Smartphone, Landmark } from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { PublicHeader } from "@/components/layout/public-header"
import { PublicFooter } from "@/components/layout/public-footer"
import {
  signupAsGuest,
  signupAsOperator,
  getRedirectForRole,
} from "@/lib/mock-auth"
import type { MfsAccountType } from "@/lib/mock-data"

const guestSchema = z.object({
  fullName: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  accountType: z.enum(["bkash", "nagad", "bank"], { message: "Please select an account type" }),
  accountNumber: z.string().min(5, "Please enter a valid account number"),
})

const operatorSchema = z.object({
  fullName: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  orgName: z.string().min(2, "Organization name is required"),
  orgType: z.string().min(1, "Please select an organization type"),
  orgDescription: z.string().optional(),
})

type GuestFormValues = z.infer<typeof guestSchema>
type OperatorFormValues = z.infer<typeof operatorSchema>

function AccountTypeIcon({ type }: { type: MfsAccountType }) {
  if (type === "bank") return <Landmark className="h-4 w-4" />
  return <Smartphone className="h-4 w-4" />
}

function accountTypeLabel(type: MfsAccountType): string {
  const labels: Record<MfsAccountType, string> = {
    bkash: "bKash",
    nagad: "Nagad",
    bank: "Bank Account",
  }
  return labels[type]
}

function GuestSignupForm({ redirect }: { redirect: string | null }) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  const form = useForm<GuestFormValues>({
    resolver: zodResolver(guestSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      password: "",
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
      phone: values.phone,
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
        <FormField
          control={form.control}
          name="fullName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g. Nadia Rahman" {...field} />
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
                <Input type="email" placeholder="you@example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone Number</FormLabel>
              <FormControl>
                <Input placeholder="+880 1700 000000" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type="password" placeholder="At least 6 characters" {...field} />
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
                          field.value === t
                            ? "border-primary bg-primary/5"
                            : "hover:bg-muted/50"
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
                    placeholder={
                      form.watch("accountType") === "bank"
                        ? "e.g. 1234567890"
                        : "e.g. 01712345678"
                    }
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

function OperatorSignupForm({ redirect }: { redirect: string | null }) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  const form = useForm<OperatorFormValues>({
    resolver: zodResolver(operatorSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      password: "",
      orgName: "",
      orgType: "",
      orgDescription: "",
    },
  })

  function onSubmit(values: OperatorFormValues) {
    setIsSubmitting(true)
    signupAsOperator({
      fullName: values.fullName,
      email: values.email,
      phone: values.phone,
      orgName: values.orgName,
      orgType: values.orgType,
      orgDescription: values.orgDescription ?? "",
    })
    setTimeout(() => {
      router.push(redirect || "/operator/pending")
    }, 500)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        <FormField
          control={form.control}
          name="fullName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g. Kamal Hossain" {...field} />
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
                <Input type="email" placeholder="you@organization.org" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone Number</FormLabel>
              <FormControl>
                <Input placeholder="+880 1700 000000" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type="password" placeholder="At least 6 characters" {...field} />
              </FormControl>
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
                <FormControl>
                  <Input placeholder="e.g. Shanti Neer Development Society" {...field} />
                </FormControl>
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
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
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

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "Creating account..." : "Submit Application"}
        </Button>
      </form>
    </Form>
  )
}

function SignupContent() {
  const searchParams = useSearchParams()
  const redirect = searchParams.get("redirect")
  const [selectedRole, setSelectedRole] = React.useState<"guest" | "operator" | null>(null)

  if (selectedRole) {
    return (
      <main className="flex-1 flex flex-col items-center justify-center bg-muted/10 p-4 md:p-8">
        <div className="w-full max-w-lg">
          <button
            onClick={() => setSelectedRole(null)}
            className="mb-6 flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to role selection
          </button>

          <div className="bg-card rounded-xl border shadow-sm p-6 md:p-8">
            <div className="mb-6 text-center">
              <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
                {selectedRole === "guest" ? (
                  <Backpack className="h-7 w-7 text-primary" />
                ) : (
                  <Building className="h-7 w-7 text-primary" />
                )}
              </div>
              <h1 className="font-heading text-2xl font-bold">
                {selectedRole === "guest" ? "Create Guest Account" : "Apply as Operator"}
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                {selectedRole === "guest"
                  ? "Book affordable stays and support local causes"
                  : "List your facility and start earning"}
              </p>
            </div>

            {selectedRole === "guest" ? (
              <GuestSignupForm redirect={redirect} />
            ) : (
              <OperatorSignupForm redirect={redirect} />
            )}
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

export default function SignupPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <PublicHeader />
      <React.Suspense
        fallback={
          <main className="flex-1 flex flex-col items-center justify-center">
            Loading...
          </main>
        }
      >
        <SignupContent />
      </React.Suspense>
      <PublicFooter />
    </div>
  )
}
