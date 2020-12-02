import React, { useState, useEffect } from 'react';

import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import 'primereact/resources/themes/saga-purple/theme.css';
import { TabView, TabPanel } from 'primereact/tabview';

import { postDataObservable, postUpdate } from '@/services/api';

// import renderToString from 'next-mdx-remote/render-to-string';
// import hydrate from 'next-mdx-remote/hydrate';
// import parse from 'remark-parse';
// import mdx from 'remark-mdx';

import Markdown from 'markdown-to-jsx';

function EditPost({ router }) {
  const [post, setPost] = useState(null);
  const [path, setPath] = useState(null);
  const [tab, setTab] = useState('edit');
  const [preview, setPreview] = useState('');

  // Sets initial state
  useEffect(() => {
    const path =
      router.query.type === 'blog'
        ? `/posts/${router.query.id}`
        : `/${router.query.type}/${router.query.id}`;
    setPath(path);
    postDataObservable(path).subscribe((post) => {
      setPost(post);
    });
  }, [router]);

  useEffect(() => {
    if (tab === 'preview') {
    } else {
      setPreview('');
    }
  }, [tab]);

  function handleChange(event) {
    postUpdate(path, event.target.value);
    setPost(event.target.value);
  }
  function selectTab(tab) {
    setTab(tab);
  }
  return (
    <>
      <div>
        <ul className="flex cursor-pointer">
          <li
            className={`py-2 px-6 bg-white rounded-t-lg ${
              tab === 'edit' ? '' : 'text-ccd-basics-500 bg-ccd-basics-200'
            }`}
            onClick={() => selectTab('edit')}
          >
            Edit
          </li>
          <li
            className={`py-2 px-6 bg-white rounded-t-lg ${
              tab === 'preview' ? '' : 'text-ccd-basics-500 bg-ccd-basics-200'
            }`}
            onClick={() => selectTab('preview')}
          >
            Preview
          </li>
        </ul>
      </div>
      {tab === 'edit' ? (
        <textarea
          id="post_content"
          name="post_content"
          onChange={handleChange}
          className={`form-textarea shadow-sm focus:ring-indigo-500 focus:border-indigo-500 border-0 block h-full w-full sm:text-sm rounded-md rounded-t-none resize-none`}
          placeholder="Markdown goes here..."
          value={post ? post.post_content : ''}
        ></textarea>
      ) : (
        <div
          className={`block h-full w-full sm:text-sm rounded-md rounded-t-none overflow-y-auto bg-ccd-basics-100`}
        >
          <article className="prose prose-ccd-purples lg:prose-xl">
            <Markdown>{post ? post.post_content : ''}</Markdown>
          </article>
        </div>
      )}
    </>
  );
}

export default EditPost;
