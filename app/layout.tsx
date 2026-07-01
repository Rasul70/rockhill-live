import './globals.css'
import type { Metadata, Viewport } from 'next'

export const metadata: Metadata = {
  title: 'Rock Hill Tower | Live Availability',
  description: 'Live availability board for Rock Hill Tower, Ajman.',
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#0b1110',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <body>{children}</body>
    </html>
  )
}
