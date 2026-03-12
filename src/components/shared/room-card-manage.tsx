"use client"

import * as React from "react"
import Image from "next/image"
import { Pencil, Users, UtensilsCrossed, Power, PowerOff, ImageIcon, ChevronLeft, ChevronRight } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { type Room } from "@/lib/mock-data"

export interface RoomCardManageProps {
  room: Room
  onEdit: (id: string) => void
  onToggleActive: (id: string) => void
  className?: string
}

const typeLabels: Record<Room["type"], string> = {
  single: "Single",
  double: "Double",
  dorm: "Dorm",
  hall: "Hall",
}

export function RoomCardManage({
  room,
  onEdit,
  onToggleActive,
  className,
}: RoomCardManageProps) {
  const [photoIdx, setPhotoIdx] = React.useState(0)
  const photos = room.photos
  const hasPhotos = photos.length > 0

  return (
    <Card
      className={cn(
        "overflow-hidden transition-opacity",
        !room.is_active && "opacity-60",
        className,
      )}
    >
      {/* Room photo carousel */}
      <div className="relative aspect-[16/10] overflow-hidden bg-muted">
        {hasPhotos ? (
          <>
            <Image
              src={photos[photoIdx].url}
              alt={photos[photoIdx].alt}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
            {photos.length > 1 && (
              <>
                <button
                  type="button"
                  className="absolute left-1.5 top-1/2 -translate-y-1/2 flex h-6 w-6 items-center justify-center rounded-full bg-black/40 text-white hover:bg-black/60"
                  onClick={() => setPhotoIdx((prev) => (prev - 1 + photos.length) % photos.length)}
                >
                  <ChevronLeft className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  className="absolute right-1.5 top-1/2 -translate-y-1/2 flex h-6 w-6 items-center justify-center rounded-full bg-black/40 text-white hover:bg-black/60"
                  onClick={() => setPhotoIdx((prev) => (prev + 1) % photos.length)}
                >
                  <ChevronRight className="h-3.5 w-3.5" />
                </button>
                <span className="absolute bottom-1.5 right-1.5 rounded-full bg-black/50 px-2 py-0.5 text-[10px] font-medium text-white">
                  {photoIdx + 1}/{photos.length}
                </span>
              </>
            )}
          </>
        ) : (
          <div className="flex h-full items-center justify-center">
            <div className="text-center text-muted-foreground">
              <ImageIcon className="mx-auto h-8 w-8 opacity-40" />
              <p className="mt-1 text-xs">No photos</p>
            </div>
          </div>
        )}
      </div>

      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-sm font-semibold leading-snug">{room.name}</h3>
              <Badge variant="secondary" className="text-xs">
                {typeLabels[room.type]}
              </Badge>
              {!room.is_active && (
                <Badge variant="outline" className="text-xs text-muted-foreground">
                  Inactive
                </Badge>
              )}
            </div>
            <div className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
              <Users className="h-3.5 w-3.5" />
              <span>Capacity: {room.capacity}</span>
              {hasPhotos && (
                <>
                  <span className="text-muted-foreground/40">·</span>
                  <span>{photos.length} photo{photos.length !== 1 ? "s" : ""}</span>
                </>
              )}
            </div>
          </div>

          <div className="flex shrink-0 gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => onEdit(room.id)}
            >
              <Pencil className="h-4 w-4" />
              <span className="sr-only">Edit</span>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => onToggleActive(room.id)}
            >
              {room.is_active ? (
                <PowerOff className="h-4 w-4 text-muted-foreground" />
              ) : (
                <Power className="h-4 w-4 text-success-foreground" />
              )}
              <span className="sr-only">
                {room.is_active ? "Deactivate" : "Activate"}
              </span>
            </Button>
          </div>
        </div>

        {/* Price grid */}
        <div className="mt-4 grid grid-cols-3 gap-3 text-center">
          <div className="rounded-md bg-muted/50 px-2 py-2">
            <p className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
              Partner
            </p>
            <p className="text-sm font-semibold">৳{room.price_partner.toLocaleString()}</p>
          </div>
          <div className="rounded-md bg-muted/50 px-2 py-2">
            <p className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
              Public
            </p>
            <p className="text-sm font-semibold">৳{room.price_public.toLocaleString()}</p>
          </div>
          <div className="rounded-md bg-muted/50 px-2 py-2">
            <p className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
              Corporate
            </p>
            <p className="text-sm font-semibold">৳{room.price_corporate.toLocaleString()}</p>
          </div>
        </div>

        {room.meal_addon_price > 0 && (
          <div className="mt-3 flex items-center gap-1.5 text-xs text-muted-foreground">
            <UtensilsCrossed className="h-3.5 w-3.5" />
            <span>Meal addon: ৳{room.meal_addon_price.toLocaleString()}/night</span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
