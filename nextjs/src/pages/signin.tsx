import Head from "next/head";
import dynamic from "next/dynamic";

const UserSignin = dynamic(() => import("../components/UserSignin"), {
  ssr: false,
  loading: () => <p>Scratching the couch...</p>,
});

export default function Signin() {
  return (
    <div>
      <Head>
        <title>Signin | CodingCatDev</title>
        <meta name="robots" content="noindex" />
      </Head>

      <main>
        <UserSignin />
      </main>

      <footer></footer>
    </div>
  );
}
