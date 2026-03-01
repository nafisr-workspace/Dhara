"use client"

import React from "react"
import Link from "next/link"
import Image from "next/image"
import { format, parseISO, differenceInCalendarDays } from "date-fns"
import { MapPin, ArrowLeft, Copy, Clock, AlertTriangle } from "lucide-react"
import { BookingStatusBadge } from "@/components/shared/booking-status-badge"
import { PriceBreakdown } from "@/components/shared/price-breakdown"
import { ImpactSummary } from "@/components/shared/impact-summary"
import { PageHeader } from "@/components/layout/page-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { mockBookings, mockFacilities } from "@/lib/mock-data"

export default function BookingDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = React.use(params)

  const booking = mockBookings.find((b) => b.id === id)

  if (!booking) {
    return (
      <div className="container max-w-3xl py-8">
        <Link
          href="/bookings"
          className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to bookings
        </Link>
        <div className="flex min-h-[400px] items-center justify-center">
          <p className="text-lg text-muted-foreground">Booking not found</p>
        </div>
      </div>
    )
  }

  const facility = mockFacilities.find((f) => f.id === booking.facilityId)
  const checkin = parseISO(booking.checkinDate)
  const checkout = parseISO(booking.checkoutDate)
  const nights = differenceInCalendarDays(checkout, checkin)

  return (
    <div className="container max-w-3xl py-8">
      <Link
        href="/bookings"
        className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to bookings
      </Link>

      <PageHeader
        title={booking.bookingCode}
        actions={<BookingStatusBadge status={booking.status} />}
      />

      {/* Facility info */}
      <Card className="mb-6">
        <CardContent className="flex gap-5 p-5">
          <div className="relative h-[160px] w-[240px] shrink-0 overflow-hidden rounded-lg bg-muted">
            <Image
              src={booking.facilityImage}
              alt={booking.facilityName}
              fill
              className="object-cover"
              sizes="240px"
            />
          </div>
          <div className="flex flex-col justify-center space-y-2">
            <h2 className="text-lg font-semibold">{booking.facilityName}</h2>
            <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4 shrink-0" />
              <span>{booking.facilityLocation}</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Room: <span className="font-medium text-foreground">{booking.roomName}</span>
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Dates & guests */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-base">Stay Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Check-in</span>
            <span className="font-medium">{format(checkin, "EEE, d MMM yyyy")}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Check-out</span>
            <span className="font-medium">{format(checkout, "EEE, d MMM yyyy")}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Guests</span>
            <span className="font-medium">
              {booking.guestCount} {booking.guestCount === 1 ? "guest" : "guests"}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Meals</span>
            {booking.mealIncluded ? (
              <span className="inline-flex items-center rounded-full bg-success/15 px-2.5 py-0.5 text-xs font-medium text-success-foreground">
                Included
              </span>
            ) : (
              <span className="text-muted-foreground">Not included</span>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Price breakdown */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-base">Price Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <PriceBreakdown
            roomRate={booking.roomRate}
            nights={nights}
            mealCharge={booking.mealCharge}
            platformFee={booking.platformFee}
            taxAmount={booking.taxAmount}
            totalAmount={booking.totalAmount}
          />
        </CardContent>
      </Card>

      {/* Booking code */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-base">Booking Code</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between rounded-lg bg-muted px-4 py-3">
            <span className="font-mono text-lg font-bold tracking-wider">
              {booking.bookingCode}
            </span>
            <Button
              variant="ghost"
              size="sm"
              className="gap-1.5"
              onClick={() => navigator.clipboard.writeText(booking.bookingCode)}
            >
              <Copy className="h-4 w-4" />
              Copy
            </Button>
          </div>
          <p className="mt-2 text-xs text-muted-foreground">
            Show this code at the front desk during check-in.
          </p>
        </CardContent>
      </Card>

      {/* Check-in instructions (upcoming only) */}
      {booking.status === "upcoming" && (
        <Card className="mb-6 border-info/30 bg-info/10">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Clock className="h-4 w-4 text-info" />
              Check-in Instructions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p>
              <span className="font-medium">Check-in time:</span>{" "}
              {facility?.rules.find((r) => r.label === "Check-in")?.value ?? "2:00 PM"}
            </p>
            <p>
              <span className="font-medium">ID required:</span> Please bring a valid
              National ID or Passport for verification at the front desk.
            </p>
            <p>
              <span className="font-medium">Contact:</span> Use the in-app messaging
              system to reach the facility — do not share personal contact details.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Impact summary (completed only) */}
      {booking.status === "completed" && facility && (
        <div className="mb-6">
          <ImpactSummary
            impactLine={booking.impactLine}
            causeText={facility.impactStory}
          />
        </div>
      )}

      {/* Cancel button (upcoming or checked_in) */}
      {(booking.status === "upcoming" || booking.status === "checked_in") && (
        <div className="pt-2">
          <Separator className="mb-6" />
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" className="w-full gap-2">
                <AlertTriangle className="h-4 w-4" />
                Cancel Booking
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Cancel this booking?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will cancel your reservation at {booking.facilityName} for{" "}
                  {format(checkin, "d MMM")} – {format(checkout, "d MMM yyyy")}.
                  Refund eligibility depends on the cancellation policy.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Keep Booking</AlertDialogCancel>
                <AlertDialogAction className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                  Yes, Cancel
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      )}
    </div>
  )
}
