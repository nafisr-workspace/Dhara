"use client"

import * as React from "react"
import { Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

export interface LoadingSpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: number
}

export function LoadingSpinner({ size = 24, className, ...props }: LoadingSpinnerProps) {
  return (
    <div className={cn("flex items-center justify-center p-4", className)} {...props}>
      <Loader2 className="animate-spin text-primary" size={size} />
      <span className="sr-only">Loading...</span>
    </div>
  )
}
