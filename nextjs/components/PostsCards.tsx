import { useEffect, useState } from "react";
import Head from "next/head";
import Link from "next/link";
import Image from "next/image";

import config from "../configureAmplify";
import gql from "graphql-tag";
import AWSAppSyncClient, { AUTH_TYPE } from "aws-appsync";

const postsByPostTypePublished = gql`
  query postsByPostTypePublished($post_type: String!) {
    postsByPostTypePublished(sortDirection: DESC, post_type: $post_type) {
      items {
        id
        post_title
        post_thumbnail
        post_publish_datetime
        post_excerpt
        post_permalink
      }
    }
  }
`;
const client = new AWSAppSyncClient({
  url: config.aws_appsync_graphqlEndpoint,
  region: config.aws_appsync_region,
  auth: {
    type: AUTH_TYPE.API_KEY,
    apiKey: config.aws_appsync_apiKey,
  },
  disableOffline: true,
  offlineConfig: {
    keyPrefix: "public",
  },
});

export default function PostsCards({ post_type }) {
  const [posts, setPosts] = useState([]);
  useEffect(() => {
    fetchPosts();
    async function fetchPosts() {
      const postData: any = await client.query({
        query: postsByPostTypePublished,
        variables: { post_type },
      });
      setPosts(postData.data.postsByPostTypePublished.items);
    }
  }, []);
  return (
    <>
      {posts.map((post) => (
        <div className="bg-white shadow p-3 m-3 rounded" key={post.id}>
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
