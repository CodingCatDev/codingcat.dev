import { useEffect, useState } from 'react';
import Image from 'next/image';

import CloudinaryUpload from '@/components/admin/CloudinaryUpload';
import EditPostMediaVideoForm from '@/components/admin/EditPostMediaVideoForm';

import CloudinaryCover from '@/components/admin/EditPostCloudinaryCover';
import { Post } from '@/models/post.model';
import { Media, MediaType } from '@/models/media.model';
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

export default function EditPostMedia({
  history,
  user,
  updateContent,
}: {
  history: Post;
  user: UserInfoExtended;
  updateContent: (h: Post) => Promise<Post>;
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
              <EditPostMediaVideoForm history={history} />
            )}
            <CloudinaryUpload
              history={history}
              type={type}
              user={user}
              updateContent={updateContent}
            />
          </div>
        </header>
        <section className="grid content-start w-full h-full gap-4 p-4 overflow-y-auto bg-basics-50 dark:bg-basics-800 grid-cols-fit">
          {medias?.map((m) => (
            <>
              {m.type == MediaType.photo &&
                m.cloudinary &&
                m.cloudinary.path &&
                m.cloudinary.height &&
                m.cloudinary.width && (
                  <div key={m.id} className="w-full max-w-md">
                    {
                      <Image
                        src={m.cloudinary?.path}
                        alt={m.cloudinary?.original_filename}
                        width={m.cloudinary?.width}
                        height={m.cloudinary?.height}
                        layout="responsive"
                        className=""
                      />
                    }
                  </div>
                )}
              {m.type == MediaType.video &&
                m.cloudinary &&
                m.cloudinary.thumbnail_url &&
                m.cloudinary.height &&
                m.cloudinary.width && (
                  <div key={m.id} className="w-full max-w-md">
                    {
                      <Image
                        loader={({ src }) =>
                          src.replace('/c_limit,h_60,w_90', '')
                        }
                        src={m.cloudinary?.thumbnail_url}
                        alt={m.cloudinary?.original_filename}
                        width={m.cloudinary?.width}
                        height={m.cloudinary?.height}
                        layout="responsive"
                        className=""
                      />
                    }
                  </div>
                )}
              {m.type == MediaType.video && m.video && (
                <div key={m.id} className="w-full max-w-md">
                  {
                    <Image
                      loader={({ src }) =>
                        `https://img.youtube.com/vi/${src.replace(
                          'https://youtu.be/',
                          ''
                        )}/0.jpg`
                      }
                      src={m.video.url}
                      alt={m.video.url}
                      width="1920"
                      height="1080"
                      layout="responsive"
                      className=""
                    />
                  }
                </div>
              )}
            </>
          ))}
        </section>
      </section>
    </section>
  );
}
