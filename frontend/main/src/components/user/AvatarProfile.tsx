import Image from 'next/image';

import { Dispatch, SetStateAction, useEffect } from 'react';
import { useFirestoreDocData } from 'reactfire';
import { getApp } from '@firebase/app';
import { UserInfoExtended } from '@/models/user.model';
import { doc, DocumentReference, getFirestore } from '@firebase/firestore';

export default function UserSignin({
  profile,
  setProfile,
}: {
  profile: UserInfoExtended;
  setProfile: Dispatch<SetStateAction<UserInfoExtended | null>>;
}): JSX.Element {
  const app = getApp();
  const firestore = getFirestore(app);
  const ref = doc(
    firestore,
    'profiles',
    profile.uid
  ) as unknown as DocumentReference<UserInfoExtended | null>;
  const { status, data: dbProfile } =
    useFirestoreDocData<UserInfoExtended | null>(ref);

  useEffect(() => {
    if (dbProfile) {
      setProfile((prevProfile) => {
        return { ...prevProfile, ...dbProfile };
      });
    }
  }, [dbProfile, setProfile]);

  return (
    <>
      {profile && profile.photoURL && (
        <Image
          src={profile.photoURL}
          loader={() => profile.photoURL || ''}
          unoptimized={true}
          layout="fixed"
          width="40"
          height="40"
          alt={profile.displayName ? profile.displayName : 'A Good Description'}
          className="w-8 h-8 rounded-full"
        />
      )}
    </>
  );
}
