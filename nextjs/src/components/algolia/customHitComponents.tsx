import React, { Fragment } from 'react';
import { Highlight, Snippet } from 'react-instantsearch-dom';
import Link from 'next/link';
import { PostType } from '@/models/post.model';
import Courses from '@/components/global/icons/nav/Courses';
import Blog from '@/components/global/icons/nav/Blog';
import Community from '@/components/global/icons/nav/Community';
import Podcasts from '@/components/global/icons/nav/Podcasts';
import Tutorials from '@/components/global/icons/nav/Tutorials';

export const BlogPostHit = (
  clickHandler: ((event: any) => void) | undefined
) => ({ hit }: any) => {
  function typeIcon(type: string) {
    switch (type) {
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
    <Link href={hit.permalink}>
      <a>
        <div className="rounded hover:bg-purple-900 hover:text-white focus:bg-purple-900 focus:text-white">
          <div className="grid grid-cols-12 gap-2">
            <span className="grid grid-cols-2 col-span-3">
              <div className="col-span-1">{typeIcon(hit.type)}</div>
              <div className="hidden col-span-1 sm:block ">
                <p className="p-1 text-xs text-center text-white rounded-lg bg-red-700">
                  {hit.type}
                </p>
              </div>
            </span>
            <div className="col-span-9">
              <p>
                <Highlight
                  attribute="title"
                  hit={hit}
                  tagName="mark"
                  className="font-sans font-semibold leading-tight text-current text-md"
                />
              </p>
              <Highlight
                attribute="excerpt"
                hit={hit}
                tagName="mark"
                className="text-sm text-current"
              />
            </div>
          </div>
        </div>
      </a>
    </Link>
  );
};
