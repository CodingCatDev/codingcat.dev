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
      {/* <table className="flex flex-row flex-no-wrap w-full my-4 overflow-hidden rounded-lg shadow-lg bg-basics-50">
        <thead className="text-basics-50 dark:text-basics-50 bg-secondary-600 dark:bg-secondary-600">
          <tr className="flex flex-col mb-2 bg-teal-400 rounded-l-lg flex-no wrap sm:table-row sm:rounded-none sm:mb-0">
            <th className="p-3 text-left">Name</th>
            <th className="p-3 text-left">Email</th>
            <th className="p-3 text-left" width="110px">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="flex-1 sm:flex-none">
          <tr className="flex flex-col mb-2 flex-no wrap sm:table-row sm:mb-0">
            <td className="p-3 border border-grey-light hover:bg-gray-100">
              John Covv
            </td>
            <td className="p-3 truncate border border-grey-light hover:bg-gray-100">
              contato@johncovv.com
            </td>
            <td className="p-3 text-red-400 border cursor-pointer border-grey-light hover:bg-gray-100 hover:text-red-600 hover:font-medium">
              Delete
            </td>
          </tr>
          <tr className="flex flex-col mb-2 flex-no wrap sm:table-row sm:mb-0">
            <td className="p-3 border border-grey-light hover:bg-gray-100">
              Michael Jackson
            </td>
            <td className="p-3 truncate border border-grey-light hover:bg-gray-100">
              m_jackson@mail.com
            </td>
            <td className="p-3 text-red-400 border cursor-pointer border-grey-light hover:bg-gray-100 hover:text-red-600 hover:font-medium">
              Delete
            </td>
          </tr>
          <tr className="flex flex-col mb-2 flex-no wrap sm:table-row sm:mb-0">
            <td className="p-3 border border-grey-light hover:bg-gray-100">
              Julia
            </td>
            <td className="p-3 truncate border border-grey-light hover:bg-gray-100">
              julia@mail.com
            </td>
            <td className="p-3 text-red-400 border cursor-pointer border-grey-light hover:bg-gray-100 hover:text-red-600 hover:font-medium">
              Delete
            </td>
          </tr>
          <tr className="flex flex-col mb-2 flex-no wrap sm:table-row sm:mb-0">
            <td className="p-3 border border-grey-light hover:bg-gray-100">
              Martin Madrazo
            </td>
            <td className="p-3 truncate border border-grey-light hover:bg-gray-100">
              martin.madrazo@mail.com
            </td>
            <td className="p-3 text-red-400 border cursor-pointer border-grey-light hover:bg-gray-100 hover:text-red-600 hover:font-medium">
              Delete
            </td>
          </tr>
        </tbody>
      </table> */}
      <table className="flex flex-row flex-no-wrap w-full overflow-hidden rounded-lg shadow-lg bg-basics-50">
        {posts.map((post, index) => (
          <>
            <thead>
              <tr className="flex flex-col mb-2 rounded-l-lg flex-no wrap lg:table-row lg:rounded-none lg:mb-0 bg-secondary-600 dark:bg-secondary-600 text-basics-50 dark:text-basics-50">
                <th className="p-2 text-left">Title</th>
                <th className="p-2 text-left">Id</th>
                <th className="p-2 text-left">Date</th>
                <th className="p-2 text-left">Author</th>
                <th className="p-2 text-left">Status</th>
              </tr>
            </thead>
            <tbody className="flex-1 lg:flex-none">
              <tr
                key={post.id}
                className={`${
                  index % 2
                    ? 'bg-primary-200 flex flex-col flex-no wrap sm:table-row mb-2 sm:mb-0'
                    : ''
                }`}
              >
                <td className="p-3 border border-grey-light hover:bg-gray-100">
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
              </tr>{' '}
            </tbody>
          </>
        ))}
      </table>
      {/* <table className="table-auto">
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
      </table> */}
      <style jsx>{`
        @media (min-width: 1024px) {
          table {
            display: inline-table !important;
          }

          thead tr:not(:first-child) {
            display: none;
          }
        }

        td:not(:last-child) {
          border-bottom: 0;
        }

        th:not(:last-child) {
          border-bottom: 2px solid rgba(0, 0, 0, 0.1);
        }
      `}</style>
    </>
  );
}

export default EditPosts;
