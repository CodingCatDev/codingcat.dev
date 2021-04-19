import { UserInfoExtended } from '@/models/user.model';
import Link from 'next/link';
import AuthorCard from './AuthorCard';

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
          <Link href={`/authors/${author.uid}`} key={i}>
            <a>
              <AuthorCard author={author} />
            </a>
          </Link>
        ))}
      </section>
    </section>
  );
}
