import { Post } from './post.model';

export interface Course extends Post {
  sections?: Section[];
}

export interface Section {
  title: string;
  lessons?: SectionLesson[];
}

export interface SectionLesson {
  title: string;
  id: string;
}
