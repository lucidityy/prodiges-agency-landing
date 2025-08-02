import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Prodiges Agency - L\'incubateur nouvelle génération',
  description: 'Prodiges Agency est l\'incubateur nouvelle génération qui propulse les startups et les entrepreneurs ambitieux vers leur succès.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  )
}