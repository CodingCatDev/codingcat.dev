import { useEffect, useState } from 'react';
import { v4 as uuid } from 'uuid';
import {
  Post,
  PostStatus,
  PostType,
  PostVisibility,
} from '@/models/post.model';

import router from 'next/router';
import { UserInfoExtended } from '@/models/user.model';
import { doc, setDoc, Timestamp } from 'firebase/firestore';
import { useFirestore } from 'reactfire';

const postInitial = {
  type: PostType.post,
  title: '',
  titleSearch: '',
  status: PostStatus.draft,
  visibility: PostVisibility.private,
  slug: '',
};

export default function CreatePost({
  type,
  user,
}: {
  type: PostType;
  user: UserInfoExtended;
}): JSX.Element {
  const [post, setPost] = useState<Post>(postInitial);
  const firestore = useFirestore();

  useEffect(() => {
    setPost({
      ...postInitial,
      type,
    });
  }, [type]);

  const postCreate = async () => {
    const id = uuid();
    const title = `New ${type}`;
    const post: Post = {
      id,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
      // publishedAt: firebase.firestore.Timestamp.now(),
      createdBy: user.uid,
      updatedBy: user.uid,
      type,
      title,
      titleSearch: title.toLowerCase(),
      status: PostStatus.draft,
      visibility: PostVisibility.private,
      slug: id,
    };

    const docRef = doc(firestore, 'posts', id);
    await setDoc(docRef, post);
    router.push(`/admin/${type}/${id}`);
  };

  return (
    <>
      <button className="btn-primary" onClick={() => postCreate()}>
        Create {post.type}
      </button>
    </>
  );
}
