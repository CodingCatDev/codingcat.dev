import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { Auth } from 'aws-amplify';
import { CognitoHostedUIIdentityProvider } from '@aws-amplify/auth';
import '../configureAmplify';
export function SignIn() {
  const router = useRouter();
  useEffect(() => {
    checkUser();
    async function checkUser() {
      const user = Auth.currentAuthenticatedUser();
      console.log({ user });
    }
  }, [router]);

  return (
    <div>
      <button
        onClick={() =>
          Auth.federatedSignIn({
            provider: CognitoHostedUIIdentityProvider.Google,
          })
        }
      >
        Sign in with Google
      </button>
      <button
        onClick={() =>
          Auth.federatedSignIn({
            provider: CognitoHostedUIIdentityProvider.Facebook,
          })
        }
      >
        Sign in with Facebook
      </button>

      <button onClick={() => Auth.signOut()}>Sign Out</button>
    </div>
  );
}
