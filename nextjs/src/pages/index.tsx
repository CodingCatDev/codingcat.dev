import { useEffect, useState } from "react";
import Head from "next/head";

import RecentPostsCards from "../components/RecentPostsCards";

export default function Home() {
  return (
    <div>
      <Head>
        <title>Create Next App</title>
      </Head>

      <main className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-2 place-items-auto">
        <RecentPostsCards postType={"post"} />
        <RecentPostsCards postType={"tutorials"} />
      </main>

      <footer></footer>
    </div>
  );
}
