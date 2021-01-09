import firebase from 'firebase/app';

export interface UserInfoExtended extends firebase.UserInfo {
  memberships?: UserMembership[];
}

export interface UserMembership {
  membership?: boolean;
  membershipType?: MembershipType;
}

export enum MembershipType {
  supporter = 'supporter',
  monthly = 'monthly',
  yearly = 'yearly',
}
