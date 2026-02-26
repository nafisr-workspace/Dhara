import { notFound } from "next/navigation"
import { MapPin, Users, Wifi, Wind, Shield, CheckCircle2 } from "lucide-react"
import { Metadata } from "next"

import { mockFacilities } from "@/lib/mock-data"
import { PublicHeader } from "@/components/layout/public-header"
import { PublicFooter } from "@/components/layout/public-footer"
import { PhotoGallery } from "@/components/shared/photo-gallery"
import { SafetyBadge } from "@/components/shared/safety-badge"
import { ImpactLine } from "@/components/shared/impact-line"
import { SectionCard } from "@/components/layout/section-card"
import { BookingSidebar } from "./booking-sidebar"
import { PriceDisplay } from "@/components/shared/price-display"

type Props = {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params
  const facility = mockFacilities.find((f) => f.slug === resolvedParams.slug)
  
  if (!facility) return { title: "Place Not Found" }
  
  return {
    title: `${facility.name} | Dhara`,
    description: facility.description,
  }
}

export default async function PlaceDetailPage({ params }: Props) {
  const resolvedParams = await params
  const facility = mockFacilities.find((f) => f.slug === resolvedParams.slug)

  if (!facility) {
    notFound()
  }

  // Icons mapping for amenities
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case "wifi": return <Wifi className="h-5 w-5" />
      case "fan": return <Wind className="h-5 w-5" />
      case "shield": return <Shield className="h-5 w-5" />
      default: return <CheckCircle2 className="h-5 w-5 text-muted-foreground" />
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <PublicHeader />

      <main className="flex-1 bg-muted/10 pb-16">
        <div className="container mx-auto px-4 py-8 md:px-8">
          
          <div className="mb-6">
            <h1 className="font-heading text-3xl font-bold tracking-tight md:text-4xl">{facility.name}</h1>
            <div className="mt-2 flex items-center gap-2 text-muted-foreground">
              <MapPin className="h-4 w-4" />
              <span>{facility.location}</span>
            </div>
          </div>

          <div className="mb-8">
            <PhotoGallery photos={facility.photos} />
          </div>

          <div className="flex flex-col gap-8 lg:flex-row">
            {/* Left Column - Details */}
            <div className="flex-1 space-y-8">
              
              {/* Badges & Impact */}
              <div className="flex flex-wrap gap-2">
                {facility.safetyTags.map((tag) => (
                  <SafetyBadge key={tag} type={tag} />
                ))}
              </div>
              
              <div className="rounded-lg bg-primary/5 p-4 border border-primary/10">
                <ImpactLine text={facility.impactLine} className="text-base" />
                <p className="mt-2 text-sm text-muted-foreground">{facility.impactStory}</p>
              </div>

              {/* About */}
              <SectionCard title="About this place">
                <p className="text-muted-foreground leading-relaxed">
                  {facility.description}
                </p>
              </SectionCard>

              {/* Amenities */}
              <SectionCard title="What this place offers">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {facility.amenities.map((amenity, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      {getIcon(amenity.icon)}
                      <span>{amenity.label}</span>
                    </div>
                  ))}
                </div>
              </SectionCard>

              {/* Rooms */}
              <SectionCard title="Available Rooms">
                <div className="space-y-4">
                  {facility.rooms.map((room) => (
                    <div key={room.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border rounded-lg">
                      <div className="space-y-1 mb-4 sm:mb-0">
                        <h4 className="font-semibold">{room.name}</h4>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Users className="mr-1 h-4 w-4" /> 
                          Max {room.capacity} guests
                        </div>
                        <div className="text-sm text-muted-foreground capitalize">
                          Type: {room.type}
                        </div>
                      </div>
                      <div className="text-right">
                        <PriceDisplay amount={room.price_public} period="/ night" />
                      </div>
                    </div>
                  ))}
                </div>
              </SectionCard>

              {/* Rules */}
              <SectionCard title="House Rules">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8">
                  {facility.rules.map((rule, idx) => (
                    <div key={idx}>
                      <span className="font-semibold block">{rule.label}</span>
                      <span className="text-muted-foreground text-sm">{rule.value}</span>
                    </div>
                  ))}
                </div>
              </SectionCard>

            </div>

            {/* Right Column - Booking Sidebar */}
            <div className="w-full lg:w-96 shrink-0">
              <BookingSidebar rooms={facility.rooms} slug={facility.slug} />
            </div>
          </div>
        </div>
      </main>

      <PublicFooter />
    </div>
  )
}
