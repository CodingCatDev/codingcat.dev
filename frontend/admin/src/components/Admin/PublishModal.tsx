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
import { Post, PostStatus } from '@/models/post.model';

import TextField from '@material-ui/core/TextField';
import AdapterDateFns from '@material-ui/lab/AdapterDateFns';
import LocalizationProvider from '@material-ui/lab/LocalizationProvider';
import DateTimePicker from '@material-ui/lab/DateTimePicker';

import { postDataObservable, postHistoryPublish } from '@/services/api';
import firebase from 'firebase/app';
import { take } from 'rxjs/operators';

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

export default function PublishModal({
  history,
  setSaving,
}: {
  history: Post;
  setSaving: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const [open, setOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>();

  useEffect(() => {
    postDataObservable(`/posts/${history.postId}`)
      .pipe(take(1))
      .subscribe((p) => {
        if (p.publishedAt) {
          setSelectedDate(p.publishedAt.toDate());
        } else {
          setSelectedDate(new Date());
        }
      });
    return () => {};
  }, [history]);

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const handleDateChange = (date: Date | null) => {
    if (date) setSelectedDate(date);
  };

  function onPublish() {
    if (history && selectedDate) {
      setSaving(true);

      history.publishedAt = firebase.firestore.Timestamp.fromDate(selectedDate);
      history.status = PostStatus.published;

      postHistoryPublish(history)
        .pipe(take(1))
        .subscribe(() => {
          setSaving(false);
          setOpen(false);
        });
    }
  }

  return (
    <div>
      <Button variant="contained" onClick={handleClickOpen}>
        Publish
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          style={{
            height: '1.5rem',
            width: '1.5rem',
            marginLeft: '1rem',
          }}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
          />
        </svg>
      </Button>
      <Dialog
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={open}
      >
        <DialogTitle id="customized-dialog-title" onClose={handleClose}>
          Select Post Date/Time
        </DialogTitle>
        <DialogContent dividers style={{ height: '100%', width: '100%' }}>
          {selectedDate ? (
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DateTimePicker
                renderInput={(props) => <TextField {...props} />}
                label="DateTimePicker"
                value={selectedDate}
                onChange={handleDateChange}
              />
            </LocalizationProvider>
          ) : (
            <Typography>Checking Post for publishedAt...</Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)} color="secondary">
            Cancel
          </Button>
          <Button
            onClick={() => onPublish()}
            variant="contained"
            color="primary"
          >
            Publish
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
