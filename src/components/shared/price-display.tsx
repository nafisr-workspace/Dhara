import * as React from "react"
import { cn } from "@/lib/utils"

export interface PriceDisplayProps extends React.HTMLAttributes<HTMLDivElement> {
  amount: number
  period?: string
  size?: "sm" | "lg"
}

export function PriceDisplay({ amount, period, size = "sm", className, ...props }: PriceDisplayProps) {
  const formattedAmount = new Intl.NumberFormat("en-BD", {
    style: "currency",
    currency: "BDT",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)

  // Replace default BDT symbol with local ৳
  const displayAmount = formattedAmount.replace("BDT", "৳").trim()

  return (
    <div className={cn("flex items-baseline gap-1", className)} {...props}>
      <span className={cn("font-semibold", size === "lg" ? "text-3xl" : "text-lg")}>
        {displayAmount}
      </span>
      {period && (
        <span className={cn("text-muted-foreground", size === "lg" ? "text-lg" : "text-sm")}>
          {period}
        </span>
      )}
    </div>
  )
}
