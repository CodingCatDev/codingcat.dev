import { Auth } from 'aws-amplify';
import { CognitoHostedUIIdentityProvider } from '@aws-amplify/auth';

function SocialSignIn() {
  return (
    <div className="flex flex-col">
      <button
        className="mt-10 focus:outline-none"
        onClick={() =>
          Auth.federatedSignIn({
            provider: CognitoHostedUIIdentityProvider.Google,
          })
        }
      >
        <div className="flex items-center justify-center p-2 border border-gray-300 rounded-full">
          <p className="ml-3">Sign in with Google</p>
        </div>
      </button>
      <button
        className="mt-4 focus:outline-none"
        onClick={() =>
          Auth.federatedSignIn({
            provider: CognitoHostedUIIdentityProvider.Facebook,
          })
        }
      >
        <div className="flex items-center justify-center p-2 border border-gray-300 rounded-full">
          <p className="ml-3">Sign in with Facebook</p>
        </div>
      </button>
    </div>
  );
}

export default SocialSignIn;
