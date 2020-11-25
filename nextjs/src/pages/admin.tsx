import Head from "next/head";
import dynamic from "next/dynamic";

const AmplifyLogin = dynamic(
  () => import("../components/amplify/AmplifyLogin"),
  {
    ssr: false,
    loading: () => <p>Catching the Login...</p>,
  }
);

export default function Admin() {
  return (
    <div>
      <Head>
        <title>Admin | CodingCatDev</title>
        <meta name="robots" content="noindex" />
      </Head>

      <main>
        <AmplifyLogin />
      </main>

      <footer></footer>
    </div>
  );
}
