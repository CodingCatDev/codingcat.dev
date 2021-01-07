import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

import { useEffect, useState } from 'react';
import { postCreate, postsSlugUnique } from '@/services/api';
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
  slug: '',
};

export default function CreatePost({ type }: { type: PostType }) {
  const [showModal, setShowModal] = useState(false);
  const [post, setPost] = useState<Post>(postInitial);
  const [slugUnique, setSlugUnique] = useState(false);

  useEffect(() => {
    setPost({
      ...postInitial,
      type,
    });
  }, [type]);

  const create = async () => {
    postCreate(post.type, post.title, post.slug)
      .pipe(take(1))
      .subscribe((p) => {
        setShowModal(false);
        router.push(`/admin/${router.query.type}/${p.id}`);
      });
  };

  const slugInput = async (e: any, isTitle: any) => {
    const slug = toKebabCase(e.target.value);
    let postUpdate;
    if (isTitle) {
      postUpdate = {
        ...post,
        title: e.target.value,
        slug,
      };
    } else {
      postUpdate = {
        ...post,
        slug,
      };
    }
    setPost(postUpdate);
    postsSlugUnique(postUpdate.slug)
      .pipe(take(1))
      .subscribe((unique) => setSlugUnique(unique));
  };

  return (
    <>
      <Button
        variant="contained"
        color="primary"
        onClick={() => setShowModal(true)}
      >
        Create {post.type}
      </Button>
      <Dialog
        open={showModal}
        onClose={() => setShowModal(false)}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">Create {post.type}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            variant="filled"
            id="title"
            label="Title"
            type="text"
            fullWidth
            value={post.title}
            onChange={(e) => {
              slugInput(e, true);
            }}
          />
          <TextField
            margin="dense"
            id="slug"
            label="Slug"
            type="text"
            fullWidth
            variant="filled"
            value={post.slug}
            onChange={(e) => slugInput(e, false)}
          />
          <DialogContentText>
            Valid: {slugUnique ? 'Yes' : 'No'}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowModal(false)} color="secondary">
            Cancel
          </Button>
          <Button onClick={() => create()} color="primary" variant="contained">
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
