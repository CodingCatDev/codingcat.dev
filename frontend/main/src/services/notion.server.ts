import { Client } from '@notionhq/client';
import { config } from '@/config/notion';
import { Post } from '@/models/post.model';
import { QueryDatabaseResponse } from '@notionhq/client/build/src/api-endpoints';

// Initializing a client
const notionClient = new Client({
  auth: config.token,
});

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
      };
    }),
  } as unknown as NotionPosts;
};
