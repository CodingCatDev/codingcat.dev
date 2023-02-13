import { Post } from '@/models/post.model';
import Link from 'next/link';

export const PER_PAGE = 20;

export const Pagination = ({
  pageNumber,
  posts,
  baseUrl,
  showNext,
}: {
  pageNumber: number;
  posts: Post[] | null;
  baseUrl: string;
  showNext: boolean;
}) => {
  return (
    <>
      {posts && (pageNumber > 1 || showNext) && (
        <div className="flex items-center justify-center w-full my-4 space-x-2">
          {pageNumber > 1 && (
            <Link href={`/${baseUrl}/page/${pageNumber - 1}`}>
              <a className="btn-secondary">‹ Previous</a>
            </Link>
          )}

          {showNext && (
            <Link href={`/${baseUrl}/page/${pageNumber + 1}`}>
              <a className="btn-primary">Next ›</a>
            </Link>
          )}
        </div>
      )}
    </>
  );
};
