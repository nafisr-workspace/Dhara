import Link from "next/link"
import Image from "next/image"
import { CalendarDays, MapPin, Navigation } from "lucide-react"
import { format, parseISO } from "date-fns"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export interface UpcomingStayCardProps {
  facilityName: string
  facilityImage: string
  facilityLocation: string
  facilitySlug: string
  roomName: string
  checkinDate: string
  checkoutDate: string
  bookingCode: string
  bookingId: string
  className?: string
}

export function UpcomingStayCard({
  facilityName,
  facilityImage,
  facilityLocation,
  facilitySlug,
  roomName,
  checkinDate,
  checkoutDate,
  bookingCode,
  bookingId,
  className,
}: UpcomingStayCardProps) {
  const checkin = parseISO(checkinDate)
  const checkout = parseISO(checkoutDate)

  return (
    <Card className={cn("overflow-hidden", className)}>
      <div className="relative h-48 w-full bg-muted sm:h-56">
        <Image
          src={facilityImage}
          alt={facilityName}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 600px"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-5">
          <h2 className="text-xl font-bold text-white sm:text-2xl">{facilityName}</h2>
          <div className="mt-1 flex items-center gap-1.5 text-sm text-white/80">
            <MapPin className="h-3.5 w-3.5 shrink-0" />
            <span>{facilityLocation}</span>
          </div>
        </div>
      </div>

      <CardContent className="p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-2">
            <p className="text-sm font-medium text-foreground">{roomName}</p>

            <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <CalendarDays className="h-4 w-4 shrink-0" />
              <span>
                {format(checkin, "EEE, d MMM")} – {format(checkout, "EEE, d MMM yyyy")}
              </span>
            </div>

            <p className="font-mono text-xs tracking-wide text-muted-foreground">
              {bookingCode}
            </p>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" size="sm" asChild>
              <Link href={`/places/${facilitySlug}`}>
                <Navigation className="mr-1.5 h-3.5 w-3.5" />
                Get Directions
              </Link>
            </Button>
            <Button size="sm" asChild>
              <Link href={`/bookings/${bookingId}`}>View Booking</Link>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
