import Link from "next/link"
import { format } from "date-fns"
import {
  Users,
  LogOut,
  TrendingUp,
  BarChart3,
  CalendarDays,
} from "lucide-react"

import { PageHeader } from "@/components/layout/page-header"
import { StatsCard } from "@/components/shared/stats-card"
import { BookingStatusBadge } from "@/components/shared/booking-status-badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { mockBookings, mockPayouts, mockFacilities } from "@/lib/mock-data"

const upcomingBookings = mockBookings.filter((b) => b.status === "upcoming")

const maxGross = Math.max(...mockPayouts.map((p) => p.grossAmount))

const mockArrivals = [
  { name: "Nadia Rahman", room: "Standard Double", facility: "Shanti Neer Guesthouse" },
  { name: "Rafiq Islam", room: "Solo Traveler Room", facility: "Shanti Neer Guesthouse" },
]

const mockDepartures = [
  { name: "Sabina Akter", room: "Deluxe Twin", facility: "Shanti Neer Guesthouse" },
]

export default function OperatorDashboardPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Operator Dashboard"
        description="Overview of your facilities and bookings"
      />

      {/* Stats row */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          label="Today's Arrivals"
          value="2"
          icon={<Users className="h-5 w-5" />}
        />
        <StatsCard
          label="Today's Departures"
          value="1"
          icon={<LogOut className="h-5 w-5" />}
        />
        <StatsCard
          label="This Month's Earnings"
          value={`৳${mockPayouts[0].grossAmount.toLocaleString("en-BD")}`}
          delta="+12% vs last month"
          icon={<TrendingUp className="h-5 w-5" />}
        />
        <StatsCard
          label="Occupancy"
          value="72%"
          icon={<BarChart3 className="h-5 w-5" />}
        />
      </div>

      {/* Today's Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalendarDays className="h-5 w-5" />
            Today&apos;s Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <h3 className="mb-3 text-sm font-medium text-muted-foreground">
                Arrivals ({mockArrivals.length})
              </h3>
              <div className="space-y-3">
                {mockArrivals.map((guest) => (
                  <div
                    key={guest.name}
                    className="flex items-center justify-between rounded-lg border p-3"
                  >
                    <div>
                      <p className="font-medium">{guest.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {guest.room} &middot; {guest.facility}
                      </p>
                    </div>
                    <Badge variant="outline" className="text-info-foreground border-info/20 bg-info/15">
                      Arriving
                    </Badge>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="mb-3 text-sm font-medium text-muted-foreground">
                Departures ({mockDepartures.length})
              </h3>
              <div className="space-y-3">
                {mockDepartures.map((guest) => (
                  <div
                    key={guest.name}
                    className="flex items-center justify-between rounded-lg border p-3"
                  >
                    <div>
                      <p className="font-medium">{guest.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {guest.room} &middot; {guest.facility}
                      </p>
                    </div>
                    <Badge variant="outline" className="text-accent-foreground border-accent/20 bg-accent/15">
                      Departing
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Upcoming Bookings */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Upcoming Bookings</CardTitle>
          <Button variant="outline" size="sm" asChild>
            <Link href="/operator/bookings">View all</Link>
          </Button>
        </CardHeader>
        <CardContent>
          {upcomingBookings.length === 0 ? (
            <p className="py-6 text-center text-muted-foreground">
              No upcoming bookings in the next 7 days.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Guest</TableHead>
                  <TableHead>Room</TableHead>
                  <TableHead>Facility</TableHead>
                  <TableHead>Check-in</TableHead>
                  <TableHead>Check-out</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {upcomingBookings.map((booking) => (
                  <TableRow key={booking.id}>
                    <TableCell className="font-medium">
                      {booking.bookingCode}
                    </TableCell>
                    <TableCell>{booking.roomName}</TableCell>
                    <TableCell>{booking.facilityName}</TableCell>
                    <TableCell>
                      {format(new Date(booking.checkinDate), "MMM d")}
                    </TableCell>
                    <TableCell>
                      {format(new Date(booking.checkoutDate), "MMM d")}
                    </TableCell>
                    <TableCell>
                      <BookingStatusBadge status={booking.status} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Earnings Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Earnings — Last 6 Months
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-end justify-between gap-3 pt-4" style={{ height: 240 }}>
            {[...mockPayouts].reverse().map((payout) => {
              const heightPct = (payout.grossAmount / maxGross) * 100
              return (
                <div
                  key={payout.id}
                  className="flex flex-1 flex-col items-center gap-2"
                >
                  <span className="text-xs font-medium text-muted-foreground">
                    ৳{(payout.grossAmount / 1000).toFixed(0)}k
                  </span>
                  <div
                    className="w-full rounded-t-md bg-primary transition-all"
                    style={{ height: `${heightPct}%`, minHeight: 4 }}
                  />
                  <span className="text-xs text-muted-foreground">
                    {format(new Date(payout.periodMonth), "MMM")}
                  </span>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
