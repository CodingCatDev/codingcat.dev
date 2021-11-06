import * as functions from 'firebase-functions';

import { calendarChannelId } from '../config/config';
import { getCalendarEvent } from '../utilities/googleapis';

// const topicName = 'calendar-events';

export const calendarPush = functions.https.onRequest(async (req, res) => {
  console.log('Headers', JSON.stringify(req.headers));
  console.log('Body', JSON.stringify(req.body));
  const channelId = req.headers['x-goog-channel-id'] as string;
  if (!channelId || channelId !== calendarChannelId) {
    res.status(401).send('Unauthorized');
    return;
  }

  const events = await getCalendarEvent();

  // const dataBuffer = Buffer.from(JSON.stringify({}));
  // try {
  //   const messageId = await pubSubClient.topic(topicName).publish(dataBuffer);
  //   console.log(`Message ${messageId} published.`);
  //   res.status(200);
  //   return;
  // } catch (error) {
  //   console.error(`Received error while publishing`, JSON.stringify(error));
  //   return;
  // }
  if (events) {
    res.status(200).send(JSON.stringify(events));
  } else {
    res
      .status(200)
      .send(
        '<!DOCTYPE html> <html> <head> <meta name="google-site-verification" content="K73DNXByuf__Mi1c3V2IDGsNXg4V24UnP7SK9hY_k1A" /> </head> <body> </body> </html>'
      );
  }
});
