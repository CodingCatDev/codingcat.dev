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
    <>
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
      <section className="grid items-start content-center w-full gap-4 grid-cols-fit">
        {authors.map((author, i) => (
          // <Link href="/authors/author" key={i}>
          //   <a>
          <article
            key={i}
            className="grid items-start max-w-md grid-cols-1 shadow-lg justify-self-center bg-basics-50 text-basics-900 hover:text-basics-900 hover:shadow-md"
          >
            {author?.displayName && author?.photoURL ? (
              <Image
                src={author.photoURL}
                alt={author.displayName}
                width="480"
                height="270"
                layout="responsive"
              />
            ) : (
              <div className="relative" style={{ paddingBottom: '56.25%' }}>
                <div className="absolute flex items-center flex-auto w-full h-full rounded-t-md bg-primary-900 dark:bg-primary-900">
                  <AJPrimary className="w-full h-full p-4" />
                </div>
              </div>
            )}
            <div className="grid grid-cols-1 gap-2 p-4">
              <h3 className="font-sans text-3xl lg:text-4xl">
                {author.displayName}
              </h3>
              <p className="">{author.basicInfo?.about}</p>
            </div>
          </article>
          //   </a>
          // </Link>
        ))}
      </section>
    </>
  );
}
