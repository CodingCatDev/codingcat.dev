import fetch from 'node-fetch';
import { calendlyAccessToken } from '../config/config';
const calendlyApi = `https://api.calendly.com`;

export const call = async (path: string) => {
  const url = `${calendlyApi}${path}`;
  console.log('Calling', url);

  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${calendlyAccessToken}`,
    },
  });
  if (response.status !== 200) {
    console.log('Error', response.status);
    throw response.status;
  }
  const json = await response.json();
  console.log('RESPONSE:', json);
  return json;
};

export const getEvent = async (uuid: string) => {
  return (await call(`/scheduled_events/${uuid}`)) as CalendlyEventResponse;
};

export const listEventInvitees = async (uuid: string) => {
  return (await call(
    `/scheduled_events/${uuid}/invitees`
  )) as CalendlyInviteeResponse;
};

export interface Location {
  type: string;
  location: string;
}

export interface InviteesCounter {
  total: number;
  active: number;
  limit: number;
}

export interface EventMembership {
  user: string;
}

export interface EventGuest {
  email: string;
  created_at: string;
  updated_at: string;
}

export interface Resource {
  uri: string;
  name: string;
  status: string;
  start_time: string;
  end_time: string;
  event_type: string;
  location: Location;
  invitees_counter: InviteesCounter;
  created_at: string;
  updated_at: string;
  event_memberships: EventMembership[];
  event_guests: EventGuest[];
}

export interface CalendlyEventResponse {
  resource: Resource;
}
export interface QuestionsAndAnswer {
  answer: string;
  position: number;
  question: string;
}

export interface Tracking {
  utm_campaign?: any;
  utm_source?: any;
  utm_medium?: any;
  utm_content?: any;
  utm_term?: any;
  salesforce_uuid?: any;
}

export interface Payment {
  external_id: string;
  provider: string;
  amount: number;
  currency: string;
  terms: string;
  successful: boolean;
}

export interface Collection {
  cancel_url: string;
  created_at: string;
  email: string;
  event: string;
  name: string;
  new_invitee?: any;
  old_invitee?: any;
  questions_and_answers: QuestionsAndAnswer[];
  reschedule_url: string;
  rescheduled: boolean;
  status: string;
  text_reminder_number?: any;
  timezone: string;
  tracking: Tracking;
  updated_at: string;
  uri: string;
  canceled: boolean;
  payment: Payment;
}

export interface Pagination {
  count: number;
  next_page: string;
}

export interface CalendlyInviteeResponse {
  collection: Collection[];
  pagination: Pagination;
}
