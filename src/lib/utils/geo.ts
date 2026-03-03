import type { Facility } from "@/lib/mock-data"

type LatLng = { lat: number; lng: number }

const EARTH_RADIUS_KM = 6371

function toRad(deg: number): number {
  return (deg * Math.PI) / 180
}

/** Haversine distance between two points in kilometres. */
export function haversine(a: LatLng, b: LatLng): number {
  const dLat = toRad(b.lat - a.lat)
  const dLng = toRad(b.lng - a.lng)
  const sinLat = Math.sin(dLat / 2)
  const sinLng = Math.sin(dLng / 2)
  const h =
    sinLat * sinLat +
    Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * sinLng * sinLng
  return 2 * EARTH_RADIUS_KM * Math.asin(Math.sqrt(h))
}

/** Filter facilities within `radiusKm` of `center`. */
export function filterByRadius(
  facilities: Facility[],
  center: LatLng,
  radiusKm: number
): Facility[] {
  return facilities.filter(
    (f) => haversine(center, { lat: f.lat, lng: f.lng }) <= radiusKm
  )
}
