import { WithContentValidationProps } from '@9gustin/react-notion-render/dist/hoc/withContentValidation';
import { Video } from 'cloudinary-react';
import Script from 'next/script';
import ReactPlayer from 'react-player/lazy';
import { config as cloudinaryConfig } from '@/config/cloudinary';

const Embed = ({ config }: { config: WithContentValidationProps }) => {
  const url =
    config?.block?.content?.url || config?.block?.content?.external?.url;
  if (!url) {
    return <></>;
  }
  if (url.includes('loom.com')) {
    return (
      <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0 }}>
        <iframe
          src={`https://www.loom.com/embed/${url.split('/').at(-1)}`}
          frameBorder={0}
          allowFullScreen
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
          }}
        />
      </div>
    );
  }
  if (url.includes('codepen')) {
    console.log(url);
    return (
      <>
        <iframe
          style={{
            width: '100%',
            height: '100%',
            backgroundColor: 'transparent',
          }}
          scrolling="no"
          title="Codepen"
          src={url.replace('/pen/', '/full/')}
          frameBorder="no"
          loading="lazy"
          allowFullScreen={true}
        >
          <a href={url.replace('/pen/', '/full/')}>See the Pen</a>
        </iframe>
      </>
    );
  }
  if (url.includes('https://media.codingcat.dev/video/')) {
    const cloudinaryPublicId = url?.split('/');
    return (
      <Video
        cloudName={cloudinaryConfig.name}
        publicId={
          cloudinaryPublicId
            ? `${cloudinaryPublicId.at(-2)}/${cloudinaryPublicId
                .at(-1)
                ?.replace('.mp4', '')}`
            : undefined
        }
        privateCdn={cloudinaryConfig.cname ? true : false}
        secure={cloudinaryConfig.cname ? true : false}
        secureDistribution={
          cloudinaryConfig.cname ? cloudinaryConfig.cname : ''
        }
        sourceTypes={['hls', 'webm', 'ogv', 'mp4']}
        controls={true}
        fluid="true"
        style={{ height: '100%', width: '100%' }}
      />
    );
  }
  return (
    <ReactPlayer
      className="react-player"
      url={url}
      controls={true}
      light={true}
      height="0"
      width="100%"
      style={{
        overflow: 'hidden',
        paddingTop: '56.25%',
        position: 'relative',
      }}
    />
  );
};
export default Embed;
