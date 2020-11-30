import React, { useState, useEffect } from 'react';

import dynamic from 'next/dynamic';

import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import 'primereact/resources/themes/saga-purple/theme.css';

import { getPost } from '@/services/firestore';

function EditPost({ className, router }) {
  const [post, setPost] = useState(null);
  useEffect(() => {
    getPost(
      router.query.type === 'blog'
        ? `/posts/${router.query.id}`
        : `/${router.query.type}/${router.query.id}`
    ).then((postRef) => {
      setPost(postRef);
    });
  }, [router]);
  return (
    <div className={className}>
      <textarea
        id="about"
        name="about"
        rows={10}
        className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 mt-1 block w-full sm:text-sm border-gray-300 rounded-md resize-none"
        placeholder="Markdown goes here..."
        value={post ? post.post_content : ''}
      ></textarea>
    </div>
  );
}

export default EditPost;
