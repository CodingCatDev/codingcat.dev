import { good, log, LogSeverity } from './../utilities/logging';
import * as functions from 'firebase-functions';
import { WebhookPayload } from '../models/calendly';
import { sendTopic } from '../utilities/googleapis';
import { queryPurrfectPageByCalendarId } from '../utilities/notion.server';
import { ccd, purrfect } from '../utilities/calendly';

export const topicId = 'calendlyCreateNotionCard';

export const calendlyWebook = functions.https.onRequest(async (req, res) => {
  log(LogSeverity.DEBUG, 'Headers', req.headers);
  log(LogSeverity.DEBUG, req.body);
  const webhookPayload: WebhookPayload = req.body;

  // TODO: Implement https://calendly.stoplight.io/docs/api-docs/ZG9jOjIxNzQ1ODY-webhook-signatures
  if (!webhookPayload) {
    good(res, 'No payload');
    return;
  }

  // Get Calendly Event Details
  const eventUuid = webhookPayload?.payload?.event?.uuid;
  if (!eventUuid) {
    good(res, `Missing event uuid`);
    return;
  }
  if (webhookPayload.event !== 'invitee.created') {
    good(res, 'Not Create Event');
    return;
  }
  const eventType = webhookPayload?.payload?.event_type?.uuid;
  if (eventType !== ccd && eventType !== purrfect) {
    good(res, 'Not a Code with Coding Cat or Purrfect.dev Event');
    return;
  }

  const calendarIds = await queryPurrfectPageByCalendarId(eventUuid);
  if (calendarIds?.results && calendarIds?.results?.length > 0) {
    good(res, `Skipping, already found ${eventUuid}`);
    return;
  }
  await sendTopic(topicId, webhookPayload);
  good(res, `Sent Topic: ${topicId}`);
});
