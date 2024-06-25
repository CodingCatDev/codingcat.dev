"use client";
import { useActivePath } from "@/lib/hooks";
import Link from "next/link";
import { FaBell, FaDisplay, FaKey, FaPalette, FaUser } from "react-icons/fa6";

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import { usePathname } from "next/navigation";

export default function SettingsNav({ paths }: { paths: string[] }) {
  const checkActivePath = useActivePath();
  const pathname = usePathname();
  const linkBuilder = (path: string) => {
    return (
      <li key={path}>
        <Link
          href={path}
          prefetch={false}
          legacyBehavior passHref>
          <NavigationMenuLink
            className="group inline-flex h-10 w-full items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50"
            active={checkActivePath(path)}
          >
            {iconBuilder(path)}
            <div className="capitalize">{path.split("/").at(-1)}</div>
          </NavigationMenuLink>
        </Link>
      </li>
    );
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
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger>{<div className="capitalize">{pathname.split("/").at(-1)}</div>
          }</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul>
              {paths.map((path) => linkBuilder(path))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  )
}