import { Dispatch, SetStateAction, useEffect } from 'react';

import { config } from '@/config/cloudinary';
import { getCloudinarySignature, userProfileUpdate } from '@/services/api';
import { UserInfoExtended } from '@/models/user.model';
import { take } from 'rxjs/operators';

async function fetchCloudinarySignature(cb: any, params: any) {
  try {
    const signature = await getCloudinarySignature(params).toPromise();

    cb(
      Object.assign(
        {
          signature,
          api_key: config.apiKey,
        },
        params
      )
    );
  } catch (err) {
    console.log('error fetching signature');
  }
}

export default function UserProfileCloudinaryUpload({
  profile,
  setProfile,
  user,
}: {
  profile: UserInfoExtended;
  setProfile: Dispatch<SetStateAction<UserInfoExtended | undefined>>;
  user: UserInfoExtended;
}): JSX.Element {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://widget.cloudinary.com/v2.0/global/all.js';
    script.async = true;
    script.type = 'text/javascript';
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  function onUpload(e: any) {
    e.preventDefault();
    if (typeof window !== 'undefined') {
      const myWindow = window as any;
      if (myWindow.cloudinary) {
        myWindow.cloudinary
          .createUploadWidget(
            {
              cloudName: config.name,
              uploadPreset: config.photoPreset,
              prepareUploadParams: fetchCloudinarySignature,
            },
            (error: any, result: any) => {
              if (!error && result && result.event === 'success') {
                const profileUpdate = {
                  ...profile,
                  photoURL: result.info.url,
                };
                setProfile(profileUpdate);
                userProfileUpdate(profileUpdate).pipe(take(1)).subscribe();
              }
              if (error) {
                console.log(error);
              }
            }
          )
          .open();
      }
    }
  }

  function onAvatarReset(e: any) {
    e.preventDefault();
    const profileUpdate = {
      ...profile,
      photoURL: user.photoURL,
    };
    setProfile(profileUpdate);
    userProfileUpdate(profileUpdate).pipe(take(1)).subscribe();
  }

  return (
    <div className="flex space-x-2">
      <button
        className="flex items-center space-x-1 btn-secondary"
        onClick={(e) => onUpload(e)}
      >
        <svg
          className="w-6"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
          />
        </svg>{' '}
        <span>Upload Media</span>
      </button>
      {profile && profile.photoURL != user.photoURL && (
        <button
          className="flex items-center space-x-1 btn-secondary bg-secondary-500"
          onClick={(e) => onAvatarReset(e)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            className="w-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
          <span>Original</span>
        </button>
      )}
    </div>
  );
}
