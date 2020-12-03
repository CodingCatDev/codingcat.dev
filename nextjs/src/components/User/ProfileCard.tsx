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
        <div className="px-4 py-8 bg-white shadow sm:rounded-lg sm:px-10">
          <p>You're signed in. Email: {user.email}</p>
          <button
            onClick={() => signout()}
            type="button"
            className="relative inline-flex items-center px-4 py-2 text-sm font-medium text-white border border-transparent rounded-md shadow-sm bg-ccd-purples-500 hover:bg-ccd-purples-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-ccd-purples-800 focus:ring-ccd-purples-500"
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
