import firebase from 'firebase/app';

export interface UserInfoExtended extends firebase.UserInfo {
  memberships?: UserMembership[];
  token?: string;
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
