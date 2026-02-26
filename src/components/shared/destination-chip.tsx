import Link from "next/link"
import Image from "next/image"
import { cn } from "@/lib/utils"

export interface DestinationChipProps {
  name: string
  slug: string
  imageUrl: string
  className?: string
}

export function DestinationChip({ name, slug, imageUrl, className }: DestinationChipProps) {
  return (
    <Link
      href={`/places?region=${slug}`}
      className={cn(
        "group flex flex-col items-center gap-2 shrink-0 w-28",
        className,
      )}
    >
      <div className="relative h-20 w-20 overflow-hidden rounded-full border-2 border-transparent transition-all group-hover:border-primary group-hover:shadow-md">
        <Image
          src={imageUrl}
          alt={name}
          fill
          className="object-cover"
          sizes="80px"
        />
      </div>
      <span className="text-sm font-medium text-muted-foreground transition-colors group-hover:text-foreground">
        {name}
      </span>
    </Link>
  )
}
