import { Post } from '@/models/post.model';
import { MediaSource } from '@/models/media.model';
import { config } from '@/config/cloudinary';

import { Video } from 'cloudinary-react';
import ReactPlayer from 'react-player/lazy';
import Image from 'next/image';
import { useRef, useState } from 'react';

export default function PostMedia({
  post,
  noImage,
}: {
  post: Post;
  noImage?: boolean;
}): JSX.Element {
  const vidRef = useRef<ReactPlayer>(null);
  const [playing, setPlaying] = useState(true);
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

  // const onProgress = (progress: {
  //   played: number;
  //   playedSeconds: number;
  //   loaded: number;
  //   loadedSeconds: number;
  // }) => {
  //   console.log(progress);
  // };

  const onReady = (progress?: any) => {
    console.log('onReady', progress);
  };
  const onStart = (progress?: any) => {
    console.log('onStart', progress);
    const vid = vidRef.current;
    if (!vid) {
      return;
    }
    vid.seekTo(0.25, 'fraction');
  };
  const onProgress = (progress?: any) => {
    console.log('onProgress', progress);
  };
  const onDuration = (progress?: any) => {
    console.log('onDuration', progress);
  };
  const onPause = (progress?: any) => {
    console.log('onPause', progress);
  };
  const onBuffer = (progress?: any) => {
    console.log('onBuffer', progress);
  };
  const onBufferEnd = (progress?: any) => {
    console.log('onBufferEnd', progress);
  };
  const onSeek = (progress?: any) => {
    console.log('onSeek', progress);
  };
  const onPlaybackRateChange = (progress?: any) => {
    console.log('onPlaybackRateChange', progress);
  };
  const onEnded = (progress?: any) => {
    console.log('onEnded', progress);
  };
  const onError = (progress?: any) => {
    console.log('onError', progress);
  };
  const onClickPreview = (progress?: any) => {
    console.log('onClickPreview', progress);
  };

  return (
    <>
      {post?.coverVideo && Object.keys(post.coverVideo).length ? (
        <div>
          {post.coverVideo?.source === MediaSource.cloudinary ? (
            <>
              <Video
                cloudName={config.name}
                publicId={post.coverVideo?.public_id}
                privateCdn={config.cname ? true : false}
                secure={config.cname ? true : false}
                secureDistribution={config.cname ? config.cname : ''}
                sourceTypes={['hls', 'webm', 'ogv', 'mp4']}
                poster={`https://${config.cname}/image/upload/${post.coverPhoto?.public_id}`}
                controls={true}
                fluid="true"
                style={{ height: '100%', width: '100%' }}
              />
            </>
          ) : (
            <>
              {isYouTube() ? (
                <ReactPlayer
                  ref={vidRef}
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
                  onReady={onReady}
                  onStart={onStart}
                  onProgress={onProgress}
                  onDuration={onDuration}
                  onPause={onPause}
                  onBuffer={onBuffer}
                  onBufferEnd={onBufferEnd}
                  onSeek={onSeek}
                  onPlaybackRateChange={onPlaybackRateChange}
                  onEnded={onEnded}
                  onError={onError}
                  onClickPreview={onClickPreview}
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
