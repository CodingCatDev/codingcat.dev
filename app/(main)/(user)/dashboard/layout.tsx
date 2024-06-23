import Link from "next/link";
import { FaVrCardboard } from "react-icons/fa6";
import UserNav from "../user-nav";

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const paths = ["/dashboard/browse"];
  return (
    <div className="grid h-full w-full lg:grid-cols-[280px_1fr]">
      <div className="hidden border-r bg-gray-100/40 lg:block dark:bg-gray-800/40">
        <div className="flex h-full max-h-screen flex-col gap-2">
          <div className="flex h-[60px] items-center border-b px-6">
            <Link
              href="/dashboard"
              className="flex items-center gap-2 font-semibold"
              prefetch={false}
            >
              <FaVrCardboard className="h-6 w-6" />
              <span className="">Dashboard</span>
            </Link>
          </div>
          <UserNav paths={paths} />
        </div>
      </div>
      <div className="flex flex-col">
        <header className="flex h-14 lg:h-[60px] items-center gap-4 border-b bg-gray-100/40 px-6 dark:bg-gray-800/40">
          <Link href="#" className="lg:hidden" prefetch={false}>
            <FaVrCardboard className="h-6 w-6" />
            <span className="sr-only">Dashboard</span>
          </Link>
        </header>
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
