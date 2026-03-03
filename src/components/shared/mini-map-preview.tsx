"use client"

import * as React from "react"
import {
  APIProvider,
  Map,
  AdvancedMarker,
  useMap,
} from "@vis.gl/react-google-maps"
import { MapPin } from "lucide-react"

const BANGLADESH_CENTER = { lat: 23.685, lng: 90.356 }

type MiniMapPreviewProps = {
  center: { lat: number; lng: number } | null
  radiusKm: number
  className?: string
}

function RadiusOverlay({
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
        fillColor: "hsl(16, 50%, 44%)",
        fillOpacity: 0.12,
        strokeColor: "hsl(16, 50%, 44%)",
        strokeOpacity: 0.5,
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

function MapFlyTo({ center, radiusKm }: { center: { lat: number; lng: number }; radiusKm: number }) {
  const map = useMap()

  React.useEffect(() => {
    if (!map || !center) return
    map.panTo(center)

    let zoom = 10
    if (radiusKm <= 5) zoom = 12
    else if (radiusKm <= 10) zoom = 11
    else if (radiusKm <= 25) zoom = 10
    else if (radiusKm <= 50) zoom = 9
    else zoom = 8

    map.setZoom(zoom)
  }, [map, center, radiusKm])

  return null
}

function MapContent({ center, radiusKm }: { center: { lat: number; lng: number } | null; radiusKm: number }) {
  const mapCenter = center ?? BANGLADESH_CENTER
  const mapZoom = center ? 10 : 7

  return (
    <Map
      defaultCenter={mapCenter}
      defaultZoom={mapZoom}
      mapId="dhara-mini-map"
      gestureHandling="none"
      disableDefaultUI
      clickableIcons={false}
      className="w-full h-full rounded-xl"
    >
      {center && (
        <>
          <MapFlyTo center={center} radiusKm={radiusKm} />
          <RadiusOverlay center={center} radiusKm={radiusKm} />
          <AdvancedMarker position={center}>
            <div className="flex items-center justify-center w-7 h-7 bg-primary rounded-full shadow-lg border-2 border-white">
              <MapPin className="h-3.5 w-3.5 text-primary-foreground" />
            </div>
          </AdvancedMarker>
        </>
      )}
    </Map>
  )
}

export function MiniMapPreview({ center, radiusKm, className }: MiniMapPreviewProps) {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY

  if (!apiKey) {
    return (
      <div className={`flex items-center justify-center bg-white/5 rounded-xl border border-white/10 ${className ?? ""}`}>
        <div className="text-center p-4">
          <MapPin className="h-6 w-6 text-white/20 mx-auto mb-1" />
          <p className="text-[10px] text-white/30">Map preview</p>
        </div>
      </div>
    )
  }

  return (
    <div className={className}>
      <APIProvider apiKey={apiKey}>
        <MapContent center={center} radiusKm={radiusKm} />
      </APIProvider>
    </div>
  )
}
