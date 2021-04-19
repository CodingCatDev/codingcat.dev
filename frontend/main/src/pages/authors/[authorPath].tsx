import http from 'http';
import cookie from 'cookie';

import { useRouter } from 'next/router';
import { getSite, getAuthorProfile } from '@/services/serversideApi';
import { NextSeo } from 'next-seo';
import Layout from '@/layout/Layout';
import { Site } from '@/models/site.model';
import { UserInfoExtended } from '@/models/user.model';

export default function Post({
  site,
  author,
}: {
  site: Site | null;
  author: UserInfoExtended;
}): JSX.Element {
  const router = useRouter();
  return (
    <Layout site={site}>
      <NextSeo
        title={`${author.displayName ? author.displayName : ''} | CodingCatDev`}
        canonical={`https://codingcat.dev/authors/`}
      ></NextSeo>
      <section className="grid grid-cols-1 gap-20 p-4 sm:p-10 place-items-center">
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
            <h3 className="font-sans text-3xl lg:text-4xl">
              {author.displayName}
            </h3>
            <p className="text-base lg:text-lg">{author.basicInfo?.about}</p>
          </>
        </article>
      </section>
    </Layout>
  );
}

export async function getServerSideProps({
  params,
  req,
}: {
  params: { authorPath: string };
  req: http.IncomingMessage;
}): Promise<
  | {
      props: {
        site: Site | null;
        author: UserInfoExtended | null;
      };
    }
  | { redirect: { destination: string; permanent: boolean } }
  | { notFound: boolean }
> {
  const { authorPath } = params;

  if (!authorPath) {
    return {
      notFound: true,
    };
  }
  const site = await getSite();
  const author = (await getAuthorProfile(authorPath)) as UserInfoExtended;

  if (!author) {
    console.log('Author not found');
    return {
      notFound: true,
    };
  }

  return {
    props: {
      site,
      author,
    },
  };
}
