"use client"

import * as React from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight, Users, ImageIcon, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { PriceDisplay } from "@/components/shared/price-display"
import { type Room } from "@/lib/mock-data"
import { cn } from "@/lib/utils"

const typeLabels: Record<Room["type"], string> = {
  single: "Single",
  double: "Double",
  dorm: "Dorm",
  hall: "Hall",
}

interface RoomGalleryCardProps {
  room: Room
  className?: string
}

export function RoomGalleryCard({ room, className }: RoomGalleryCardProps) {
  const [currentPhoto, setCurrentPhoto] = React.useState(0)
  const [lightboxOpen, setLightboxOpen] = React.useState(false)
  const [lightboxIndex, setLightboxIndex] = React.useState(0)

  const photos = room.photos
  const hasPhotos = photos.length > 0

  function openLightbox(index: number) {
    setLightboxIndex(index)
    setLightboxOpen(true)
  }

  return (
    <>
      <div className={cn("flex flex-col sm:flex-row gap-4 rounded-lg border p-4", className)}>
        {/* Photo section */}
        <div className="relative w-full sm:w-48 md:w-56 shrink-0">
          {hasPhotos ? (
            <div className="relative aspect-[4/3] overflow-hidden rounded-lg bg-muted">
              <Image
                src={photos[currentPhoto].url}
                alt={photos[currentPhoto].alt}
                fill
                className="object-cover cursor-pointer transition-opacity duration-300"
                sizes="(max-width: 640px) 100vw, 224px"
                onClick={() => openLightbox(currentPhoto)}
              />

              {photos.length > 1 && (
                <>
                  <button
                    type="button"
                    className="absolute left-1.5 top-1/2 -translate-y-1/2 flex h-7 w-7 items-center justify-center rounded-full bg-black/40 text-white transition-colors hover:bg-black/60"
                    onClick={(e) => {
                      e.stopPropagation()
                      setCurrentPhoto((prev) => (prev - 1 + photos.length) % photos.length)
                    }}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    className="absolute right-1.5 top-1/2 -translate-y-1/2 flex h-7 w-7 items-center justify-center rounded-full bg-black/40 text-white transition-colors hover:bg-black/60"
                    onClick={(e) => {
                      e.stopPropagation()
                      setCurrentPhoto((prev) => (prev + 1) % photos.length)
                    }}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                  <span className="absolute bottom-1.5 right-1.5 rounded-full bg-black/50 px-2 py-0.5 text-[10px] font-medium text-white">
                    {currentPhoto + 1}/{photos.length}
                  </span>
                </>
              )}
            </div>
          ) : (
            <div className="flex aspect-[4/3] items-center justify-center rounded-lg bg-muted">
              <ImageIcon className="h-8 w-8 text-muted-foreground/40" />
            </div>
          )}

          {/* Thumbnail strip */}
          {photos.length > 1 && (
            <div className="mt-2 flex gap-1.5 overflow-x-auto">
              {photos.map((photo, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setCurrentPhoto(idx)}
                  className={cn(
                    "relative h-10 w-10 shrink-0 overflow-hidden rounded-md border-2 transition-all",
                    idx === currentPhoto
                      ? "border-primary ring-1 ring-primary/30"
                      : "border-transparent opacity-70 hover:opacity-100"
                  )}
                >
                  <Image
                    src={photo.url}
                    alt={photo.alt}
                    fill
                    className="object-cover"
                    sizes="40px"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Room details */}
        <div className="flex flex-1 flex-col justify-between gap-3">
          <div className="space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <h4 className="font-semibold">{room.name}</h4>
              <Badge variant="secondary" className="text-xs">{typeLabels[room.type]}</Badge>
            </div>
            <div className="flex items-center text-sm text-muted-foreground">
              <Users className="mr-1.5 h-4 w-4" />
              Max {room.capacity} {room.capacity === 1 ? "guest" : "guests"}
            </div>
            {room.meal_addon_price > 0 && (
              <p className="text-xs text-muted-foreground">
                Meal addon available: ৳{room.meal_addon_price}/night
              </p>
            )}
          </div>
          <div className="text-right">
            <PriceDisplay amount={room.price_public} period="/ night" />
          </div>
        </div>
      </div>

      {/* Lightbox */}
      <Dialog open={lightboxOpen} onOpenChange={setLightboxOpen}>
        <DialogContent className="max-w-5xl border-none bg-black/95 p-0 shadow-none text-white [&>button]:hidden">
          <DialogTitle className="sr-only">{room.name} Photos</DialogTitle>
          <div className="relative flex h-[90dvh] w-full flex-col items-center justify-center p-4 md:p-8">
            <div className="absolute right-4 top-4 z-50 flex items-center gap-4">
              <span className="text-sm font-medium text-white/70">
                {room.name} — {lightboxIndex + 1} / {photos.length}
              </span>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full bg-black/20 text-white hover:bg-black/40 hover:text-white"
                onClick={() => setLightboxOpen(false)}
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            {hasPhotos && (
              <div className="relative h-full w-full max-h-[75vh] overflow-hidden">
                <Image
                  src={photos[lightboxIndex].url}
                  alt={photos[lightboxIndex].alt}
                  fill
                  className="object-contain"
                  sizes="100vw"
                />
              </div>
            )}

            {photos.length > 1 && (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-black/20 text-white hover:bg-black/40 hover:text-white"
                  onClick={(e) => {
                    e.stopPropagation()
                    setLightboxIndex((prev) => (prev - 1 + photos.length) % photos.length)
                  }}
                >
                  <ChevronLeft className="h-8 w-8" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-black/20 text-white hover:bg-black/40 hover:text-white"
                  onClick={(e) => {
                    e.stopPropagation()
                    setLightboxIndex((prev) => (prev + 1) % photos.length)
                  }}
                >
                  <ChevronRight className="h-8 w-8" />
                </Button>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
