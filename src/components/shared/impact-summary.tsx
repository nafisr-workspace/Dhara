import * as React from "react"
import { Leaf } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

export interface ImpactSummaryProps extends React.HTMLAttributes<HTMLDivElement> {
  causeText: string
  impactLine: string
}

export function ImpactSummary({ causeText, impactLine, className, ...props }: ImpactSummaryProps) {
  return (
    <Card className={cn("border-l-4 border-l-secondary", className)} {...props}>
      <CardContent className="flex gap-4 p-5">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-secondary/10">
          <Leaf className="h-5 w-5 text-secondary" />
        </div>
        <div className="space-y-1">
          <p className="text-sm font-medium text-foreground">{impactLine}</p>
          <p className="text-sm text-muted-foreground">{causeText}</p>
        </div>
      </CardContent>
    </Card>
  )
}
