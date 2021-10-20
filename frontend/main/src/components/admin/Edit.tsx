import { PostType } from '@/models/post.model';
import EditPost from '@/components/admin/EditPost';
import { useSigninCheck } from 'reactfire';

export default function Edit({
  type,
  id,
}: {
  type: PostType | null;
  id: string | null;
}): JSX.Element {
  const { status, data: signInCheckResult } = useSigninCheck();

  return (
    <>
      {signInCheckResult?.signedIn === true && signInCheckResult?.user ? (
        <>
          {type && id ? (
            <EditPost type={type} id={id} user={signInCheckResult.user} />
          ) : (
            <div>Post Not Found.</div>
          )}
        </>
      ) : (
        <>Gathering Post Details...</>
      )}
    </>
  );
}
