"use client"

import {
  mockGuestProfile,
  mockOperatorProfile,
  mockGuestProfiles,
  type MockUserProfile,
  type LinkedAccount,
} from "@/lib/mock-data"

const STORAGE_KEY = "dhara_mock_auth"
const MOCK_OTP = "123456"

export type MockSession = {
  role: "guest" | "operator"
  user: MockUserProfile
}

export type GuestSignupData = {
  fullName: string
  email: string
  phone: string
  linkedAccount: LinkedAccount
}

export type OperatorSignupData = {
  fullName: string
  email: string
  phone: string
  orgName: string
  orgType: string
  orgDescription: string
}

// ── Phone → user lookup ─────────────────────────────────────────────────────

const PHONE_USER_MAP: Record<string, { role: "guest" | "operator"; user: MockUserProfile }> = {}

function normalizePhone(phone: string): string {
  return phone.replace(/[\s\-()]/g, "")
}

function buildPhoneMap() {
  if (Object.keys(PHONE_USER_MAP).length > 0) return

  PHONE_USER_MAP[normalizePhone(mockGuestProfile.phone)] = { role: "guest", user: mockGuestProfile }
  PHONE_USER_MAP[normalizePhone(mockOperatorProfile.phone)] = { role: "operator", user: mockOperatorProfile }

  Object.values(mockGuestProfiles).forEach((profile) => {
    if (profile.id !== mockGuestProfile.id) {
      PHONE_USER_MAP[normalizePhone(profile.phone)] = { role: "guest", user: profile }
    }
  })
}

export function findUserByPhone(phone: string): { role: "guest" | "operator"; user: MockUserProfile } | null {
  buildPhoneMap()
  return PHONE_USER_MAP[normalizePhone(phone)] ?? null
}

// ── Mock OTP ─────────────────────────────────────────────────────────────────

export function sendMockOtp(_phone: string): { success: boolean; hint: string } {
  return { success: true, hint: MOCK_OTP }
}

export function verifyMockOtp(_phone: string, code: string): boolean {
  return code === MOCK_OTP
}

// ── Session management ──────────────────────────────────────────────────────

export function getMockSession(): MockSession | null {
  if (typeof window === "undefined") return null
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    return JSON.parse(raw) as MockSession
  } catch {
    return null
  }
}

export function loginAs(role: "guest" | "operator"): MockSession {
  const user = role === "guest" ? mockGuestProfile : mockOperatorProfile
  const session: MockSession = { role, user }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(session))
  return session
}

export function loginWithPhone(phone: string): MockSession | null {
  const match = findUserByPhone(phone)
  if (!match) return null
  const session: MockSession = { role: match.role, user: match.user }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(session))
  return session
}

export function signupAsGuest(data: GuestSignupData): MockSession {
  const user: MockUserProfile = {
    ...mockGuestProfile,
    id: `u-guest-${Date.now()}`,
    fullName: data.fullName,
    email: data.email,
    phone: data.phone,
    linkedAccount: data.linkedAccount,
    totalBookings: 0,
    totalNights: 0,
    rating: 0,
    reviewCount: 0,
  }
  const session: MockSession = { role: "guest", user }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(session))
  return session
}

export function signupAsOperator(data: OperatorSignupData): MockSession {
  const user: MockUserProfile = {
    ...mockOperatorProfile,
    id: `u-op-${Date.now()}`,
    fullName: data.fullName,
    email: data.email,
    phone: data.phone,
    rating: 0,
    reviewCount: 0,
  }
  const session: MockSession = { role: "operator", user }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(session))
  return session
}

export function logout(): void {
  localStorage.removeItem(STORAGE_KEY)
}

export function getRedirectForRole(role: "guest" | "operator"): string {
  return role === "operator" ? "/operator/front-desk" : "/dashboard"
}

const ACTIVE_STAFF_KEY = "dhara_active_staff_id"

export function getActiveStaffId(): string | null {
  if (typeof window === "undefined") return null
  return localStorage.getItem(ACTIVE_STAFF_KEY)
}

export function setActiveStaffId(staffId: string | null): void {
  if (staffId) {
    localStorage.setItem(ACTIVE_STAFF_KEY, staffId)
  } else {
    localStorage.removeItem(ACTIVE_STAFF_KEY)
  }
}
