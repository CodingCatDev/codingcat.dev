import Link from "next/link";

import { useUser } from "../utils/auth/useUser";

export default function Admin() {
  const { user, logout }: { user: any; logout: any } = useUser();

  if (!user) {
    return (
      <>
        <p>Hi there!</p>
        <p>
          You are not signed in.{" "}
          <Link href={"/signin"}>
            <a>Sign in</a>
          </Link>
        </p>
      </>
    );
  }
  return (
    <>
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
          </div>
        </div>
      </div>
    </>
  );
}
