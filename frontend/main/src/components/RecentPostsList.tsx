import { CodingCatBuilderContent } from '@/models/builder.model';
import Link from 'next/link';

export default function RecentPostsList({
  posts,
  title,
}: {
  posts: CodingCatBuilderContent[];
  title: string;
}): JSX.Element {
  return (
    <>
      <div className="rounded-md bg-basics-50 dark:bg-primary-900">
        <h2 className="w-full p-2 m-0 text-2xl font-bold xl:p-4 rounded-t-md xl:flex-shrink-0 bg-secondary-600 dark:bg-secondary-600 text-basics-50 dark:text-basics-50">
          {title}
        </h2>
        <ul className="grid grid-cols-1 gap-2 p-4 shadow-lg">
          {posts?.map((post) => (
            <li key={post.id} className="ml-0 list-none">
              <Link href={post?.data?.url}>
                <a className="no-underline text-basics-900 hover:text-primary-900 hover:underline">
                  {post?.data?.page?.title}
                </a>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
