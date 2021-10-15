import { useEffect, useState } from 'react';
import { Post } from '@/models/post.model';
import { MediaSource } from '@/models/media.model';

import { config } from '@/config/cloudinary';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { Video } from 'cloudinary-react';
import ReactPlayer from 'react-player/lazy';

export default function ImageModal({ post }: { post: Post }): JSX.Element {
  const functions = getFunctions();
  const [cookieToken, setCookieToken] = useState('');

  useEffect(() => {
    setCookieToken('');
    return () => {
      setCookieToken('');
    };
  }, []);

  useEffect(() => {
    getCloudinaryCookieToken();
  }, [post]);

  const getCloudinaryCookieToken = async () => {
    const ct = await (
      await httpsCallable<unknown, string>(
        functions,
        'cloudinarysignature'
      ).call('params', {})
    ).data;
    //TODO : There is probably a better way to set cookies.
    const now = new Date();
    let time = now.getTime();
    time += 3600 * 1000;
    now.setTime(time);
    const match = config?.cname
      ? config?.cname.match(/([a-z0-9-]*?)\.[a-z]{2,}$/)
      : null;
    const baseDomain = match && match?.length > 0 ? match[0] : '';

    document.cookie = `${ct}; domain=.${baseDomain}; expires=${now.toUTCString()}; path=/; SameSite=None; Secure`;
    setCookieToken(ct);
  };

  // async function onVideoDelete(post: Post) {
  //   setOpen(false);
  //   setCookieToken('');
  //   if (post) {
  //     if (post.publishedAt) {
  //       postHistoryCreate(post)
  //         .pipe(take(1))
  //         .subscribe((p) =>
  //           postHistoryUpdate({
  //             ...p,
  //             coverVideo: firebase.firestore.FieldValue.delete() as any,
  //           })
  //             .pipe(take(1))
  //             .subscribe()
  //         );
  //     } else {
  //       postHistoryUpdate({
  //         ...post,
  //         coverVideo: firebase.firestore.FieldValue.delete() as any,
  //       })
  //         .pipe(take(1))
  //         .subscribe();
  //     }
  //   }
  // }

  return (
    <>
      <div style={{ height: '100%', width: '100%' }}>
        {post.coverVideo?.source === MediaSource.cloudinary ? (
          <>
            {cookieToken !== '' ? (
              <Video
                cloudName={config.name}
                publicId={post.coverVideo?.public_id}
                privateCdn={config.cname ? true : false}
                secure={config.cname ? true : false}
                secureDistribution={config.cname ? config.cname : ''}
                sourceTypes={['hls', 'webm', 'ogv', 'mp4']}
                controls={true}
                fluid="true"
                style={{ height: '100%', width: '100%' }}
              />
            ) : (
              <div>Getting Cookie for Private View</div>
            )}
          </>
        ) : (
          <>
            {post?.coverVideo?.url?.includes('youtu.be') ||
            post?.coverVideo?.url?.includes('youtube') ? (
              <ReactPlayer
                className="react-player"
                url={post.coverVideo?.url}
                controls={true}
                height="0"
                width="100%"
                style={{
                  overflow: 'hidden',
                  paddingTop: '56.25%',
                  position: 'relative',
                }}
              />
            ) : (
              <ReactPlayer
                className="react-player"
                url={post.coverVideo?.url}
                controls={true}
                height="100%"
                width="100%"
              />
            )}
          </>
        )}
      </div>
    </>
  );
}
