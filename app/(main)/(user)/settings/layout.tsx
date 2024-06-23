import Link from "next/link";
import { FaUserGear } from "react-icons/fa6";
import UserNav from "../user-nav";
import { Suspense } from "react";

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const paths = [
    "/settings/profile",
    "/settings/account",
    "/settings/appearance",
    "/settings/notifications",
    "/settings/display",
  ];
  return (
    <div className="grid h-full w-full lg:grid-cols-[280px_1fr]">
      <div className="hidden border-r bg-gray-100/40 lg:block dark:bg-gray-800/40">
        <div className="flex h-full max-h-screen flex-col gap-2">
          <div className="flex h-[60px] items-center border-b px-6">
            <Link
              href="/settings"
              className="flex items-center gap-2 font-semibold"
              prefetch={false}
            >
              <FaUserGear className="h-6 w-6" />
              <span className="">Settings</span>
            </Link>
          </div>
          <Suspense fallback={<div>Loading...</div>}>
            <UserNav paths={paths} />
          </Suspense>
        </div>
      </div>
      <div className="flex flex-col">
        <header className="flex h-14 lg:h-[60px] items-center gap-4 border-b bg-gray-100/40 px-6 dark:bg-gray-800/40">
          <Link href="#" className="lg:hidden" prefetch={false}>
            <FaUserGear className="h-6 w-6" />
            <span className="sr-only">Settings</span>
          </Link>
        </header>
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
