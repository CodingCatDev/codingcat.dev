import { useRouter } from 'next/router';
import { NextSeo } from 'next-seo';

import { Post, PostType } from '@/models/post.model';
import PostLayout from '@/layout/PostLayout';
import CourseLayout from '@/layout/CourseLayout';
import { Site } from '@/models/site.model';
import AJLoading from '@/components/global/icons/AJLoading';
import Layout from '@/layout/Layout';
import DefaultErrorPage from 'next/error';
import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from 'next';
import { StripeProduct } from '@/models/stripe.model';
import {
  getNotionPageBlocks,
  getPurrfectStreamPageBlocks,
  getRecent,
  getSite,
  queryByPublished,
  queryPurrfectStreamByReleased,
} from '@/services/notion.server';

interface StaticPropsResult {
  site: Site;
  post: Post;
  secret: string | null;
  course?: Post;
  preview: boolean | undefined;
  recentPosts?: {
    [key: string]: Post[];
  };
  product?: StripeProduct;
}

export const getStaticPaths: GetStaticPaths = async () => {
  const paths: { params: { permalink: string[] } }[] = [];

  const [posts, tutorials, courses, pages, podcasts] = await Promise.all([
    queryByPublished(PostType.post, 20),
    queryByPublished(PostType.tutorial, 20),
    queryByPublished(PostType.course, 20),
    queryByPublished(PostType.page, 20),
    queryPurrfectStreamByReleased(20),
  ]);

  for (const p of posts.results) {
    if (p.slug) {
      paths.push({
        params: {
          permalink: [PostType.post, `${p.slug}`],
        },
      });
    }
  }

  for (const p of tutorials.results) {
    if (p.slug) {
      paths.push({
        params: {
          permalink: [PostType.tutorial, `${p.slug}`],
        },
      });
    }
  }

  for (const p of courses.results) {
    if (p.slug) {
      paths.push({
        params: {
          permalink: [PostType.course, `${p.slug}`],
        },
      });
    }
  }

  for (const p of pages.results) {
    if (p.slug) {
      paths.push({
        params: {
          permalink: [PostType.page, `${p.slug}`],
        },
      });
    }
  }

  for (const p of podcasts.results) {
    if (p.slug) {
      paths.push({
        params: {
          permalink: [PostType.podcast, `${p.slug}`],
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
  } else {
    preview = false;
  }
  //If Lesson we need to use different slug and get course
  if (lesson === PostType.lesson && lessonPath) {
    post = await getNotionPageBlocks({
      preview,
      _type: PostType.lesson,
      slug: lessonPath,
    });
    course = await getNotionPageBlocks({ preview, _type: type, slug });
  } else {
    // Moved to Notion June 2022
    if (type == PostType.podcast) {
      post = await getPurrfectStreamPageBlocks({ preview, _type: type, slug });
    } else {
      post = await getNotionPageBlocks({ preview, _type: type, slug });
    }
  }

  if (!post) {
    return {
      notFound: true,
    };
  }
  // Courses have products not recentPosts
  const props: StaticPropsResult = {
    site: await getSite(),
    post,
    secret: process?.env?.NEXT_PREVIEW_SECRET || null,
    preview: preview || false,
  };

  // if (type === PostType.course && !lessonPath) {
  //   const productId = post?.accessSettings?.productId;
  //   if (productId) {
  //     const product = await getStripeProduct(productId);
  //     if (product) {
  //       props.product = product;
  //       console.log(`${slug} has product: `, product.id);
  //     }
  //   }
  // } else {
  if (type === PostType.course || lessonPath) {
    // If Lesson use the gathered lesson
    if (lessonPath && course) {
      props.course = course;
    }
    // If course use the post as course
    if (type === PostType.course && !lessonPath) {
      props.course = post;
    }
  } else {
    if (type != PostType.page) {
      const recentPosts = await getRecent({ preview });
      if (recentPosts) {
        props.recentPosts = recentPosts;
      }
    }
  }
  // }

  return {
    props,
    revalidate: 3600,
  };
};

export default function PostPage({
  site,
  post,
  course,
  recentPosts,
  preview,
  product,
  secret,
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
  // console.log(post);
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
              url: `https://media.codingcat.dev/image/upload/f_png,c_fit,w_1200,h_630${post?.coverPhoto?.public_id}`,
              width: 1200,
              height: 630,
              alt: post?.title,
            },
            {
              url: `https://media.codingcat.dev/image/upload/f_png${post?.coverPhoto?.public_id}`,
              alt: post?.title,
            },
          ],
        }}
      ></NextSeo>
      <Layout site={site}>
        <PostLayout
          router={router}
          post={post}
          course={course}
          recentPosts={recentPosts}
          preview={preview}
          secret={secret}
        />
      </Layout>
    </>
  );
}
