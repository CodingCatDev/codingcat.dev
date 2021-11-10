import TwitterApi from 'twitter-api-v2';

import { twitterBearerToken } from '../config/config';

const twitterClient = new TwitterApi(twitterBearerToken);
// Tell typescript it's a readonly app
const roClient = twitterClient.readOnly;

export const getUserByUsername = (username: string) => {
  return roClient.v2.userByUsername(username, {
    'user.fields': 'profile_image_url',
  });
};
