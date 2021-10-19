import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Post, PostStatus, PostType } from '@/models/post.model';
import { useFirestore } from 'reactfire';
import {
  collection,
  query,
  where,
  CollectionReference,
} from '@firebase/firestore';
import usePaginatedCollection from '@/hooks/usePaginatedCollection';

function EditPosts({ type }: { type: PostType }): JSX.Element {
  const firestore = useFirestore();
  const collectionRef = collection(
    firestore,
    'posts'
  ) as CollectionReference<Post>;

  const {
    status,
    data: postSnapshot,
    prevDisabled,
    nextDisabled,
    prev,
    next,
    cursor,
    update,
    limit,
    loading,
    page,
  } = usePaginatedCollection({
    query: query<Post>(collectionRef, where('type', '==', type)),
    limit: 10,
    orderBy: { field: 'updatedAt', direction: 'desc' },
  });

  // useEffect(() => {
  //   if (update) update(query<Post>(collectionRef, where('type', '==', type)));
  // }, [type]);

  const [posts, setPosts] = useState<Post[] | undefined>();

  useEffect(() => {
    setPosts(postSnapshot?.docs?.map((d) => d.data()));
  }, [postSnapshot]);

  return (
    <div className="flex flex-col">
      <section className="flex self-end pt-2 pb-1 align-middle">
        {!prevDisabled && prev && (
          <button className="btn-primary" onClick={prev}>
            Prev
          </button>
        )}
        {!nextDisabled && next && (
          <button className="btn-secondary" onClick={next}>
            Next
          </button>
        )}
      </section>
      <section
        className="block w-full space-y-4 lg:space-y-0 lg:table"
        role="table"
      >
        {status === 'loading' ? (
          <>Loading...</>
        ) : (
          <div className="flex flex-col">
            <>
              {posts?.map((post, index) => (
                <section
                  role="rowgroup"
                  key={post.id}
                  className="flex tbody lg:block"
                >
                  <ul
                    role="row"
                    className="grid justify-between text-center tr rounded-tl-md rounded-bl-md lg:rounded-tr-md lg:rounded-bl-none lg:grid-cols-6 bg-secondary-600 dark:bg-secondary-600 text-basics-50 dark:text-basics-50"
                  >
                    <li
                      className="p-2 text-left lg:justify-self-start"
                      role="columnheader"
                    >
                      Title
                    </li>
                    <li className="p-2 text-left" role="columnheader">
                      Id
                    </li>
                    <li className="p-2 text-left" role="columnheader">
                      Slug
                    </li>
                    <li className="p-2 text-left" role="columnheader">
                      Date Published
                    </li>
                    <li className="p-2 text-left" role="columnheader">
                      Author
                    </li>
                    <li
                      className="p-2 text-left lg:justify-self-center"
                      role="columnheader"
                    >
                      Status
                    </li>
                  </ul>
                  <ul
                    className={`w-full tr ${
                      index % 2
                        ? 'bg-primary-100 hover:bg-primary-200'
                        : 'bg-basics-100 hover:bg-basics-200'
                    }`}
                  >
                    <Link href={`${type}/${post.id}`}>
                      <a className="grid items-center lg:grid-cols-6 hover:text-current dark:hover:text-current">
                        <li className="p-2 text-left td" role="cell">
                          {post.title}
                        </li>
                        <li className="p-2 text-sm text-left td" role="cell">
                          {post.id}
                        </li>
                        <li className="p-2 text-left td" role="cell">
                          {post.slug}
                        </li>
                        <li className="p-2 text-left td" role="cell">
                          {post.publishedAt
                            ? post.publishedAt.toDate().toLocaleString()
                            : ''}
                        </li>
                        <li
                          className="flex flex-col p-2 text-left td"
                          role="cell"
                        >
                          {post.authors?.map((author, i) => (
                            <p key={i} className="text-sm">
                              {author.email}
                            </p>
                          ))}
                        </li>
                        <li
                          className="p-2 text-left lg:justify-self-center"
                          role="cell"
                        >
                          <span
                            className={`m-1 ${
                              post && post.status === PostStatus.draft
                                ? `px-2 py-1 rounded-full bg-basics-400 text-white dark:bg-basics-400 dark:text-white`
                                : `px-2 py-1 rounded-full bg-success-600 text-basics-50 dark:bg-success-600 dark:text-basics-50`
                            }`}
                          >
                            {post.status}
                          </span>
                        </li>
                      </a>
                    </Link>
                  </ul>
                </section>
              ))}
            </>
          </div>
        )}
        <style jsx>{`
          .td {
            word-break: break-word;
          }
          @media (min-width: 1024px) {
            .tbody:not(:first-child) .tr:first-child {
              display: none;
            }
          }
        `}</style>
      </section>
    </div>
  );
}

export default EditPosts;
