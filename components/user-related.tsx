import type {
  AuthorQueryWithRelatedResult,
  GuestQueryResult,
} from "@/sanity.types";

import Link from "next/link";
import CoverImage from "@/components/cover-image";
import { Button } from "@/components/ui/button";
import { pluralize } from "@/lib/utils";

export default async function UserRelated(
  related: NonNullable<AuthorQueryWithRelatedResult>["related"]
) {
  if (
    !related?.course?.length &&
    !related?.podcast?.length &&
    !related?.post?.length
  ) {
    return <></>;
  }

  const contentLinks = (
    _type: string,
    contents: NonNullable<GuestQueryResult>[]
  ) => {
    return (
      <div className="grid grid-cols-1 gap-y-20 md:grid-cols-2 md:gap-x-16 md:gap-y-32 lg:gap-x-32">
        {contents?.map((post) => {
          const { _id, _type, title, slug, coverImage } = post;
          return (
            <article key={_id}>
              <Link href={`/${_type}/${slug}`} className="block mb-5 group">
                <CoverImage image={coverImage} priority={false} />
              </Link>
              <h3 className="mb-3 text-3xl leading-snug text-balance">
                <Link href={`/${_type}/${slug}`} className="hover:underline">
                  {title}
                </Link>
              </h3>
            </article>
          );
        })}
      </div>
    );
  };

  return (
    <aside>
      {Object.entries(related).map(
        (r: [string, NonNullable<GuestQueryResult>[]]) => {
          const _type = r.at(0) as string;
          const contents = r.at(1) as NonNullable<GuestQueryResult>[];
          if (!contents.length) return <span key={_type} />;
          return (
            <section key={_type} className="flex flex-col">
              <hr className="my-12 md:my-24 border-accent-2" />
              <div className="flex flex-col md:flex-row md:justify-between">
                <h2 className="mb-8 text-6xl font-bold leading-tight tracking-tighter md:text-7xl capitalize">
                  Latest {pluralize(_type)}
                </h2>
                <Button
                  asChild
                  className="mb-8 text-3xl font-bold md:text-4xl p-2 md:p-8"
                >
                  <Link href="/search">Search</Link>
                </Button>
              </div>
              {contentLinks(_type, contents)}
            </section>
          );
        }
      )}
    </aside>
  );
}
