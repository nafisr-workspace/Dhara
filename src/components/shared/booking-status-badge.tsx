import * as React from "react"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

export type BookingStatus =
  | "upcoming"
  | "checked_in"
  | "completed"
  | "cancelled"
  | "cash_pending"

const statusConfig: Record<BookingStatus, { label: string; className: string }> = {
  upcoming: { label: "Upcoming", className: "bg-info/15 text-info-foreground hover:bg-info/20" },
  checked_in: { label: "Checked In", className: "bg-success/15 text-success-foreground hover:bg-success/20" },
  completed: { label: "Completed", className: "bg-muted text-muted-foreground hover:bg-muted" },
  cancelled: { label: "Cancelled", className: "bg-destructive/15 text-destructive hover:bg-destructive/20" },
  cash_pending: { label: "Cash Pending", className: "bg-warning/15 text-warning-foreground hover:bg-warning/20" },
}

export interface BookingStatusBadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  status: BookingStatus
}

export function BookingStatusBadge({ status, className, ...props }: BookingStatusBadgeProps) {
  const config = statusConfig[status]

  return (
    <Badge
      variant="secondary"
      className={cn("border-transparent font-medium", config.className, className)}
      {...props}
    >
      {config.label}
    </Badge>
  )
}
