export default function resolveProductionUrl(document) {
  return `https://my-site.com/posts/${document.slug.current}`;
}
