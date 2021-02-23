import { useState } from 'react';
import { Post } from '@/models/post.model';
import { MediaType } from '@/models/media.model';

import { postHistoryCreate, postHistoryMediaCreate } from '@/services/api';
import { take } from 'rxjs/operators';
import { Video } from '@/models/video.model';

export default function VideoFormModal({
  post,
}: {
  setHistory: React.Dispatch<React.SetStateAction<Post | undefined>>;
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

  return (
    <>
      <button onClick={handleClickOpen}>
        <div className="flex">
          Add Video Cover
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
              d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
            />
          </svg>
        </div>
      </button>
      <section>
        <input
          type="text"
          value={video.url}
          onChange={onUrlInput}
          autoFocus
          id="videoUrl"
          className="w-full"
          required={true}
        ></input>
      </section>

      <button onClick={() => onUpload(post)} className="btn-primary">
        Upload
      </button>
    </>
  );
}
