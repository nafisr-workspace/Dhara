import * as React from "react"
import { SlidersHorizontal } from "lucide-react"

import { PublicHeader } from "@/components/layout/public-header"
import { PublicFooter } from "@/components/layout/public-footer"
import { PlaceCard } from "@/components/shared/place-card"
import { mockFacilities } from "@/lib/mock-data"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import { DateRangePicker } from "@/components/shared/date-range-picker"

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
  // Await searchParams in Next 15+
  const resolvedParams = await searchParams;
  
  // Apply a basic mock filter if 'region' is provided
  const regionQuery = resolvedParams.region as string | undefined
  const displayedFacilities = regionQuery && regionQuery !== "any"
    ? mockFacilities.filter(f => f.division.toLowerCase() === regionQuery.toLowerCase())
    : mockFacilities

  return (
    <div className="flex min-h-screen flex-col">
      <PublicHeader />

      <main className="flex-1 bg-muted/10">
        <div className="container mx-auto px-4 py-8 md:px-8">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between mb-8">
            <h1 className="font-heading text-3xl font-bold tracking-tight">Explore Places</h1>
            
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
                Showing {displayedFacilities.length} {displayedFacilities.length === 1 ? 'place' : 'places'}
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

            {/* Main Grid */}
            <div className="flex-1">
              <p className="text-sm text-muted-foreground md:hidden mb-4">
                Showing {displayedFacilities.length} {displayedFacilities.length === 1 ? 'place' : 'places'}
              </p>
              
              {displayedFacilities.length > 0 ? (
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {displayedFacilities.map((facility) => (
                    <PlaceCard key={facility.id} facility={facility} />
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center p-12 text-center border rounded-lg bg-card">
                  <h3 className="text-lg font-semibold mb-2">No places found</h3>
                  <p className="text-muted-foreground">Try adjusting your filters or search criteria.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <PublicFooter />
    </div>
  )
}
