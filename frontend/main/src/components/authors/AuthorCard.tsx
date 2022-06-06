import Image from 'next/image';
import { Author } from '@/models/user.model';
import { MDXRemote, MDXRemoteSerializeResult } from 'next-mdx-remote';
import { components } from '@/components/code/MDXComponents';

export default function AuthorCard({
  author,
  source,
}: {
  author: Author;
  source?: MDXRemoteSerializeResult | null;
}): JSX.Element {
  return (
    <>
      {author?.displayName && author?.photoURL ? (
        <Image
          src={author.photoURL.public_id}
          layout="fixed"
          width="96"
          height="96"
          alt={author.displayName}
          className="w-24 rounded-full"
        />
      ) : (
        <Image
          className="w-24 rounded-full"
          layout="fixed"
          width="96"
          height="96"
          unoptimized={true}
          loader={() => '/static/images/avatar.png'}
          src="/static/images/avatar.png"
          alt="Avatar Image Placeholder"
        />
      )}
      <>
        <h3 className="font-sans text-3xl lg:text-4xl">{author.displayName}</h3>
        <p className="text-base lg:text-lg">{author?.basicInfo?.about}</p>
        {source && <MDXRemote {...source} components={components} />}
      </>
    </>
  );
}
