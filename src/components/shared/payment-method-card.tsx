"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

export interface PaymentMethodCardProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "onSelect"> {
  value: string
  label: string
  description?: string
  icon: React.ReactNode
  isSelected: boolean
  onSelect: (value: string) => void
}

export function PaymentMethodCard({
  value,
  label,
  description,
  icon,
  isSelected,
  onSelect,
  className,
  ...props
}: PaymentMethodCardProps) {
  return (
    <div
      role="radio"
      aria-checked={isSelected}
      tabIndex={0}
      className={cn(
        "flex cursor-pointer items-center gap-4 rounded-lg border-2 p-4 transition-colors",
        isSelected
          ? "border-primary bg-primary/5 ring-1 ring-primary/20"
          : "border-border hover:border-muted-foreground/40",
        className
      )}
      onClick={() => onSelect(value)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault()
          onSelect(value)
        }
      }}
      {...props}
    >
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
        {icon}
      </div>
      <div className="flex-1">
        <p className="text-sm font-medium">{label}</p>
        {description && <p className="text-xs text-muted-foreground">{description}</p>}
      </div>
      <div
        className={cn(
          "flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors",
          isSelected ? "border-primary bg-primary" : "border-muted-foreground/40"
        )}
      >
        {isSelected && <div className="h-2 w-2 rounded-full bg-primary-foreground" />}
      </div>
    </div>
  )
}
