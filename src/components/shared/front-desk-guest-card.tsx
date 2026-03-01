"use client"

import { LogIn, LogOut } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { BookingStatusBadge } from "@/components/shared/booking-status-badge"
import { cn } from "@/lib/utils"
import {
  type BookingStatus,
  type PaymentStatus,
  type PaymentMethod,
} from "@/lib/mock-data"

export interface FrontDeskGuestCardProps {
  guestName: string
  roomName: string
  bookingCode: string
  status: BookingStatus
  paymentStatus: PaymentStatus
  paymentMethod: PaymentMethod | null
  totalAmount: number
  type: "arrival" | "departure"
  onAction: () => void
  className?: string
}

export function FrontDeskGuestCard({
  guestName,
  roomName,
  bookingCode,
  status,
  paymentStatus,
  paymentMethod,
  totalAmount,
  type,
  onAction,
  className,
}: FrontDeskGuestCardProps) {
  const isArrival = type === "arrival"
  const showCashWarning = paymentMethod === "cash" && paymentStatus === "cash_pending"

  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardContent className="p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0 space-y-1.5">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-lg font-semibold leading-snug">{guestName}</h3>
              <BookingStatusBadge status={status} />
            </div>

            <p className="text-sm text-muted-foreground">{roomName}</p>

            <p className="font-mono text-xs tracking-wide text-muted-foreground">
              {bookingCode}
            </p>

            <div className="flex items-center gap-2 pt-1">
              <span className="text-sm font-semibold">৳{totalAmount.toLocaleString()}</span>
              {showCashWarning && (
                <Badge className="border-transparent bg-warning/15 text-warning-foreground hover:bg-warning/20">
                  ৳ Cash Due
                </Badge>
              )}
            </div>
          </div>

          <Button
            size="lg"
            className={cn("min-h-[44px] min-w-[140px] shrink-0", {
              "bg-success text-white hover:bg-success/90": isArrival,
              "bg-accent text-accent-foreground hover:bg-accent/90": !isArrival,
            })}
            onClick={onAction}
          >
            {isArrival ? (
              <>
                <LogIn className="mr-2 h-4 w-4" />
                Check In
              </>
            ) : (
              <>
                <LogOut className="mr-2 h-4 w-4" />
                Check Out
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
