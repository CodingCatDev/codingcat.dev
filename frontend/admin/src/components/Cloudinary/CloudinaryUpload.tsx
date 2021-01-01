import { useEffect } from 'react';
import { makeStyles, createStyles, Button } from '@material-ui/core';
import { pink, purple } from '@material-ui/core/colors';

import InsertPhotoIcon from '@material-ui/icons/InsertPhoto';
import { config } from '@/config/cloudinary';
import {
  getCloudinarySignature,
  postHistoryMediaCreate,
  postHistoryCreate,
} from '@/services/api';
import { take } from 'rxjs/operators';
import { Post, MediaType } from '@/models/post.model';
import { Course } from '@/models/course.model.ts';

const useStyles = makeStyles(() =>
  createStyles({
    photo: {
      backgroundColor: pink[300],
      '&:hover': {
        backgroundColor: pink[500],
      },
    },
    video: {
      backgroundColor: purple[300],
      '&:hover': {
        backgroundColor: purple[500],
      },
    },
  })
);

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
  setHistory: React.Dispatch<React.SetStateAction<Post | Course | undefined>>;
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
                      postHistoryMediaCreate(h, result.info, type)
                        .pipe(take(1))
                        .subscribe((newHistory) => setHistory(newHistory))
                    );
                } else {
                  postHistoryMediaCreate(history, result.info, type)
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

  const classes = useStyles();
  return (
    <>
      <Button
        variant="contained"
        className={type === MediaType.photo ? classes.photo : classes.video}
        onClick={() => onUpload()}
      >
        Add {type === MediaType.photo ? 'Photo' : 'Video'}
        <InsertPhotoIcon />
      </Button>
    </>
  );
}
