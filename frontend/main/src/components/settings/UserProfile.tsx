import { UserInfoExtended } from '@/models/user.model';
import UserProfileCloudinaryUpload from '@/components/user/UserProfileCloudinaryUpload';
import { useFirestore, useFirestoreDocData } from 'reactfire';
import { doc, setDoc, DocumentReference } from 'firebase/firestore';

export default function UserProfile({
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
  const { status, data: profile } =
    useFirestoreDocData<UserInfoExtended | null>(ref);

  function onProfileChange(e: React.ChangeEvent<HTMLInputElement>): void {
    const profileUpdate = {
      ...profile,
      [e.target.id]: e.target.value,
    } as UserInfoExtended;
    setDoc(ref, profileUpdate, { merge: true });
  }

  function onBasicInfoChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ): void {
    const profileUpdate = {
      ...profile,
      basicInfo: {
        [e.target.id]: e.target.value,
      },
    } as UserInfoExtended;
    setDoc(ref, profileUpdate, { merge: true });
  }

  if (!profile || !user) {
    return (
      <>
        <h2>Fetching Profile...</h2>
      </>
    );
  }

  return (
    <section className="grid gap-4">
      <section className="grid gap-2 p-4 rounded-md bg-primary-900 text-basics-50">
        <h2 className="font-sans text-2xl">User</h2>
        <form className="grid gap-4">
          <div className="grid gap-4">
            {profile.photoURL ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                className="w-24"
                src={profile.photoURL}
                alt={
                  profile.displayName
                    ? profile.displayName
                    : 'A Good Description'
                }
              />
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                className="w-24"
                src="/static/images/avatar.png"
                alt="Avatar Image Placeholder"
              />
            )}
            <UserProfileCloudinaryUpload profile={profile} user={user} />
          </div>
          <div className="grid gap-1">
            <label htmlFor="name">Name</label>
            <input
              id="displayName"
              type="text"
              placeholder="name of user"
              onChange={onProfileChange}
              value={profile.displayName || ''}
            />
          </div>
          <div className="grid gap-1">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              placeholder="email of user"
              onChange={onProfileChange}
              value={profile.email || ''}
            />
          </div>
        </form>
      </section>
      <section className="grid gap-4 p-4 rounded-md bg-primary-900 text-basics-50">
        <h2 className="font-sans text-2xl">Basic Info</h2>
        <form className="grid gap-4">
          <div className="grid gap-1">
            <label htmlFor="location">Location</label>
            <input
              id="location"
              type="text"
              placeholder="location"
              onChange={onBasicInfoChange}
              value={profile.basicInfo?.location || ''}
            />
          </div>
          <div className="grid gap-1">
            <label htmlFor="website">Website</label>
            <input
              id="website"
              type="url"
              placeholder="website"
              onChange={onBasicInfoChange}
              value={profile.basicInfo?.website || ''}
            />
          </div>
          <div className="grid gap-1">
            <label htmlFor="about">About You</label>
            <textarea
              id="about"
              placeholder="about you"
              onChange={onBasicInfoChange}
              value={profile.basicInfo?.about || ''}
            />
          </div>
        </form>
      </section>
    </section>
  );
}
