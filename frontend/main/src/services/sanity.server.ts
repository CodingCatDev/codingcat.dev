import { groq } from 'next-sanity';
// lib/sanity.server.js
import { createClient } from 'next-sanity';
import { config } from '@/config/sanity';
import { Site } from '@/models/site.model';
import { Post, PostType } from '@/models/post.model';
import { Tag } from '@/models/tag.model';
import { Author } from '@/models/user.model';

// Set up the client for fetching data in the getProps page functions
export const sanityClient = createClient(config);

// Set up a preview client with serverless authentication for drafts
export const previewClient = createClient({
  ...config,
  useCdn: false,
});

// Helper function for easily switching between normal client and preview client
export const getClient = (usePreview: boolean) =>
  usePreview ? previewClient : sanityClient;

export const getSite = async ({ preview = false }) => {
  const siteQuery = groq`
  *[!(_id in path('drafts.**')) && _type == "site"][0] {
    title,
    pageLinks[]->{
      title,
      "slug": slug.current
    },
    socialLinks
  }
`;
  return await getClient(preview).fetch<Site>(siteQuery);
};
export const getPostsService = async ({
  type,
  preview = false,
  limit,
  params,
}: {
  type: PostType;
  preview?: boolean;
  limit?: number;
  params?: string;
}) => {
  const recentPostsQuery = groq`
  *[!(_id in path('drafts.**')) && _type == $type && publishedAt < "${new Date().toISOString()}"] | order(publishedAt desc)${
    limit ? '[0...' + limit + ']' : ''
  } {
    ${
      params
        ? params
        : `
      _id,
      _type,
      title,
      excerpt,
      authors[]->{
        ...,
        "slug":slug.current,
      },
      coverPhoto{
        public_id
      },
      "slug": slug.current
      `
    }
  }
`;

  return await getClient(preview).fetch<Post[]>(recentPostsQuery, { type });
};

export const getRecentPostsService = async ({ preview = false }) => {
  const course = await getPostsService({
    type: PostType.course,
    preview,
    limit: 3,
  });
  const post = await getPostsService({
    type: PostType.post,
    preview,
    limit: 3,
  });
  const tutorial = await getPostsService({
    type: PostType.tutorial,
    preview,
    limit: 3,
  });
  const podcast = await getPostsService({
    type: PostType.podcast,
    preview,
    limit: 3,
  });
  return { course, post, tutorial, podcast };
};

export const getPostBySlugService = async ({
  type,
  preview = false,
  slug,
  params,
}: {
  type: PostType;
  preview?: boolean;
  slug: string;
  params?: string;
}) => {
  const recentPostsQuery = groq`
  *[!(_id in path('drafts.**')) && _type == $type && slug.current == $slug && publishedAt < "${new Date().toISOString()}"] | order(publishedAt desc)[0]
  {
    ...,
    "slug": slug.current,
    sections[]{
      ...,
      lessons[]->{_id, title,"slug": slug.current}
    },
    authors[]->{
      ...,
      "slug":slug.current,
    },
  }
  `;

  return await getClient(preview).fetch<Post>(recentPostsQuery, {
    slug,
    type,
  });
};

export const getPostById = async ({
  preview = true,
  _id,
}: {
  preview?: boolean;
  _id: string;
}) => {
  const recentPostsQuery = groq`
  *[_id == $_id][0]
  {
    ...,
    "slug": slug.current,
    sections[]{
      ...,
      lessons[]->{_id, title,"slug": slug.current}
    },
    authors[]->{
      ...,
      "slug":slug.current,
    },
  }
  `;

  return await getClient(preview).fetch<Post>(recentPostsQuery, {
    _id,
  });
};

export const getAuthorBySlugService = async ({
  preview = false,
  slug,
  params,
}: {
  preview?: boolean;
  slug: string;
  params?: string;
}) => {
  const recentPostsQuery = groq`
  *[!(_id in path('drafts.**')) && _type == 'author' && slug.current == $slug] | order(publishedAt desc)[0]`;

  return await getClient(preview).fetch<Author>(recentPostsQuery, {
    slug,
  });
};

export const getAuthors = async ({
  preview = false,
}: {
  preview?: boolean;
}) => {
  const recentPostsQuery = groq`
    *[!(_id in path('drafts.**')) && _type == 'author'] | order(name desc)
    {
      ...,
      "slug": slug.current
    }
  `;

  return await getClient(preview).fetch(recentPostsQuery);
};

export const getTags = async ({
  preview = false,
  tag,
}: {
  preview?: boolean;
  tag: 'framework' | 'language';
}) => {
  const q = groq`
    *[_type == '${tag}'] | order(title asc)
    {
      ...,
      "slug": slug.current
    }
  `;

  return await getClient(preview).fetch(q);
};

export const getPostsByTag = async ({
  _id,
  tag,
  type,
  preview = false,
  limit,
  params,
}: {
  _id: string;
  tag: 'frameworks' | 'languages';
  type: PostType;
  preview?: boolean;
  limit?: number;
  params?: string;
}) => {
  const recentPostsQuery = groq`
  *[!(_id in path('drafts.**')) && _type == $type && $_id in ${tag}[]._ref && publishedAt < "${new Date().toISOString()}"] | order(title asc)${
    limit ? '[0...' + limit + ']' : ''
  } {
    ${
      params
        ? params
        : `
      _id,
      _type,
      title,
      excerpt,
      coverPhoto{
        public_id
      },
      "slug": slug.current,
      authors[]->{
        ...,
        "slug":slug.current,
      },
      `
    }
  }
`;

  return await getClient(preview).fetch<Post[]>(recentPostsQuery, {
    _id,
    type,
    tag,
  });
};
export const getTagBySlugService = async ({
  tag,
  preview = false,
  slug,
  params,
}: {
  tag: 'framework' | 'language';
  preview?: boolean;
  slug: string;
  params?: string;
}) => {
  const recentPostsQuery = groq`
  *[!(_id in path('drafts.**')) && _type == $tag && slug.current == $slug] | order(title asc)[0]`;

  return await getClient(preview).fetch<Tag>(recentPostsQuery, {
    slug,
    tag,
  });
};
export const getPostsByUser = async ({
  _id,
  type,
  preview = false,
  limit,
  params,
}: {
  _id: string;
  type: PostType;
  preview?: boolean;
  limit?: number;
  params?: string;
}) => {
  const recentPostsQuery = groq`
  *[!(_id in path('drafts.**')) && _type == $type && $_id in authors[]._ref && publishedAt < "${new Date().toISOString()}"] | order(title asc)${
    limit ? '[0...' + limit + ']' : ''
  } {
    ${
      params
        ? params
        : `
      _id,
      _type,
      title,
      excerpt,
      coverPhoto{
        public_id
      },
      "slug": slug.current,
      authors[]->{
        ...,
        "slug":slug.current,
      },
      `
    }
  }
`;

  return await getClient(preview).fetch<Post[]>(recentPostsQuery, {
    _id,
    type,
  });
};
