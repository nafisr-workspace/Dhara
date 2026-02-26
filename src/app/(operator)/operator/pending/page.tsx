import Link from "next/link"
import { Clock } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { PublicHeader } from "@/components/layout/public-header"
import { PublicFooter } from "@/components/layout/public-footer"

export default function PendingApprovalPage() {
  return (
    <div className="flex min-h-screen flex-col bg-muted/10">
      <PublicHeader />
      <main className="flex-1 flex flex-col items-center justify-center p-4">
        <Card className="w-full max-w-md border-primary/20 shadow-md">
          <CardHeader className="text-center pb-4">
            <div className="mx-auto bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mb-4">
              <Clock className="w-8 h-8 text-primary" />
            </div>
            <CardTitle className="text-2xl">Application Under Review</CardTitle>
            <CardDescription className="text-base mt-2">
              Thank you for applying to host your facility on Dhara.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-6">
            <p className="text-muted-foreground">
              We carefully review every organization to ensure the safety and quality of our platform. 
              Our team will contact you within <strong>1-2 business days</strong> at the phone number you provided.
            </p>
            <div className="bg-muted p-4 rounded-lg text-sm text-left">
              <h4 className="font-semibold mb-2">What happens next?</h4>
              <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                <li>We&apos;ll review your organization details</li>
                <li>A Dhara representative will call to verify</li>
                <li>Once approved, you can add rooms and photos</li>
                <li>Your listing goes live for bookings</li>
              </ul>
            </div>
            
            <div className="pt-4 border-t flex flex-col gap-3">
              <p className="text-sm text-muted-foreground">Questions? Email us at support@dhara.com</p>
              <Button variant="outline" asChild className="w-full">
                <Link href="/">Return Home</Link>
              </Button>
              {/* Note: Logout button mock - would hit a server action in real implementation */}
              <Button variant="ghost" className="w-full text-muted-foreground hover:text-destructive">
                Log out
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
      <PublicFooter />
    </div>
  )
}
