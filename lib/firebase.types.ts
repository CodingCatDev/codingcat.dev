export interface User {
  idt: Idt;
  settings?: Settings;
  bookmarks?: Location[];
  completed?: Location[];
}

export interface Settings {
  profile?: Profile;
}

export interface Profile {
  name?: string;
  email?: string;
  picture?: string;
  bio?: string;
}

export interface Idt {
  name: string;
  picture: string;
  stripeRole: string;
  iss: string;
  aud: string;
  auth_time: number;
  user_id: string;
  sub: string;
  iat: number;
  exp: number;
  email: string;
  email_verified: boolean;
  firebase: Firebase;
}

export interface Firebase {
  identities: Identities;
  sign_in_provider: string;
}

export interface Identities {
  "google.com": string[];
  email: string[];
}

export interface Location {
  _id: string;
  _type: string;
  slug: string;
}
