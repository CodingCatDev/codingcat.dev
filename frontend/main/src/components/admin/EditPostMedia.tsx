import { useEffect, useState } from 'react';
import Image from 'next/image';

import { historyMediaDataObservable } from '@/services/api';

import CloudinaryUpload from '@/components/admin/CloudinaryUpload';
import VideoFormModal from '@/components/admin/VideoFormModal';

import ImageModal from '@/components/admin/ImageModal';
import VideoModal from '@/components/admin/VideoModal';
import { Post } from '@/models/post.model';
import { Media, MediaType } from '@/models/media.model';
import { Observable, Subject } from 'rxjs';

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
    setMedia$(historyMediaDataObservable(history));
  }, [history]);

  useEffect(() => {
    if (!setMedia$) {
      return;
    }
    const mediaSub = media$.subscribe((m) => setMedia(m));
    return () => {
      if (mediaSub) {
        mediaSub.unsubscribe();
      }
    };
  }, [setMedia$]);

  if (!history) {
    return <></>;
  }
  return (
    <section className="grid grid-cols-1 gap-4">
      <section className="flex flex-wrap space-x-4">
        <div className="grid gap-2 place-items-center text-primary-900">
          <h3 className="font-sans text-2xl bold">Default Image</h3>
          <div className="w-full">
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
          {/* For some reason this is showing up in the browser as 400x200, not sure if it's aspect ratio or what, but may need to be restyled after video is coded in. */}
          <video width="400" height="250">
            <source src="" type="video/mp4" />
          </video>
        </div>
      </section>
      <section>
        <header className="flex justify-between space-x-4">
          <nav className="flex">
            {/* Going to need some state here to determine which tab it's on */}
            <button className="px-4 py-2 uppercase rounded-t-lg font-2xl bold text-basics-50 dark:text-basics-50 bg-primary-900 dark:bg-primary-900">
              Images
            </button>
            <button className="px-4 py-2 uppercase rounded-t-lg text-primary-900 dark:text-primary-900 font-2xl bold bg-basics-50 dark:bg-basics-50">
              Videos
            </button>
          </nav>
          <div className="flex">
            <CloudinaryUpload
              history={history}
              setHistory={setHistory}
              type={type}
            />
          </div>
        </header>
        <section className="grid w-full h-full gap-4 p-4 overflow-y-auto bg-basics-50 dark:bg-basics-800 grid-cols-fit lg:max-h-96">
          {media.map((m) => (
            <>
              {m.cloudinary &&
                m.cloudinary.path &&
                m.cloudinary.height &&
                m.cloudinary.width && (
                  <div key={m.id} className="w-full">
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
            </>
          ))}
        </section>
      </section>
    </section>
  );
}
