import {
  queryPurrfectGuest,
  createPurrfectGuest,
  queryPurrfectCompany,
  createPurrfectCompany,
  createPurrfectPage,
  queryPurrfectPageByCalendarId,
  patchPurrfectPage,
} from './../utilities/notion';
import * as functions from 'firebase-functions';

import { calendarChannelId, projectId } from '../config/config';
import { getCalendarEvent, sendTopic } from '../utilities/googleapis';

const topic = 'calendarEvent';
const topicId = `projects/${projectId}/topics/${topic}`;

export const calendarPush = functions.https.onRequest(async (req, res) => {
  console.log('Headers', JSON.stringify(req.headers));
  console.log('Body', JSON.stringify(req.body));
  const channelId = req.headers['x-goog-channel-id'] as string;
  if (!channelId || channelId !== calendarChannelId) {
    res.status(401).send('Unauthorized');
    return;
  }

  try {
    const events = await getCalendarEvent();
    console.log('events', JSON.stringify(events));

    if (!events || events.length === 0) {
      console.log('no event to add to cloud topic');
      res.status(200);
      return;
    }

    const latest = events[events.length - 1];
    await sendTopic(topicId, latest);
    res
      .status(200)
      .send(
        '<!DOCTYPE html> <html> <head> <meta name="google-site-verification" content="K73DNXByuf__Mi1c3V2IDGsNXg4V24UnP7SK9hY_k1A" /> </head> <body> </body> </html>'
      );
  } catch (error) {
    console.error(`Received error while publishing`, JSON.stringify(error));
    res.status(500).send('Error occured.');
    return;
  }
});

export const calendarToNotionPubSub = functions.pubsub
  .topic(topic)
  .onPublish(async (message, context) => {
    console.log('The function was triggered at ', context.timestamp);
    console.log('The unique ID for the event is', context.eventId);
    let twitterHandle = '';
    let email = '';
    let guest = '';
    let company = '';
    try {
      const calendar = JSON.parse(JSON.stringify(message.json));
      twitterHandle = calendar.description
        .split('Twitter Handle: ')
        .slice(-1)[0]
        .split('\n')
        .slice(0)[0];
      guest = calendar.description
        .split('Guest: ')
        .slice(-1)[0]
        .split('\n')
        .slice(0)[0];
      company = calendar.description
        .split('Company: ')
        .slice(-1)[0]
        .split('\n')
        .slice(0)[0];
      email = calendar.attendees.filter(
        (a: { email: string }) =>
          a.email !== 'alex@codingcat.dev' &&
          a.email !== 'brittney@codingcat.dev'
      )?.[0]?.email;

      // Check if calendar event already created.
      console.log('Searching for Pod with calendarid: ', calendar.id);
      const purrfectPageRes = await queryPurrfectPageByCalendarId(calendar.id);
      if (purrfectPageRes?.results.length > 0) {
        console.log('Pod found', JSON.stringify(purrfectPageRes));
        const purrfectPage = purrfectPageRes?.results?.[0];
        console.log('Updating pod with time: ', calendar.start.dateTime);
        const purrfectPagePatchRes = await patchPurrfectPage({
          page_id: purrfectPage.id,
          properties: {
            'Recording Date': {
              date: {
                start: calendar.start.dateTime,
                end: null,
              },
            },
          },
        });

        console.log('Patched', JSON.stringify(purrfectPagePatchRes));
        return purrfectPagePatchRes;
      }

      // Check if Notion Company exists, if not create
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
        recordingDate: calendar.start.dateTime,
        calendarid: calendar.id,
      };
      console.log('Creating Podcast with values: ', JSON.stringify(newPodcast));
      const podcastCreateRes = await createPurrfectPage(newPodcast);
      console.log('Created Podcast', JSON.stringify(podcastCreateRes));
      return podcastCreateRes;
    } catch (e) {
      return functions.logger.error('Error', e);
    }
  });
