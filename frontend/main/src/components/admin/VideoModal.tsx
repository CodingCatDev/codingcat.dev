import { useEffect, useState } from 'react';
import { MediaSource, Post } from '@/models/post.model';

import { config } from '@/config/cloudinary';

import {
  getCloudinaryCookieToken,
  postHistoryCreate,
  postHistoryUpdate,
} from '@/services/api';
import firebase from 'firebase/app';
import { take } from 'rxjs/operators';

import { Video } from 'cloudinary-react';
import ReactPlayer from 'react-player/lazy';

export default function ImageModal({ post }: { post: Post }) {
  const [open, setOpen] = useState(false);
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

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  async function onVideoDelete(post: Post) {
    setOpen(false);
    setCookieToken('');
    if (post) {
      if (post.publishedAt) {
        postHistoryCreate(post)
          .pipe(take(1))
          .subscribe((p) =>
            postHistoryUpdate({
              ...p,
              coverVideo: firebase.firestore.FieldValue.delete() as any,
            })
              .pipe(take(1))
              .subscribe()
          );
      } else {
        postHistoryUpdate({
          ...post,
          coverVideo: firebase.firestore.FieldValue.delete() as any,
        })
          .pipe(take(1))
          .subscribe();
      }
    }
  }

  return (
    <div>
      <button className="btn-primary" onClick={handleClickOpen}>
        View Video
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z"
          />
        </svg>
      </button>
      <section className={`${open ? 'block' : 'hidden'}`}>
        <p>{post.coverVideo?.url}</p>
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
        <div>
          <button
            onClick={() => onVideoDelete(post)}
            className="btn-primary bg-secondary-500"
          >
            Delete
          </button>
        </div>
      </section>
    </div>
  );
}
