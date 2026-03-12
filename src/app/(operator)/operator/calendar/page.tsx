"use client"

import { useState, useMemo, useCallback, useRef } from "react"
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
  differenceInDays,
} from "date-fns"
import {
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Ban,
  Plus,
  X,
} from "lucide-react"

import { PageHeader } from "@/components/layout/page-header"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"
import {
  mockFacilities,
  mockAvailabilityBlocks,
  mockBookings,
  type AvailabilityBlock,
  type MockBooking,
} from "@/lib/mock-data"
import { BlockDateDialog } from "@/components/shared/block-date-dialog"
import { ManualBookingDialog } from "@/components/shared/manual-booking-dialog"
import { toast } from "sonner"
import { useStaffPermission } from "@/lib/utils/permissions"

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

function isInRange(day: Date, start: Date | null, end: Date | null): boolean {
  if (!start || !end) return false
  const lo = isBefore(start, end) ? start : end
  const hi = isBefore(start, end) ? end : start
  return (isSameDay(day, lo) || isAfter(day, lo)) && (isSameDay(day, hi) || isBefore(day, hi))
}

export default function CalendarPage() {
  const { canAct } = useStaffPermission("calendar")
  const [selectedFacilityId, setSelectedFacilityId] = useState<string>(
    mockFacilities[0]?.id ?? ""
  )
  const selectedFacility = mockFacilities.find(
    (f) => f.id === selectedFacilityId
  )
  const [selectedRoomId, setSelectedRoomId] = useState<string>(
    selectedFacility?.rooms[0]?.id ?? ""
  )

  const [currentMonth, setCurrentMonth] = useState(new Date())

  // Drag selection state
  const [dragStart, setDragStart] = useState<Date | null>(null)
  const [dragEnd, setDragEnd] = useState<Date | null>(null)
  const isDraggingRef = useRef(false)

  // Finalized selection (after mouse-up)
  const [selectionStart, setSelectionStart] = useState<Date | null>(null)
  const [selectionEnd, setSelectionEnd] = useState<Date | null>(null)

  const [blockDialogOpen, setBlockDialogOpen] = useState(false)
  const [manualBookingOpen, setManualBookingOpen] = useState(false)

  const [localBlocks, setLocalBlocks] = useState<AvailabilityBlock[]>(
    mockAvailabilityBlocks
  )
  const [localBookings, setLocalBookings] = useState<MockBooking[]>(mockBookings)

  const handleFacilityChange = useCallback((fid: string) => {
    setSelectedFacilityId(fid)
    const fac = mockFacilities.find((f) => f.id === fid)
    if (fac?.rooms[0]) {
      setSelectedRoomId(fac.rooms[0].id)
    }
  }, [])

  const today = startOfDay(new Date())
  const monthStart = startOfMonth(currentMonth)
  const monthEnd = endOfMonth(currentMonth)
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd })
  const startPadding = getDay(monthStart)

  const roomBlocks = useMemo(
    () => localBlocks.filter((b) => b.roomId === selectedRoomId),
    [localBlocks, selectedRoomId]
  )
  const roomBookings = useMemo(
    () =>
      localBookings.filter(
        (b) =>
          b.facilityId === selectedFacilityId &&
          b.roomId === selectedRoomId &&
          b.status !== "cancelled"
      ),
    [localBookings, selectedFacilityId, selectedRoomId]
  )

  function isBlocked(day: Date): boolean {
    return roomBlocks.some((block) => {
      const s = parseISO(block.startDate)
      const e = parseISO(block.endDate)
      return (
        (isSameDay(day, s) || isAfter(day, s)) &&
        (isSameDay(day, e) || isBefore(day, e))
      )
    })
  }

  function getBooking(day: Date): MockBooking | undefined {
    return roomBookings.find((booking) => {
      const s = parseISO(booking.checkinDate)
      const e = parseISO(booking.checkoutDate)
      return (isSameDay(day, s) || isAfter(day, s)) && isBefore(day, e)
    })
  }

  function isPast(day: Date): boolean {
    return isBefore(day, today)
  }

  function isDayAvailable(day: Date): boolean {
    return !isPast(day) && !isBlocked(day) && !getBooking(day)
  }

  // Ordered range helpers
  function getOrderedRange(): { start: Date; end: Date } | null {
    const s = selectionStart
    const e = selectionEnd
    if (!s || !e) return null
    if (isBefore(s, e) || isSameDay(s, e)) return { start: s, end: e }
    return { start: e, end: s }
  }

  function getDragRange(): { start: Date; end: Date } | null {
    const s = dragStart
    const e = dragEnd
    if (!s || !e) return null
    if (isBefore(s, e) || isSameDay(s, e)) return { start: s, end: e }
    return { start: e, end: s }
  }

  // Drag handlers
  function handleMouseDown(day: Date) {
    if (!isDayAvailable(day)) return
    clearSelection()
    isDraggingRef.current = true
    setDragStart(day)
    setDragEnd(day)
  }

  function handleMouseEnter(day: Date) {
    if (!isDraggingRef.current || !dragStart) return
    if (!isDayAvailable(day)) return
    setDragEnd(day)
  }

  function handleMouseUp() {
    if (!isDraggingRef.current) return
    isDraggingRef.current = false

    if (dragStart && dragEnd) {
      const lo = isBefore(dragStart, dragEnd) ? dragStart : dragEnd
      const hi = isBefore(dragStart, dragEnd) ? dragEnd : dragStart
      setSelectionStart(lo)
      setSelectionEnd(hi)
    }
    setDragStart(null)
    setDragEnd(null)
  }

  function clearSelection() {
    setSelectionStart(null)
    setSelectionEnd(null)
    setDragStart(null)
    setDragEnd(null)
  }

  // Visual: which cells are highlighted during drag or after selection
  const activeDragRange = getDragRange()
  const activeSelectionRange = getOrderedRange()
  const hasSelection = !!activeSelectionRange

  function isDayHighlighted(day: Date): boolean {
    if (isDraggingRef.current && activeDragRange) {
      return isInRange(day, activeDragRange.start, activeDragRange.end)
    }
    if (activeSelectionRange) {
      return isInRange(day, activeSelectionRange.start, activeSelectionRange.end)
    }
    return false
  }

  // Selection label
  const selectionLabel = activeSelectionRange
    ? isSameDay(activeSelectionRange.start, activeSelectionRange.end)
      ? format(activeSelectionRange.start, "MMM d, yyyy")
      : `${format(activeSelectionRange.start, "MMM d")} – ${format(activeSelectionRange.end, "MMM d, yyyy")} (${differenceInDays(activeSelectionRange.end, activeSelectionRange.start) + 1} days)`
    : ""

  // Actions
  function handleBlockConfirm(reason: string) {
    const range = getOrderedRange()
    if (!range) return
    const newBlock: AvailabilityBlock = {
      id: `ab-local-${Date.now()}`,
      roomId: selectedRoomId,
      startDate: format(range.start, "yyyy-MM-dd"),
      endDate: format(range.end, "yyyy-MM-dd"),
      reason,
    }
    setLocalBlocks((prev) => [...prev, newBlock])
    setBlockDialogOpen(false)
    clearSelection()
    toast.success("Dates blocked successfully")
  }

  function handleManualBookingConfirm(data: {
    guestName: string
    phone: string
    sourcePlatform: string
    checkinDate: string
    checkoutDate: string
    guestCount: number
    notes?: string
  }) {
    const code = `DHARA-M${Math.random().toString(36).slice(2, 6).toUpperCase()}`
    const newBooking: MockBooking = {
      id: `b-manual-${Date.now()}`,
      bookingCode: code,
      guestId: "manual",
      roomId: selectedRoomId,
      facilityId: selectedFacilityId,
      facilityName: selectedFacility?.name ?? "",
      facilitySlug: selectedFacility?.slug ?? "",
      facilityImage: selectedFacility?.coverImageUrl ?? "",
      facilityLocation: selectedFacility?.location ?? "",
      roomName:
        selectedFacility?.rooms.find((r) => r.id === selectedRoomId)?.name ??
        "",
      checkinDate: data.checkinDate,
      checkoutDate: data.checkoutDate,
      guestCount: data.guestCount,
      mealIncluded: false,
      roomRate: 0,
      mealCharge: 0,
      platformFee: 0,
      taxAmount: 0,
      totalAmount: 0,
      paymentStatus: "pending",
      paymentMethod: "cash",
      status: "upcoming",
      specialRequests: data.notes || null,
      impactLine: "",
      source: "manual",
      sourcePlatform: data.sourcePlatform,
      createdAt: new Date().toISOString(),
    }
    setLocalBookings((prev) => [...prev, newBooking])
    setManualBookingOpen(false)
    clearSelection()
    toast.success(`Manual booking created: ${code}`)
  }

  const selectedRoom = selectedFacility?.rooms.find(
    (r) => r.id === selectedRoomId
  )

  return (
    <div className="space-y-6">
      <PageHeader
        title="Calendar"
        description={
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="h-4 w-4 text-primary" />
            Manage room availability. Block dates or add manual bookings from
            outside platforms.
          </span>
        }
      />

      <div className="flex flex-wrap items-center gap-4">
        <div className="w-56">
          <Select
            value={selectedFacilityId}
            onValueChange={handleFacilityChange}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select facility" />
            </SelectTrigger>
            <SelectContent>
              {mockFacilities.map((f) => (
                <SelectItem key={f.id} value={f.id}>
                  {f.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {selectedFacility && (
          <div className="w-48">
            <Select value={selectedRoomId} onValueChange={setSelectedRoomId}>
              <SelectTrigger>
                <SelectValue placeholder="Select room" />
              </SelectTrigger>
              <SelectContent>
                {selectedFacility.rooms.map((room) => (
                  <SelectItem key={room.id} value={room.id}>
                    {room.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

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
          <span>Booked (Platform)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="h-3 w-3 rounded bg-primary/15 border border-primary/30" />
          <span>Booked (Manual)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="h-3 w-3 rounded bg-muted border border-border" />
          <span>Past</span>
        </div>
      </div>

      {/* Selection action bar */}
      {hasSelection && (
        <div className="flex flex-wrap items-center gap-3 rounded-lg border bg-card p-3 shadow-sm">
          <Badge variant="outline" className="text-sm font-medium">
            {selectionLabel}
          </Badge>
          <div className="flex items-center gap-2 ml-auto">
            <Button
              size="sm"
              variant="destructive"
              onClick={() => setBlockDialogOpen(true)}
              disabled={!canAct}
              title={!canAct ? "You don't have permission to perform this action" : undefined}
            >
              <Ban className="mr-1.5 h-3.5 w-3.5" />
              Block Dates
            </Button>
            <Button
              size="sm"
              onClick={() => setManualBookingOpen(true)}
              disabled={!canAct}
              title={!canAct ? "You don't have permission to perform this action" : undefined}
            >
              <Plus className="mr-1.5 h-3.5 w-3.5" />
              Manual Booking
            </Button>
            <Button size="sm" variant="ghost" onClick={clearSelection}>
              <X className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      )}

      {/* Calendar grid */}
      {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions */}
      <div
        className="rounded-lg border bg-card overflow-hidden select-none"
        onMouseLeave={() => {
          if (isDraggingRef.current) handleMouseUp()
        }}
        onMouseUp={handleMouseUp}
      >
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

        <div className="grid grid-cols-7">
          {Array.from({ length: startPadding }).map((_, i) => (
            <div
              key={`pad-${i}`}
              className="border-b border-r p-2 min-h-[72px]"
            />
          ))}

          {days.map((day) => {
            const past = isPast(day)
            const blocked = !past && isBlocked(day)
            const booking = !past && !blocked ? getBooking(day) : undefined
            const booked = !!booking
            const isManual = booking?.source === "manual"
            const available = !past && !blocked && !booked
            const highlighted = isDayHighlighted(day) && available

            return (
              <div
                key={day.toISOString()}
                role="gridcell"
                onMouseDown={(e) => {
                  e.preventDefault()
                  handleMouseDown(day)
                }}
                onMouseEnter={() => handleMouseEnter(day)}
                className={cn(
                  "relative border-b border-r p-2 text-left min-h-[72px] transition-colors",
                  past && "bg-muted text-muted-foreground",
                  blocked && "bg-destructive/15 text-destructive",
                  booked && !isManual && "bg-info/15 text-info-foreground",
                  booked && isManual && "bg-primary/15 text-primary",
                  available &&
                    !highlighted &&
                    "bg-success/10 hover:bg-success/20 cursor-pointer",
                  highlighted &&
                    "bg-primary/20 ring-2 ring-inset ring-primary/40 cursor-pointer",
                  (past || blocked || booked) && "cursor-default"
                )}
              >
                <span className="text-sm font-medium">{format(day, "d")}</span>
                {blocked && (
                  <span className="mt-0.5 block text-[10px] font-medium leading-tight">
                    Blocked
                  </span>
                )}
                {booked && !isManual && (
                  <span className="mt-0.5 block text-[10px] font-medium leading-tight">
                    Booked
                  </span>
                )}
                {booked && isManual && (
                  <span className="mt-0.5 block text-[10px] font-medium leading-tight">
                    Manual
                  </span>
                )}
                {isSameDay(day, today) && (
                  <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-primary" />
                )}
              </div>
            )
          })}
        </div>
      </div>

      <p className="text-xs text-muted-foreground">
        Click a date or drag across multiple dates to select a range, then
        choose to block or add a manual booking.
      </p>

      <BlockDateDialog
        open={blockDialogOpen}
        onOpenChange={(open) => {
          setBlockDialogOpen(open)
          if (!open) clearSelection()
        }}
        startDate={activeSelectionRange?.start ?? null}
        endDate={activeSelectionRange?.end ?? null}
        onConfirm={handleBlockConfirm}
      />

      <ManualBookingDialog
        open={manualBookingOpen}
        onOpenChange={(open) => {
          setManualBookingOpen(open)
          if (!open) clearSelection()
        }}
        defaultCheckinDate={activeSelectionRange?.start ?? null}
        defaultCheckoutDate={activeSelectionRange?.end ?? null}
        roomName={selectedRoom?.name ?? "Room"}
        onConfirm={handleManualBookingConfirm}
      />
    </div>
  )
}
