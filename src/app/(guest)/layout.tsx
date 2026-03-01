import { GuestLayout } from "@/components/layout/guest-layout"

export default function GuestRouteLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return <GuestLayout>{children}</GuestLayout>
}
