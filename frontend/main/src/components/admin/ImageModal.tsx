import { useState, useEffect } from 'react';
import { Post } from '@/models/post.model';

import { postHistoryCreate, postHistoryUpdate } from '@/services/api';
import firebase from 'firebase/app';
import { take } from 'rxjs/operators';

import { Image } from 'cloudinary-react';

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
      <button className="btn-primary" onClick={handleClickOpen}>
        View Photo
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
      </button>

      <section id="customized-dialog-title">{post.coverPhoto?.url}</section>
      <Image
        src={post.coverPhoto?.url}
        style={{ height: '100%', width: '100%' }}
      />
      <button onClick={() => onPhotoDelete(post)} className="btn-primary">
        Delete
      </button>
    </div>
  );
}
