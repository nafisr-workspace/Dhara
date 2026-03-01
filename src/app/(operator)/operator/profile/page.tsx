"use client"

import React, { useState } from "react"
import { PageHeader } from "@/components/layout/page-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { mockOrganization, mockOperatorProfile } from "@/lib/mock-data"
import { Building, Mail, Phone, Shield, Users, CreditCard } from "lucide-react"

function statusColor(status: string) {
  switch (status) {
    case "approved":
      return "border-success/20 bg-success/15 text-success-foreground"
    case "pending":
      return "border-warning/20 bg-warning/15 text-warning-foreground"
    case "paused":
      return "border-destructive/20 bg-destructive/15 text-destructive"
    default:
      return ""
  }
}

function roleColor(role: string) {
  switch (role.toLowerCase()) {
    case "admin":
      return "border-primary/20 bg-primary/15 text-primary"
    case "caretaker":
      return "border-info/20 bg-info/15 text-info-foreground"
    default:
      return "border-muted bg-muted text-muted-foreground"
  }
}

export default function OperatorProfilePage() {
  const [orgName, setOrgName] = useState(mockOrganization.name)
  const [contactEmail, setContactEmail] = useState(mockOrganization.contactEmail)

  return (
    <div className="space-y-8">
      <PageHeader
        title="Organization Profile"
        description="Manage your organization details and team"
      />

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Organization Info */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building className="h-5 w-5" />
              Organization Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center gap-6">
              <Avatar className="h-20 w-20">
                <AvatarFallback className="bg-primary/10 text-primary text-xl">
                  {mockOrganization.name
                    .split(" ")
                    .map((w) => w[0])
                    .join("")
                    .slice(0, 2)
                    .toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm text-muted-foreground">Organization Logo</p>
                <Button variant="outline" size="sm" className="mt-2">
                  Upload Logo
                </Button>
              </div>
            </div>

            <Separator />

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="org-name">Organization Name</Label>
                <Input
                  id="org-name"
                  value={orgName}
                  onChange={(e) => setOrgName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contact-email">Contact Email</Label>
                <Input
                  id="contact-email"
                  type="email"
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                />
              </div>
            </div>

            <Button>Save Changes</Button>
          </CardContent>
        </Card>

        {/* Account Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Account Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              <Badge
                variant="outline"
                className={statusColor(mockOrganization.status)}
              >
                {mockOrganization.status}
              </Badge>
              <p className="text-sm text-muted-foreground">
                {mockOrganization.status === "approved"
                  ? "Your organization is verified and active"
                  : mockOrganization.status === "pending"
                    ? "Awaiting admin review"
                    : "Your account has been paused"}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Bank Account */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Bank Account
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Account Number</p>
                <p className="text-lg font-semibold">
                  {mockOrganization.bankAccountMasked}
                </p>
              </div>
              <Button variant="outline">Update Bank Details</Button>
            </div>
          </CardContent>
        </Card>

        {/* Staff Members */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Staff Members
            </CardTitle>
            <Button variant="outline" size="sm">
              Add Staff Member
            </Button>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Email</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockOrganization.staff.map((member) => (
                  <TableRow key={member.email}>
                    <TableCell className="font-medium">{member.name}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={roleColor(member.role)}>
                        {member.role}
                      </Badge>
                    </TableCell>
                    <TableCell>{member.email}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Owner Info */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Owner Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                  <Building className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Name</p>
                  <p className="font-medium">{mockOperatorProfile.fullName}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                  <Mail className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium">{mockOperatorProfile.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                  <Phone className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Phone</p>
                  <p className="font-medium">{mockOperatorProfile.phone}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
