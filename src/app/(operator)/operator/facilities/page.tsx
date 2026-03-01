import Link from "next/link"
import { Plus, MapPin, DoorOpen } from "lucide-react"

import { PageHeader } from "@/components/layout/page-header"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { mockFacilities } from "@/lib/mock-data"

const operatorFacilities = mockFacilities.slice(0, 2)

export default function FacilitiesListPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Your Facilities"
        description="Manage your listed facilities"
        actions={
          <Button asChild>
            <Link href="/operator/facilities/new">
              <Plus className="mr-2 h-4 w-4" />
              Add New Facility
            </Link>
          </Button>
        }
      />

      <div className="grid gap-6 sm:grid-cols-2">
        {operatorFacilities.map((facility) => (
          <Link
            key={facility.id}
            href={`/operator/facilities/${facility.id}`}
            className="group block overflow-hidden rounded-lg border bg-card shadow-sm transition-shadow hover:shadow-md"
          >
            <div className="relative h-48 overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={facility.coverImageUrl}
                alt={facility.name}
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-3 left-3 right-3">
                <h3 className="text-lg font-semibold text-white">{facility.name}</h3>
                <div className="mt-1 flex items-center gap-1.5 text-sm text-white/80">
                  <MapPin className="h-3.5 w-3.5" />
                  {facility.location}
                </div>
              </div>
              <div className="absolute right-3 top-3">
                <Badge className="bg-success text-white hover:bg-success">
                  Active
                </Badge>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4">
              <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <DoorOpen className="h-4 w-4" />
                <span>{facility.rooms.length} rooms</span>
              </div>
              <span className="text-sm text-muted-foreground">
                From ৳{facility.priceFrom.toLocaleString()}/night
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
