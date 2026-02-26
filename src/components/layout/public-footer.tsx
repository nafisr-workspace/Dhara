import Link from "next/link"

export function PublicFooter() {
  return (
    <footer className="border-t bg-muted/40 py-12 md:py-16">
      <div className="container mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand */}
          <div className="flex flex-col gap-4">
            <Link href="/" className="font-heading text-2xl font-bold text-primary">
              Dhara
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Stay with purpose. Book trusted NGO accommodations across Bangladesh &mdash; your stay funds community impact.
            </p>
          </div>

          {/* Explore */}
          <div className="flex flex-col gap-3">
            <h3 className="font-semibold">Explore</h3>
            <Link href="/discover" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Guided Discovery</Link>
            <Link href="/places" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Browse Places</Link>
          </div>

          {/* Organization */}
          <div className="flex flex-col gap-3">
            <h3 className="font-semibold">For Organizations</h3>
            <Link href="/for-organizations" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Why Host With Us</Link>
            <Link href="/signup" className="text-sm text-muted-foreground hover:text-foreground transition-colors">List Your Facility</Link>
            <Link href="/login" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Operator Login</Link>
          </div>

          {/* Legal / About */}
          <div className="flex flex-col gap-3">
            <h3 className="font-semibold">About & Legal</h3>
            <Link href="/about" className="text-sm text-muted-foreground hover:text-foreground transition-colors">About Dhara</Link>
            <Link href="/privacy" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Terms of Service</Link>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Dhara Platform. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
