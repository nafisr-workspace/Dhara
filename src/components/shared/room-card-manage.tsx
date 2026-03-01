"use client"

import { Pencil, Users, UtensilsCrossed, Power, PowerOff } from "lucide-react"
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
  return (
    <Card
      className={cn(
        "overflow-hidden transition-opacity",
        !room.is_active && "opacity-60",
        className,
      )}
    >
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
