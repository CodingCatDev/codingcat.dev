import { useEffect, useState } from 'react';
import { UserInfoExtended } from '@/models/user.model';
import { Observable } from 'rxjs';
import { userProfileDataObservable, userProfileUpdate } from '@/services/api';
import { take } from 'rxjs/operators';
import { useUser } from '@/utils/auth/useUser';
import UserProfileCloudinaryUpload from '@/components/user/UserProfileCloudinaryUpload';

export default function UserProfile(): JSX.Element {
  const { user } = useUser();
  const [profile, setProfile] = useState<UserInfoExtended | undefined>();
  const [profile$, setProfile$] = useState<
    Observable<UserInfoExtended | undefined>
  >();

  useEffect(() => {
    if (!user?.uid) {
      return;
    }
    setProfile$(userProfileDataObservable(user.uid));
  }, [user]);

  useEffect(() => {
    if (!profile$) {
      return;
    }
    const profileSubscribe = profile$.subscribe((u) => setProfile(u));
    return () => {
      profileSubscribe.unsubscribe();
    };
  }, [profile$]);

  function onProfileChange(e: React.ChangeEvent<HTMLInputElement>): void {
    const profileUpdate = {
      ...profile,
      [e.target.id]: e.target.value,
    } as UserInfoExtended;

    setProfile(profileUpdate);
    userProfileUpdate(profileUpdate).pipe(take(1)).subscribe();
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

    setProfile(profileUpdate);
    userProfileUpdate(profileUpdate).pipe(take(1)).subscribe();
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
      <section className="grid gap-4 p-4 rounded-md bg-primary-900 text-basics-50">
        <h2 className="font-sans text-2xl">User</h2>
        <form className="grid gap-4">
          <div className="grid gap-1">
            {profile.photoURL ? (
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
              <img
                className="w-24"
                src="/static/images/avatar.png"
                alt="Avatar Image Placeholder"
              />
            )}
            <div className="w-48 ">
              <UserProfileCloudinaryUpload
                profile={profile}
                setProfile={setProfile}
                user={user}
              />
            </div>
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
