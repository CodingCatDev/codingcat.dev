import { useEffect, useState } from 'react';

import { Post } from '@/models/post.model.ts';

export default function EditPostCourseGroups({
  historyInput,
}: {
  historyInput: Post;
}): JSX.Element {
  const [history, setHistory] = useState<Post>();

  useEffect(() => {
    setHistory(historyInput);
  }, [historyInput]);

  return (
    <>
      <h1 className="font-sans text-4xl">Course Groups</h1>
    </>
  );
}
