import * as functions from 'firebase-functions';
import {
  queryPurrfectGuest,
  createPurrfectGuest,
  createPurrfectPage,
  queryPurrfectPageByCalendarId,
} from './../utilities/notion.server';

import { getEvent, listEventInvitees } from './../utilities/calendly';
import { utcOffset } from '../utilities/date';
import { log, LogSeverity } from '../utilities/logging';
import { WebhookPayload } from '../models/calendly';

export const topicId = 'calendlyCreateNotionCard';

export const calendlyCreateNotionCardPubSub = functions.pubsub
  .topic(topicId)
  .onPublish(async (message, context) => {
    log(LogSeverity.DEBUG, 'The function was triggered at', context.timestamp);
    log(LogSeverity.DEBUG, 'The unique ID for the event is', context.eventId);
    log(LogSeverity.DEBUG, message);
    const webhookPayload: WebhookPayload = JSON.parse(
      JSON.stringify(message.json)
    );
    const eventUuid = webhookPayload?.payload?.event?.uuid;

    try {
      const calendarIds = await queryPurrfectPageByCalendarId(eventUuid);
      if (calendarIds?.results && calendarIds?.results?.length > 0) {
        log(LogSeverity.WARNING, `Skipping, already found ${eventUuid}`);
        return;
      }

      const calendlyEvent = await getEvent(eventUuid);
      log(LogSeverity.DEBUG, 'calendlyEvent', calendlyEvent);
      const calendlyInvitees = await listEventInvitees(eventUuid);
      log(
        LogSeverity.DEBUG,
        'calendlyInvitees',
        JSON.stringify(calendlyInvitees)
      );
      log(LogSeverity.DEBUG, 'calendlyInvitees', calendlyInvitees);

      const email = calendlyInvitees?.collection?.[0]?.email || '';
      const guest = calendlyInvitees?.collection?.[0]?.name || '';
      let twitterHandle =
        calendlyInvitees?.collection?.[0]?.questions_and_answers?.find(
          (q) => q.question === 'Twitter Handle'
        )?.answer || '';

      if (twitterHandle) {
        twitterHandle = twitterHandle.replace('@', '');
        const included = twitterHandle.includes('twitter.com');
        if (!included) {
          twitterHandle = `https://twitter.com/${twitterHandle}`;
        }
      }
      // Check if Notion Guest exists, if not create
      log(LogSeverity.DEBUG, 'Searching for guest by email: ', email);
      const guestRes = await queryPurrfectGuest(email);
      let guestId = '';
      if (guestRes?.results.length > 0) {
        guestId = guestRes.results?.[0].id;
        log(LogSeverity.DEBUG, 'Guest Found: ', guestId);
      } else {
        const newGuest = {
          name: guest,
          email,
          twitterHandle,
        };
        log(LogSeverity.DEBUG, 'Creating guest: ', JSON.stringify(newGuest));
        const guestCreateRes = await createPurrfectGuest(newGuest);
        guestId = guestCreateRes.id;
        log(LogSeverity.DEBUG, 'Guest Created:', guestId);
      }

      // Create new Podcast Page
      const newPodcast = {
        guestIds: [guestId],
        recordingDate: utcOffset(calendlyEvent.resource.start_time),
        calendarid: webhookPayload?.payload?.event?.uuid,
      };
      log(
        LogSeverity.DEBUG,
        'Creating Podcast with values: ',
        JSON.stringify(newPodcast)
      );
      const podcastCreateRes = await createPurrfectPage(newPodcast);
      log(
        LogSeverity.DEBUG,
        'Created Podcast',
        JSON.stringify(podcastCreateRes)
      );
    } catch (e) {
      return log(LogSeverity.ERROR, 'Error', e);
    }
  });
