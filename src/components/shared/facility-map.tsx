"use client"

import * as React from "react"
import {
  APIProvider,
  Map,
  AdvancedMarker,
  InfoWindow,
  useMap,
  Pin,
} from "@vis.gl/react-google-maps"
import { MapPin, Star, ExternalLink } from "lucide-react"
import Link from "next/link"
import type { Facility } from "@/lib/mock-data"

const BANGLADESH_CENTER = { lat: 23.685, lng: 90.356 }
const DEFAULT_ZOOM = 7

type FacilityMapProps = {
  facilities: Facility[]
  center?: { lat: number; lng: number }
  radius?: number
}

function RadiusCircle({
  center,
  radiusKm,
}: {
  center: { lat: number; lng: number }
  radiusKm: number
}) {
  const map = useMap()
  const circleRef = React.useRef<google.maps.Circle | null>(null)

  React.useEffect(() => {
    if (!map) return

    if (circleRef.current) {
      circleRef.current.setCenter(center)
      circleRef.current.setRadius(radiusKm * 1000)
    } else {
      circleRef.current = new google.maps.Circle({
        map,
        center,
        radius: radiusKm * 1000,
        fillColor: "hsl(25, 65%, 50%)",
        fillOpacity: 0.1,
        strokeColor: "hsl(25, 65%, 50%)",
        strokeOpacity: 0.4,
        strokeWeight: 2,
      })
    }

    return () => {
      if (circleRef.current) {
        circleRef.current.setMap(null)
        circleRef.current = null
      }
    }
  }, [map, center, radiusKm])

  return null
}

function MapContent({ facilities, center, radius }: FacilityMapProps) {
  const [activeMarker, setActiveMarker] = React.useState<string | null>(null)

  const mapCenter = center ?? BANGLADESH_CENTER
  const mapZoom = center && radius ? getZoomForRadius(radius) : DEFAULT_ZOOM

  return (
    <Map
      defaultCenter={mapCenter}
      defaultZoom={mapZoom}
      mapId="dhara-facility-map"
      gestureHandling="greedy"
      disableDefaultUI={false}
      className="w-full h-full rounded-xl"
    >
      {center && radius && <RadiusCircle center={center} radiusKm={radius} />}

      {center && (
        <AdvancedMarker position={center} zIndex={10}>
          <div className="flex items-center justify-center w-8 h-8 bg-primary rounded-full shadow-lg border-2 border-white">
            <MapPin className="h-4 w-4 text-primary-foreground" />
          </div>
        </AdvancedMarker>
      )}

      {facilities.map((facility) => (
        <React.Fragment key={facility.id}>
          <AdvancedMarker
            position={{ lat: facility.lat, lng: facility.lng }}
            onClick={() =>
              setActiveMarker((prev) =>
                prev === facility.id ? null : facility.id
              )
            }
          >
            <Pin
              background="hsl(25, 65%, 50%)"
              glyphColor="white"
              borderColor="hsl(25, 65%, 40%)"
            />
          </AdvancedMarker>

          {activeMarker === facility.id && (
            <InfoWindow
              position={{ lat: facility.lat, lng: facility.lng }}
              onCloseClick={() => setActiveMarker(null)}
              pixelOffset={[0, -40]}
            >
              <div className="min-w-[200px] max-w-[260px] p-1 font-sans">
                <h3 className="font-heading font-semibold text-sm text-gray-900 mb-1">
                  {facility.name}
                </h3>
                <p className="text-xs text-gray-500 mb-1.5">{facility.location}</p>
                <div className="flex items-center gap-2 text-xs mb-2">
                  <span className="flex items-center gap-0.5 text-amber-600">
                    <Star className="h-3 w-3 fill-current" />
                    {facility.rating}
                  </span>
                  <span className="text-gray-400">
                    ({facility.reviewCount} reviews)
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-gray-900">
                    ৳{facility.priceFrom.toLocaleString()}
                    <span className="text-xs font-normal text-gray-400">
                      /night
                    </span>
                  </span>
                  <Link
                    href={`/places/${facility.slug}`}
                    className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
                  >
                    View <ExternalLink className="h-3 w-3" />
                  </Link>
                </div>
              </div>
            </InfoWindow>
          )}
        </React.Fragment>
      ))}
    </Map>
  )
}

function getZoomForRadius(radiusKm: number): number {
  if (radiusKm <= 5) return 12
  if (radiusKm <= 10) return 11
  if (radiusKm <= 25) return 10
  if (radiusKm <= 50) return 9
  return 8
}

export function FacilityMap({ facilities, center, radius }: FacilityMapProps) {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY

  if (!apiKey) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-muted rounded-xl border border-border">
        <div className="text-center p-8">
          <MapPin className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
          <p className="text-sm text-muted-foreground">
            Map view requires a Google Maps API key.
          </p>
          <p className="text-xs text-muted-foreground/60 mt-1">
            Add NEXT_PUBLIC_GOOGLE_MAPS_API_KEY to your .env.local
          </p>
        </div>
      </div>
    )
  }

  return (
    <APIProvider apiKey={apiKey}>
      <MapContent
        facilities={facilities}
        center={center}
        radius={radius}
      />
    </APIProvider>
  )
}
