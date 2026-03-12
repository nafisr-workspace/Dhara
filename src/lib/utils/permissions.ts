"use client"

import { useState, useEffect, useCallback } from "react"
import {
  type StaffRole,
  type OperatorPageId,
  type StaffMember,
  mockOrganization,
} from "@/lib/mock-data"
import { getActiveStaffId } from "@/lib/mock-auth"

export const ALL_OPERATOR_PAGES: OperatorPageId[] = [
  "front_desk",
  "dashboard",
  "facilities",
  "calendar",
  "bookings",
  "earnings",
  "messages",
  "profile",
]

export const OPERATOR_PAGES: { id: OperatorPageId; label: string }[] = [
  { id: "front_desk", label: "Front Desk" },
  { id: "dashboard", label: "Dashboard" },
  { id: "facilities", label: "Facilities" },
  { id: "calendar", label: "Calendar" },
  { id: "bookings", label: "Bookings" },
  { id: "earnings", label: "Earnings" },
  { id: "messages", label: "Messages" },
  { id: "profile", label: "Profile" },
]

export const DEFAULT_PAGE_ACCESS: Record<StaffRole, OperatorPageId[]> = {
  admin: [...ALL_OPERATOR_PAGES],
  caretaker: ["front_desk", "calendar", "bookings", "messages"],
  staff: ["front_desk"],
}

export function canTakeAction(
  staff: StaffMember,
  page: OperatorPageId
): boolean {
  return staff.pageAccess.includes(page)
}

export const STAFF_SWITCH_EVENT = "dhara:staff-switch"

export function getActiveStaffMember(): StaffMember | null {
  const activeId = getActiveStaffId()
  if (!activeId) {
    return mockOrganization.staff[0] ?? null
  }
  return mockOrganization.staff.find((s) => s.id === activeId) ?? null
}

export function useStaffPermission(page: OperatorPageId): {
  canAct: boolean
  activeStaff: StaffMember | null
} {
  const resolve = useCallback(() => {
    const staff = getActiveStaffMember()
    return {
      canAct: staff ? canTakeAction(staff, page) : true,
      activeStaff: staff,
    }
  }, [page])

  const [state, setState] = useState(resolve)

  useEffect(() => {
    setState(resolve())

    function handleSwitch() {
      setState(resolve())
    }

    window.addEventListener(STAFF_SWITCH_EVENT, handleSwitch)
    return () => window.removeEventListener(STAFF_SWITCH_EVENT, handleSwitch)
  }, [resolve])

  return state
}

export function pageIdToLabel(pageId: OperatorPageId): string {
  return OPERATOR_PAGES.find((p) => p.id === pageId)?.label ?? pageId
}
