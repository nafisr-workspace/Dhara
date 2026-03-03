"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import {
  MapPin, CalendarDays, Users, Compass,
  Wind, Flame, Heart, Search, Sparkles,
  BadgeCheck, X, ChevronDown, Minus, Plus,
  TreePine, Mountain, Waves, Landmark, Building2,
} from "lucide-react"
import type { LucideIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { LocationSearch } from "@/components/shared/location-search"
import { MiniMapPreview } from "@/components/shared/mini-map-preview"
import { cn } from "@/lib/utils"

// ── Data ─────────────────────────────────────────────────────────────────────

type PurposeOption = { id: string; label: string; icon: LucideIcon; color: string }
type RegionQuickPick = { id: string; label: string; icon: LucideIcon; image: string }

const PURPOSES: PurposeOption[] = [
  { id: "peaceful", label: "Peaceful", icon: Wind, color: "text-secondary" },
  { id: "adventurous", label: "Adventure", icon: Flame, color: "text-accent" },
  { id: "cultural", label: "Cultural", icon: Compass, color: "text-primary" },
  { id: "community", label: "Community", icon: Heart, color: "text-rose-400" },
]

const QUICK_REGIONS: RegionQuickPick[] = [
  { id: "sylhet", label: "Sylhet", icon: TreePine, image: "https://images.unsplash.com/photo-1448375240586-882707fc88b7?q=80&w=2560&auto=format&fit=crop" },
  { id: "chittagong", label: "Chittagong", icon: Mountain, image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=2560&auto=format&fit=crop" },
  { id: "khulna", label: "Khulna", icon: Waves, image: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=2560&auto=format&fit=crop" },
  { id: "rajshahi", label: "Rajshahi", icon: Landmark, image: "https://images.unsplash.com/photo-1449844908441-8829872d2607?q=80&w=2560&auto=format&fit=crop" },
  { id: "dhaka", label: "Dhaka", icon: Building2, image: "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?q=80&w=2560&auto=format&fit=crop" },
]

const DEFAULT_BG = "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?q=80&w=2560&auto=format&fit=crop"

type ActivePanel = "where" | "when" | "who" | "purpose" | null

// ── HeroSection ──────────────────────────────────────────────────────────────

export function HeroSection() {
  const router = useRouter()

  // Panel state
  const [activePanel, setActivePanel] = React.useState<ActivePanel>(null)

  // Where state
  const [locationName, setLocationName] = React.useState("")
  const [locationCoords, setLocationCoords] = React.useState<{ lat: number; lng: number } | null>(null)
  const [searchRadius, setSearchRadius] = React.useState(25)
  const [selectedRegion, setSelectedRegion] = React.useState<string | null>(null)

  // When state
  const [checkin, setCheckin] = React.useState("")
  const [checkout, setCheckout] = React.useState("")

  // Who state
  const [guestCount, setGuestCount] = React.useState(2)

  // Purpose state
  const [purpose, setPurpose] = React.useState<string>("peaceful")

  // Background
  const [bgImage, setBgImage] = React.useState(DEFAULT_BG)
  const [isAnimatingBg, setIsAnimatingBg] = React.useState(false)

  const containerRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setActivePanel(null)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const togglePanel = (panel: ActivePanel) => {
    setActivePanel((prev) => (prev === panel ? null : panel))
  }

  const changeBg = (newImage: string) => {
    if (newImage === bgImage) return
    setIsAnimatingBg(true)
    setTimeout(() => {
      setBgImage(newImage)
      setIsAnimatingBg(false)
    }, 300)
  }

  const handleRegionQuickPick = (region: RegionQuickPick) => {
    setSelectedRegion(region.id)
    setLocationName(region.label)
    setLocationCoords(null)
    changeBg(region.image)
    setActivePanel(null)
  }

  const handlePlaceSelect = (place: { name: string; lat: number; lng: number }) => {
    setLocationCoords({ lat: place.lat, lng: place.lng })
    setLocationName(place.name)
    setSelectedRegion(null)
  }

  const handleSearch = () => {
    const params = new URLSearchParams()
    params.set("purpose", purpose)

    if (locationCoords) {
      params.set("lat", locationCoords.lat.toFixed(4))
      params.set("lng", locationCoords.lng.toFixed(4))
      params.set("radius", String(searchRadius))
      if (locationName) params.set("location", locationName)
    } else if (selectedRegion) {
      params.set("region", selectedRegion)
    }

    if (guestCount > 0) params.set("guests", String(guestCount))
    if (checkin) params.set("checkin", checkin)
    if (checkout) params.set("checkout", checkout)

    router.push(`/places?${params.toString()}`)
  }

  // Display helpers
  const whereDisplay = locationName || "Anywhere"
  const whenDisplay = checkin
    ? `${formatDate(checkin)}${checkout ? ` – ${formatDate(checkout)}` : ""}`
    : "Any dates"
  const whoDisplay = `${guestCount} ${guestCount === 1 ? "guest" : "guests"}`
  const purposeDisplay = PURPOSES.find((p) => p.id === purpose)?.label ?? "Any"

  return (
    <section className="relative min-h-[600px] md:min-h-[680px] lg:min-h-[740px] flex items-center justify-center overflow-hidden">
      {/* Background */}
      <div
        className={cn(
          "absolute inset-0 transition-opacity duration-500 ease-in-out",
          isAnimatingBg ? "opacity-0" : "opacity-100"
        )}
      >
        <Image src={bgImage} alt="" fill className="object-cover" sizes="100vw" priority />
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/45 to-black/25" />

      {/* Content */}
      <div ref={containerRef} className="relative z-10 container mx-auto px-4 md:px-8 text-center py-16 md:py-24">
        {/* Headline */}
        <div className="animate-fade-in-up mb-10 md:mb-14">
          <p className="text-white/50 text-xs md:text-sm font-medium tracking-[0.25em] uppercase mb-4">
            Trusted NGO accommodations across Bangladesh
          </p>
          <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-semibold text-white leading-tight">
            Find your purposeful
            <br />
            <span className="text-primary">stay</span>
          </h1>
        </div>

        {/* Glass Bento Console */}
        <div className="animate-fade-in-up [animation-delay:200ms] max-w-4xl mx-auto">
          <motion.div
            layout
            className="bg-black/50 backdrop-blur-2xl border border-white/15 rounded-2xl md:rounded-3xl shadow-2xl overflow-hidden ring-1 ring-inset ring-white/[0.08]"
          >
            {/* Tile Row */}
            <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-white/10">
              <TileButton
                icon={MapPin}
                label="Where"
                value={whereDisplay}
                isActive={activePanel === "where"}
                onClick={() => togglePanel("where")}
              />
              <TileButton
                icon={CalendarDays}
                label="When"
                value={whenDisplay}
                isActive={activePanel === "when"}
                onClick={() => togglePanel("when")}
              />
              <TileButton
                icon={Users}
                label="Who"
                value={whoDisplay}
                isActive={activePanel === "who"}
                onClick={() => togglePanel("who")}
              />
              <TileButton
                icon={Compass}
                label="Purpose"
                value={purposeDisplay}
                isActive={activePanel === "purpose"}
                onClick={() => togglePanel("purpose")}
                className="hidden md:flex"
              />
            </div>

            {/* Mobile purpose row */}
            <div className="md:hidden border-t border-white/10 grid grid-cols-2 divide-x divide-white/10">
              <TileButton
                icon={Compass}
                label="Purpose"
                value={purposeDisplay}
                isActive={activePanel === "purpose"}
                onClick={() => togglePanel("purpose")}
              />
              <button
                type="button"
                onClick={handleSearch}
                className="flex items-center justify-center gap-2 px-4 py-4 text-sm font-semibold text-primary-foreground bg-primary/90 hover:bg-primary transition-colors"
              >
                <Search className="h-4 w-4" />
                Search
              </button>
            </div>

            {/* Expanded Panels */}
            <AnimatePresence mode="wait">
              {activePanel === "where" && (
                <ExpandedPanel key="where" onClose={() => setActivePanel(null)}>
                  <WherePanel
                    locationName={locationName}
                    locationCoords={locationCoords}
                    searchRadius={searchRadius}
                    selectedRegion={selectedRegion}
                    onInputChange={setLocationName}
                    onPlaceSelect={handlePlaceSelect}
                    onRadiusChange={setSearchRadius}
                    onRegionPick={handleRegionQuickPick}
                    onClose={() => setActivePanel(null)}
                  />
                </ExpandedPanel>
              )}

              {activePanel === "when" && (
                <ExpandedPanel key="when" onClose={() => setActivePanel(null)}>
                  <WhenPanel
                    checkin={checkin}
                    checkout={checkout}
                    onCheckinChange={setCheckin}
                    onCheckoutChange={(val) => {
                      setCheckout(val)
                      if (checkin && val) setActivePanel(null)
                    }}
                  />
                </ExpandedPanel>
              )}

              {activePanel === "who" && (
                <ExpandedPanel key="who" onClose={() => setActivePanel(null)}>
                  <WhoPanel guestCount={guestCount} onChange={setGuestCount} />
                </ExpandedPanel>
              )}

              {activePanel === "purpose" && (
                <ExpandedPanel key="purpose" onClose={() => setActivePanel(null)}>
                  <PurposePanel
                    selected={purpose}
                    onSelect={(id) => {
                      setPurpose(id)
                      setActivePanel(null)
                    }}
                  />
                </ExpandedPanel>
              )}
            </AnimatePresence>

            {/* Desktop search button row */}
            <div className="hidden md:flex border-t border-white/10 items-center justify-between px-6 py-3">
              <Link
                href="/discover"
                className="inline-flex items-center gap-1.5 text-white/50 hover:text-white/80 text-sm transition-colors"
              >
                <Sparkles className="h-3.5 w-3.5" />
                Surprise me
              </Link>
              <Button
                onClick={handleSearch}
                className="relative overflow-hidden rounded-full px-8 h-11 text-sm font-semibold shadow-xl hover:shadow-2xl transition-shadow"
              >
                <Search className="mr-2 h-4 w-4" />
                Search stays
                <span className="absolute inset-0 overflow-hidden rounded-full pointer-events-none">
                  <span className="absolute inset-0 animate-shimmer bg-gradient-to-r from-transparent via-white/15 to-transparent" />
                </span>
              </Button>
            </div>
          </motion.div>
        </div>

        {/* Trust badge */}
        <div className="mt-8 flex items-center justify-center gap-1.5 text-sm text-white/55 animate-fade-in-up [animation-delay:400ms]">
          <BadgeCheck className="h-4 w-4" />
          <span>Verified NGO facilities across 15 districts</span>
        </div>
      </div>
    </section>
  )
}

// ── Tile Button ──────────────────────────────────────────────────────────────

function TileButton({
  icon: Icon,
  label,
  value,
  isActive,
  onClick,
  className,
}: {
  icon: LucideIcon
  label: string
  value: string
  isActive: boolean
  onClick: () => void
  className?: string
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex flex-col items-start gap-0.5 px-5 py-4 md:py-5 text-left transition-colors w-full",
        isActive ? "bg-white/10" : "hover:bg-white/[0.06]",
        className
      )}
    >
      <span className="flex items-center gap-1.5 text-[11px] md:text-xs font-medium text-white/55 uppercase tracking-wider">
        <Icon className="h-3 w-3" />
        {label}
        <ChevronDown className={cn("h-2.5 w-2.5 transition-transform ml-auto", isActive && "rotate-180")} />
      </span>
      <span className="text-sm md:text-base text-white font-semibold truncate w-full">
        {value}
      </span>
    </button>
  )
}

// ── Expanded Panel Wrapper ───────────────────────────────────────────────────

function ExpandedPanel({ children, onClose }: { children: React.ReactNode; onClose: () => void }) {
  return (
    <motion.div
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: "auto", opacity: 1 }}
      exit={{ height: 0, opacity: 0 }}
      transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
      className="overflow-hidden border-t border-white/10"
    >
      <div className="relative p-5 md:p-6">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-3 right-3 text-white/50 hover:text-white/80 transition-colors p-1 rounded-full hover:bg-white/10 z-10"
        >
          <X className="h-4 w-4" />
        </button>
        {children}
      </div>
    </motion.div>
  )
}

// ── Where Panel ──────────────────────────────────────────────────────────────

function WherePanel({
  locationName,
  locationCoords,
  searchRadius,
  selectedRegion,
  onInputChange,
  onPlaceSelect,
  onRadiusChange,
  onRegionPick,
  onClose,
}: {
  locationName: string
  locationCoords: { lat: number; lng: number } | null
  searchRadius: number
  selectedRegion: string | null
  onInputChange: (val: string) => void
  onPlaceSelect: (place: { name: string; lat: number; lng: number }) => void
  onRadiusChange: (km: number) => void
  onRegionPick: (region: RegionQuickPick) => void
  onClose: () => void
}) {
  return (
    <div className="space-y-5">
      {/* Two-column: search + map */}
      <div className="flex flex-col md:flex-row gap-5">
        {/* Left: autocomplete + radius */}
        <div className="flex-1 space-y-4 min-w-0">
          <LocationSearch
            value={locationName}
            radius={searchRadius}
            onInputChange={onInputChange}
            onPlaceSelect={onPlaceSelect}
            onRadiusChange={onRadiusChange}
            onConfirm={onClose}
          />

          {/* Radius slider (visual upgrade from pills) */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-white/55 text-xs uppercase tracking-wider">Radius</span>
              <span className="text-white/90 text-sm font-medium tabular-nums">{searchRadius} km</span>
            </div>
            <Slider
              value={[searchRadius]}
              onValueChange={([val]: number[]) => onRadiusChange(val)}
              min={5}
              max={100}
              step={5}
              className="[&_[data-slot=slider-track]]:bg-white/10 [&_[data-slot=slider-range]]:bg-primary [&_[data-slot=slider-thumb]]:border-primary [&_[data-slot=slider-thumb]]:bg-white"
            />
          </div>
        </div>

        {/* Right: mini-map */}
        <MiniMapPreview
          center={locationCoords}
          radiusKm={searchRadius}
          className="w-full md:w-[280px] h-[180px] md:h-auto rounded-xl overflow-hidden shrink-0"
        />
      </div>

      {/* Quick regions */}
      <div>
        <p className="text-white/50 text-xs uppercase tracking-wider mb-2.5">Quick picks</p>
        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
          {QUICK_REGIONS.map((region) => {
            const Icon = region.icon
            const isSelected = selectedRegion === region.id
            return (
              <button
                key={region.id}
                type="button"
                onClick={() => onRegionPick(region)}
                className={cn(
                  "flex items-center gap-2 px-3.5 py-2 rounded-full text-xs font-medium whitespace-nowrap transition-all shrink-0",
                  isSelected
                    ? "bg-primary text-primary-foreground"
                    : "bg-white/10 text-white/70 hover:bg-white/15 hover:text-white"
                )}
              >
                <Icon className="h-3.5 w-3.5" />
                {region.label}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}

// ── When Panel ───────────────────────────────────────────────────────────────

function WhenPanel({
  checkin,
  checkout,
  onCheckinChange,
  onCheckoutChange,
}: {
  checkin: string
  checkout: string
  onCheckinChange: (val: string) => void
  onCheckoutChange: (val: string) => void
}) {
  const today = new Date().toISOString().split("T")[0]

  return (
    <div className="max-w-md">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-white/55 text-xs uppercase tracking-wider mb-1.5 block">
            Check-in
          </label>
          <input
            type="date"
            className="w-full bg-white/10 border border-white/15 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-primary [color-scheme:dark] transition-colors cursor-pointer"
            value={checkin}
            min={today}
            onChange={(e) => onCheckinChange(e.target.value)}
          />
        </div>
        <div>
          <label className="text-white/55 text-xs uppercase tracking-wider mb-1.5 block">
            Check-out
          </label>
          <input
            type="date"
            className="w-full bg-white/10 border border-white/15 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-primary [color-scheme:dark] transition-colors cursor-pointer"
            value={checkout}
            min={checkin || today}
            onChange={(e) => onCheckoutChange(e.target.value)}
          />
        </div>
      </div>

      {/* Quick picks */}
      <div className="flex gap-2 mt-4">
        {[
          { label: "This weekend", days: daysUntilWeekend() },
          { label: "Next week", days: 7 },
          { label: "Next month", days: 30 },
        ].map((q) => (
          <button
            key={q.label}
            type="button"
            onClick={() => {
              const start = addDays(new Date(), q.days)
              const end = addDays(start, 2)
              onCheckinChange(toDateStr(start))
              onCheckoutChange(toDateStr(end))
            }}
            className="px-3 py-1.5 rounded-full text-xs font-medium bg-white/10 text-white/60 hover:bg-white/15 hover:text-white transition-all"
          >
            {q.label}
          </button>
        ))}
      </div>
    </div>
  )
}

// ── Who Panel ────────────────────────────────────────────────────────────────

function WhoPanel({ guestCount, onChange }: { guestCount: number; onChange: (n: number) => void }) {
  return (
    <div className="max-w-xs">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-white text-sm font-medium">Guests</p>
          <p className="text-white/50 text-xs">How many travelers?</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => onChange(Math.max(1, guestCount - 1))}
            disabled={guestCount <= 1}
            className="flex items-center justify-center w-9 h-9 rounded-full border border-white/20 text-white/70 hover:bg-white/10 hover:text-white disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
          >
            <Minus className="h-4 w-4" />
          </button>
          <span className="text-white text-lg font-semibold w-6 text-center tabular-nums">
            {guestCount}
          </span>
          <button
            type="button"
            onClick={() => onChange(Math.min(20, guestCount + 1))}
            disabled={guestCount >= 20}
            className="flex items-center justify-center w-9 h-9 rounded-full border border-white/20 text-white/70 hover:bg-white/10 hover:text-white disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Purpose Panel ────────────────────────────────────────────────────────────

function PurposePanel({ selected, onSelect }: { selected: string; onSelect: (id: string) => void }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
      {PURPOSES.map((p) => {
        const Icon = p.icon
        const isSelected = selected === p.id
        return (
          <button
            key={p.id}
            type="button"
            onClick={() => onSelect(p.id)}
            className={cn(
              "flex flex-col items-center gap-2 px-4 py-4 rounded-xl transition-all text-center",
              isSelected
                ? "bg-primary/25 border border-primary/50 text-white"
                : "bg-white/[0.06] border border-white/10 text-white/70 hover:bg-white/10 hover:text-white"
            )}
          >
            <Icon className={cn("h-5 w-5", isSelected ? p.color : "text-white/50")} />
            <span className="text-xs font-medium">{p.label}</span>
          </button>
        )
      })}
    </div>
  )
}

// ── Utility functions ────────────────────────────────────────────────────────

function formatDate(dateStr: string): string {
  if (!dateStr) return ""
  const date = new Date(dateStr + "T12:00:00")
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
}

function addDays(date: Date, days: number): Date {
  const result = new Date(date)
  result.setDate(result.getDate() + days)
  return result
}

function toDateStr(date: Date): string {
  return date.toISOString().split("T")[0]
}

function daysUntilWeekend(): number {
  const day = new Date().getDay()
  return day <= 5 ? 5 - day : day === 6 ? 6 : 5
}
