import * as React from "react"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"

export interface PriceBreakdownProps extends React.HTMLAttributes<HTMLDivElement> {
  roomRate: number
  nights: number
  mealCharge: number
  platformFee: number
  taxAmount: number
  totalAmount: number
}

function formatBDT(amount: number): string {
  return `৳${amount.toLocaleString("en-BD")}`
}

export function PriceBreakdown({
  roomRate,
  nights,
  mealCharge,
  platformFee,
  taxAmount,
  totalAmount,
  className,
  ...props
}: PriceBreakdownProps) {
  const lineItems = [
    { label: `Room (${formatBDT(roomRate)} × ${nights} night${nights > 1 ? "s" : ""})`, amount: roomRate * nights },
    { label: "Meals", amount: mealCharge },
    { label: "Platform fee", amount: platformFee },
    { label: "Tax", amount: taxAmount },
  ]

  return (
    <div className={cn("space-y-3 text-sm", className)} {...props}>
      {lineItems.map((item) => (
        <div key={item.label} className="flex items-center justify-between">
          <span className="text-muted-foreground">{item.label}</span>
          <span>{formatBDT(item.amount)}</span>
        </div>
      ))}
      <Separator />
      <div className="flex items-center justify-between font-semibold text-base">
        <span>Total</span>
        <span>{formatBDT(totalAmount)}</span>
      </div>
    </div>
  )
}
