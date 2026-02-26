import * as React from "react"
import { Leaf } from "lucide-react"
import { cn } from "@/lib/utils"

export interface ImpactLineProps extends React.HTMLAttributes<HTMLDivElement> {
  text: string
}

export function ImpactLine({ text, className, ...props }: ImpactLineProps) {
  return (
    <div className={cn("flex items-center gap-1.5 text-sm text-primary font-medium", className)} {...props}>
      <Leaf className="h-4 w-4 shrink-0" />
      <span>{text}</span>
    </div>
  )
}
