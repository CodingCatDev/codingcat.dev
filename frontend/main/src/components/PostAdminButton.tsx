import useIsMember from '@/hooks/useIsMember';
import { Post } from '@/models/post.model';
import { UserInfoExtended } from '@/models/user.model';
import { useEffect, useState } from 'react';
export default function PostAdminButton({
  post,
  user,
  secret,
}: {
  post: Post;
  user: UserInfoExtended;
  secret: string | null;
}): JSX.Element {
  const { member, team } = useIsMember(user);
  const [location, setLocation] = useState<Location | undefined>(undefined);
  useEffect(() => {
    setLocation(window?.location);
  }, []);
  function adminLink() {
    return (
      <div className="flex gap-2">
        <a
          href={`${location?.origin}/api/revalidate?secret=${secret}&path=${location?.pathname}`}
          target="_blank"
          rel="noreferrer"
          role="link"
          className="no-underline btn-primary"
        >
          Revalidate
        </a>
        <a
          href={`https://www.notion.so/codingcatdev/${post._id?.replaceAll(
            '-',
            ''
          )}`}
          target="_blank"
          rel="noreferrer"
          role="link"
          className="no-underline btn-primary"
        >
          Notion
        </a>
      </div>
    );
  }

  return <>{team && <div className="flex-shrink-0">{adminLink()}</div>}</>;
}
