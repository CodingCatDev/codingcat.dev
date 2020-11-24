import Head from "next/head";
import PostsCards from "../components/PostsCards";

export default function Tutorials() {
  return (
    <div>
      <Head>
        <title>Tutorials | CodingCatDev</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-2 place-items-auto">
        <PostsCards post_type={"tutorials"} />
      </main>

      <footer></footer>
    </div>
  );
}
