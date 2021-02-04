import Amplify from 'aws-amplify';
import config from './aws-exports';

if (typeof window !== 'undefined') {
  config.oauth.redirectSignIn = `${window.location.origin}/`;
  config.oauth.redirectSignOut = `${window.location.origin}/`;
}

export function amplifyConfig() {
  Amplify.configure(config);
}
