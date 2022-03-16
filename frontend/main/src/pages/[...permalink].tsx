import { useRouter } from 'next/router';
import { NextSeo } from 'next-seo';

import { Post, PostType } from '@/models/post.model';
import matter from 'gray-matter';
import { serialize } from 'next-mdx-remote/serialize';
import PostLayout from '@/layout/PostLayout';
import CourseLayout from '@/layout/CourseLayout';
import PodcastLayout from '@/layout/PodcastLayout';
import { Site } from '@/models/site.model';
import AJLoading from '@/components/global/icons/AJLoading';
import Layout from '@/layout/Layout';
import { MDXRemoteSerializeResult } from 'next-mdx-remote';
import DefaultErrorPage from 'next/error';
import {
  getPostById,
  getPostBySlugService,
  getPostsService,
  getRecentPostsService,
  getSite,
} from '@/services/sanity.server';
import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from 'next';
import { getStripeProduct } from '@/services/firebase.server';
import { StripeProduct } from '@/models/stripe.model';

interface StaticPropsResult {
  site: Site;
  post: Post;
  course?: Post;
  source: MDXRemoteSerializeResult<Record<string, unknown>> | null;
  preview: boolean | undefined;
  recentPosts?: {
    [key: string]: Post[];
  };
  product?: StripeProduct;
}

export const getStaticPaths: GetStaticPaths = async () => {
  const paths: { params: { permalink: string[] } }[] = [];
  for (const postType of [
    PostType.post,
    PostType.tutorial,
    PostType.podcast,
    PostType.page,
    PostType.course,
  ]) {
    const posts = await getPostsService({
      type: postType,
    });
    for (const post of posts) {
      paths.push({
        params: {
          permalink: [post._type, post.slug],
        },
      });
    }
  }
  return {
    paths,
    fallback: true,
  };
};

export const getStaticProps: GetStaticProps<StaticPropsResult> = async ({
  params,
  preview,
  previewData,
}) => {
  let type = (params?.permalink?.[0] as PostType) || '';
  let slug = (params?.permalink?.[1] as string) || '';
  let lesson = (params?.permalink?.[2] as string) || '';
  let lessonPath = (params?.permalink?.[3] as string) || '';
  // Redirect plural page types
  if (['podcasts', 'tutorials', 'courses'].includes(type) && slug) {
    let dest;
    switch (type as string) {
      case 'podcasts':
        dest = 'podcast';
        break;
      case 'tutorials':
        dest = 'tutorial';
        break;
      case 'courses':
        dest = 'course';
        break;
    }
    return {
      redirect: {
        destination: `/${dest}/${slug}`,
        permanent: true,
      },
    };
  }

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
    PostType.course,
  ];
  if (!type || !slug || !allowedTypes.includes(type)) {
    return {
      notFound: true,
    };
  }

  // Preview page
  let post;
  let course;
  const pData = previewData as any;
  if (
    preview &&
    (pData?.selectionSlug == slug || pData?.selectionSlug == lessonPath)
  ) {
    if (!pData || !pData._id) {
      return {
        notFound: true,
      };
    }

    const { _id } = pData;
    post = await getPostById({ preview, _id });
    course = await getPostBySlugService({
      preview,
      type,
      slug,
    });
  } else {
    //Not in Preview mode.
    preview = false;

    //If Lesson we need to use different slug and get course
    if (lesson === PostType.lesson && lessonPath) {
      post = await getPostBySlugService({
        preview,
        type: PostType.lesson,
        slug: lessonPath,
      });
      course = await getPostBySlugService({
        preview,
        type,
        slug,
      });
    } else {
      post = await getPostBySlugService({ preview, type, slug });
    }
  }

  // Check if old blog link is trying to be used.
  if (!post) {
    if (type === PostType.page) {
      post = await getPostBySlugService({
        preview,
        type: PostType.post,
        slug,
      });
    }
    // This means the page was found, but we want to redirect them.
    if (post) {
      return {
        redirect: {
          destination: `/${PostType.post}/${slug}`,
          permanent: true,
        },
      };
    }
  }

  if (!post) {
    return {
      notFound: true,
    };
  }

  let source: MDXRemoteSerializeResult | null;
  let allContent = '';

  if (post && post.content) {
    const { content } = matter(post.content);
    allContent = allContent + content;
  }
  if (allContent) {
    source = await serialize(allContent, {
      mdxOptions: {
        remarkPlugins: [],
        rehypePlugins: [],
      },
    });
  } else {
    source = null;
  }

  // Courses have products not recentPosts
  const props: StaticPropsResult = {
    site: await getSite({ preview }),
    post,
    source,
    preview: preview || false,
  };

  if (type === PostType.course && !lessonPath) {
    const productId = post?.accessSettings?.productId;
    if (productId) {
      const product = await getStripeProduct(productId);
      if (product) {
        props.product = product;
        console.log(`${slug} has product: `, product.id);
      }
    }
  } else {
    if (lessonPath) {
      if (course) {
        props.course = course;
      }
    } else {
      const recentPosts = await getRecentPostsService({ preview });
      if (recentPosts) {
        props.recentPosts = recentPosts;
      }
    }
  }

  return {
    props,
    revalidate: 3600,
  };
};

export default function PostPage({
  site,
  post,
  course,
  source,
  recentPosts,
  preview,
  product,
}: InferGetStaticPropsType<typeof getStaticProps>): JSX.Element {
  const router = useRouter();
  if (router.isFallback) {
    return (
      <Layout site={site}>
        <section className="max-w-md p-10 mx-auto">
          <h1>Loading...</h1>
          <AJLoading className="w-full h-auto" />
        </section>
      </Layout>
    );
  }
  if (!post) {
    return (
      <Layout site={site}>
        <DefaultErrorPage statusCode={404} />
      </Layout>
    );
  }

  return (
    <>
      <NextSeo
        title={post.title}
        description={post.excerpt}
        canonical={`https://codingcat.dev${router.asPath}`}
        openGraph={{
          type: 'website',
          locale: 'en_US',
          url: `https://codingcat.dev${router.asPath}`,
          title: post.title,
          description: post.excerpt,
          site_name: 'CodingCatDev',
          images: [
            {
              url: `https://media.codingcat.dev/image/upload/c_fit,w_1200,h_630,f_png/${post.coverPhoto?.public_id}`,
              width: 1200,
              height: 630,
              alt: post.title,
            },
            {
              url: `https://media.codingcat.dev/image/upload/f_png/${post.coverPhoto?.public_id}`,
            },
          ],
        }}
      ></NextSeo>
      <Layout site={site}>
        <>
          {post._type === PostType.course ? (
            <CourseLayout
              post={post}
              source={source}
              product={product}
              preview={preview}
            />
          ) : post._type === PostType.podcast ? (
            <PodcastLayout
              post={post}
              router={router}
              course={course}
              source={source}
              recentPosts={recentPosts}
              preview={preview}
            />
          ) : (
            <PostLayout
              router={router}
              post={post}
              course={course}
              source={source}
              recentPosts={recentPosts}
              preview={preview}
            />
          )}
        </>
      </Layout>
    </>
  );
}
