import React, { useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import Link from 'next/link';

import { useUser } from '@/utils/auth/useUser';
import { postsByUpdatedAtObservable } from '@/services/api';
import { Post, PostStatus, PostType } from '@/models/post.model';

function EditPosts({ type }: { type: PostType }) {
  const { user, signout }: { user: any; signout: any } = useUser();
  const [posts, setPosts] = useState<Post[]>([]);
  useEffect(() => {
    postsByUpdatedAtObservable(type).subscribe((posts) => setPosts(posts));
  }, [type]);

  return (
    <>
      <table className="table-auto">
        <thead className="text-white bg-secondary-500 bold">
          <tr>
            <th className="p-2">Title</th>
            <th>Id</th>
            <th>Date</th>
            <th>Author</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {posts.map((post, index) => (
            <tr
              key={post.id}
              className={`${index % 2 ? 'bg-primary-200' : ''}`}
            >
              <td>
                <Link href={`${type}/${post.id}`}>
                  <a>{post.title}</a>
                </Link>
              </td>
              <td>{post.id}</td>
              <td>{post.updatedAt}</td>
              <td>{post.createdBy}</td>
              <td>
                <span
                  className={`m-1 ${
                    post && post.status === PostStatus.draft
                      ? `p-1 rounded-sm bg-primary-300 text-white`
                      : `p-1 rounded-sm bg-secondary-400 text-secondary-900`
                  }`}
                >
                  {post.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}

export default EditPosts;
