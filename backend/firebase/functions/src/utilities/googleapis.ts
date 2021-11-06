import { google } from 'googleapis';

import {
  clientId,
  clientSecret,
  redirectUri,
  calendarRefreshToken,
} from './../config/config';

export const oauth2Client = new google.auth.OAuth2(
  clientId,
  clientSecret,
  redirectUri
);
const projectId = process.env.GCP_PROJECT || process.env.GCLOUD_PROJECT;
oauth2Client.setCredentials(calendarRefreshToken);
const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

import { PubSub } from '@google-cloud/pubsub';
export const pubSubClient = new PubSub({ projectId });
export const getCalendarEvent = () => {
  return calendar.events.list({
    calendarId: 'alex@codingcat.dev',
    orderBy: 'updated',
    updatedMin: new Date(Date.now() - 60000).toISOString(),
  });
};
