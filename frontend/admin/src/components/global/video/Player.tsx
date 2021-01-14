import { useCallback, useEffect, useRef, useState } from 'react';
import videojs from 'video.js';
import 'videojs-youtube';
import 'video.js/dist/video-js.css';

const Player = (props: any) => {
  const videoEl = useRef<any>();

  useEffect(() => {
    if (videoEl.current == null) return;
    const player = videojs(videoEl.current, props);
    return () => {
      player.dispose();
    };
  }, [props, videoEl]);

  return (
    <>
      <div data-vjs-player>
        <video ref={videoEl} className="video-js" playsInline />
      </div>
    </>
  );
};

export default Player;
