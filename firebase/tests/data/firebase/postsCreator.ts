import * as path from 'path';
import * as fs from 'fs';
import { v4 as uuid } from 'uuid';

import {
  Post,
  PostStatus,
  PostVisibility,
} from '../../../../nextjs/src/models/post.model';

export function posts(): [Post] {
  const POSTS: any = [];
  ['posts', 'tutorials', 'podcasts'].forEach((postType) => {
    var posts: [any] = JSON.parse(
      fs.readFileSync(path.join(__dirname, `../posts/${postType}.json`), 'utf8')
    );
    var postsMd = JSON.parse(
      fs.readFileSync(
        path.join(__dirname, `../markdown/${postType}/_${postType}.json`),
        'utf8'
      )
    );

    for (const [key, post] of Object.entries(posts)) {
      let postMd;
      for (const [mdKey, md] of Object.entries(postsMd)) {
        if (key === mdKey) {
          postMd = md;
          break;
        }
      }
      if (postMd == undefined) {
        break;
      }
      const postDoc: Post = {
        id: uuid(),
        publishedAt: post.date,
        createdAt: post.date,
        updatedAt: post.date,
        type:
          post.type === 'post'
            ? 'post'
            : post.type.substring(0, post.type.length - 1),
        title: post.title,
        status: PostStatus.published,
        visibility: PostVisibility.public,
        permalink: post.permalink,
        excerpt: post.excerpt,
        thumbnail: post.thumbnail,
        category: post.category,
        tag: post.tag,
        format: post.post_format,
        content: postMd.content,
        slug: post.basename,
      };
      POSTS.push(postDoc);
    }
  });
  return POSTS;
}
