import { Post } from '@/models/post.model';

export const PostHeader = ({ post }: { post?: Post }): JSX.Element => {
  return (
    <div className="items-center flex-grow hidden py-4 text-white lg:flex lg:ml-10">
      {post && (
        <>
          <div className="grid grid-flow-col gap-1 mr-8 place-items-center text-basics-50 dark:text-basics-50">
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
