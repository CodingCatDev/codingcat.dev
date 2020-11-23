import { API } from "aws-amplify";
import { useRouter } from "next/router";
import config from "../configureAmplify";
import gql from "graphql-tag";
import AWSAppSyncClient, { AUTH_TYPE } from "aws-appsync";

import renderToString from "next-mdx-remote/render-to-string";
import hydrate from "next-mdx-remote/hydrate";

const postsByPermalink = gql`
  query postsByPermalink($post_permalink: String!) {
    postsByPermalink(post_permalink: $post_permalink) {
      items {
        post_title
        post_content
      }
    }
  }
`;

const listPosts = gql`
  query listPosts {
    listPosts {
      items {
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

export default function Post({ post, markdown }) {
  const router = useRouter();
  if (router.isFallback) {
    return <h2>Loading ...</h2>;
  }
  const content = hydrate(markdown);
  return (
    <div>
      <h1>{post.post_title}</h1>
      <h2>{content}</h2>
    </div>
  );
}

export async function getStaticPaths() {
  const postData: any = await client.query({
    query: listPosts,
  });
  const paths: any = postData.data.listPosts.items.map((post) => {
    return {
      params: { permalink: post.post_permalink.substring(1) },
    };
  });
  return {
    paths,
    fallback: true,
  };
}

export async function getStaticProps({ params }) {
  const { permalink } = params;
  const postData: any = await client.query({
    query: postsByPermalink,
    variables: { post_permalink: `/${permalink}` },
  });
  const post = postData.data.postsByPermalink.items[0];
  const markdown = await renderToString(post.post_content);
  return {
    props: {
      post,
      markdown,
    },
    // Next.js will attempt to re-generate the page:
    // - When a request comes in
    // - At most once every second
    revalidate: 1, // In seconds
  };
}
