import firebase from 'firebase/app';

export interface Tag {
  count: number;
  posts: string[];
  slug: string;
  tag: string;
  updatedAt?: firebase.firestore.Timestamp;
}
