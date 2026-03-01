"use client"

import React, { useState } from "react"
import { PageHeader } from "@/components/layout/page-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
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
import { mockGuestProfile } from "@/lib/mock-data"
import {
  User,
  Phone,
  Mail,
  Shield,
  Bell,
  BellOff,
  Trash2,
  CalendarDays,
} from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase()
}

export default function ProfilePage() {
  const [fullName, setFullName] = useState(mockGuestProfile.fullName)
  const [phone, setPhone] = useState(mockGuestProfile.phone)
  const [smsEnabled, setSmsEnabled] = useState(mockGuestProfile.notificationSms)
  const [emailEnabled, setEmailEnabled] = useState(
    mockGuestProfile.notificationEmail
  )

  function handleSave() {
    console.log("Saved profile:", { fullName, phone })
  }

  return (
    <main className="container mx-auto max-w-2xl px-4 py-8">
      <PageHeader title="Profile Settings" />

      {/* Avatar + name display */}
      <Card className="mb-6">
        <CardContent className="flex items-center gap-5 p-6">
          <Avatar className="h-20 w-20 text-2xl">
            <AvatarFallback className="bg-primary/10 text-primary">
              {getInitials(mockGuestProfile.fullName)}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="text-xl font-semibold">{mockGuestProfile.fullName}</p>
            <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <Mail className="h-3.5 w-3.5" />
              {mockGuestProfile.email}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Personal Info */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <User className="h-4 w-4" />
            Personal Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="fullName">Full Name</Label>
            <Input
              id="fullName"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>
          <Button onClick={handleSave}>Save Changes</Button>
        </CardContent>
      </Card>

      {/* ID on File */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Shield className="h-4 w-4" />
            ID on File
          </CardTitle>
        </CardHeader>
        <CardContent>
          {mockGuestProfile.idType && mockGuestProfile.idLastFour ? (
            <div className="flex items-center gap-3">
              <Badge variant="secondary" className="uppercase">
                {mockGuestProfile.idType}
              </Badge>
              <span className="text-sm text-muted-foreground">
                ending in{" "}
                <span className="font-mono font-medium text-foreground">
                  {mockGuestProfile.idLastFour}
                </span>
              </span>
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">No ID on file</p>
              <Button variant="outline" size="sm">
                Add ID
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Notification Preferences */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            {smsEnabled || emailEnabled ? (
              <Bell className="h-4 w-4" />
            ) : (
              <BellOff className="h-4 w-4" />
            )}
            Notification Preferences
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label
              htmlFor="sms-notifications"
              className="flex cursor-pointer items-center gap-2 text-sm"
            >
              <Phone className="h-4 w-4 text-muted-foreground" />
              SMS Notifications
            </Label>
            <Checkbox
              id="sms-notifications"
              checked={smsEnabled}
              onCheckedChange={(checked) =>
                setSmsEnabled(checked === true)
              }
            />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <Label
              htmlFor="email-notifications"
              className="flex cursor-pointer items-center gap-2 text-sm"
            >
              <Mail className="h-4 w-4 text-muted-foreground" />
              Email Notifications
            </Label>
            <Checkbox
              id="email-notifications"
              checked={emailEnabled}
              onCheckedChange={(checked) =>
                setEmailEnabled(checked === true)
              }
            />
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <CalendarDays className="h-4 w-4" />
            Your Stats
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-6">
            <div className="text-center">
              <p className="text-3xl font-semibold">
                {mockGuestProfile.totalBookings}
              </p>
              <p className="text-sm text-muted-foreground">Total Bookings</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-semibold">
                {mockGuestProfile.totalNights}
              </p>
              <p className="text-sm text-muted-foreground">Total Nights</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="border-destructive/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base text-destructive">
            <Trash2 className="h-4 w-4" />
            Danger Zone
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4 text-sm text-muted-foreground">
            Permanently delete your account and all associated data. This action
            cannot be undone.
          </p>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive">Delete Account</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will permanently delete your account, all bookings, and
                  personal data. This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  onClick={() => console.log("Account deletion requested")}
                >
                  Yes, delete my account
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardContent>
      </Card>
    </main>
  )
}
