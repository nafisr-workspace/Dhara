"use client"

import React from "react"
import { PageHeader } from "@/components/layout/page-header"
import { StatsCard } from "@/components/shared/stats-card"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { mockPayouts } from "@/lib/mock-data"
import { format } from "date-fns"
import { TrendingUp, Download, Banknote, Calendar } from "lucide-react"
import { useStaffPermission } from "@/lib/utils/permissions"

const allTimeTotal = mockPayouts.reduce((sum, p) => sum + p.netPayout, 0)

const nextPayoutDate = (() => {
  const now = new Date()
  const next = new Date(now.getFullYear(), now.getMonth() + 1, 5)
  return next
})()

const maxGross = Math.max(...mockPayouts.map((p) => p.grossAmount))
const last6 = [...mockPayouts].reverse()

function statusColor(status: string) {
  switch (status) {
    case "paid":
      return "border-success/20 bg-success/15 text-success-foreground"
    case "pending":
      return "border-warning/20 bg-warning/15 text-warning-foreground"
    case "processing":
      return "border-info/20 bg-info/15 text-info-foreground"
    default:
      return ""
  }
}

export default function EarningsPage() {
  const { canAct } = useStaffPermission("earnings")

  return (
    <div className="space-y-8">
      <PageHeader
        title="Earnings & Payouts"
        description="Track your revenue, fees, and monthly payouts"
      />

      {/* Summary stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatsCard
          label="Current Month"
          value={`৳${mockPayouts[0].grossAmount.toLocaleString("en-BD")}`}
          icon={<TrendingUp className="h-5 w-5" />}
        />
        <StatsCard
          label="Last Month"
          value={`৳${mockPayouts[1].netPayout.toLocaleString("en-BD")}`}
          icon={<Banknote className="h-5 w-5" />}
        />
        <StatsCard
          label="All Time Total"
          value={`৳${allTimeTotal.toLocaleString("en-BD")}`}
          icon={<TrendingUp className="h-5 w-5" />}
        />
      </div>

      {/* Next Payout */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Next Payout
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <p className="text-sm text-muted-foreground">Payout Date</p>
              <p className="text-lg font-semibold">
                {format(nextPayoutDate, "MMMM d, yyyy")}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Estimated Amount</p>
              <p className="text-lg font-semibold">
                ৳{mockPayouts[0].netPayout.toLocaleString("en-BD")}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Bank Account</p>
              <p className="text-lg font-semibold">****4567</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Monthly Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Monthly Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Month</TableHead>
                <TableHead className="text-right">Bookings</TableHead>
                <TableHead className="text-right">Gross (৳)</TableHead>
                <TableHead className="text-right">Platform Fee (৳)</TableHead>
                <TableHead className="text-right">Tax (৳)</TableHead>
                <TableHead className="text-right">Net Payout (৳)</TableHead>
                <TableHead>Status</TableHead>
                <TableHead />
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockPayouts.map((payout) => (
                <TableRow key={payout.id}>
                  <TableCell className="font-medium">
                    {format(new Date(payout.periodMonth), "MMM yyyy")}
                  </TableCell>
                  <TableCell className="text-right">
                    {payout.bookingCount}
                  </TableCell>
                  <TableCell className="text-right">
                    {payout.grossAmount.toLocaleString("en-BD")}
                  </TableCell>
                  <TableCell className="text-right">
                    {payout.platformFee.toLocaleString("en-BD")}
                  </TableCell>
                  <TableCell className="text-right">
                    {payout.taxCollected.toLocaleString("en-BD")}
                  </TableCell>
                  <TableCell className="text-right font-semibold">
                    {payout.netPayout.toLocaleString("en-BD")}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={statusColor(payout.status)}
                    >
                      {payout.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="icon" disabled={!canAct} title={!canAct ? "You don't have permission to perform this action" : undefined}>
                      <Download className="h-4 w-4" />
                      <span className="sr-only">Download</span>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Bar Chart — Last 6 Months */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Earnings — Last 6 Months
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div
            className="flex items-end justify-between gap-3 pt-4"
            style={{ height: 240 }}
          >
            {last6.map((payout) => {
              const heightPct = (payout.grossAmount / maxGross) * 100
              return (
                <div
                  key={payout.id}
                  className="flex flex-1 flex-col items-center gap-2"
                >
                  <span className="text-xs font-medium text-muted-foreground">
                    ৳{(payout.grossAmount / 1000).toFixed(0)}k
                  </span>
                  <div
                    className="w-full rounded-t-md bg-primary transition-all"
                    style={{ height: `${heightPct}%`, minHeight: 4 }}
                  />
                  <span className="text-xs text-muted-foreground">
                    {format(new Date(payout.periodMonth), "MMM")}
                  </span>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
