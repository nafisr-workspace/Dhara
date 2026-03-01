"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Check } from "lucide-react"

export interface StepProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  currentStep: number
  totalSteps: number
  labels?: string[]
}

export function StepProgress({ currentStep, totalSteps, labels, className, ...props }: StepProgressProps) {
  return (
    <div className={cn("flex w-full items-center", className)} {...props}>
      {Array.from({ length: totalSteps }, (_, i) => {
        const step = i + 1
        const isCompleted = step < currentStep
        const isActive = step === currentStep

        return (
          <React.Fragment key={step}>
            <div className="flex flex-col items-center gap-1.5">
              <div
                className={cn(
                  "flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-medium transition-colors",
                  isCompleted && "bg-primary text-primary-foreground",
                  isActive && "bg-primary text-primary-foreground ring-4 ring-primary/20",
                  !isCompleted && !isActive && "border-2 border-muted-foreground/30 text-muted-foreground"
                )}
              >
                {isCompleted ? <Check className="h-4 w-4" /> : step}
              </div>
              {labels?.[i] && (
                <span
                  className={cn(
                    "text-xs whitespace-nowrap",
                    isCompleted || isActive ? "font-medium text-foreground" : "text-muted-foreground"
                  )}
                >
                  {labels[i]}
                </span>
              )}
            </div>
            {step < totalSteps && (
              <div
                className={cn(
                  "mx-2 h-0.5 flex-1",
                  step < currentStep ? "bg-primary" : "bg-muted-foreground/30"
                )}
              />
            )}
          </React.Fragment>
        )
      })}
    </div>
  )
}
