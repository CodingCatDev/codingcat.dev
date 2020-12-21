import React, { useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import Link from 'next/link';

import { useUser } from '@/utils/auth/useUser';
import { postsByUpdatedAtObservable } from '@/services/api';
import { Post, PostStatus } from '@/models/post.model';

import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import 'primereact/resources/themes/saga-purple/theme.css';

function EditPosts({ path }: { path: string }) {
  const { user, signout }: { user: any; signout: any } = useUser();
  const [posts, setPosts] = useState<Post[]>([]);
  useEffect(() => {
    postsByUpdatedAtObservable(
      path.substring(1) === 'blog' ? 'post' : path.substring(1, path.length - 1)
    ).subscribe((posts) => setPosts(posts));
  }, [path]);

  function postId(rowData: Post) {
    return (
      <Link href={`.${path}/${rowData.id}`}>
        <a className="underline text-purple-500">{rowData.id}</a>
      </Link>
    );
  }
  function postCategories(rowData: Post) {
    return <span>{rowData.category ? rowData.category.join(',') : ''}</span>;
  }
  function postStatus(rowData: Post) {
    return (
      <span
        className={`p-2 capitalize text-green-800 rounded
          ${
            rowData.status
              ? rowData.status === PostStatus.published
                ? `bg-green-200`
                : `bg-red`
              : ''
          }
          `}
      >
        {rowData.status}
      </span>
    );
  }

  return (
    <>
      <DataTable value={posts} scrollable scrollHeight="100%">
        <Column field="id" header="Id" body={postId}></Column>
        <Column field="title" header="Title"></Column>
        <Column field="createdBy" header="Author"></Column>
        <Column
          field="post_categories"
          header="Category"
          body={postCategories}
        ></Column>
        <Column field="status" header="Status" body={postStatus}></Column>
        <Column field="updatedAt" header="Updated"></Column>
      </DataTable>
    </>
  );
}

export default EditPosts;
