import Link from "next/link";

import Avatar from "@/components/avatar";
import CoverImage from "@/components/cover-image";
import DateComponent from "@/components/date";
import { Button } from "@/components/ui/button";

import type {
  MorePodcastQueryResult,
  MorePostQueryResult,
} from "@/sanity.types";
import { sanityFetch } from "@/sanity/lib/fetch";
import {
  morePodcastQuery,
  morePostQuery,
  moreCourseQuery,
  moreAuthorQuery,
  moreGuestQuery,
  moreSponsorQuery,
} from "@/sanity/lib/queries";
import { ContentType } from "@/lib/types";
import { pluralize } from "@/lib/utils";

export default async function MoreContent(params: {
  type: string;
  skip?: string;
  limit?: number;
  offset?: number;
  showHeader?: boolean;
}) {
  const whichQuery = () => {
    switch (params.type) {
      case ContentType.author:
        return moreAuthorQuery;
      case ContentType.course:
        return moreCourseQuery;
      case ContentType.guest:
        return moreGuestQuery;
      case ContentType.podcast:
        return morePodcastQuery;
      case ContentType.sponsor:
        return moreSponsorQuery;
      default:
        return morePostQuery;
    }
  };

  const data = await sanityFetch<MorePodcastQueryResult>({
    query: whichQuery(),
    params: {
      type: params.type,
      skip: params.skip || "none",
      limit: params.limit || 4,
      offset: params.offset || 0,
    },
  });

  return (
    <div className="flex flex-col">
      {params?.showHeader && (
        <>
          <h2 className="mb-8 text-4xl font-bold mt-10 capitalize">
            {pluralize(params.type)}
          </h2>
          <hr className="mb-24 border-accent-2 " />
        </>
      )}
      <div className="mb-32 grid grid-cols-1 gap-y-20 md:grid-cols-2 md:gap-x-16 md:gap-y-32 lg:gap-x-32">
        {data?.map((post) => {
          const {
            _id,
            _type,
            title,
            slug,
            coverImage,
            excerpt,
            author,
            guest,
          } = post;
          return (
            <article key={_id}>
              <Link href={`/${_type}/${slug}`} className="block mb-5 group">
                {["author", "guest"].includes(_type) && coverImage ? (
                  <Avatar
                    href={`/${_type}/${slug}`}
                    coverImage={coverImage}
                    imgSize=" w-full h-full"
                    height={256}
                    width={256}
                  />
                ) : (
                  <CoverImage image={coverImage} priority={false} />
                )}
              </Link>
              <h3 className="mb-3 text-3xl leading-snug text-balance">
                <Link href={`/${_type}/${slug}`} className="hover:underline">
                  {title}
                </Link>
              </h3>
              {!["author", "guest"].includes(_type) && (
                <div className="mb-4 text-lg">
                  <DateComponent dateString={post.date} />
                </div>
              )}
              {excerpt && (
                <p className="mb-4 text-lg leading-relaxed text-pretty">
                  {excerpt}
                </p>
              )}
              {(author || guest) && (
                <div className="flex flex-wrap gap-2">
                  {author?.map((a) => (
                    <Avatar
                      key={a._id}
                      name={a.title}
                      href={`/author/${a?.slug}`}
                      coverImage={a?.coverImage}
                    />
                  ))}
                  {guest?.map((a) => (
                    <Avatar
                      key={a._id}
                      name={a.title}
                      href={`/guest/${a?.slug}`}
                      coverImage={a?.coverImage}
                    />
                  ))}
                </div>
              )}
            </article>
          );
        })}
      </div>
    </div>
  );
}
