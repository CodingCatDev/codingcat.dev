export interface Cloudinary {
  id: string;
  batchId: string;
  asset_id: string;
  public_id: string;
  version: number;
  version_id: string;
  signature: string;
  width: number;
  height: number;
  format: string;
  resource_type: string;
  created_at: string;
  tags?: null[] | null;
  bytes: number;
  type: string;
  etag: string;
  placeholder: boolean;
  url: string;
  secure_url: string;
  access_mode: string;
  original_filename: string;
  eager?: EagerEntity[] | null;
  path: string;
  thumbnail_url: string;
}
export interface EagerEntity {
  transformation: string;
  width: number;
  height: number;
  bytes: number;
  format: string;
  url: string;
  secure_url: string;
}
