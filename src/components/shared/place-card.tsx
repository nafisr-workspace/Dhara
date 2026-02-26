import Link from "next/link"
import Image from "next/image"
import { MapPin } from "lucide-react"
import { type SafetyBadgeType } from "./safety-badge"
import { ImpactLine } from "./impact-line"
import { PriceDisplay } from "./price-display"
import { cn } from "@/lib/utils"

export interface PlaceCardProps {
  facility: {
    name: string
    slug: string
    location: string
    coverImageUrl: string
    priceFrom: number
    safetyTags: SafetyBadgeType[]
    impactLine: string
  }
  className?: string
}

export function PlaceCard({ facility, className }: PlaceCardProps) {
  return (
    <Link
      href={`/places/${facility.slug}`}
      className={cn("group flex flex-col gap-2", className)}
    >
      {/* Image */}
      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl bg-muted">
        <Image
          src={facility.coverImageUrl}
          alt={facility.name}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
        />
      </div>

      {/* Info */}
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <h3 className="font-heading text-[15px] font-semibold leading-snug line-clamp-1">
            {facility.name}
          </h3>
          <div className="mt-0.5 flex items-center gap-1 text-sm text-muted-foreground">
            <MapPin className="h-3.5 w-3.5 shrink-0" />
            <span className="line-clamp-1">{facility.location}</span>
          </div>
        </div>
        <PriceDisplay amount={facility.priceFrom} period="/ night" className="shrink-0 text-right" />
      </div>

      {/* Impact footnote */}
      <ImpactLine text={facility.impactLine} className="text-xs opacity-80" />
    </Link>
  )
}
