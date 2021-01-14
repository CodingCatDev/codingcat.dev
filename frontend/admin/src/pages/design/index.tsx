import Head from 'next/head';
import Link from 'next/link';

export default function Blog({ posts }) {
  return (
    <div>
      <Head>
        <title>Design | CodingCatDev</title>
      </Head>

      <div className="flex-1">
        <Link href="/design/atoms">
          <a>Atoms</a>
        </Link>
      </div>
      <div className="flex-1">
        <Link href="/design/components">
          <a>Components</a>
        </Link>
      </div>

      <footer></footer>
    </div>
  );
}
