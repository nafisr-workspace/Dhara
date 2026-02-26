import { PublicHeader } from "@/components/layout/public-header"
import { PublicFooter } from "@/components/layout/public-footer"
import { SectionCard } from "@/components/layout/section-card"

export const metadata = {
  title: "About | Dhara"
}

export default function AboutPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <PublicHeader />

      <main className="flex-1 bg-muted/10">
        <div className="container mx-auto px-4 py-16 md:px-8 max-w-3xl">
          <h1 className="font-heading text-4xl font-bold tracking-tight mb-8">About Dhara</h1>
          
          <div className="space-y-8">
            <SectionCard title="Our Mission">
              <p className="text-muted-foreground leading-relaxed">
                Dhara connects travelers with trusted NGO and organizational accommodations across Bangladesh. 
                Our mission is to provide safe, affordable lodging while redirecting travel spending into local community impact.
              </p>
            </SectionCard>

            <SectionCard title="How It Works">
              <p className="text-muted-foreground leading-relaxed mb-4">
                Many NGOs and training centers maintain guesthouses and dormitories that often sit empty when not being used for internal programs. 
                Dhara allows these organizations to list their unused capacity.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                When you book a stay through Dhara, 100% of the facility&apos;s profits go back into their social programs—funding schools, clinics, and skills training.
              </p>
            </SectionCard>

            <SectionCard title="Safety & Trust">
              <p className="text-muted-foreground leading-relaxed">
                We personally verify every organization listed on our platform. 
                Our facilities prioritize security, making them especially suitable for solo women travelers, families, and development workers.
              </p>
            </SectionCard>
          </div>
        </div>
      </main>

      <PublicFooter />
    </div>
  )
}
