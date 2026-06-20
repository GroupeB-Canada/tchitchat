import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth'
import { isAdFree } from '@/lib/subscription'

export default async function AbonnementPage() {
  const session = await getSession()
  if (session && await isAdFree(session.sub)) redirect('/abonnement/succes')

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white rounded-2xl shadow-lg p-10 max-w-md w-full text-center">
        <h1 className="text-3xl font-bold mb-2">TchitChat Sans Pub</h1>
        <p className="text-gray-500 mb-6">Naviguez et chattez sans aucune publicité</p>
        <div className="text-5xl font-extrabold text-indigo-600 mb-1">2,99 $</div>
        <div className="text-gray-400 mb-8">par mois · CAD · Annulez quand vous voulez</div>
        {session ? (
          <form action="/api/stripe/subscribe" method="POST">
            <button type="submit"
              className="w-full bg-indigo-600 text-white py-3 rounded-xl font-semibold hover:bg-indigo-700 transition">
              S&apos;abonner maintenant →
            </button>
          </form>
        ) : (
          <a href="/api/auth/login"
            className="block w-full bg-indigo-600 text-white py-3 rounded-xl font-semibold hover:bg-indigo-700 transition">
            Se connecter pour s&apos;abonner
          </a>
        )}
      </div>
    </main>
  )
}
