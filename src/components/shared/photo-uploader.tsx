"use client"

import * as React from "react"
import Image from "next/image"
import { ImagePlus, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export interface PhotoUploaderProps {
  photos: string[]
  onChange: (photos: string[]) => void
  maxPhotos?: number
  className?: string
}

export function PhotoUploader({
  photos,
  onChange,
  maxPhotos = 8,
  className,
}: PhotoUploaderProps) {
  const canAdd = photos.length < maxPhotos

  function handleRemove(index: number) {
    onChange(photos.filter((_, i) => i !== index))
  }

  return (
    <div className={cn("space-y-2", className)}>
      <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
        {photos.map((src, index) => (
          <div
            key={`${src}-${index}`}
            className="group relative aspect-square overflow-hidden rounded-lg bg-muted"
          >
            <Image
              src={src}
              alt={`Photo ${index + 1}`}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 33vw, 25vw"
            />
            <Button
              variant="destructive"
              size="icon"
              className="absolute right-1 top-1 h-6 w-6 opacity-0 transition-opacity group-hover:opacity-100"
              onClick={() => handleRemove(index)}
            >
              <X className="h-3.5 w-3.5" />
              <span className="sr-only">Remove photo</span>
            </Button>
          </div>
        ))}

        {canAdd && (
          <button
            type="button"
            className="flex aspect-square flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-muted-foreground/25 bg-muted/30 text-muted-foreground transition-colors hover:border-muted-foreground/50 hover:bg-muted/50"
            onClick={() => {
              /* Visual-only mock — no real upload */
            }}
          >
            <ImagePlus className="h-6 w-6" />
            <span className="text-xs font-medium">Add Photo</span>
          </button>
        )}
      </div>

      <p className="text-xs text-muted-foreground">
        {photos.length} / {maxPhotos} photos
      </p>
    </div>
  )
}
