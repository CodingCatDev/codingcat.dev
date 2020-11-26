import Head from "next/head";
import dynamic from "next/dynamic";
import Link from "next/link";

import { useUser } from "../utils/auth/useUser";

const Signin = dynamic(() => import("../components/Signin"), {
  ssr: false,
  loading: () => <p>Catching the Signin...</p>,
});

export default function Admin() {
  const { user, logout }: { user: any; logout: any } = useUser();

  if (!user) {
    return (
      <div>
        <Head>
          <title>Admin | CodingCatDev</title>
          <meta name="robots" content="noindex" />
        </Head>

        <main>
          <Signin />
        </main>

        <footer></footer>
      </div>
    );
  }
  return (
    <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <p>You're signed in. Email: {user.email}</p>
          <p
            style={{
              display: "inline-block",
              color: "blue",
              textDecoration: "underline",
              cursor: "pointer",
            }}
            onClick={() => logout()}
          >
            Log out
          </p>{" "}
          <p>Or you can access these areas</p>
          <Link href="/admin">
            <a>
              <button
                type="button"
                className="relative inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-ccd-primary-500 hover:bg-ccd-primary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-ccd-primary-800 focus:ring-ccd-primary-500"
              >
                <span>Admin</span>
              </button>
            </a>
          </Link>
        </div>
      </div>
    </div>
  );
}
