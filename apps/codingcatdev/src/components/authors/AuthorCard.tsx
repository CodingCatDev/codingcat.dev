import Image from 'next/image';
import { Author } from '@/models/user.model';
import { renderBlocks } from '@/components/notion-custom-blocks/RenderBlocks';

export default function AuthorCard({
  author,
}: {
  author: Author;
}): JSX.Element {
  return (
    <>
      {author?.displayName && author?.photoURL ? (
        <Image
          src={author.photoURL.public_id}
          width="96"
          height="96"
          alt={author.displayName}
          className="w-24 rounded-full"
        />
      ) : (
        <Image
          className="w-24 rounded-full"
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
        {author?.blocks && renderBlocks(author?.blocks)}
      </>
    </>
  );
}
