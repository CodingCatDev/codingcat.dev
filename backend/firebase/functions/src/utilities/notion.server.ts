import { Client } from '@notionhq/client';
import {
  QueryDatabaseResponse,
  UpdatePageParameters,
} from '@notionhq/client/build/src/api-endpoints';
import { NotionToMarkdown } from 'notion-to-md';
import {
  notionToken,
  notionPosts,
  notionTutorials,
  notionCourses,
  notionPurrfectDatabaseId,
  notionLessons,
  notionPages,
  notionFrameworks,
  notionLanguages,
  notionAuthors,
  notionPurrfectPicks,
  notionPurrfectGuestDatabaseId,
  notionSections,
  notionPurrfectCompanyDatabaseId,
} from '../config/config';

const notionConfig = {
  postsDb: notionPosts,
  tutorialsDb: notionTutorials,
  coursesDb: notionCourses,
  purrfectStreamsDb: notionPurrfectDatabaseId,
  lessonsDb: notionLessons,
  pagesDb: notionPages,
  frameworksDb: notionFrameworks,
  languagesDb: notionLanguages,
  authorsDb: notionAuthors,
  purrfectPicksDb: notionPurrfectPicks,
  purrfectGuestDb: notionPurrfectGuestDatabaseId,
  sectionsDb: notionSections,
};

// Initializing a client
const notionClient = new Client({
  auth: notionToken,
});

const n2m = new NotionToMarkdown({ notionClient });

interface NotionPosts extends Omit<QueryDatabaseResponse, 'results'> {
  results: any[];
}

export const getNotionDbByType = (_type: string) => {
  switch (_type) {
    case 'post':
      return notionConfig.postsDb;
    case 'tutorial':
      return notionConfig.tutorialsDb;
    case 'course':
      return notionConfig.coursesDb;
    case 'podcast':
      return notionConfig.purrfectStreamsDb;
    case 'lesson':
      return notionConfig.lessonsDb;
    case 'page':
      return notionConfig.pagesDb;
    case 'framework':
      return notionConfig.frameworksDb;
    case 'language':
      return notionConfig.languagesDb;
    default:
      return notionConfig.authorsDb;
  }
};

// CodingCat.dev

//TODO: Finish theses
export const getPageById = async ({
  _id,
  _type,
}: {
  _id: string;
  _type: string;
}) => {
  const raw = await notionClient.pages.retrieve({
    page_id: _id,
  });
  return formatPost(raw, _type);
};

export const getAuthorBySlugService = async ({
  preview,
  slug,
}: {
  preview?: boolean;
  slug: string;
}) => {
  const raw = await notionClient.databases.query({
    database_id: notionConfig.authorsDb,
    filter: {
      and: [
        {
          property: 'slug',
          url: {
            contains: slug,
          },
        },
        {
          property: 'published',
          select: {
            equals: 'published',
          },
        },
        {
          property: 'start',
          date: {
            on_or_before: new Date().toISOString(),
          },
        },
      ],
    },
  });

  return formatPosts(raw, 'author');
};

const formatPost = async (
  q: any,
  _type: string,
  preview?: boolean,
  list?: boolean
) => {
  //Flat authors
  const authors = [];
  let post = q;

  if (q?.properties?.author_title?.rollup?.array) {
    for (const [
      i,
      a,
    ] of q?.properties?.author_title?.rollup?.array?.entries()) {
      const cover = q?.properties?.author_cover?.rollup?.array?.at(i)?.url;

      let photoURL = null;
      if (cover) {
        photoURL = {
          public_id: cover.split('upload/')?.at(1)
            ? cover.split('upload/').at(1)
            : cover,
        };
      }
      const slug = q?.properties?.author_slug?.rollup?.array?.at(i)?.url;

      const author = {
        displayName: `${a?.title.map((t: any) => t.plain_text).join('')}`,
        photoURL,
        slug,
      };
      authors.push(author);
    }
  }
  post = {
    ...post,
    _id: q?.id ? q.id : null,
    title:
      _type === 'podcast'
        ? `${q.properties.Season.number}.${
            q.properties.Episode.number
          } - ${q?.properties?.Name?.title
            .map((t: any) => t.plain_text)
            .join('')}`
        : `${q?.properties?.title?.title
            .map((t: any) => t.plain_text)
            .join('')}`,
    coverPhoto:
      _type === 'podcast'
        ? {
            public_id: q?.cover?.external?.url
              ? q?.cover?.external?.url.split('upload/').at(1)
              : null,
          }
        : {
            public_id: q?.properties?.cover?.url
              ? q?.properties?.cover.url.split('upload/')?.at(1) ||
                q?.properties?.cover?.url
              : null,
          },
    coverVideo: q?.properties?.youtube?.url
      ? { url: q.properties.youtube.url }
      : null,
    _type,
    slug: q?.properties?.slug?.url ? q?.properties?.slug.url : null,
    excerpt: q?.properties?.excerpt?.rich_text
      .map((t: any) => t.plain_text)
      .join(''),
    _createdAt: q?.properties?.start?.date?.start || q?.created_time,
    _updatedAt: q?.last_edited_time,
    authors,
    access_mode: q?.properties?.access_mode?.select?.name
      ? q?.properties?.access_mode?.select?.name
      : 'closed',
  };

  if (_type === 'framework' || _type === 'language') {
    post = {
      ...post,
      courses_count: q?.properties?.courses_count?.rollup?.number || 0,
      tutorials_count: q?.properties?.tutorials_count?.rollup?.number || 0,
      podcasts_count: q?.properties?.podcasts_count?.rollup?.number || 0,
      posts_count: q?.properties?.posts_count?.rollup?.number || 0,
    };
  }

  if (_type === 'podcast') {
    const sponsors: any = [];
    for (const [i] of q?.properties?.sponsors?.relation.entries()) {
      sponsors.push({
        url: q?.properties?.sponsors_url?.rollup?.array?.at(i)?.url || null,
        coverPhoto: {
          public_id: q?.properties?.sponsors_cover?.rollup?.array?.at(i)?.url
            ? q?.properties?.sponsors_cover?.rollup?.array
                ?.at(i)
                ?.url?.split('upload/')
                ?.at(1) ||
              q?.properties?.sponsors_cover?.rollup?.array?.at(i)?.url
            : null,
        },
        description:
          q?.properties?.sponsors_description?.rollup?.array
            ?.at(i)
            ?.rich_text?.map((t: any) => t.plain_text)
            .join('') || null,
        company:
          q?.properties?.sponsors_name?.rollup?.array
            ?.at(i)
            ?.title?.map((t: any) => t.plain_text)
            .join('') || null,
      });
    }

    post = {
      ...post,
      sponsors,
    };
  }

  // Get sections and lessons for course
  if (_type === 'course' && !list) {
    console.log('got list');
    const sectionsRaw = await querySectionsByCourseId(q.id, preview);
    const sections: any = [];
    for (const s of sectionsRaw.results as any) {
      const lesson = {
        title: `${s?.properties?.lesson_title?.rollup?.array
          ?.at(0)
          ?.title.map((t: any) => t.plain_text)
          .join('')}`,
        _id: s.id,
        slug: s?.properties?.lesson_slug?.rollup?.array?.at(0)?.url
          ? s?.properties?.lesson_slug.rollup?.array?.at(0)?.url
          : null,
        access_mode: s?.properties?.access_mode?.select?.name
          ? s?.properties?.access_mode?.select?.name
          : post.access_mode,
      };
      const exists = sections.find(
        (e: any) =>
          e.title ===
          `${s?.properties?.title?.title
            .map((t: any) => t.plain_text)
            .join('')}`
      );

      if (exists) {
        exists.lessons.push(lesson);
      } else {
        sections.push({
          ...s,
          title: `${s?.properties?.title?.title
            .map((t: any) => t.plain_text)
            .join('')}`,
          _key: s.id,
          lessons: [lesson],
        });
      }
    }
    post = {
      ...post,
      sections,
    };
  }
  if (_type === 'author') {
    post = {
      ...post,
      _id: q?.id ? q.id : null,
      displayName: `${q?.properties?.title?.title
        .map((t: any) => t.plain_text)
        .join('')}`,
      photoURL: {
        public_id: q?.properties?.cover?.url
          ? q?.properties?.cover.url.split('upload/')?.at(1) ||
            q?.properties?.cover?.url
          : null,
      },
      slug: q?.properties?.slug?.url ? q?.properties?.slug.url : null,
    };
  }
  return post;
};

const formatPosts = async (
  raw: QueryDatabaseResponse,
  _type: string,
  preview?: boolean,
  list?: boolean
) => {
  const results = await Promise.all(
    raw.results.map((q: any) => formatPost(q, _type, preview, list))
  );

  const post = {
    ...raw,
    results,
  } as unknown as NotionPosts;
  return post;
};

export const queryByPublished = async (
  _type: string,
  page_size?: number,
  start_cursor?: string | null
) => {
  let sorts: any = [
    {
      property: 'start',
      direction: 'descending',
    },
  ];
  let filter: any = {
    and: [
      {
        property: 'slug',
        url: {
          is_not_empty: true,
        },
      },
      {
        property: 'published',
        select: {
          equals: 'published',
        },
      },
      {
        property: 'start',
        date: {
          on_or_before: new Date().toISOString(),
        },
      },
    ],
  };

  if (_type === 'author') {
    sorts = [
      {
        property: 'title',
        direction: 'ascending',
      },
    ];
  }

  if (_type === 'framework' || _type === 'language') {
    filter = {
      and: [
        {
          property: 'slug',
          url: {
            is_not_empty: true,
          },
        },
        {
          or: [
            {
              property: 'courses_count',
              rollup: {
                number: { greater_than: 0 },
              },
            },
            {
              property: 'tutorials_count',
              rollup: {
                number: { greater_than: 0 },
              },
            },
            {
              property: 'podcasts_count',
              rollup: {
                number: { greater_than: 0 },
              },
            },
            {
              property: 'posts_count',
              rollup: {
                number: { greater_than: 0 },
              },
            },
          ],
        },
      ],
    };
    sorts = [
      {
        property: 'title',
        direction: 'ascending',
      },
    ];
  }

  const raw = await notionClient.databases.query({
    database_id: getNotionDbByType(_type),
    start_cursor: start_cursor ? start_cursor : undefined,
    page_size,
    filter,
    sorts,
  });
  return await formatPosts(raw, _type, false, true);
};

export const queryAll = async (
  _type: string,
  page_size?: number,
  start_cursor?: string | null
) => {
  const raw = await notionClient.databases.query({
    database_id: getNotionDbByType(_type),
    start_cursor: start_cursor ? start_cursor : undefined,
    page_size,
  });
  return await formatPosts(raw, _type, false, true);
};

export const getNotionPageMarkdown = async ({
  _type,
  slug,
  preview,
}: {
  _type: string;
  slug?: string;
  preview: boolean | undefined;
}) => {
  let pageId;
  let page;

  if (slug) {
    const raw = await queryNotionDbBySlug(_type, slug, preview);
    if (!raw.results.length) {
      return null;
    }
    page = raw.results.at(0);
    pageId = page?.id;
  }
  if (!page) {
    return null;
  }
  if (!pageId) {
    return null;
  }
  let content = '';
  const blocks = await n2m.pageToMarkdown(pageId);
  content += n2m.toMarkdownString(blocks);

  return {
    ...page,
    content,
  };
};

export const queryNotionDbBySlug = async (
  _type: string,
  slug: string,
  preview?: boolean
) => {
  let filter: any;
  let sorts: any;
  filter = {
    and: [
      {
        property: 'slug',
        url: {
          contains: slug,
        },
      },
    ],
  };

  if (!preview) {
    filter = {
      ...filter,
      and: [
        ...filter.and,
        ...[
          {
            property: 'published',
            select: {
              equals: 'published',
            },
          },
          {
            property: 'start',
            date: {
              on_or_before: new Date().toISOString(),
            },
          },
        ],
      ],
    };
  }

  if (_type === 'framework' || _type === 'language') {
    filter = {
      and: [
        {
          property: 'slug',
          url: {
            contains: slug,
          },
        },
      ],
    };
    sorts = [
      {
        property: 'title',
        direction: 'ascending',
      },
    ];
  }

  const raw = await notionClient.databases.query({
    database_id: getNotionDbByType(_type),
    filter,
    sorts,
  });
  return await formatPosts(raw, _type, preview);
};

export const querySectionsByCourseId = async (
  id: string,
  preview: boolean | undefined
) => {
  let filter;
  filter = {
    property: 'courses',
    relation: {
      contains: id,
    },
  };
  if (!preview) {
    filter = {
      and: [
        {
          property: 'courses',
          relation: {
            contains: id,
          },
        },
        {
          property: 'lesson_published',
          rollup: {
            every: {
              select: {
                equals: 'published',
              },
            },
          },
        },
      ],
    };
  }

  const raw = await notionClient.databases.query({
    database_id: notionConfig.sectionsDb,
    filter,
    sorts: [
      {
        property: 'section_order',
        direction: 'ascending',
      },
      {
        property: 'lesson_order',
        direction: 'ascending',
      },
    ],
  });
  return raw;
};

export const queryRelationById = async (
  id: string,
  relation: string,
  _type: string
) => {
  let sorts: any = [
    {
      property: 'start',
      direction: 'descending',
    },
  ];

  if (_type === 'podcast') {
    sorts = [
      {
        property: 'Season',
        direction: 'descending',
      },
      {
        property: 'Episode',
        direction: 'descending',
      },
    ];
  }
  const raw = await notionClient.databases.query({
    database_id: getNotionDbByType(_type),
    filter: {
      property: relation,
      relation: {
        contains: id,
      },
    },
    sorts,
  });
  return await formatPosts(raw, _type);
};

// Purrfect.dev

export const queryPurrfectStreamAll = async (
  page_size?: number,
  start_cursor?: string | null
) => {
  const raw = await notionClient.databases.query({
    database_id: notionConfig.purrfectStreamsDb,
    start_cursor: start_cursor ? start_cursor : undefined,
    page_size,
  });
  return await formatPosts(raw, 'podcast');
};

export const queryPurrfectStreamByReleased = async (
  page_size?: number,
  start_cursor?: string | null
) => {
  const raw = await notionClient.databases.query({
    database_id: notionConfig.purrfectStreamsDb,
    start_cursor: start_cursor ? start_cursor : undefined,
    page_size,
    filter: {
      and: [
        {
          property: 'slug',
          url: {
            is_not_empty: true,
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
        {
          property: 'start',
          date: {
            on_or_before: new Date().toISOString(),
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
  return await formatPosts(raw, 'podcast');
};

export const queryPurrfectStreamDevTo = async (
  page_size?: number,
  start_cursor?: string | null
) => {
  const raw = await notionClient.databases.query({
    database_id: notionConfig.purrfectStreamsDb,
    start_cursor: start_cursor ? start_cursor : undefined,
    page_size,
    filter: {
      and: [
        {
          property: 'slug',
          url: {
            is_not_empty: true,
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
        {
          property: 'start',
          date: {
            on_or_before: new Date().toISOString(),
          },
        },
        {
          property: 'devto',
          url: {
            is_empty: true,
          },
        },
        {
          property: 'youtube',
          url: {
            is_not_empty: true,
          },
        },
        {
          property: 'spotify',
          url: {
            is_not_empty: true,
          },
        },
      ],
    },
    sorts: [
      {
        property: 'Season',
        direction: 'ascending',
      },
      {
        property: 'Episode',
        direction: 'ascending',
      },
    ],
  });
  return await formatPosts(raw, 'podcast');
};

export const queryPurrfectStreamHashnode = async (
  page_size?: number,
  start_cursor?: string | null
) => {
  const raw = await notionClient.databases.query({
    database_id: notionConfig.purrfectStreamsDb,
    start_cursor: start_cursor ? start_cursor : undefined,
    page_size,
    filter: {
      and: [
        {
          property: 'slug',
          url: {
            is_not_empty: true,
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
        {
          property: 'start',
          date: {
            on_or_before: new Date().toISOString(),
          },
        },
        {
          property: 'hashnode',
          url: {
            is_empty: true,
          },
        },
        {
          property: 'youtube',
          url: {
            is_not_empty: true,
          },
        },
        {
          property: 'spotify',
          url: {
            is_not_empty: true,
          },
        },
      ],
    },
    sorts: [
      {
        property: 'Season',
        direction: 'ascending',
      },
      {
        property: 'Episode',
        direction: 'ascending',
      },
    ],
  });
  return await formatPosts(raw, 'podcast');
};

export const queryPurrfectStreamBySlug = async (slug: string) => {
  const raw = await notionClient.databases.query({
    database_id: notionConfig.purrfectStreamsDb,
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
        {
          property: 'start',
          date: {
            on_or_before: new Date().toISOString(),
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
  return await formatPosts(raw, 'podcast');
};

export const getPurrfectStreamPageMarkdown = async (slug: string) => {
  const raw = await queryPurrfectStreamBySlug(slug);
  if (!raw.results.length) {
    return null;
  }

  //Get purrfect picks
  const page = raw.results.at(0);
  if (!page) {
    return null;
  }
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
  for (const p of raw.results) {
    const blocks = await n2m.pageToMarkdown(p.id);
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
      const g: any = purrfectGuests.results.find((d: any) => d.id === guestId);
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
    const alreadyUsed = picks.find((p: any) => p.name === guest.name);
    if (alreadyUsed) {
      alreadyUsed.picks = [...alreadyUsed.picks, link] as any;
    } else {
      guest.picks = [link];
      picks = [...picks, guest] as any;
    }
  }
  let pickBlocks: any;
  if (picks.length > 0) {
    pickBlocks = [{ parent: '## Purrfect Picks', children: [] }];

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
  }

  content += n2m.toMarkdownString(pickBlocks);

  return {
    ...raw.results[0],
    content,
  };
};

export const queryPurrfectPicksByStreamId = async (streamId: string) => {
  const raw = await notionClient.databases.query({
    database_id: notionConfig.purrfectPicksDb,
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
  const raw = await notionClient.databases.query({
    database_id: notionConfig.purrfectGuestDb,
    filter: {
      property: 'streams',
      relation: {
        contains: streamId,
      },
    },
  });
  return raw;
};

export const queryNotionDbForCloudinaryConvert = async (_type: string) => {
  return await notionClient.databases.query({
    database_id: getNotionDbByType(_type),
    filter: {
      and: [
        {
          property: 'cloudinary_convert',
          checkbox: {
            equals: true,
          },
        },
      ],
    },
  });
};

export const getGuestRelations = (guestIds?: string[]) => {
  const guestRelation = [];
  if (guestIds) {
    for (const guestId of guestIds) {
      guestRelation.push({
        database_id: notionPurrfectGuestDatabaseId,
        id: guestId,
      });
    }
  }
  return guestRelation;
};
export const getCompanytRelations = (companyIds?: string[]) => {
  const companyRelation = [];
  if (companyIds) {
    for (const companyId of companyIds) {
      companyRelation.push({
        database_id: notionPurrfectCompanyDatabaseId,
        id: companyId,
      });
    }
  }
  return companyRelation;
};

export const queryPurrfectPageByCalendarId = (calendarid: string) => {
  return notionClient.databases.query({
    database_id: notionPurrfectDatabaseId,
    filter: {
      property: 'calendarid',
      rich_text: {
        contains: calendarid,
      },
    },
  });
};

export const queryPurrfectPageScheduled = (status: string) => {
  return notionClient.databases.query({
    database_id: notionPurrfectDatabaseId,
    filter: {
      property: 'Status',
      select: {
        equals: status,
      },
    },
  });
};

export const getPage = (page_id: string) => {
  return notionClient.pages.retrieve({
    page_id,
  });
};

export const createPurrfectPage = ({
  calendarid,
  guestIds,
  recordingDate,
  companyIds,
}: {
  calendarid: string;
  recordingDate: string;
  guestIds?: string[];
  companyIds?: string[];
}) => {
  const notionCreatePayload = {
    parent: {
      database_id: notionPurrfectDatabaseId,
    },
    properties: {
      calendarid: {
        id: 'RZ<I',
        type: 'rich_text',
        rich_text: [
          {
            type: 'text',
            text: {
              content: calendarid,
              link: null,
            },
          },
        ],
      },
      Guest: {
        id: '8Ym~',
        type: 'relation',
        relation: getGuestRelations(guestIds),
      },
      'Recording Date': {
        id: 'br,*',
        type: 'date',
        date: {
          start: recordingDate,
          end: null,
          time_zone: 'America/New_York',
        },
      },
      Company: {
        id: 'fUcG',
        type: 'relation',
        relation: getCompanytRelations(companyIds),
      },
      Status: {
        id: 'js5S',
        type: 'select',
        select: {
          id: 'b09f1d02-e20d-418b-95c2-7997d45b420e',
          name: 'Scheduled',
          color: 'blue',
        },
      },
      Name: {
        id: 'title',
        type: 'title',
        title: [
          {
            type: 'text',
            text: {
              content: 'NEW PODCAST',
              link: null,
            },
          },
        ],
      },
    },
  } as any;
  console.log('notionCreatePayload', JSON.stringify(notionCreatePayload));
  return notionClient.pages.create(notionCreatePayload);
};

export const patchPurrfectPage = (pageParams: UpdatePageParameters) => {
  return notionClient.pages.update(pageParams);
};

export const queryPurrfectGuest = (email: string) => {
  return notionClient.databases.query({
    database_id: notionPurrfectGuestDatabaseId,
    filter: {
      property: 'email',
      email: {
        equals: email,
      },
    },
  });
};

export const createPurrfectGuest = ({
  name,
  email,
  twitterHandle,
  companyIds,
}: {
  name: string;
  email: string;
  twitterHandle?: string;
  companyIds?: string[];
}) => {
  const page = {
    parent: {
      database_id: notionPurrfectGuestDatabaseId,
    },
    properties: {
      email: {
        type: 'email',
        email: email,
      },
      Name: {
        id: 'title',
        type: 'title',
        title: [
          {
            type: 'text',
            text: {
              content: name,
            },
          },
        ],
      },
    },
  } as any;

  if (twitterHandle) {
    page.properties.Twitter = {
      type: 'url',
      url: `${twitterHandle}`,
    };
  }

  return notionClient.pages.create(page);
};

export const getBlocks = async (blockId: string) => {
  const response = await notionClient.blocks.children.list({
    block_id: blockId,
  });

  return response.results as any[];
};

export const getChildBlocks = async (blocks: any[]) => {
  // Retrieve block children for nested blocks (one level deep), for example toggle blocks
  // https://developers.notion.com/docs/working-with-page-content#reading-nested-blocks

  const blocksWithChildren: any[] = [];
  for (const block of blocks as any) {
    blocksWithChildren.push(block);
    if (block.has_children) {
      const childrenBlocks = await getBlocks(block.id);
      for (const b of childrenBlocks as any) {
        blocksWithChildren.push(b);
      }
    }
  }
  return blocksWithChildren;
};

export const getNotionPageBlocks = async (id: string) => {
  return await getChildBlocks(await getBlocks(id));
};

export const updateBlock = async (blockId: string, block: any) => {
  const response = await notionClient.blocks.update({
    block_id: blockId,
    ...block,
  });

  return response;
};
