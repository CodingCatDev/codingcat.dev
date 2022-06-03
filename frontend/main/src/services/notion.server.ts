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
        coverVideo: q?.properties?.YouTube?.url
          ? { url: q.properties.YouTube.url }
          : undefined,
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

  //Get purrfect picks
  const page = raw.results.at(0);
  const id = page.id;
  const [purrfectPicks, purrfectGuests] =
    await Promise.all<QueryDatabaseResponse>([
      queryPurrfectPicksByStreamId(id),
      queryPurrfectGuestsByStreamId(id),
    ]);

  let content = '';
  // Build the markdown for page
  for (const guest of purrfectGuests.results) {
    const blocks = await n2m.pageToMarkdown(guest.id);
    content += n2m.toMarkdownString(blocks);
  }
  for (const page of raw.results) {
    const blocks = await n2m.pageToMarkdown(page.id);
    content += n2m.toMarkdownString(blocks);
  }

  // Create picks blocks
  let picks:
    | [
        {
          name: string;
          picks: [{ name: string; url: string }];
        }
      ]
    | [] = [];
  for (const pick of purrfectPicks.results as any) {
    const guestId = pick.properties?.Guest?.relation?.at(0)?.id;
    const guest = {
      name: '',
      picks: [] as [{ name: string; url: string }] | [],
    };
    // Find name
    if (guestId) {
      const g: any = purrfectGuests.results.find((g: any) => g.id == guestId);
      guest.name = g?.properties?.Name?.title
        .map((t: any) => t.plain_text)
        .join('');
    } else {
      guest.name = pick.properties?.Us?.people?.at(0)?.name;
    }
    const link = {
      name: pick?.properties?.Name?.title
        .map((t: any) => t.plain_text)
        .join('') as string,
      url: pick?.properties?.Site?.url as string,
    };
    const alreadyUsed = picks.find((p: any) => p.name == guest.name);
    if (alreadyUsed) {
      alreadyUsed.picks = [...alreadyUsed.picks, link] as any;
    } else {
      guest.picks = [link];
      picks = [...picks, guest] as any;
    }
  }
  let pickBlocks: any = [{ parent: '## Purrfect Picks', children: [] }];

  picks.map((p) => {
    pickBlocks.push({
      parent: `### ${p.name}`,
      children: [],
    });
    p.picks.map((pick) => {
      pickBlocks.push({
        parent: `- [${pick.name}](${pick.url})`,
        children: [],
      });
    });
  });

  content += n2m.toMarkdownString(pickBlocks);

  return {
    ...raw.results[0],
    content,
  };
};

export const queryPurrfectPicksByStreamId = async (streamId: string) => {
  let raw = await notionClient.databases.query({
    database_id: config.purrfectPicksDb,
    filter: {
      property: 'streams',
      relation: {
        contains: streamId,
      },
    },
    sorts: [
      {
        property: 'Guest',
        direction: 'ascending',
      },
      {
        property: 'Us',
        direction: 'descending',
      },
    ],
  });
  return raw;
};
export const queryPurrfectGuestsByStreamId = async (streamId: string) => {
  let raw = await notionClient.databases.query({
    database_id: config.purrfectGuestDb,
    filter: {
      property: 'streams',
      relation: {
        contains: streamId,
      },
    },
  });
  return raw;
};
