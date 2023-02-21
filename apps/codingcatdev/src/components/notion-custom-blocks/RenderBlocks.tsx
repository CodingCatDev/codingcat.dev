import {
  NotionBlock,
  Render,
  withContentValidation,
} from '@9gustin/react-notion-render';
import CodeHighlight from '@/components/notion-custom-blocks/CodeHighlight';
import Image from 'next/image';
import { getCloudinaryPublicId } from '@/utils/cloudinary/cloudinary';
import Embed from '@/components/notion-custom-blocks/Embed';

const myMapper = {
  image: withContentValidation(({ className, media }) => {
    console.log(media);
    return media ? (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          flexShrink: '0',
          boxSizing: 'border-box',
          marginTop: '20px',
          width: 'auto',
          height: 'auto',
          minHeight: '20px',
          maxWidth: 'calc(100vw - 40px)',
          minWidth: '20px',
          overflow: 'hidden',
        }}
      >
        {media?.src &&
        [
          'main-codingcatdev-photo',
          'ccd-cloudinary',
          'dev-codingcatdev-photo',
        ].includes(media?.src) ? (
          <Image
            className={`${className || ''} object-contain `}
            src={getCloudinaryPublicId(media?.src)}
            alt={media?.alt || media?.name || ''}
            height="100%"
            width="100%"
            fill
            sizes="100vw"
          />
        ) : (
          <Image
            loader={({ src }) => src}
            className={`${className || ''} object-contain `}
            src={media.src}
            alt={media?.alt || media?.name || ''}
            height="100%"
            width="100%"
            fill
            sizes="100vw"
          />
        )}
        <div
          style={{
            width: '100%',
            paddingTop: '70%',
            pointerEvents: 'none',
            fontSize: '0px',
          }}
        ></div>
      </div>
    ) : (
      <></>
    );
  }),
  code: withContentValidation((props) => CodeHighlight(props)),
  embed: withContentValidation((props) => Embed(props)),
  video: withContentValidation((props) => Embed(props)),
};

export const renderBlocks = (blocks: NotionBlock[]) => {
  return (
    <Render blocks={blocks} emptyBlocks blockComponentsMapper={myMapper} />
  );
};
