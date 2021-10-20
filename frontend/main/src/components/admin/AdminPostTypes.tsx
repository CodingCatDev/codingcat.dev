import SiteData from '@/components/admin/SiteData';
import EditPosts from '@/components/admin/EditPosts';
import CreatePost from '@/components/admin/CreatePost';

import { PostType } from '@/models/post.model';
import { useSigninCheck } from 'reactfire';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

export default function AdminPostTypes({
  type,
}: {
  type: PostType | null;
}): JSX.Element {
  const { status, data: signInCheckResult } = useSigninCheck();
  const [postType, setPostType] = useState<string | null>(null);

  // This is a mess, but I need EditPosts to fully rerender
  const router = useRouter();
  useEffect(() => {
    const handleRouteChange = () => {
      setPostType(null);
    };
    const handleRouteChangeComplete = () => {
      setPostType(type);
    };
    router.events.on('routeChangeStart', handleRouteChange);
    router.events.on('routeChangeComplete', handleRouteChangeComplete);

    return () => {
      router.events.off('routeChangeStart', handleRouteChange);
      router.events.on('routeChangeComplete', handleRouteChangeComplete);
    };
  }, []);

  useEffect(() => {
    setPostType(type);
  }, [type]);

  return (
    <>
      {type && (type as string) == 'site' && (
        <div className="p-4">
          <SiteData />
        </div>
      )}
      {type && postType && (postType as string) !== 'site' && (
        <>
          {signInCheckResult?.signedIn === true && signInCheckResult?.user ? (
            <div className="p-4">
              <header className="flex justify-between mb-4 justify-items-center">
                <div className="flex flex-wrap space-x-2">
                  <h1 className="font-sans text-4xl font-bold capitalize">
                    {type}
                  </h1>
                  <CreatePost type={type} user={signInCheckResult.user} />
                </div>
              </header>
              <EditPosts type={type} />
            </div>
          ) : (
            <span>Checking Authentication...</span>
          )}
        </>
      )}
    </>
  );
}
