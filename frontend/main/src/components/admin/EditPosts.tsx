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
    <table
      className="block w-full space-y-4 lg:space-y-0 lg:table"
      role="table"
    >
      {posts.map((post, index) => (
        <tbody role="rowgroup" key={post.id} className="flex lg:block">
          <thead
            className="grid justify-between rounded-tl-md rounded-bl-md lg:rounded-tr-md lg:rounded-bl-none lg:flex bg-secondary-600 dark:bg-secondary-600 text-basics-50 dark:text-basics-50"
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
          </thead>
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
            <td className="p-2 text-left lg:justify-self-end" role="cell">
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
        </tbody>
      ))}
      <style jsx>{`
        @media (min-width: 1024px) {
          tbody:not(:first-child) thead {
            display: none;
          }
        }
      `}</style>
    </table>
  );
}

export default EditPosts;

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
