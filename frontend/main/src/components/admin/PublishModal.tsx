import { useEffect, useState } from 'react';
import { Post, PostStatus } from '@/models/post.model';
import firebase, { getApp } from 'firebase/app';
import { take } from 'rxjs/operators';
import { toKebabCase } from '@/utils/basics/stringManipulation';

import { Calendar } from 'primereact/calendar';
import { of } from 'rxjs';
import {
  getFirestore,
  collection,
  getDocs,
  where,
  query,
  Timestamp,
  writeBatch,
  doc,
} from 'firebase/firestore';
import { UserInfoExtended } from '@/models/user.model';

export default function PublishModal({
  user,
  history,
  setSaving,
  setSlugUnique,
}: {
  user: UserInfoExtended;
  history: Post;
  setSaving: React.Dispatch<React.SetStateAction<boolean>>;
  setSlugUnique: React.Dispatch<React.SetStateAction<boolean>>;
}): JSX.Element {
  const [open, setOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [largeButton, setLargeButton] = useState(true);
  const app = getApp();
  const firestore = getFirestore(app);

  useEffect(() => {
    if (!history) {
      return;
    }
    if (history.publishedAt) {
      setSelectedDate(history.publishedAt.toDate());
    } else {
      setSelectedDate(new Date());
    }
  }, [history]);

  const handleClickOpen = () => {
    setOpen(true);
    setLargeButton(false);
  };
  // const handleClose = () => {
  //   setOpen(false);
  // };

  const handleDateChange = (date: Date | null) => {
    if (date) setSelectedDate(date);
  };

  async function validSlug(slugInput: string, id: string | undefined) {
    if (!id) {
      return false;
    }
    const slug = toKebabCase(slugInput);
    const docs = await getDocs(
      query(
        collection(firestore, 'posts'),
        where('slug', '==', slug),
        where('id', '!=', id)
      )
    );
    return docs.empty;
  }

  function onCancel() {
    setOpen(false);
    setLargeButton(true);
  }

  async function onPublish() {
    if (history && selectedDate) {
      const unique = await validSlug(history.slug, history.id);
      setSlugUnique(unique);
      if (unique) {
        setSaving(true);

        history.publishedAt = Timestamp.fromDate(selectedDate);
        history.status = PostStatus.published;

        const batch = writeBatch(firestore);
        const historyRef = doc(
          firestore,
          `posts/${history.postId}/history/${history.id}`
        );
        const postRef = doc(firestore, `posts/${history.postId}`);

        const update = {
          ...history,
          updatedAt: Timestamp.now(),
          updatedBy: user.uid,
        };
        batch.set(historyRef, update);
        batch.set(postRef, {
          ...update,
          id: history.postId,
          historyId: history.id,
        });
        await batch.commit();
      }
    }
    setSaving(false);
    setOpen(false);
    setLargeButton(true);
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
          <button onClick={() => onCancel()} className="btn-secondary">
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
