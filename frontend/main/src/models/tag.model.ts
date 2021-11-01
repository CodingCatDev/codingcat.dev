import { Timestamp } from 'firebase/firestore';

export interface Tag {
  _id: string;
  count: number;
  posts: string[];
  slug: string;
  title: string;
  updatedAt?: Timestamp;
}
