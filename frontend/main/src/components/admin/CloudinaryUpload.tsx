import { useEffect } from 'react';

import { config } from '@/config/cloudinary';
import {
  getCloudinarySignature,
  postHistoryMediaCreate,
  postHistoryCreate,
} from '@/services/api';
import { take } from 'rxjs/operators';
import { Post, MediaType } from '@/models/post.model';

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
}) {
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
        myWindow.cloudinary
          .createUploadWidget(
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

  return (
    <>
      TODO: CloudinaryUpload
      {/* {type === MediaType.photo ? (
        <Button
          variant="contained"
          className={classes.photo}
          onClick={() => onUpload()}
        >
          <Box
            sx={{
              paddingRight: '0.5rem',
            }}
          >
            Add Cloudinary Photo Cover
          </Box>
          <AddPhotoAlternateIcon />
        </Button>
      ) : (
        <Button
          variant="contained"
          className={classes.video}
          onClick={() => onUpload()}
        >
          <Box
            sx={{
              paddingRight: '0.5rem',
            }}
          >
            Add Cloudinary Video Cover
          </Box>
          <AddToQueueIcon />
        </Button>
      )} */}
    </>
  );
}
