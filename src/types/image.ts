export type UUID = string;

export interface Image {
  public_id: UUID;
  user_id: UUID;
  title: string;
  description: string;
  format: string;
  version: number;
  created_at: string;
  image_url: string;
}
export interface GalleryImage extends Image {
  url: string;
}
