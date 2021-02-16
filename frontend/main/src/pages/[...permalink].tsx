import { useRouter } from 'next/router';

import {
  getSite,
  postBySlugService,
  postsRecentService,
  postsService,
} from '@/services/serversideApi';

import { Post as PostModel, PostType } from '@/models/post.model';
import matter from 'gray-matter';
import renderToString from 'next-mdx-remote/render-to-string';
import { Source } from 'next-mdx-remote/hydrate';
import PostLayout from '@/components/PostLayout';
import { Site } from '@/models/site.model';

export default function Post({
  site,
  post,
  source,
  recentPosts,
}: {
  site: Site | null;
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
      site={site}
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
  [PostType.post, PostType.tutorial, PostType.podcast, PostType.page].forEach(
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
        site: Site | null;
        post: PostModel | null;
        recentPosts: { [key: string]: PostModel[] };
        source: Source | null;
      };
      revalidate: number;
    }
  | { redirect: { destination: string; permanent: boolean } }
> {
  const site = await getSite();

  let type = params.permalink[0] as PostType;
  let slug = params.permalink[1] as string;

  // Make assumption that this should be a base page.
  if (type && !slug) {
    slug = type;
    type = PostType.page;
  }

  const allowedTypes = [
    PostType.post,
    PostType.podcast,
    PostType.tutorial,
    PostType.page,
  ];
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

  let source: Source | null;

  if (post && post.content) {
    const { content } = matter(post.content);
    source = await renderToString(content, {
      mdxOptions: {
        // remarkPlugins: [parse, mdx],
      },
    });
  } else {
    source = null;
  }

  return {
    props: {
      site,
      post,
      recentPosts,
      source,
    },
    revalidate: 60,
  };
}
