"use client"

import { mockGuestProfile, mockOperatorProfile, type MockUserProfile } from "@/lib/mock-data"

const STORAGE_KEY = "dhara_mock_auth"

export type MockSession = {
  role: "guest" | "operator"
  user: MockUserProfile
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

export function logout(): void {
  localStorage.removeItem(STORAGE_KEY)
}

export function getRedirectForRole(role: "guest" | "operator"): string {
  return role === "operator" ? "/operator/dashboard" : "/dashboard"
}
