export interface WebhookPayload {
  event: string;
  payload: Payload;
  time: string;
}

export interface Payload {
  event_type: EventType;
  event: Event;
  invitee: Invitee;
  questions_and_answers: QuestionsAndAnswer[];
  questions_and_responses: QuestionsAndResponses;
  tracking: Tracking;
  old_event: any;
  old_invitee: any;
  new_event: any;
  new_invitee: any;
}

export interface EventType {
  uuid: string;
  kind: string;
  slug: string;
  name: string;
  duration: number;
  owner: Owner;
}

export interface Owner {
  type: string;
  uuid: string;
}

export interface Event {
  uuid: string;
  assigned_to: string[];
  extended_assigned_to: ExtendedAssignedTo[];
  start_time: string;
  start_time_pretty: string;
  invitee_start_time: string;
  invitee_start_time_pretty: string;
  end_time: string;
  end_time_pretty: string;
  invitee_end_time: string;
  invitee_end_time_pretty: string;
  created_at: string;
  location: string;
  canceled: boolean;
  canceler_name: any;
  cancel_reason: any;
  canceled_at: any;
}

export interface ExtendedAssignedTo {
  name: string;
  email: string;
  primary: boolean;
}

export interface Invitee {
  uuid: string;
  first_name: any;
  last_name: any;
  name: string;
  email: string;
  text_reminder_number: any;
  timezone: string;
  created_at: string;
  is_reschedule: boolean;
  payments: any[];
  canceled: boolean;
  canceler_name: any;
  cancel_reason: any;
  canceled_at: any;
}

export interface QuestionsAndAnswer {
  question: string;
  answer: string;
}

export interface QuestionsAndResponses {
  '1_question': string;
  '1_response': string;
}

export interface Tracking {
  utm_campaign: any;
  utm_source: any;
  utm_medium: any;
  utm_content: any;
  utm_term: any;
  salesforce_uuid: any;
}
