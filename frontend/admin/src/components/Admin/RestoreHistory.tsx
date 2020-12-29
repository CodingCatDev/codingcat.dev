import OutsideClick from '@/components/OutsideClick';
import { useEffect, useState } from 'react';
import { postCreate, postHistoryCreate, postsSlugUnique } from '@/services/api';
import {
  Post,
  PostStatus,
  PostType,
  PostVisibility,
} from '@/models/post.model';

import { InputText } from 'primereact/inputtext';
import { toKebabCase } from '@/utils/basics/stringManipulation';
import { take } from 'rxjs/operators';
import router from 'next/router';

const postInitial = {
  type: PostType.post,
  title: '',
  titleSearch: '',
  status: PostStatus.draft,
  visibility: PostVisibility.private,
  permalink: '',
  slug: '',
};

export default function RestoreHistory({ postHistory }: { postHistory: Post }) {
  const [showModal, setShowModal] = useState(false);
  const [post, setPost] = useState<Post>(postInitial);

  useEffect(() => {
    setPost(postHistory);
  }, [postHistory]);

  const restore = async () => {
    postHistoryCreate(post)
      .pipe(take(1))
      .subscribe(() => {
        setShowModal(false);
      });
  };

  const restoreModal = async () => {
    setShowModal(true);
  };

  return (
    <>
      <button className="btn-primary" onClick={() => restoreModal()}>
        Restore
      </button>

      <></>
    </>
  );
}
