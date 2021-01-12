import { useRouter } from 'next/router';
import { postBySlugService, postsService } from '@/services/serversideApi';

import { Post as PostModel, PostType } from '@/models/post.model';
import renderToString from 'next-mdx-remote/render-to-string';
import { Source } from 'next-mdx-remote/hydrate';
import PostLayout from '@/components/PostLayout';

export default function Post({
  post,
  source,
}: {
  post: PostModel;
  source: Source | null;
}): JSX.Element {
  const router = useRouter();
  if (router.isFallback) {
    return <h2>Loading ...</h2>;
  }

  return (
    <PostLayout router={router} post={post} course={post} source={source} />
  );
}

export async function getStaticPaths(): Promise<{
  paths: { params: { type: PostType; slug: string } }[];
  fallback: boolean;
}> {
  const paths: { params: { type: PostType; slug: string } }[] = [];
  [PostType.course].forEach(async (postType) => {
    const docData = await postsService(postType);
    for (const doc of docData) {
      paths.push({
        params: {
          type: doc.type,
          slug: doc.slug,
        },
      });
    }
  });
  return {
    paths,
    fallback: true,
  };
}

export async function getStaticProps({
  params,
}: {
  params: { coursePath: string };
}): Promise<
  | {
      props: {
        post: PostModel | null;
        source: Source | null;
      };
      revalidate: number;
    }
  | { redirect: { destination: string; permanent: boolean } }
> {
  const { coursePath } = params;

  if (!coursePath) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }

  const posts = await postBySlugService(PostType.course, coursePath);
  const post = posts.length > 0 ? posts[0] : null;

  const source: Source | null =
    post && post.content
      ? await renderToString(post.content, {
          mdxOptions: {
            // remarkPlugins: [parse, mdx],
          },
        })
      : null;

  return {
    props: {
      post,
      source,
    },
    revalidate: 60,
  };
}
