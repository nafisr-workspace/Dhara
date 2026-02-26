"use client"

import * as React from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { Backpack, Building } from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { PublicHeader } from "@/components/layout/public-header"
import { PublicFooter } from "@/components/layout/public-footer"

function SignupContent() {
  const searchParams = useSearchParams()
  const redirect = searchParams.get("redirect")

  const handleRoleSelect = (role: "guest" | "operator") => {
    alert(`Selected role: ${role}. Google OAuth mock triggered.`)
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
            onClick={() => handleRoleSelect("guest")}
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
            onClick={() => handleRoleSelect("operator")}
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
          <Link href={`/login${redirect ? `?redirect=${redirect}` : ''}`} className="text-primary hover:underline font-medium">
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
      <React.Suspense fallback={<main className="flex-1 flex flex-col items-center justify-center">Loading...</main>}>
        <SignupContent />
      </React.Suspense>
      <PublicFooter />
    </div>
  )
}
