import * as functions from 'firebase-functions';
import { oauth2Client } from '../utilities/googleapis';

export const getCode = functions.https.onRequest(async (req, res) => {
  const scopes = ['https://www.googleapis.com/auth/calendar.events.readonly'];

  const url = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: scopes,
  });

  res.send(url);
});

export const getToken = functions.https.onRequest(async (req, res) => {
  const { tokens } = await oauth2Client.getToken(req.query.code as string);
  const { refresh_token } = tokens;
  res.send(refresh_token);
});
