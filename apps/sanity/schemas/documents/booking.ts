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
      name: 'track',
      title: 'Booking Track',
      type: 'string',
      options: {
        list: [
          {title: 'Editorial Guest Application (Free / Review Queue)', value: 'editorial'},
          {title: 'Sponsored Podcast & Multi-Channel Showcase ($2,000 Fast-Track)', value: 'sponsored'},
          {title: 'Full-Stack Launch Bundle ($3,500 Kickoff & Demo)', value: 'full-stack-launch'},
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
          {title: 'Pending Review / Deposit', value: 'pending'},
          {title: 'Approved / Deposit Paid', value: 'approved'},
          {title: 'Scheduled on Google Calendar', value: 'scheduled'},
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
      name: 'topics',
      title: 'Proposed Topics & Key Talking Points',
      type: 'text',
    }),
    defineField({
      name: 'appointmentScheduleUrl',
      title: 'Google Calendar Appointment Schedule Link',
      type: 'url',
      initialValue: 'https://calendar.app.google/s3B6PEqbVsGcY81MA',
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
