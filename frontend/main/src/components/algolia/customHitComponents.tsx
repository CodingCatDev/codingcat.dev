import React, { Fragment } from 'react';
import { Highlight, Snippet } from 'react-instantsearch-dom';
import Link from 'next/link';
import { PostType } from '@/models/post.model';
import Courses from '@/components/global/icons/nav/Courses';
import Blog from '@/components/global/icons/nav/Blog';
import Pages from '@/components/global/icons/nav/Pages';
import Community from '@/components/global/icons/nav/Community';
import Podcasts from '@/components/global/icons/nav/Podcasts';
import Tutorials from '@/components/global/icons/nav/Tutorials';

export const BlogPostHit = (
  clickHandler: ((event: any) => void) | undefined
) => ({ hit }: any) => {
  function typeIcon(type: string) {
    switch (type) {
      case PostType.page:
        return <Pages />;
      case PostType.post:
        return <Blog />;
      case PostType.course:
        return <Courses />;
      case PostType.podcast:
        return <Podcasts />;
      case PostType.tutorial:
        return <Tutorials />;
      default:
        return <div></div>;
    }
  }

  return (
    <>
      <Link href={`/${hit.type}/${hit.slug}`}>
        <a className="grid items-center gap-2 p-2 transition-colors rounded-md grid-cols-search text-basics-900 bg-primary-50 hover:bg-primary-100 hover:text-basics-900">
          <div className="grid place-items-center">
            {typeIcon(hit.type)}
            <p className="text-xs text-center">{hit.type}</p>
          </div>
          <p>
            <Highlight
              attribute="title"
              hit={hit}
              tagName="mark"
              className="font-sans leading-tight text-current justify-self-end text-md"
            />
          </p>
          {/* <Highlight
          attribute="excerpt"
          hit={hit}
          tagName="mark"
          className="text-sm text-current"
        /> */}
        </a>
      </Link>

      <style jsx>{`
        a {
          transition-duration: 0s;
          transition: none;
        }
      `}</style>
    </>
  );
};
