import React, { useState, useEffect } from 'react';
import router from 'next/router';
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
import { Post } from '@/models/post.model';

export default function EditPost({ router }: { router: any }) {
  const [post, setPost] = useState<Post | null>(null);
  const [path, setPath] = useState<string>('');
  const [tab, setTab] = useState<string>('edit');
  const [preview, setPreview] = useState<string>('');
  const [saving, setSaving] = useState<boolean>(false);

  // Sets initial state
  useEffect(() => {
    const path = `/posts/${router.query.id}`;
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

  function handleChange(event: { target: { value: string } }) {
    setPost({ ...post, content: event.target.value } as Post);
  }
  function selectTab(tab: string) {
    setTab(tab);
  }
  function save() {
    if (post && post.content) {
      setSaving(true);
      postUpdate(path, post.content).then(() => setSaving(false));
    }
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
          <li className="flex-grow"></li>
          <li>
            {saving ? (
              <div>Saving...</div>
            ) : (
              <button
                className="p-2 text-white rounded bg-ccd-greens-600"
                onClick={() => save()}
              >
                Save
              </button>
            )}
          </li>
        </ul>
      </div>
      {tab === 'edit' ? (
        <textarea
          id="content"
          name="content"
          onChange={handleChange}
          className={`form-textarea shadow-sm focus:ring-indigo-500 focus:border-indigo-500 border-0 block h-full w-full sm:text-sm rounded-md rounded-t-none resize-none`}
          placeholder="Markdown goes here..."
          value={post ? post.content : ''}
        ></textarea>
      ) : (
        <div
          className={`block h-full w-full sm:text-sm rounded-md rounded-t-none overflow-y-auto bg-ccd-basics-100`}
        >
          <article className="prose prose-ccd-purples lg:prose-xl">
            <Markdown>{post && post.content ? post.content : ''}</Markdown>
          </article>
        </div>
      )}
    </>
  );
}
