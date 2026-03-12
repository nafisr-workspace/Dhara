"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CalendarDays, Users, Check, X } from "lucide-react"
import { format, parseISO } from "date-fns"
import { StarRating } from "@/components/shared/star-rating"
import { type MockMessage, mockGuestProfiles } from "@/lib/mock-data"

interface BookingRequestMessageProps {
  message: MockMessage
  onApprove: (bookingId: string) => void
  onDecline: (bookingId: string) => void
  actionsDisabled?: boolean
}

export function BookingRequestMessage({
  message,
  onApprove,
  onDecline,
  actionsDisabled,
}: BookingRequestMessageProps) {
  const data = message.bookingRequestData
  if (!data) return null

  const isPending = data.status === "pending"
  const isApproved = data.status === "approved"
  const isDeclined = data.status === "declined"

  return (
    <div className="flex flex-col items-center gap-1 w-full">
      <p className="text-[10px] font-medium text-muted-foreground">
        {message.senderName}
      </p>
      <Card className="w-full max-w-[90%] border-amber-200 bg-amber-50/50 dark:border-amber-800 dark:bg-amber-950/20">
        <CardContent className="p-4 space-y-3">
          <div className="flex items-center gap-2">
            <Badge className="bg-amber-100 text-amber-800 border-transparent dark:bg-amber-900/40 dark:text-amber-400">
              Booking Request
            </Badge>
          </div>

          <div className="space-y-1.5 text-sm">
            <div className="flex items-center gap-2">
              <p className="font-semibold">{data.guestName}</p>
              {(() => {
                const guestEntry = Object.values(mockGuestProfiles).find(g => g.fullName === data.guestName)
                if (!guestEntry || guestEntry.reviewCount === 0) return null
                return <StarRating rating={guestEntry.rating} reviewCount={guestEntry.reviewCount} size="sm" />
              })()}
            </div>
            <p className="text-muted-foreground">{data.roomName}</p>
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <CalendarDays className="h-3 w-3" />
                {format(parseISO(data.checkinDate), "MMM d")} – {format(parseISO(data.checkoutDate), "MMM d, yyyy")}
              </span>
              <span className="flex items-center gap-1">
                <Users className="h-3 w-3" />
                {data.guestCount} guest{data.guestCount > 1 ? "s" : ""}
              </span>
            </div>
            <p className="text-sm font-semibold">৳{data.totalAmount.toLocaleString()}</p>
          </div>

          {isPending && (
            <div className="flex gap-2 pt-1">
              <Button
                size="sm"
                className="flex-1 bg-success text-white hover:bg-success/90"
                onClick={() => onApprove(data.bookingId)}
                disabled={actionsDisabled}
                title={actionsDisabled ? "You don't have permission to perform this action" : undefined}
              >
                <Check className="mr-1.5 h-3.5 w-3.5" />
                Approve
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="flex-1 border-destructive/50 text-destructive hover:bg-destructive/10"
                onClick={() => onDecline(data.bookingId)}
                disabled={actionsDisabled}
                title={actionsDisabled ? "You don't have permission to perform this action" : undefined}
              >
                <X className="mr-1.5 h-3.5 w-3.5" />
                Decline
              </Button>
            </div>
          )}

          {isApproved && (
            <Badge className="bg-success/15 text-success-foreground border-transparent">
              Approved
            </Badge>
          )}

          {isDeclined && (
            <Badge variant="destructive">Declined</Badge>
          )}
        </CardContent>
      </Card>
      <p className="text-[10px] text-muted-foreground">
        {format(new Date(message.createdAt), "MMM d, h:mm a")}
      </p>
    </div>
  )
}
