"use client"

import * as React from "react"
import { LayoutGrid, MapIcon } from "lucide-react"
import { PlaceCard } from "@/components/shared/place-card"
import { FacilityMap } from "@/components/shared/facility-map"
import { Button } from "@/components/ui/button"
import type { Facility } from "@/lib/mock-data"
import { cn } from "@/lib/utils"

type PlacesContentProps = {
  facilities: Facility[]
  center?: { lat: number; lng: number }
  radius?: number
}

export function PlacesContent({ facilities, center, radius }: PlacesContentProps) {
  const [viewMode, setViewMode] = React.useState<"grid" | "map">("grid")

  return (
    <div>
      {/* View toggle */}
      <div className="flex items-center gap-1 mb-6">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setViewMode("grid")}
          className={cn(
            "gap-1.5",
            viewMode === "grid"
              ? "bg-primary/10 text-primary hover:bg-primary/15"
              : "text-muted-foreground"
          )}
        >
          <LayoutGrid className="h-4 w-4" />
          Grid
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setViewMode("map")}
          className={cn(
            "gap-1.5",
            viewMode === "map"
              ? "bg-primary/10 text-primary hover:bg-primary/15"
              : "text-muted-foreground"
          )}
        >
          <MapIcon className="h-4 w-4" />
          Map
        </Button>
      </div>

      {viewMode === "grid" ? (
        facilities.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {facilities.map((facility) => (
              <PlaceCard key={facility.id} facility={facility} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center p-12 text-center border rounded-lg bg-card">
            <h3 className="text-lg font-semibold mb-2">No places found</h3>
            <p className="text-muted-foreground">
              Try adjusting your filters or search criteria.
            </p>
          </div>
        )
      ) : (
        <div className="h-[500px] md:h-[600px] lg:h-[700px]">
          <FacilityMap
            facilities={facilities}
            center={center}
            radius={radius}
          />
        </div>
      )}
    </div>
  )
}
