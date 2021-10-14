import SimpleMDE from 'react-simplemde-editor';
import { toKebabCase } from '@/utils/basics/stringManipulation';
import { Post } from '@/models/post.model';
import { of, Subject } from 'rxjs';
import { take } from 'rxjs/operators';

import 'easymde/dist/easymde.min.css';
import { firestore } from 'firebase-admin';
import {
  getDocs,
  query,
  collection,
  where,
  getFirestore,
} from 'firebase/firestore';
import { getApp } from 'firebase/app';

export default function EditPostEditor({
  updateContent$,
  history,
  setHistory,
  slugUnique,
  setSlugUnique,
}: {
  updateContent$: Subject<Post>;
  history: Post;
  setHistory: React.Dispatch<React.SetStateAction<Post | undefined>>;
  slugUnique: boolean;
  setSlugUnique: React.Dispatch<React.SetStateAction<boolean>>;
}): JSX.Element {
  const app = getApp();
  const firestore = getFirestore(app);

  function onTitle(title: string) {
    const update: Post = { ...history, title } as Post;
    setHistory(update);
    updateContent$.next({ ...update, historyId: history?.id });
  }

  async function onSlug(slug: string) {
    const update: Post = { ...history, slug } as Post;
    setHistory(update);
    setSlugUnique(await validSlug(slug, history.id));
    updateContent$.next({ ...update, historyId: history?.id });
  }

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

  function onExcerpt(excerpt: string) {
    const update: Post = { ...history, excerpt } as Post;
    setHistory(update);
    updateContent$.next({ ...update, historyId: history?.id });
  }

  function onContent(content: string) {
    const update: Post = { ...history, content } as Post;
    setHistory(update);
    updateContent$.next({ ...update, historyId: history?.id });
  }

  function onUrlContent(urlContent: string) {
    const update: Post = { ...history, urlContent } as Post;
    setHistory(update);
    updateContent$.next({ ...update, historyId: history?.id });
  }

  return (
    <div className="grid grid-cols-1 max-w-7xl">
      {/* Top Inputs */}
      <section className="flex flex-wrap mb-4 space-y-4 lg:space-y-0">
        <div className="flex flex-col pr-2">
          <div className="flex">
            <p className="flex items-center mr-2 font-bold uppercase text-primary-900 dark:text-basics-50">
              Title:{' '}
            </p>
            <input
              type="text"
              placeholder="Title"
              value={history?.title}
              onChange={(e) => onTitle(e.target.value)}
            ></input>
          </div>
          <div className="flex mt-2">
            <p className="flex items-center mr-2 font-bold uppercase text-primary-900 dark:text-basics-50">
              Slug:{' '}
            </p>
            <input
              type="text"
              placeholder="type/slug"
              value={history?.slug}
              onChange={(e) => onSlug(e.target.value)}
            ></input>
          </div>
          <div
            className={`border-b-2 text-error-900 border-error-900 ${
              slugUnique ? 'hidden' : 'block'
            }`}
          >
            Slug is not unique
          </div>
          <div className="flex mt-2">
            <p className="flex items-center mr-2 font-bold uppercase text-primary-900 dark:text-basics-50">
              URL:
            </p>
            <input
              type="text"
              placeholder="url (github)"
              value={history?.urlContent}
              onChange={(e) => onUrlContent(e.target.value)}
            ></input>
          </div>
        </div>
        <div className="flex flex-grow">
          <div className="flex w-full">
            <p className="flex items-center mr-2 font-bold uppercase text-primary-900 dark:text-basics-50">
              Excerpt:{' '}
            </p>
            <textarea
              placeholder="Details about Post"
              className="h-full resize-none"
              cols={2}
              value={history?.excerpt}
              onChange={(e) => onExcerpt(e.target.value)}
            ></textarea>
          </div>
        </div>
      </section>
      <SimpleMDE
        onChange={onContent}
        value={history ? history.content : ''}
        options={{
          sideBySideFullscreen: false,
          status: false,
          minHeight: '55vh',
        }}
      />
    </div>
  );
}
