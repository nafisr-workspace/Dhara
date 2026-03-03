import { Star } from "lucide-react"
import { cn } from "@/lib/utils"

interface StarRatingProps {
  rating: number
  reviewCount?: number
  size?: "sm" | "md" | "lg"
  showCount?: boolean
  className?: string
}

const sizeConfig = {
  sm: { star: "h-3 w-3", text: "text-xs", gap: "gap-0.5" },
  md: { star: "h-4 w-4", text: "text-sm", gap: "gap-0.5" },
  lg: { star: "h-5 w-5", text: "text-base", gap: "gap-1" },
} as const

export function StarRating({
  rating,
  reviewCount,
  size = "sm",
  showCount = true,
  className,
}: StarRatingProps) {
  const config = sizeConfig[size]
  const fullStars = Math.floor(rating)
  const hasHalf = rating - fullStars >= 0.25 && rating - fullStars < 0.75
  const emptyAfterHalf = hasHalf ? 4 - fullStars : 5 - fullStars

  return (
    <span className={cn("inline-flex items-center", config.gap, className)}>
      {Array.from({ length: fullStars }).map((_, i) => (
        <Star
          key={`full-${i}`}
          className={cn(config.star, "fill-amber-400 text-amber-400")}
        />
      ))}
      {hasHalf && (
        <span className="relative">
          <Star className={cn(config.star, "text-amber-400/30")} />
          <span className="absolute inset-0 overflow-hidden w-[50%]">
            <Star className={cn(config.star, "fill-amber-400 text-amber-400")} />
          </span>
        </span>
      )}
      {Array.from({ length: emptyAfterHalf }).map((_, i) => (
        <Star
          key={`empty-${i}`}
          className={cn(config.star, "text-amber-400/30")}
        />
      ))}
      <span className={cn(config.text, "font-semibold ml-0.5")}>{rating.toFixed(1)}</span>
      {showCount && reviewCount !== undefined && (
        <span className={cn(config.text, "text-muted-foreground")}>
          ({reviewCount})
        </span>
      )}
    </span>
  )
}
