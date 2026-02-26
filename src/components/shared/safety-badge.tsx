import * as React from "react"
import { Shield, Lock, ShieldCheck, BadgeCheck } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

export type SafetyBadgeType = "women-safe" | "gated" | "security" | "verified"

interface SafetyBadgeProps extends React.ComponentPropsWithoutRef<typeof Badge> {
  type: SafetyBadgeType
}

export function SafetyBadge({ type, className, ...props }: SafetyBadgeProps) {
  const config = {
    "women-safe": { label: "Women Safe", icon: Shield, variant: "secondary" as const },
    "gated": { label: "Gated Compound", icon: Lock, variant: "outline" as const },
    "security": { label: "24/7 Security", icon: ShieldCheck, variant: "outline" as const },
    "verified": { label: "Verified NGO", icon: BadgeCheck, variant: "default" as const },
  }

  const { label, icon: Icon, variant } = config[type]

  return (
    <Badge variant={variant} className={cn("gap-1 font-normal", className)} {...props}>
      <Icon className="h-3 w-3" />
      {label}
    </Badge>
  )
}
