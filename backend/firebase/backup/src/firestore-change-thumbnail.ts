import backup from '../data/firestore-backup.json';
import fs from 'fs';
import path from 'path';
const dirPath = path.join(__dirname, '../data/firestore-backup-new.json');

for (const [key, value] of Object.entries(backup.posts)) {
  const post: any = value;
  if (post?.thumbnail) {
    console.log(post.thumbnail);
    let thumbnail: string = post.thumbnail;
    const split = thumbnail.split('/');
    const version = split[1];
    const folder = split[2];
    const id = split[3];
    const fileType = `${thumbnail.substr(thumbnail.length - 4, 4)}`;

    const path = `${version}/${folder}/${id}${fileType}`;
    const public_id = `${folder}/${id}`;
    const source = 'cloudinary';
    const thumbnail_url = `https://media.codingcat.dev/image/upload/c_limit,h_60,w_90/${path}`;
    const type = 'photo';
    const url = `https://media.codingcat.dev/image/upload/${path}`;

    post.coverPhoto = {
      path,
      public_id,
      source,
      thumbnail_url,
      type,
      url,
    };
    console.log(post.coverPhoto);
  }
  delete post.thumbnail;
  // @ts-ignore
  backup.posts[key] = post;
}

fs.writeFileSync(dirPath, JSON.stringify(backup));
