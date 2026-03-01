import Link from "next/link"
import { CalendarDays, Search, MapPin } from "lucide-react"
import { PageHeader } from "@/components/layout/page-header"
import { UpcomingStayCard } from "@/components/shared/upcoming-stay-card"
import { BookingCard } from "@/components/shared/booking-card"
import { EmptyState } from "@/components/shared/empty-state"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { mockBookings, mockGuestProfile } from "@/lib/mock-data"

export default function GuestDashboardPage() {
  const upcomingStay = mockBookings.find(
    (b) => b.guestId === mockGuestProfile.id && b.status === "upcoming"
  )

  const pastStays = mockBookings
    .filter((b) => b.guestId === mockGuestProfile.id && b.status === "completed")
    .slice(-3)

  return (
    <main className="container mx-auto max-w-4xl px-4 py-8">
      <PageHeader
        title={`Welcome back, ${mockGuestProfile.fullName}`}
        description="Your travel dashboard"
      />

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
              <CalendarDays className="h-5 w-5" />
            </div>
            <div>
              <p className="text-2xl font-semibold">{mockGuestProfile.totalBookings}</p>
              <p className="text-sm text-muted-foreground">Total Bookings</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
              <MapPin className="h-5 w-5" />
            </div>
            <div>
              <p className="text-2xl font-semibold">{mockGuestProfile.totalNights}</p>
              <p className="text-sm text-muted-foreground">Total Nights</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Upcoming Stay */}
      <section className="mt-10">
        <h2 className="mb-4 text-xl font-semibold tracking-tight">Upcoming Stay</h2>
        {upcomingStay ? (
          <UpcomingStayCard
            facilityName={upcomingStay.facilityName}
            facilityImage={upcomingStay.facilityImage}
            facilityLocation={upcomingStay.facilityLocation}
            facilitySlug={upcomingStay.facilitySlug}
            roomName={upcomingStay.roomName}
            checkinDate={upcomingStay.checkinDate}
            checkoutDate={upcomingStay.checkoutDate}
            bookingCode={upcomingStay.bookingCode}
            bookingId={upcomingStay.id}
          />
        ) : (
          <EmptyState
            icon={<Search className="h-8 w-8" />}
            title="No upcoming stays"
            description="Browse unique NGO-run facilities across Bangladesh and book your next meaningful trip."
            action={
              <Button asChild>
                <Link href="/discover">Find a Place</Link>
              </Button>
            }
          />
        )}
      </section>

      {/* Past Stays */}
      {pastStays.length > 0 && (
        <section className="mt-10">
          <h2 className="mb-4 text-xl font-semibold tracking-tight">Past Stays</h2>
          <div className="space-y-3">
            {pastStays.map((b) => (
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
        </section>
      )}

      {/* Quick Action */}
      <section className="mt-10">
        <Button asChild size="lg" className="w-full sm:w-auto">
          <Link href="/discover">
            <Search className="mr-2 h-4 w-4" />
            Find a new place
          </Link>
        </Button>
      </section>
    </main>
  )
}
