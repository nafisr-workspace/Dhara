"use client"

import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
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
import { Label } from "@/components/ui/label"
import {
  type StaffMember,
  type StaffRole,
  type OperatorPageId,
} from "@/lib/mock-data"
import {
  OPERATOR_PAGES,
  DEFAULT_PAGE_ACCESS,
} from "@/lib/utils/permissions"

const staffSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  role: z.enum(["admin", "caretaker", "staff"], {
    message: "Please select a role",
  }),
  pageAccess: z
    .array(z.string())
    .min(1, "At least one page must be accessible"),
})

type StaffFormValues = z.infer<typeof staffSchema>

interface StaffMemberDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  staffMember: StaffMember | null
  onSave: (data: Omit<StaffMember, "id">) => void
}

const ROLE_LABELS: Record<StaffRole, string> = {
  admin: "Admin",
  caretaker: "Caretaker",
  staff: "Staff",
}

export function StaffMemberDialog({
  open,
  onOpenChange,
  staffMember,
  onSave,
}: StaffMemberDialogProps) {
  const isEditing = !!staffMember

  const form = useForm<StaffFormValues>({
    resolver: zodResolver(staffSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      role: "staff",
      pageAccess: [...DEFAULT_PAGE_ACCESS.staff],
    },
  })

  const watchedRole = form.watch("role")

  useEffect(() => {
    if (open) {
      if (staffMember) {
        form.reset({
          name: staffMember.name,
          email: staffMember.email,
          phone: staffMember.phone,
          role: staffMember.role,
          pageAccess: [...staffMember.pageAccess],
        })
      } else {
        form.reset({
          name: "",
          email: "",
          phone: "",
          role: "staff",
          pageAccess: [...DEFAULT_PAGE_ACCESS.staff],
        })
      }
    }
  }, [open, staffMember, form])

  function handleRoleChange(newRole: StaffRole) {
    form.setValue("role", newRole)
    if (!isEditing) {
      form.setValue("pageAccess", [...DEFAULT_PAGE_ACCESS[newRole]])
    }
  }

  function togglePage(pageId: OperatorPageId, checked: boolean) {
    const current = form.getValues("pageAccess") as OperatorPageId[]
    if (checked) {
      form.setValue("pageAccess", [...current, pageId], {
        shouldValidate: true,
      })
    } else {
      form.setValue(
        "pageAccess",
        current.filter((p) => p !== pageId),
        { shouldValidate: true }
      )
    }
  }

  function onSubmit(values: StaffFormValues) {
    onSave({
      name: values.name,
      email: values.email,
      phone: values.phone,
      role: values.role as StaffRole,
      pageAccess: values.pageAccess as OperatorPageId[],
    })
    onOpenChange(false)
  }

  const currentPageAccess = form.watch("pageAccess") as OperatorPageId[]

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-heading text-xl">
            {isEditing ? "Edit Staff Member" : "Add Staff Member"}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Fatima Akter" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="name@org.com"
                        {...field}
                      />
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
                    <FormLabel>Phone</FormLabel>
                    <FormControl>
                      <Input placeholder="+880 1700 000000" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Role</FormLabel>
                  <Select
                    value={field.value}
                    onValueChange={(v) =>
                      handleRoleChange(v as StaffRole)
                    }
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a role" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {(
                        Object.entries(ROLE_LABELS) as [StaffRole, string][]
                      ).map(([value, label]) => (
                        <SelectItem key={value} value={value}>
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-3">
              <Label className="text-sm font-medium">Page Access</Label>
              <p className="text-xs text-muted-foreground">
                Staff can view all pages but can only take actions on
                selected ones.
                {watchedRole === "admin" && " Admins have access to all pages by default."}
              </p>
              <div className="grid grid-cols-2 gap-3">
                {OPERATOR_PAGES.map((page) => {
                  const checked = currentPageAccess.includes(page.id)
                  return (
                    <label
                      key={page.id}
                      className="flex items-center gap-2.5 rounded-md border px-3 py-2.5 cursor-pointer transition-colors hover:bg-muted/50 has-[input:checked]:border-primary has-[input:checked]:bg-primary/5"
                    >
                      <Checkbox
                        checked={checked}
                        onCheckedChange={(c) =>
                          togglePage(page.id, c === true)
                        }
                      />
                      <span className="text-sm font-medium">{page.label}</span>
                    </label>
                  )
                })}
              </div>
              <FormField
                control={form.control}
                name="pageAccess"
                render={() => (
                  <FormItem>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit">
                {isEditing ? "Save Changes" : "Add Member"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
