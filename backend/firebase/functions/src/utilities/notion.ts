import { Client } from '@notionhq/client';
import { UpdatePageParameters } from '@notionhq/client/build/src/api-endpoints';
import {
  notionToken,
  notionPurrfectDatabaseId,
  notionPurrfectGuestDatabaseId,
  notionPurrfectCompanyDatabaseId,
} from '../config/config';

// Initializing a client
const notionClient = new Client({
  auth: notionToken,
});

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
      text: {
        equals: calendarid,
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
      text: {
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
      Company: {
        type: 'relation',
        relation: getCompanytRelations(companyIds),
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
      url: `https://twitter.com/${twitterHandle}`,
    };
  }

  return notionClient.pages.create(page);
};

export const queryPurrfectCompany = (name: string) => {
  return notionClient.databases.query({
    database_id: notionPurrfectCompanyDatabaseId,
    filter: {
      property: 'title',
      text: {
        contains: name,
      },
    },
  });
};

export const createPurrfectCompany = ({ name }: { name: string }) => {
  const page = {
    parent: {
      database_id: notionPurrfectCompanyDatabaseId,
    },
    properties: {
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
  };

  return notionClient.pages.create(page);
};

export const blockAppendPurrfectPageWithTemplateData = ({
  guestName,
  coverUrl,
  pageId,
}: {
  guestName: string;
  coverUrl: string;
  pageId: string;
}) => {
  return notionClient.blocks.children.append({
    block_id: pageId,
    children: [
      {
        object: 'block',
        type: 'image',
        image: {
          caption: [],
          type: 'external',
          external: {
            url: `${coverUrl}.png`,
          },
        },
      },
      {
        object: 'block',
        type: 'paragraph',
        paragraph: {
          text: [],
        },
      },
      {
        object: 'block',

        type: 'heading_2',
        heading_2: {
          text: [
            {
              type: 'text',
              text: {
                content: 'Join',
                link: null,
              },
              annotations: {
                bold: false,
                italic: false,
                strikethrough: false,
                underline: false,
                code: false,
                color: 'default',
              },
            },
          ],
        },
      },
      {
        object: 'block',
        type: 'paragraph',
        paragraph: {
          text: [
            {
              type: 'text',
              text: {
                content: 'GO Here on day of podcast -> ',
                link: null,
              },
              annotations: {
                bold: false,
                italic: false,
                strikethrough: false,
                underline: false,
                code: false,
                color: 'default',
              },
            },
          ],
        },
      },
      {
        object: 'block',
        type: 'heading_2',
        heading_2: {
          text: [
            {
              type: 'text',
              text: {
                content: guestName,
                link: null,
              },
              annotations: {
                bold: false,
                italic: false,
                strikethrough: false,
                underline: false,
                code: false,
                color: 'yellow',
              },
            },
          ],
        },
      },
      {
        object: 'block',
        type: 'heading_3',
        heading_3: {
          text: [
            {
              type: 'text',
              text: {
                content: 'Links',
                link: null,
              },
              annotations: {
                bold: false,
                italic: false,
                strikethrough: false,
                underline: false,
                code: false,
                color: 'default',
              },
            },
          ],
        },
      },
      {
        object: 'block',
        type: 'heading_3',
        heading_3: {
          text: [
            {
              type: 'text',
              text: {
                content: 'Profile',
                link: null,
              },
              annotations: {
                bold: false,
                italic: false,
                strikethrough: false,
                underline: false,
                code: false,
                color: 'default',
              },
            },
          ],
        },
      },
      {
        object: 'block',
        type: 'paragraph',
        paragraph: {
          text: [],
        },
      },
      {
        object: 'block',

        type: 'heading_2',
        heading_2: {
          text: [
            {
              type: 'text',
              text: {
                content: 'Questions',
                link: null,
              },
              annotations: {
                bold: false,
                italic: false,
                strikethrough: false,
                underline: false,
                code: false,
                color: 'yellow',
              },
            },
          ],
        },
      },
      {
        object: 'block',

        type: 'numbered_list_item',
        numbered_list_item: {
          text: [
            {
              type: 'text',
              text: {
                content: 'First Question?',
                link: null,
              },
              annotations: {
                bold: true,
                italic: false,
                strikethrough: false,
                underline: false,
                code: false,
                color: 'default',
              },
            },
          ],
        },
      },
      {
        object: 'block',

        type: 'numbered_list_item',
        numbered_list_item: {
          text: [
            {
              type: 'text',
              text: {
                content: 'Second Question?',
                link: null,
              },
              annotations: {
                bold: true,
                italic: false,
                strikethrough: false,
                underline: false,
                code: false,
                color: 'default',
              },
            },
          ],
        },
      },
      {
        object: 'block',
        type: 'heading_2',
        heading_2: {
          text: [
            {
              type: 'text',
              text: {
                content: 'Purrfect Picks',
                link: null,
              },
              annotations: {
                bold: false,
                italic: false,
                strikethrough: false,
                underline: false,
                code: false,
                color: 'pink',
              },
            },
          ],
        },
      },
      {
        object: 'block',

        type: 'paragraph',
        paragraph: {
          text: [
            {
              type: 'text',
              text: {
                content:
                  'These are fun picks of the week. Maybe something you bought online, a great show you are currently watching, or that last book that you thought was amazing.',
                link: null,
              },
              annotations: {
                bold: false,
                italic: false,
                strikethrough: false,
                underline: false,
                code: false,
                color: 'default',
              },
            },
          ],
        },
      },
      {
        object: 'block',
        type: 'heading_3',
        heading_3: {
          text: [
            {
              type: 'text',
              text: {
                content: guestName,
                link: null,
              },
              annotations: {
                bold: false,
                italic: false,
                strikethrough: false,
                underline: false,
                code: false,
                color: 'yellow',
              },
            },
          ],
        },
      },
      {
        object: 'block',

        type: 'heading_3',
        heading_3: {
          text: [
            {
              type: 'text',
              text: {
                content: 'Brittney Postma',
                link: null,
              },
              annotations: {
                bold: false,
                italic: false,
                strikethrough: false,
                underline: false,
                code: false,
                color: 'default',
              },
            },
          ],
        },
      },
      {
        object: 'block',

        type: 'heading_3',
        heading_3: {
          text: [
            {
              type: 'text',
              text: {
                content: 'Alex Patterson',
                link: null,
              },
              annotations: {
                bold: false,
                italic: false,
                strikethrough: false,
                underline: false,
                code: false,
                color: 'default',
              },
            },
          ],
        },
      },
      {
        object: 'block',

        type: 'paragraph',
        paragraph: {
          text: [],
        },
      },
      {
        object: 'block',

        type: 'divider',
        divider: {},
      },
      {
        object: 'block',

        type: 'heading_2',
        heading_2: {
          text: [
            {
              type: 'text',
              text: {
                content: 'Details',
                link: null,
              },
              annotations: {
                bold: false,
                italic: false,
                strikethrough: false,
                underline: false,
                code: false,
                color: 'default',
              },
            },
          ],
        },
      },
      {
        object: 'block',

        type: 'heading_2',
        heading_2: {
          text: [
            {
              type: 'text',
              text: {
                content: 'Sponsorship',
                link: null,
              },
              annotations: {
                bold: false,
                italic: false,
                strikethrough: false,
                underline: false,
                code: false,
                color: 'pink',
              },
            },
          ],
        },
      },
      {
        object: 'block',

        type: 'paragraph',
        paragraph: {
          text: [
            {
              type: 'text',
              text: {
                content:
                  'We are always looking for our next sponsor. If this is something that you are interested in please review our ',
                link: null,
              },
              annotations: {
                bold: false,
                italic: false,
                strikethrough: false,
                underline: false,
                code: false,
                color: 'default',
              },
            },
            {
              type: 'text',
              text: {
                content: 'sponsorship packet.',
                link: {
                  url: 'https://codingcat.dev/sponsorship',
                },
              },
              annotations: {
                bold: false,
                italic: false,
                strikethrough: false,
                underline: false,
                code: false,
                color: 'pink',
              },
            },
          ],
        },
      },
      {
        object: 'block',

        type: 'heading_3',
        heading_3: {
          text: [
            {
              type: 'text',
              text: {
                content: 'Code of Conduct',
                link: null,
              },
              annotations: {
                bold: false,
                italic: false,
                strikethrough: false,
                underline: false,
                code: false,
                color: 'default',
              },
            },
          ],
        },
      },
      {
        object: 'block',

        type: 'paragraph',
        paragraph: {
          text: [
            {
              type: 'text',
              text: {
                content:
                  'Please no swearing or drinking we think of our 10 year olds watching :D. Things will happen I slipped up the other day. I try to edit out anything that isn’t live.',
                link: null,
              },
              annotations: {
                bold: false,
                italic: false,
                strikethrough: false,
                underline: false,
                code: false,
                color: 'default',
              },
            },
          ],
        },
      },
      {
        object: 'block',

        type: 'heading_3',
        heading_3: {
          text: [
            {
              type: 'text',
              text: {
                content: 'How do I connect for the recording?',
                link: null,
              },
              annotations: {
                bold: false,
                italic: false,
                strikethrough: false,
                underline: false,
                code: false,
                color: 'default',
              },
            },
          ],
        },
      },
      {
        object: 'block',

        type: 'paragraph',
        paragraph: {
          text: [
            {
              type: 'text',
              text: {
                content: 'Instructions: ',
                link: null,
              },
              annotations: {
                bold: false,
                italic: false,
                strikethrough: false,
                underline: false,
                code: false,
                color: 'default',
              },
            },
            {
              type: 'text',
              text: {
                content:
                  'https://streamyard.com/resources/docs/guest-instructions/index.html',
                link: {
                  url:
                    'https://streamyard.com/resources/docs/guest-instructions/index.html',
                },
              },
              annotations: {
                bold: false,
                italic: false,
                strikethrough: false,
                underline: false,
                code: false,
                color: 'default',
              },
            },
          ],
        },
      },
      {
        object: 'block',

        type: 'heading_3',
        heading_3: {
          text: [
            {
              type: 'text',
              text: {
                content: 'What we do with the recording',
                link: null,
              },
              annotations: {
                bold: false,
                italic: false,
                strikethrough: false,
                underline: false,
                code: false,
                color: 'default',
              },
            },
          ],
        },
      },
      {
        object: 'block',

        type: 'paragraph',
        paragraph: {
          text: [
            {
              type: 'text',
              text: {
                content:
                  'We record using a streaming service that pushes an unlisted live-stream to YouTube. We then download the video and separate the audio. We then publish to two places',
                link: null,
              },
              annotations: {
                bold: false,
                italic: false,
                strikethrough: false,
                underline: false,
                code: false,
                color: 'default',
              },
            },
          ],
        },
      },
      {
        object: 'block',

        type: 'paragraph',
        paragraph: {
          text: [
            {
              type: 'text',
              text: {
                content: 'YouTube: ',
                link: null,
              },
              annotations: {
                bold: false,
                italic: false,
                strikethrough: false,
                underline: false,
                code: false,
                color: 'default',
              },
            },
            {
              type: 'text',
              text: {
                content: 'https://youtu.be/XWCOknS-d0s',
                link: {
                  url: 'https://youtu.be/XWCOknS-d0s',
                },
              },
              annotations: {
                bold: false,
                italic: false,
                strikethrough: false,
                underline: false,
                code: false,
                color: 'default',
              },
            },
          ],
        },
      },
      {
        object: 'block',
        type: 'paragraph',
        paragraph: {
          text: [
            {
              type: 'text',
              text: {
                content: 'Podcast: ',
                link: null,
              },
              annotations: {
                bold: false,
                italic: false,
                strikethrough: false,
                underline: false,
                code: false,
                color: 'default',
              },
            },
            {
              type: 'text',
              text: {
                content: 'https://codingcat.dev/podcasts/',
                link: {
                  url: 'https://codingcat.dev/podcasts/',
                },
              },
              annotations: {
                bold: false,
                italic: false,
                strikethrough: false,
                underline: false,
                code: false,
                color: 'default',
              },
            },
          ],
        },
      },
      {
        object: 'block',

        type: 'paragraph',
        paragraph: {
          text: [
            {
              type: 'text',
              text: {
                content: 'Twitch: ',
                link: null,
              },
              annotations: {
                bold: false,
                italic: false,
                strikethrough: false,
                underline: false,
                code: false,
                color: 'default',
              },
            },
            {
              type: 'text',
              text: {
                content: 'https://www.twitch.tv/codingcatdev',
                link: {
                  url: 'https://www.twitch.tv/codingcatdev',
                },
              },
              annotations: {
                bold: false,
                italic: false,
                strikethrough: false,
                underline: false,
                code: false,
                color: 'default',
              },
            },
          ],
        },
      },
    ],
  });
};
