export async function GET(request) {
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL
  await fetch(`${baseUrl}/api/generate`, { method: 'POST' })
  await fetch(`${baseUrl}/api/notify`, { method: 'POST' })

  return Response.json({ success: true })
}
