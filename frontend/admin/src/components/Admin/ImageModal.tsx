import { useState, useEffect } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogActions from '@material-ui/core/DialogActions';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Typography from '@material-ui/core/Typography';
import PhotoIcon from '@material-ui/icons/Photo';

import { Theme as AugmentedTheme } from '@material-ui/core';
import { Post } from '@/models/post.model';

import { postHistoryCreate, postHistoryUpdate } from '@/services/api';
import firebase from 'firebase/app';
import { take } from 'rxjs/operators';

import { Image } from 'cloudinary-react';

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

export default function ImageModal({ post }: { post: Post }) {
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  async function onPhotoDelete(post: Post) {
    setOpen(false);
    if (post) {
      if (post.publishedAt) {
        postHistoryCreate(post)
          .pipe(take(1))
          .subscribe((p) =>
            postHistoryUpdate({
              ...p,
              coverPhoto: firebase.firestore.FieldValue.delete() as any,
            })
              .pipe(take(1))
              .subscribe()
          );
      } else {
        postHistoryUpdate({
          ...post,
          coverPhoto: firebase.firestore.FieldValue.delete() as any,
        })
          .pipe(take(1))
          .subscribe();
      }
    }
  }

  return (
    <div>
      <Button variant="contained" onClick={handleClickOpen}>
        View Photo
        <PhotoIcon />
      </Button>
      <Dialog
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={open}
        fullWidth={true}
      >
        <DialogTitle id="customized-dialog-title" onClose={handleClose}>
          {post.coverPhoto?.url}
        </DialogTitle>
        <DialogContent dividers>
          <Image
            src={post.coverPhoto?.url}
            style={{ height: '100%', width: '100%' }}
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => onPhotoDelete(post)}
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
