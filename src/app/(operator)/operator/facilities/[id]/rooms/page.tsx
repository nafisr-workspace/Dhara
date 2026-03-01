"use client"

import { use, useState } from "react"
import Link from "next/link"
import { ArrowLeft, Plus } from "lucide-react"

import { PageHeader } from "@/components/layout/page-header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { EmptyState } from "@/components/shared/empty-state"
import { RoomCardManage } from "@/components/shared/room-card-manage"
import { mockFacilities } from "@/lib/mock-data"

interface RoomManagementPageProps {
  params: Promise<{ id: string }>
}

export default function RoomManagementPage({ params }: RoomManagementPageProps) {
  const { id } = use(params)
  const facility = mockFacilities.find((f) => f.id === id)
  const [dialogOpen, setDialogOpen] = useState(false)

  if (!facility) {
    return (
      <EmptyState
        title="Facility not found"
        description="The facility you're looking for doesn't exist."
        action={
          <Button asChild>
            <Link href="/operator/facilities">Back to Facilities</Link>
          </Button>
        }
      />
    )
  }

  function handleAddRoom(e: React.FormEvent) {
    e.preventDefault()
    setDialogOpen(false)
    alert("Room added!")
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title={`Room Management — ${facility.name}`}
        actions={
          <div className="flex items-center gap-2">
            <Button variant="outline" asChild>
              <Link href={`/operator/facilities/${facility.id}`}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Link>
            </Button>

            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Room
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Add New Room</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleAddRoom} className="space-y-4 pt-2">
                  <div className="space-y-2">
                    <Label htmlFor="room_name">Room Name</Label>
                    <Input id="room_name" placeholder="e.g. Deluxe Double" required />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="room_type">Type</Label>
                    <Select>
                      <SelectTrigger id="room_type">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="single">Single</SelectItem>
                        <SelectItem value="double">Double</SelectItem>
                        <SelectItem value="dorm">Dorm</SelectItem>
                        <SelectItem value="hall">Hall</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="room_capacity">Capacity</Label>
                    <Input id="room_capacity" type="number" min={1} placeholder="Max guests" />
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div className="space-y-2">
                      <Label htmlFor="price_partner" className="text-xs">Partner Price</Label>
                      <Input id="price_partner" type="number" min={0} placeholder="৳" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="price_public" className="text-xs">Public Price</Label>
                      <Input id="price_public" type="number" min={0} placeholder="৳" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="price_corporate" className="text-xs">Corporate Price</Label>
                      <Input id="price_corporate" type="number" min={0} placeholder="৳" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="meal_addon">Meal Addon Price</Label>
                    <Input id="meal_addon" type="number" min={0} placeholder="৳ per night (optional)" />
                  </div>

                  <div className="flex justify-end gap-2 pt-2">
                    <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button type="submit">Add Room</Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        }
      />

      {facility.rooms.length === 0 ? (
        <EmptyState
          title="No rooms yet"
          description="Add your first room to start accepting bookings."
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {facility.rooms.map((room) => (
            <RoomCardManage
              key={room.id}
              room={room}
              onEdit={(roomId) => console.log("Edit room:", roomId)}
              onToggleActive={(roomId) => console.log("Toggle active:", roomId)}
            />
          ))}
        </div>
      )}
    </div>
  )
}
