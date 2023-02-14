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
  mail = 'mail',
  facebook = 'facebook',
  github = 'github',
  linkedin = 'linkedin',
  medium = 'medium',
  twitter = 'twitter',
  youtube = 'youtube',
  mastodon = 'mastodon',
  twitch = 'twitch',
  instagram = 'instagram',
  dribbble = 'dribbble',
  stackoverflow = 'stackoverflow',
  gitlab = 'gitlab',
  behance = 'behance',
  discord = 'discord',
}
