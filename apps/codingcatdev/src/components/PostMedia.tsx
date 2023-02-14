import { Post } from '@/models/post.model';
import { MediaSource } from '@/models/media.model';
import { config } from '@/config/cloudinary';

import { Video } from 'cloudinary-react';
import ReactPlayer from 'react-player/lazy';
import Image from 'next/image';
import { SetStateAction } from 'react';

export default function PostMedia({
  post,
  noImage,
  playing,
  setPlaying,
  videoProgress,
  setVideoProgress,
}: {
  post: Post;
  noImage?: boolean;
  playing?: boolean;
  setPlaying?: (value: SetStateAction<boolean>) => void;
  videoProgress?: number;
  setVideoProgress?: (value: SetStateAction<number>) => void;
}): JSX.Element {
  const isCloudinary = (): boolean => {
    if (post && post?.coverVideo && post?.coverVideo?.url) {
      return post.coverVideo?.url.includes('media.codingcat.dev/video') ||
        post.coverVideo?.url.includes('res.cloudinary.com/video')
        ? true
        : false;
    } else {
      return false;
    }
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

  const onReady = (player: ReactPlayer) => {
    if (videoProgress && setPlaying) {
      console.log('vid seek to', videoProgress);
      player.seekTo(videoProgress, 'fraction');
      setPlaying(true);
    }
  };
  const onProgress = (progress?: { played: number }) => {
    progress && setVideoProgress && setVideoProgress(progress.played);
  };
  const cloudinaryPublicId = isCloudinary()
    ? post?.coverVideo?.url?.split('/')
    : null;
  return (
    <>
      {post?.coverVideo && Object.keys(post.coverVideo).length ? (
        <div>
          {isCloudinary() ? (
            <>
              <Video
                cloudName={config.name}
                publicId={
                  cloudinaryPublicId
                    ? `${cloudinaryPublicId.at(-2)}/${cloudinaryPublicId
                        .at(-1)
                        ?.replace('.mp4', '')}`
                    : undefined
                }
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
              {isYouTube() ? (
                <ReactPlayer
                  className="react-player"
                  url={post.coverVideo?.url}
                  controls={true}
                  light={post?.coverPhoto?.secure_url || false}
                  height="0"
                  width="100%"
                  style={{
                    overflow: 'hidden',
                    paddingTop: '56.25%',
                    position: 'relative',
                  }}
                  playing={playing}
                  onProgress={onProgress}
                  onReady={onReady}
                />
              ) : (
                <ReactPlayer
                  url={post.coverVideo?.url}
                  light={post?.coverPhoto?.secure_url}
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
          {!noImage && post.coverPhoto?.public_id ? (
            <Image
              src={post.coverPhoto?.public_id}
              alt={post.title}
              width="480"
              height="270"
              layout="responsive"
              priority
            />
          ) : !noImage &&
            (post?.cover?.external?.url || post?.cover?.file?.url) ? (
            <Image
              loader={({ src }) => src}
              src={post?.cover?.external?.url || post?.cover?.file?.url || ''}
              alt={post.title}
              width="480"
              height="270"
              layout="responsive"
              priority
            />
          ) : (
            <></>
          )}
        </>
      )}
    </>
  );
}
