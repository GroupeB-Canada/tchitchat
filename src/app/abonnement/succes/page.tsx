export default function SuccesPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white rounded-2xl shadow-lg p-10 max-w-md w-full text-center">
        <div className="text-5xl mb-4">🎉</div>
        <h1 className="text-2xl font-bold mb-2">Abonnement activé!</h1>
        <p className="text-gray-500 mb-6">Vous naviguez maintenant sur TchitChat sans aucune publicité.</p>
        <a href="/" className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-indigo-700 transition">
          Retour à l&apos;accueil
        </a>
      </div>
    </main>
  )
}
