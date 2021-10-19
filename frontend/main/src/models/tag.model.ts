import { Timestamp } from 'firebase/firestore';

export interface Tag {
  count: number;
  posts: string[];
  slug: string;
  tag: string;
  updatedAt?: Timestamp;
}
