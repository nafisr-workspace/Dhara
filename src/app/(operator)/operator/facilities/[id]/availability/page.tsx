"use client"

import { use, useState, useMemo } from "react"
import Link from "next/link"
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  getDay,
  addMonths,
  subMonths,
  isBefore,
  isAfter,
  isSameDay,
  startOfDay,
  parseISO,
} from "date-fns"
import { ArrowLeft, ChevronLeft, ChevronRight, ShieldCheck } from "lucide-react"

import { PageHeader } from "@/components/layout/page-header"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { EmptyState } from "@/components/shared/empty-state"
import { cn } from "@/lib/utils"
import {
  mockFacilities,
  mockAvailabilityBlocks,
  mockBookings,
} from "@/lib/mock-data"
import { useStaffPermission } from "@/lib/utils/permissions"

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

interface AvailabilityPageProps {
  params: Promise<{ id: string }>
}

export default function AvailabilityPage({ params }: AvailabilityPageProps) {
  const { id } = use(params)
  const { canAct } = useStaffPermission("facilities")
  const facility = mockFacilities.find((f) => f.id === id)

  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [selectedRoomId, setSelectedRoomId] = useState<string>(
    facility?.rooms[0]?.id ?? ""
  )

  if (!facility) {
    return (
      <EmptyState
        title="Facility not found"
        description="The facility you're looking for doesn't exist."
        action={
          <Button asChild>
            <Link href="/operator/facilities">Back to Facilities</Link>
          </Button>
        }
      />
    )
  }

  const today = startOfDay(new Date())
  const monthStart = startOfMonth(currentMonth)
  const monthEnd = endOfMonth(currentMonth)
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd })
  const startPadding = getDay(monthStart)

  const roomBlocks = mockAvailabilityBlocks.filter(
    (b) => b.roomId === selectedRoomId
  )
  const roomBookings = mockBookings.filter(
    (b) => b.facilityId === facility.id && b.roomId === selectedRoomId
  )

  function isBlocked(day: Date): boolean {
    return roomBlocks.some((block) => {
      const start = parseISO(block.startDate)
      const end = parseISO(block.endDate)
      return (
        (isSameDay(day, start) || isAfter(day, start)) &&
        (isSameDay(day, end) || isBefore(day, end))
      )
    })
  }

  function isBooked(day: Date): boolean {
    return roomBookings.some((booking) => {
      const start = parseISO(booking.checkinDate)
      const end = parseISO(booking.checkoutDate)
      return (
        (isSameDay(day, start) || isAfter(day, start)) &&
        isBefore(day, end)
      )
    })
  }

  function isPast(day: Date): boolean {
    return isBefore(day, today)
  }

  function handleDayClick(day: Date) {
    if (!canAct) return
    if (isPast(day) || isBlocked(day) || isBooked(day)) return
    alert(`Date ${format(day, "MMM d, yyyy")} blocked!`)
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title={`Availability — ${facility.name}`}
        description={
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="h-4 w-4 text-primary" />
            Your blocked dates are always respected. Guests cannot book during blocked periods.
          </span>
        }
        actions={
          <Button variant="outline" asChild>
            <Link href={`/operator/facilities/${facility.id}`}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Link>
          </Button>
        }
      />

      {/* Room selector */}
      <div className="flex flex-wrap items-center gap-4">
        <div className="w-64">
          <Select value={selectedRoomId} onValueChange={setSelectedRoomId}>
            <SelectTrigger>
              <SelectValue placeholder="Select room" />
            </SelectTrigger>
            <SelectContent>
              {facility.rooms.map((room) => (
                <SelectItem key={room.id} value={room.id}>
                  {room.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Month navigation */}
        <div className="flex items-center gap-2 ml-auto">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setCurrentMonth((m) => subMonths(m, 1))}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="min-w-[140px] text-center font-medium">
            {format(currentMonth, "MMMM yyyy")}
          </span>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setCurrentMonth((m) => addMonths(m, 1))}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 text-xs">
        <div className="flex items-center gap-1.5">
          <div className="h-3 w-3 rounded bg-success/15 border border-success/30" />
          <span>Available</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="h-3 w-3 rounded bg-destructive/15 border border-destructive/30" />
          <span>Blocked</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="h-3 w-3 rounded bg-info/15 border border-info/30" />
          <span>Booked</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="h-3 w-3 rounded bg-muted border border-border" />
          <span>Past</span>
        </div>
      </div>

      {/* Calendar grid */}
      <div className="rounded-lg border bg-card overflow-hidden">
        {/* Weekday headers */}
        <div className="grid grid-cols-7 border-b bg-muted/50">
          {WEEKDAYS.map((day) => (
            <div
              key={day}
              className="px-2 py-2 text-center text-xs font-medium text-muted-foreground"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Day cells */}
        <div className="grid grid-cols-7">
          {Array.from({ length: startPadding }).map((_, i) => (
            <div key={`pad-${i}`} className="border-b border-r p-2 min-h-[72px]" />
          ))}

          {days.map((day) => {
            const past = isPast(day)
            const blocked = !past && isBlocked(day)
            const booked = !past && !blocked && isBooked(day)
            const available = !past && !blocked && !booked

            return (
              <button
                key={day.toISOString()}
                type="button"
                onClick={() => handleDayClick(day)}
                disabled={past || blocked || booked || !canAct}
                className={cn(
                  "relative border-b border-r p-2 text-left min-h-[72px] transition-colors",
                  past && "bg-muted text-muted-foreground",
                  blocked && "bg-destructive/15 text-destructive",
                  booked && "bg-info/15 text-info-foreground",
                  available && "bg-success/10 hover:bg-success/20 cursor-pointer",
                  (past || blocked || booked) && "cursor-default"
                )}
              >
                <span className="text-sm font-medium">{format(day, "d")}</span>
                {blocked && (
                  <span className="mt-0.5 block text-[10px] font-medium leading-tight">
                    Blocked
                  </span>
                )}
                {booked && (
                  <span className="mt-0.5 block text-[10px] font-medium leading-tight">
                    Booked
                  </span>
                )}
                {isSameDay(day, today) && (
                  <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-primary" />
                )}
              </button>
            )
          })}
        </div>
      </div>

      <p className="text-xs text-muted-foreground">
        Click an available date to block it. The platform will not interfere with your blocked dates.
      </p>
    </div>
  )
}
