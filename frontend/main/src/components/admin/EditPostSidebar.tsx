import { ChangeEvent, useEffect, useState } from 'react';
import TimeAgo from 'react-timeago';

import PublishModal from '@/components/admin/PublishModal';
import { TabType } from '@/models/admin.model';
import { Post, PostStatus } from '@/models/post.model';
import { Subject } from 'rxjs';
import {
  profileSearchByDisplayNameObservable,
  userProfileDataObservable,
} from '@/services/api';
import { take } from 'rxjs/operators';
import { UserInfoExtended } from '@/models/user.model';

export default function EditPostSidebar({
  updateContent$,
  tab,
  setTab,
  history,
  setHistory,
  setSlugUnique,
  setSaving,
  postHistories,
  selectTab,
}: {
  updateContent$: Subject<Post>;
  tab: TabType;
  setTab: React.Dispatch<React.SetStateAction<TabType>>;
  history: Post | undefined;
  setHistory: React.Dispatch<React.SetStateAction<Post | undefined>>;
  setSlugUnique: React.Dispatch<React.SetStateAction<boolean>>;
  setSaving: React.Dispatch<React.SetStateAction<boolean>>;
  postHistories: Post[];
  selectTab: any;
}): JSX.Element {
  const [email, setEmail] = useState('');
  const [tag, setTag] = useState('');

  // Listing selection for authors
  const [addAuthors, setAddAuthors] = useState<UserInfoExtended[]>([]);
  const [selectedAddAuthor, setSelectedAddAuthor] = useState<
    UserInfoExtended | undefined
  >(undefined);

  function onAuthor(e: ChangeEvent<HTMLInputElement>) {
    const email = e.target.value;
    setEmail(email);
    if (email) {
      profileSearchByDisplayNameObservable(email)
        .pipe(take(1))
        .subscribe((d) => setAddAuthors(d));
    } else {
      setAddAuthors([]);
    }
  }

  function addAuthor(author: UserInfoExtended | undefined) {
    if (author) {
      userProfileDataObservable(author.uid)
        .pipe(take(1))
        .subscribe((author) => {
          if (!history || !author) {
            return;
          }
          if (history.authors) {
            history.authors.push(author);
          } else if (history && !history?.authors) {
            history.authors = [author];
          }
          const update: Post = { ...history } as Post;
          setHistory(update);
          updateContent$.next({ ...update, historyId: history?.id });
          setSelectedAddAuthor(undefined);
          setEmail('');
        });
    }
  }

  function onDeleteAuthor(index: number) {
    if (!history) {
      return;
    }
    if (history.authors) {
      const authors = [...history.authors];
      authors.splice(index, 1);

      const historyUpdate = {
        ...history,
      };
      if (historyUpdate.authors) {
        historyUpdate.authors = authors;
      }
      setHistory(historyUpdate);
      updateContent$.next({ ...historyUpdate, historyId: history?.id });
    }
  }

  function onSelectAddAuthor(author: UserInfoExtended) {
    if (author && author.email) {
      setEmail(author.email);
      setSelectedAddAuthor(author);
      setAddAuthors([]);
    }
  }

  function addTag(tag: string) {
    if (!tag) {
      return;
    }
    if (history?.tag) {
      history.tag.push(tag);
    } else if (history && !history?.tag) {
      history.tag = [tag];
    }
    const update: Post = { ...history } as Post;
    setHistory(update);
    setTag('');
    updateContent$.next({ ...update, historyId: history?.id });
  }

  function removeTag(index: number) {
    if (history?.tag) {
      history.tag = history.tag
        .slice(0, index)
        .concat(history.tag.slice(index + 1, history.tag.length));
    }
    const update: Post = { ...history } as Post;
    setHistory(update);
    updateContent$.next({ ...update, historyId: history?.id });
  }

  if (!history) {
    return <></>;
  }

  return (
    <aside className={`pt-2 ${tab === TabType.edit ? 'block' : 'hidden'}`}>
      <PublishModal
        history={history}
        setSaving={setSaving}
        setSlugUnique={setSlugUnique}
      />
      <div className="flex flex-wrap content-center">
        <div className="flex content-center">
          <p className="flex">saved: </p>
          <TimeAgo date={history?.updatedAt?.toDate() as Date} />
        </div>
      </div>
      <section className="flex-col w-full">
        <div className="p-2 text-2xl rounded-t-lg text-basics-50 dark:text-basics-50 bg-primary-900 dark:bg-primary-900">
          Status
        </div>
        <div className="grid gap-2 p-2 justify-items-start bg-basics-50">
          <div className="flex items-center space-x-2">
            {/* Current Post History */}
            <div
              className={`my-1 flex ${
                history.status === PostStatus.draft
                  ? `px-2 py-1 rounded-full bg-basics-400 text-white dark:bg-basics-400 dark:text-white`
                  : `px-2 py-1 rounded-full bg-success-600 text-basics-50 dark:bg-success-600 dark:text-basics-50`
              }`}
            >
              {history.status}
            </div>
            {/* Date of History */}
            <div>
              {postHistories.find((h) => h.status === PostStatus.published) ? (
                <div className="bg-basics-50">
                  {postHistories
                    .find((h) => h.status === PostStatus.published)
                    ?.publishedAt?.toDate()
                    .toDateString()}
                </div>
              ) : (
                ''
              )}
            </div>
          </div>
          {/* Any Post History showing Published */}
          {history.status != PostStatus.published &&
          postHistories.find((h) => h.status === PostStatus.published) ? (
            <div className="flex items-center space-x-2">
              <div className="px-2 py-1 m-1 rounded-full bg-success-600 text-basics-50 dark:bg-success-600 dark:text-basics-50">
                {PostStatus.published}
              </div>
              <div>
                {postHistories.find(
                  (h) => h.status === PostStatus.published
                ) ? (
                  <div className="bg-basics-50">
                    {postHistories
                      .find((h) => h.status === PostStatus.published)
                      ?.publishedAt?.toDate()
                      .toDateString()}
                  </div>
                ) : (
                  ''
                )}
              </div>
            </div>
          ) : (
            ''
          )}
        </div>
      </section>
      <div className="flex-col w-full">
        <div className="p-2 text-2xl text-basics-50 dark:text-basics-50 bg-primary-900 dark:bg-primary-900">
          Media
        </div>
        <div className="p-2 bg-basics-50 dark:bg-basics-800">
          <img src="" alt="" className="" />
          <button
            className="w-full btn-secondary"
            onClick={() => selectTab(TabType.media)}
          >
            Add Media
          </button>
        </div>
      </div>
      <div className="flex-col w-full">
        <div className="p-2 text-2xl text-basics-50 dark:text-basics-50 bg-primary-900 dark:bg-primary-900">
          Authors
        </div>
        <div className="relative p-2 bg-basics-50 dark:bg-basics-800">
          <div className="flex flex-wrap pb-2">
            <input
              type="text"
              className="w-3/4"
              value={email}
              onChange={(e) => onAuthor(e)}
            />
            <button
              className="flex-grow ml-1 border-2 border-primary-900 rounded-xl hover:text-secondary-500 hover:border-secondary-500 focus:outline-none focus:ring-2 focus:ring-secondary-600 focus:border-transparent"
              onClick={() => addAuthor(selectedAddAuthor)}
            >
              Add
            </button>
          </div>
          {addAuthors && addAuthors.length > 0 && (
            <ul className="absolute z-20 w-full py-2 bg-white rounded-md shadow-xl">
              {addAuthors.map((a, i) => (
                <li
                  key={i}
                  className="flex block px-4 py-2 text-sm cursor-pointer text-primary-900 hover:bg-primary-900 hover:text-white"
                  onClick={() => onSelectAddAuthor(a)}
                >
                  {a.email}
                </li>
              ))}
            </ul>
          )}
          {history.authors &&
            history.authors.map((author, i) => (
              <div key={i} className="flex">
                <button
                  className="text-lg rounded hover:bg-primary-900 hover:text-primary-50"
                  onClick={() => onDeleteAuthor(i)}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    className="w-4"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                </button>
                <p className="text-lg">{author.email}</p>
              </div>
            ))}
        </div>
      </div>
      <div className="flex-col w-full">
        <div className="p-2 text-2xl text-basics-50 dark:text-basics-50 bg-primary-900 dark:bg-primary-900">
          Revisions
        </div>
        <div className="p-2 bg-basics-50 dark:bg-basics-800">
          {postHistories.length}
          <a
            className="pl-2 cursor-pointer"
            onClick={() => setTab(TabType.history)}
          >
            Edit
          </a>
        </div>
      </div>
      <div className="flex-col w-full">
        <div className="p-2 text-2xl text-basics-50 dark:text-basics-50 bg-primary-900 dark:bg-primary-900">
          Tags
        </div>
        <div className="bg-basics-50">
          <div className="flex flex-wrap p-2">
            <input
              type="text"
              className="w-3/4"
              value={tag}
              onChange={(e) => setTag(e.target.value)}
            />
            <button
              className="flex-grow ml-1 border-2 border-primary-900 rounded-xl hover:text-secondary-500 hover:border-secondary-500 focus:outline-none focus:ring-2 focus:ring-secondary-600 focus:border-transparent"
              onClick={() => addTag(tag)}
            >
              Add
            </button>
          </div>
          <div className="flex flex-wrap pl-2">
            {history.tag?.map((t, i) => (
              <div
                className="flex px-2 py-1 m-1 text-white rounded-full bg-secondary-500"
                key={i}
              >
                <p>{t}</p>
                <button onClick={() => removeTag(i)}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    className="w-4"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
}
