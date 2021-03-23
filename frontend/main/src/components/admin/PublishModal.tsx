import { useEffect, useState } from 'react';
import { Post, PostStatus } from '@/models/post.model';
import {
  postDataObservable,
  postHistoryPublish,
  postsSlugUnique,
} from '@/services/api';
import firebase from 'firebase/app';
import { take } from 'rxjs/operators';
import { toKebabCase } from '@/utils/basics/stringManipulation';

import { Calendar } from 'primereact/calendar';
import { of } from 'rxjs';

export default function PublishModal({
  history,
  setSaving,
  setSlugUnique,
}: {
  history: Post | undefined;
  setSaving: React.Dispatch<React.SetStateAction<boolean>>;
  setSlugUnique: React.Dispatch<React.SetStateAction<boolean>>;
}): JSX.Element {
  const [open, setOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [largeButton, setLargeButton] = useState(true);

  useEffect(() => {
    if (!history) {
      return;
    }
    postDataObservable(`/posts/${history.postId}`)
      .pipe(take(1))
      .subscribe((p) => {
        if (p.publishedAt) {
          setSelectedDate(p.publishedAt.toDate());
        } else {
          setSelectedDate(new Date());
        }
      });
    return () => {
      false;
    };
  }, [history]);

  const handleClickOpen = () => {
    setOpen(true);
    setLargeButton(false);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const handleDateChange = (date: Date | null) => {
    if (date) setSelectedDate(date);
  };

  function validSlug(slugInput: string) {
    if (!history || !history.postId) {
      return of(false);
    }
    const slug = toKebabCase(slugInput);
    return postsSlugUnique(slug, history?.postId).pipe(take(1));
  }

  function onPublish() {
    setOpen(false);
    setLargeButton(true);
    if (history && selectedDate) {
      validSlug(history.slug).subscribe((unique) => {
        setSlugUnique(unique);
        if (unique) {
          setSaving(true);

          history.publishedAt = firebase.firestore.Timestamp.fromDate(
            selectedDate
          );
          history.status = PostStatus.published;

          postHistoryPublish(history)
            .pipe(take(1))
            .subscribe(() => {
              setSaving(false);
              setOpen(false);
            });
        }
      });
    }
  }

  return (
    <div>
      {largeButton && (
        <button
          className="flex items-center justify-center w-full h-16 uppercase btn-primary"
          onClick={handleClickOpen}
        >
          <p>Publish</p>
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
        </button>
      )}

      <section className={`${open ? 'grid grid-cols-1 gap-2' : 'hidden'}`}>
        <p>Select Post Date/Time</p>
        <div style={{ height: '100%', width: '100%' }}>
          {selectedDate ? (
            <Calendar
              showTime
              hourFormat="24"
              value={selectedDate}
              onChange={(e) => handleDateChange(e.value as Date)}
            ></Calendar>
          ) : (
            <p>Checking Post for publishedAt...</p>
          )}
        </div>
        <div className="flex space-x-4">
          <button onClick={() => setOpen(false)} color="secondary">
            Cancel
          </button>
          <button onClick={() => onPublish()} className="btn-primary">
            Publish
          </button>
        </div>
      </section>
    </div>
  );
}
