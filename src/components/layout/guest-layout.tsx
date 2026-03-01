"use client"

import * as React from "react"
import {
  LayoutDashboard,
  CalendarDays,
  MessageSquare,
  UserCircle,
} from "lucide-react"

import { SidebarNav } from "@/components/layout/sidebar-nav"
import { BottomNav } from "@/components/layout/bottom-nav"

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: <LayoutDashboard className="h-5 w-5" /> },
  { href: "/bookings", label: "My Bookings", icon: <CalendarDays className="h-5 w-5" /> },
  { href: "/messages", label: "Messages", icon: <MessageSquare className="h-5 w-5" /> },
  { href: "/profile", label: "Profile", icon: <UserCircle className="h-5 w-5" /> },
]

export function GuestLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <SidebarNav items={navItems} />
      <main className="md:pl-64">
        <div className="container mx-auto px-4 py-6 pb-20 md:px-8 md:py-8 md:pb-8">
          {children}
        </div>
      </main>
      <BottomNav items={navItems} />
    </div>
  )
}
