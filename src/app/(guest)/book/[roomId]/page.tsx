"use client"

import React, { useState } from "react"
import { useRouter } from "next/navigation"
import { StepProgress } from "@/components/shared/step-progress"
import { PriceBreakdown } from "@/components/shared/price-breakdown"
import { PaymentMethodCard } from "@/components/shared/payment-method-card"
import { ImpactLine } from "@/components/shared/impact-line"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"
import { mockFacilities, mockGuestProfile } from "@/lib/mock-data"
import { format } from "date-fns"
import {
  CreditCard,
  Smartphone,
  Banknote,
  ArrowLeft,
  ArrowRight,
} from "lucide-react"

const STEP_LABELS = ["Review", "Details", "Payment"]

type PaymentMethod = "bkash" | "nagad" | "card" | "cash"

export default function BookingFlowPage({
  params,
  searchParams,
}: {
  params: Promise<{ roomId: string }>
  searchParams: Promise<{ checkin?: string; checkout?: string }>
}) {
  const resolvedParams = React.use(params)
  const resolvedSearchParams = React.use(searchParams)
  const router = useRouter()

  const [step, setStep] = useState(1)
  const [includeMeals, setIncludeMeals] = useState(false)
  const [guestName, setGuestName] = useState(mockGuestProfile.fullName)
  const [guestPhone, setGuestPhone] = useState(mockGuestProfile.phone)
  const [idType, setIdType] = useState<string>("nid")
  const [specialRequests, setSpecialRequests] = useState("")
  const [selectedPayment, setSelectedPayment] = useState<PaymentMethod | null>(null)
  const [showPolicy, setShowPolicy] = useState(false)

  const { roomId } = resolvedParams
  const checkinStr = resolvedSearchParams.checkin ?? ""
  const checkoutStr = resolvedSearchParams.checkout ?? ""

  let room = null
  let facility = null
  for (const f of mockFacilities) {
    const found = f.rooms.find((r) => r.id === roomId)
    if (found) {
      room = found
      facility = f
      break
    }
  }

  if (!room || !facility) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="pt-6 text-center">
            <p className="text-lg font-medium">Room not found</p>
            <p className="mt-2 text-sm text-muted-foreground">
              The room you&apos;re looking for doesn&apos;t exist or has been removed.
            </p>
            <Button className="mt-4" onClick={() => router.push("/discover")}>
              Browse Places
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const checkinDate = checkinStr ? new Date(checkinStr) : new Date()
  const checkoutDate = checkoutStr
    ? new Date(checkoutStr)
    : new Date(Date.now() + 86400000 * 2)

  const nights = Math.max(
    1,
    Math.ceil(
      (checkoutDate.getTime() - checkinDate.getTime()) / 86400000
    )
  )

  const roomTotal = room.price_public * nights
  const mealCharge = includeMeals ? room.meal_addon_price * nights : 0
  const subtotal = roomTotal + mealCharge
  const platformFee = Math.round(subtotal * 0.08)
  const taxAmount = Math.round((subtotal + platformFee) * 0.05)
  const totalAmount = subtotal + platformFee + taxAmount

  function handleConfirm() {
    router.push(`/book/${roomId}/confirm?checkin=${checkinStr}&checkout=${checkoutStr}`)
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 md:px-8">
      <StepProgress
        currentStep={step}
        totalSteps={3}
        labels={STEP_LABELS}
        className="mb-8"
      />

      {/* ───── Step 1: Review & Confirm ───── */}
      {step === 1 && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="font-heading text-xl">
                Review Your Stay
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Facility</p>
                <p className="font-medium">{facility.name}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Room</p>
                  <p className="font-medium">{room.name}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Type</p>
                  <p className="font-medium capitalize">{room.type}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Capacity</p>
                  <p className="font-medium">
                    {room.capacity} {room.capacity === 1 ? "guest" : "guests"}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Nights</p>
                  <p className="font-medium">{nights}</p>
                </div>
              </div>
              <Separator />
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Check-in</p>
                  <p className="font-medium">
                    {format(checkinDate, "EEE, MMM d, yyyy")}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Check-out</p>
                  <p className="font-medium">
                    {format(checkoutDate, "EEE, MMM d, yyyy")}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {room.meal_addon_price > 0 && (
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <Checkbox
                    id="meals"
                    checked={includeMeals}
                    onCheckedChange={(checked) =>
                      setIncludeMeals(checked === true)
                    }
                  />
                  <div className="space-y-1">
                    <Label htmlFor="meals" className="cursor-pointer font-medium">
                      Include meals
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      ৳{room.meal_addon_price}/night — home-cooked local meals
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardContent className="pt-6">
              <button
                type="button"
                className="flex w-full items-center justify-between text-left"
                onClick={() => setShowPolicy(!showPolicy)}
              >
                <span className="text-sm font-medium">Cancellation Policy</span>
                <ArrowRight
                  className={`h-4 w-4 text-muted-foreground transition-transform ${
                    showPolicy ? "rotate-90" : ""
                  }`}
                />
              </button>
              {showPolicy && (
                <div className="mt-3 rounded-md bg-muted/50 p-3 text-sm text-muted-foreground">
                  <p>
                    <strong>Free cancellation</strong> up to 48 hours before
                    check-in. After that, the first night is non-refundable.
                    No-shows are charged the full amount.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Price Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <PriceBreakdown
                roomRate={room.price_public}
                nights={nights}
                mealCharge={mealCharge}
                platformFee={platformFee}
                taxAmount={taxAmount}
                totalAmount={totalAmount}
              />
            </CardContent>
          </Card>

          <ImpactLine text={facility.impactLine} />

          <Button className="w-full" size="lg" onClick={() => setStep(2)}>
            Proceed to Payment
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      )}

      {/* ───── Step 2: Guest Details ───── */}
      {step === 2 && (
        <div className="space-y-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setStep(1)}
            className="mb-2"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>

          <Card>
            <CardHeader>
              <CardTitle className="font-heading text-xl">
                Guest Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="guest-name">Full Name</Label>
                <Input
                  id="guest-name"
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="guest-phone">Phone Number</Label>
                <Input
                  id="guest-phone"
                  value={guestPhone}
                  onChange={(e) => setGuestPhone(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="id-type">ID Type</Label>
                <Select value={idType} onValueChange={setIdType}>
                  <SelectTrigger id="id-type">
                    <SelectValue placeholder="Select ID type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="nid">National ID (NID)</SelectItem>
                    <SelectItem value="passport">Passport</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="special-requests">
                  Special Requests{" "}
                  <span className="text-muted-foreground">(optional)</span>
                </Label>
                <Textarea
                  id="special-requests"
                  value={specialRequests}
                  onChange={(e) => setSpecialRequests(e.target.value)}
                  placeholder="Any dietary needs, accessibility requirements, arrival time..."
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          <Button
            className="w-full"
            size="lg"
            onClick={() => setStep(3)}
            disabled={!guestName.trim() || !guestPhone.trim()}
          >
            Continue
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      )}

      {/* ───── Step 3: Payment ───── */}
      {step === 3 && (
        <div className="space-y-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setStep(2)}
            className="mb-2"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>

          <Card>
            <CardHeader>
              <CardTitle className="font-heading text-xl">
                Choose Payment Method
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <PaymentMethodCard
                value="bkash"
                label="bKash"
                description="Pay via bKash mobile wallet"
                icon={<Smartphone className="h-5 w-5" />}
                isSelected={selectedPayment === "bkash"}
                onSelect={() => setSelectedPayment("bkash")}
              />
              <PaymentMethodCard
                value="nagad"
                label="Nagad"
                description="Pay via Nagad mobile wallet"
                icon={<Smartphone className="h-5 w-5" />}
                isSelected={selectedPayment === "nagad"}
                onSelect={() => setSelectedPayment("nagad")}
              />
              <PaymentMethodCard
                value="card"
                label="Credit / Debit Card"
                description="Visa, Mastercard, AMEX"
                icon={<CreditCard className="h-5 w-5" />}
                isSelected={selectedPayment === "card"}
                onSelect={() => setSelectedPayment("card")}
              />
              <PaymentMethodCard
                value="cash"
                label="Cash on Arrival"
                description="Pay at the front desk during check-in"
                icon={<Banknote className="h-5 w-5" />}
                isSelected={selectedPayment === "cash"}
                onSelect={() => setSelectedPayment("cash")}
              />
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex items-center justify-between pt-6">
              <span className="text-sm text-muted-foreground">Total</span>
              <span className="text-xl font-semibold">
                ৳{totalAmount.toLocaleString("en-BD")}
              </span>
            </CardContent>
          </Card>

          <Button
            className="w-full"
            size="lg"
            disabled={!selectedPayment}
            onClick={handleConfirm}
          >
            {selectedPayment === "cash" ? "Confirm Booking" : "Confirm & Pay"}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  )
}
