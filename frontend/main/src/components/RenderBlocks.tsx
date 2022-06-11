import { NotionBlock, Render } from '@9gustin/react-notion-render';

export const renderBlocks = (blocks: NotionBlock[]) => {
  return <Render blocks={blocks} emptyBlocks />;
};
