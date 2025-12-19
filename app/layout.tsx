import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Wheel of Names',
  description: 'Spin the wheel to select winners',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}


