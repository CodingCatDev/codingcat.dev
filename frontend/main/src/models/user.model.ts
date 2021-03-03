import firebase from 'firebase/app';
import { SocialLink } from './site.model';

export interface UserInfoExtended extends firebase.UserInfo {
  memberships?: UserMembership[];
  token?: string;
  basicInfo?: BasicUserInfo;
}

export interface UserMembership {
  membership: boolean;
  membershipType: MembershipType;
  subscriptionId: string;
}

export enum MembershipType {
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
