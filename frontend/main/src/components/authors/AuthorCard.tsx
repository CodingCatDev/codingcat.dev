import { UserInfoExtended } from '@/models/user.model';

export default function AuthorCard({
  author,
}: {
  author: UserInfoExtended;
}): JSX.Element {
  return (
    <article className="grid items-start max-w-md grid-cols-1 gap-4 p-4 shadow-lg justify-items-center justify-self-center bg-basics-50 text-basics-900 hover:text-basics-900 hover:shadow-sm">
      {author?.displayName && author?.photoURL ? (
        <img
          className="rounded-full"
          src={author.photoURL}
          alt={author.displayName}
        />
      ) : (
        <img
          className="w-24 rounded-full"
          src="/static/images/avatar.png"
          alt="Avatar Image Placeholder"
        />
      )}
      <>
        <h3 className="font-sans text-3xl lg:text-4xl">{author.displayName}</h3>
        <p className="text-base lg:text-lg">{author.basicInfo?.about}</p>
      </>
    </article>
  );
}
