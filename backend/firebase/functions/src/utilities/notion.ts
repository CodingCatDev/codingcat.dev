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
