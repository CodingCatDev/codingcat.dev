import { Cloudinary } from './cloudinary.model';
import { BuilderContent } from '@builder.io/sdk';
import { AccessSettings } from './access.model';

export interface CodingCatBuilderContent extends BuilderContent {
  data: {
    page: Page;
    sections?: Section[];
    accessSettings?: AccessSettings;
    recordingDate?: Date;
    season?: number;
    episode?: number;
    title: string;
    url: string;
  };
}

export interface CodingCatBuilderFramework extends BuilderContent {
  data: {
    slug: string;
  };
}

export interface Page {
  authors?: AuthorRef[];
  coverPhoto: Cloudinary;
  excerpt: string;
  frameworks: any[];
  title: string;
}

export interface AuthorRef {
  _key: string;
  _ref: string;
  _type: string;
  author: Author;
}

export interface Author {
  '@type': string;
  id: string;
  model: string;
  value: AuthorValue;
}

export interface AuthorValue extends BuilderContent {
  data: CodingCatAuthor;
}

export interface CodingCatAuthor {
  displayName: string;
  photoUrl: Cloudinary;
  slug: string;
}

export enum ModelType {
  post = 'post',
  tutorial = 'tutorial',
  podcast = 'podcast',
  course = 'course',
  lesson = 'lesson',
  page = 'page',
  group = 'group',
  forum = 'forum',
  authors = 'authors',
}
export interface Section {
  title: string;
  lessons?: SectionLesson[];
}

export interface SectionLesson {
  url: string;
  title: string;
}
