import React, { useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import Link from 'next/link';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

import { useUser } from '@/utils/auth/useUser';
import { postsByUpdatedAtObservable } from '@/services/api';
import { Post, PostStatus } from '@/models/post.model';
import { green, grey } from '@material-ui/core/colors';

const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
  status: {
    borderRadius: '0.25rem',
    padding: '0.25rem',
  },
  statusPublished: {
    color: green[900],
    backgroundColor: green[400],
  },
  statusDraft: {
    color: grey[900],
    backgroundColor: grey[500],
  },
});

function EditPosts({ path }: { path: string }) {
  const { user, signout }: { user: any; signout: any } = useUser();
  const [posts, setPosts] = useState<Post[]>([]);
  useEffect(() => {
    postsByUpdatedAtObservable(
      path.substring(1) === 'blog' ? 'post' : path.substring(1, path.length - 1)
    ).subscribe((posts) => setPosts(posts));
  }, [path]);

  const classes = useStyles();

  return (
    <>
      <TableContainer component={Paper}>
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
      </TableContainer>
    </>
  );
}

export default EditPosts;
