import { GetServerSideProps } from 'next';
import { build } from '@/utils/buildFeed';
import { PostType } from '@/models/post.model';

export const getServerSideProps: GetServerSideProps = async (context) => {
  if (context && context.res) {
    const { res } = context;

    const feed = await build({ type: PostType.post });
    res.setHeader('content-type', 'text/xml');
    res.write(feed.rss2());
    res.end();
  }

  return {
    props: {},
  };
};

// Default export to prevent next.js errors
const Named = () => null;
export default Named;
