"use client"

import * as React from "react"
import { APIProvider, useMapsLibrary } from "@vis.gl/react-google-maps"
import { MapPin, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

const RADIUS_OPTIONS = [5, 10, 25, 50] as const

type LocationSearchProps = {
  value: string
  radius: number
  onPlaceSelect: (place: { name: string; lat: number; lng: number }) => void
  onInputChange: (value: string) => void
  onRadiusChange: (km: number) => void
  onConfirm: () => void
}

function AutocompleteInner({
  value,
  radius,
  onPlaceSelect,
  onInputChange,
  onRadiusChange,
  onConfirm,
}: LocationSearchProps) {
  const places = useMapsLibrary("places")
  const [suggestions, setSuggestions] = React.useState<
    google.maps.places.AutocompletePrediction[]
  >([])
  const [isLoading, setIsLoading] = React.useState(false)
  const serviceRef = React.useRef<google.maps.places.AutocompleteService | null>(null)
  const sessionTokenRef = React.useRef<google.maps.places.AutocompleteSessionToken | null>(null)
  const inputRef = React.useRef<HTMLInputElement>(null)
  const debounceRef = React.useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  React.useEffect(() => {
    if (!places) return
    serviceRef.current = new places.AutocompleteService()
    sessionTokenRef.current = new places.AutocompleteSessionToken()
  }, [places])

  const fetchSuggestions = React.useCallback(
    (input: string) => {
      if (!serviceRef.current || !input.trim()) {
        setSuggestions([])
        return
      }
      setIsLoading(true)
      serviceRef.current.getPlacePredictions(
        {
          input,
          componentRestrictions: { country: "bd" },
          sessionToken: sessionTokenRef.current!,
        },
        (
          predictions: google.maps.places.AutocompletePrediction[] | null,
          status: google.maps.places.PlacesServiceStatus
        ) => {
          setIsLoading(false)
          if (
            status === google.maps.places.PlacesServiceStatus.OK &&
            predictions
          ) {
            setSuggestions(predictions)
          } else {
            setSuggestions([])
          }
        }
      )
    },
    []
  )

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    onInputChange(val)
    clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => fetchSuggestions(val), 300)
  }

  const handleSelectSuggestion = (
    prediction: google.maps.places.AutocompletePrediction
  ) => {
    if (!places) return
    const div = document.createElement("div")
    const svc = new places.PlacesService(div)
    svc.getDetails(
      {
        placeId: prediction.place_id,
        fields: ["geometry", "name"],
        sessionToken: sessionTokenRef.current!,
      },
      (
        place: google.maps.places.PlaceResult | null,
        status: google.maps.places.PlacesServiceStatus
      ) => {
        if (
          status === google.maps.places.PlacesServiceStatus.OK &&
          place?.geometry?.location
        ) {
          const name =
            prediction.structured_formatting.main_text ||
            place.name ||
            prediction.description
          onPlaceSelect({
            name,
            lat: place.geometry.location.lat(),
            lng: place.geometry.location.lng(),
          })
          setSuggestions([])
          sessionTokenRef.current = new places.AutocompleteSessionToken()
        }
      }
    )
  }

  return (
    <div className="space-y-3">
      {/* Autocomplete input */}
      <div className="relative">
        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-white/40" />
        <input
          ref={inputRef}
          type="text"
          placeholder="e.g. Cox's Bazar, Bandarban..."
          className="w-full bg-white/10 border border-white/15 rounded-lg pl-9 pr-3 py-2.5 text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-primary transition-colors"
          value={value}
          onChange={handleInputChange}
          onKeyDown={(e) => {
            if (e.key === "Enter" && value.trim()) {
              onConfirm()
            }
          }}
        />
        {isLoading && (
          <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-white/40 animate-spin" />
        )}
      </div>

      {/* Suggestions dropdown */}
      {suggestions.length > 0 && (
        <div className="space-y-0.5 max-h-[180px] overflow-y-auto scrollbar-hide">
          {suggestions.map((pred) => (
            <button
              key={pred.place_id}
              type="button"
              onClick={() => handleSelectSuggestion(pred)}
              className="flex items-start gap-2.5 w-full px-3 py-2 rounded-lg text-left text-sm text-white/80 hover:bg-white/10 hover:text-white transition-colors"
            >
              <MapPin className="h-3.5 w-3.5 mt-0.5 shrink-0 text-white/40" />
              <div className="min-w-0">
                <span className="font-medium text-white block truncate">
                  {pred.structured_formatting.main_text}
                </span>
                <span className="text-xs text-white/50 block truncate">
                  {pred.structured_formatting.secondary_text}
                </span>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Radius pills */}
      <div>
        <p className="text-white/50 text-xs uppercase tracking-wider mb-2">
          Search radius
        </p>
        <div className="flex gap-1.5">
          {RADIUS_OPTIONS.map((km) => (
            <button
              key={km}
              type="button"
              onClick={() => onRadiusChange(km)}
              className={cn(
                "px-3 py-1.5 rounded-full text-xs font-medium transition-all",
                radius === km
                  ? "bg-primary text-primary-foreground"
                  : "bg-white/10 text-white/60 hover:bg-white/15 hover:text-white"
              )}
            >
              {km} km
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

export function LocationSearch(props: LocationSearchProps) {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY

  if (!apiKey) {
    return (
      <div className="space-y-3">
        <div className="relative">
          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-white/40" />
          <input
            type="text"
            placeholder="e.g. Cox's Bazar, Bandarban..."
            className="w-full bg-white/10 border border-white/15 rounded-lg pl-9 pr-3 py-2.5 text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-primary transition-colors"
            value={props.value}
            onChange={(e) => props.onInputChange(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && props.value.trim()) props.onConfirm()
            }}
          />
        </div>
        <div>
          <p className="text-white/50 text-xs uppercase tracking-wider mb-2">
            Search radius
          </p>
          <div className="flex gap-1.5">
            {RADIUS_OPTIONS.map((km) => (
              <button
                key={km}
                type="button"
                onClick={() => props.onRadiusChange(km)}
                className={cn(
                  "px-3 py-1.5 rounded-full text-xs font-medium transition-all",
                  props.radius === km
                    ? "bg-primary text-primary-foreground"
                    : "bg-white/10 text-white/60 hover:bg-white/15 hover:text-white"
                )}
              >
                {km} km
              </button>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <APIProvider apiKey={apiKey}>
      <AutocompleteInner {...props} />
    </APIProvider>
  )
}
