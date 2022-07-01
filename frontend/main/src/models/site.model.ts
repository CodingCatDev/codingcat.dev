export interface Site {
  id: string;
  title?: string;
  pageLinks?: PageLink[];
  socialLinks?: SocialLink[];
}

export interface PageLink {
  title: string;
  slug: string;
}
export interface SocialLink {
  type: SocialType;
  href: string;
}

export enum SocialType {
  mail = 'Mail',
  facebook = 'Facebook',
  github = 'GitHub',
  linkedin = 'LinkedIn',
  medium = 'Medium',
  twitter = 'Twitter',
  youtube = 'Youtube',
  mastodon = 'Mastodon',
  twitch = 'Twitch',
  instagram = 'Instagram',
  dribbble = 'Dribbble',
  stackoverflow = 'Stack Overflow',
  gitlab = 'GitLab',
  behance = 'Behance',
}
