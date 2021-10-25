import { useEffect, useState } from 'react';
import { Post } from '@/models/post.model';
import { MediaSource } from '@/models/media.model';
import { config } from '@/config/cloudinary';

import { take } from 'rxjs/operators';

import { Video } from 'cloudinary-react';
import ReactPlayer from 'react-player/lazy';
import Image from 'next/image';
import { httpsCallable } from 'firebase/functions';
import { useFunctions } from 'reactfire';

export default function PostMedia({
  post,
  noImage,
}: {
  post: Post;
  noImage?: boolean;
}): JSX.Element {
  const functions = useFunctions();
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

  const isYouTube = (): boolean => {
    if (post && post.coverVideo && post.coverVideo.url) {
      return post.coverVideo?.url.includes('youtu.be') ||
        post.coverVideo?.url.includes('youtube')
        ? true
        : false;
    } else {
      return false;
    }
  };

  return (
    <>
      {post.coverVideo ? (
        <div>
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
                <>
                  {post.coverPhoto?.path ? (
                    <Image
                      src={post.coverPhoto?.path}
                      alt={post.title}
                      width="480"
                      height="270"
                      layout="responsive"
                    />
                  ) : (
                    <div className="grid border-2 border-secondary-600 dark:border-secondary-600 place-items-center min-h-300 xl:h-610">
                      Getting Cookie for Private View
                    </div>
                  )}
                </>
              )}
            </>
          ) : (
            <>
              {isYouTube() ? (
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
                  url={post.coverVideo?.url}
                  controls={true}
                  height="100%"
                  width="100%"
                />
              )}
            </>
          )}
        </div>
      ) : (
        <>
          {!noImage && post.coverPhoto?.path ? (
            <Image
              src={post.coverPhoto?.path}
              alt={post.title}
              width="480"
              height="270"
              layout="responsive"
            />
          ) : (
            <></>
          )}
        </>
      )}
    </>
  );
}
