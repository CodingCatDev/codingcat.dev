import { useEffect, useState } from 'react';
import Head from 'next/head';
import Layout from '@/layout/Layout';

import { Site } from '@/models/site.model';
import { getSite } from '@/services/serversideApi';

import { Auth } from 'aws-amplify';

import {
  SignIn,
  SignUp,
  Profile as ProfileComponent,
  ForgotPassword,
  ForgotPasswordSubmit,
  ConfirmSignUp,
} from '@codingcatdev/shared';

export default function Profile({ site }: { site: Site | null }): JSX.Element {
  const [uiState, setUiState] = useState('');
  const [formState, setFormState] = useState({
    email: '',
    password: '',
    authCode: '',
  });
  const { email, password, authCode } = formState;
  useEffect(() => {
    checkUser();
  }, []);
  async function checkUser() {
    console.log('checking user...');
    try {
      setUiState('loading');
      await Auth.currentAuthenticatedUser();
      setUiState('signedIn');
    } catch (err) {
      setUiState('signIn');
    }
  }
  function onChange(e: any) {
    setFormState({ ...formState, [e.target.name]: e.target.value });
  }
  async function signUp() {
    try {
      await Auth.signUp({ username: email, password, attributes: { email } });
      setUiState('confirmSignUp');
    } catch (err) {
      console.log({ err });
    }
  }
  async function confirmSignUp() {
    try {
      await await Auth.confirmSignUp(email, authCode);
      await Auth.signIn(email, password);
      setUiState('signedIn');
    } catch (err) {
      console.log({ err });
    }
  }
  async function signIn() {
    try {
      await Auth.signIn(email, password);
      setUiState('signedIn');
    } catch (err) {
      console.log({ err });
    }
  }
  async function forgotPassword() {
    try {
      await Auth.forgotPassword(email);
      setUiState('forgotPasswordSubmit');
    } catch (err) {
      console.log({ err });
    }
  }
  async function forgotPasswordSubmit() {
    await Auth.forgotPasswordSubmit(email, authCode, password);
    setUiState('signIn');
  }

  return (
    <Layout site={site}>
      <Head>
        <title>Profile | CodingCatDev</title>
      </Head>
      <div className="min-h-screen bg-gray-50">
        <div className="flex flex-col items-center">
          <div className="max-w-full sm:w-540 mt-14">
            <div className="mb-8">
              <p className="pl-4 text-2xl font-semibold tracking-tight">
                amplify
              </p>
            </div>
            <div className="px-16 bg-white rounded py-14 shadow-form">
              {!uiState ||
                (uiState === 'loading' && (
                  <p className="font-bold">Loading ...</p>
                ))}
              {uiState === 'signedIn' && (
                <ProfileComponent setUiState={setUiState} onChange={onChange} />
              )}
              {uiState === 'signUp' && (
                <SignUp
                  setUiState={setUiState}
                  onChange={onChange}
                  signUp={signUp}
                />
              )}
              {uiState === 'confirmSignUp' && (
                <ConfirmSignUp
                  setUiState={setUiState}
                  onChange={onChange}
                  confirmSignUp={confirmSignUp}
                />
              )}
              {uiState === 'signIn' && (
                <SignIn
                  setUiState={setUiState}
                  onChange={onChange}
                  signIn={signIn}
                />
              )}
              {uiState === 'forgotPassword' && (
                <ForgotPassword
                  setUiState={setUiState}
                  onChange={onChange}
                  forgotPassword={forgotPassword}
                />
              )}
              {uiState === 'forgotPasswordSubmit' && (
                <ForgotPasswordSubmit
                  setUiState={setUiState}
                  onChange={onChange}
                  forgotPasswordSubmit={forgotPasswordSubmit}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
export async function getStaticProps(): Promise<{
  props: {
    site: Site | null;
  };
  revalidate: number;
}> {
  const site = await getSite();
  return {
    props: {
      site,
    },
    // Next.js will attempt to re-generate the page:
    // - When a request comes in
    // - At most once every second
    revalidate: 60, // In seconds
  };
}
