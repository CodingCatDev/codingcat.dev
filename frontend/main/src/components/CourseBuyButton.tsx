import Link from 'next/link';

import useIsMember from '@/hooks/useIsMember';
import { AccessMode } from '@/models/access.model';
import { Post } from '@/models/post.model';
import { UserInfoExtended } from '@/models/user.model';
import { StripeProduct } from '@/models/stripe.model';

import CourseBuy from '@/components/CourseBuy';

export default function CourseBuyButton({
  post,
  user,
  product,
}: {
  post: Post;
  user: UserInfoExtended;
  product: StripeProduct | null;
}): JSX.Element {
  const { member, team } = useIsMember(user);
  console.log(product);
  return (
    <>
      {post.accessSettings?.accessMode !== AccessMode.open ? (
        <>
          {member || team ? (
            <>
              {post.sections &&
                post.sections[0] &&
                post.sections[0].lessons &&
                post.sections[0].lessons[0] && (
                  <Link
                    href={`/course/${post.slug}/lesson/${post.sections[0].lessons[0].slug}`}
                  >
                    <a>
                      <button className="btn-primary">Start Course</button>
                    </a>
                  </Link>
                )}
            </>
          ) : (
            <>
              {product && (
                <p className="p-2 text-xl text-basics-900">
                  ${post.accessSettings?.price}
                </p>
              )}
              <div className="flex items-stretch justify-center space-x-4 flex-nowrap">
                {product && <CourseBuy product={product} user={user} />}
                <Link href="/membership">
                  <a>
                    <button className="btn-primary">Become a Member</button>
                  </a>
                </Link>
              </div>
            </>
          )}
        </>
      ) : (
        <>
          {post.sections &&
            post.sections[0] &&
            post.sections[0].lessons &&
            post.sections[0].lessons[0] && (
              <Link
                href={`/course/${post.slug}/lesson/${post.sections[0].lessons[0].slug}`}
              >
                <a>
                  <button className="btn-primary">Start Course</button>
                </a>
              </Link>
            )}
        </>
      )}
    </>
  );
}
