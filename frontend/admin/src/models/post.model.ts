import firebase from 'firebase/app';
import { Cloudinary } from './cloudinary.model';

export interface Post {
  //Auto Generated By Cloud Function
  id?: string;
  createdAt?: firebase.firestore.Timestamp;
  updatedAt?: firebase.firestore.Timestamp;
  createdBy?: string;
  updatedBy?: string;

  //Core Fields
  type: PostType;
  title: string;
  titleSearch: string;
  status: PostStatus;
  publishedAt?: firebase.firestore.Timestamp;
  visibility: PostVisibility;
  permalink: string;
  excerpt?: string;
  category?: string[] | null; //If null this will be auto assigned 'Unassigned'
  tag?: string[] | null;
  format?: PostFormat; //If null this will be auto assigned 'standard'
  content?: string;
  slug: string;
  historyId?: string;
  postId?: string;
  coverPhoto?: CoverMedia;
  coverVideo?: CoverMedia;
}

export interface CoverMedia {
  path?: string;
  thumbnail_url?: string;
  public_id?: string;
  mediaId?: string;
  url: string;
  type: MediaType;
  source: MediaSource;
}

export enum MediaSource {
  video = 'video',
  cloudinary = 'cloudinary',
}

export enum PostStatus {
  published = 'published',
  draft = 'draft',
  pendingreview = 'pendingreview',
}

export enum PostVisibility {
  public = 'public',
  private = 'private',
  password = 'password',
}

export enum PostType {
  post = 'post',
  tutorial = 'tutorial',
  podcast = 'podcast',
  course = 'course',
  lesson = 'lesson',
}
export enum PostFormat {
  standard = 'standard',
  video = 'video',
  image = 'image',
  audio = 'audio',
}
export enum MediaType {
  photo = 'photo',
  video = 'video',
}
