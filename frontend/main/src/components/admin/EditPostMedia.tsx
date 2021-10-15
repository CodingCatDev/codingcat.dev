import { useEffect, useState } from 'react';
import Image from 'next/image';

import CloudinaryUpload from '@/components/admin/CloudinaryUpload';
import EditPostMediaVideoForm from '@/components/admin/EditPostMediaVideoForm';
import MediaGrid from '@/components/admin/MediaGrid';
import CloudinaryCover from '@/components/admin/EditPostCloudinaryCover';
import { Post } from '@/models/post.model';
import { Cloudinary, Media, MediaType } from '@/models/media.model';
import { getApp } from 'firebase/app';
import {
  getFirestore,
  collection,
  CollectionReference,
  query,
  orderBy,
  DocumentData,
  DocumentSnapshot,
} from 'firebase/firestore';
import { useFirestoreCollectionData } from 'reactfire';
import { UserInfoExtended } from '@/models/user.model';
import { Video } from '@/models/video.model';

export default function EditPostMedia({
  history,
  user,
  updateContent,
  postHistoryMediaCreate,
}: {
  history: Post;
  user: UserInfoExtended;
  updateContent: (h: Post) => Promise<Post>;
  postHistoryMediaCreate: (
    history: Post,
    type: MediaType,
    cloudinary?: Cloudinary | undefined,
    video?: Video | undefined
  ) => Promise<void>;
}): JSX.Element {
  const [type, setType] = useState<MediaType>(MediaType.photo);
  // const [media, setMedia] = useState<Media | null>(null);
  const app = getApp();
  const firestore = getFirestore(app);
  const mediaRef = collection(
    firestore,
    `posts/${history.postId}/history/${history.id}/media`
  ) as CollectionReference<Media>;
  const mediaQuery = query<Media>(mediaRef, orderBy('createdAt', 'desc'));
  const { data: medias } = useFirestoreCollectionData<Media>(mediaQuery);

  useEffect(() => {}, [medias, type]);

  if (!history) {
    return <></>;
  }
  return (
    <section className="grid h-full grid-cols-1 gap-4 grid-rows-auto-2">
      <section className="grid grid-cols-2">
        <div className="grid gap-2 place-items-center text-primary-900">
          <h3 className="font-sans text-2xl bold">Default Image</h3>
          <div className="w-1/2">
            {history.coverPhoto?.path ? (
              <Image
                src={history.coverPhoto?.path}
                alt={history.title}
                width="1920"
                height="1080"
                layout="responsive"
                className=""
              />
            ) : (
              <div>Placeholder</div>
            )}
          </div>
        </div>
        <div className="grid gap-2 place-items-center text-primary-900">
          <h3 className="font-sans text-2xl bold">Default Video</h3>
          <div className="w-1/2">
            {history.coverVideo ? (
              <CloudinaryCover post={history} />
            ) : (
              <div>Placeholder</div>
            )}
          </div>
        </div>
      </section>
      <section className="grid h-full grid-rows-auto-2">
        <header className="flex justify-between space-x-4">
          <nav className="flex">
            <button
              className={`px-4 py-2 uppercase rounded-t-lg font-2xl bold focus:outline-none focus:ring-2 focus:ring-secondary-600
              ${
                type === MediaType.photo
                  ? 'text-basics-50 dark:text-basics-50 bg-primary-900 dark:bg-primary-900'
                  : 'text-primary-900 dark:text-primary-900 bg-basics-50 dark:bg-basics-50'
              }`}
              onClick={() => setType(MediaType.photo)}
            >
              Images
            </button>
            <button
              className={`px-4 py-2 uppercase rounded-t-lg font-2xl bold focus:outline-none focus:ring-2 focus:ring-secondary-600
              ${
                type === MediaType.video
                  ? 'text-basics-50 dark:text-basics-50 bg-primary-900 dark:bg-primary-900'
                  : 'text-primary-900 dark:text-primary-900 bg-basics-50 dark:bg-basics-50'
              }`}
              onClick={() => setType(MediaType.video)}
            >
              Videos
            </button>
          </nav>
          <div className="flex pb-1 space-x-2">
            {type === MediaType.video && (
              <EditPostMediaVideoForm
                history={history}
                updateContent={updateContent}
                postHistoryMediaCreate={postHistoryMediaCreate}
              />
            )}
            <CloudinaryUpload
              history={history}
              type={type}
              user={user}
              updateContent={updateContent}
              postHistoryMediaCreate={postHistoryMediaCreate}
            />
          </div>
        </header>
        <MediaGrid medias={medias} />
      </section>
    </section>
  );
}
