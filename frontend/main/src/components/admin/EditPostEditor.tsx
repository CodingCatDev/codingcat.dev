import SimpleMDE from 'react-simplemde-editor';
import { toKebabCase } from '@/utils/basics/stringManipulation';
import { Post } from '@/models/post.model';
import 'easymde/dist/easymde.min.css';
import {
  getDocs,
  query,
  collection,
  where,
  getFirestore,
} from 'firebase/firestore';
import { getApp } from 'firebase/app';

export default function EditPostEditor({
  history,
  slugUnique,
  setSlugUnique,
  updateContent,
}: {
  history: Post;
  slugUnique: boolean;
  setSlugUnique: React.Dispatch<React.SetStateAction<boolean>>;
  updateContent: (h: Post) => Promise<Post>;
}): JSX.Element {
  const app = getApp();
  const firestore = getFirestore(app);

  function onTitle(title: string) {
    updateContent({ ...history, title });
  }

  async function onSlug(slug: string) {
    updateContent({ ...history, slug });
    setSlugUnique(await validSlug(slug, history.id));
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
    updateContent({ ...history, excerpt });
  }

  function onContent(content: string) {
    updateContent({ ...history, content });
  }

  function onUrlContent(urlContent: string) {
    updateContent({ ...history, urlContent });
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
