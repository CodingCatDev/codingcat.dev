export const fetchCache = 'force-no-store'

import { NextResponse } from 'next/server'
import { sanityWriteClient } from '@/lib/sanity-write-client'
import { generateOutreachEmail } from '@/lib/sponsor/gemini-outreach'
import { sendSponsorEmail } from '@/lib/sponsor/email-service'
import type { SponsorPoolEntry } from '@/lib/sponsor/gemini-outreach'

const MAX_PER_RUN = 5
const COOLDOWN_DAYS = 14

export async function POST(request: Request) {
  // Auth: Bearer token check against CRON_SECRET
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    console.error('[SPONSOR] Outreach cron: unauthorized request')
    return new Response('Unauthorized', { status: 401 })
  }

  try {
    console.log('[SPONSOR] Starting outbound sponsor outreach cron...')

    // Calculate the cutoff date for cooldown
    const cutoffDate = new Date()
    cutoffDate.setDate(cutoffDate.getDate() - COOLDOWN_DAYS)
    const cutoffISO = cutoffDate.toISOString()

    // Query Sanity for eligible sponsor pool entries
    const query = `*[
      _type == "sponsorPool"
      && optedOut != true
      && (
        !defined(lastContactedAt)
        || lastContactedAt < $cutoffDate
      )
    ] | order(relevanceScore desc) [0...${MAX_PER_RUN - 1}] {
      _id,
      companyName,
      contactName,
      contactEmail,
      website,
      category,
      relevanceScore,
      optOutToken
    }`

    const sponsors: SponsorPoolEntry[] = await sanityWriteClient.fetch(query, {
      cutoffDate: cutoffISO,
    })

    console.log(`[SPONSOR] Found ${sponsors.length} eligible sponsors for outreach`)

    if (sponsors.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'No eligible sponsors for outreach',
        processed: 0,
      })
    }

    const results: Array<{ companyName: string; success: boolean; error?: string }> = []

    for (const sponsor of sponsors) {
      try {
        // Generate personalized outreach email
        const email = await generateOutreachEmail(sponsor)

        // Send the email (stubbed)
        const sendResult = await sendSponsorEmail(
          sponsor.contactEmail,
          email.subject,
          email.body
        )

        if (sendResult.success) {
          // Update lastContactedAt on the sponsor pool entry
          await sanityWriteClient
            .patch(sponsor._id)
            .set({ lastContactedAt: new Date().toISOString() })
            .commit()

          // Create a sponsorLead with source='outbound'
          await sanityWriteClient.create({
            _type: 'sponsorLead',
            companyName: sponsor.companyName,
            contactName: sponsor.contactName,
            contactEmail: sponsor.contactEmail,
            source: 'outbound',
            status: 'contacted',
            threadId: crypto.randomUUID(),
            lastEmailAt: new Date().toISOString(),
          })

          results.push({ companyName: sponsor.companyName, success: true })
          console.log(`[SPONSOR] Outreach sent to: ${sponsor.companyName}`)
        } else {
          results.push({
            companyName: sponsor.companyName,
            success: false,
            error: 'Email send failed',
          })
        }
      } catch (error) {
        const errorMsg = error instanceof Error ? error.message : String(error)
        console.error(`[SPONSOR] Outreach failed for ${sponsor.companyName}:`, errorMsg)
        results.push({ companyName: sponsor.companyName, success: false, error: errorMsg })
      }
    }

    const successCount = results.filter((r) => r.success).length
    console.log(`[SPONSOR] Outreach cron complete: ${successCount}/${results.length} successful`)

    return NextResponse.json({
      success: true,
      processed: results.length,
      successful: successCount,
      results,
    })
  } catch (error) {
    console.error('[SPONSOR] Outreach cron error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
