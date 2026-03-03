"use client"

import { format } from "date-fns"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { StarRating } from "@/components/shared/star-rating"
import { type MockUserProfile, mockGuestReviews } from "@/lib/mock-data"

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase()
}

function accountTypeLabel(type: string): string {
  const labels: Record<string, string> = {
    bkash: "bKash",
    nagad: "Nagad",
    bank: "Bank Account",
  }
  return labels[type] ?? type
}

interface GuestProfileSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  guest: MockUserProfile | null
  bookingDetails?: {
    roomName: string
    bookingCode: string
    checkinDate: string
    checkoutDate: string
    specialRequests: string | null
    totalAmount: number
  }
}

export function GuestProfileSheet({
  open,
  onOpenChange,
  guest,
  bookingDetails,
}: GuestProfileSheetProps) {
  if (!guest) return null

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-md overflow-y-auto">
        <SheetHeader className="pb-4">
          <SheetTitle className="font-heading text-xl">Guest Profile</SheetTitle>
        </SheetHeader>

        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarFallback className="bg-primary/10 text-primary text-lg font-semibold">
                {getInitials(guest.fullName)}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="text-lg font-semibold">{guest.fullName}</h3>
              <p className="text-sm text-muted-foreground">{guest.email}</p>
              <p className="text-sm text-muted-foreground">{guest.phone}</p>
              {guest.reviewCount > 0 && (
                <StarRating rating={guest.rating} reviewCount={guest.reviewCount} size="sm" className="mt-1" />
              )}
            </div>
          </div>

          <Separator />

          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-lg border p-3 text-center">
              <p className="text-2xl font-bold">{guest.totalBookings}</p>
              <p className="text-xs text-muted-foreground">Total Bookings</p>
            </div>
            <div className="rounded-lg border p-3 text-center">
              <p className="text-2xl font-bold">{guest.totalNights}</p>
              <p className="text-xs text-muted-foreground">Total Nights</p>
            </div>
          </div>

          {guest.linkedAccount && (
            <>
              <Separator />
              <div>
                <h4 className="text-sm font-semibold mb-2">Linked Payment Account</h4>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">{accountTypeLabel(guest.linkedAccount.type)}</Badge>
                  <span className="font-mono text-sm text-muted-foreground">
                    {guest.linkedAccount.accountNumberMasked}
                  </span>
                </div>
              </div>
            </>
          )}

          {bookingDetails && (
            <>
              <Separator />
              <div>
                <h4 className="text-sm font-semibold mb-3">Current Booking</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Room</span>
                    <span className="font-medium">{bookingDetails.roomName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Code</span>
                    <span className="font-mono text-xs">{bookingDetails.bookingCode}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Check-in</span>
                    <span>{bookingDetails.checkinDate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Check-out</span>
                    <span>{bookingDetails.checkoutDate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Total</span>
                    <span className="font-semibold">৳{bookingDetails.totalAmount.toLocaleString()}</span>
                  </div>
                  {bookingDetails.specialRequests && (
                    <div className="pt-2">
                      <p className="text-muted-foreground mb-1">Special Requests</p>
                      <p className="rounded-md bg-muted/50 p-2 text-sm">{bookingDetails.specialRequests}</p>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}

          {(() => {
            const reviews = mockGuestReviews.filter(r => r.targetId === guest.id)
            if (reviews.length === 0) return null
            return (
              <>
                <Separator />
                <div>
                  <h4 className="text-sm font-semibold mb-3">Past Reviews from Operators</h4>
                  <div className="space-y-4">
                    {reviews.map((review) => (
                      <div key={review.id} className="rounded-md border p-3">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-medium">{review.reviewerName}</span>
                          <StarRating rating={review.rating} showCount={false} size="sm" />
                        </div>
                        <p className="text-sm text-muted-foreground leading-relaxed">{review.comment}</p>
                        <p className="mt-1 text-xs text-muted-foreground/60">
                          {format(new Date(review.createdAt), "MMM d, yyyy")}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )
          })()}
        </div>
      </SheetContent>
    </Sheet>
  )
}
