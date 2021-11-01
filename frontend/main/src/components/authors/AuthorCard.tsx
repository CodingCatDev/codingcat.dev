import Image from 'next/image';
import { Author } from '@/models/user.model';

export default function AuthorCard({
  author,
}: {
  author: Author;
}): JSX.Element {
  return (
    <article className="grid items-start max-w-md grid-cols-1 gap-4 p-4 shadow-lg justify-items-center justify-self-center bg-basics-50 text-basics-900 hover:text-basics-900 hover:shadow-sm">
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
      </>
    </article>
  );
}
