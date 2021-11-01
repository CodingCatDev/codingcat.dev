import useIsMember from '@/hooks/useIsMember';
import { Post } from '@/models/post.model';
import { UserInfoExtended } from '@/models/user.model';

export default function CourseBuyButton({
  post,
  user,
}: {
  post: Post;
  user: UserInfoExtended;
}): JSX.Element {
  const { member, team } = useIsMember(user);

  function adminLink() {
    return (
      <>
        <a
          href={`/admin/${post._type}/${post.postId}`}
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
