"use client"

import * as React from "react"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

interface OtpInputProps {
  length?: number
  value: string
  onChange: (value: string) => void
  disabled?: boolean
  className?: string
  autoFocus?: boolean
}

export function OtpInput({
  length = 6,
  value,
  onChange,
  disabled = false,
  className,
  autoFocus = true,
}: OtpInputProps) {
  const inputRefs = React.useRef<(HTMLInputElement | null)[]>([])
  const digits = value.split("").concat(Array(length).fill("")).slice(0, length)

  function focusInput(index: number) {
    inputRefs.current[index]?.focus()
  }

  function handleChange(index: number, char: string) {
    if (!/^\d?$/.test(char)) return

    const next = digits.slice()
    next[index] = char
    const newValue = next.join("").slice(0, length)
    onChange(newValue)

    if (char && index < length - 1) {
      focusInput(index + 1)
    }
  }

  function handleKeyDown(index: number, e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Backspace" && !digits[index] && index > 0) {
      focusInput(index - 1)
    }
    if (e.key === "ArrowLeft" && index > 0) focusInput(index - 1)
    if (e.key === "ArrowRight" && index < length - 1) focusInput(index + 1)
  }

  function handlePaste(e: React.ClipboardEvent) {
    e.preventDefault()
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, length)
    if (pasted) {
      onChange(pasted)
      focusInput(Math.min(pasted.length, length - 1))
    }
  }

  return (
    <div className={cn("flex gap-2 justify-center", className)}>
      {Array.from({ length }).map((_, i) => (
        <Input
          key={i}
          ref={(el) => { inputRefs.current[i] = el }}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={digits[i] || ""}
          disabled={disabled}
          autoFocus={autoFocus && i === 0}
          className="h-12 w-11 text-center text-lg font-semibold px-0"
          onChange={(e) => handleChange(i, e.target.value)}
          onKeyDown={(e) => handleKeyDown(i, e)}
          onPaste={handlePaste}
        />
      ))}
    </div>
  )
}
