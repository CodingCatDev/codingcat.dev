import { useEffect, useState } from "react";
import Link from "next/link";
import config from "../configureAmplify";
import gql from "graphql-tag";

import AWSAppSyncClient, { AUTH_TYPE } from "aws-appsync";

const listPosts = gql`
  query listPosts {
    listPosts {
      id
      title
      content
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
export default function Posts() {
  const [posts, setPosts] = useState([]);
  useEffect(() => {
    fetchPosts();
    async function fetchPosts() {
      const postData: any = await client.query({
        query: listPosts,
      });

      setPosts(postData.data.listPosts);
    }
  }, []);

  return (
    <div>
      <h1>Posts</h1>
      {posts.map((post) => (
        <Link href={`/post/${post.id}`} key={post.id}>
          <a>{post.title}</a>
        </Link>
      ))}
    </div>
  );
}
