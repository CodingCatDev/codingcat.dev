export enum AccessMode {
  open = 'open',
  free = 'free',
  buynow = 'buynow',
  recurring = 'recurring',
  closed = 'closed',
}

export interface AccessSettings {
  accessMode: AccessMode;
  price?: number;
  buttonUrl?: string;
}
