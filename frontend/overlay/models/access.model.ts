export enum AccessMode {
  open = 'open',
  free = 'free',
  closed = 'closed',
}

export interface AccessSettings {
  accessMode: AccessMode;
  price?: number;
  productId?: string;
}
