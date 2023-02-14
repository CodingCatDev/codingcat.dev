import Image from "next/legacy/image";

import { useFirestore, useFirestoreDocData } from 'reactfire';
import { UserInfoExtended } from '@/models/user.model';
import { doc, DocumentReference } from 'firebase/firestore';

export default function AvatarProfile({
  user,
}: {
  user: UserInfoExtended;
}): JSX.Element {
  const firestore = useFirestore();
  const ref = doc(
    firestore,
    'profiles',
    user.uid
  ) as unknown as DocumentReference<UserInfoExtended | null>;
  const { status, data: dbProfile } =
    useFirestoreDocData<UserInfoExtended | null>(ref);
  return (
    <>
      {dbProfile && dbProfile?.photoURL ? (
        <Image
          src={dbProfile.photoURL}
          loader={() => dbProfile.photoURL || ''}
          unoptimized={true}
          layout="fixed"
          width="40"
          height="40"
          alt={
            dbProfile.displayName ? dbProfile.displayName : 'A Good Description'
          }
          className="w-8 h-8 rounded-full"
        />
      ) : (
        <Image
          src={user.photoURL || ''}
          loader={() => user.photoURL || ''}
          unoptimized={true}
          layout="fixed"
          width="40"
          height="40"
          alt={user.displayName ? user.displayName : 'A Good Description'}
          className="w-8 h-8 rounded-full"
        />
      )}
    </>
  );
}
