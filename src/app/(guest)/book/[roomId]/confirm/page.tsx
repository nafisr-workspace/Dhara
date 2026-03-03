"use client"

import React from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { ImpactLine } from "@/components/shared/impact-line"
import { mockFacilities } from "@/lib/mock-data"
import { format } from "date-fns"
import { Clock, Search } from "lucide-react"

export default function BookingConfirmPage({
  params,
  searchParams,
}: {
  params: Promise<{ roomId: string }>
  searchParams: Promise<{ checkin?: string; checkout?: string }>
}) {
  const resolvedParams = React.use(params)
  const resolvedSearchParams = React.use(searchParams)

  const { roomId } = resolvedParams
  const checkinStr = resolvedSearchParams.checkin ?? ""
  const checkoutStr = resolvedSearchParams.checkout ?? ""

  let room = null
  let facility = null
  for (const f of mockFacilities) {
    const found = f.rooms.find((r) => r.id === roomId)
    if (found) {
      room = found
      facility = f
      break
    }
  }

  const checkinDate = checkinStr ? new Date(checkinStr) : new Date()
  const checkoutDate = checkoutStr
    ? new Date(checkoutStr)
    : new Date(Date.now() + 86400000 * 2)

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-lg flex-col items-center justify-center px-4 py-12">
      <div className="mb-6 flex h-20 w-20 animate-scale-in items-center justify-center rounded-full bg-amber-100 dark:bg-amber-900/30">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-amber-500 text-white">
          <Clock className="h-8 w-8" strokeWidth={2.5} />
        </div>
      </div>

      <h1 className="font-heading text-2xl font-semibold">Booking Submitted</h1>
      <Badge className="mt-2 bg-amber-100 text-amber-800 border-transparent dark:bg-amber-900/30 dark:text-amber-400">
        Awaiting Operator Approval
      </Badge>
      <p className="mt-3 text-center text-muted-foreground max-w-sm">
        Your booking request has been sent to the facility operator. You will be
        notified once they approve your reservation.
      </p>

      <div className="mt-6 rounded-lg border-2 border-dashed border-amber-300/50 bg-amber-50/50 dark:bg-amber-950/10 px-6 py-3 text-center">
        <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          Booking Code
        </p>
        <p className="mt-1 font-mono text-xl font-bold tracking-widest text-amber-700 dark:text-amber-400">
          DHARA-NY2H-R5KL
        </p>
      </div>

      <Card className="mt-8 w-full">
        <CardContent className="space-y-3 pt-6 text-sm">
          {facility && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">Facility</span>
              <span className="font-medium text-right">{facility.name}</span>
            </div>
          )}
          {room && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">Room</span>
              <span className="font-medium">{room.name}</span>
            </div>
          )}
          <div className="flex justify-between">
            <span className="text-muted-foreground">Check-in</span>
            <span className="font-medium">
              {format(checkinDate, "EEE, MMM d, yyyy")}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Check-out</span>
            <span className="font-medium">
              {format(checkoutDate, "EEE, MMM d, yyyy")}
            </span>
          </div>
          <Separator />
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Status</span>
            <Badge className="bg-amber-100 text-amber-800 border-transparent dark:bg-amber-900/30 dark:text-amber-400">
              Awaiting Approval
            </Badge>
          </div>
        </CardContent>
      </Card>

      {facility && (
        <div className="mt-4 w-full">
          <ImpactLine text={facility.impactLine} />
        </div>
      )}

      <Separator className="my-6 w-full" />

      <div className="w-full rounded-lg bg-muted/60 p-4 text-sm">
        <p className="font-medium">What happens next?</p>
        <ol className="mt-2 space-y-1.5 text-muted-foreground list-decimal list-inside">
          <li>The operator will review your booking request</li>
          <li>You will receive a message once approved</li>
          <li>Bring a valid <strong>National ID</strong> or <strong>Passport</strong> for check-in</li>
        </ol>
      </div>

      <div className="mt-8 flex w-full flex-col gap-3 sm:flex-row">
        <Button asChild className="flex-1" size="lg">
          <Link href="/bookings">View My Bookings</Link>
        </Button>
        <Button asChild variant="outline" className="flex-1" size="lg">
          <Link href="/discover">
            <Search className="mr-2 h-4 w-4" />
            Find Another Place
          </Link>
        </Button>
      </div>
    </div>
  )
}
