import Head from "next/head";
import PostsCards from "../components/PostsCards";

export default function Blog() {
  return (
    <div>
      <Head>
        <title>Admin | CodingCatDev</title>
      </Head>

      <main className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-2 place-items-auto">
        <PostsCards post_type={"post"} />
      </main>

      <footer></footer>
    </div>
  );
}
