export interface Site {
  id?: string;
  title?: string;
  pageLinks?: PageLink[];
}

export interface PageLink {
  title: string;
  slug: string;
}
