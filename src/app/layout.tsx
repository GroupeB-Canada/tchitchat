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

// Surveillance d'erreurs maison (récepteur AWS). Le jeton d'écriture n'est JAMAIS dans le code :
// il vient de la variable d'environnement du build NEXT_PUBLIC_ERROR_MONITOR_TOKEN (voir .env.example).
// Sans jeton, rien n'est chargé (aucun effet).
const ERROR_MONITOR_URL =
  process.env.NEXT_PUBLIC_ERROR_MONITOR_URL ||
  'https://hkuztyego2.execute-api.ca-central-1.amazonaws.com/errors'
const ERROR_MONITOR_TOKEN = process.env.NEXT_PUBLIC_ERROR_MONITOR_TOKEN

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession()
  const adFree = session ? await isAdFree(session.sub) : false

  return (
    <html lang="fr">
      <head>
        {ERROR_MONITOR_TOKEN && (
          <>
            <script
              dangerouslySetInnerHTML={{
                __html: `window.ERROR_MONITOR=${JSON.stringify({
                  url: ERROR_MONITOR_URL,
                  token: ERROR_MONITOR_TOKEN,
                  site: 'tchitchat.com',
                }).replace(/</g, '\\u003c')};`,
              }}
            />
            <script src="/error-client.js" defer />
          </>
        )}
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
