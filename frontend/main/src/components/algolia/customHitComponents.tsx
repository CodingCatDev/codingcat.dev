import React from 'react';
import { Highlight } from 'react-instantsearch-dom';
import Link from 'next/link';
import { ModelType } from '@/models/builder.model';
import Courses from '@/components/global/icons/nav/Courses';
import Blog from '@/components/global/icons/nav/Blog';
import Pages from '@/components/global/icons/nav/Pages';
import Podcasts from '@/components/global/icons/nav/Podcasts';
import Tutorials from '@/components/global/icons/nav/Tutorials';

export const BlogPostHit = (
  clickHandler: ((event: any) => void) | undefined
) => {
  return function BlogPostHit({ hit }: any) {
    function typeIcon(type: string) {
      console.log(type);
      switch (type) {
        case ModelType.page:
          return <Pages />;
        case ModelType.post:
          return <Blog />;
        case ModelType.course:
          return <Courses />;
        case ModelType.podcast:
          return <Podcasts />;
        case ModelType.tutorial:
          return <Tutorials />;
        default:
          return <div></div>;
      }
    }

    return (
      <>
        <Link href={`${hit?.query[0]?.value}`}>
          <a className="grid items-center gap-2 p-2 transition-colors rounded-md grid-cols-search text-basics-900 bg-primary-50 hover:bg-primary-100 hover:text-basics-900">
            <div className="grid place-items-center">
              {typeIcon((hit?.query[0]?.value).split('/')[1])}
              <p className="text-xs text-center">{hit.type}</p>
            </div>
            <p>
              <Highlight
                attribute="data.page.title"
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
};
