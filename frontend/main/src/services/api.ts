import { StripeSubscription } from '@/models/stripe.model';
import { UserInfoExtended } from '@/models/user.model';
import {
  StripeProduct,
  StripePrice,
  StripeLineItem,
} from '@/models/stripe.model';
import { httpsCallable } from 'rxfire/functions';
import firebase from 'firebase/app';
import initFirebase from '@/utils/initFirebase';
import { collectionData, docData } from 'rxfire/firestore';
import { filter, map, switchMap } from 'rxjs/operators';
import { from, Observable } from 'rxjs';

import { loadStripe } from '@stripe/stripe-js';
import { config } from '@/config/stripe';
import {
  Post,
  PostType,
  PostStatus,
  PostVisibility,
  CoverMedia,
  Section,
} from '@/models/post.model';
import { v4 as uuid } from 'uuid';
import { Cloudinary } from '@/models/cloudinary.model';
import { Video } from '@/models/video.model';
import { Media, MediaSource, MediaType } from '@/models/media.model';
import { PageLink, Site, SocialLink } from '@/models/site.model';

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

/* SITE */
export const siteDataObservable = () => {
  return firestore$.pipe(
    switchMap((firestore) =>
      collectionData<Site>(firestore.collection('site')).pipe(
        map((s) => (s.length > 0 ? s[0] : null)) // Making assumption that we only want one site data
      )
    )
  );
};

/* User */
export const userProfileDataObservable = (uid: string) => {
  return firestore$.pipe(
    switchMap((firestore) =>
      docData<firebase.UserInfo>(firestore.doc(`/profiles/${uid}`), uid)
    )
  );
};

export const userProfileUpdate = (profile: UserInfoExtended) => {
  return firestore$.pipe(
    switchMap((firestore) =>
      firestore.doc(`/profiles/${profile.uid}`).set(profile, { merge: true })
    )
  );
};

export const usersDataObservable = (limit: number) => {
  if (limit && limit > 0) {
    return firestore$.pipe(
      switchMap((firestore) =>
        collectionData(
          firestore.collection('/users').limit(limit).orderBy('email', 'asc')
        )
      )
    );
  } else {
    return firestore$.pipe(
      switchMap((firestore) =>
        collectionData(firestore.collection('/users').orderBy('email', 'asc'))
      )
    );
  }
};

export const isUserTeam = (uid: string): Observable<boolean> => {
  return firestore$.pipe(
    switchMap(async (firestore) => {
      const userRef = await firestore.doc(`users/${uid}`).get();

      const userData = userRef.data() as { uid: string; roles: string[] };
      if (
        userData &&
        userData.roles &&
        userData.roles.some(
          (r) => ['admin', 'editor', 'author'].indexOf(r) >= 0
        )
      ) {
        return true;
      } else {
        return false;
      }
    })
  );
};

export const isUserMember = (uid: string): Observable<boolean> => {
  return firestore$.pipe(
    switchMap((firestore) =>
      collectionData<StripeSubscription>(
        firestore
          .collection(`customers/${uid}/subscriptions/`)
          .where('status', '==', 'active')
          .where('role', 'in', ['monthly', 'yearly'])
      ).pipe(map((s) => (s.length === 0 ? false : true)))
    )
  );
};

export const userDataObservable = (uid: string) => {
  return firestore$.pipe(
    switchMap((firestore) =>
      docData<UserInfoExtended>(firestore.doc(`/users/${uid}`), uid)
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

/* Cloudinary */
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

/* Stripe */
export const stripeCheckout = (product: StripeProduct, uid: string) => {
  const line_items: StripeLineItem[] = [];

  product.prices.forEach((price: StripePrice) =>
    line_items.push({
      price: price.id,
      quantity: 1,
    })
  );

  return firestore$.pipe(
    switchMap(async (firestore) => {
      const docRef = await firestore
        .collection('customers')
        .doc(uid)
        .collection('checkout_sessions')
        .add({
          line_items,
          success_url: window.location.origin,
          cancel_url: window.location.href,
        });
      docRef.onSnapshot(async (snap) => {
        const { error, sessionId } = snap.data() as string | any;
        if (error) {
          // Show an error to your customer and
          // inspect your Cloud Function logs in the Firebase console.
          alert(`An error occured: ${error.message}`);
        }
        if (sessionId) {
          // We have a session, let's redirect to Checkout
          // Init Stripe
          if (config.apiKey) {
            const stripe = await loadStripe(config.apiKey);
            if (stripe) stripe.redirectToCheckout({ sessionId });
          } else {
            console.error('Missing Stripe API Key');
          }
        }
      });
    })
  );
};

export const getStripePortal = () => {
  return functions$.pipe(
    switchMap((functions) =>
      httpsCallable<
        unknown,
        {
          id: string;
          object: string;
          created: number;
          customer: string;
          livemode: boolean;
          return_url: string;
          url: string;
        }
      >(
        functions,
        'ext-firestore-stripe-subscriptions-createPortalLink'
      ).call('params', { returnUrl: window.location.href })
    )
  );
};

/**************
 *
 * ADMIN SECTION
 ********************/

/* SITE */

export const siteUpdate = (site: Site) => {
  return firestore$.pipe(
    switchMap((firestore) =>
      firestore.doc(`site/${site.id}`).set(site, { merge: true })
    )
  );
};

export const addSitePageLink = (site: Site, pageLink: PageLink) => {
  return firestore$.pipe(
    switchMap((firestore) => {
      const ref = firestore.doc(`site/${site.id}`);
      ref.update({
        pageLinks: firebase.firestore.FieldValue.arrayUnion(pageLink),
      });
      return docData<Site>(ref);
    })
  );
};

export const addSiteSocialLink = (site: Site, socialLink: SocialLink) => {
  return firestore$.pipe(
    switchMap((firestore) => {
      const ref = firestore.doc(`site/${site.id}`);
      ref.update({
        socialLinks: firebase.firestore.FieldValue.arrayUnion(socialLink),
      });
      return docData<Site>(ref);
    })
  );
};

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
    slug: slug ? slug : id,
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

export const postsSlugUnique = (slug: string, postId: string) => {
  return firestore$.pipe(
    switchMap((firestore) =>
      collectionData<Post>(
        firestore
          .collection('posts')
          .where('slug', '==', slug)
          .where('id', '!=', postId)
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
          titleSearch: history.title ? history.title.toLowerCase() : '',
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
        createdAt: firebase.firestore.Timestamp.now(),
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

export const historyMediaDataObservable = (history: Post) => {
  return firestore$.pipe(
    switchMap((firestore) =>
      collectionData<Media>(
        firestore
          .collection(`posts/${history.postId}/history/${history.id}/media/`)
          .orderBy('createdAt', 'desc')
      )
    )
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

/* Course 
   Course is a type of post, but it also has sections, with lessons
*/
export const addCourseSection = (history: Post, section: Section) => {
  return firestore$.pipe(
    switchMap((firestore) => {
      const historyRef = firestore.doc(
        `posts/${history.postId}/history/${history.id}`
      );
      historyRef.update({
        sections: firebase.firestore.FieldValue.arrayUnion(section),
      });
      return docData<Post>(historyRef);
    })
  );
};
