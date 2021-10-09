/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect } from 'react';

import { config } from '@/config/cloudinary';
import {
  getCloudinarySignature,
  postHistoryMediaCreate,
  postHistoryCreate,
} from '@/services/api';
import { take } from 'rxjs/operators';
import { Post } from '@/models/post.model';
import { MediaType } from '@/models/media.model';

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

export default function CloudinaryUpload({
  setHistory,
  history,
  type,
}: {
  setHistory: React.Dispatch<React.SetStateAction<Post | undefined>>;
  history: Post;
  type: MediaType;
}): JSX.Element {
  let widget: any = null;
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

  function onUpload() {
    if (typeof window !== 'undefined') {
      const myWindow = window as any;
      if (myWindow.cloudinary) {
        if (widget && !widget.isDestroyed()) {
          widget.destroy();
        }
        widget = myWindow.cloudinary.createUploadWidget(
          {
            cloudName: config.name,
            uploadPreset:
              type === MediaType.photo
                ? config.photoPreset
                : config.videoPreset,
            prepareUploadParams: fetchCloudinarySignature,
          },
          (error: any, result: any) => {
            if (!error && result && result.event === 'success') {
              if (history.publishedAt) {
                postHistoryCreate(history)
                  .pipe(take(1))
                  .subscribe((h) =>
                    postHistoryMediaCreate(h, type, result.info)
                      .pipe(take(1))
                      .subscribe((newHistory) => setHistory(newHistory))
                  );
              } else {
                postHistoryMediaCreate(history, type, result.info)
                  .pipe(take(1))
                  .subscribe((newHistory) => setHistory(newHistory));
              }
              widget.destroy();
            }
            if (!error && result && result.event === 'close') {
              widget.destroy();
            }
            if (error) {
              console.log(error);
            }
          }
        );
        widget.open();
      }
    }
  }

  return (
    <>
      <button
        className="flex items-center space-x-1 btn-primary"
        onClick={() => onUpload()}
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
    </>
  );
}
