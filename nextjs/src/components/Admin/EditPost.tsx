import React, { useState, useEffect } from 'react';

import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import 'primereact/resources/themes/saga-purple/theme.css';
import { TabView, TabPanel } from 'primereact/tabview';

import { postDataObservable, postUpdate } from '@/services/api';

function EditPost({ router }) {
  const [post, setPost] = useState(null);
  const [path, setPath] = useState(null);
  // Sets initial state
  useEffect(() => {
    const path =
      router.query.type === 'blog'
        ? `/posts/${router.query.id}`
        : `/${router.query.type}/${router.query.id}`;
    setPath(path);
    postDataObservable(path).subscribe((post) => {
      setPost(post);
      console.log(post);
    });
  }, [router]);

  function handleChange(event) {
    postUpdate(path, event.target.value);
    setPost(event.target.value);
  }
  return (
    <textarea
      id="about"
      name="about"
      onChange={handleChange}
      className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 mt-1 block h-full w-full sm:text-sm border-gray-300 rounded-md resize-none"
      placeholder="Markdown goes here..."
      value={post ? post.post_content : ''}
    ></textarea>
  );
}

export default EditPost;
