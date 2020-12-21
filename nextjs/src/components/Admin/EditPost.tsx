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
  postHistoryPublish,
  postHistoryUpdate,
  postUpdate,
} from '@/services/api';

import { Post, PostStatus, PostType } from '@/models/post.model.ts';
import { Course } from '@/models/course.model.ts';

import { debounce, switchMap, take } from 'rxjs/operators';
import { interval, Subject } from 'rxjs';
import matter from 'gray-matter';
import Link from 'next/link';
import ShowMDX from '@/components/Admin/ShowMDX';
import PostHistories from '@/components/Admin/PostHistories';
import CourseSections from '@/components/Admin/CourseSections';

enum TabType {
  edit = 'edit',
  sections = 'sections',
  preview = 'preview',
}

export default function EditPost({
  router,
  type,
}: {
  router: any;
  type: PostType;
}) {
  const [postFound, setPostFound] = useState(false);
  const [postHistories, setPostHistories] = useState<Post[] | Course[]>([]);
  const [history, setHistory] = useState<Post | Course>();
  const [post, setPost] = useState<Post | Course>();
  const [path, setPath] = useState<string>('');
  const [tab, setTab] = useState<TabType>(TabType.edit);
  const [saving, setSaving] = useState<boolean>(false);
  const [updateContent$, setUpdateContent$] = useState<Subject<Post | Course>>(
    new Subject<Post | Course>()
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
    const update: Post | Course = { ...history, content } as Post | Course;
    setHistory(update);
    updateContent$.next({ ...update, historyId: history?.id });
  }

  function toggleShowHistory() {
    setShowHistory(!showHistory);
  }

  function onPublish() {
    if (history) {
      setSaving(true);
      postHistoryPublish(history)
        .pipe(take(1))
        .subscribe(() => setSaving(false));
    }
  }
  function selectTab(tab: TabType) {
    setTab(tab);
  }

  function onTab() {
    switch (tab) {
      case TabType.sections:
        return <CourseSections historyInput={history as Course} />;
      case TabType.preview:
        return (
          <div
            className={`block h-full w-full sm:text-sm rounded-md rounded-t-none overflow-y-auto`}
          >
            <article className="pt-8 prose prose-purple lg:prose-xl">
              <ShowMDX components={components} scope={scope}>
                {preview}
              </ShowMDX>
            </article>
          </div>
        );
      default:
        return (
          <textarea
            id="content"
            name="content"
            onChange={handleChange}
            className={`form-textarea shadow-sm focus:ring-indigo-500 focus:border-indigo-500 border-0 block h-full w-full sm:text-sm rounded-md rounded-t-none resize-none`}
            placeholder="Markdown goes here..."
            value={history ? history.content : ''}
          ></textarea>
        );
    }
  }

  return (
    <>
      <div className="relative w-full h-full">
        {history && Object.keys(history).length > 0 ? (
          <>
            <div className="flex w-full p-2 text-sm bg-gray-800">
              <div className="flex flex-col items-start flex-grow">
                <div className="flex flex-wrap items-center flex-grow text-white">
                  <div
                    className={`p-1 rounded-sm ${
                      history.status === PostStatus.draft
                        ? 'bg-gray-300'
                        : 'bg-green-300'
                    }`}
                  >
                    {history.status}
                  </div>

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
                        className="w-8 h-8 text-green-500"
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
                  className={`text-white btn-primary bg-gray-300 ${
                    showHistory ? 'block' : 'hidden'
                  }`}
                  onClick={() => toggleShowHistory()}
                >
                  Back
                </button>
                <button
                  className={`text-white text-sm btn-primary bg-purple-800 flex items-center ${
                    !showHistory ? 'block' : 'hidden'
                  }`}
                  onClick={() => onPublish()}
                >
                  Publish
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    className="h-6 ml-2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                    />
                  </svg>
                </button>
              </div>
            </div>
            <div className="w-full h-full">
              {showHistory ? (
                <PostHistories postHistories={postHistories} />
              ) : (
                <>
                  <ul className="grid grid-flow-col bg-gray-800">
                    <li
                      className={`py-2 px-6 rounded-t-xl cursor-pointer ${
                        tab === TabType.edit
                          ? 'bg-purple-800 text-white'
                          : 'bg-gray-200 text-gray-500'
                      }`}
                      onClick={() => selectTab(TabType.edit)}
                    >
                      Edit
                    </li>
                    <li
                      className={`py-2 px-6 rounded-t-xl cursor-pointer
                      ${type === PostType.course ? 'block' : 'hidden'} 
                      ${
                        tab === TabType.sections
                          ? 'bg-purple-800 text-white'
                          : 'bg-gray-200 text-gray-500'
                      }`}
                      onClick={() => selectTab(TabType.sections)}
                    >
                      Sections
                    </li>
                    <li
                      className={`py-2 px-6 rounded-t-xl cursor-pointer ${
                        tab === TabType.preview
                          ? 'bg-purple-800 text-white'
                          : 'bg-gray-200 text-gray-500'
                      }`}
                      onClick={() => selectTab(TabType.preview)}
                    >
                      Preview
                    </li>
                  </ul>
                  {onTab()}
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
