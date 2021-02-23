import { useEffect, useState } from 'react';
import { postCreate } from '@/services/api';
import {
  Post,
  PostStatus,
  PostType,
  PostVisibility,
} from '@/models/post.model';

import { take } from 'rxjs/operators';
import router from 'next/router';

const postInitial = {
  type: PostType.post,
  title: '',
  titleSearch: '',
  status: PostStatus.draft,
  visibility: PostVisibility.private,
  slug: '',
};

export default function CreatePost({ type }: { type: PostType }) {
  const [post, setPost] = useState<Post>(postInitial);

  useEffect(() => {
    setPost({
      ...postInitial,
      type,
    });
  }, [type]);

  const create = async () => {
    postCreate(type, `New ${type}`, '')
      .pipe(take(1))
      .subscribe((p) => {
        router.push(`/admin/${type}/${p.id}`);
      });
  };

  return (
    <>
      <button className="btn-primary" onClick={() => create()}>
        Create {post.type}
      </button>
    </>
  );
}
