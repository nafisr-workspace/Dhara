"use client"

import { use, useState } from "react"
import Link from "next/link"
import { ArrowLeft, Save, AlertTriangle } from "lucide-react"

import { PageHeader } from "@/components/layout/page-header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { PhotoUploader } from "@/components/shared/photo-uploader"
import { EmptyState } from "@/components/shared/empty-state"
import { cn } from "@/lib/utils"
import { mockFacilities } from "@/lib/mock-data"
import { useStaffPermission } from "@/lib/utils/permissions"

const AMENITY_OPTIONS = [
  { id: "wifi", label: "WiFi" },
  { id: "meals", label: "Meals Available" },
  { id: "generator", label: "Generator Backup" },
  { id: "gated", label: "Gated Compound" },
  { id: "security", label: "24hr Security" },
  { id: "women_safe", label: "Women-safe" },
  { id: "accessible", label: "Accessible" },
] as const

interface FacilitySettingsPageProps {
  params: Promise<{ id: string }>
}

export default function FacilitySettingsPage({ params }: FacilitySettingsPageProps) {
  const { id } = use(params)
  const { canAct } = useStaffPermission("facilities")
  const facility = mockFacilities.find((f) => f.id === id)

  const [photos, setPhotos] = useState<string[]>(
    facility?.photos.map((p) => p.url) ?? []
  )
  const [amenities, setAmenities] = useState<string[]>(
    facility?.amenities.map((a) => a.icon) ?? []
  )
  const [idRequired, setIdRequired] = useState(true)
  const [isActive, setIsActive] = useState(true)

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

  function toggleAmenity(amenityId: string) {
    setAmenities((prev) =>
      prev.includes(amenityId)
        ? prev.filter((a) => a !== amenityId)
        : [...prev, amenityId]
    )
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    alert("Settings saved!")
  }

  function handleDeactivate() {
    alert("Facility deactivated!")
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title={`Settings — ${facility.name}`}
        actions={
          <Button variant="outline" asChild>
            <Link href={`/operator/facilities/${facility.id}`}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Link>
          </Button>
        }
      />

      <form onSubmit={handleSubmit} className="mx-auto max-w-3xl space-y-8">
        {/* Status Toggle */}
        <Card>
          <CardHeader>
            <CardTitle>Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Facility Status</p>
                <p className="text-sm text-muted-foreground">
                  {isActive
                    ? "Your facility is visible to guests and accepting bookings."
                    : "Your facility is paused and hidden from guests."}
                </p>
              </div>
              <Button
                type="button"
                variant={isActive ? "outline" : "default"}
                onClick={() => setIsActive(!isActive)}
              >
                {isActive ? (
                  <>
                    <Badge className="mr-2 bg-success text-white hover:bg-success">Active</Badge>
                    Pause
                  </>
                ) : (
                  <>
                    <Badge variant="secondary" className="mr-2">Paused</Badge>
                    Activate
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Basic Info */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Info</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Facility Name</Label>
              <Input id="name" defaultValue={facility.name} required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                defaultValue={facility.description}
                rows={4}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="type">Type</Label>
              <Select defaultValue="guesthouse">
                <SelectTrigger id="type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="guesthouse">Guesthouse</SelectItem>
                  <SelectItem value="training_center">Training Center</SelectItem>
                  <SelectItem value="conference_center">Conference Center</SelectItem>
                  <SelectItem value="mixed">Mixed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Separator />

            <div className="grid gap-4 sm:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="division">Division</Label>
                <Input id="division" defaultValue={facility.division} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="district">District</Label>
                <Input id="district" defaultValue={facility.district} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="area">Area</Label>
                <Input id="area" defaultValue={facility.area} />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Photos */}
        <Card>
          <CardHeader>
            <CardTitle>Photos</CardTitle>
          </CardHeader>
          <CardContent>
            <PhotoUploader photos={photos} onChange={setPhotos} maxPhotos={10} />
            <p className="mt-2 text-xs text-muted-foreground">
              Min 3 photos recommended. First photo will be used as the cover.
            </p>
          </CardContent>
        </Card>

        {/* Amenities */}
        <Card>
          <CardHeader>
            <CardTitle>Amenities</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
              {AMENITY_OPTIONS.map((amenity) => (
                <label
                  key={amenity.id}
                  className="flex items-center gap-2.5 rounded-md border p-3 transition-colors hover:bg-muted/50 cursor-pointer"
                >
                  <Checkbox
                    checked={amenities.includes(amenity.id)}
                    onCheckedChange={() => toggleAmenity(amenity.id)}
                  />
                  <span className="text-sm">{amenity.label}</span>
                </label>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Rules */}
        <Card>
          <CardHeader>
            <CardTitle>Rules</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="checkin_time">Check-in Time</Label>
                <Input id="checkin_time" type="time" defaultValue="14:00" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="checkout_time">Check-out Time</Label>
                <Input id="checkout_time" type="time" defaultValue="11:00" />
              </div>
            </div>

            <label className="flex items-center gap-2.5">
              <Checkbox
                checked={idRequired}
                onCheckedChange={(v) => setIdRequired(v === true)}
              />
              <span className="text-sm">ID Required at Check-in</span>
            </label>

            <div className="space-y-2">
              <Label htmlFor="alcohol_policy">Alcohol Policy</Label>
              <Select defaultValue="prohibited">
                <SelectTrigger id="alcohol_policy">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="allowed">Allowed</SelectItem>
                  <SelectItem value="restricted">Restricted Areas Only</SelectItem>
                  <SelectItem value="prohibited">Strictly Prohibited</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="noise_curfew">Noise Curfew</Label>
              <Input id="noise_curfew" defaultValue="11:00 PM" />
            </div>
          </CardContent>
        </Card>

        {/* Impact Story */}
        <Card>
          <CardHeader>
            <CardTitle>Impact Story</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="history">History / Background</Label>
              <Textarea
                id="history"
                defaultValue={facility.impactStory}
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="community_activities">Community Activities</Label>
              <Textarea
                id="community_activities"
                placeholder="Describe the community programs or activities your organization runs..."
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        {/* Save */}
        <div className="flex justify-end">
          <Button type="submit" size="lg" disabled={!canAct} title={!canAct ? "You don't have permission to perform this action" : undefined}>
            <Save className="mr-2 h-4 w-4" />
            Save Changes
          </Button>
        </div>

        {/* Danger Zone */}
        <Card className="border-destructive/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="h-5 w-5" />
              Danger Zone
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Deactivate Facility</p>
                <p className="text-sm text-muted-foreground">
                  This will hide the facility from guests and cancel future bookings.
                </p>
              </div>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" disabled={!canAct} title={!canAct ? "You don't have permission to perform this action" : undefined}>Deactivate</Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Deactivate {facility.name}?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This will hide the facility from guests, cancel all upcoming
                      bookings, and issue refunds. This action can be reversed
                      later from settings.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleDeactivate}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                      Yes, Deactivate
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </CardContent>
        </Card>

        <div className="h-8" />
      </form>
    </div>
  )
}
