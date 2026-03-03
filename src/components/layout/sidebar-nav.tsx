"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Droplets, LogOut } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { getMockSession, logout, type MockSession } from "@/lib/mock-auth"

export interface SidebarNavProps {
  items: { href: string; label: string; icon: React.ReactNode; badge?: number }[]
  title?: string
}

export function SidebarNav({ items, title }: SidebarNavProps) {
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
    <aside className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0 border-r bg-card">
      <div className="flex h-16 items-center gap-1.5 px-5 border-b">
        <Droplets className="h-6 w-6 text-primary" />
        <span className="font-heading text-xl font-bold tracking-tight text-primary">
          {title ?? "Dhara"}
        </span>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        {items.map((item) => {
          const active = pathname === item.href || pathname.startsWith(item.href + "/")

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
              {(item.badge ?? 0) > 0 && (
                <span className="ml-auto flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1.5 text-[10px] font-semibold text-primary-foreground">
                  {item.badge}
                </span>
              )}
            </Link>
          )
        })}
      </nav>

      {session && (
        <div className="border-t p-3 space-y-2">
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
    </aside>
  )
}
