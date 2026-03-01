import Link from "next/link"
import { format } from "date-fns"
import {
  DoorOpen,
  CalendarCheck,
  TrendingUp,
  BedDouble,
  CalendarDays,
  Settings,
} from "lucide-react"

import { PageHeader } from "@/components/layout/page-header"
import { StatsCard } from "@/components/shared/stats-card"
import { BookingStatusBadge } from "@/components/shared/booking-status-badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { mockFacilities, mockBookings } from "@/lib/mock-data"

interface FacilityOverviewPageProps {
  params: Promise<{ id: string }>
}

export default async function FacilityOverviewPage({ params }: FacilityOverviewPageProps) {
  const { id } = await params
  const facility = mockFacilities.find((f) => f.id === id)

  if (!facility) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold">Facility not found</h2>
          <p className="mt-2 text-muted-foreground">
            The facility you&apos;re looking for doesn&apos;t exist.
          </p>
          <Button asChild className="mt-4">
            <Link href="/operator/facilities">Back to Facilities</Link>
          </Button>
        </div>
      </div>
    )
  }

  const facilityBookings = mockBookings
    .filter((b) => b.facilityId === facility.id)
    .slice(0, 5)

  return (
    <div className="space-y-8">
      <PageHeader
        title={facility.name}
        description={facility.location}
      />

      {/* Stats row */}
      <div className="grid gap-4 sm:grid-cols-3">
        <StatsCard
          label="Total Rooms"
          value={String(facility.rooms.length)}
          icon={<DoorOpen className="h-5 w-5" />}
        />
        <StatsCard
          label="Active Bookings"
          value="3"
          icon={<CalendarCheck className="h-5 w-5" />}
        />
        <StatsCard
          label="Monthly Earnings"
          value="৳85,400"
          delta="+12% vs last month"
          icon={<TrendingUp className="h-5 w-5" />}
        />
      </div>

      {/* Quick links */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Button
          variant="outline"
          className="h-auto flex-col gap-2 p-6"
          asChild
        >
          <Link href={`/operator/facilities/${facility.id}/rooms`}>
            <BedDouble className="h-6 w-6" />
            <span className="text-sm font-medium">Manage Rooms</span>
          </Link>
        </Button>
        <Button
          variant="outline"
          className="h-auto flex-col gap-2 p-6"
          asChild
        >
          <Link href={`/operator/facilities/${facility.id}/availability`}>
            <CalendarDays className="h-6 w-6" />
            <span className="text-sm font-medium">Availability Calendar</span>
          </Link>
        </Button>
        <Button
          variant="outline"
          className="h-auto flex-col gap-2 p-6"
          asChild
        >
          <Link href={`/operator/facilities/${facility.id}/settings`}>
            <Settings className="h-6 w-6" />
            <span className="text-sm font-medium">Facility Settings</span>
          </Link>
        </Button>
      </div>

      {/* Recent Bookings */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Bookings</CardTitle>
        </CardHeader>
        <CardContent>
          {facilityBookings.length === 0 ? (
            <p className="py-6 text-center text-muted-foreground">
              No bookings yet for this facility.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Guest</TableHead>
                  <TableHead>Room</TableHead>
                  <TableHead>Check-in</TableHead>
                  <TableHead>Check-out</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {facilityBookings.map((booking) => (
                  <TableRow key={booking.id}>
                    <TableCell className="font-medium">
                      {booking.bookingCode}
                    </TableCell>
                    <TableCell>{booking.roomName}</TableCell>
                    <TableCell>
                      {format(new Date(booking.checkinDate), "MMM d, yyyy")}
                    </TableCell>
                    <TableCell>
                      {format(new Date(booking.checkoutDate), "MMM d, yyyy")}
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
    </div>
  )
}
