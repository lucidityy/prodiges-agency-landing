import type { Metadata, Viewport } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: {
    default: 'Prodiges Agency - L\'incubateur nouvelle génération',
    template: '%s | Prodiges Agency'
  },
  description: 'Prodiges Agency est l\'incubateur nouvelle génération qui propulse les startups et les entrepreneurs ambitieux vers leur succès. Transformation digitale, stratégie de croissance et accompagnement personnalisé.',
  keywords: ['incubateur', 'startup', 'transformation digitale', 'stratégie croissance', 'entrepreneur', 'agence digitale', 'paris'],
  authors: [{ name: 'Prodiges Agency' }],
  creator: 'Prodiges Agency',
  publisher: 'Prodiges Agency',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://prodiges.agency'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Prodiges Agency - L\'incubateur nouvelle génération',
    description: 'Transformez votre vision entrepreneuriale en succès tangible avec notre accompagnement sur-mesure.',
    url: 'https://prodiges.agency',
    siteName: 'Prodiges Agency',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Prodiges Agency - Incubateur nouvelle génération',
      }
    ],
    locale: 'fr_FR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Prodiges Agency - L\'incubateur nouvelle génération',
    description: 'Transformez votre vision entrepreneuriale en succès tangible.',
    images: ['/twitter-image.jpg'],
    creator: '@prodigesagency',
  },
  robots: {
    index: true,
    follow: true,
    nocache: true,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export const viewport: Viewport = {
  themeColor: '#5B4FE9',
  colorScheme: 'light',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
        <link rel="dns-prefetch" href="https://fonts.gstatic.com" />
        <meta name="format-detection" content="telephone=no, date=no, email=no, address=no" />
      </head>
      <body className="antialiased" suppressHydrationWarning>
        {children}
      </body>
    </html>
  )
}