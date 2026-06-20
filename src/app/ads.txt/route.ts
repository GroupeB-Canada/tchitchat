export const dynamic = 'force-static'
export async function GET() {
  return new Response('google.com, pub-8563190645837404, DIRECT, f08c47fec0942fa0\n', {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  })
}
