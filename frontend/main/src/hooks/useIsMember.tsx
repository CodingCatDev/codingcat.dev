import { UserInfoExtended } from '@/models/user.model';
import {
  doc,
  DocumentReference,
  getFirestore,
  collection,
  query,
  where,
} from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { useFirestoreCollectionData, useFirestoreDocData } from 'reactfire';

export default function useIsMember(user: UserInfoExtended): {
  member: boolean;
  team: boolean;
} {
  const firestore = getFirestore();

  // Membership
  const [member, setMember] = useState(false);
  const memberRef = collection(
    firestore,
    'customers',
    user.uid,
    'subscriptions'
  );
  const memberQuery = query(
    memberRef,
    where('status', '==', 'active'),
    where('role', 'in', ['monthly', 'yearly'])
  );
  const { status: memberStatus, data: members } =
    useFirestoreCollectionData(memberQuery);

  useEffect(() => {
    if (members) {
      members.map((s) => (s.length === 0 ? setMember(false) : setMember(true)));
    }
  }, [members]);

  // Team
  const [team, setTeam] = useState(false);
  const teamRef = doc(
    firestore,
    'users',
    user.uid
  ) as unknown as DocumentReference<UserInfoExtended | null>;
  const { status: teamStatus, data: userData } =
    useFirestoreDocData<UserInfoExtended | null>(teamRef);
  useEffect(() => {
    if (
      userData &&
      userData.roles &&
      userData.roles.some((r) => ['admin', 'editor', 'author'].indexOf(r) >= 0)
    ) {
      setTeam(true);
    } else {
      setTeam(false);
    }
  }, [userData]);
  return { member, team };
}
