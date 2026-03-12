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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { ConfirmDialog } from "@/components/shared/confirm-dialog"
import { StaffMemberDialog } from "@/components/shared/staff-member-dialog"
import {
  mockOrganization,
  mockOperatorProfile,
  type StaffMember,
  type VerificationDocument,
  type VerificationDocStatus,
} from "@/lib/mock-data"
import { pageIdToLabel, useStaffPermission } from "@/lib/utils/permissions"
import { Progress } from "@/components/ui/progress"
import {
  Building,
  Mail,
  Phone,
  Shield,
  Users,
  CreditCard,
  Pencil,
  Trash2,
  Crown,
  Plus,
  FileText,
  CheckCircle2,
  Clock,
  XCircle,
  Upload,
  AlertCircle,
} from "lucide-react"
import { toast } from "sonner"

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
  switch (role) {
    case "admin":
      return "border-primary/20 bg-primary/15 text-primary"
    case "caretaker":
      return "border-info/20 bg-info/15 text-info-foreground"
    default:
      return "border-muted bg-muted text-muted-foreground"
  }
}

function roleLabel(role: string) {
  const labels: Record<string, string> = {
    admin: "Admin",
    caretaker: "Caretaker",
    staff: "Staff",
  }
  return labels[role] ?? role
}

function docStatusIcon(status: VerificationDocStatus) {
  switch (status) {
    case "verified":
      return <CheckCircle2 className="h-4 w-4 text-success-foreground" />
    case "uploaded":
      return <Clock className="h-4 w-4 text-warning-foreground" />
    case "rejected":
      return <XCircle className="h-4 w-4 text-destructive" />
    default:
      return <FileText className="h-4 w-4 text-muted-foreground" />
  }
}

function docStatusBadge(status: VerificationDocStatus) {
  switch (status) {
    case "verified":
      return "border-success/20 bg-success/15 text-success-foreground"
    case "uploaded":
      return "border-warning/20 bg-warning/15 text-warning-foreground"
    case "rejected":
      return "border-destructive/20 bg-destructive/15 text-destructive"
    default:
      return "border-muted bg-muted text-muted-foreground"
  }
}

function docStatusLabel(status: VerificationDocStatus): string {
  const labels: Record<VerificationDocStatus, string> = {
    not_uploaded: "Not Uploaded",
    uploaded: "Under Review",
    verified: "Verified",
    rejected: "Rejected",
  }
  return labels[status]
}

function verificationStatusColor(status: string) {
  switch (status) {
    case "verified":
      return "border-success/20 bg-success/15 text-success-foreground"
    case "under_review":
      return "border-info/20 bg-info/15 text-info-foreground"
    case "pending_documents":
      return "border-warning/20 bg-warning/15 text-warning-foreground"
    case "rejected":
      return "border-destructive/20 bg-destructive/15 text-destructive"
    default:
      return ""
  }
}

function verificationStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    pending_documents: "Pending Documents",
    under_review: "Under Review",
    verified: "Verified",
    rejected: "Rejected",
  }
  return labels[status] ?? status
}

const OWNER_STAFF_ID = "staff-1"

export default function OperatorProfilePage() {
  const { canAct } = useStaffPermission("profile")
  const [orgName, setOrgName] = useState(mockOrganization.name)
  const [contactEmail, setContactEmail] = useState(mockOrganization.contactEmail)

  const [verificationDocs, setVerificationDocs] = useState<VerificationDocument[]>(
    mockOrganization.verificationDocuments
  )
  const [staffList, setStaffList] = useState<StaffMember[]>(mockOrganization.staff)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingMember, setEditingMember] = useState<StaffMember | null>(null)

  function handleMockDocUpload(docId: string) {
    setVerificationDocs((prev) =>
      prev.map((d) =>
        d.id === docId
          ? {
              ...d,
              status: "uploaded" as VerificationDocStatus,
              fileName: `${d.label.toLowerCase().replace(/\s+/g, "_")}.pdf`,
              uploadedAt: new Date().toISOString(),
              rejectionReason: null,
            }
          : d
      )
    )
    toast.success("Document uploaded successfully")
  }

  const verifiedCount = verificationDocs.filter((d) => d.status === "verified").length
  const uploadedCount = verificationDocs.filter((d) => d.status === "uploaded" || d.status === "verified").length
  const totalDocs = verificationDocs.length
  const verificationProgress = totalDocs > 0 ? Math.round((verifiedCount / totalDocs) * 100) : 0

  function handleAddStaff() {
    setEditingMember(null)
    setDialogOpen(true)
  }

  function handleEditStaff(member: StaffMember) {
    setEditingMember(member)
    setDialogOpen(true)
  }

  function handleRemoveStaff(memberId: string) {
    setStaffList((prev) => prev.filter((s) => s.id !== memberId))
    toast.success("Staff member removed")
  }

  function handleSaveStaff(data: Omit<StaffMember, "id">) {
    if (editingMember) {
      setStaffList((prev) =>
        prev.map((s) =>
          s.id === editingMember.id ? { ...s, ...data } : s
        )
      )
      toast.success("Staff member updated")
    } else {
      const newMember: StaffMember = {
        id: `staff-${Date.now()}`,
        ...data,
      }
      setStaffList((prev) => [...prev, newMember])
      toast.success("Staff member added")
    }
  }

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
                <Button variant="outline" size="sm" className="mt-2" disabled={!canAct} title={!canAct ? "You don't have permission to perform this action" : undefined}>
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

            <Button disabled={!canAct} title={!canAct ? "You don't have permission to perform this action" : undefined}>Save Changes</Button>
          </CardContent>
        </Card>

        {/* Account Status & Verification */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Account Status & Verification
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Status row */}
            <div className="flex flex-wrap items-center gap-4">
              <div className="space-y-1">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Account</p>
                <Badge variant="outline" className={statusColor(mockOrganization.status)}>
                  {mockOrganization.status}
                </Badge>
              </div>
              <Separator orientation="vertical" className="h-8 hidden sm:block" />
              <div className="space-y-1">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Verification</p>
                <Badge variant="outline" className={verificationStatusColor(mockOrganization.verificationStatus)}>
                  {verificationStatusLabel(mockOrganization.verificationStatus)}
                </Badge>
              </div>
              <Separator orientation="vertical" className="h-8 hidden sm:block" />
              <div className="space-y-1.5 flex-1 min-w-[200px]">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Document Progress</p>
                  <span className="text-xs font-semibold">{verifiedCount}/{totalDocs} verified</span>
                </div>
                <Progress value={verificationProgress} className="h-2" />
              </div>
            </div>

            {mockOrganization.verificationStatus === "pending_documents" && (
              <div className="flex items-start gap-3 rounded-lg border border-warning/30 bg-warning/5 p-4">
                <AlertCircle className="h-5 w-5 text-warning-foreground shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-warning-foreground">Action Required</p>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    Please upload all required verification documents. Your listing will not go live until your organization is verified by our team.
                  </p>
                </div>
              </div>
            )}

            <Separator />

            {/* Verification Documents */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold">Verification Documents</h3>
                <span className="text-xs text-muted-foreground">
                  {uploadedCount} of {totalDocs} uploaded
                </span>
              </div>

              <div className="space-y-2.5">
                {verificationDocs.map((doc) => (
                  <div
                    key={doc.id}
                    className={`flex items-start gap-3 rounded-lg border p-3.5 transition-colors ${
                      doc.status === "verified"
                        ? "border-success/20 bg-success/5"
                        : doc.status === "rejected"
                          ? "border-destructive/20 bg-destructive/5"
                          : doc.status === "uploaded"
                            ? "border-warning/20 bg-warning/5"
                            : ""
                    }`}
                  >
                    <div className="mt-0.5">{docStatusIcon(doc.status)}</div>
                    <div className="min-w-0 flex-1 space-y-1">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium">{doc.label}</p>
                        <Badge variant="outline" className={`text-[10px] px-1.5 py-0 ${docStatusBadge(doc.status)}`}>
                          {docStatusLabel(doc.status)}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">{doc.description}</p>
                      {doc.fileName && (
                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                          <FileText className="h-3 w-3" />
                          {doc.fileName}
                          {doc.uploadedAt && (
                            <span className="ml-1">
                              &middot; Uploaded {new Date(doc.uploadedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                            </span>
                          )}
                        </p>
                      )}
                      {doc.status === "rejected" && doc.rejectionReason && (
                        <p className="text-xs text-destructive flex items-center gap-1 mt-1">
                          <XCircle className="h-3 w-3" />
                          {doc.rejectionReason}
                        </p>
                      )}
                    </div>
                    {doc.status !== "verified" && canAct && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="shrink-0"
                        onClick={() => handleMockDocUpload(doc.id)}
                      >
                        <Upload className="mr-1.5 h-3.5 w-3.5" />
                        {doc.status === "not_uploaded" ? "Upload" : "Re-upload"}
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {mockOrganization.termsAcceptedAt && (
              <>
                <Separator />
                <p className="text-xs text-muted-foreground">
                  Terms & Conditions accepted on{" "}
                  {new Date(mockOrganization.termsAcceptedAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                </p>
              </>
            )}
          </CardContent>
        </Card>

        {/* Bank Account */}
        <Card className="lg:col-span-2">
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
              <Button variant="outline" disabled={!canAct} title={!canAct ? "You don't have permission to perform this action" : undefined}>Update Bank Details</Button>
            </div>
          </CardContent>
        </Card>

        {/* Staff Members */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Staff Members
              <Badge variant="secondary" className="ml-1 text-xs">
                {staffList.length}
              </Badge>
            </CardTitle>
            <Button variant="outline" size="sm" onClick={handleAddStaff} disabled={!canAct} title={!canAct ? "You don't have permission to perform this action" : undefined}>
              <Plus className="mr-1.5 h-4 w-4" />
              Add Staff Member
            </Button>
          </CardHeader>
          <CardContent>
            <TooltipProvider delayDuration={300}>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead className="hidden sm:table-cell">Email</TableHead>
                    <TableHead>Page Access</TableHead>
                    <TableHead className="w-[100px] text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {staffList.map((member) => {
                    const isOwner = member.id === OWNER_STAFF_ID

                    return (
                      <TableRow key={member.id}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{member.name}</span>
                            {isOwner && (
                              <Tooltip>
                                <TooltipTrigger>
                                  <Crown className="h-3.5 w-3.5 text-accent" />
                                </TooltipTrigger>
                                <TooltipContent>Organization Owner</TooltipContent>
                              </Tooltip>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className={roleColor(member.role)}>
                            {roleLabel(member.role)}
                          </Badge>
                        </TableCell>
                        <TableCell className="hidden sm:table-cell text-muted-foreground">
                          {member.email}
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {member.pageAccess.length === 8 ? (
                              <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                                All pages
                              </Badge>
                            ) : (
                              member.pageAccess.map((p) => (
                                <Badge
                                  key={p}
                                  variant="secondary"
                                  className="text-[10px] px-1.5 py-0"
                                >
                                  {pageIdToLabel(p)}
                                </Badge>
                              ))
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-1">
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8"
                                  onClick={() => handleEditStaff(member)}
                                  disabled={!canAct}
                                >
                                  <Pencil className="h-3.5 w-3.5" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>{!canAct ? "You don't have permission" : "Edit"}</TooltipContent>
                            </Tooltip>

                            {!isOwner && canAct && (
                              <ConfirmDialog
                                title="Remove Staff Member"
                                description={`Are you sure you want to remove ${member.name} from your organization? They will lose access to all operator tools.`}
                                variant="danger"
                                onConfirm={() => handleRemoveStaff(member.id)}
                                trigger={
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8 text-muted-foreground hover:text-destructive"
                                      >
                                        <Trash2 className="h-3.5 w-3.5" />
                                      </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>Remove</TooltipContent>
                                  </Tooltip>
                                }
                              />
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </TooltipProvider>
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

      <StaffMemberDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        staffMember={editingMember}
        onSave={handleSaveStaff}
      />
    </div>
  )
}
