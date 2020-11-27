import dynamic from "next/dynamic";
import Link from "next/link";

import { useUser } from "../utils/auth/useUser";

const FirebaseSignin = dynamic(() => import("../components/FirebaseSignin"), {
  ssr: false,
  loading: () => <p>Playing with yarn...</p>,
});

export default function UserSignin() {
  const { user, logout }: { user: any; logout: any } = useUser();

  if (!user) {
    return (
      <div>
        <main>
          <FirebaseSignin />
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

          <button
            type="button"
            className="relative inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-500 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-red-800 focus:ring-red-500"
            onClick={() => logout()}
          >
            <span>Sign out</span>
          </button>

          <p>Or you can access these areas</p>
          <Link href="/user/profile">
            <a>
              <button
                type="button"
                className="relative inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-ccd-primary-500 hover:bg-ccd-primary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-ccd-primary-800 focus:ring-ccd-primary-500"
              >
                <span>Profile</span>
              </button>
            </a>
          </Link>
        </div>
      </div>
    </div>
  );
}
