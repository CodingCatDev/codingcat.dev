import {
  NotionBlock,
  Render,
  withContentValidation,
} from '@9gustin/react-notion-render';
import CodeHighlight from '@/components/notion-custom-blocks/CodeHighlight';
import Image from 'next/image';

const myMapper = {
  // image: withContentValidation(({ className, media }) => {
  //   return media ? (
  //     // <div className="flex flex-col" style={{ maxWidth: 'calc(100vw - 40px)' }}>
  //     //   <div className="relative flex-1 block mb-2 overflow-hidden aspect-video ">
  //     <Image
  //       loader={({ src }) => src}
  //       className={className || ''}
  //       src={media.src}
  //       alt={media?.alt || media?.name || ''}
  //       layout="fill"
  //       height="100%"
  //       width="100%"
  //     />
  //   ) : (
  //     <></>
  //   );
  // }),
  code: withContentValidation(
    ({ plainText, className }: { plainText: string; className: string }) =>
      CodeHighlight({ plainText, className })
  ),
};

export const renderBlocks = (blocks: NotionBlock[]) => {
  return (
    <Render blocks={blocks} emptyBlocks blockComponentsMapper={myMapper} />
  );
};
