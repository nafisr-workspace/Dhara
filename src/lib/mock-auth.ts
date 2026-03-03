"use client"

import {
  mockGuestProfile,
  mockOperatorProfile,
  type MockUserProfile,
  type LinkedAccount,
} from "@/lib/mock-data"

const STORAGE_KEY = "dhara_mock_auth"

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

export function signupAsGuest(data: GuestSignupData): MockSession {
  const user: MockUserProfile = {
    ...mockGuestProfile,
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
