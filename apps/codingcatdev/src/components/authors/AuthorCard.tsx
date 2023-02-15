import Image from 'next/image';
import { Author } from '@/models/user.model';
import { renderBlocks } from '@/components/notion-custom-blocks/RenderBlocks';

export default function AuthorCard({
  author,
}: {
  author: Author;
}): JSX.Element {
  console.log(author);
  return (
    <>
      {author?.displayName && author?.photoURL ? (
        <Image
          src={author.photoURL.secure_url}
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
