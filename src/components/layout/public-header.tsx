import Link from "next/link"
import { Menu, Search, Droplets } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet"

export function PublicHeader() {
  const navLinks = [
    { name: "Discover", href: "/discover" },
    { name: "Places", href: "/places" },
    { name: "About", href: "/about" },
  ]

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between gap-4 px-4 md:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-1.5 shrink-0">
          <Droplets className="h-6 w-6 text-primary" />
          <span className="font-heading text-xl font-bold tracking-tight text-primary">Dhara</span>
        </Link>

        {/* Desktop: search pill trigger */}
        <Link
          href="/places"
          className="hidden md:flex items-center gap-3 rounded-full border px-5 py-2 text-sm shadow-sm transition-shadow hover:shadow-md"
        >
          <span className="font-medium">Where to?</span>
          <span className="h-4 w-px bg-border" />
          <span className="text-muted-foreground">Any dates</span>
          <span className="h-4 w-px bg-border" />
          <span className="text-muted-foreground">Guests</span>
          <span className="ml-1 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
            <Search className="h-4 w-4" />
          </span>
        </Link>

        {/* Desktop nav + auth */}
        <div className="hidden md:flex items-center gap-5">
          <nav className="flex items-center gap-5">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                {link.name}
              </Link>
            ))}
          </nav>
          <span className="h-5 w-px bg-border" />
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/login">Log in</Link>
            </Button>
            <Button size="sm" asChild>
              <Link href="/signup">Sign up</Link>
            </Button>
          </div>
        </div>

        {/* Mobile: search + hamburger */}
        <div className="flex md:hidden items-center gap-2">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/places">
              <Search className="h-5 w-5" />
              <span className="sr-only">Search places</span>
            </Link>
          </Button>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <div className="flex flex-col gap-6 py-6">
                <Link href="/" className="flex items-center gap-1.5">
                  <Droplets className="h-6 w-6 text-primary" />
                  <span className="font-heading text-2xl font-bold text-primary">Dhara</span>
                </Link>
                <nav className="flex flex-col gap-4">
                  {navLinks.map((link) => (
                    <Link
                      key={link.name}
                      href={link.href}
                      className="text-lg font-medium text-foreground"
                    >
                      {link.name}
                    </Link>
                  ))}
                  <Link href="/for-organizations" className="text-lg font-medium text-foreground">
                    For Organizations
                  </Link>
                </nav>
                <div className="flex flex-col gap-3 mt-4">
                  <Button variant="outline" asChild className="w-full justify-center">
                    <Link href="/login">Log in</Link>
                  </Button>
                  <Button asChild className="w-full justify-center">
                    <Link href="/signup">Sign up</Link>
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
