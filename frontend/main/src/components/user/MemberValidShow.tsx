import { UserInfoExtended } from '@/models/user.model';

import useIsMember from '@/hooks/useIsMember';
import { useAuth } from 'reactfire';

export default function MemberValidShow({
  user,
  children,
}: {
  user: UserInfoExtended;
  children: JSX.Element;
}): JSX.Element {
  const auth = useAuth();

  const { member, team } = useIsMember(user);

  return <>{(member || team) && <section>{children}</section>}</>;
}
