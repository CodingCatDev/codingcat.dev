"use client";
import { useActivePath } from "@/lib/hooks";
import Link from "next/link";
import { FaBell, FaDisplay, FaKey, FaPalette, FaUser } from "react-icons/fa6";

export default function SettingsNav({ paths }: { paths: string[] }) {
  const checkActivePath = useActivePath();
  const linkBuilder = (path: string) => {
    return (
      <Link
        key={path}
        href={path}
        className={activeClassBuilder(path)}
        prefetch={false}
      >
        {iconBuilder(path)}
        <div className="capitalize">{path.split("/").at(-1)}</div>
      </Link>
    );
  };

  const activeClassBuilder = (path: string) => {
    return checkActivePath(path)
      ? "flex items-center gap-3 rounded-lg bg-gray-100 px-3 py-2 text-gray-900 transition-all hover:text-gray-900 dark:bg-gray-800 dark:text-gray-50 dark:hover:text-gray-50"
      : "flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50";
  };

  const iconBuilder = (path: string) => {
    switch (path) {
      case "profile":
        return <FaUser className="h-4 w-4" />;
      case "account":
        return <FaKey className="h-4 w-4" />;
      case "appearance":
        return <FaPalette className="h-4 w-4" />;
      case "notifications":
        return <FaBell className="h-4 w-4" />;
      case "display":
        return <FaDisplay className="h-4 w-4" />;
      default:
        return null;
    }
  };

  return (
    <div className="flex-1 overflow-auto py-2">
      <nav className="grid items-start px-4 text-sm font-medium">
        {paths.map((path) => linkBuilder(path))}
      </nav>
    </div>
  );
}
