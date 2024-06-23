"use client";

import type { Settings } from "@/sanity.types";

import { useActivePath } from "@/lib/hooks";
import NavLink from "@/components/nav-link";

interface Props {
  navLinks: Exclude<Settings["navLinks"], undefined> | undefined;
  className?: string;
  sideOnly?: boolean;
}

export default function NavHeader({
  navLinks,
  className,
  sideOnly,
  ...restProps
}: Props) {
  const checkActivePath = useActivePath();

  return (
    <>
      {navLinks
        ?.filter((l) => (sideOnly ? true : l?.sideOnly !== true))
        ?.map((l) => (
          <NavLink
            {...restProps}
            key={l._key}
            className={`${className || ""} ${checkActivePath(l.path) ? "underline decoration-primary" : ""}`}
            href={l?.path || "/"}
          >
            {l.title}
          </NavLink>
        ))}
    </>
  );
}
