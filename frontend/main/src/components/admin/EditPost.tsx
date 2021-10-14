import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

// import {
//   postDataObservable,
//   postHistoriesDataObservable,
//   postHistoryCreate,
//   postHistoryUpdate,
// } from '@/services/api';

import { Post, PostType } from '@/models/post.model';
import { TabType } from '@/models/admin.model';

import { debounce, switchMap, take } from 'rxjs/operators';
import { interval, Subject } from 'rxjs';
import Link from 'next/link';
import PostHistories from '@/components/admin/PostHistories';
import EditPostEditor from '@/components/admin/EditPostEditor';
import EditPostSidebar from '@/components/admin/EditPostSidebar';
import EditPostMedia from '@/components/admin/EditPostMedia';
import EditPostCourseSections from '@/components/admin/EditPostCourseSections';
import EditPostCourseSettings from '@/components/admin/EditPostCourseSettings';
import EditPostCourseGroups from '@/components/admin/EditPostCourseGroups';
import {
  collection,
  CollectionReference,
  doc,
  getDoc,
  getFirestore,
  orderBy,
  query,
  where,
} from '@firebase/firestore';
import { getApp } from '@firebase/app';
import { useFirestoreCollectionData, useFirestoreDocData } from 'reactfire';
import { UserInfoExtended } from '@/models/user.model';

export default function EditPost({
  type,
  id,
  user,
}: {
  type: PostType;
  id: string;
  user: UserInfoExtended;
}): JSX.Element {
  const [tab, setTab] = useState<TabType>(TabType.edit);
  const [, setSaving] = useState<boolean>(false);
  const [updateContent$] = useState<Subject<Post>>(new Subject<Post>());
  const [slugUnique, setSlugUnique] = useState(true);
  const router = useRouter();
  const app = getApp();
  const firestore = getFirestore(app);

  const postRef = doc(firestore, 'posts', id);
  const { data: post } = useFirestoreDocData(postRef);

  const [history, setHistory] = useState<Post | undefined>(undefined);
  const historiesRef = collection(
    firestore,
    'posts',
    id,
    'history'
  ) as CollectionReference<Post>;
  const historiesQuery = query<Post>(
    historiesRef,
    orderBy('updatedAt', 'desc')
  );
  const { data: postHistories } =
    useFirestoreCollectionData<Post>(historiesQuery);

  useEffect(() => {
    if (postHistories && postHistories.length > 0) {
      setHistory(postHistories[0]);
    }
  }, [postHistories]);

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
    if (!history) {
      return <p>This tab is not defined yet.</p>;
    }
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
        return <EditPostMedia history={history} user={user} />;
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

  const tabStyles = `block px-4 2xl:px-12 font-medium text-basics-50 dark:text-basics-50 hover:bg-secondary-500 dark:hover:bg-secondary-500 hover:border-b-2 hover:border-primary-50 dark:hover:border-primary-50 focus:outline-none whitespace-nowrap`;

  return (
    <>
      {history && Object.keys(history).length > 0 ? (
        <div className="grid w-full h-full max-w-8xl grid-rows-auto-2">
          <nav className="flex justify-between w-full h-12 overflow-x-auto bg-secondary-600 dark:bg-secondary-600">
            <button
              className={`${tabStyles} ${
                tab == TabType.edit
                  ? 'border-b-4 border-primary-900 dark:border-primary-900'
                  : 'border-b-4 border-secondary-500 dark:border-secondary-500'
              }`}
              onClick={() => selectTab(TabType.edit)}
            >
              EDIT
            </button>
            <button
              className={`${tabStyles}  ${
                tab == TabType.media
                  ? 'border-b-4 border-primary-900 dark:border-primary-900'
                  : 'border-b-4 border-secondary-500 dark:border-secondary-500'
              }`}
              onClick={() => selectTab(TabType.media)}
            >
              MEDIA
            </button>
            <button
              className={`${tabStyles} ${
                tab == TabType.sections
                  ? 'border-b-4 border-primary-900 dark:border-primary-900'
                  : 'border-b-4 border-secondary-500 dark:border-secondary-500'
              } ${history.type == PostType.course ? 'block' : 'hidden'}`}
              onClick={() => selectTab(TabType.sections)}
            >
              SECTIONS
            </button>
            <button
              className={`${tabStyles} ${
                tab == TabType.settings
                  ? 'border-b-4 border-primary-900 dark:border-primary-900'
                  : 'border-b-4 border-secondary-500 dark:border-secondary-500'
              } ${history.type == PostType.course ? 'block' : 'hidden'}`}
              onClick={() => selectTab(TabType.settings)}
            >
              SETTINGS
            </button>
            <button
              className={`${tabStyles} ${
                tab == TabType.groups
                  ? 'border-b-4 border-primary-900 dark:border-primary-900'
                  : 'border-b-4 border-secondary-500 dark:border-secondary-500'
              } ${history.type == PostType.course ? 'block' : 'hidden'}`}
              onClick={() => selectTab(TabType.groups)}
            >
              GROUPS
            </button>
            <button
              className={`${tabStyles} ${
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
              <section className="grid grid-cols-1 gap-4 justify-items-stretch 2xl:grid-cols-sidebar">
                {onTab()}
                <EditPostSidebar
                  user={user}
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
          {post && postHistories ? (
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
