import { UserInfoExtended } from '@/models/user.model';

import useIsMember from '@/hooks/useIsMember';
import { useAuth } from 'reactfire';
import { Post } from '@/models/post.model';
import { AccessMode } from '@/models/access.model';

export default function MemberValidShow({
  user,
  children,
  sectionLesson,
  notValidComponent,
}: {
  user: UserInfoExtended;
  children: JSX.Element;
  sectionLesson?: Post;
  notValidComponent: JSX.Element;
}): JSX.Element {
  const auth = useAuth();
  const { member, team } = useIsMember(user);

  if (!sectionLesson || sectionLesson?.access_mode === AccessMode.free) {
    return <section>{children}</section>;
  } else if (
    sectionLesson?.access_mode === AccessMode.open &&
    auth?.currentUser?.uid
  ) {
    return <section>{children}</section>;
  } else if (
    sectionLesson?.access_mode === AccessMode.closed &&
    (member || team)
  ) {
    return <section>{children}</section>;
  }
  return <>{notValidComponent}</>;
}
