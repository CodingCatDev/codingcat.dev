import Link from 'next/link';
import dynamic from 'next/dynamic';

import { useUser } from '@/utils/auth/useUser';

const FirebaseAuth = dynamic(() => import('@/components/FirebaseAuth'), {
  ssr: false,
  loading: () => <p>Playing with yarn...</p>,
});

export default function UserSignin() {
  const { user, signout }: { user: any; signout: any } = useUser();

  return (
    <>
      {user ? (
        <div className="grid gap-4 px-4 py-8 bg-white shadow-2xl sm:rounded-lg sm:px-10">
          <p>You`&#39;`re signed in.</p>
          <p>
            Email: <span className="font-bold">{user.email}</span>
          </p>
          <button
            onClick={() => signout()}
            type="button"
            className="btn-primary"
          >
            <span>Sign Out</span>
          </button>
        </div>
      ) : (
        <FirebaseAuth />
      )}
    </>
  );
}
