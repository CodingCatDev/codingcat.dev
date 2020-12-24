import React, { Children, useEffect, useState } from 'react';
import MDX from '@mdx-js/runtime';

// import unified from 'unified';
// import parse from 'remark-parse';
// import mdx from 'remark-mdx';
// import stringify from 'remark-stringify';
// import remarkReact from 'remark-react';
import matter from 'gray-matter';

/* MDX Components */
// import {
//   Image,
//   Video,
//   Transformation,
//   CloudinaryContext,
// } from 'cloudinary-react';

const components = {};

class ErrorBoundary extends React.Component<
  any,
  { hasError: boolean; error: ReferenceError }
> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false, error: new ReferenceError() };
  }

  static getDerivedStateFromError(error: any) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <div className="grid grid-cols-1">
          <p>You have an error in your markdown.</p>
          <p className="text-red-800">{this.state.error.message}</p>
          <p className="text-xs text-gray-600">{this.state.error.stack}</p>
        </div>
      );
    }

    return this.props.children;
  }
}

export default function ShowMDX({ markdown }: { markdown: string }) {
  const [processed, setProcessed] = useState('');
  const [frontMatter, setFrontMatter] = useState({});

  useEffect(() => {
    if (markdown === '') {
      return;
    }
    const { content, data } = matter(markdown);
    setFrontMatter(data);
    // const parsed = unified()
    //   .use(parse)
    //   .use
    //   .use(stringify)
    //   .processSync(content)
    //   .toString();
    const parsed = content;
    setProcessed(parsed);
  }, []);

  return (
    <div className="App">
      <ErrorBoundary>
        <MDX components={components} scope={frontMatter}>
          {processed}
        </MDX>
      </ErrorBoundary>
    </div>
  );
}
