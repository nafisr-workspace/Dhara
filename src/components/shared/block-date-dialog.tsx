"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { format } from "date-fns"

interface BlockDateDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  startDate: Date | null
  endDate: Date | null
  onConfirm: (reason: string) => void
}

export function BlockDateDialog({
  open,
  onOpenChange,
  startDate,
  endDate,
  onConfirm,
}: BlockDateDialogProps) {
  const [reason, setReason] = useState("")

  function handleConfirm() {
    onConfirm(reason)
    setReason("")
  }

  const dateLabel =
    startDate && endDate && startDate.getTime() !== endDate.getTime()
      ? `${format(startDate, "MMM d")} – ${format(endDate, "MMM d, yyyy")}`
      : startDate
        ? format(startDate, "MMM d, yyyy")
        : ""

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-heading text-xl">Block Dates</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="rounded-lg border bg-destructive/5 p-3 text-center">
            <p className="text-sm text-muted-foreground">Blocking</p>
            <p className="font-semibold">{dateLabel}</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="block-reason">Reason</Label>
            <Input
              id="block-reason"
              placeholder="e.g. Staff training, Maintenance, Internal event"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleConfirm}
            disabled={!reason.trim()}
          >
            Block Dates
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
