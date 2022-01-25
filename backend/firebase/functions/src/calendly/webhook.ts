import * as functions from 'firebase-functions';
import {
  queryPurrfectGuest,
  createPurrfectGuest,
  queryPurrfectCompany,
  createPurrfectCompany,
  createPurrfectPage,
  queryPurrfectPageByCalendarId,
  patchPurrfectPage,
} from './../utilities/notion';

import { getEvent, listEventInvitees } from './../utilities/calendly';

export const calendarPush = functions.https.onRequest(async (req, res) => {
  console.log('Headers', JSON.stringify(req.headers));
  console.log('Body', JSON.stringify(req.body));
  const webhookPayload: WebhookPayload = req.body;

  // TODO: Implement https://calendly.stoplight.io/docs/api-docs/ZG9jOjIxNzQ1ODY-webhook-signatures
  if (!webhookPayload) {
    res.status(401).send('Unauthorized');
    return;
  }

  // Get Calendly Event Details
  const eventUuid = webhookPayload.payload.event.split('/').slice(-1).pop();
  if (!eventUuid) {
    res.status(200).send('Missing event uuid');
    return;
  }

  if (webhookPayload.event !== 'invitee.created') {
    functions.logger.info('Not Create Event');
    res.status(200).send('Not Create Event');
    return;
  }

  try {
    const calendlyEvent = await getEvent(eventUuid);
    const calendlyInvitees = await listEventInvitees(eventUuid);

    // Check if calendar event already created.
    console.log(
      'Searching for Pod with calendarid: ',
      webhookPayload.payload.event
    );
    const purrfectPageRes = await queryPurrfectPageByCalendarId(
      webhookPayload.payload.event
    );
    if (purrfectPageRes?.results.length > 0) {
      console.log('Pod found', JSON.stringify(purrfectPageRes));
      const purrfectPage = purrfectPageRes?.results?.[0];
      console.log(
        'Updating pod with time: ',
        calendlyEvent.resource.start_time
      );
      const purrfectPagePatchRes = await patchPurrfectPage({
        page_id: purrfectPage.id,
        properties: {
          'Recording Date': {
            date: {
              start: new Date(
                calendlyEvent.resource.start_time
              ).toLocaleString('en-US', { timeZone: 'America/New_York' }),
              end: null,
              time_zone: 'America/New_York',
            },
          },
        },
      });

      console.log('Patched', JSON.stringify(purrfectPagePatchRes));
      res.status(200).send('updated');
    }

    // Check if Notion Company exists, if not create
    const company =
      calendlyInvitees?.collection?.[0]?.questions_and_answers?.find(
        (q) => q.question === 'Company'
      )?.answer || '';
    console.log('Searching for company: ', company);
    const companyRes = await queryPurrfectCompany(company);
    const companyIds: string[] = [];
    if (companyRes?.results.length > 0) {
      for (const c of companyRes?.results) {
        companyIds.push(c.id);
      }
      console.log('Found Companies', JSON.stringify(companyIds));
    } else {
      console.log('Creating Company');
      const companyCreateRes = await createPurrfectCompany({ name: company });
      companyIds.push(companyCreateRes.id);
    }
    const email = calendlyInvitees?.collection?.[0]?.email || '';
    const guest = calendlyInvitees?.collection?.[0]?.name || '';
    const twitterHandle =
      calendlyInvitees?.collection?.[0]?.questions_and_answers?.find(
        (q) => q.question === 'Twitter Handle'
      )?.answer || '';

    // Check if Notion Guest exists, if not create
    console.log('Searching for guest by email: ', email);
    const guestRes = await queryPurrfectGuest(email);
    let guestId = '';
    if (guestRes?.results.length > 0) {
      guestId = guestRes.results?.[0].id;
      console.log('Guest Found: ', guestId);
    } else {
      const newGuest = {
        name: guest,
        email,
        companyIds,
        twitterHandle,
      };
      console.log('Creating guest: ', JSON.stringify(newGuest));
      const guestCreateRes = await createPurrfectGuest(newGuest);
      guestId = guestCreateRes.id;
      console.log('Guest Created:', guestId);
    }

    // Create new Podcast Page
    const newPodcast = {
      guestIds: [guestId],
      companyIds,
      recordingDate: new Date(calendlyEvent.resource.start_time),
      calendarid: webhookPayload.payload.event,
    };
    console.log('Creating Podcast with values: ', JSON.stringify(newPodcast));
    const podcastCreateRes = await createPurrfectPage(newPodcast);
    console.log('Created Podcast', JSON.stringify(podcastCreateRes));
    res.status(200);
  } catch (e) {
    return functions.logger.error('Error', e);
  }
});

export interface QuestionsAndAnswer {
  answer: string;
  position: number;
  question: string;
}

export interface Tracking {
  utm_campaign?: any;
  utm_source?: any;
  utm_medium?: any;
  utm_content?: any;
  utm_term?: any;
  salesforce_uuid?: any;
}

export interface Payload {
  cancel_url: string;
  created_at: string;
  email: string;
  event: string;
  first_name?: any;
  last_name?: any;
  name: string;
  new_invitee?: any;
  old_invitee?: any;
  payment?: any;
  questions_and_answers: QuestionsAndAnswer[];
  reschedule_url: string;
  rescheduled: boolean;
  status: string;
  text_reminder_number?: any;
  timezone: string;
  tracking: Tracking;
  updated_at: string;
  uri: string;
}

export interface WebhookPayload {
  created_at: string;
  event: string;
  payload: Payload;
}
