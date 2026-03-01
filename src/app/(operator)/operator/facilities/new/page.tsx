"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, Save } from "lucide-react"

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
import { PhotoUploader } from "@/components/shared/photo-uploader"

const AMENITY_OPTIONS = [
  { id: "wifi", label: "WiFi" },
  { id: "meals", label: "Meals Available" },
  { id: "generator", label: "Generator Backup" },
  { id: "gated", label: "Gated Compound" },
  { id: "security", label: "24hr Security" },
  { id: "women_safe", label: "Women-safe" },
  { id: "accessible", label: "Accessible" },
] as const

export default function NewFacilityPage() {
  const [photos, setPhotos] = useState<string[]>([])
  const [amenities, setAmenities] = useState<string[]>([])
  const [idRequired, setIdRequired] = useState(true)

  function toggleAmenity(id: string) {
    setAmenities((prev) =>
      prev.includes(id) ? prev.filter((a) => a !== id) : [...prev, id]
    )
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    alert("Facility created!")
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title="Add New Facility"
        actions={
          <Button variant="outline" asChild>
            <Link href="/operator/facilities">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Facilities
            </Link>
          </Button>
        }
      />

      <form onSubmit={handleSubmit} className="mx-auto max-w-3xl space-y-8">
        {/* Basic Info */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Info</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Facility Name</Label>
              <Input id="name" placeholder="e.g. Shanti Neer Guesthouse" required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Describe your facility, its mission, and what guests can expect..."
                rows={4}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="type">Type</Label>
              <Select>
                <SelectTrigger id="type">
                  <SelectValue placeholder="Select type" />
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
                <Input id="division" placeholder="e.g. Sylhet" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="district">District</Label>
                <Input id="district" placeholder="e.g. Sylhet" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="area">Area</Label>
                <Input id="area" placeholder="e.g. Sadar" />
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
              <Select>
                <SelectTrigger id="alcohol_policy">
                  <SelectValue placeholder="Select policy" />
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
              <Input id="noise_curfew" placeholder="e.g. 11:00 PM" />
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
                placeholder="Share the story of your organization and this facility..."
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

        <div className="flex justify-end pb-8">
          <Button type="submit" size="lg">
            <Save className="mr-2 h-4 w-4" />
            Save Facility
          </Button>
        </div>
      </form>
    </div>
  )
}
