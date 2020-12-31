import { useEffect } from 'react';
import { makeStyles, createStyles, Button, Box, Chip } from '@material-ui/core';
import { pink, purple } from '@material-ui/core/colors';

import InsertPhotoIcon from '@material-ui/icons/InsertPhoto';
import { config } from '@/config/cloudinary';
import {
  getCloudinarySignature,
  postHistoryUpdate,
  postHistoryMediaCreate,
  postHistoryCreate,
  getCloudinaryCookieToken,
} from '@/services/api';
import { switchMap, take } from 'rxjs/operators';
import { Post, MediaType } from '@/models/post.model';
import firebase from 'firebase/app';
import { Course } from '@/models/course.model.ts';

import { Video } from 'cloudinary-react';

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
  async function onVideoDelete() {
    if (history.publishedAt) {
      postHistoryCreate(history)
        .pipe(take(1))
        .subscribe((h) =>
          postHistoryUpdate({
            ...h,
            coverVideo: firebase.firestore.FieldValue.delete() as any,
          })
            .pipe(take(1))
            .subscribe((newHistory) => setHistory(newHistory))
        );
    } else {
      postHistoryUpdate({
        ...history,
        coverVideo: firebase.firestore.FieldValue.delete() as any,
      })
        .pipe(take(1))
        .subscribe((newHistory) => setHistory(newHistory));
    }
  }
  async function onImageDelete() {
    if (history.publishedAt) {
      postHistoryCreate(history)
        .pipe(take(1))
        .subscribe((h) =>
          postHistoryUpdate({
            ...h,
            coverPhoto: firebase.firestore.FieldValue.delete() as any,
          })
            .pipe(take(1))
            .subscribe((newHistory) => setHistory(newHistory))
        );
    } else {
      postHistoryUpdate({
        ...history,
        coverPhoto: firebase.firestore.FieldValue.delete() as any,
      })
        .pipe(take(1))
        .subscribe((newHistory) => setHistory(newHistory));
    }
  }

  async function fetchCloudinaryCookieToken() {
    try {
      const cookieToken = await getCloudinaryCookieToken().toPromise();
      const myDocument = document as any;
      myDocument.cookie = cookieToken;
    } catch (err) {
      console.log('error fetching signature');
    }
  }

  const classes = useStyles();
  return (
    <>
      {(type === MediaType.video && history.coverVideo) ||
      (type === MediaType.photo && history.coverPhoto) ? (
        <>
          {type === MediaType.video ? (
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
              }}
            >
              <img src={history.coverVideo?.thumbnail_url} />
              <Chip
                label="Cover Video"
                onDelete={() => onVideoDelete()}
                color="default"
              />
            </Box>
          ) : (
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
              }}
            >
              <img src={history.coverPhoto?.thumbnail_url} />
              <Chip
                label="Cover Image"
                onDelete={() => onImageDelete()}
                color="default"
              />
            </Box>
          )}
        </>
      ) : (
        <Button
          variant="contained"
          className={type === MediaType.photo ? classes.photo : classes.video}
          onClick={() => onUpload()}
        >
          Add {type === MediaType.photo ? 'Photo' : 'Video'}
          <InsertPhotoIcon />
        </Button>
      )}
      <Button variant="contained" onClick={() => fetchCloudinaryCookieToken()}>
        Cookie Token
      </Button>
      <Video
        cloudName="ajonp"
        secure={true}
        cname="media.codingcat.dev"
        privateCdn={true}
        /*
      // @ts-ignore */
        secureDistribution="media.codingcat.dev"
        publicId="ccd-cloudinary/videos/j017lpqsvvzdrgzcegku"
      ></Video>
    </>
  );
}
