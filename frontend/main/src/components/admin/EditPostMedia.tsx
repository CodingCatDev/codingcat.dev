import { useEffect, useState } from 'react';
import Image from 'next/image';

import { historyMediaDataObservable } from '@/services/api';

import CloudinaryUpload from '@/components/admin/CloudinaryUpload';
import EditPostMediaVideoForm from '@/components/admin/EditPostMediaVideoForm';

import CloudinaryCover from '@/components/admin/EditPostCloudinaryCover';
import { Post } from '@/models/post.model';
import { Media, MediaType } from '@/models/media.model';
import { Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';

export default function EditPostMedia({
  history,
  setHistory,
}: {
  history: Post | undefined;
  setHistory: React.Dispatch<React.SetStateAction<Post | undefined>>;
}): JSX.Element {
  const [type, setType] = useState<MediaType>(MediaType.photo);
  const [media$, setMedia$] = useState<Observable<Media[]>>(
    new Subject<Media[]>()
  );
  const [media, setMedia] = useState<Media[]>([]);

  useEffect(() => {
    if (!history) {
      return;
    }
    setMedia$(
      historyMediaDataObservable(history).pipe(
        map((media) => media.filter((m) => m.type === type))
      )
    );
  }, [history, type]);

  useEffect(() => {
    if (!media$) {
      return;
    }
    const mediaSub = media$.subscribe((m) => setMedia(m));
    return () => {
      if (mediaSub) {
        mediaSub.unsubscribe();
      }
    };
  }, [media$]);

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
              className={`px-4 py-2 uppercase rounded-t-lg font-2xl bold 
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
              className={`px-4 py-2 uppercase rounded-t-lg font-2xl bold 
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
              setHistory={setHistory}
              type={type}
            />
          </div>
        </header>
        <section className="grid w-full h-full gap-4 p-4 overflow-y-auto bg-basics-50 dark:bg-basics-800 grid-cols-fit">
          {media.map((m) => (
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
