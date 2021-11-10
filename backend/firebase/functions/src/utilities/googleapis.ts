import { google } from 'googleapis';
import { PubSub } from '@google-cloud/pubsub';

import {
  clientId,
  clientSecret,
  redirectUri,
  calendarRefreshToken,
} from './../config/config';
const projectId = process.env.GCP_PROJECT || process.env.GCLOUD_PROJECT;

// Clients
export const oauth2Client = new google.auth.OAuth2(
  clientId,
  clientSecret,
  redirectUri
);
export const pubSubClient = new PubSub({ projectId });

oauth2Client.setCredentials({ refresh_token: calendarRefreshToken });
const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

// Gets my calendar events for the past 12 hours.
export const getCalendarEvent = async () => {
  if (!calendarRefreshToken) {
    console.error('Missing Refresh Token');
    return [];
  }
  const result = await calendar.events.list({
    q: 'calendly',
    calendarId: 'alex@codingcat.dev',
    orderBy: 'updated',
    updatedMin: new Date(Date.now() - 43200000).toISOString(), // About 12 hours worth
  });
  return result?.data?.items || [];
};

export const sendTopic = async (topicId: string, msg: object) => {
  console.log('publishing to ', topicId);
  console.log('message: ', msg);
  const dataBuffer = Buffer.from(JSON.stringify(msg));
  const messageId = await pubSubClient.topic(topicId).publish(dataBuffer);
  console.log(`Message ${messageId} published.`);
};
