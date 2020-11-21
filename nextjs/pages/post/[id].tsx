import { API } from "aws-amplify";
import { useRouter } from "next/router";
import "../../configureAmplify";
import gql from "graphql-tag";

const getPost = `
  query getPost($id: ID!) {
    getPost(id: $id) {
      id post_title post_content
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
  const postData: any = await API.graphql({
    query: listPosts,
  });
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
  const postData: any = await API.graphql({
    query: getPost,
    variables: { id: id },
  });
  return {
    props: {
      post: postData.data.getPost,
    },
  };
}
