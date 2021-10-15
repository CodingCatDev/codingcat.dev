import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

import { CoverMedia, Post, PostStatus, PostType } from '@/models/post.model';
import { TabType } from '@/models/admin.model';
import { v4 as uuid } from 'uuid';

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
  DocumentReference,
  getDoc,
  getDocs,
  getFirestore,
  orderBy,
  query,
  Timestamp,
  where,
} from '@firebase/firestore';
import { getApp } from '@firebase/app';
import { useFirestoreCollectionData, useFirestoreDocData } from 'reactfire';
import { UserInfoExtended } from '@/models/user.model';
import { toKebabCase } from '@/utils/basics/stringManipulation';
import { setDoc, writeBatch } from 'firebase/firestore';
import { Cloudinary, MediaType, MediaSource } from '@/models/media.model';
import { Video } from '@/models/video.model';

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
    // Set Tab after refresh
    const { tab: t } = router.query;
    selectTab(t ? (t as TabType) : TabType.edit);
  }, []);

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

  const postHistoryCreate = (h: Post) => {
    const id = uuid();

    const docRef = doc(
      firestore,
      `posts/${h.postId}/history/${id}`
    ) as DocumentReference<Post>;
    const historyUpdate = { ...h };
    if (historyUpdate.publishedAt) {
      delete historyUpdate.publishedAt;
    }
    return setDoc(docRef, {
      ...historyUpdate,
      status: PostStatus.draft,
      updatedAt: Timestamp.now(),
      updatedBy: user.uid,
      id: id,
      historyId: id,
    }).then(() =>
      getDoc(docRef).then((d) => {
        const n = d.data() as Post;
        //Check to see if any medias exist
        const mediasRef = collection(
          firestore,
          `posts/${h.postId}/history/${h.id}/media`
        ) as CollectionReference<Post>;
        getDocs(mediasRef).then((medias) =>
          medias.forEach((m) =>
            setDoc(
              doc(firestore, `posts/${h.postId}/history/${n.id}/media/${m.id}`),
              {
                ...m.data(),
              }
            )
          )
        );
        return n;
      })
    );
  };

  const postHistoryUpdate = (h: Post) => {
    const docRef = doc(
      firestore,
      `posts/${h.postId}/history/${h.id}`
    ) as DocumentReference<Post>;
    return setDoc(
      docRef,
      {
        ...h,
        historyId: h.id,
        titleSearch: h.title ? h.title.toLowerCase() : '',
        updatedAt: Timestamp.now(),
        updatedBy: user.uid,
      },
      { merge: true }
    ).then(() => getDoc(docRef).then((d) => d.data() as Post));
  };

  const updateContent = (h: Post) => {
    setSaving(true);
    if (h?.publishedAt) {
      return postHistoryCreate(h).then((d) => {
        setSaving(false);
        return d;
      });
    } else {
      return postHistoryUpdate(h).then((d) => {
        setSaving(false);
        return d;
      });
    }
  };

  const onPublish = async (selectedDate: Date) => {
    if (history && selectedDate) {
      const unique = await validSlug(history.slug, history.postId);
      setSlugUnique(unique);
      if (unique) {
        setSaving(true);

        history.publishedAt = Timestamp.fromDate(selectedDate);
        history.status = PostStatus.published;

        const batch = writeBatch(firestore);
        const historyRef = doc(
          firestore,
          `posts/${history.postId}/history/${history.id}`
        );
        const postRef = doc(firestore, `posts/${history.postId}`);

        const update = {
          ...history,
          updatedAt: Timestamp.now(),
          updatedBy: user.uid,
        };
        batch.set(historyRef, update);
        batch.set(postRef, {
          ...update,
          id: history.postId,
          historyId: history.id,
        });
        await batch.commit();
      }
    }
    setSaving(false);
  };

  const postHistoryMediaCreate = (
    history: Post,
    type: MediaType,
    cloudinary?: Cloudinary,
    video?: Video
  ) => {
    const mediaId = uuid();
    let coverMedia: CoverMedia = { type, source: MediaSource.cloudinary };
    if (cloudinary) {
      coverMedia = {
        thumbnail_url: cloudinary.thumbnail_url,
        path: cloudinary.path,
        mediaId,
        public_id: cloudinary.public_id,
        url: cloudinary.url,
        type,
        source: MediaSource.cloudinary,
      };
    } else if (video) {
      coverMedia = {
        mediaId,
        url: video.url,
        type,
        source: MediaSource.video,
      };
    }

    const batch = writeBatch(firestore);
    const mediaRef = doc(
      firestore,
      `posts/${history.postId}/history/${history.id}/media/${mediaId}`
    );
    batch.set(mediaRef, {
      id: mediaId,
      type,
      cloudinary: cloudinary || null,
      video: video || null,
      createdAt: Timestamp.now(),
    });

    const historyRef = doc(
      firestore,
      `posts/${history.postId}/history/${history.id}`
    );
    batch.set(historyRef, {
      ...history,
      updatedAt: Timestamp.now(),
      updatedBy: user.uid,
      [type === MediaType.photo ? 'coverPhoto' : 'coverVideo']: coverMedia,
    });
    return batch.commit();
  };

  function onTab() {
    if (!history) {
      return <p>This tab is not defined yet.</p>;
    }
    switch (tab) {
      case TabType.edit:
        return (
          <EditPostEditor
            history={history}
            slugUnique={slugUnique}
            setSlugUnique={setSlugUnique}
            updateContent={updateContent}
          />
        );
      case TabType.media:
        return (
          <EditPostMedia
            history={history}
            user={user}
            updateContent={updateContent}
            postHistoryMediaCreate={postHistoryMediaCreate}
          />
        );
      case TabType.sections:
        return (
          <EditPostCourseSections
            history={history}
            updateContent={updateContent}
          />
        );
      case TabType.settings:
        return (
          <EditPostCourseSettings
            history={history}
            updateContent={updateContent}
          />
        );
      case TabType.groups:
        return <EditPostCourseGroups historyInput={history} />;
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
                  tab={tab}
                  setTab={setTab}
                  history={history}
                  postHistories={postHistories}
                  user={user}
                  onPublish={onPublish}
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
