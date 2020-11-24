import { API } from "aws-amplify";
import { useRouter } from "next/router";
import config from "../configureAmplify";
import gql from "graphql-tag";
import AWSAppSyncClient, { AUTH_TYPE } from "aws-appsync";

import renderToString from "next-mdx-remote/render-to-string";
import hydrate from "next-mdx-remote/hydrate";

import RecentPostsList from "../components/RecentPostsList";

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

const postsByPostTypePublished = gql`
  query postsByPostTypePublished {
    postsByPostTypePublished(sortDirection: DESC, post_type: "post") {
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

export default function Post({ post, markdown }) {
  const router = useRouter();
  if (router.isFallback) {
    return <h2>Loading ...</h2>;
  }
  const content = hydrate(markdown);
  return (
    <div className="grid grid-cols-12 gap-2">
      <div className="col-span-12 xl:col-span-10">
        <h1>{post.post_title}</h1>
        <article>{content}</article>
      </div>
      <div className="col-span-12 xl:col-span-2">
        <div className="bg-white shadow p-3 m-3 rounded-lg">
          <p className="text-xl text-bold tracking-wide text-gray-800 mb-2">
            Recent Posts
          </p>
          <RecentPostsList />
        </div>
      </div>
    </div>
  );
}

export async function getStaticPaths() {
  const postData: any = await client.query({
    query: postsByPostTypePublished,
  });
  const paths: any = postData.data.postsByPostTypePublished.items.map(
    (post) => {
      return {
        params: { permalink: post.post_permalink.substring(1) },
      };
    }
  );
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
