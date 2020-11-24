import Head from "next/head";
import { useEffect, useState } from "react";
import { AmplifyAuthenticator, AmplifySignOut } from "@aws-amplify/ui-react";
import { AuthState, onAuthUIStateChange } from "@aws-amplify/ui-components";
import config from "../../configureAmplify";

export default function Admin() {
  const [authState, setAuthState] = useState<AuthState>();
  const [user, setUser] = useState<any | undefined>();
  console.log(`Login using`, config.aws_appsync_region);
  useEffect(() => {
    return onAuthUIStateChange((nextAuthState, authData) => {
      setAuthState(nextAuthState);
      setUser(authData);
    });
  }, []);
  return (
    <div>
      <Head>
        <title>Admin | CodingCatDev</title>
        <meta name="robots" content="noindex" />
      </Head>

      <main className="">
        {authState === AuthState.SignedIn && user ? (
          <div className="App">
            <div>Hello, {user.username}</div>
            <AmplifySignOut />
          </div>
        ) : (
          <AmplifyAuthenticator />
        )}
      </main>

      <footer></footer>
    </div>
  );
}
