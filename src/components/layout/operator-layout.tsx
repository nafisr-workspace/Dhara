"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import {
  LayoutDashboard,
  Building,
  CalendarDays,
  ClipboardList,
  TrendingUp,
  MessageSquare,
  UserCircle,
  Menu,
  Droplets,
  LogOut,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { SidebarNav } from "@/components/layout/sidebar-nav"
import { getMockSession, logout, type MockSession } from "@/lib/mock-auth"

const navItems = [
  { href: "/operator/dashboard", label: "Dashboard", icon: <LayoutDashboard className="h-5 w-5" /> },
  { href: "/operator/facilities", label: "Facilities", icon: <Building className="h-5 w-5" /> },
  { href: "/operator/bookings", label: "Bookings", icon: <CalendarDays className="h-5 w-5" /> },
  { href: "/operator/front-desk", label: "Front Desk", icon: <ClipboardList className="h-5 w-5" /> },
  { href: "/operator/earnings", label: "Earnings", icon: <TrendingUp className="h-5 w-5" /> },
  { href: "/operator/messages", label: "Messages", icon: <MessageSquare className="h-5 w-5" /> },
  { href: "/operator/profile", label: "Profile", icon: <UserCircle className="h-5 w-5" /> },
]

function MobileTopBar() {
  const pathname = usePathname()
  const router = useRouter()
  const [session, setSession] = React.useState<MockSession | null>(null)

  React.useEffect(() => {
    setSession(getMockSession())
  }, [])

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  const initials = session?.user.fullName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2) ?? ""

  return (
    <header className="sticky top-0 z-40 flex h-14 items-center justify-between border-b bg-card px-4 md:hidden">
      <Link href="/operator/dashboard" className="flex items-center gap-1.5">
        <Droplets className="h-5 w-5 text-primary" />
        <span className="font-heading text-lg font-bold tracking-tight text-primary">
          Dhara
        </span>
      </Link>

      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64 p-0">
          <SheetTitle className="sr-only">Navigation</SheetTitle>
          <div className="flex h-14 items-center gap-1.5 border-b px-5">
            <Droplets className="h-5 w-5 text-primary" />
            <span className="font-heading text-lg font-bold tracking-tight text-primary">
              Dhara
            </span>
          </div>
          <nav className="flex flex-col gap-1 px-3 py-4">
            {navItems.map((item) => {
              const active =
                pathname === item.href || pathname.startsWith(item.href + "/")

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors hover:bg-muted",
                    active
                      ? "bg-muted text-primary"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {item.icon}
                  {item.label}
                </Link>
              )
            })}
          </nav>
          {session && (
            <div className="mt-auto border-t p-3 space-y-2">
              <div className="flex items-center gap-3 px-3 py-2">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium truncate">{session.user.fullName}</p>
                  <p className="text-xs text-muted-foreground capitalize">{session.role}</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start gap-3 text-muted-foreground hover:text-destructive"
                onClick={handleLogout}
              >
                <LogOut className="h-4 w-4" />
                Log out
              </Button>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </header>
  )
}

export function OperatorLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <SidebarNav items={navItems} />
      <MobileTopBar />
      <main className="md:pl-64">
        <div className="container mx-auto px-4 py-6 md:px-8 md:py-8">
          {children}
        </div>
      </main>
    </div>
  )
}
