"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { DateRange } from "react-day-picker"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { DateRangePicker } from "@/components/shared/date-range-picker"
import { PriceDisplay } from "@/components/shared/price-display"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { type Room } from "@/lib/mock-data"
import { differenceInDays } from "date-fns"

interface BookingSidebarProps {
  rooms: Room[]
  slug: string
}

export function BookingSidebar({ rooms, slug }: BookingSidebarProps) {
  const router = useRouter()
  const [date, setDate] = React.useState<DateRange | undefined>()
  const [selectedRoomId, setSelectedRoomId] = React.useState<string>(rooms[0]?.id)
  
  const selectedRoom = rooms.find(r => r.id === selectedRoomId)
  
  const nights = date?.from && date?.to ? differenceInDays(date.to, date.from) : 0
  const roomRate = selectedRoom?.price_public || 0
  const total = nights > 0 ? nights * roomRate : roomRate

  const handleBook = () => {
    if (!selectedRoomId) return
    const searchParams = new URLSearchParams()
    if (date?.from) searchParams.set("checkin", date.from.toISOString())
    if (date?.to) searchParams.set("checkout", date.to.toISOString())
    
    // Redirecting to login since no auth is implemented yet, but keeping redirect param to go back to booking
    router.push(`/login?redirect=/book/${selectedRoomId}?${searchParams.toString()}`)
  }

  return (
    <Card className="sticky top-24 w-full">
      <CardHeader>
        <CardTitle className="flex items-baseline justify-between">
          <PriceDisplay amount={roomRate} size="lg" period="/ night" />
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Dates</label>
          <DateRangePicker date={date} onDateChange={setDate} />
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium">Select Room</label>
          <Select value={selectedRoomId} onValueChange={setSelectedRoomId}>
            <SelectTrigger>
              <SelectValue placeholder="Select a room" />
            </SelectTrigger>
            <SelectContent>
              {rooms.map((room) => (
                <SelectItem key={room.id} value={room.id}>
                  {room.name} (Max {room.capacity} guests)
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {nights > 0 && (
          <div className="mt-4 pt-4 border-t space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">
                ৳{roomRate} x {nights} {nights === 1 ? 'night' : 'nights'}
              </span>
              <span>৳{total}</span>
            </div>
            <div className="flex justify-between font-semibold pt-2 border-t">
              <span>Total</span>
              <span>৳{total}</span>
            </div>
            <p className="text-xs text-muted-foreground text-center pt-2">Includes taxes and fees</p>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button className="w-full" size="lg" onClick={handleBook} disabled={!date?.from || !date?.to}>
          Book Now
        </Button>
      </CardFooter>
    </Card>
  )
}
