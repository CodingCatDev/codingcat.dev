import React, { useState, useEffect } from 'react';

import TimeAgo from 'react-timeago';
import {
  postDataObservable,
  postHistoriesDataObservable,
  postHistoryCreate,
  postHistoryPublish,
  postHistoryUpdate,
} from '@/services/api';

import { Post, PostStatus, PostType, MediaType } from '@/models/post.model.ts';

import { debounce, switchMap, take } from 'rxjs/operators';
import { interval, Subject } from 'rxjs';
import Link from 'next/link';
import ShowMDX from '@/components/admin/ShowMDX';
import PostHistories from '@/components/admin/PostHistories';
import CourseSections from '@/components/admin/CourseSections';

import SimpleMDE from 'react-simplemde-editor';
import 'easymde/dist/easymde.min.css';
import CloudinaryUpload from '@/components/admin/CloudinaryUpload';
import VideoFormModal from '@/components/admin/VideoFormModal';

import ImageModal from '@/components/admin/ImageModal';
import VideoModal from '@/components/admin/VideoModal';
import PublishModal from '@/components/admin/PublishModal';

enum TabType {
  edit = 'edit',
  media = 'media',
  sections = 'sections',
  preview = 'preview',
  history = 'history',
}

export default function EditPost({
  type,
  id,
}: {
  type: PostType;
  id: string;
}): JSX.Element {
  const [postFound, setPostFound] = useState(false);
  const [postHistories, setPostHistories] = useState<Post[]>([]);
  const [history, setHistory] = useState<Post>();
  const [, setPost] = useState<Post>();
  const [tab, setTab] = useState<TabType>(TabType.edit);
  const [saving, setSaving] = useState<boolean>(false);
  const [updateContent$] = useState<Subject<Post>>(new Subject<Post>());
  const [preview, setPreview] = useState<string>('');
  const [tag, setTag] = useState('');

  // Sets initial state
  useEffect(() => {
    setTab(TabType.edit);
    // Set initial post to created
    const postSubscribe = postDataObservable(`posts/${id}`)
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
          const dbHistory = histories[0];
          if (dbHistory) {
            setHistory(dbHistory);
          }
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
            .subscribe(() => {
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
  }, [type, id]);

  useEffect(() => {
    if (tab === 'preview') {
      setPreview(history?.content || '');
    } else {
      setPreview('');
    }
  }, [tab]);

  function onTitle(title: string) {
    const update: Post = { ...history, title } as Post;
    setHistory(update);
    updateContent$.next({ ...update, historyId: history?.id });
  }

  function onSlug(slug: string) {
    const update: Post = { ...history, slug } as Post;
    setHistory(update);
    updateContent$.next({ ...update, historyId: history?.id });
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

  function selectTab(tab: TabType) {
    setTab(tab);
  }

  function onTab() {
    switch (tab) {
      case TabType.edit:
        return (
          <>
            {/* Top Inputs */}
            <section className="flex flex-wrap space-y-2">
              <div className="flex flex-col pr-2">
                <div className="flex">
                  <p className="flex items-center mr-2 font-bold uppercase text-primary-900">
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
                  <p className="flex items-center mr-2 font-bold uppercase text-primary-900">
                    Slug:{' '}
                  </p>
                  <input
                    type="text"
                    placeholder="type/slug"
                    value={history?.slug}
                    onChange={(e) => onSlug(e.target.value)}
                  ></input>
                </div>
              </div>
              <div className="flex flex-grow">
                <div className="flex w-full">
                  <p className="flex items-center mr-2 font-bold uppercase text-primary-900">
                    Excerpt:{' '}
                  </p>
                  <textarea
                    placeholder="Details about Post"
                    className="resize-none"
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
              }}
            />
          </>
        );
      case TabType.media:
        return (
          <>
            {history && (
              <>
                <VideoModal post={history} />
                <CloudinaryUpload
                  setHistory={setHistory}
                  history={history}
                  type={MediaType.video}
                />
                <VideoFormModal setHistory={setHistory} post={history} />
                {history.coverPhoto ? (
                  <ImageModal post={history} />
                ) : (
                  <CloudinaryUpload
                    setHistory={setHistory}
                    history={history}
                    type={MediaType.photo}
                  />
                )}
              </>
            )}
          </>
        );
      case TabType.sections:
        return <CourseSections historyInput={history as Post} />;
      case TabType.preview:
        return (
          <div
            className={`block h-full w-full sm:text-sm rounded-md rounded-t-none overflow-y-auto`}
          >
            <article className="pt-8 prose prose-purple lg:prose-xl">
              <ShowMDX markdown={preview}></ShowMDX>
            </article>
          </div>
        );
      case TabType.history:
        return <PostHistories postHistories={postHistories} />;
      default:
        return <p>This tab is not defined yet.</p>;
    }
  }

  return (
    <>
      {history && Object.keys(history).length > 0 ? (
        <div className="w-full ">
          <nav className="flex justify-between w-full h-12 overflow-x-auto bg-secondary-500">
            <button
              className={`block px-4 2xl:px-20 font-medium  hover:text-primary-900 text-white focus:outline-none  ${
                tab == TabType.edit
                  ? 'border-b-4 border-primary-900'
                  : 'border-b-4 border-secondary-500'
              }`}
              onClick={() => selectTab(TabType.edit)}
            >
              EDIT
            </button>
            <button
              className={`block px-4 2xl:px-20 font-medium  hover:text-primary-900 text-white focus:outline-none  ${
                tab == TabType.media
                  ? 'border-b-4 border-primary-900'
                  : 'border-b-4 border-secondary-500'
              }`}
              onClick={() => selectTab(TabType.media)}
            >
              MEDIA
            </button>
            <button
              className={`block px-4 2xl:px-20 font-medium  hover:text-primary-900 text-white focus:outline-none ${
                tab == TabType.preview
                  ? 'border-b-4 border-primary-900'
                  : 'border-b-4 border-secondary-500'
              }`}
              onClick={() => selectTab(TabType.preview)}
            >
              MDX PREVIEW
            </button>
            <button
              className={`block px-4 2xl:px-20 font-medium  hover:text-primary-900 text-white focus:outline-none ${
                tab == TabType.sections
                  ? 'border-b-4 border-primary-900'
                  : 'border-b-4 border-secondary-500'
              } ${history.type == PostType.course ? 'block' : 'hidden'}`}
              onClick={() => selectTab(TabType.sections)}
            >
              SECTIONS
            </button>
            <button
              className={`block px-4 2xl:px-20 font-medium  hover:text-primary-900 text-white focus:outline-none ${
                tab == TabType.history
                  ? 'border-b-4 border-primary-900'
                  : 'border-b-4 border-secondary-500'
              }`}
              onClick={() => selectTab(TabType.history)}
            >
              HISTORY
            </button>
          </nav>
          <div className="p-4 ">
            {/* Tab Section */}
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-sidebar">
              {/* Main Input */}
              <section className="grid grid-cols-1 gap-2">{onTab()}</section>
              {/* Side Input */}
              <aside
                className={`pt-2 ${tab === TabType.edit ? 'block' : 'hidden'}`}
              >
                <PublishModal history={history} setSaving={setSaving} />
                <div className="flex flex-wrap content-center">
                  <div className="flex content-center">
                    <p className="flex">saved: </p>
                    <TimeAgo date={history?.updatedAt?.toDate() as Date} />
                  </div>
                </div>
                <div className="flex-col w-full">
                  <div className="pl-2 text-2xl text-white bg-primary-900">
                    Status
                  </div>
                  <div className="flex pl-2 bg-basics-50">
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
                    {/* Any Post History showing Published */}
                    {history.status != PostStatus.published &&
                    postHistories.find(
                      (h) => h.status === PostStatus.published
                    ) ? (
                      <div className="px-2 py-1 m-1 rounded-full bg-success-600 text-basics-50 dark:bg-success-600 dark:text-basics-50">
                        {PostStatus.published}
                      </div>
                    ) : (
                      ''
                    )}
                  </div>
                </div>
                <div className="flex-col w-full">
                  <div className="pl-2 text-2xl text-white bg-primary-900">
                    Published On
                  </div>
                  <div className="pl-2 bg-basics-50">
                    {' '}
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
                <div className="flex-col w-full">
                  <div className="pl-2 text-2xl text-white bg-primary-900">
                    Author
                  </div>
                  <div className="pl-2 bg-basics-50">{history.createdBy}</div>
                </div>
                <div className="flex-col w-full">
                  <div className="pl-2 text-2xl text-white bg-primary-900">
                    Revisions
                  </div>
                  <div className="pl-2 bg-basics-50">
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
                  <div className="pl-2 text-2xl text-white bg-primary-900">
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
                        onClick={(e) => addTag(tag)}
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
            </div>
          </div>
        </div>
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
          <Link href={`/admin/${type}`}>
            <a>
              <button className="btn-primary">
                {`Return to ${type} list.`}
              </button>
            </a>
          </Link>
        </div>
      )}
    </>
  );
}
