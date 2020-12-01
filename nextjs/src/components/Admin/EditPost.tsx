import React, { useState, useEffect } from 'react';

import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import 'primereact/resources/themes/saga-purple/theme.css';
import { TabView, TabPanel } from 'primereact/tabview';

import { postDataObservable, postUpdate } from '@/services/api';

function EditPost({ router }) {
  const [post, setPost] = useState(null);
  const [path, setPath] = useState(null);
  const [tab, setTab] = useState('edit');
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
              tab === 'edit' ? '' : 'text-gray-500 bg-gray-200'
            }`}
            onClick={() => selectTab('edit')}
          >
            Edit
          </li>
          <li
            className={`py-2 px-6 bg-white rounded-t-lg ${
              tab === 'preview' ? '' : 'text-gray-500 bg-gray-200'
            }`}
            onClick={() => selectTab('preview')}
          >
            Preview
          </li>
        </ul>
      </div>
      <textarea
        id="about"
        name="about"
        onChange={handleChange}
        className={`${
          tab === 'edit' ? 'block' : 'hidden'
        } shadow-sm focus:ring-indigo-500 focus:border-indigo-500 mt-1 block h-full w-full sm:text-sm border-gray-300 rounded-md resize-none`}
        placeholder="Markdown goes here..."
        value={post ? post.post_content : ''}
      ></textarea>
      <textarea
        id="about"
        name="about"
        onChange={handleChange}
        className={`${
          tab === 'preview' ? 'block' : 'hidden'
        } shadow-sm focus:ring-indigo-500 focus:border-indigo-500 mt-1 block h-full w-full sm:text-sm border-gray-300 rounded-md resize-none`}
        placeholder="Markdown goes here..."
        value={`preview`}
      ></textarea>
    </>
  );
}

export default EditPost;
