import Link from 'next/link';
import dynamic from 'next/dynamic';

import { useUser } from '@/utils/auth/useUser';

import Button from '@material-ui/core/Button';

const FirebaseAuth = dynamic(() => import('@/components/FirebaseAuth'), {
  ssr: false,
  loading: () => <p>Playing with yarn...</p>,
});

export default function UserSignin() {
  const { user, signout }: { user: any; signout: any } = useUser();

  return (
    <>
      {user ? (
        <div>
          <p>You're signed in.</p>
          <p>
            Email: <span style={{ fontWeight: 800 }}>{user.email}</span>
          </p>
          <Button onClick={() => signout()} variant="contained">
            <span>Sign Out</span>
          </Button>
        </div>
      ) : (
        <FirebaseAuth />
      )}
    </>
  );
}
