import { Client } from '@notionhq/client';
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

export const createPurrfectPage = ({
  guestIds,
  companyIds,
}: {
  guestIds?: string[];
  companyIds?: string[];
}) => {
  return notionClient.pages.create({
    parent: {
      database_id: notionPurrfectDatabaseId,
    },
    properties: {
      Guest: {
        id: '8Ym~',
        type: 'relation',
        relation: getGuestRelations(guestIds),
      },
      'Recording Date': {
        id: 'br,*',
        type: 'date',
        date: {
          start: '2021-11-07T20:44:18.966Z',
          end: null,
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
  } as any);
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
