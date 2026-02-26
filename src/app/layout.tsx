import type { Metadata } from "next"
import { DM_Sans, Lora } from "next/font/google"
import "./globals.css"

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
})

const lora = Lora({
  subsets: ["latin"],
  variable: "--font-heading",
})

export const metadata: Metadata = {
  title: "Dhara — Stay with Purpose",
  description:
    "Book trusted NGO accommodations across Bangladesh. Your stay funds community impact.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${dmSans.variable} ${lora.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  )
}
