import Link from "next/link";

import PropTypes from "prop-types";

function RecentPostsList({ posts }) {
  return (
    <div>
      {posts.map((post) => (
        <div className="mt-6" key={post.post_basename}>
          <Link href={post.post_permalink}>
            <a>
              <p className="text-md text-bold tracking-wide text-gray-600 mb-1 p-1 hover:bg-ccd-primary-500 hover:text-white cursor-pointer rounded">
                {post.post_title}
              </p>
            </a>
          </Link>
        </div>
      ))}
    </div>
  );
}
RecentPostsList.propTypes = {
  recentPosts: PropTypes.array.isRequired,
};

export default RecentPostsList;
