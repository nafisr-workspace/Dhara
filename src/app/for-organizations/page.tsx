import Link from "next/link"
import { Building, TrendingUp, ShieldCheck } from "lucide-react"

import { PublicHeader } from "@/components/layout/public-header"
import { PublicFooter } from "@/components/layout/public-footer"
import { Button } from "@/components/ui/button"

export const metadata = {
  title: "For Organizations | Dhara"
}

export default function ForOrganizationsPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <PublicHeader />

      <main className="flex-1">
        {/* Hero */}
        <section className="bg-primary/5 py-20">
          <div className="container mx-auto px-4 md:px-8 text-center max-w-3xl">
            <h1 className="font-heading text-4xl font-bold tracking-tight md:text-5xl mb-6">
              Turn Empty Rooms into Impact
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              List your organization&apos;s guesthouse or training center on Dhara. Generate unrestricted funding while maintaining full control over your calendar.
            </p>
            <Button size="lg" asChild>
              <Link href="/signup">Apply to Host</Link>
            </Button>
          </div>
        </section>

        {/* Benefits */}
        <section className="py-20 bg-background">
          <div className="container mx-auto px-4 md:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              <div className="flex flex-col items-center text-center">
                <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-6">
                  <TrendingUp className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Unrestricted Income</h3>
                <p className="text-muted-foreground">
                  Generate sustainable revenue for your programs without writing grant proposals.
                </p>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-6">
                  <Building className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Full Control</h3>
                <p className="text-muted-foreground">
                  Your internal programs always come first. Block out dates instantly when you need the rooms.
                </p>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-6">
                  <ShieldCheck className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Verified Guests</h3>
                <p className="text-muted-foreground">
                  Our platform attracts responsible travelers, researchers, and development workers.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <PublicFooter />
    </div>
  )
}
