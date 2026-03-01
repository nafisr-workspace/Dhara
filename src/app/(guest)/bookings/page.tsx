"use client"

import React from "react"
import { CalendarDays } from "lucide-react"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { BookingCard } from "@/components/shared/booking-card"
import { EmptyState } from "@/components/shared/empty-state"
import { PageHeader } from "@/components/layout/page-header"
import { mockBookings, mockGuestProfile } from "@/lib/mock-data"

const guestBookings = mockBookings.filter(
  (b) => b.guestId === mockGuestProfile.id,
)

const upcomingBookings = guestBookings.filter(
  (b) => b.status === "upcoming" || b.status === "checked_in",
)
const pastBookings = guestBookings.filter((b) => b.status === "completed")
const cancelledBookings = guestBookings.filter((b) => b.status === "cancelled")

export default function BookingsPage() {
  return (
    <div className="container max-w-3xl py-8">
      <PageHeader
        title="My Bookings"
        description="View and manage your reservations"
      />

      <Tabs defaultValue="upcoming">
        <TabsList className="mb-6 w-full justify-start">
          <TabsTrigger value="upcoming">
            Upcoming ({upcomingBookings.length})
          </TabsTrigger>
          <TabsTrigger value="past">
            Past ({pastBookings.length})
          </TabsTrigger>
          <TabsTrigger value="cancelled">
            Cancelled ({cancelledBookings.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming">
          {upcomingBookings.length > 0 ? (
            <div className="space-y-4">
              {upcomingBookings.map((b) => (
                <BookingCard
                  key={b.id}
                  facility={{
                    name: b.facilityName,
                    image: b.facilityImage,
                    location: b.facilityLocation,
                  }}
                  roomName={b.roomName}
                  checkinDate={b.checkinDate}
                  checkoutDate={b.checkoutDate}
                  status={b.status}
                  totalAmount={b.totalAmount}
                  bookingCode={b.bookingCode}
                  bookingId={b.id}
                />
              ))}
            </div>
          ) : (
            <EmptyState
              icon={<CalendarDays className="h-10 w-10" />}
              title="No upcoming bookings"
              description="When you book a stay, your upcoming reservations will appear here."
            />
          )}
        </TabsContent>

        <TabsContent value="past">
          {pastBookings.length > 0 ? (
            <div className="space-y-4">
              {pastBookings.map((b) => (
                <BookingCard
                  key={b.id}
                  facility={{
                    name: b.facilityName,
                    image: b.facilityImage,
                    location: b.facilityLocation,
                  }}
                  roomName={b.roomName}
                  checkinDate={b.checkinDate}
                  checkoutDate={b.checkoutDate}
                  status={b.status}
                  totalAmount={b.totalAmount}
                  bookingCode={b.bookingCode}
                  bookingId={b.id}
                />
              ))}
            </div>
          ) : (
            <EmptyState
              icon={<CalendarDays className="h-10 w-10" />}
              title="No past bookings"
              description="Your completed stays will show up here after checkout."
            />
          )}
        </TabsContent>

        <TabsContent value="cancelled">
          {cancelledBookings.length > 0 ? (
            <div className="space-y-4">
              {cancelledBookings.map((b) => (
                <BookingCard
                  key={b.id}
                  facility={{
                    name: b.facilityName,
                    image: b.facilityImage,
                    location: b.facilityLocation,
                  }}
                  roomName={b.roomName}
                  checkinDate={b.checkinDate}
                  checkoutDate={b.checkoutDate}
                  status={b.status}
                  totalAmount={b.totalAmount}
                  bookingCode={b.bookingCode}
                  bookingId={b.id}
                />
              ))}
            </div>
          ) : (
            <EmptyState
              icon={<CalendarDays className="h-10 w-10" />}
              title="No cancelled bookings"
              description="You haven't cancelled any reservations."
            />
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
