import { Post } from '@/models/post.model';

export const PostHeader = ({ post }: { post?: Post }): JSX.Element => {
  return (
    <div className="flex items-center flex-grow py-4 text-white">
      {post && (
        <>
          <div className="grid grid-flow-col gap-1 mr-8 place-items-center">
            <p className="text-xl font-bold">
              {`${post.type} ID: `.toUpperCase()}
            </p>
            <p>{post.id}</p>
          </div>
        </>
      )}
    </div>
  );
};
