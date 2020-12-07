import Link from 'next/link';
import Image from 'next/image';
import PropTypes from 'prop-types';
function PostsCards({ posts, type }) {
  return (
    <>
      {posts.map((post) => (
        <div className="p-3 m-3 bg-white rounded shadow" key={post.basename}>
          <div>
            <Link href={post.permalink}>
              <a>
                {type === 'podcasts' ? (
                  <Image
                    src={post.thumbnail}
                    alt={post.title}
                    width="150"
                    height="150"
                    layout="responsive"
                    className="rounded"
                  />
                ) : (
                  <Image
                    src={post.thumbnail}
                    alt={post.title}
                    width="480"
                    height="270"
                    layout="responsive"
                    className="rounded"
                  />
                )}
              </a>
            </Link>
          </div>
          <div className="mt-6">
            <p className="mb-2 text-lg tracking-wide text-bold text-ccd-basics-600">
              <Link href={post.permalink}>
                <a>{post.title}</a>
              </Link>
            </p>
            <p className="text-sm font-hairline text-ccd-basics-600">
              {post.excerpt}
            </p>
          </div>
        </div>
      ))}
    </>
  );
}
PostsCards.propTypes = {
  posts: PropTypes.array.isRequired,
};

export default PostsCards;
