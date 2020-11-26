import Link from "next/link";
import Image from "next/image";
import PropTypes from "prop-types";
function PostsCards({ posts, post_type }) {
  return (
    <>
      {posts.map((post) => (
        <div
          className="bg-white shadow p-3 m-3 rounded"
          key={post.post_basename}
        >
          <div>
            <Link href={post.post_permalink}>
              <a>
                {post_type === "podcasts" ? (
                  <Image
                    src={post.post_thumbnail}
                    alt={post.post_title}
                    width="150"
                    height="150"
                    layout="responsive"
                    className="rounded"
                  />
                ) : (
                  <Image
                    src={post.post_thumbnail}
                    alt={post.post_title}
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
            <p className="text-lg text-bold tracking-wide text-gray-600 mb-2">
              <Link href={post.post_permalink}>
                <a>{post.post_title}</a>
              </Link>
            </p>
            <p className="text-sm text-gray-600 font-hairline">
              {post.post_excerpt}
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
