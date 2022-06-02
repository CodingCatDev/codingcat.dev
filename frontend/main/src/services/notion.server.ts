import { Client } from '@notionhq/client';
import { config } from '@/config/notion';
import { Post } from '@/models/post.model';
import { QueryDatabaseResponse } from '@notionhq/client/build/src/api-endpoints';
import { NotionToMarkdown } from 'notion-to-md';

const slugify = (str: string) =>
  str
    .toLowerCase()
    .trim()
    .replace('.', '-')
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');

// Initializing a client
const notionClient = new Client({
  auth: config.token,
});
const n2m = new NotionToMarkdown({ notionClient });

interface NotionPosts extends Omit<QueryDatabaseResponse, 'results'> {
  results: Post[];
}

export const queryPurrfectStreamByReleased = async (
  page_size?: number,
  start_cursor?: string | null
) => {
  let raw = await notionClient.databases.query({
    database_id: config.purrfectStreamsDb,
    start_cursor: start_cursor ? start_cursor : undefined,
    page_size,
    filter: {
      and: [
        {
          property: 'Status',
          select: {
            equals: 'Released',
          },
        },
        {
          property: 'Episode',
          number: {
            is_not_empty: true,
          },
        },
      ],
    },
    sorts: [
      {
        property: 'Season',
        direction: 'descending',
      },
      {
        property: 'Episode',
        direction: 'descending',
      },
    ],
  });
  return {
    ...raw,
    results: raw.results.map((q: any) => {
      return {
        ...q,
        title: `${q.properties.Season.number}.${
          q.properties.Episode.number
        } - ${q?.properties?.Name?.title
          .map((t: any) => t.plain_text)
          .join('')}`,
        coverPhoto: {
          public_id: q?.cover?.external?.url
            ? q?.cover?.external?.url.split('upload/').at(1)
            : null,
        },
        _type: 'podcast',
        slug: q?.properties?.slug?.rich_text
          .map((t: any) => t.plain_text)
          .join(''),
        excerpt: q?.properties?.excerpt?.rich_text
          .map((t: any) => t.plain_text)
          .join(''),
      };
    }),
  } as unknown as NotionPosts;
};

export const queryPurrfectStreamBySlug = async (slug: string) => {
  let raw = await notionClient.databases.query({
    database_id: config.purrfectStreamsDb,
    filter: {
      and: [
        {
          property: 'slug',
          rich_text: {
            contains: slug,
          },
        },
        {
          property: 'Status',
          select: {
            equals: 'Released',
          },
        },
        {
          property: 'Episode',
          number: {
            is_not_empty: true,
          },
        },
      ],
    },
    sorts: [
      {
        property: 'Season',
        direction: 'descending',
      },
      {
        property: 'Episode',
        direction: 'descending',
      },
    ],
  });
  return {
    ...raw,
    results: raw.results.map((q: any) => {
      return {
        ...q,
        title: `${q.properties.Season.number}.${
          q.properties.Episode.number
        } - ${q?.properties?.Name?.title
          .map((t: any) => t.plain_text)
          .join('')}`,
        coverPhoto: {
          public_id: q?.cover?.external?.url
            ? q?.cover?.external?.url.split('upload/').at(1)
            : null,
        },
        _type: 'podcast',
        slug: q?.properties?.slug?.rich_text
          .map((t: any) => t.plain_text)
          .join(''),
        excerpt: q?.properties?.excerpt?.rich_text
          .map((t: any) => t.plain_text)
          .join(''),
      };
    }),
  };
};

export const getPurrfectStreamPageById = async (page_id: string) => {
  let raw = await notionClient.pages.retrieve({
    page_id,
  });
  return {
    ...raw,
  } as unknown as Post;
};

export const getPurrfectStreamBlocksBySlug = async (slug: string) => {
  const dbObject = await queryPurrfectStreamBySlug(slug);
  if (!dbObject.results.length) {
    return null;
  }
  let raw = await notionClient.blocks.children.list({
    block_id: dbObject.results[0].id,
  });
  console.log(raw);
  return {
    ...raw,
  } as unknown as Post;
};

export const getPurrfectStreamPageMarkdown = async (slug: string) => {
  let raw = await queryPurrfectStreamBySlug(slug);
  if (!raw.results.length) {
    return null;
  }
  raw.results.map((q: any) => {
    return {
      ...q,
      title: `${q.properties.Season.number}.${
        q.properties.Episode.number
      } - ${q?.properties?.Name?.title.map((t: any) => t.plain_text).join('')}`,
      coverPhoto: {
        public_id: q?.cover?.external?.url
          ? q?.cover?.external?.url.split('upload/').at(1)
          : null,
      },
      _type: 'podcast',
      slug: q?.properties?.slug?.rich_text
        .map((t: any) => t.plain_text)
        .join(''),
      excerpt: q?.properties?.excerpt?.rich_text
        .map((t: any) => t.plain_text)
        .join(''),
    };
  });

  const mdblocks = await n2m.pageToMarkdown(raw.results[0].id);
  const content = n2m.toMarkdownString(mdblocks);
  return {
    ...raw.results[0],
    content,
  };
};
