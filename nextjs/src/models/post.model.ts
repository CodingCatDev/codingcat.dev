import firebase from 'firebase/app';

export interface Post {
  post_publish_datetime?: string | number | Date;
  //Auto Generated By Cloud Function
  id?: string;
  createdAt?: firebase.firestore.Timestamp;
  updatedAt?: firebase.firestore.Timestamp;
  createdBy?: string;
  updatedBy?: string;

  //Core Fields
  type: PostType;
  title: string;
  status: PostStatus;
  publishedAt?: firebase.firestore.Timestamp;
  visibility: PostVisibility;
  permalink: string;
  excerpt?: string;
  thumbnail?: string;
  category?: string[] | null; //If null this will be auto assigned 'Unassigned'
  tag?: string[] | null;
  format?: PostFormat; //If null this will be auto assigned 'standard'
  content?: string;
  basename: string;
}

export enum PostStatus {
  publish = 'publish',
  draft = 'draft',
  pendingreview = 'pendingreview',
}

export enum PostVisibility {
  public = 'public',
  private = 'private',
  password = 'password',
}

export enum PostType {
  blog = 'blog',
  tutorials = 'tutorials',
  podcasts = 'podcasts',
  courses = 'courses',
  lessons = 'lessons',
}
export enum PostFormat {
  standard = 'standard',
  video = 'video',
  image = 'image',
  audio = 'audio',
}
