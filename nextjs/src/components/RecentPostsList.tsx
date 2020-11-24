import { useEffect, useState } from "react";
import Head from "next/head";
import Link from "next/link";
import Image from "next/image";

import config from "../../configureAmplify";
import gql from "graphql-tag";
import AWSAppSyncClient, { AUTH_TYPE } from "aws-appsync";

const postsByPostTypePublished = gql`
  query postsByPostTypePublished {
    postsByPostTypePublished(sortDirection: DESC, limit: 3, post_type: "post") {
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

export default function RecentPosts() {
  const [posts, setPosts] = useState([]);
  useEffect(() => {
    fetchPosts();
    async function fetchPosts() {
      const postData: any = await client.query({
        query: postsByPostTypePublished,
      });
      setPosts(postData.data.postsByPostTypePublished.items);
    }
  }, []);
  return (
    <div>
      {posts.map((post) => (
        <div className="mt-6" key={post.id}>
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
