import { useEffect, useState } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogActions from '@material-ui/core/DialogActions';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Typography from '@material-ui/core/Typography';
import MovieIcon from '@material-ui/icons/Movie';
import Box from '@material-ui/core/Box';

import { Theme as AugmentedTheme } from '@material-ui/core';
import { MediaSource, Post } from '@/models/post.model';

import { config } from '@/config/cloudinary';

import {
  getCloudinaryCookieToken,
  postHistoryCreate,
  postHistoryUpdate,
} from '@/services/api';
import firebase from 'firebase/app';
import { take } from 'rxjs/operators';

import { Video } from 'cloudinary-react';
import ReactPlayer from 'react-player/lazy';

const styles = (theme: AugmentedTheme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(2),
    display: 'flex',
  },
  title: {
    wordBreak: 'break-all',
    flexGrow: 1,
  },
  closeButton: {
    color: theme.palette.grey[500],
  },
});

const DialogTitle = withStyles(styles as any)((props: any) => {
  const { children, classes, onClose, ...other } = props;
  return (
    <MuiDialogTitle disableTypography className={classes.root} {...other}>
      <Typography variant="h6" className={classes.title}>
        {children}
      </Typography>
      <div>
        {onClose ? (
          <IconButton
            aria-label="close"
            className={classes.closeButton}
            onClick={onClose}
          >
            <CloseIcon />
          </IconButton>
        ) : null}
      </div>
    </MuiDialogTitle>
  );
});

const DialogContent = withStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
  },
}))(MuiDialogContent);

const DialogActions = withStyles((theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(1),
  },
}))(MuiDialogActions);

export default function ImageModal({ post }: { post: Post }) {
  const [open, setOpen] = useState(false);
  const [cookieToken, setCookieToken] = useState('');

  useEffect(() => {
    setCookieToken('');
    return () => {
      setCookieToken('');
    };
  }, []);

  useEffect(() => {
    getCloudinaryCookieToken()
      .pipe(take(1))
      .subscribe((ct) => {
        //TODO : There is probably a better way to set cookies.
        var now = new Date();
        var time = now.getTime();
        time += 3600 * 1000;
        now.setTime(time);
        const match = config?.cname
          ? config?.cname.match(/([a-z0-9-]*?)\.[a-z]{2,}$/)
          : null;
        const baseDomain = match && match?.length > 0 ? match[0] : '';

        document.cookie = `${ct}; domain=.${baseDomain}; expires=${now.toUTCString()}; path=/; SameSite=None; Secure`;
        setCookieToken(ct);
      });
  }, [post]);

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  async function onVideoDelete(post: Post) {
    setOpen(false);
    setCookieToken('');
    if (post) {
      if (post.publishedAt) {
        postHistoryCreate(post)
          .pipe(take(1))
          .subscribe((p) =>
            postHistoryUpdate({
              ...p,
              coverVideo: firebase.firestore.FieldValue.delete() as any,
            })
              .pipe(take(1))
              .subscribe()
          );
      } else {
        postHistoryUpdate({
          ...post,
          coverVideo: firebase.firestore.FieldValue.delete() as any,
        })
          .pipe(take(1))
          .subscribe();
      }
    }
  }

  return (
    <div>
      <Button variant="contained" onClick={handleClickOpen}>
        View Video
        <MovieIcon />
      </Button>
      <Dialog
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={open}
        fullWidth={true}
        maxWidth="xl"
        fullScreen
      >
        <DialogTitle id="customized-dialog-title" onClose={handleClose}>
          {post.coverVideo?.url}
        </DialogTitle>
        <DialogContent dividers style={{ height: '100%', width: '100%' }}>
          {post.coverVideo?.source === MediaSource.cloudinary ? (
            <>
              {cookieToken !== '' ? (
                <Video
                  cloudName={config.name}
                  publicId={post.coverVideo?.public_id}
                  privateCdn={config.cname ? true : false}
                  secure={config.cname ? true : false}
                  secureDistribution={config.cname ? config.cname : ''}
                  sourceTypes={['hls', 'webm', 'ogv', 'mp4']}
                  controls={true}
                  fluid="true"
                  style={{ height: '100%', width: '100%' }}
                />
              ) : (
                <div>Getting Cookie for Private View</div>
              )}
            </>
          ) : (
            <>
              {post.coverVideo?.url.includes('youtu.be') ||
              post.coverVideo?.url.includes('youtube') ? (
                <ReactPlayer
                  className="react-player"
                  url={post.coverVideo?.url}
                  controls={true}
                  height="0"
                  width="100%"
                  style={{
                    overflow: 'hidden',
                    paddingTop: '56.25%',
                    position: 'relative',
                  }}
                />
              ) : (
                <ReactPlayer
                  className="react-player"
                  url={post.coverVideo?.url}
                  controls={true}
                  height="100%"
                  width="100%"
                />
              )}
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => onVideoDelete(post)}
            variant="contained"
            color="secondary"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
