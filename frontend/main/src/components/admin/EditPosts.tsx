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
      TODO: EditPosts
      <div className="flex flex-col">
        {posts.map((post) => (
          <div key={post.id}>
            <Link href={`${type}/${post.id}`}>
              <a>{post.id}</a>
            </Link>
          </div>
        ))}
      </div>
      {/* <TableContainer component={Paper}>
        <Table className={classes.table} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Id</TableCell>
              <TableCell align="right">Title</TableCell>
              <TableCell align="right">Author</TableCell>
              <TableCell align="right">Status</TableCell>
              <TableCell align="right">Updated</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {posts.map((post) => (
              <TableRow key={post.id}>
                <TableCell component="td" scope="row">
                  <Link href={`.${path}/${post.id}`}>
                    <a>{post.id}</a>
                  </Link>
                </TableCell>
                <TableCell align="right">{post.title}</TableCell>
                <TableCell align="right">{post.createdBy}</TableCell>
                <TableCell align="right">
                  {' '}
                  <span
                    className={`${classes.status} ${
                      post.status === PostStatus.published
                        ? classes.statusPublished
                        : classes.statusDraft
                    }`}
                  >
                    {post.status}
                  </span>
                </TableCell>
                <TableCell align="right">{post.updatedAt}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer> */}
    </>
  );
}

export default EditPosts;
