import { useState } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogActions from '@material-ui/core/DialogActions';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Box from '@material-ui/core/Box';
import VideoIcon from '@material-ui/icons/FeaturedVideo';
import { makeStyles, createStyles } from '@material-ui/core';
import { red } from '@material-ui/core/colors';

import { Theme as AugmentedTheme } from '@material-ui/core';
import { MediaType, Post } from '@/models/post.model';

import { postHistoryCreate, postHistoryMediaCreate } from '@/services/api';
import { take } from 'rxjs/operators';
import { Video } from '@/models/video.model';
import { Course } from '@/models/course.model.ts';

const useStyles = makeStyles(() =>
  createStyles({
    video: {
      backgroundColor: red[500],
      '&:hover': {
        backgroundColor: red[300],
      },
    },
    root: {
      '& label.Mui-focused': {
        color: 'white',
      },
      '& .MuiOutlinedInput-root': {
        '& fieldset': {
          borderColor: 'white',
        },
        '&:hover fieldset': {
          borderColor: 'white',
        },
        '&.Mui-focused fieldset': {
          borderColor: 'white',
        },
      },
    },
  })
);

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

export default function VideoFormModal({
  post,
}: {
  setHistory: React.Dispatch<React.SetStateAction<Post | Course | undefined>>;
  post: Post;
}) {
  const [open, setOpen] = useState(false);
  const [video, setYoutube] = useState<Video>({
    url: '',
  });

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  async function onUpload(history: Post) {
    if (history.publishedAt) {
      postHistoryCreate(history)
        .pipe(take(1))
        .subscribe((h) =>
          postHistoryMediaCreate(h, MediaType.video, undefined, video)
            .pipe(take(1))
            .subscribe(() => setOpen(false))
        );
    } else {
      postHistoryMediaCreate(history, MediaType.video, undefined, video)
        .pipe(take(1))
        .subscribe(() => setOpen(false));
    }
  }

  const onUrlInput = (e: { target: { value: string } }) => {
    setYoutube({
      ...video,
      url: e.target.value,
    });
  };

  const classes = useStyles();

  return (
    <>
      <Button
        variant="contained"
        className={classes.video}
        onClick={handleClickOpen}
      >
        <Box
          sx={{
            paddingRight: '0.5rem',
          }}
        >
          Add Video Cover
        </Box>
        <VideoIcon />
      </Button>
      <Dialog
        onClose={handleClose}
        aria-labelledby="video-upload"
        open={open}
        fullWidth={true}
        maxWidth="xl"
      >
        <DialogTitle id="video-upload" onClose={handleClose}>
          Video
        </DialogTitle>
        <DialogContent dividers className={classes.root}>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Video URL"
            type="url"
            fullWidth
            variant="filled"
            required={true}
            value={video.url}
            onChange={onUrlInput}
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => onUpload(post)}
            variant="contained"
            color="primary"
          >
            Upload
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
