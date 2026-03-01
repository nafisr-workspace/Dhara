import * as React from "react"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

export interface StatsCardProps extends React.HTMLAttributes<HTMLDivElement> {
  label: string
  value: string
  delta?: string
  icon: React.ReactNode
}

export function StatsCard({ label, value, delta, icon, className, ...props }: StatsCardProps) {
  const isPositive = delta?.startsWith("+")
  const isNegative = delta?.startsWith("-")

  return (
    <Card className={cn(className)} {...props}>
      <CardContent className="flex items-start gap-4 p-6">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
          {icon}
        </div>
        <div className="space-y-1">
          <p className="text-2xl font-semibold tracking-tight">{value}</p>
          <p className="text-sm text-muted-foreground">{label}</p>
          {delta && (
            <p
              className={cn(
                "text-xs font-medium",
                isPositive && "text-success-foreground",
                isNegative && "text-destructive",
                !isPositive && !isNegative && "text-muted-foreground"
              )}
            >
              {delta}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
