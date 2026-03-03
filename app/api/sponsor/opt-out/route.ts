import { sanityWriteClient } from '@/lib/sanity-write-client'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const token = searchParams.get('token')

  if (!token) {
    return new Response(
      renderHtml('Invalid Request', 'No opt-out token provided.'),
      { status: 400, headers: { 'Content-Type': 'text/html; charset=utf-8' } }
    )
  }

  try {
    // Query Sanity for sponsorPool entry with matching optOutToken
    const query = '*[_type == "sponsorPool" && optOutToken == $token][0]{ _id, company }'
    const params = { token } as Record<string, string>
    const sponsor = await sanityWriteClient.fetch(
      query,
      params
    ) as { _id: string; company: string } | null

    if (!sponsor) {
      console.warn('[SPONSOR] Opt-out: invalid token:', token)
      return new Response(
        renderHtml('Not Found', 'This opt-out link is invalid or has already been processed.'),
        { status: 404, headers: { 'Content-Type': 'text/html; charset=utf-8' } }
      )
    }

    // Set optedOut = true
    await sanityWriteClient.patch(sponsor._id).set({ optedOut: true }).commit()

    console.log('[SPONSOR] Opt-out processed for:', sponsor.company)

    return new Response(
      renderHtml(
        'Opted Out Successfully',
        `You have been successfully removed from CodingCat.dev sponsor outreach. You will no longer receive emails from us regarding sponsorship opportunities.`
      ),
      { status: 200, headers: { 'Content-Type': 'text/html; charset=utf-8' } }
    )
  } catch (error) {
    console.error('[SPONSOR] Opt-out error:', error)
    return new Response(
      renderHtml('Error', 'Something went wrong processing your opt-out. Please try again later.'),
      { status: 500, headers: { 'Content-Type': 'text/html; charset=utf-8' } }
    )
  }
}

function renderHtml(title: string, message: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title} — CodingCat.dev</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      margin: 0;
      background: #f5f5f5;
      color: #333;
    }
    .container {
      text-align: center;
      padding: 2rem;
      max-width: 500px;
      background: white;
      border-radius: 12px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    }
    h1 { color: #7c3aed; margin-bottom: 1rem; }
    p { line-height: 1.6; color: #666; }
  </style>
</head>
<body>
  <div class="container">
    <h1>${title}</h1>
    <p>${message}</p>
  </div>
</body>
</html>`
}
