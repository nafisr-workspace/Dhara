import Link from "next/link"
import { ArrowRight, BadgeCheck, Leaf } from "lucide-react"

import { Button } from "@/components/ui/button"
import { PublicHeader } from "@/components/layout/public-header"
import { PublicFooter } from "@/components/layout/public-footer"
import { PlaceCard } from "@/components/shared/place-card"
import { DestinationChip } from "@/components/shared/destination-chip"
import { SearchBar } from "@/components/shared/search-bar"
import { mockFacilities } from "@/lib/mock-data"

const destinations = [
  { name: "Sylhet", slug: "sylhet", imageUrl: "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&q=80&w=200" },
  { name: "Chittagong", slug: "chittagong", imageUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&q=80&w=200" },
  { name: "Khulna", slug: "khulna", imageUrl: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&q=80&w=200" },
  { name: "Rajshahi", slug: "rajshahi", imageUrl: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=200" },
  { name: "Dhaka", slug: "dhaka", imageUrl: "https://images.unsplash.com/photo-1554995207-c18c203602cb?auto=format&fit=crop&q=80&w=200" },
  { name: "Barisal", slug: "barisal", imageUrl: "https://images.unsplash.com/photo-1587061949409-02df41d5e562?auto=format&fit=crop&q=80&w=200" },
]

const featuredPlaces = mockFacilities.slice(0, 4)

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <PublicHeader />

      <main className="flex-1">
        {/* Hero — light, search-forward */}
        <section className="relative overflow-hidden bg-gradient-to-b from-background to-muted/30 pt-12 pb-16 md:pt-20 md:pb-24">
          <div className="container mx-auto px-4 md:px-8 text-center">
            <h1 className="mx-auto max-w-xl font-heading text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
              Find your next purposeful stay
            </h1>
            <p className="mx-auto mt-4 max-w-md text-muted-foreground">
              Trusted NGO accommodations across Bangladesh
            </p>

            {/* Inline search */}
            <div className="mt-8 md:mt-10">
              <SearchBar />
            </div>

            {/* Trust line */}
            <div className="mt-6 flex items-center justify-center gap-1.5 text-sm text-muted-foreground">
              <BadgeCheck className="h-4 w-4 text-primary" />
              <span>Verified facilities in 15 districts</span>
            </div>
          </div>
        </section>

        {/* Destination categories */}
        <section className="border-b py-10">
          <div className="container mx-auto px-4 md:px-8">
            <h2 className="mb-6 text-center font-heading text-xl font-semibold sm:text-left">
              Explore by destination
            </h2>
            <div className="flex gap-6 overflow-x-auto pb-2 scrollbar-hide md:gap-8 md:justify-center">
              {destinations.map((d) => (
                <DestinationChip key={d.slug} {...d} />
              ))}
            </div>
          </div>
        </section>

        {/* Featured places */}
        <section className="py-14 md:py-20">
          <div className="container mx-auto px-4 md:px-8">
            <div className="mb-8 flex items-end justify-between">
              <h2 className="font-heading text-2xl font-semibold">
                Places guests love
              </h2>
              <Link
                href="/places"
                className="hidden text-sm font-medium text-primary hover:underline sm:inline-flex items-center gap-1"
              >
                Show all <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {featuredPlaces.map((facility) => (
                <PlaceCard key={facility.id} facility={facility} />
              ))}
            </div>

            <div className="mt-8 text-center sm:hidden">
              <Button variant="outline" asChild className="w-full">
                <Link href="/places">Show all places</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Impact — subtle inline stats */}
        <section className="py-14 md:py-20">
          <div className="container mx-auto px-4 md:px-8">
            <div className="mx-auto max-w-3xl rounded-2xl border-l-4 border-primary/40 bg-card p-8 shadow-sm">
              <div className="grid grid-cols-1 gap-8 sm:grid-cols-3 sm:gap-4 text-center sm:text-left">
                <div>
                  <span className="font-heading text-3xl font-bold text-foreground">2,500+</span>
                  <p className="mt-1 text-sm text-muted-foreground">Nights booked</p>
                </div>
                <div>
                  <span className="font-heading text-3xl font-bold text-foreground">৳45L+</span>
                  <p className="mt-1 text-sm text-muted-foreground">Generated for NGOs</p>
                </div>
                <div>
                  <span className="font-heading text-3xl font-bold text-foreground">15</span>
                  <p className="mt-1 text-sm text-muted-foreground">Districts covered</p>
                </div>
              </div>
              <p className="mt-6 flex items-center justify-center gap-1.5 text-sm font-medium text-primary sm:justify-start">
                <Leaf className="h-4 w-4" />
                Every booking funds education, health, and livelihoods.
              </p>
            </div>
          </div>
        </section>

        {/* For Organizations — slim CTA banner */}
        <section className="pb-14 md:pb-20">
          <div className="container mx-auto px-4 md:px-8">
            <div className="flex flex-col items-center justify-between gap-4 rounded-xl bg-muted/50 px-8 py-6 sm:flex-row">
              <p className="text-center text-[15px] font-medium sm:text-left">
                Have unused rooms at your center? Turn them into sustainable income.
              </p>
              <Button variant="outline" size="sm" asChild className="shrink-0">
                <Link href="/for-organizations">Learn more</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <PublicFooter />
    </div>
  )
}
