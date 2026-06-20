import { cookies } from 'next/headers'

export interface Session {
  sub: string
  email: string
  name?: string
}

export async function getSession(): Promise<Session | null> {
  try {
    const cookieStore = cookies()
    const idToken = cookieStore.get('tchitchat_id_token')?.value
    if (!idToken) return null
    const payload = idToken.split('.')[1]
    const decoded = JSON.parse(Buffer.from(payload, 'base64url').toString())
    if (!decoded.sub || !decoded.email) return null
    return { sub: decoded.sub, email: decoded.email, name: decoded.name }
  } catch {
    return null
  }
}
