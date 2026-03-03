"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { format } from "date-fns"

const manualBookingSchema = z.object({
  guestName: z.string().min(2, "Guest name is required"),
  phone: z.string().min(5, "Phone number is required"),
  sourcePlatform: z.string().min(1, "Source is required"),
  checkinDate: z.string().min(1, "Check-in date is required"),
  checkoutDate: z.string().min(1, "Check-out date is required"),
  guestCount: z.number().min(1, "At least 1 guest"),
  notes: z.string().optional(),
})

type ManualBookingFormValues = z.infer<typeof manualBookingSchema>

interface ManualBookingDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  defaultCheckinDate: Date | null
  defaultCheckoutDate: Date | null
  roomName: string
  onConfirm: (data: ManualBookingFormValues) => void
}

export function ManualBookingDialog({
  open,
  onOpenChange,
  defaultCheckinDate,
  defaultCheckoutDate,
  roomName,
  onConfirm,
}: ManualBookingDialogProps) {
  const form = useForm<ManualBookingFormValues>({
    resolver: zodResolver(manualBookingSchema),
    defaultValues: {
      guestName: "",
      phone: "",
      sourcePlatform: "",
      checkinDate: defaultCheckinDate ? format(defaultCheckinDate, "yyyy-MM-dd") : "",
      checkoutDate: defaultCheckoutDate ? format(defaultCheckoutDate, "yyyy-MM-dd") : "",
      guestCount: 1,
      notes: "",
    },
    values: {
      guestName: "",
      phone: "",
      sourcePlatform: "",
      checkinDate: defaultCheckinDate ? format(defaultCheckinDate, "yyyy-MM-dd") : "",
      checkoutDate: defaultCheckoutDate ? format(defaultCheckoutDate, "yyyy-MM-dd") : "",
      guestCount: 1,
      notes: "",
    },
  })

  function handleSubmit(values: ManualBookingFormValues) {
    onConfirm(values)
    form.reset()
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-heading text-xl">
            Manual Booking — {roomName}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="guestName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Guest Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Full name of the guest" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <Input placeholder="+880 1700 000000" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="sourcePlatform"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Booking Source</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Where did this booking come from?" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="phone_call">Phone Call</SelectItem>
                      <SelectItem value="walk_in">Walk-in</SelectItem>
                      <SelectItem value="booking_com">Booking.com</SelectItem>
                      <SelectItem value="email">Email</SelectItem>
                      <SelectItem value="referral">Referral</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="checkinDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Check-in</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="checkoutDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Check-out</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="guestCount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Number of Guests</FormLabel>
                  <FormControl>
                    <Input type="number" min={1} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes (optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Any additional notes about this booking"
                      className="resize-none"
                      rows={2}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit">Create Booking</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
