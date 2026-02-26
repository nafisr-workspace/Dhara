"use client"

import * as React from "react"
import { ChevronLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

export interface StepOption {
  id: string
  label: string
  description?: string
  icon?: React.ReactNode
}

export interface GuidedStepProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "onSelect"> {
  step: number
  totalSteps: number
  question: string
  options?: StepOption[]
  selectedValue?: string
  onSelect?: (value: string) => void
  onBack?: () => void
  onNext?: () => void
  nextDisabled?: boolean
}

export function GuidedStep({
  step,
  totalSteps,
  question,
  options,
  selectedValue,
  onSelect,
  onBack,
  onNext,
  nextDisabled,
  children,
  className,
  ...props
}: GuidedStepProps) {
  return (
    <div className={cn("flex flex-col min-h-[60vh] max-w-2xl mx-auto w-full animate-in fade-in slide-in-from-bottom-4 duration-500", className)} {...props}>
      <div className="flex items-center mb-8">
        {onBack && (
          <Button variant="ghost" size="icon" onClick={onBack} className="-ml-3 text-muted-foreground hover:text-foreground">
            <ChevronLeft className="h-5 w-5" />
            <span className="sr-only">Go back</span>
          </Button>
        )}
      </div>

      <div className="flex-1">
        <h2 className="font-heading text-3xl md:text-4xl font-semibold mb-8 tracking-tight">{question}</h2>

        {options && onSelect ? (
          <RadioGroup value={selectedValue} onValueChange={onSelect} className="grid gap-4">
            {options.map((option) => (
              <div key={option.id}>
                <RadioGroupItem
                  value={option.id}
                  id={option.id}
                  className="peer sr-only"
                />
                <Label
                  htmlFor={option.id}
                  className="flex items-center justify-between rounded-xl border-2 border-muted bg-transparent p-6 hover:bg-muted/50 hover:border-primary/50 peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5 cursor-pointer transition-all"
                >
                  <div className="flex items-center gap-4">
                    {option.icon && (
                      <div className="text-muted-foreground peer-data-[state=checked]:text-primary">
                        {option.icon}
                      </div>
                    )}
                    <div className="space-y-1">
                      <p className="text-lg font-medium leading-none peer-data-[state=checked]:text-primary">
                        {option.label}
                      </p>
                      {option.description && (
                        <p className="text-sm text-muted-foreground">
                          {option.description}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="h-5 w-5 rounded-full border-2 border-muted-foreground/30 peer-data-[state=checked]:border-primary peer-data-[state=checked]:border-[6px] transition-all" />
                </Label>
              </div>
            ))}
          </RadioGroup>
        ) : (
          children
        )}
      </div>

      <div className="mt-12 flex items-center justify-between">
        <div className="flex gap-2">
          {Array.from({ length: totalSteps }).map((_, i) => (
            <div
              key={i}
              className={cn(
                "h-2 w-2 rounded-full transition-all",
                i + 1 === step ? "bg-primary w-6" : "bg-muted"
              )}
            />
          ))}
        </div>
        {onNext && (
          <Button onClick={onNext} disabled={nextDisabled !== undefined ? nextDisabled : (options ? !selectedValue : false)} size="lg">
            {step === totalSteps ? "Show Results" : "Continue"}
          </Button>
        )}
      </div>
    </div>
  )
}
