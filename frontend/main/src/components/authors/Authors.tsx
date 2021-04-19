import { UserInfoExtended } from '@/models/user.model';
// import Link from 'next/link';
import Image from 'next/image';
import AJPrimary from '@/components/global/icons/AJPrimary';

export default function Authors({
  authors,
}: {
  authors: UserInfoExtended[];
}): JSX.Element {
  return (
    <section className="grid gap-4 justify-items-center">
      <section className="max-w-2xl text-center">
        <h2 className="mb-2 text-4xl lg:text-5xl">Authors & Instructors</h2>
        <h3 className="font-sans text-2xl">
          Our wonderful team of humans who are here to help you become a{' '}
          <span className="font-heading text-secondary-600 dark:text-secondary-600">
            Purrfect
          </span>{' '}
          developer.
        </h3>
      </section>
      <section className="flex flex-wrap items-start justify-center w-full gap-10">
        {authors.map((author, i) => (
          // <Link href="/authors/author" key={i}>
          //   <a>
          <article
            key={i}
            className="grid items-start max-w-md grid-cols-1 gap-4 p-4 shadow-lg justify-items-center justify-self-center bg-basics-50 text-basics-900 hover:text-basics-900 hover:shadow-sm"
          >
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
              <h3 className="font-sans text-3xl lg:text-4xl">
                {author.displayName}
              </h3>
              <p className="text-base lg:text-lg">{author.basicInfo?.about}</p>
            </>
          </article>
          //   </a>
          // </Link>
        ))}
      </section>
    </section>
  );
}
