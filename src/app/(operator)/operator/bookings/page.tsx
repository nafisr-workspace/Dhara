"use client"

import React, { useState, useMemo } from "react"
import { PageHeader } from "@/components/layout/page-header"
import { BookingStatusBadge } from "@/components/shared/booking-status-badge"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { mockBookings, mockFacilities } from "@/lib/mock-data"
import { format } from "date-fns"
import { type MockBooking } from "@/lib/mock-data"

const guestNames: Record<string, string> = {
  "u-guest-1": "Nadia Rahman",
  "u-guest-2": "Arif Khan",
  "u-guest-3": "Sabrina Chowdhury",
}

const guestPhones: Record<string, string> = {
  "u-guest-1": "01712-345678",
  "u-guest-2": "01819-876543",
  "u-guest-3": "01655-112233",
}

function formatPaymentMethod(method: string | null): string {
  if (!method) return "—"
  const map: Record<string, string> = {
    bkash: "bKash",
    nagad: "Nagad",
    card: "Card",
    cash: "Cash",
  }
  return map[method] ?? method
}

function paymentMethodVariant(
  method: string | null
): "default" | "secondary" | "outline" {
  if (method === "bkash") return "default"
  if (method === "nagad") return "secondary"
  return "outline"
}

function paymentStatusColor(status: string): string {
  switch (status) {
    case "paid":
      return "bg-success/15 text-success-foreground hover:bg-success/20"
    case "cash_pending":
      return "bg-warning/15 text-warning-foreground hover:bg-warning/20"
    case "refunded":
      return "bg-muted text-muted-foreground hover:bg-muted"
    case "pending":
      return "bg-info/15 text-info-foreground hover:bg-info/20"
    default:
      return ""
  }
}

export default function OperatorBookingsPage() {
  const [facilityFilter, setFacilityFilter] = useState<string>("all")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [selectedBooking, setSelectedBooking] = useState<MockBooking | null>(
    null
  )
  const [sheetOpen, setSheetOpen] = useState(false)

  const filteredBookings = useMemo(() => {
    return mockBookings.filter((b) => {
      const matchFacility =
        facilityFilter === "all" || b.facilityId === facilityFilter
      const matchStatus =
        statusFilter === "all" || b.status === statusFilter
      return matchFacility && matchStatus
    })
  }, [facilityFilter, statusFilter])

  function openDetail(booking: MockBooking) {
    setSelectedBooking(booking)
    setSheetOpen(true)
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Bookings" />

      {/* Filter row */}
      <div className="flex flex-wrap items-center gap-4">
        <Select value={facilityFilter} onValueChange={setFacilityFilter}>
          <SelectTrigger className="w-[220px]">
            <SelectValue placeholder="All facilities" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Facilities</SelectItem>
            {mockFacilities.map((f) => (
              <SelectItem key={f.id} value={f.id}>
                {f.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="All statuses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="upcoming">Upcoming</SelectItem>
            <SelectItem value="checked_in">Checked In</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Bookings table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Guest</TableHead>
                <TableHead>Room</TableHead>
                <TableHead className="hidden md:table-cell">
                  Facility
                </TableHead>
                <TableHead>Check-in</TableHead>
                <TableHead>Check-out</TableHead>
                <TableHead className="hidden lg:table-cell">Guests</TableHead>
                <TableHead>Payment</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredBookings.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={8}
                    className="py-12 text-center text-muted-foreground"
                  >
                    No bookings match the selected filters
                  </TableCell>
                </TableRow>
              ) : (
                filteredBookings.map((booking) => (
                  <TableRow
                    key={booking.id}
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => openDetail(booking)}
                  >
                    <TableCell className="font-medium">
                      {guestNames[booking.guestId] ?? "Guest"}
                    </TableCell>
                    <TableCell>{booking.roomName}</TableCell>
                    <TableCell className="hidden md:table-cell">
                      {booking.facilityName}
                    </TableCell>
                    <TableCell>
                      {format(new Date(booking.checkinDate), "MMM d, yyyy")}
                    </TableCell>
                    <TableCell>
                      {format(new Date(booking.checkoutDate), "MMM d, yyyy")}
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">
                      {booking.guestCount}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap items-center gap-1.5">
                        <Badge variant={paymentMethodVariant(booking.paymentMethod)}>
                          {formatPaymentMethod(booking.paymentMethod)}
                        </Badge>
                        <Badge
                          variant="secondary"
                          className={paymentStatusColor(booking.paymentStatus)}
                        >
                          {booking.paymentStatus === "cash_pending"
                            ? "Cash Due"
                            : booking.paymentStatus.charAt(0).toUpperCase() +
                              booking.paymentStatus.slice(1)}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      <BookingStatusBadge status={booking.status} />
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Booking detail sheet */}
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent className="overflow-y-auto sm:max-w-md">
          <SheetHeader>
            <SheetTitle className="font-heading text-xl">
              Booking Details
            </SheetTitle>
          </SheetHeader>

          {selectedBooking && (
            <div className="mt-6 space-y-6">
              {/* Guest info */}
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-muted-foreground">
                  Guest
                </h3>
                <p className="text-lg font-semibold">
                  {guestNames[selectedBooking.guestId] ?? "Guest"}
                </p>
                <p className="text-sm text-muted-foreground">
                  {guestPhones[selectedBooking.guestId] ?? "—"}
                </p>
                <p className="font-mono text-sm text-muted-foreground">
                  {selectedBooking.bookingCode}
                </p>
              </div>

              <Separator />

              {/* Room & facility */}
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-muted-foreground">
                  Room &amp; Facility
                </h3>
                <p className="font-semibold">{selectedBooking.roomName}</p>
                <p className="text-sm text-muted-foreground">
                  {selectedBooking.facilityName}
                </p>
                <p className="text-sm text-muted-foreground">
                  {selectedBooking.facilityLocation}
                </p>
              </div>

              <Separator />

              {/* Dates & guests */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">
                    Check-in
                  </p>
                  <p className="font-semibold">
                    {format(
                      new Date(selectedBooking.checkinDate),
                      "MMM d, yyyy"
                    )}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">
                    Check-out
                  </p>
                  <p className="font-semibold">
                    {format(
                      new Date(selectedBooking.checkoutDate),
                      "MMM d, yyyy"
                    )}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">
                    Guests
                  </p>
                  <p className="font-semibold">{selectedBooking.guestCount}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">
                    Meals Included
                  </p>
                  <p className="font-semibold">
                    {selectedBooking.mealIncluded ? "Yes" : "No"}
                  </p>
                </div>
              </div>

              <Separator />

              {/* Payment details */}
              <div className="space-y-3">
                <h3 className="text-sm font-medium text-muted-foreground">
                  Payment
                </h3>
                <div className="flex items-center gap-2">
                  <Badge
                    variant={paymentMethodVariant(
                      selectedBooking.paymentMethod
                    )}
                  >
                    {formatPaymentMethod(selectedBooking.paymentMethod)}
                  </Badge>
                  <Badge
                    variant="secondary"
                    className={paymentStatusColor(
                      selectedBooking.paymentStatus
                    )}
                  >
                    {selectedBooking.paymentStatus === "cash_pending"
                      ? "Cash Due"
                      : selectedBooking.paymentStatus.charAt(0).toUpperCase() +
                        selectedBooking.paymentStatus.slice(1)}
                  </Badge>
                </div>
                <div className="rounded-lg border p-3 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Room rate</span>
                    <span>৳{selectedBooking.roomRate.toLocaleString()}</span>
                  </div>
                  {selectedBooking.mealCharge > 0 && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        Meal charge
                      </span>
                      <span>
                        ৳{selectedBooking.mealCharge.toLocaleString()}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      Platform fee
                    </span>
                    <span>
                      ৳{selectedBooking.platformFee.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Tax</span>
                    <span>৳{selectedBooking.taxAmount.toLocaleString()}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-semibold">
                    <span>Total</span>
                    <span>
                      ৳{selectedBooking.totalAmount.toLocaleString()}
                    </span>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">
                  Reference: {selectedBooking.bookingCode}
                </p>
              </div>

              <Separator />

              {/* Status */}
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-muted-foreground">
                  Status
                </h3>
                <BookingStatusBadge status={selectedBooking.status} />
              </div>

              {/* Special requests */}
              {selectedBooking.specialRequests && (
                <>
                  <Separator />
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium text-muted-foreground">
                      Special Requests
                    </h3>
                    <p className="text-sm">
                      {selectedBooking.specialRequests}
                    </p>
                  </div>
                </>
              )}

              <div className="pt-4">
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => setSheetOpen(false)}
                >
                  Close
                </Button>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  )
}
