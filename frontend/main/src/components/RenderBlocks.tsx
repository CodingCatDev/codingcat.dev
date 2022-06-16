import {
  NotionBlock,
  Render,
  withContentValidation,
} from '@9gustin/react-notion-render';
import CodeHighlight from '@/components/CodeHighlight';

const myMapper = {
  //  image: withContentValidation(({ media }) => <NextImg src={media.src} width="100" height="100" />),
  code: withContentValidation(({ plainText, className }) =>
    CodeHighlight({ plainText, className })
  ),
};

export const renderBlocks = (blocks: NotionBlock[]) => {
  return (
    <Render blocks={blocks} emptyBlocks blockComponentsMapper={myMapper} />
  );
};
