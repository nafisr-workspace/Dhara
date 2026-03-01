"use client"

import React, { useState, useMemo } from "react"
import { PageHeader } from "@/components/layout/page-header"
import { FrontDeskGuestCard } from "@/components/shared/front-desk-guest-card"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { mockBookings, mockFacilities } from "@/lib/mock-data"
import { format } from "date-fns"
import { Search, Calendar } from "lucide-react"

type GuestEntry = {
  id: string
  guestName: string
  phone: string
  roomName: string
  bookingCode: string
  status: "upcoming" | "checked_in" | "completed" | "cancelled"
  paymentStatus: "pending" | "paid" | "refunded" | "cash_pending"
  paymentMethod: "bkash" | "nagad" | "card" | "cash" | null
  totalAmount: number
  facilityId: string
}

const guestNames: Record<string, string> = {
  "u-guest-1": "Nadia Rahman",
  "u-guest-2": "Arif Khan",
  "u-guest-3": "Sabrina Chowdhury",
}

const guestPhones: Record<string, string> = {
  "u-guest-1": "01712-345678",
  "u-guest-2": "01819-876543",
  "u-guest-3": "01655-112233",
}

function buildEntries(): { arrivals: GuestEntry[]; departures: GuestEntry[] } {
  const arrivals: GuestEntry[] = mockBookings
    .filter((b) => b.status === "upcoming")
    .slice(0, 3)
    .map((b) => ({
      id: b.id,
      guestName: guestNames[b.guestId] ?? "Guest",
      phone: guestPhones[b.guestId] ?? "01700-000000",
      roomName: b.roomName,
      bookingCode: b.bookingCode,
      status: b.status,
      paymentStatus: b.paymentStatus,
      paymentMethod: b.paymentMethod,
      totalAmount: b.totalAmount,
      facilityId: b.facilityId,
    }))

  const departures: GuestEntry[] = mockBookings
    .filter((b) => b.status === "checked_in")
    .map((b) => ({
      id: b.id,
      guestName: guestNames[b.guestId] ?? "Guest",
      phone: guestPhones[b.guestId] ?? "01700-000000",
      roomName: b.roomName,
      bookingCode: b.bookingCode,
      status: b.status,
      paymentStatus: b.paymentStatus,
      paymentMethod: b.paymentMethod,
      totalAmount: b.totalAmount,
      facilityId: b.facilityId,
    }))

  return { arrivals, departures }
}

export default function FrontDeskPage() {
  const today = new Date()
  const [selectedFacility, setSelectedFacility] = useState<string>("all")
  const [searchQuery, setSearchQuery] = useState("")

  const [checkinDialogOpen, setCheckinDialogOpen] = useState(false)
  const [checkoutDialogOpen, setCheckoutDialogOpen] = useState(false)
  const [selectedGuest, setSelectedGuest] = useState<GuestEntry | null>(null)
  const [idVerified, setIdVerified] = useState(false)
  const [cashCollected, setCashCollected] = useState(false)

  const facilities = mockFacilities.slice(0, 2)
  const { arrivals, departures } = useMemo(() => buildEntries(), [])

  const filteredArrivals = useMemo(() => {
    return arrivals.filter((a) => {
      const matchesFacility =
        selectedFacility === "all" || a.facilityId === selectedFacility
      const q = searchQuery.toLowerCase()
      const matchesSearch =
        !q ||
        a.guestName.toLowerCase().includes(q) ||
        a.phone.includes(q) ||
        a.bookingCode.toLowerCase().includes(q)
      return matchesFacility && matchesSearch
    })
  }, [arrivals, selectedFacility, searchQuery])

  const filteredDepartures = useMemo(() => {
    return departures.filter((d) => {
      const matchesFacility =
        selectedFacility === "all" || d.facilityId === selectedFacility
      const q = searchQuery.toLowerCase()
      const matchesSearch =
        !q ||
        d.guestName.toLowerCase().includes(q) ||
        d.phone.includes(q) ||
        d.bookingCode.toLowerCase().includes(q)
      return matchesFacility && matchesSearch
    })
  }, [departures, selectedFacility, searchQuery])

  function openCheckin(guest: GuestEntry) {
    setSelectedGuest(guest)
    setIdVerified(false)
    setCashCollected(false)
    setCheckinDialogOpen(true)
  }

  function openCheckout(guest: GuestEntry) {
    setSelectedGuest(guest)
    setCheckoutDialogOpen(true)
  }

  function confirmCheckin() {
    setCheckinDialogOpen(false)
    setSelectedGuest(null)
  }

  function confirmCheckout() {
    setCheckoutDialogOpen(false)
    setSelectedGuest(null)
  }

  const needsCashCollection =
    selectedGuest?.paymentMethod === "cash" &&
    selectedGuest?.paymentStatus === "cash_pending"

  const canConfirmCheckin = idVerified && (!needsCashCollection || cashCollected)

  return (
    <div className="space-y-6">
      <PageHeader
        title="Front Desk"
        description={
          <span className="flex items-center gap-2 text-base">
            <Calendar className="h-5 w-5" />
            {format(today, "EEEE, MMMM d, yyyy")}
          </span>
        }
        actions={
          <Select value={selectedFacility} onValueChange={setSelectedFacility}>
            <SelectTrigger className="w-[260px]">
              <SelectValue placeholder="Select facility" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Facilities</SelectItem>
              {facilities.map((f) => (
                <SelectItem key={f.id} value={f.id}>
                  {f.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        }
      />

      {/* Search bar */}
      <div className="relative max-w-lg">
        <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search by guest name, phone, or booking code..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="min-h-[48px] pl-10 text-base"
        />
      </div>

      {/* Two-column layout */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Arrivals */}
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 font-heading text-xl">
              <span className="inline-block h-3 w-3 rounded-full bg-success" />
              Arrivals Today
              <Badge variant="secondary" className="ml-auto text-sm">
                {filteredArrivals.length}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {filteredArrivals.length === 0 ? (
              <p className="py-6 text-center text-muted-foreground">
                No arrivals today
              </p>
            ) : (
              filteredArrivals.map((guest) => (
                <FrontDeskGuestCard
                  key={guest.id}
                  guestName={guest.guestName}
                  roomName={guest.roomName}
                  bookingCode={guest.bookingCode}
                  status={guest.status}
                  paymentStatus={guest.paymentStatus}
                  paymentMethod={guest.paymentMethod}
                  totalAmount={guest.totalAmount}
                  type="arrival"
                  onAction={() => openCheckin(guest)}
                />
              ))
            )}
          </CardContent>
        </Card>

        {/* Departures */}
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 font-heading text-xl">
              <span className="inline-block h-3 w-3 rounded-full bg-accent" />
              Departures Today
              <Badge variant="secondary" className="ml-auto text-sm">
                {filteredDepartures.length}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {filteredDepartures.length === 0 ? (
              <p className="py-6 text-center text-muted-foreground">
                No departures today
              </p>
            ) : (
              filteredDepartures.map((guest) => (
                <FrontDeskGuestCard
                  key={guest.id}
                  guestName={guest.guestName}
                  roomName={guest.roomName}
                  bookingCode={guest.bookingCode}
                  status={guest.status}
                  paymentStatus={guest.paymentStatus}
                  paymentMethod={guest.paymentMethod}
                  totalAmount={guest.totalAmount}
                  type="departure"
                  onAction={() => openCheckout(guest)}
                />
              ))
            )}
          </CardContent>
        </Card>
      </div>

      {/* Check-in Dialog */}
      <Dialog open={checkinDialogOpen} onOpenChange={setCheckinDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-heading text-xl">
              Check In Guest
            </DialogTitle>
          </DialogHeader>

          {selectedGuest && (
            <div className="space-y-5">
              {/* Guest info */}
              <div className="space-y-1">
                <p className="text-lg font-semibold">{selectedGuest.guestName}</p>
                <p className="font-mono text-sm text-muted-foreground">
                  {selectedGuest.bookingCode}
                </p>
                <p className="text-sm text-muted-foreground">
                  {selectedGuest.roomName}
                </p>
              </div>

              {/* ID verification */}
              <div className="rounded-lg border p-4 space-y-3">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-sm">
                    ID Type Required
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    NID or Passport
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <Checkbox
                    id="id-verified"
                    checked={idVerified}
                    onCheckedChange={(checked) =>
                      setIdVerified(checked === true)
                    }
                    className="h-6 w-6"
                  />
                  <Label htmlFor="id-verified" className="text-base cursor-pointer">
                    ID Verified
                  </Label>
                </div>
              </div>

              {/* Cash collection (only for cash bookings) */}
              {needsCashCollection && (
                <div className="rounded-lg border-2 border-warning bg-warning/10 p-4 space-y-3">
                  <div className="text-center">
                    <p className="text-sm font-medium text-warning-foreground">
                      Collect Cash Payment
                    </p>
                    <p className="text-2xl font-bold text-warning-foreground">
                      ৳{selectedGuest.totalAmount.toLocaleString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Checkbox
                      id="cash-collected"
                      checked={cashCollected}
                      onCheckedChange={(checked) =>
                        setCashCollected(checked === true)
                      }
                      className="h-6 w-6"
                    />
                    <Label
                      htmlFor="cash-collected"
                      className="text-base font-medium cursor-pointer"
                    >
                      Cash Collected
                    </Label>
                  </div>
                </div>
              )}
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setCheckinDialogOpen(false)}
              className="min-h-[44px]"
            >
              Cancel
            </Button>
            <Button
              onClick={confirmCheckin}
              disabled={!canConfirmCheckin}
              className="min-h-[44px] bg-success text-white hover:bg-success/90"
            >
              Confirm Check-In
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Check-out Dialog */}
      <Dialog open={checkoutDialogOpen} onOpenChange={setCheckoutDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-heading text-xl">
              Check Out Guest
            </DialogTitle>
          </DialogHeader>

          {selectedGuest && (
            <p className="text-base">
              Check out{" "}
              <span className="font-semibold">{selectedGuest.guestName}</span>{" "}
              from{" "}
              <span className="font-semibold">{selectedGuest.roomName}</span>?
            </p>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setCheckoutDialogOpen(false)}
              className="min-h-[44px]"
            >
              Cancel
            </Button>
            <Button
              onClick={confirmCheckout}
              className="min-h-[44px] bg-accent text-accent-foreground hover:bg-accent/90"
            >
              Confirm Check-Out
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
