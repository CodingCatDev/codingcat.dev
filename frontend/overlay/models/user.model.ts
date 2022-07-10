import { NotionBlock } from '@9gustin/react-notion-render';
import { UserInfo } from 'firebase/auth';
import { Cloudinary } from './cloudinary.model';
import { SocialLink } from './site.model';

export interface UserInfoExtended extends UserInfo {
  memberships?: UserMembership[];
  token?: string;
  basicInfo?: BasicUserInfo;
  roles?: Roles[];
}

export interface Author {
  _id: string;
  id: string;
  blocks?: NotionBlock[];
  basicInfo?: BasicUserInfo;
  displayName: string;
  photoURL?: Cloudinary;
  slug: string;
}

export interface UserMembership {
  membership: boolean;
  membershipType: MembershipType;
  subscriptionId: string;
}

export enum MembershipType {
  admin = 'admin',
  editor = 'editor',
  author = 'author',
}

export enum Roles {
  supporter = 'supporter',
  monthly = 'monthly',
  yearly = 'yearly',
}

export interface BasicUserInfo {
  location?: string;
  about?: string;
  website?: string;

  socialLinks?: SocialLink[];
}

export enum AuthIssue {
  mustsignin = 'mustsignin',
  unauthorized = 'unauthorized',
}
