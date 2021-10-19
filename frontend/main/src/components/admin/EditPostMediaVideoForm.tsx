import { useState } from 'react';
import { Post } from '@/models/post.model';
import { Cloudinary, MediaType } from '@/models/media.model';
import { Video } from '@/models/video.model';

export default function EditPostMediaVideoForm({
  history,
  updateContent,
  postHistoryMediaCreate,
}: {
  history: Post | undefined;
  updateContent: (h: Post) => Promise<Post>;
  postHistoryMediaCreate: (
    history: Post,
    type: MediaType,
    cloudinary?: Cloudinary | undefined,
    video?: Video | undefined
  ) => Promise<void>;
}): JSX.Element {
  const [video, setVideo] = useState<Video>({
    url: '',
  });

  async function onUpload(h: Post) {
    await updateContent(h);
    await postHistoryMediaCreate(h, MediaType.video, undefined, video);
    setVideo({ url: '' });
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
