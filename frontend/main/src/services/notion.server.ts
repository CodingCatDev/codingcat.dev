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
    default:
      return notionConfig.pagesDb;
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
  return {} as Post[];
};

export const getAuthorBySlugService = ({
  preview,
  slug,
}: {
  preview?: boolean;
  slug: string;
}) => {
  return {} as Author;
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
      return {
        ...q,
        title: `${q?.properties?.title?.title
          .map((t: any) => t.plain_text)
          .join('')}`,
        coverPhoto: {
          public_id: q?.properties?.cover?.url
            ? q?.properties?.cover.url.split('upload/').at(1)
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
          // const lessonsRaw = await queryRelationById(
          //   s.id,
          //   'sections',
          //   config.lessonsDb
          // );
          // const lessons = [];
          // for (const l of lessonsRaw.results as any) {
          //   lessons.push({
          //     ...l,
          //     title: `${l?.properties?.title?.title
          //       .map((t: any) => t.plain_text)
          //       .join('')}`,
          //     _id: l.id,
          //     slug: l?.properties?.slug?.url ? l?.properties?.slug.url : null,
          //     accessSettings: l?.accessSettings ? l.accessSettings : null,
          //   });
          // }
          const lesson = {
            title: `${s?.properties?.lesson_title?.rollup?.array
              ?.at(0)
              ?.title.map((t: any) => t.plain_text)
              .join('')}`,
            _id: s.id,
            slug: s?.properties?.lesson_slug?.rollup?.array?.at(0)?.url
              ? s?.properties?.lesson_slug.rollup?.array?.at(0)?.url
              : null,
            accessSettings: s?.lesson_accessSettings?.rollup?.array?.at(0)
              ?.accessSettings
              ? s?.lesson_accessSettings?.rollup?.array?.at(0)?.accessSettings
              : null,
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
  return post;
};

export const queryByPublished = async (
  _type: string,
  page_size?: number,
  start_cursor?: string | null
) => {
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
    sorts: [
      {
        property: 'start',
        direction: 'descending',
      },
    ],
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
  database_id: string
) => {
  let raw = await notionClient.databases.query({
    database_id,
    filter: {
      property: relation,
      relation: {
        contains: id,
      },
    },
  });
  return raw;
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
