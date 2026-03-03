import { GoogleGenerativeAI } from '@google/generative-ai'

export interface SponsorPoolEntry {
  _id: string
  companyName: string
  contactName: string
  contactEmail: string
  website?: string
  category?: string
  relevanceScore?: number
  optOutToken?: string
}

export interface OutreachEmail {
  subject: string
  body: string
}

const RATE_CARD = `
CodingCat.dev Sponsorship Tiers:
- Dedicated Video ($4,000) — Full dedicated video about your product
- Integrated Mid-Roll Ad ($1,800) — Mid-roll advertisement in our videos
- Quick Shout-Out ($900) — Brief mention in our videos
- Blog Post / Newsletter ($500) — Featured in our blog or newsletter
- Video Series (Custom) — Multi-video partnership series

Our audience: 50K+ developers interested in web development, JavaScript/TypeScript, React, Next.js, and modern dev tools.
`.trim()

/**
 * Uses Gemini to generate a personalized cold outreach email
 * for a potential sponsor from the sponsor pool.
 */
export async function generateOutreachEmail(
  sponsor: SponsorPoolEntry,
  rateCard: string = RATE_CARD
): Promise<OutreachEmail> {
  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) {
    console.warn('[SPONSOR] GEMINI_API_KEY not set — returning template outreach email')
    return getTemplateEmail(sponsor, rateCard)
  }

  const genAI = new GoogleGenerativeAI(apiKey)
  const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' })

  const optOutUrl = sponsor.optOutToken
    ? `${process.env.NEXT_PUBLIC_URL || 'https://codingcat.dev'}/api/sponsor/opt-out?token=${sponsor.optOutToken}`
    : ''

  const prompt = `You are writing a personalized cold outreach email from Alex Patterson, the creator of CodingCat.dev, to a potential sponsor.

Sponsor details:
- Company: ${sponsor.companyName}
- Contact: ${sponsor.contactName}
- Website: ${sponsor.website || 'N/A'}
- Category: ${sponsor.category || 'Technology'}

Rate card:
${rateCard}

Guidelines:
- Be friendly, professional, and concise
- Reference their company/product specifically if possible
- Explain why their product would resonate with our developer audience
- Keep it under 200 words
- Don't be pushy — focus on mutual value
- End with a clear call to action (schedule a quick call)
${optOutUrl ? `- Include this opt-out link at the very bottom: ${optOutUrl}` : ''}

Respond ONLY with valid JSON, no markdown formatting:
{"subject": "...", "body": "..."}`

  try {
    const result = await model.generateContent(prompt)
    const response = result.response
    const text = response.text().trim()

    const jsonStr = text.replace(/^\`\`\`json?\n?/i, '').replace(/\n?\`\`\`$/i, '').trim()
    const parsed = JSON.parse(jsonStr) as OutreachEmail

    console.log('[SPONSOR] Gemini outreach email generated for:', sponsor.companyName)
    return parsed
  } catch (error) {
    console.error('[SPONSOR] Gemini outreach generation failed:', error)
    return getTemplateEmail(sponsor, rateCard)
  }
}

function getTemplateEmail(sponsor: SponsorPoolEntry, rateCard: string): OutreachEmail {
  const optOutUrl = sponsor.optOutToken
    ? `${process.env.NEXT_PUBLIC_URL || 'https://codingcat.dev'}/api/sponsor/opt-out?token=${sponsor.optOutToken}`
    : ''

  return {
    subject: `Partnership opportunity with CodingCat.dev — ${sponsor.companyName}`,
    body: `Hi ${sponsor.contactName},

I'm Alex Patterson, creator of CodingCat.dev — a developer education platform reaching 50K+ developers through YouTube, podcasts, and newsletters.

I think ${sponsor.companyName} would be a great fit for our audience of web developers who are always looking for tools to improve their workflow.

Here are our current sponsorship options:

${rateCard}

Would you be open to a quick 15-minute call to explore how we could work together?

Best,
Alex Patterson
CodingCat.dev
${optOutUrl ? `\n---\nDon't want to hear from us? Opt out: ${optOutUrl}` : ''}`,
  }
}
