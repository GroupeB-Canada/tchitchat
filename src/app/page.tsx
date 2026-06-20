export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-indigo-50 to-white p-8">
      <h1 className="text-5xl font-extrabold text-indigo-700 mb-4">TchitChat 💬</h1>
      <p className="text-xl text-gray-600 mb-8 text-center max-w-md">
        La plateforme de messagerie simple, rapide et sans friction.
      </p>
      <a href="/api/auth/login"
        className="bg-indigo-600 text-white px-8 py-4 rounded-2xl font-semibold text-lg hover:bg-indigo-700 transition shadow-lg">
        Commencer à chatter →
      </a>
    </main>
  )
}
