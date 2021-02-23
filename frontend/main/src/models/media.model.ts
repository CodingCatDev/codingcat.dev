export interface Media {
  id: string;
  type: MediaType;
  cloudinary?: Cloudinary;
  video?: any;
}

export interface Cloudinary {
  id?: string;
  batchId?: string;
  asset_id?: string;
  public_id?: string;
  version?: number;
  version_id?: string;
  signature?: string;
  width?: number;
  height?: number;
  format?: string;
  resource_type?: string;
  created_at?: Date;
  tags?: any[];
  bytes?: number;
  type?: string;
  etag?: string;
  placeholder?: boolean;
  url?: string;
  secure_url?: string;
  access_mode?: string;
  original_filename?: string;
  eager?: Eager[];
  path?: string;
  thumbnail_url?: string;
}

export interface Eager {
  transformation?: string;
  width?: number;
  height?: number;
  bytes?: number;
  format?: string;
  url?: string;
  secure_url?: string;
}

export enum MediaSource {
  video = 'video',
  cloudinary = 'cloudinary',
}
export enum MediaType {
  photo = 'photo',
  video = 'video',
}
