import Head from "next/head";
import dynamic from "next/dynamic";

const Login = dynamic(() => import("../components/Login"), {
  ssr: false,
  loading: () => <p>Catching the Login...</p>,
});

export default function Admin() {
  return (
    <div>
      <Head>
        <title>Admin | CodingCatDev</title>
        <meta name="robots" content="noindex" />
      </Head>

      <main>
        <Login />
      </main>

      <footer></footer>
    </div>
  );
}
