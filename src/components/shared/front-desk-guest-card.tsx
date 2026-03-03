"use client"

import { LogIn, LogOut, User, MessageSquare, Phone, Mail, Copy } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { BookingStatusBadge } from "@/components/shared/booking-status-badge"
import { StarRating } from "@/components/shared/star-rating"
import { cn } from "@/lib/utils"
import {
  type BookingStatus,
  type PaymentStatus,
  type PaymentMethod,
} from "@/lib/mock-data"
import { toast } from "sonner"

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase()
}

export interface FrontDeskGuestCardProps {
  guestName: string
  guestEmail: string
  guestPhone: string
  guestRating: number
  guestReviewCount: number
  roomName: string
  bookingCode: string
  status: BookingStatus
  paymentStatus: PaymentStatus
  paymentMethod: PaymentMethod | null
  totalAmount: number
  type: "arrival" | "departure"
  onAction: () => void
  onViewProfile: () => void
  onOpenChat: () => void
  className?: string
}

export function FrontDeskGuestCard({
  guestName,
  guestEmail,
  guestPhone,
  guestRating,
  guestReviewCount,
  roomName,
  bookingCode,
  status,
  paymentStatus,
  paymentMethod,
  totalAmount,
  type,
  onAction,
  onViewProfile,
  onOpenChat,
  className,
}: FrontDeskGuestCardProps) {
  const isArrival = type === "arrival"
  const showCashWarning = paymentMethod === "cash" && paymentStatus === "cash_pending"

  function copyToClipboard(text: string, label: string) {
    navigator.clipboard.writeText(text).then(() => {
      toast.success(`${label} copied to clipboard`)
    })
  }

  return (
    <TooltipProvider delayDuration={300}>
      <Card className={cn("overflow-hidden", className)}>
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <Avatar className="h-10 w-10 shrink-0 mt-0.5">
              <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
                {getInitials(guestName)}
              </AvatarFallback>
            </Avatar>

            <div className="min-w-0 flex-1 space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-sm font-semibold leading-snug">{guestName}</h3>
                {guestReviewCount > 0 && (
                  <StarRating rating={guestRating} reviewCount={guestReviewCount} size="sm" />
                )}
                <BookingStatusBadge status={status} />
              </div>

              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span>{roomName}</span>
                <span className="text-border">|</span>
                <span className="font-mono tracking-wide">{bookingCode}</span>
              </div>

              <div className="flex items-center gap-3 pt-1">
                <div className="flex items-center gap-1.5">
                  <span className="text-sm font-semibold">৳{totalAmount.toLocaleString()}</span>
                  {showCashWarning && (
                    <Badge className="border-transparent bg-warning/15 text-warning-foreground hover:bg-warning/20 text-[10px] px-1.5 py-0">
                      Cash Due
                    </Badge>
                  )}
                </div>

                <div className="flex items-center gap-0.5 ml-auto">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7"
                        onClick={onViewProfile}
                      >
                        <User className="h-3.5 w-3.5" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>View Profile</TooltipContent>
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7"
                        onClick={onOpenChat}
                      >
                        <MessageSquare className="h-3.5 w-3.5" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Chat with Guest</TooltipContent>
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() => copyToClipboard(guestPhone, "Phone")}
                      >
                        <Phone className="h-3.5 w-3.5" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <span className="flex items-center gap-1">
                        <Copy className="h-3 w-3" /> Copy Phone
                      </span>
                    </TooltipContent>
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() => copyToClipboard(guestEmail, "Email")}
                      >
                        <Mail className="h-3.5 w-3.5" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <span className="flex items-center gap-1">
                        <Copy className="h-3 w-3" /> Copy Email
                      </span>
                    </TooltipContent>
                  </Tooltip>
                </div>
              </div>
            </div>

            <Button
              size="sm"
              className={cn("min-h-[36px] min-w-[100px] shrink-0 self-center", {
                "bg-success text-white hover:bg-success/90": isArrival,
                "bg-accent text-accent-foreground hover:bg-accent/90": !isArrival,
              })}
              onClick={onAction}
            >
              {isArrival ? (
                <>
                  <LogIn className="mr-1.5 h-3.5 w-3.5" />
                  Check In
                </>
              ) : (
                <>
                  <LogOut className="mr-1.5 h-3.5 w-3.5" />
                  Check Out
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </TooltipProvider>
  )
}
