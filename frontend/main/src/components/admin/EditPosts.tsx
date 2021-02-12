import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { useUser } from '@/utils/auth/useUser';
import { postsByUpdatedAtObservable } from '@/services/api';
import { Post, PostStatus, PostType } from '@/models/post.model';
import { take } from 'rxjs/operators';

function EditPosts({ type }: { type: PostType }) {
  const { user, signout }: { user: any; signout: any } = useUser();

  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    postsByUpdatedAtObservable(type)
      .pipe(take(1))
      .subscribe((posts) => setPosts(posts));
  }, [type]);

  return (
    <table className="block w-full lg:table bg-basics-50" role="table">
      <tbody role="rowgroup">
        <tr
          className="hidden lg:justify-between lg:flex bg-secondary-600 dark:bg-secondary-600 text-basics-50 dark:text-basics-50"
          role="row"
        >
          <th className="p-2 text-left" role="columnheader">
            Title
          </th>
          <th className="p-2 text-left" role="columnheader">
            Id
          </th>
          <th className="p-2 text-left" role="columnheader">
            Date
          </th>
          <th className="p-2 text-left" role="columnheader">
            Author
          </th>
          <th className="p-2 text-left" role="columnheader">
            Status
          </th>
        </tr>

        {posts.map((post, index) => (
          <tr className="flex" key={post.id}>
            <tr
              className="grid flex-1 w-full lg:flex bg-secondary-600 dark:bg-secondary-600 text-basics-50 dark:text-basics-50"
              role="row"
            >
              <th className="p-2 text-left lg:hidden" role="columnheader">
                Title
              </th>
              <th className="p-2 text-left lg:hidden" role="columnheader">
                Id
              </th>
              <th className="p-2 text-left lg:hidden" role="columnheader">
                Date
              </th>
              <th className="p-2 text-left lg:hidden" role="columnheader">
                Author
              </th>
              <th className="p-2 text-left lg:hidden" role="columnheader">
                Status
              </th>{' '}
            </tr>
            <tr
              className={`grid w-full lg:grid-cols-5 ${
                index % 2 ? 'bg-primary-100' : 'bg-basics-50'
              }`}
            >
              <td className="p-2 text-left" role="cell">
                <Link href={`${type}/${post.id}`}>
                  <a>{post.title} </a>
                </Link>
              </td>
              <td className="p-2 text-left" role="cell">
                {post.id}
              </td>
              <td className="p-2 text-left" role="cell">
                {post.updatedAt}
              </td>
              <td className="p-2 text-left" role="cell">
                {post.createdBy}
              </td>
              <td className="p-2 text-left justify-self-end" role="cell">
                <span
                  className={`m-1 ${
                    post && post.status === PostStatus.draft
                      ? `px-2 py-1 rounded-full bg-basics-400 text-white dark:bg-basics-400 dark:text-white`
                      : `px-2 py-1 rounded-full bg-success-600 text-basics-50 dark:bg-success-600 dark:text-basics-50`
                  }`}
                >
                  {post.status}
                </span>
              </td>
            </tr>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default EditPosts;

// <section className="data-responsive-demo">
//   <div className="card">
//     <DataTable value={posts} className="p-datatable-responsive-demo">
//       <Column
//         className=""
//         field="title"
//         header="Title"
//         body={titleBodyTemplate}
//       />
//       <Column className="" field="id" header="ID" body={idBodyTemplate} />
//       <Column
//         className=""
//         field="date"
//         header="Date"
//         body={dateBodyTemplate}
//       />
//       <Column
//         className=""
//         field="author"
//         header="Author"
//         body={authorBodyTemplate}
//       />
//       <Column
//         className=""
//         field="status"
//         header="Status"
//         body={statusBodyTemplate}
//       />
//     </DataTable>
//   </div>

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
// const titleBodyTemplate = (rowData) => {
//   return (
//     <React.Fragment>
//       <span className="p-column-title lg:hidden">Title</span>
//       {rowData.title}
//     </React.Fragment>
//   );
// };

// const idBodyTemplate = (rowData) => {
//   return (
//     <React.Fragment>
//       <span className="p-column-title lg:hidden">ID</span>
//       {rowData.id}
//     </React.Fragment>
//   );
// };

// const dateBodyTemplate = (rowData) => {
//   return (
//     <React.Fragment>
//       <span className="p-column-title lg:hidden">Date</span>
//       {rowData.updatedAt}
//     </React.Fragment>
//   );
// };

// const authorBodyTemplate = (rowData) => {
//   return (
//     <React.Fragment>
//       <span className="p-column-title lg:hidden">Author</span>
//       {rowData.createdBy}
//     </React.Fragment>
//   );
// };

// const statusBodyTemplate = (rowData) => {
//   return (
//     <React.Fragment>
//       <span className="p-column-title lg:hidden">Status</span>
//       {rowData.status}
//     </React.Fragment>
//   );
// };
