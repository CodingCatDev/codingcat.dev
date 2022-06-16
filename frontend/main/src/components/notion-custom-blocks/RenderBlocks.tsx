import {
  NotionBlock,
  Render,
  withContentValidation,
} from '@9gustin/react-notion-render';
import CodeHighlight from '@/components/notion-custom-blocks/CodeHighlight';
import Image from 'next/image';

const myMapper = {
  image: withContentValidation(({ className, media }) => {
    return media ? (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          flexShrink: '0',
          boxSizing: 'border-box',
          marginTop: '20px',
          width: '100%',
          height: '100%',
          minHeight: '20px',
          minWidth: '20px',
          overflow: 'hidden',
        }}
      >
        <Image
          loader={({ src }) => src}
          className={className || ''}
          src={media.src}
          alt={media?.alt || media?.name || ''}
          layout="fill"
          height="100%"
          width="100%"
        />
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
};

export const renderBlocks = (blocks: NotionBlock[]) => {
  return (
    <Render blocks={blocks} emptyBlocks blockComponentsMapper={myMapper} />
  );
};
