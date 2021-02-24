import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

import {
  postDataObservable,
  postHistoriesDataObservable,
  postHistoryCreate,
  postHistoryPublish,
  postHistoryUpdate,
} from '@/services/api';

import { Post, PostType } from '@/models/post.model';
import { TabType } from '@/models/admin.model';

import { debounce, switchMap, take } from 'rxjs/operators';
import { interval, Subject } from 'rxjs';
import Link from 'next/link';
import ShowMDX from '@/components/admin/ShowMDX';
import PostHistories from '@/components/admin/PostHistories';
import EditPostEditor from '@/components/admin/EditPostEditor';
import EditPostSidebar from '@/components/admin/EditPostSidebar';
import EditPostMedia from '@/components/admin/EditPostMedia';
import EditPostCourseSections from '@/components/admin/EditPostCourseSections';
import EditPostCourseSettings from '@/components/admin/EditPostCourseSettings';
import EditPostCourseGroups from '@/components/admin/EditPostCourseGroups';

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
  // const [preview, setPreview] = useState<string>('');
  const [slugUnique, setSlugUnique] = useState(true);

  const router = useRouter();

  // Sets initial state
  useEffect(() => {
    // Set Tab after refresh
    const { tab } = router.query;
    selectTab(tab ? (tab as TabType) : TabType.edit);

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

  // useEffect(() => {
  //   if (tab === 'preview') {
  //     setPreview(history?.content || '');
  //   } else {
  //     setPreview('');
  //   }
  // }, [tab]);

  function selectTab(tab: TabType) {
    setTab(tab);
    const { id, type } = router.query;
    router.push(
      {
        pathname: `/admin/${type}/${id}`,
        query: {
          tab: tab,
        },
      },
      undefined,
      { shallow: true }
    );
  }

  function onTab() {
    switch (tab) {
      case TabType.edit:
        return (
          <EditPostEditor
            updateContent$={updateContent$}
            history={history}
            setHistory={setHistory}
            slugUnique={slugUnique}
            setSlugUnique={setSlugUnique}
          />
        );
      case TabType.media:
        return <EditPostMedia history={history} setHistory={setHistory} />;
      case TabType.preview:
        return (
          <div
            className={`block h-full w-full sm:text-sm rounded-md rounded-t-none overflow-y-auto`}
          >
            <article className="pt-8 prose prose-purple lg:prose-xl">
              <ShowMDX markdown={history?.content || ''}></ShowMDX>
            </article>
          </div>
        );
      case TabType.sections:
        return <EditPostCourseSections historyInput={history as Post} />;
      case TabType.settings:
        return <EditPostCourseSettings historyInput={history as Post} />;
      case TabType.groups:
        return <EditPostCourseGroups historyInput={history as Post} />;
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
              className={`block px-4 2xl:px-12 font-medium  hover:text-primary-900 text-basics-50 dark:text-basics-50 focus:outline-none  ${
                tab == TabType.edit
                  ? 'border-b-4 border-primary-900 dark:border-primary-900'
                  : 'border-b-4 border-secondary-500 dark:border-secondary-500'
              }`}
              onClick={() => selectTab(TabType.edit)}
            >
              EDIT
            </button>
            <button
              className={`block px-4 2xl:px-12 font-medium  hover:text-primary-900 text-basics-50 dark:text-basics-50 focus:outline-none  ${
                tab == TabType.media
                  ? 'border-b-4 border-primary-900 dark:border-primary-900'
                  : 'border-b-4 border-secondary-500 dark:border-secondary-500'
              }`}
              onClick={() => selectTab(TabType.media)}
            >
              MEDIA
            </button>
            <button
              className={`block px-4 2xl:px-12 font-medium  hover:text-primary-900 text-basics-50 dark:text-basics-50 focus:outline-none ${
                tab == TabType.preview
                  ? 'border-b-4 border-primary-900 dark:border-primary-900'
                  : 'border-b-4 border-secondary-500 dark:border-secondary-500'
              }`}
              onClick={() => selectTab(TabType.preview)}
            >
              MDX PREVIEW
            </button>
            <button
              className={`block px-4 2xl:px-12 font-medium  hover:text-primary-900 text-basics-50 dark:text-basics-50 focus:outline-none ${
                tab == TabType.sections
                  ? 'border-b-4 border-primary-900 dark:border-primary-900'
                  : 'border-b-4 border-secondary-500 dark:border-secondary-500'
              } ${history.type == PostType.course ? 'block' : 'hidden'}`}
              onClick={() => selectTab(TabType.sections)}
            >
              SECTIONS
            </button>
            <button
              className={`block px-4 2xl:px-12 font-medium  hover:text-primary-900 text-basics-50 dark:text-basics-50 focus:outline-none ${
                tab == TabType.settings
                  ? 'border-b-4 border-primary-900 dark:border-primary-900'
                  : 'border-b-4 border-secondary-500 dark:border-secondary-500'
              } ${history.type == PostType.course ? 'block' : 'hidden'}`}
              onClick={() => selectTab(TabType.settings)}
            >
              SETTINGS
            </button>
            <button
              className={`block px-4 2xl:px-12 font-medium  hover:text-primary-900 text-basics-50 dark:text-basics-50 focus:outline-none ${
                tab == TabType.groups
                  ? 'border-b-4 border-primary-900 dark:border-primary-900'
                  : 'border-b-4 border-secondary-500 dark:border-secondary-500'
              } ${history.type == PostType.course ? 'block' : 'hidden'}`}
              onClick={() => selectTab(TabType.groups)}
            >
              GROUPS
            </button>
            <button
              className={`block px-4 2xl:px-12 font-medium  hover:text-primary-900 text-basics-50 dark:text-basics-50 focus:outline-none ${
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
                <EditPostSidebar
                  updateContent$={updateContent$}
                  tab={tab}
                  setTab={setTab}
                  history={history}
                  setHistory={setHistory}
                  setSlugUnique={setSlugUnique}
                  setSaving={setSaving}
                  postHistories={postHistories}
                />
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
