import Head from "next/head";
import gql from "graphql-tag";
import AWSAppSyncClient, { AUTH_TYPE } from "aws-appsync";
import config from "../../configureAmplify";

import RecentPostsCards from "../components/RecentPostsCards";

export default function Home({ recentPosts }) {
  return (
    <div>
      <Head>
        <title>Create Next App</title>
      </Head>

      <main className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-2 place-items-auto">
        <RecentPostsCards recentPosts={recentPosts} />
      </main>

      <footer></footer>
    </div>
  );
}

export async function getStaticProps({ params }) {
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

  const postsByPostTypePublished = gql`
    query postsByPostTypePublished($post_type: String!) {
      postsByPostTypePublished(
        sortDirection: DESC
        limit: 3
        post_type: $post_type
      ) {
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
  const recentPosts = { post: [], tutorials: [], podcasts: [] };
  await Promise.all(
    Object.keys(recentPosts).map(async (post_type) => {
      const postData: any = await client.query({
        query: postsByPostTypePublished,
        variables: { post_type },
      });
      recentPosts[post_type] = postData.data.postsByPostTypePublished.items;
    })
  );

  return {
    props: {
      recentPosts,
    },
    // Next.js will attempt to re-generate the page:
    // - When a request comes in
    // - At most once every second
    revalidate: 1, // In seconds
  };
}
