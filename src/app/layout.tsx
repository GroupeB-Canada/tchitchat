import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Script from 'next/script'
import { getSession } from '@/lib/auth'
import { isAdFree } from '@/lib/subscription'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'TchitChat - Plateforme de messagerie',
  description: 'Chattez librement avec TchitChat',
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession()
  const adFree = session ? await isAdFree(session.sub) : false

  return (
    <html lang="fr">
      <head>
        {!adFree && (
          <Script
            async
            src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8563190645837404"
            crossOrigin="anonymous"
            strategy="afterInteractive"
          />
        )}
      </head>
      <body className={inter.className}>
        {!adFree && (
          <div className="bg-indigo-50 border-b border-indigo-200 text-center py-2 px-4 text-sm text-indigo-800">
            Naviguez sans publicité pour <strong>2,99 $/mois</strong>{' '}
            <a href="/abonnement" className="underline font-semibold hover:text-indigo-900">
              Supprimer les pubs →
            </a>
          </div>
        )}
        {children}
      </body>
    </html>
  )
}
