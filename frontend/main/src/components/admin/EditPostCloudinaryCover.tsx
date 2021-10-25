import { Post } from '@/models/post.model';
import { MediaSource } from '@/models/media.model';

import { config } from '@/config/cloudinary';
import { Video } from 'cloudinary-react';
import ReactPlayer from 'react-player/lazy';

export default function ImageModal({ post }: { post: Post }): JSX.Element {
  return (
    <>
      <div style={{ height: '100%', width: '100%' }}>
        {post.coverVideo?.source === MediaSource.cloudinary ? (
          <>
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
