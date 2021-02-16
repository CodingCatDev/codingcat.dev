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
  const [showHistory, setShowHistory] = useState(false);

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

          // Most likely this is the first time creation
          // Update the frontmatter with the correct data
          // the database
          if (dbHistory) {
            let title = dbHistory.title || '';
            let excerpt = dbHistory.excerpt || '';
            let slug = dbHistory.slug || '';

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

  function handleChange(value: string) {
    const content = value;
    const update: Post = { ...history, content } as Post;
    setHistory(update);
    updateContent$.next({ ...update, historyId: history?.id });
  }

  function toggleShowHistory() {
    setShowHistory(!showHistory);
  }

  function selectTab(tab: TabType) {
    setTab(tab);
  }

  function onTab() {
    switch (tab) {
      case TabType.edit:
        return (
          <SimpleMDE
            onChange={handleChange}
            value={history ? history.content : ''}
            options={{
              sideBySideFullscreen: false,
            }}
          />
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
        <div className="w-full">
          <nav className="flex w-full h-12 rounded-t-lg bg-secondary-500">
            <button
              className={`block px-6 font-medium  text-primary-900 hover:text-white focus:outline-none  ${
                tab == TabType.edit ? 'border-b-2' : ''
              }`}
              onClick={() => selectTab(TabType.edit)}
            >
              EDIT
            </button>
            <button
              className={`block px-6 font-medium  text-primary-900 hover:text-white focus:outline-none  ${
                tab == TabType.media ? 'border-b-2' : ''
              }`}
              onClick={() => selectTab(TabType.media)}
            >
              MEDIA
            </button>
            <button
              className={`block px-6 font-medium  text-primary-900 hover:text-white focus:outline-none ${
                tab == TabType.preview ? 'border-b-2' : ''
              }`}
              onClick={() => selectTab(TabType.preview)}
            >
              MDX PREVIEW
            </button>
            <button
              className={`block px-6 font-medium  text-primary-900 hover:text-white focus:outline-none ${
                tab == TabType.sections ? 'border-b-2' : ''
              }`}
              onClick={() => selectTab(TabType.sections)}
            >
              SECTIONS
            </button>
            <button
              className={`block px-6 font-medium  text-primary-900 hover:text-white focus:outline-none ${
                tab == TabType.history ? 'border-b-2' : ''
              }`}
              onClick={() => selectTab(TabType.history)}
            >
              HISTORY
            </button>
          </nav>
          {/* Top Inputs */}
          <section className="flex py-2">
            <div className="flex flex-col flex-grow pr-2">
              <div className="flex">
                <p className="mr-2 uppercase text-primary-900">Title: </p>
                <input type="text" placeholder="Title"></input>
              </div>
              <div className="flex mt-2">
                <p className="mr-2 uppercase text-primary-900">Slug: </p>
                <input type="text" placeholder="type/slug"></input>
              </div>
            </div>
            <div className="flex">
              <div className="flex">
                <p className="mr-2 uppercase text-primary-900">Excerpt: </p>
                <textarea
                  placeholder="Details about Post"
                  className="resize-none"
                ></textarea>
              </div>
            </div>
            <div className="flex">
              <TimeAgo date={history?.updatedAt?.toDate() as Date} />
              {saving ? (
                <span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    className="w-8 h-8"
                    style={{ height: '2rem', width: '2rem' }}
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
                    style={{ height: '2rem', width: '2rem' }}
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
          </section>

          {/* Tab Section */}
          <section>{onTab()}</section>

          {/* Side Input */}

          <section>
            <PublishModal history={history} setSaving={setSaving} />
          </section>
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
