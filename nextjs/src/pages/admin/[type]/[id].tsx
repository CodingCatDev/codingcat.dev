import Head from "next/head";
import dynamic from "next/dynamic";
import { withRouter } from "next/router";

import AdminMenu from "../../../components/Admin/AdminMenu";
import AdminTopBar from "../../../components/Admin/AdminTopBar";

const EditPosts = dynamic(() => import("../../../components/Admin/EditPosts"), {
  ssr: false,
  loading: () => <p>Climbing a tree...</p>,
});

function AdminDashboard({ router }) {
  const path = `/${router.asPath.substring(
    router.asPath.lastIndexOf("/") + 1
  )}`;
  return (
    <div>
      <Head>
        <title>Admin | CodingCatDev</title>
        <meta name="robots" content="noindex" />
      </Head>

      <main className="mt-16">
        <>
          <div className="h-screen flex overflow-hidden bg-gray-100">
            <AdminMenu router={router} />
            <div className="flex flex-col w-0 flex-1 overflow-hidden">
              <AdminTopBar router={router} />
              <main
                className="flex-1 relative overflow-y-auto focus:outline-none"
                tabIndex={0}
              >
                <div className="py-6">blog editor</div>
              </main>
            </div>
          </div>
        </>
      </main>

      <footer></footer>
    </div>
  );
}

export default withRouter(AdminDashboard);
