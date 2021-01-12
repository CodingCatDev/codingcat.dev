import { useRouter } from 'next/router';

import {
  postBySlugService,
  postsRecentService,
  postsService,
} from '@/services/serversideApi';

import { Post as PostModel, PostType } from '@/models/post.model';
import renderToString from 'next-mdx-remote/render-to-string';
import { Source } from 'next-mdx-remote/hydrate';
import PostLayout from '@/components/PostLayout';

export default function Post({
  post,
  source,
  recentPosts,
}: {
  post: PostModel;
  recentPosts: { [key: string]: PostModel[] };
  source: Source | null;
}): JSX.Element {
  const router = useRouter();
  if (router.isFallback) {
    return <h2>Loading ...</h2>;
  }

  return (
    <PostLayout
      router={router}
      post={post}
      source={source}
      recentPosts={recentPosts}
    />
  );
}

export async function getStaticPaths(): Promise<{
  paths: { params: { type: PostType; slug: string } }[];
  fallback: boolean;
}> {
  const paths: { params: { type: PostType; slug: string } }[] = [];
  [PostType.post, PostType.tutorial, PostType.podcast].forEach(
    async (postType) => {
      const docData = await postsService(postType);
      for (const doc of docData) {
        paths.push({
          params: {
            type: doc.type,
            slug: doc.slug,
          },
        });
      }
    }
  );
  return {
    paths,
    fallback: true,
  };
}

export async function getStaticProps({
  params,
}: {
  params: { permalink: string[] };
}): Promise<
  | {
      props: {
        post: PostModel | null;
        recentPosts: { [key: string]: PostModel[] };
        source: Source | null;
      };
      revalidate: number;
    }
  | { redirect: { destination: string; permanent: boolean } }
> {
  if (params.permalink.length !== 2) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }

  const type = params.permalink[0] as PostType;
  const slug = params.permalink[1] as string;

  const allowedTypes = [PostType.post, PostType.podcast, PostType.tutorial];
  if (!type || !slug || !allowedTypes.includes(type)) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }

  const posts = await postBySlugService(type, slug);
  const post = posts.length > 0 ? posts[0] : null;
  const recentPosts = await postsRecentService([
    PostType.course,
    PostType.post,
    PostType.tutorial,
    PostType.podcast,
  ]);

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
      recentPosts,
      source,
    },
    revalidate: 60,
  };
}
