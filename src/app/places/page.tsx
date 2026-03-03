import * as React from "react"
import { SlidersHorizontal } from "lucide-react"

import { PublicHeader } from "@/components/layout/public-header"
import { PublicFooter } from "@/components/layout/public-footer"
import { PlaceCard } from "@/components/shared/place-card"
import { mockFacilities, type Facility } from "@/lib/mock-data"
import { filterByRadius } from "@/lib/utils/geo"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import { DateRangePicker } from "@/components/shared/date-range-picker"
import { PlacesContent } from "./places-content"

// Simple mock sidebar filter UI
function FilterSidebar() {
  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h3 className="font-semibold">Location</h3>
        <Select defaultValue="any">
          <SelectTrigger>
            <SelectValue placeholder="Select division" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="any">Any Division</SelectItem>
            <SelectItem value="dhaka">Dhaka</SelectItem>
            <SelectItem value="sylhet">Sylhet</SelectItem>
            <SelectItem value="chittagong">Chittagong</SelectItem>
            <SelectItem value="rajshahi">Rajshahi</SelectItem>
            <SelectItem value="barisal">Barisal</SelectItem>
            <SelectItem value="khulna">Khulna</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-4">
        <h3 className="font-semibold">Dates</h3>
        <DateRangePicker />
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold">Price per night</h3>
          <span className="text-sm text-muted-foreground">৳500 - ৳5000+</span>
        </div>
        <Slider defaultValue={[5000]} max={10000} step={100} />
      </div>

      <div className="space-y-4">
        <h3 className="font-semibold">Amenities</h3>
        <div className="space-y-3">
          {["WiFi", "Meals available", "Air Conditioning", "Parking"].map((amenity) => (
            <div key={amenity} className="flex items-center space-x-2">
              <Checkbox id={`amenity-${amenity}`} />
              <Label htmlFor={`amenity-${amenity}`} className="font-normal">{amenity}</Label>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="font-semibold">Safety</h3>
        <div className="space-y-3">
          {["Women Safe", "Gated Compound", "24/7 Security", "Verified NGO"].map((safety) => (
            <div key={safety} className="flex items-center space-x-2">
              <Checkbox id={`safety-${safety}`} />
              <Label htmlFor={`safety-${safety}`} className="font-normal">{safety}</Label>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default async function PlacesPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const resolvedParams = await searchParams

  const regionQuery = resolvedParams.region as string | undefined
  const latParam = resolvedParams.lat as string | undefined
  const lngParam = resolvedParams.lng as string | undefined
  const radiusParam = resolvedParams.radius as string | undefined
  const locationName = resolvedParams.location as string | undefined

  const lat = latParam ? parseFloat(latParam) : undefined
  const lng = lngParam ? parseFloat(lngParam) : undefined
  const radius = radiusParam ? parseInt(radiusParam, 10) : 25

  let displayedFacilities: Facility[]
  let geoCenter: { lat: number; lng: number } | undefined
  let geoRadius: number | undefined

  if (lat !== undefined && lng !== undefined && !isNaN(lat) && !isNaN(lng)) {
    geoCenter = { lat, lng }
    geoRadius = radius
    displayedFacilities = filterByRadius(mockFacilities, geoCenter, geoRadius)
  } else if (regionQuery && regionQuery !== "any") {
    displayedFacilities = mockFacilities.filter(
      (f) => f.division.toLowerCase() === regionQuery.toLowerCase()
    )
  } else {
    displayedFacilities = mockFacilities
  }

  const heading = locationName
    ? `Places near ${locationName}`
    : regionQuery && regionQuery !== "any"
      ? `Places in ${regionQuery.charAt(0).toUpperCase() + regionQuery.slice(1)}`
      : "Explore Places"

  return (
    <div className="flex min-h-screen flex-col">
      <PublicHeader />

      <main className="flex-1 bg-muted/10">
        <div className="container mx-auto px-4 py-8 md:px-8">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between mb-8">
            <h1 className="font-heading text-3xl font-bold tracking-tight">
              {heading}
            </h1>

            <div className="flex items-center justify-between gap-4">
              {/* Mobile Filter Trigger */}
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" className="md:hidden">
                    <SlidersHorizontal className="mr-2 h-4 w-4" /> Filters
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-[300px] sm:w-[400px] overflow-y-auto">
                  <SheetTitle className="mb-6 font-heading">Filters</SheetTitle>
                  <FilterSidebar />
                </SheetContent>
              </Sheet>

              <p className="text-sm text-muted-foreground hidden md:block">
                Showing {displayedFacilities.length}{" "}
                {displayedFacilities.length === 1 ? "place" : "places"}
                {geoCenter && geoRadius && ` within ${geoRadius} km`}
              </p>

              <Select defaultValue="recommended">
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="recommended">Recommended</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-8">
            {/* Desktop Sidebar */}
            <aside className="hidden md:block w-64 shrink-0">
              <FilterSidebar />
            </aside>

            {/* Main content: grid or map */}
            <div className="flex-1">
              <p className="text-sm text-muted-foreground md:hidden mb-4">
                Showing {displayedFacilities.length}{" "}
                {displayedFacilities.length === 1 ? "place" : "places"}
                {geoCenter && geoRadius && ` within ${geoRadius} km`}
              </p>

              <PlacesContent
                facilities={displayedFacilities}
                center={geoCenter}
                radius={geoRadius}
              />
            </div>
          </div>
        </div>
      </main>

      <PublicFooter />
    </div>
  )
}
