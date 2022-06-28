import { AccessMode } from './../models/access.model';
import { Author } from '@/models/user.model';
import { Client } from '@notionhq/client';
import { config } from '@/config/notion';
import { Post, PostType } from '@/models/post.model';
import { QueryDatabaseResponse } from '@notionhq/client/build/src/api-endpoints';
import { config as notionConfig } from '@/config/notion';
import { Site } from '@/models/site.model';
import { Tag } from '@/models/tag.model';
import { NotionBlock } from '@9gustin/react-notion-render';
import { getCloudinaryPublicId } from '@/utils/cloudinary/cloudinary';

// Initializing a client
const notionClient = new Client({
  auth: config.token,
});

const skipNotion = process?.env?.NOTION_SKIP;

interface NotionPosts extends Omit<QueryDatabaseResponse, 'results'> {
  results: Post[];
}

export const getNotionDbByType = (_type: string) => {
  switch (_type) {
    case PostType.post:
      return notionConfig.postsDb;
    case PostType.tutorial:
      return notionConfig.tutorialsDb;
    case PostType.course:
      return notionConfig.coursesDb;
    case PostType.podcast:
      return notionConfig.purrfectStreamsDb;
    case PostType.lesson:
      return notionConfig.lessonsDb;
    case PostType.page:
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
  if (skipNotion) {
    return null;
  }
  let raw = await notionClient.pages.retrieve({
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
  if (skipNotion) {
    return {
      has_more: false,
      results: [],
    } as unknown as QueryDatabaseResponse;
  }
  let raw = await notionClient.databases.query({
    database_id: config.authorsDb,
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

export const getAuthorPageBlocks = async (slug: string) => {
  let raw = await getAuthorBySlugService({ slug });
  if (!raw.results.length) {
    return null;
  }

  const page = raw.results.at(0);
  if (!page) {
    return null;
  }
  let blocks: any[] = [];

  for (const page of raw.results) {
    blocks = [...blocks, ...(await getChildBlocks(await getBlocks(page.id)))];
  }

  return {
    ...raw.results[0],
    blocks,
  } as unknown as Author;
};

export const getTagBySlugService = ({
  //DELETE
  tag,
  preview,
  slug,
}: {
  tag: string;
  preview?: boolean;
  slug: string;
}) => {
  return { _id: 'yep' } as Tag;
};
export const getPostsByTag = ({
  type,
  _id,
  tag,
}: {
  type: PostType;
  _id: string;
  tag: string;
}) => {
  return { _id: 'yep' };
};

export const getTags = ({
  preview,
  tag,
}: {
  preview?: boolean;
  tag: string;
}) => {
  return [{ _id: 'yep' }] as Tag[];
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
  let coverPublicId = getCloudinaryPublicId(q?.cover?.external?.url);
  post = {
    ...post,
    _id: q?.id ? q.id : null,
    title:
      _type == PostType.podcast
        ? `${q.properties.Season.number}.${
            q.properties.Episode.number
          } - ${q?.properties?.Name?.title
            .map((t: any) => t.plain_text)
            .join('')}`
        : `${q?.properties?.title?.title
            .map((t: any) => t.plain_text)
            .join('')}`,
    coverPhoto: {
      secure_url: coverPublicId
        ? `https://media.codingcat.dev/image/upload${coverPublicId}`
        : null,
      public_id: coverPublicId ? `${coverPublicId}` : null,
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
      : AccessMode.closed,
  };

  if (_type == 'framework' || _type == 'language') {
    post = {
      ...post,
      courses_count: q?.properties?.courses_count?.rollup?.number || 0,
      tutorials_count: q?.properties?.tutorials_count?.rollup?.number || 0,
      podcasts_count: q?.properties?.podcasts_count?.rollup?.number || 0,
      posts_count: q?.properties?.posts_count?.rollup?.number || 0,
    };
  }

  if (_type == PostType.podcast) {
    let sponsors: any = [];
    for (const [i, s] of q?.properties?.sponsors?.relation.entries()) {
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
  if (_type == PostType.course && !list) {
    const sectionsRaw = await querySectionsByCourseId(q.id, preview);
    let sections: any = [];
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
          e.title ==
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
  if (_type == 'author') {
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

  let post = {
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

  if (_type == 'author') {
    sorts = [
      {
        property: 'title',
        direction: 'ascending',
      },
    ];
  }

  if (_type == 'framework' || _type == 'language') {
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
  if (skipNotion) {
    return {
      has_more: false,
      results: [],
    } as unknown as NotionPosts;
  }
  let raw = await notionClient.databases.query({
    database_id: getNotionDbByType(_type),
    start_cursor: start_cursor ? start_cursor : undefined,
    page_size,
    filter,
    sorts,
  });
  return await formatPosts(raw, _type, false, true);
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

  if (_type == 'framework' || _type == 'language') {
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
  if (skipNotion) {
    return {
      has_more: false,
      results: [],
    } as unknown as QueryDatabaseResponse;
  }
  let raw = await notionClient.databases.query({
    database_id: getNotionDbByType(_type),
    filter,
    sorts,
  });
  return await formatPosts(raw, _type, preview);
};

export const getNotionPageBlocks = async ({
  _type,
  slug,
  preview,
}: {
  _type: PostType;
  slug?: string;
  preview: boolean | undefined;
}) => {
  let pageId;
  let page;

  if (slug) {
    let raw = await queryNotionDbBySlug(_type, slug, preview);
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
  return {
    ...page,
    blocks: await getChildBlocks(await getBlocks(pageId)),
  } as Post;
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
  if (skipNotion) {
    return {
      has_more: false,
      results: [],
    } as unknown as QueryDatabaseResponse;
  }
  let raw = await notionClient.databases.query({
    database_id: config.sectionsDb,
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

  if (_type == PostType.podcast) {
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
  if (skipNotion) {
    return {
      has_more: false,
      results: [],
    } as unknown as NotionPosts;
  }
  let raw = await notionClient.databases.query({
    database_id: getNotionDbByType(_type),
    page_size: 20, // Adding this so that Algolia is used more
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

export const queryPurrfectStreamByReleased = async (
  page_size?: number,
  start_cursor?: string | null
) => {
  if (skipNotion) {
    return {
      has_more: false,
      results: [],
    } as unknown as NotionPosts;
  }
  let raw = await notionClient.databases.query({
    database_id: config.purrfectStreamsDb,
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

export const queryPurrfectStreamBySlug = async (
  _type: string,
  slug: string,
  preview?: boolean
) => {
  if (skipNotion) {
    return {
      has_more: false,
      results: [],
    } as unknown as NotionPosts;
  }
  let filter: any;
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
      ],
    };
  }

  let raw = await notionClient.databases.query({
    database_id: config.purrfectStreamsDb,
    filter,
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

export const getPurrfectStreamPageBlocks = async ({
  _type,
  slug,
  preview,
}: {
  _type: PostType;
  slug: string;
  preview: boolean | undefined;
}) => {
  let raw = await queryPurrfectStreamBySlug(_type, slug, preview);
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

  let guestBlocks: NotionBlock[] = [];
  let blocks: NotionBlock[] = [];
  let pickBlocks: NotionBlock[] = [];

  // Build the markdown for page
  for (const guest of purrfectGuests.results) {
    const b = await getBlocks(guest.id);
    guestBlocks = [...guestBlocks, ...b];
  }
  for (const page of raw.results) {
    blocks = [...blocks, ...(await getChildBlocks(await getBlocks(page.id)))];
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
  if (picks.length > 0) {
    pickBlocks = [
      formatBlock({ type: 'heading_2', content: 'Purrfect Picks' }),
    ];
    picks.map((p) => {
      pickBlocks = [
        ...pickBlocks,
        formatBlock({ type: 'heading_3', content: p?.name || 'Guest' }),
      ];
      p.picks.map((pick) => {
        pickBlocks = [
          ...pickBlocks,
          formatBlock({
            type: 'bulleted_list_item',
            content: pick?.name,
            link: pick?.url,
          }),
        ];
      });
    });
  }

  return {
    ...raw.results[0],
    guestBlocks,
    blocks,
    pickBlocks,
  };
};

const formatBlock = ({
  type,
  content,
  link,
}: {
  type: string;
  content: string;
  link?: string;
}): NotionBlock => {
  var id = Math.floor(Math.random() * 16777215).toString(16);

  return {
    object: 'block',
    id,
    created_time: '2022-02-14T12:44:00.000Z',
    last_edited_time: '2022-02-14T12:44:00.000Z',
    has_children: false,
    type,
    [type]: {
      rich_text: [
        {
          type: 'text',
          text: {
            content,
            link: link
              ? {
                  url: link,
                }
              : null,
          },
          annotations: {
            bold: false,
            italic: false,
            strikethrough: false,
            underline: false,
            code: false,
            color: false,
          },
          plain_text: content,
          href: link || null,
        },
      ],
      color: 'default',
    },
  };
};

export const queryPurrfectPicksByStreamId = async (streamId: string) => {
  if (skipNotion) {
    return {
      has_more: false,
      results: [],
    } as unknown as QueryDatabaseResponse;
  }
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
  if (skipNotion) {
    return {
      has_more: false,
      results: [],
    } as unknown as QueryDatabaseResponse;
  }
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

export const getRecent = async ({ preview = false }) => {
  const [course, post, tutorial, podcast] = await Promise.all([
    queryByPublished(PostType.course, 3),
    queryByPublished(PostType.post, 3),
    queryByPublished(PostType.tutorial, 3),
    queryPurrfectStreamByReleased(3),
  ]);
  return {
    course: course.results,
    post: post.results,
    tutorial: tutorial.results,
    podcast: podcast.results,
  };
};

export const getSite = () => {
  return {
    pageLinks: [
      { slug: '/ftc-disclosure', title: 'FTC Disclosure' },
      { slug: '/privacy-policy', title: 'Privacy Policy' },
      { slug: '/terms-of-use', title: 'Terms of Use' },
    ],
    socialLinks: [
      {
        href: 'https://www.facebook.com/groups/codingcatdev',
        type: 'facebook',
      },
      {
        href: 'https://github.com/CodingCatDev',
        type: 'github',
      },
      {
        href: 'https://www.linkedin.com/company/codingcatdev/',
        type: 'linkedin',
      },
      {
        href: 'https://medium.com/codingcatdev',
        type: 'medium',
      },
      {
        href: 'https://twitter.com/CodingCatDev',
        type: 'twitter',
      },
      {
        href: 'http://youtube.com/c/codingcatdev',
        type: 'youtube',
      },
    ],
    id: 'none',
    title: 'CodingCatDev',
  } as Site;
};

export const getAuthors = () => [];

export const getBlocks = async (blockId: string) => {
  if (skipNotion) {
    return [] as unknown as NotionBlock[];
  }
  const response = await notionClient.blocks.children.list({
    block_id: blockId,
  });

  return response.results as NotionBlock[];
};

export const getChildBlocks = async (blocks: NotionBlock[]) => {
  // Retrieve block children for nested blocks (one level deep), for example toggle blocks
  // https://developers.notion.com/docs/working-with-page-content#reading-nested-blocks

  let blocksWithChildren: any[] = [];
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
