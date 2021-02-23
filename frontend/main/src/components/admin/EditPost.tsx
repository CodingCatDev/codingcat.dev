import React, { useState, useEffect } from 'react';

import TimeAgo from 'react-timeago';
import {
  postDataObservable,
  postHistoriesDataObservable,
  postHistoryCreate,
  postHistoryPublish,
  postHistoryUpdate,
  postsSlugUnique,
} from '@/services/api';

import { toKebabCase } from '@/utils/basics/stringManipulation';

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
  const [slugUnique, setSlugUnique] = useState(true);

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
    validSlug(slug).subscribe((unique) => {
      setSlugUnique(unique);
      updateContent$.next({ ...update, historyId: history?.id });
    });
  }

  function validSlug(slugInput: string) {
    const slug = toKebabCase(slugInput);
    return postsSlugUnique(slug).pipe(take(1));
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
          <div>
            {/* Top Inputs */}
            <section className="flex flex-wrap space-y-2 lg:space-y-0">
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
      case TabType.media:
        return (
          <section className="grid grid-cols-1 gap-4">
            <section className="flex flex-wrap space-x-4">
              <div className="grid gap-2 place-items-center text-primary-900">
                <h3 className="font-sans text-2xl bold">Default Image</h3>
                <img src="" alt="" width="400px" height="250px" />
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
                  <button className="flex space-x-4 btn-primary">
                    <svg
                      className="w-6"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                      />
                    </svg>{' '}
                    Upload Media
                  </button>
                  <select></select>
                </div>
              </header>
              <section className="grid w-full h-full gap-4 p-4 overflow-y-auto bg-basics-50 dark:bg-basics-800 grid-cols-fit lg:max-h-96">
                <img src="" alt="" width="300px" height="150px" />
                <img src="" alt="" width="300px" height="150px" />
                <img src="" alt="" width="300px" height="150px" />
                <img src="" alt="" width="300px" height="150px" />
                <img src="" alt="" width="300px" height="150px" />
                <img src="" alt="" width="300px" height="150px" />
                <img src="" alt="" width="300px" height="150px" />
                <img src="" alt="" width="300px" height="150px" />
                <img src="" alt="" width="300px" height="150px" />
                <img src="" alt="" width="300px" height="150px" />
                <img src="" alt="" width="300px" height="150px" />
                <img src="" alt="" width="300px" height="150px" />
              </section>
            </section>
            {/* {history && (
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
            )} */}
          </section>
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
        <div className="w-full max-w-8xl">
          <nav className="flex justify-between w-full h-12 overflow-x-auto bg-secondary-500 dark:bg-secondary-600">
            <button
              className={`block px-4 2xl:px-20 font-medium  hover:text-primary-900 text-basics-50 dark:text-basics-50 focus:outline-none  ${
                tab == TabType.edit
                  ? 'border-b-4 border-primary-900 dark:border-primary-900'
                  : 'border-b-4 border-secondary-500 dark:border-secondary-500'
              }`}
              onClick={() => selectTab(TabType.edit)}
            >
              EDIT
            </button>
            <button
              className={`block px-4 2xl:px-20 font-medium  hover:text-primary-900 text-basics-50 dark:text-basics-50 focus:outline-none  ${
                tab == TabType.media
                  ? 'border-b-4 border-primary-900 dark:border-primary-900'
                  : 'border-b-4 border-secondary-500 dark:border-secondary-500'
              }`}
              onClick={() => selectTab(TabType.media)}
            >
              MEDIA
            </button>
            <button
              className={`block px-4 2xl:px-20 font-medium  hover:text-primary-900 text-basics-50 dark:text-basics-50 focus:outline-none ${
                tab == TabType.preview
                  ? 'border-b-4 border-primary-900 dark:border-primary-900'
                  : 'border-b-4 border-secondary-500 dark:border-secondary-500'
              }`}
              onClick={() => selectTab(TabType.preview)}
            >
              MDX PREVIEW
            </button>
            <button
              className={`block px-4 2xl:px-20 font-medium  hover:text-primary-900 text-basics-50 dark:text-basics-50 focus:outline-none ${
                tab == TabType.sections
                  ? 'border-b-4 border-primary-900 dark:border-primary-900'
                  : 'border-b-4 border-secondary-500 dark:border-secondary-500'
              } ${history.type == PostType.course ? 'block' : 'hidden'}`}
              onClick={() => selectTab(TabType.sections)}
            >
              SECTIONS
            </button>
            <button
              className={`block px-4 2xl:px-20 font-medium  hover:text-primary-900 text-basics-50 dark:text-basics-50 focus:outline-none ${
                tab == TabType.history
                  ? 'border-b-4 border-primary-900 dark:border-primary-900'
                  : 'border-b-4 border-secondary-500 dark:border-secondary-500'
              }`}
              onClick={() => selectTab(TabType.history)}
            >
              HISTORY
            </button>
          </nav>
          <div className="p-4">
            {/* Tab Section */}
            {/* <div className="grid grid-cols-1 gap-4 lg:grid-cols-sidebar"> className="grid grid-cols-1 gap-2"*/}
            {/* Main Input */}
            {tab == TabType.edit ? (
              <section className="grid grid-cols-1 gap-4 lg:grid-cols-sidebar">
                {onTab()}
                <aside
                  className={`pt-2 ${
                    tab === TabType.edit ? 'block' : 'hidden'
                  }`}
                >
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
                      {/* Any Post History showing Published */}
                      {history.status != PostStatus.published &&
                      postHistories.find(
                        (h) => h.status === PostStatus.published
                      ) ? (
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
                                  .find(
                                    (h) => h.status === PostStatus.published
                                  )
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
                      <button className="w-full btn-secondary">
                        Add Media
                      </button>
                    </div>
                  </div>
                  <div className="flex-col w-full">
                    <div className="p-2 text-2xl text-basics-50 dark:text-basics-50 bg-primary-900 dark:bg-primary-900">
                      Author
                    </div>
                    <div className="p-2 bg-basics-50 dark:bg-basics-800">
                      {history.createdBy}
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
              </section>
            ) : (
              <>{onTab()}</>
            )}
          </div>
        </div>
      ) : (
        // </div>
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
