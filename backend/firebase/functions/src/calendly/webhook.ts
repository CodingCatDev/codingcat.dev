import { good, log, LogSeverity } from './../utilities/logging';
import * as functions from 'firebase-functions';
import { WebhookPayload } from '../models/calendly';
import { sendTopic } from '../utilities/googleapis';
import { queryPurrfectPageByCalendarId } from '../utilities/notion';

const ccd = `e3f45196-30ad-4597-9e7d-6b4ae147ca00`;
const purrfect = `c4e6fdd3-768a-4157-846e-41b4ef5fae9d`;
// const sirens = `1d4ddcce-8fac-4dfa-805b-88f3be093990`;

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
