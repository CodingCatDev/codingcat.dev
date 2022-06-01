import { Client } from '@notionhq/client';
import { config } from '@/config/notion';

// Initializing a client
const notionClient = new Client({
  auth: config.token,
});

export const queryPurrfectStreamByReleased = async () => {
  let raw = await notionClient.databases.query({
    database_id: config.purrfectStreamsDb,
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
  return raw.results.map((q: any) => {
    return {
      title: `${q.properties.Season.number}.${
        q.properties.Episode.number
      } - ${q?.properties?.Name?.title.map((t: any) => t.plain_text).join('')}`,
      coverPhoto: {
        public_id: q?.cover?.external?.url
          ? q?.cover?.external?.url.split('upload/').at(1)
          : null,
      },
    };
  });
};
