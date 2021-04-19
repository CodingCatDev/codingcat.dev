import * as functions from 'firebase-functions';
import { firestore } from './../config/config';
import * as admin from 'firebase-admin';
import slugify from 'slugify';

export const scheduledTagsUpdate = functions.pubsub
  .schedule('every 1 hours')
  .onRun(async () => {
    await updateTags();
  });

export const onPostWriteTags = functions.firestore
  .document('posts/{postId}')
  .onUpdate((change) => {
    // Retrieve the current and previous value
    const data = change.after.data();

    // If there are no tags just return
    if (!data.tags || data.tags.length === 0) {
      return null;
    }

    return updateTags();
  });

export async function updateTags(): Promise<void> {
  const postDocs = await firestore
    .collection('posts')
    .where('tag', '!=', [])
    .orderBy('tag', 'asc')
    .get();

  const tags = new Map();
  postDocs.forEach((postDoc) => {
    const post = postDoc.data();
    if (post.tag) {
      post.tag.forEach((tag: string) => {
        if (tags.has(tag)) {
          tags.set(tag, [...tags.get(tag), post.id]);
        } else {
          tags.set(tag, [post.id]);
        }
      });
    }
  });
  for (const [tag, posts] of tags.entries()) {
    console.log('Tag: ', tag);
    console.log(JSON.stringify(posts));

    // Update all tags
    const slug = slugify(tag, { lower: true });
    await firestore.collection('tags').doc(slug).set(
      {
        posts,
        count: posts.length,
        tag: tag,
        slug: slug,
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      },
      { merge: true }
    );
  }
}
