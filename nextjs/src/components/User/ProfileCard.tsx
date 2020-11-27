import Link from "next/link";

import { useUser } from "../../utils/auth/useUser";

export default function UserSignin() {
  const { user, logout }: { user: any; logout: any } = useUser();

  if (!user) {
    return (
      <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
        <p>You must be signed in to access this page.</p>

        <Link href="/signin">
          <a
            type="button"
            className="relative inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-ccd-secondary-500 hover:bg-ccd-secondary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-ccd-primary-800 focus:ring-ccd-secondary-500"
          >
            <span>Signin</span>
          </a>
        </Link>
      </div>
    );
  }
  return (
    <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
      <p>You're signed in. Email: {user.email}</p>
      <button
        onClick={() => logout()}
        type="button"
        className="relative inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-ccd-primary-500 hover:bg-ccd-primary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-ccd-primary-800 focus:ring-ccd-primary-500"
      >
        <span>Sign Out</span>
      </button>
    </div>
  );
}
