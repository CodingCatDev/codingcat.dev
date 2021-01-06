import { useEffect, useState } from 'react';
import { MediaSource, Post } from '@/models/post.model';

import { config } from '@/config/cloudinary';

import { getCloudinaryCookieToken } from '@/services/api';
import firebase from 'firebase/app';
import { take } from 'rxjs/operators';

import { Video } from 'cloudinary-react';
import ReactPlayer from 'react-player/lazy';
import Image from 'next/image';

export default function PostMedia({ post }: { post: Post }) {
  const [cookieToken, setCookieToken] = useState('');

  useEffect(() => {
    setCookieToken('');
    return () => {
      setCookieToken('');
    };
  }, []);

  useEffect(() => {
    getCloudinaryCookieToken()
      .pipe(take(1))
      .subscribe((ct) => {
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
      });
  }, [post]);

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
                  className="rounded-xl"
                />
              ) : (
                <div>Getting Cookie for Private View</div>
              )}
            </>
          ) : (
            <>
              {post.coverVideo?.url.includes('youtu.be') ||
              post.coverVideo?.url.includes('youtube') ? (
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
      ) : (
        <>
          {post.coverPhoto?.path ? (
            <Image
              src={post.coverPhoto?.path}
              alt={post.title}
              width="480"
              height="270"
              layout="responsive"
              className="rounded-xl"
            />
          ) : (
            <></>
          )}
        </>
      )}
    </>
  );
}
