import {
  PostType,
  PostStatus,
  PostVisibility,
  CoverMedia,
  MediaSource,
} from './../models/post.model';
import firebase from 'firebase/app';
import initFirebase from '@/utils/initFirebase';
import { docData, collectionData, doc } from 'rxfire/firestore';
import { httpsCallable } from 'rxfire/functions';
import { filter, map, switchMap, take } from 'rxjs/operators';
import { Post, MediaType } from '@/models/post.model';
import { v4 as uuid } from 'uuid';
import { from } from 'rxjs';
import { Course, Section } from '@/models/course.model.ts';
import { Cloudinary } from '@/models/cloudinary.model';
import { Video } from '@/models/video.model';

const firestore$ = from(initFirebase()).pipe(
  filter((app) => app !== undefined),
  map((app) => app as firebase.app.App),
  map((app) => app.firestore() as firebase.firestore.Firestore)
);

const functions$ = from(initFirebase()).pipe(
  filter((app) => app !== undefined),
  map((app) => app as firebase.app.App),
  map((app) => app.functions() as firebase.functions.Functions)
);

/* POST */
export const postDataObservable = (path: string) => {
  return firestore$.pipe(
    switchMap((firestore) => docData<Post>(firestore.doc(path)))
  );
};

export const postsDataObservable = (postType: string, limit: number) => {
  if (limit && limit > 0) {
    return firestore$.pipe(
      switchMap((firestore) =>
        collectionData(
          firestore
            .collection(postType)
            .limit(limit)
            .orderBy('publishedAt', 'desc')
        )
      )
    );
  } else {
    return firestore$.pipe(
      switchMap((firestore) =>
        collectionData(
          firestore.collection(postType).orderBy('publishedAt', 'desc')
        )
      )
    );
  }
};

export const postCreate = (type: PostType, title: string, slug: string) => {
  const id = uuid();
  const uid = firebase.auth().currentUser?.uid;
  const post: Post = {
    id,
    createdAt: firebase.firestore.Timestamp.now(),
    updatedAt: firebase.firestore.Timestamp.now(),
    // publishedAt: firebase.firestore.Timestamp.now(),
    createdBy: uid,
    updatedBy: uid,
    type,
    title,
    titleSearch: title.toLowerCase(),
    status: PostStatus.draft,
    visibility: PostVisibility.private,
    slug,
  };

  return firestore$.pipe(
    switchMap((firestore) => {
      const docRef = firebase.firestore().collection('posts').doc(id);
      docRef.set(post);
      return docData<Post>(docRef);
    })
  );
};

export const postUpdate = (id: string, content: string) => {
  return firestore$.pipe(
    switchMap((firestore) =>
      firestore.doc(id).set({ content }, { merge: true })
    )
  );
};

/* POSTS */

export const postsByUpdatedAtObservable = (postType: string, limit = 0) => {
  return firestore$.pipe(
    switchMap((firestore) => {
      let ref = firestore
        .collection('posts')
        .where('type', '==', postType)
        .orderBy('updatedAt', 'desc');

      if (limit && limit > 0) {
        ref = ref.limit(limit);
      }

      return collectionData<Post>(ref, 'id').pipe(
        map((docs) =>
          docs.map((d) => {
            return cleanTimestamp(d) as Post;
          })
        )
      );
    })
  );
};

export const postsByPublishedAtObservable = (postType: string, limit = 0) => {
  return firestore$.pipe(
    switchMap((firestore) => {
      let ref = firestore
        .collection('posts')
        .where('type', '==', postType)
        .where('publishedAt', '!=', null)
        .orderBy('publishedAt', 'desc');

      if (limit && limit > 0) {
        ref = ref.limit(limit);
      }

      return collectionData<Post>(ref, 'id').pipe(
        map((docs) =>
          docs.map((d) => {
            return cleanTimestamp(d) as Post;
          })
        )
      );
    })
  );
};

export const postsSearchByTitleObservable = (
  postType: string,
  title: string,
  limit = 20
) => {
  return firestore$.pipe(
    switchMap((firestore) => {
      let ref = firestore
        .collection('posts')
        .where('type', '==', postType)
        .orderBy('titleSearch')
        .startAt(title)
        .endAt(title + '\uf8ff');

      if (limit && limit > 0) {
        ref = ref.limit(limit);
      }

      return collectionData<Post>(ref, 'id').pipe(
        map((docs) =>
          docs.map((d) => {
            return cleanTimestamp(d) as Post;
          })
        )
      );
    })
  );
};

export const postsSlugUnique = (slug: string) => {
  return firestore$.pipe(
    switchMap((firestore) =>
      collectionData<Post>(
        firestore.collection('posts').where('slug', '==', slug)
      ).pipe(map((posts) => (posts.length > 0 ? false : true)))
    )
  );
};

/* Post History */

export const postHistoryDataObservable = (
  postId: string,
  historyId: string
) => {
  return firestore$.pipe(
    switchMap((firestore) =>
      docData<Post>(firestore.doc(`posts/${postId}/history/${historyId}`))
    )
  );
};

export const postHistoriesDataObservable = (postId: string) => {
  return firestore$.pipe(
    switchMap((firestore) =>
      collectionData<Post>(
        firestore
          .collection(`posts/${postId}/history`)
          .orderBy('updatedAt', 'desc')
      )
    )
  );
};

export const postHistoryUpdate = (history: Post) => {
  return firestore$.pipe(
    switchMap((firestore) => {
      const docRef = firestore.doc(
        `posts/${history.postId}/history/${history.id}`
      );
      docRef.set(
        {
          ...history,
          titleSearch: history.title.toLowerCase(),
          updatedAt: firebase.firestore.Timestamp.now(),
          updatedBy: firebase.auth()?.currentUser?.uid,
        },
        { merge: true }
      );
      return docData<Post>(docRef);
    })
  );
};

export const postHistoryCreate = (history: Post) => {
  return firestore$.pipe(
    switchMap((firestore) => {
      const id = uuid();

      const docRef = firestore.doc(`posts/${history.postId}/history/${id}`);
      const historyUpdate = { ...history };
      if (historyUpdate.publishedAt) {
        delete historyUpdate.publishedAt;
      }
      docRef.set({
        ...historyUpdate,
        status: PostStatus.draft,
        updatedAt: firebase.firestore.Timestamp.now(),
        updatedBy: firebase.auth()?.currentUser?.uid,
        id: id,
      });
      return docData<Post>(docRef);
    })
  );
};

export const postHistoryPublish = (history: Post) => {
  return firestore$.pipe(
    switchMap((firestore) => {
      const batch = firestore.batch();
      const historyRef = firestore.doc(
        `posts/${history.postId}/history/${history.id}`
      );
      const postRef = firestore.doc(`posts/${history.postId}`);

      const update = {
        ...history,
        updatedAt: firebase.firestore.Timestamp.now(),
        updatedBy: firebase.auth()?.currentUser?.uid,
      };
      batch.set(historyRef, update);
      batch.set(postRef, {
        ...update,
        id: history.postId,
        historyId: history.id,
      });
      return from(batch.commit()).pipe(switchMap((b) => docData(historyRef)));
    })
  );
};

export const postHistoryMediaCreate = (
  history: Post,
  type: MediaType,
  cloudinary?: Cloudinary,
  video?: Video
) => {
  const mediaId = uuid();
  let coverMedia: CoverMedia;
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

  return firestore$.pipe(
    switchMap((firestore) => {
      const batch = firestore.batch();
      const mediaRef = firestore.doc(
        `posts/${history.postId}/history/${history.id}/media/${mediaId}`
      );
      batch.set(mediaRef, {
        id: mediaId,
        type,
        cloudinary: cloudinary || null,
        video: video || null,
      });

      const historyRef = firestore.doc(
        `posts/${history.postId}/history/${history.id}`
      );
      batch.set(historyRef, {
        ...history,
        updatedAt: firebase.firestore.Timestamp.now(),
        updatedBy: firebase.auth()?.currentUser?.uid,
        [type === MediaType.photo ? 'coverPhoto' : 'coverVideo']: coverMedia,
      });
      return from(batch.commit()).pipe(
        switchMap((b) => docData<Post>(historyRef))
      );
    })
  );
};

/* Cloudinary */
export const getCloudinarySignature = (params: any) => {
  return functions$.pipe(
    switchMap((functions) =>
      httpsCallable(functions, 'cloudinarysignature').call('params', params)
    )
  );
};

export const getCloudinaryCookieToken = () => {
  return functions$.pipe(
    switchMap((functions) =>
      httpsCallable<unknown, string>(functions, 'cloudinaryCookieToken').call(
        'params',
        {}
      )
    )
  );
};

/* Course 
   Course is a type of post, but it also has sections, with lessons
*/
export const addCourseSection = (history: Course, section: Section) => {
  return firestore$.pipe(
    switchMap((firestore) => {
      const historyRef = firestore.doc(
        `posts/${history.postId}/history/${history.id}`
      );
      historyRef.update({
        sections: firebase.firestore.FieldValue.arrayUnion(section),
      });
      return docData<Course>(historyRef);
    })
  );
};

// User
export const userProfileDataObservable = (uid: string) => {
  return firestore$.pipe(
    switchMap((firestore) =>
      docData<firebase.UserInfo>(firestore.doc(`/profiles/${uid}`), uid)
    )
  );
};

/* Utilities may be used on front end */
export function cleanTimestamp(data: FirebaseFirestore.DocumentData) {
  const docData = { ...data };
  Object.keys(docData).map((key) => {
    if (
      typeof docData[key] === 'object' &&
      Object.keys(docData[key]).includes('nanoseconds')
    ) {
      const timestamp: firebase.firestore.Timestamp = docData[key];
      docData[key] = timestamp.toDate().toString();
    } else {
      docData[key] = docData[key];
    }
  });
  return docData;
}
