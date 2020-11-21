import { API } from "aws-amplify";
import { useRouter } from "next/router";
import config from "../../configureAmplify";
import gql from "graphql-tag";
import AWSAppSyncClient, { AUTH_TYPE } from "aws-appsync";

const getPost = gql`
  query getPost($id: ID!) {
    getPost(id: $id) {
      id
      post_title
      post_content
    }
  }
`;

const listPosts = gql`
  query listPosts {
    listPosts {
      items {
        post_title
        id
        post_content
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

export default function Post({ post }) {
  const router = useRouter();
  if (router.isFallback) {
    return <h2>Loading ...</h2>;
  }
  return (
    <div>
      <h1>Post</h1>
      <h2>{post.post_title}</h2>
      <h2>{post.post_content}</h2>
    </div>
  );
}

export async function getStaticPaths() {
  const postData: any = await client.query({
    query: listPosts,
  });
  console.log(postData);
  const paths: any = postData.data.listPosts.items.map((post) => ({
    params: { id: post.id },
  }));
  return {
    paths,
    fallback: true,
  };
}

export async function getStaticProps({ params }) {
  const { id } = params;
  const postData: any = await client.query({
    query: getPost,
    variables: { id: id },
  });
  return {
    props: {
      post: postData.data.getPost,
    },
    // Next.js will attempt to re-generate the page:
    // - When a request comes in
    // - At most once every second
    revalidate: 1, // In seconds
  };
}
