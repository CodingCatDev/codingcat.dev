import React, { useState, useEffect } from 'react';
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
    <div>
      {posts.map((post, index) => (
        <table
          className="flex w-full mb-4 lg:mb-0 lg:grid text-basics-900"
          key={post.id}
        >
          <thead className="grid gap-4 p-2 flex-full lg:gap-0 bg-secondary-600 dark:bg-secondary-600 text-basics-50 dark:text-basics-50">
            <tr className="grid justify-between w-full h-full grid-cols-1 text-left lg:flex">
              <th>Title</th>
              <th>Id</th>
              <th>Date</th>
              <th>Author</th>
              <th>Status</th>
            </tr>
          </thead>

          <Link href={`${type}/${post.id}`}>
            <a className="grid grid-cols-1 text-basics-900 lg:flex">
              <tr
                className={`w-full grid lg:flex justify-between +
              ${index % 2 ? 'bg-primary-100' : 'bg-basics-50'}`}
              >
                <td className="p-2 border-b lg:border-r border-primary-900 lg:border-b-0">
                  {post.title}
                </td>
                <td className="p-2 border-b lg:border-r border-primary-900 lg:border-b-0">
                  {post.id}
                </td>
                <td className="p-2 border-b lg:border-r border-primary-900 lg:border-b-0">
                  {post.updatedAt}
                </td>
                <td className="p-2 border-b lg:border-r border-primary-900 lg:border-b-0">
                  {post.createdBy}
                </td>
                <td className="p-2">
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
            </a>
          </Link>
        </table>
      ))}

      <style jsx>{`
        @media (min-width: 1024px) {
          div > table:not(:first-child) thead {
            display: none;
          } 
        
      `}</style>
    </div>
  );
}

export default EditPosts;
/* <table className="table-auto">
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
      
      
      
          <>
      <table className="flex flex-row flex-no-wrap w-full overflow-hidden rounded-lg shadow-lg bg-basics-50">
        <thead className="grid lg:flex">
          <tr className="flex flex-col mb-2 rounded-l-lg flex-no wrap lg:table-row lg:rounded-none lg:mb-0 bg-secondary-600 dark:bg-secondary-600 text-basics-50 dark:text-basics-50">
            <th className="p-2 text-left">Title</th>
            <th className="p-2 text-left">Id</th>
            <th className="p-2 text-left">Date</th>
            <th className="p-2 text-left">Author</th>
            <th className="p-2 text-left">Status</th>
          </tr>
        </thead>
        <tbody className="flex-1 lg:flex-none">
          {posts.map((post, index) => (
            <>
              <thead>
                <tr className="flex flex-col mb-2 rounded-l-lg lg:hidden flex-no wrap lg:table-row lg:rounded-none lg:mb-0 bg-secondary-600 dark:bg-secondary-600 text-basics-50 dark:text-basics-50">
                  <th className="p-2 text-left">Title</th>
                  <th className="p-2 text-left">Id</th>
                  <th className="p-2 text-left">Date</th>
                  <th className="p-2 text-left">Author</th>
                  <th className="p-2 text-left">Status</th>
                </tr>
              </thead>
              <tr
                key={post.id}
                className={`${
                  index % 2
                    ? 'grid bg-primary-200 lg:flex flex-col flex-no wrap w-full mb-2 lg:mb-0'
                    : ''
                }`}
              >
                <td className="p-3">
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
            </>
          ))}
        </tbody>
      </table>
      
    </>
  );
      
      */
