import SettingsLinks from '@/components/settings/SettingsLinks';
import { useSigninCheck } from 'reactfire';
import { AuthWrapper } from '@/components/FirebaseAuth';
import dynamic from 'next/dynamic';
import Link from 'next/link';

const UserSettings = dynamic(
  () => import('@/components/settings/UserSettings'),
  {
    ssr: false,
  }
);

export default function Profile(): JSX.Element {
  const { data: signInCheckResult } = useSigninCheck();
  const notSignedIn = () => {
    return (
      <section className="grid self-start justify-center gap-10 p-10 lg:grid-cols-settings">
        <section>
          <h2 className="mb-4 font-sans text-4xl vertical-text-clip">
            Settings
          </h2>
          <SettingsLinks />
        </section>
        <div className="grid">
          <div>
            <p className="text-2xl">Please sign in to change your settings.</p>
            <Link href="/user/profile">
              <a className="mt-4 btn-primary">Sign In </a>
            </Link>
          </div>
        </div>
      </section>
    );
  };

  return (
    <AuthWrapper fallback={notSignedIn()}>
      <section className="grid self-start w-full gap-10 p-10 lg:grid-cols-settings">
        <section>
          <h2 className="mb-4 font-sans text-4xl vertical-text-clip">
            Settings
          </h2>
          <SettingsLinks />
        </section>
        {signInCheckResult?.user && (
          <div className="flex flex-col">
            <UserSettings user={signInCheckResult.user} />
          </div>
        )}
      </section>
    </AuthWrapper>
  );
}
