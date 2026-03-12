"use client"

import * as React from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { DateRange } from "react-day-picker"
import { ChevronLeft, ChevronRight, ImageIcon } from "lucide-react"

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
  const [photoIdx, setPhotoIdx] = React.useState(0)
  
  const selectedRoom = rooms.find(r => r.id === selectedRoomId)
  const roomPhotos = selectedRoom?.photos ?? []
  
  React.useEffect(() => {
    setPhotoIdx(0)
  }, [selectedRoomId])

  const nights = date?.from && date?.to ? differenceInDays(date.to, date.from) : 0
  const roomRate = selectedRoom?.price_public || 0
  const total = nights > 0 ? nights * roomRate : roomRate

  const handleBook = () => {
    if (!selectedRoomId) return
    const searchParams = new URLSearchParams()
    if (date?.from) searchParams.set("checkin", date.from.toISOString())
    if (date?.to) searchParams.set("checkout", date.to.toISOString())
    
    router.push(`/login?redirect=/book/${selectedRoomId}?${searchParams.toString()}`)
  }

  return (
    <Card className="sticky top-24 w-full">
      {/* Room photo preview */}
      <div className="relative aspect-[16/10] overflow-hidden rounded-t-lg bg-muted">
        {roomPhotos.length > 0 ? (
          <>
            <Image
              src={roomPhotos[photoIdx].url}
              alt={roomPhotos[photoIdx].alt}
              fill
              className="object-cover transition-all duration-300"
              sizes="(max-width: 1024px) 100vw, 384px"
            />
            {roomPhotos.length > 1 && (
              <>
                <button
                  type="button"
                  className="absolute left-2 top-1/2 -translate-y-1/2 flex h-7 w-7 items-center justify-center rounded-full bg-black/40 text-white hover:bg-black/60"
                  onClick={() => setPhotoIdx((prev) => (prev - 1 + roomPhotos.length) % roomPhotos.length)}
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  className="absolute right-2 top-1/2 -translate-y-1/2 flex h-7 w-7 items-center justify-center rounded-full bg-black/40 text-white hover:bg-black/60"
                  onClick={() => setPhotoIdx((prev) => (prev + 1) % roomPhotos.length)}
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
                <span className="absolute bottom-2 right-2 rounded-full bg-black/50 px-2 py-0.5 text-[10px] font-medium text-white">
                  {photoIdx + 1}/{roomPhotos.length}
                </span>
              </>
            )}
            <div className="absolute bottom-2 left-2 rounded-md bg-black/50 px-2 py-1">
              <p className="text-[11px] font-medium text-white">{selectedRoom?.name}</p>
            </div>
          </>
        ) : (
          <div className="flex h-full items-center justify-center">
            <div className="text-center text-muted-foreground">
              <ImageIcon className="mx-auto h-8 w-8 opacity-40" />
              <p className="mt-1 text-xs">No room photos</p>
            </div>
          </div>
        )}
      </div>

      <CardHeader className="pb-2">
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
