"use client"

import * as React from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight, X, ImageIcon } from "lucide-react"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

export interface Photo {
  url: string
  alt: string
}

export interface PhotoGalleryProps {
  photos: Photo[]
}

export function PhotoGallery({ photos }: PhotoGalleryProps) {
  const [isOpen, setIsOpen] = React.useState(false)
  const [currentIndex, setCurrentIndex] = React.useState(0)

  if (!photos || photos.length === 0) {
    return (
      <div className="flex aspect-[2/1] w-full items-center justify-center rounded-xl bg-muted md:aspect-[21/9]">
        <ImageIcon className="h-10 w-10 text-muted-foreground/50" />
      </div>
    )
  }

  const handleOpen = (index: number) => {
    setCurrentIndex(index)
    setIsOpen(true)
  }

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % photos.length)
  }

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + photos.length) % photos.length)
  }

  // Hero + up to 4 thumbnails grid
  const displayPhotos = photos.slice(0, 5)

  return (
    <>
      <div className="group relative grid h-[300px] w-full grid-cols-1 gap-2 overflow-hidden rounded-xl md:h-[400px] md:grid-cols-4 md:grid-rows-2">
        {/* Hero image (spans left half) */}
        <div
          className="relative col-span-1 h-full cursor-pointer md:col-span-2 md:row-span-2"
          onClick={() => handleOpen(0)}
        >
          <Image
            src={displayPhotos[0].url}
            alt={displayPhotos[0].alt}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
            priority
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </div>

        {/* Thumbnails (hidden on mobile, right half grid on desktop) */}
        {displayPhotos.slice(1).map((photo, idx) => (
          <div
            key={idx}
            className="relative hidden h-full cursor-pointer md:block"
            onClick={() => handleOpen(idx + 1)}
          >
            <Image
              src={photo.url}
              alt={photo.alt}
              fill
              className="object-cover transition-transform duration-500 hover:opacity-90 group-hover:scale-[1.02]"
              sizes="25vw"
            />
          </div>
        ))}

        {/* Show all button */}
        {photos.length > 5 && (
          <Button
            variant="secondary"
            className="absolute bottom-4 right-4 z-10 shadow-md"
            onClick={() => handleOpen(0)}
          >
            Show all {photos.length} photos
          </Button>
        )}
      </div>

      {/* Full screen modal */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-7xl border-none bg-black/95 p-0 shadow-none text-white [&>button]:hidden">
          <DialogTitle className="sr-only">Photo Gallery</DialogTitle>
          <div className="relative flex h-[100dvh] w-full flex-col items-center justify-center p-4 md:p-8">
            <div className="absolute right-4 top-4 z-50 flex items-center gap-4">
              <span className="text-sm font-medium text-white/70">
                {currentIndex + 1} / {photos.length}
              </span>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full bg-black/20 text-white hover:bg-black/40 hover:text-white"
                onClick={() => setIsOpen(false)}
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            <div className="relative h-full w-full max-h-[80vh] overflow-hidden">
              <Image
                src={photos[currentIndex].url}
                alt={photos[currentIndex].alt}
                fill
                className="object-contain"
                sizes="100vw"
              />
            </div>

            {photos.length > 1 && (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-black/20 text-white hover:bg-black/40 hover:text-white"
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePrev();
                  }}
                >
                  <ChevronLeft className="h-8 w-8" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-black/20 text-white hover:bg-black/40 hover:text-white"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleNext();
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
