import { AccessSettings } from './access.model';
import { Certificate } from './certificate.model';
import { Post } from './post.model';
import { UserInfoExtended } from './user.model';

export interface Group extends Post {
  groupMaterial?: string;
  groupCertificate?: Certificate[];
  groupContentVisibility?: GroupContentVisibility;

  // Payment Fields
  accessSettings?: AccessSettings;

  groupPosts?: Post[];
  groupUsers?: UserInfoExtended[];
}

export enum GroupContentVisibility {
  visible = 'visible',
  enrolled = 'enrolled',
}
