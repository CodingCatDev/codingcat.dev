import * as functions from "firebase-functions";
import { firestore } from "./../config/config";

export const onPostWrite = functions.firestore
  .document("posts/{postId}")
  .onWrite(async (snap, context) => {
    console.log("Adding basename to collection");
    const post = snap.after.data();

    if (!post) {
      console.log("post missing data");
      return;
    }
    const basenameCheck = await firestore
      .collection("postBaseNames")
      .doc(post.basename)
      .get();
    if (basenameCheck.exists) {
      console.log("Basename already found, fail!");
      return false;
    }
    return firestore
      .collection("postBasenames")
      .doc(post.basename)
      .set({ postId: context.params.postId });
  });

export const onPostDelete = functions.firestore
  .document("posts/{postId}")
  .onDelete(async (snap, context) => {
    const basenames = await firestore
      .collection("postBasenames")
      .where("postId", "==", context.params.postId)
      .get();
    return Promise.all(
      basenames.docs.map((basename) => {
        console.log("Deleting", basename.id);
        return firestore.collection("postBasenames").doc(basename.id).delete();
      })
    );
  });
