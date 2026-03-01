import { OperatorLayout } from "@/components/layout/operator-layout"

export default function OperatorRouteLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return <OperatorLayout>{children}</OperatorLayout>
}
