import useIsMember from '@/hooks/useIsMember';
import { Post } from '@/models/post.model';
import { UserInfoExtended } from '@/models/user.model';
import { config } from '@/config/sanity';
export default function CourseBuyButton({
  post,
  user,
}: {
  post: Post;
  user: UserInfoExtended;
}): JSX.Element {
  const { member, team } = useIsMember(user);

  function adminLink() {
    const getUrl = () => {
      let u;
      if (process.env.NODE_ENV === 'development') {
        u = 'http://localhost:3333';
      } else {
        u =
          config.dataset === 'main'
            ? 'https://admin.codingcat.dev'
            : `https://admin-${config.dataset}.codingcat.dev`;
      }
      return u;
    };
    return (
      <>
        <a
          href={`${getUrl()}/desk/${post._type};${post._id}`}
          target="_blank"
          rel="noreferrer"
          role="link"
          className="no-underline btn-primary"
        >
          Admin
        </a>
      </>
    );
  }

  return <>{team && <div className="flex-shrink-0">{adminLink()}</div>}</>;
}
