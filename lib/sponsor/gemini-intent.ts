import { GoogleGenerativeAI } from '@google/generative-ai'

const SPONSORSHIP_TIERS = [
  'dedicated-video',
  'mid-roll-ad',
  'shout-out',
  'blog-newsletter',
  'video-series',
] as const

export interface SponsorIntent {
  companyName: string
  contactName: string
  intent: string
  suggestedTiers: string[]
  urgency: 'low' | 'medium' | 'high'
}

/**
 * Uses Gemini Flash to parse inbound sponsor emails/messages
 * and extract structured data for creating a sponsorLead.
 */
export async function extractSponsorIntent(message: string): Promise<SponsorIntent> {
  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) {
    console.warn('[SPONSOR] GEMINI_API_KEY not set — returning default intent extraction')
    return {
      companyName: '',
      contactName: '',
      intent: message.slice(0, 500),
      suggestedTiers: [],
      urgency: 'medium',
    }
  }

  const genAI = new GoogleGenerativeAI(apiKey)
  const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' })

  const prompt = `You are analyzing an inbound sponsorship inquiry for CodingCat.dev, a developer education platform with YouTube videos, podcasts, blog posts, and newsletters.

Available sponsorship tiers:
- dedicated-video ($4,000) — Full dedicated video about the sponsor's product
- mid-roll-ad ($1,800) — Integrated mid-roll advertisement in a video
- shout-out ($900) — Quick shout-out mention in a video
- blog-newsletter ($500) — Blog post or newsletter mention
- video-series (custom pricing) — Multi-video series partnership

Analyze this message and extract:
1. companyName — The company name (if mentioned)
2. contactName — The contact person's name (if mentioned)
3. intent — A brief summary of what they want (1-2 sentences)
4. suggestedTiers — Which tiers seem relevant based on their message (array of tier values from the list above)
5. urgency — How urgent this seems: "low", "medium", or "high"

Respond ONLY with valid JSON, no markdown formatting:
{"companyName": "", "contactName": "", "intent": "", "suggestedTiers": [], "urgency": "medium"}

Message to analyze:
${message}`

  try {
    const result = await model.generateContent(prompt)
    const response = result.response
    const text = response.text().trim()

    // Strip any markdown code fences if present
    const jsonStr = text.replace(/^```json?\n?/i, '').replace(/\n?```$/i, '').trim()
    const parsed = JSON.parse(jsonStr) as SponsorIntent

    // Validate suggestedTiers against known tiers
    parsed.suggestedTiers = (parsed.suggestedTiers || []).filter((t: string) =>
      (SPONSORSHIP_TIERS as readonly string[]).includes(t)
    )

    // Validate urgency
    if (!['low', 'medium', 'high'].includes(parsed.urgency)) {
      parsed.urgency = 'medium'
    }

    console.log('[SPONSOR] Gemini intent extraction successful:', {
      companyName: parsed.companyName,
      tiers: parsed.suggestedTiers,
      urgency: parsed.urgency,
    })

    return parsed
  } catch (error) {
    console.error('[SPONSOR] Gemini intent extraction failed:', error)
    return {
      companyName: '',
      contactName: '',
      intent: message.slice(0, 500),
      suggestedTiers: [],
      urgency: 'medium',
    }
  }
}
