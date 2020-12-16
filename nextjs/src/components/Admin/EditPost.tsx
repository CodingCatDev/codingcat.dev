import React, { useState, ComponentType, useEffect } from 'react';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import 'primereact/resources/themes/saga-purple/theme.css';

import TimeAgo from 'react-timeago';

import {
  postDataObservable,
  postHistoriesDataObservable,
  postHistoryCreate,
  postHistoryDataObservable,
  postHistoryUpdate,
  postUpdate,
} from '@/services/api';

import { Post } from '@/models/post.model';

import { debounce, switchMap, take } from 'rxjs/operators';
import { interval, Subject } from 'rxjs';
import matter from 'gray-matter';
import Link from 'next/link';
import ShowMDX from '@/components/Admin/ShowMDX';
import PostHistories from '@/components/Admin/PostHistories';

export default function EditPost({ router }: { router: any }) {
  const [postFound, setPostFound] = useState(false);
  const [postHistories, setPostHistories] = useState<Post[]>([]);
  const [history, setHistory] = useState<Post | null>(null);
  const [post, setPost] = useState<Post | null>(null);
  const [path, setPath] = useState<string>('');
  const [tab, setTab] = useState<string>('edit');
  const [saving, setSaving] = useState<boolean>(false);
  const [updateContent$, setUpdateContent$] = useState<Subject<Post>>(
    new Subject<Post>()
  );
  const [preview, setPreview] = useState<string>('');
  const [scope, setScope] = useState<
    { [variableName: string]: unknown } | undefined
  >(undefined);
  const [components, setComponents] = useState<
    { [name: string]: ComponentType<any> } | undefined
  >({});
  const [showHistory, setShowHistory] = useState(false);

  // Sets initial state
  useEffect(() => {
    const path = `/posts/${router.query.id}`;
    setPath(path);

    // Set initial post to created
    const postSubscribe = postDataObservable(path)
      .pipe(
        switchMap((post) => {
          setPostFound(true);
          setPost(post);
          return postHistoriesDataObservable(post.id as string);
        })
      )
      .subscribe((histories) => {
        setPostHistories(histories);
        if (histories.length > 0) {
          setHistory(histories[0]);
        }
      });

    const contentSubscribe = updateContent$
      .pipe(debounce(() => interval(800)))
      .subscribe((h) => {
        setSaving(true);

        // We need a new version if the last history is published
        if (h?.publishedAt) {
          postHistoryCreate(h)
            .pipe(take(1))
            .subscribe((u) => {
              setSaving(false);
            });
        } else {
          postHistoryUpdate(h)
            .pipe(take(1))
            .subscribe(() => setSaving(false));
        }
      });
    return () => {
      postSubscribe.unsubscribe();
      contentSubscribe.unsubscribe();
    };
  }, [router]);

  useEffect(() => {
    if (tab === 'preview') {
      createContentFromMdx();
    } else {
      setPreview('');
    }
  }, [tab]);

  async function createContentFromMdx() {
    if (!history || !history.content) {
      return;
    }
    const { content, data } = matter(history.content);
    setPreview(content);
    setScope(data);
  }

  function handleChange(event: { target: { value: string } }) {
    const content = event.target.value;
    const update: Post = { ...history, content } as Post;
    setHistory(update);
    updateContent$.next({ ...update, historyId: history?.id });
  }
  function selectTab(tab: string) {
    setTab(tab);
  }

  function toggleShowHistory() {
    setShowHistory(!showHistory);
  }

  return (
    <>
      <div className="relative w-full h-full">
        {history && Object.keys(history).length > 0 ? (
          <>
            <div className="flex w-full p-2 text-sm bg-gray-800">
              <div className="flex flex-col items-start flex-grow">
                <div className="flex flex-wrap items-center flex-grow text-white">
                  <div className="p-1 rounded-sm bg-ccd-basics-300">Draft</div>

                  <span
                    className="ml-1 text-xs underline cursor-pointer"
                    onClick={() => toggleShowHistory()}
                  >
                    {history?.id}
                  </span>
                </div>
                <div className="flex items-center justify-center pr-2 text-white">
                  <span>
                    <TimeAgo date={history?.updatedAt?.toDate() as Date} />
                  </span>
                  {saving ? (
                    <span>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        className="w-8 h-8"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                        />
                      </svg>
                    </span>
                  ) : (
                    <span>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        className="w-8 h-8 text-ccd-greens-500"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </span>
                  )}
                </div>
              </div>
              <div>
                <button
                  className={`text-white btn-primary bg-ccd-basics-300 ${
                    showHistory ? 'block' : 'hidden'
                  }`}
                  onClick={() => toggleShowHistory()}
                >
                  Back
                </button>
              </div>
            </div>
            <div className="w-full h-full">
              {showHistory ? (
                <PostHistories postHistories={postHistories} />
              ) : (
                <>
                  <ul className="grid grid-cols-2">
                    <li
                      className={`py-2 px-6 rounded-t-lg cursor-pointer ${
                        tab === 'edit'
                          ? 'bg-ccd-purples-800 text-white'
                          : 'bg-ccd-basics-200 text-ccd-basics-500'
                      }`}
                      onClick={() => selectTab('edit')}
                    >
                      Edit
                    </li>
                    <li
                      className={`py-2 px-6 rounded-t-lg cursor-pointer ${
                        tab === 'preview'
                          ? 'bg-ccd-purples-800 text-white'
                          : 'bg-ccd-basics-200 text-ccd-basics-500'
                      }`}
                      onClick={() => selectTab('preview')}
                    >
                      Preview
                    </li>
                  </ul>
                  {tab === 'edit' ? (
                    <textarea
                      id="content"
                      name="content"
                      onChange={handleChange}
                      className={`form-textarea shadow-sm focus:ring-indigo-500 focus:border-indigo-500 border-0 block h-full w-full sm:text-sm rounded-md rounded-t-none resize-none`}
                      placeholder="Markdown goes here..."
                      value={history ? history.content : ''}
                    ></textarea>
                  ) : (
                    <div
                      className={`block h-full w-full sm:text-sm rounded-md rounded-t-none overflow-y-auto bg-ccd-basics-100`}
                    >
                      <article className="pt-8 prose prose-ccd-purples lg:prose-xl">
                        <ShowMDX components={components} scope={scope}>
                          {preview}
                        </ShowMDX>
                      </article>
                    </div>
                  )}
                </>
              )}
            </div>
          </>
        ) : (
          <div className="grid w-full h-full grid-cols-1 place-content-center place-items-center">
            {postFound ? (
              <div className="pb-8">
                Creating your first history of this post...
              </div>
            ) : (
              <div className="pb-8">
                It appears you have found a page without data.
              </div>
            )}
            <Link href={`/admin/${router.query.type}`}>
              <a>
                <button className="btn-primary">
                  {`Return to ${router.query.type} list.`}
                </button>
              </a>
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
