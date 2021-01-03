import { useEffect } from 'react';
import { makeStyles, createStyles, Button, Box } from '@material-ui/core';
import { pink, purple } from '@material-ui/core/colors';

import AddPhotoAlternateIcon from '@material-ui/icons/AddPhotoAlternate';
import AddToQueueIcon from '@material-ui/icons/AddToQueue';
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
      backgroundColor: pink[500],
      '&:hover': {
        backgroundColor: pink[300],
      },
    },
    video: {
      backgroundColor: purple[500],
      '&:hover': {
        backgroundColor: purple[300],
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

  const classes = useStyles();
  return (
    <>
      {type === MediaType.photo ? (
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
      )}
    </>
  );
}
