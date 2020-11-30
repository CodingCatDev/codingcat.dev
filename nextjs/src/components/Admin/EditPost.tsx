import React, { useState, useEffect } from 'react';

import dynamic from 'next/dynamic';

import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import 'primereact/resources/themes/saga-purple/theme.css';

import { postDataObservable } from '@/services/firestore';

function EditPost({ router }) {
  const [post, setPost] = useState(null);

  // Sets initial state
  useEffect(() => {
    postDataObservable(
      router.query.type === 'blog'
        ? `/posts/${router.query.id}`
        : `/${router.query.type}/${router.query.id}`
    ).subscribe((postRef) => {
      setPost(postRef);
    });
  }, [router]);

  function handleChange(event) {
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
