import { Timestamp } from 'firebase/firestore';

export interface Tag {
  _id: string;
  courses_count: number;
  tutorials_count: number;
  podcasts_count: number;
  posts_count: number;
  slug: string;
  title: string;
  updatedAt?: Timestamp;
}
