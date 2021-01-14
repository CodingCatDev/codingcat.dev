import admin from 'firebase-admin';
import { assertFails, assertSucceeds } from '@firebase/rules-unit-testing';
import { setup, teardown } from './helpers';
import firebase from 'firebase/app';
import { posts } from './data/firebase/postsCreator';

const mockPosts = {};
posts().forEach((post) => {
  //Fields must be converted to correct Timestamp
  mockPosts[`posts/${post.id}`] = {
    ...post,
    createdAt: admin.firestore.Timestamp.fromDate(
      new Date(post.createdAt as any)
    ),
    updatedAt: admin.firestore.Timestamp.fromDate(
      new Date(post.updatedAt as any)
    ),
    publishedAt: admin.firestore.Timestamp.fromDate(
      new Date(post.publishedAt as any)
    ),
    createdBy: 'Alex',
    updatedBy: 'Alex',
  };
});

const mockData = {
  '/users/AdminUser': {
    roles: ['admin'],
  },
  '/users/AuthorUser': {
    roles: ['author'],
  },
  ...mockPosts,
};

const firstKey = Object.keys(mockPosts)[0];

console.log(firstKey);

afterAll(async () => {
  // If you comment this it will leave the test data.
  await teardown();
});

describe('Firestore rules', () => {
  describe('Firestore Author rules', () => {
    let db: firebase.firestore.Firestore;

    // Applies only to tests in this describe block
    beforeAll(async () => {
      db = await setup(
        {
          uid: 'AuthorUser',
        },
        mockData
      );
    });

    test('create post fails without all default data', async () => {
      const key = Object.keys(mockPosts)[0];
      const post = mockPosts[key];
      const ref = db.collection('posts');
      expect(
        await assertFails(
          //Fields must be converted to correct Timestamp
          ref.add({
            ...post,
            createdAt: firebase.firestore.Timestamp.fromDate(
              new Date(post.createdAt.toDate())
            ),
            updatedAt: firebase.firestore.Timestamp.fromDate(
              new Date(post.updatedAt.toDate())
            ),
            publishedAt: firebase.firestore.Timestamp.fromDate(
              post.publishedAt.toDate()
            ),
          })
        )
      );
    });
    test('create post succeeds with all default data', async () => {
      const key = Object.keys(mockPosts)[0];
      const post = mockPosts[key];
      const ref = db.collection(`posts`);

      //Fields must be converted to correct Timestamp
      const updatedPost = {
        ...post,
        createdAt: firebase.firestore.Timestamp.fromDate(
          new Date(post.createdAt.toDate())
        ),
        updatedAt: firebase.firestore.Timestamp.fromDate(
          new Date(post.updatedAt.toDate())
        ),
        publishedAt: firebase.firestore.Timestamp.fromDate(
          post.publishedAt.toDate()
        ),
        createdBy: 'AuthorUser',
        updatedBy: 'AuthorUser',
      };
      expect(await assertSucceeds(ref.add(updatedPost)));
    });
  });

  describe('Firestore admin rules', () => {
    let db: firebase.firestore.Firestore;

    // Applies only to tests in this describe block
    beforeAll(async () => {
      db = await setup(
        {
          uid: 'AdminUser',
        },
        mockData
      );
    });

    test('deny when reading an unauthorized collection', async () => {
      const ref = db.collection('secret-stuff');
      expect(await assertFails(ref.get()));
    });

    test('allow admin to read unpublished posts', async () => {
      const ref = db.doc(firstKey);
      expect(await assertSucceeds(ref.get()));
    });

    test('allow admin to update with valid post data', async () => {
      const ref = db.doc(firstKey);
      expect(
        await assertSucceeds(
          ref.update({ updatedAt: 'xyx', updatedBy: 'Alex' })
        )
      );
    });
    test('deny admin to update with invalid post data', async () => {
      const ref = db.doc(firstKey);
      console.log(posts);
      expect(await assertFails(ref.update({ createdBy: 'Some Other Person' })));
    });
  });
});
