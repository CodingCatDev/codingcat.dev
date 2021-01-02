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

import { Theme as AugmentedTheme } from '@material-ui/core';
import { Post } from '@/models/post.model';

import { config } from '@/config/cloudinary';

import {
  getCloudinaryCookieToken,
  postHistoryCreate,
  postHistoryUpdate,
} from '@/services/api';
import firebase from 'firebase/app';
import { take } from 'rxjs/operators';

import { Video } from 'cloudinary-react';

const styles = (theme: AugmentedTheme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(2),
    display: 'flex',
  },
  title: {
    // width: '90%',
    wordBreak: 'break-all',
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

async function onVideoDelete(post: Post) {
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

export default function ImageModal({ post }: { post: Post }) {
  const [open, setOpen] = useState(false);
  const [cookieToken, setCookieToken] = useState('');

  useEffect(() => {
    getCloudinaryCookieToken()
      .pipe(take(1))
      .subscribe((ct) => {
        //TODO : There is probably a better way to set cookies.
        var now = new Date();
        var time = now.getTime();
        time += 3600 * 1000;
        now.setTime(time);
        // document.cookie = `${cookieToken}; domain=${
        //   config.cname
        // }; expires=${now.toISOString()}; path=/; SameSite=None; Secure`;

        document.cookie = `${cookieToken}; domain=.codingcat.dev; expires=${now.toISOString()}; path=/`;

        setCookieToken(ct);
      });
    return () => {};
  }, [post]);

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

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
      >
        <DialogTitle id="customized-dialog-title" onClose={handleClose}>
          {post.coverVideo?.url}
        </DialogTitle>
        <DialogContent dividers>
          {cookieToken === '' ? (
            <div>Getting Cookie for Private View</div>
          ) : (
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
