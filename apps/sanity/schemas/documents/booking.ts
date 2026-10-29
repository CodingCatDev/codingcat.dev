import {defineField, defineType} from 'sanity'
import {HiOutlineCalendar} from 'react-icons/hi'

export default defineType({
  name: 'booking',
  title: 'Podcast & Sponsor Booking',
  type: 'document',
  icon: HiOutlineCalendar,
  fields: [
    defineField({
      name: 'guestName',
      title: 'Guest Full Legal Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'guestEmail',
      title: 'Guest Email',
      type: 'string',
      validation: (Rule) => Rule.required().email(),
    }),
    defineField({
      name: 'company',
      title: 'Company / Flagship Project',
      type: 'string',
    }),
    defineField({
      name: 'socialUrl',
      title: 'Social Handle or Portfolio URL',
      type: 'url',
    }),
    defineField({
      name: 'bookingSource',
      title: 'Booking Source',
      type: 'string',
      options: {
        list: [
          {title: 'Direct Book (codingcat.dev/book)', value: 'direct'},
          {title: 'Passionfroot Creator API', value: 'passionfroot'},
        ],
      },
      initialValue: 'direct',
    }),
    defineField({
      name: 'sessionType',
      title: 'Session Type',
      type: 'string',
      options: {
        list: [
          {title: '45m Recording Session', value: 'recording-45m'},
          {title: '15m Pre-Meeting Only (Google Meet)', value: 'pre-meeting-15m'},
          {title: '45m Recording + 15m Google Meet Pre-Meeting', value: 'recording-with-pre-meeting'},
        ],
      },
      initialValue: 'recording-45m',
    }),
    defineField({
      name: 'track',
      title: 'Booking Track',
      type: 'string',
      options: {
        list: [
          {title: 'Editorial Guest Application (Free / Review Queue)', value: 'editorial'},
          {title: 'Sponsored Podcast & Multi-Channel Showcase ($2,000 Fast-Track)', value: 'sponsored'},
          {title: 'Full-Stack Launch Bundle ($3,500 Kickoff & Demo)', value: 'full-stack-launch'},
          {title: '15m Pre-Meeting / Sponsor Kickoff (Google Meet)', value: 'sponsor-kickoff'},
        ],
      },
      initialValue: 'editorial',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'status',
      title: 'Booking Status',
      type: 'string',
      options: {
        list: [
          {title: 'Pending Review / Calendar Hold (Opaque Busy)', value: 'pending'},
          {title: 'Approved (StreamYard Sent)', value: 'approved'},
          {title: 'Scheduled on Google Calendar', value: 'scheduled'},
          {title: 'Confirmed', value: 'confirmed'},
          {title: 'Recorded', value: 'recorded'},
          {title: 'Published', value: 'published'},
          {title: 'Declined / Cancelled', value: 'cancelled'},
        ],
      },
      initialValue: 'pending',
    }),
    defineField({
      name: 'slotStartAt',
      title: 'Requested Recording Slot (UTC ISO)',
      type: 'datetime',
    }),
    defineField({
      name: 'recordingUrl',
      title: 'Recording Studio URL (StreamYard)',
      type: 'url',
      initialValue: 'https://streamyard.com/c4kv26is93',
    }),
    defineField({
      name: 'preMeetingStatus',
      title: 'Pre-Meeting Status (15m Google Meet)',
      type: 'string',
      options: {
        list: [
          {title: 'Not Needed', value: 'not_needed'},
          {title: 'Requested by Host / Guest', value: 'requested'},
          {title: 'Scheduled on Google Meet', value: 'scheduled'},
          {title: 'Completed', value: 'completed'},
          {title: 'Bypassed by Host', value: 'bypassed'},
        ],
      },
      initialValue: 'not_needed',
    }),
    defineField({
      name: 'preMeetingSlotStartAt',
      title: '15m Pre-Meeting Slot (UTC ISO)',
      type: 'datetime',
    }),
    defineField({
      name: 'preMeetingGoogleEventId',
      title: 'Pre-Meeting Google Calendar Event ID',
      type: 'string',
    }),
    defineField({
      name: 'preMeetingMeetUrl',
      title: '15m Pre-Meeting Google Meet URL',
      type: 'url',
    }),
    defineField({
      name: 'topics',
      title: 'Proposed Topics & Key Talking Points',
      type: 'text',
    }),
    defineField({
      name: 'appointmentScheduleUrl',
      title: 'Google Calendar Event / Booking Link',
      type: 'url',
      initialValue: 'https://codingcat.dev/book',
    }),
    defineField({
      name: 'googleCalendarEventId',
      title: 'Google Calendar Event ID',
      type: 'string',
    }),
    defineField({
      name: 'signatureMode',
      title: 'E-SIGN Signature Mode',
      type: 'string',
      options: {
        list: [
          {title: 'Drawn Canvas Signature', value: 'draw'},
          {title: 'Typed Legal Signature', value: 'type'},
        ],
      },
    }),
    defineField({
      name: 'signatureData',
      title: 'E-SIGN Signature Data (Typed Name or Base64 PNG)',
      type: 'text',
    }),
    defineField({
      name: 'signedAt',
      title: 'E-SIGN Executed At',
      type: 'datetime',
    }),
    defineField({
      name: 'consentRecording',
      title: 'Consent: Recording & Distribution',
      type: 'boolean',
      initialValue: true,
    }),
    defineField({
      name: 'consentCommercial',
      title: 'Consent: Commercial & Sponsorship Use',
      type: 'boolean',
      initialValue: true,
    }),
    defineField({
      name: 'consentLikeness',
      title: 'Consent: Likeness & Social Clips',
      type: 'boolean',
      initialValue: true,
    }),
    defineField({
      name: 'portalToken',
      title: 'Linked Deal Room Token',
      type: 'string',
    }),
    defineField({
      name: 'sponsorLeadRef',
      title: 'Linked Sponsor Lead',
      type: 'reference',
      to: [{type: 'sponsorLead'}],
    }),
    defineField({
      name: 'passionfrootCollaborationId',
      title: 'Passionfroot Collaboration ID',
      type: 'string',
    }),
    defineField({
      name: 'passionfrootPlacementId',
      title: 'Passionfroot Placement ID',
      type: 'string',
    }),
    defineField({
      name: 'passionfrootConversationId',
      title: 'Passionfroot Conversation ID',
      type: 'string',
    }),
    defineField({
      name: 'sharedAssets',
      title: 'Sanity Media Library Vault Assets',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({name: 'title', title: 'Asset Title / Filename', type: 'string'}),
            defineField({
              name: 'category',
              title: 'Category',
              type: 'string',
              options: {
                list: [
                  {title: 'Brand Logo / SVG', value: 'logo'},
                  {title: 'Talking Points / Brief', value: 'brief'},
                  {title: 'Slide Deck / Demo Assets', value: 'slides'},
                  {title: 'Contract / Legal', value: 'legal'},
                  {title: 'Raw Audio / Video / B-Roll', value: 'media'},
                ],
              },
            }),
            defineField({
              name: 'visibility',
              title: 'Visibility',
              type: 'string',
              options: {
                list: [
                  {title: 'Private to Deal Room (Token-Gated)', value: 'private'},
                  {title: 'Public Brand Asset', value: 'public'},
                ],
              },
              initialValue: 'private',
            }),
            defineField({
              name: 'uploadedBy',
              title: 'Uploaded By',
              type: 'string',
              options: {
                list: [
                  {title: 'Partner / Guest', value: 'partner'},
                  {title: 'CodingCat.dev Studio', value: 'codingcat'},
                  {title: 'Passionfroot Auto-Ingest', value: 'passionfroot'},
                ],
              },
              initialValue: 'partner',
            }),
            defineField({name: 'uploadedAt', title: 'Uploaded At', type: 'datetime'}),
            defineField({name: 'assetId', title: 'Sanity Asset ID', type: 'string'}),
            defineField({name: 'mimeType', title: 'MIME Type', type: 'string'}),
            defineField({name: 'fileSize', title: 'File Size (Bytes)', type: 'number'}),
            defineField({name: 'externalUrl', title: 'Direct / Proxied URL', type: 'url'}),
          ],
        },
      ],
    }),
  ],
  preview: {
    select: {
      title: 'guestName',
      company: 'company',
      track: 'track',
      status: 'status',
    },
    prepare({title, company, track, status}) {
      return {
        title: company ? `${title} (${company})` : title,
        subtitle: [track, status].filter(Boolean).join(' \u00b7 '),
      }
    },
  },
})
