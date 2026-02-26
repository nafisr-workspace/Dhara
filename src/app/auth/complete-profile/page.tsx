"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { PublicHeader } from "@/components/layout/public-header"

// Mock checking the role from URL or context. We'll use a local state toggle for UI testing.
const formSchema = z.object({
  phone: z.string().min(10, { message: "Phone number must be at least 10 digits." }),
  orgName: z.string().optional(),
  orgType: z.string().optional(),
  orgDescription: z.string().optional(),
})

export default function CompleteProfilePage() {
  const router = useRouter()
  // Toggle this to test different views
  const [role, setRole] = React.useState<"guest" | "operator">("operator")
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      phone: "",
      orgName: "",
      orgType: "",
      orgDescription: "",
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true)
    console.log(values)
    
    // Mock API call
    setTimeout(() => {
      setIsSubmitting(false)
      if (role === "operator") {
        router.push("/operator/pending")
      } else {
        router.push("/dashboard")
      }
    }, 1000)
  }

  return (
    <div className="flex min-h-screen flex-col bg-muted/10">
      <PublicHeader />
      <main className="flex-1 flex items-center justify-center p-4 py-12">
        <div className="w-full max-w-xl bg-card rounded-xl border shadow-sm p-8">
          <div className="mb-8 text-center">
            <h1 className="font-heading text-3xl font-bold mb-2">Complete Your Profile</h1>
            <p className="text-muted-foreground">
              Just a few more details before you can get started.
            </p>
            {/* Dev toggle for UI testing */}
            <div className="mt-4 inline-flex items-center gap-2 p-1 border rounded bg-muted/50 text-xs">
              <span className="text-muted-foreground">Preview as:</span>
              <button 
                onClick={() => setRole("guest")} 
                className={`px-2 py-1 rounded ${role === "guest" ? "bg-background shadow-sm" : ""}`}
              >
                Guest
              </button>
              <button 
                onClick={() => setRole("operator")} 
                className={`px-2 py-1 rounded ${role === "operator" ? "bg-background shadow-sm" : ""}`}
              >
                Operator
              </button>
            </div>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input placeholder="+880 1700 000000" {...field} />
                    </FormControl>
                    <FormDescription>
                      We need this to contact you regarding bookings.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {role === "operator" && (
                <div className="space-y-6 pt-4 border-t mt-4">
                  <h3 className="font-semibold text-lg">Organization Details</h3>
                  
                  <FormField
                    control={form.control}
                    name="orgName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Organization Name</FormLabel>
                        <FormControl>
                          <Input placeholder="E.g., Shanti Neer Development Society" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="orgType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Organization Type</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="ngo">Local NGO</SelectItem>
                            <SelectItem value="ingo">International NGO</SelectItem>
                            <SelectItem value="trust">Trust / Foundation</SelectItem>
                            <SelectItem value="coop">Cooperative</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="orgDescription"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Brief Description</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="What does your organization do? What impact will the bookings support?" 
                            className="resize-none" 
                            rows={4}
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}

              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : "Complete Setup"}
              </Button>
            </form>
          </Form>
        </div>
      </main>
    </div>
  )
}
