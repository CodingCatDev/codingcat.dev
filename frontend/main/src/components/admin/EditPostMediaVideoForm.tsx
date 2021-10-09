import { useState } from 'react';
import { Post } from '@/models/post.model';
import { MediaType } from '@/models/media.model';

import { postHistoryCreate, postHistoryMediaCreate } from '@/services/api';
import { take } from 'rxjs/operators';
import { Video } from '@/models/video.model';

export default function EditPostMediaVideoForm({
  history,
}: {
  history: Post | undefined;
}): JSX.Element {
  const [video, setVideo] = useState<Video>({
    url: '',
  });

  async function onUpload(history: Post) {
    if (history.publishedAt) {
      postHistoryCreate(history)
        .pipe(take(1))
        .subscribe((h) =>
          postHistoryMediaCreate(h, MediaType.video, undefined, video)
            .pipe(take(1))
            .subscribe(() => setVideo({ url: '' }))
        );
    } else {
      postHistoryMediaCreate(history, MediaType.video, undefined, video)
        .pipe(take(1))
        .subscribe(() => setVideo({ url: '' }));
    }
  }

  const onUrlInput = (e: { target: { value: string } }) => {
    setVideo({
      ...video,
      url: e.target.value,
    });
  };

  if (!history) {
    return <></>;
  }

  return (
    <>
      <div className="flex space-x-2">
        <input
          type="text"
          value={video.url}
          onChange={onUrlInput}
          autoFocus
          id="videoUrl"
          className="w-full"
          required={true}
          placeholder="Video URL"
        ></input>
        <button onClick={() => onUpload(history)} className="btn-primary">
          Add
        </button>
      </div>
    </>
  );
}
