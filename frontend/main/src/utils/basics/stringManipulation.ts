import { Post, PostType } from '@/models/post.model';

export const toKebabCase = (str: string) => {
  if (!str) {
    return '';
  } else {
    const stringCopy = (' ' + str).slice(1);

    const match = stringCopy.match(
      /[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g
    );
    if (!match) {
      return '';
    }
    return match.map((x) => x.toLowerCase()).join('-');
  }
};

export const pluralize = (post: Post) => {
  return `${post.type === PostType.post ? 'blog' : post.type + 's'}`;
};

export const toTitleCase = (str: string) => {
  return str.replace(/\w\S*/g, function (txt) {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
};
