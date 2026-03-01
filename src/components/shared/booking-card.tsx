import Link from "next/link"
import Image from "next/image"
import { CalendarDays } from "lucide-react"
import { format, parseISO } from "date-fns"
import { Card, CardContent } from "@/components/ui/card"
import { BookingStatusBadge } from "@/components/shared/booking-status-badge"
import { cn } from "@/lib/utils"
import { type BookingStatus } from "@/lib/mock-data"

export interface BookingCardProps {
  facility: { name: string; image: string; location: string }
  roomName: string
  checkinDate: string
  checkoutDate: string
  status: BookingStatus
  totalAmount: number
  bookingCode: string
  bookingId: string
  className?: string
}

export function BookingCard({
  facility,
  roomName,
  checkinDate,
  checkoutDate,
  status,
  totalAmount,
  bookingCode,
  bookingId,
  className,
}: BookingCardProps) {
  const checkin = parseISO(checkinDate)
  const checkout = parseISO(checkoutDate)

  return (
    <Card className={cn("overflow-hidden transition-shadow hover:shadow-md", className)}>
      <CardContent className="p-4">
        <div className="flex gap-4">
          <div className="relative h-[60px] w-[60px] shrink-0 overflow-hidden rounded-lg bg-muted">
            <Image
              src={facility.image}
              alt={facility.name}
              fill
              className="object-cover"
              sizes="60px"
            />
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <h3 className="text-sm font-semibold leading-snug line-clamp-1">
                  {facility.name}
                </h3>
                <p className="text-xs text-muted-foreground line-clamp-1">
                  {roomName} &middot; {facility.location}
                </p>
              </div>
              <BookingStatusBadge status={status} className="shrink-0" />
            </div>

            <div className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground">
              <CalendarDays className="h-3.5 w-3.5 shrink-0" />
              <span>
                {format(checkin, "d MMM")} – {format(checkout, "d MMM yyyy")}
              </span>
            </div>

            <div className="mt-2 flex items-center justify-between">
              <span className="text-sm font-semibold">৳{totalAmount.toLocaleString()}</span>
              <Link
                href={`/bookings/${bookingId}`}
                className="text-xs font-medium text-primary hover:underline"
              >
                View Details
              </Link>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
