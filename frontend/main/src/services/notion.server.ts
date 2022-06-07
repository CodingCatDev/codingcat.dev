import { AccessMode } from './../models/access.model';
import { Author } from '@/models/user.model';
import { Client } from '@notionhq/client';
import { config } from '@/config/notion';
import { Post, PostType } from '@/models/post.model';
import { QueryDatabaseResponse } from '@notionhq/client/build/src/api-endpoints';
import { NotionToMarkdown } from 'notion-to-md';
import { config as notionConfig } from '@/config/notion';
import { Site } from '@/models/site.model';
import { Tag } from '@/models/tag.model';

// Initializing a client
const notionClient = new Client({
  auth: config.token,
});
const n2m = new NotionToMarkdown({ notionClient });

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
    default:
      return notionConfig.authorsDb;
  }
};

// CodingCat.dev

//TODO: Finish theses
export const getPostById = ({
  preview,
  _id,
}: {
  preview: true;
  _id: string;
}) => {
  return {} as Post;
};

export const getPostsByUser = ({
  type,
  _id,
}: {
  type: PostType;
  _id: string;
}) => {
  return [{}] as Post[];
};

export const getAuthorBySlugService = async ({
  preview,
  slug,
}: {
  preview?: boolean;
  slug: string;
}) => {
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
      ],
    },
  });

  return formatPost(raw, 'author');
};

export const getAuthorPageMarkdown = async (slug: string) => {
  let raw = await getAuthorBySlugService({ slug });
  if (!raw.results.length) {
    return null;
  }

  const page = raw.results.at(0);
  if (!page) {
    return null;
  }
  let content = '';

  for (const page of raw.results) {
    const blocks = await n2m.pageToMarkdown(page.id);
    content += n2m.toMarkdownString(blocks);
  }

  return {
    ...raw.results[0],
    content,
  } as unknown as Author;
};

export const getTagBySlugService = ({
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

const formatPost = async (raw: QueryDatabaseResponse, _type: string) => {
  let post = {
    ...raw,
    results: raw.results.map((q: any) => {
      //Flat authors
      const authors = [];

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
      return {
        ...q,
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
        coverPhoto:
          _type == PostType.podcast
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
          : AccessMode.closed,
      };
    }),
  } as unknown as NotionPosts;

  // Get sections and lessons for course
  if (_type == PostType.course) {
    const results = await Promise.all(
      post.results.map(async (q) => {
        const sectionsRaw = await querySectionsWithOrder(q.id);
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
              : q.access_mode,
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
        return {
          ...q,
          sections,
        };
      })
    );
    post = {
      ...post,
      results,
    };
  }
  if (_type == 'author') {
    post = {
      ...post,
      results: raw.results.map((q: any) => {
        return {
          ...q,
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
      }),
    };
  }

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

  if (_type == 'author') {
    sorts = [
      {
        property: 'title',
        direction: 'ascending',
      },
    ];
  }

  let raw = await notionClient.databases.query({
    database_id: getNotionDbByType(_type),
    start_cursor: start_cursor ? start_cursor : undefined,
    page_size,
    filter: {
      and: [
        {
          property: 'published',
          select: {
            equals: 'published',
          },
        },
      ],
    },
    sorts,
  });
  return await formatPost(raw, _type);
};

export const queryNotionDbBySlug = async (_type: string, slug: string) => {
  let raw = await notionClient.databases.query({
    database_id: getNotionDbByType(_type),
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
      ],
    },
  });
  return await formatPost(raw, _type);
};

export const getNotionPageMarkdown = async (_type: PostType, slug: string) => {
  let raw = await queryNotionDbBySlug(_type, slug);
  if (!raw.results.length) {
    return null;
  }

  //Get purrfect picks
  const page = raw.results.at(0);
  if (!page) {
    return null;
  }
  let content = '';

  for (const page of raw.results) {
    const blocks = await n2m.pageToMarkdown(page.id);
    content += n2m.toMarkdownString(blocks);
  }

  return {
    ...raw.results[0],
    content,
  };
};

export const querySectionsWithOrder = async (id: string) => {
  let raw = await notionClient.databases.query({
    database_id: config.sectionsDb,
    filter: {
      property: 'courses',
      relation: {
        contains: id,
      },
    },
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
  let raw = await notionClient.databases.query({
    database_id: getNotionDbByType(_type),
    filter: {
      property: relation,
      relation: {
        contains: id,
      },
    },
    sorts: [
      {
        property: 'start',
        direction: 'descending',
      },
    ],
  });
  return await formatPost(raw, _type);
};

// Purrfect.dev

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
  return await formatPost(raw, 'podcast');
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
  return await formatPost(raw, 'podcast');
};

export const getPurrfectStreamPageMarkdown = async (slug: string) => {
  let raw = await queryPurrfectStreamBySlug(slug);
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
      { slug: 'ftc-disclosure', title: 'FTC Disclosure' },
      { slug: 'privacy-policy', title: 'Privacy Policy' },
      { slug: 'terms-of-use', title: 'Terms of Use' },
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
