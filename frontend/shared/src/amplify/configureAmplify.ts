import Amplify from 'aws-amplify';
import config from './aws-exports';

if (typeof window !== 'undefined') {
  config.oauth.redirectSignIn = `${window.location.origin}/user/profile/`;
  config.oauth.redirectSignOut = `${window.location.origin}/user/profile/`;
}

Amplify.configure(config);

export const amplifyConfig = config;
