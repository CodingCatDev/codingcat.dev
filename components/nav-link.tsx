"use client";

import Link, { LinkProps } from "next/link";

import { useActivePath } from "@/lib/hooks";

interface Props extends LinkProps {
  className?: string;
  children: React.ReactNode;
  target?: string;
  rel?: string;
}

export default function NavLink(props: Props) {
  const { href, className, children } = props;
  const checkActivePath = useActivePath();

  return (
    <Link
      {...props}
      className={`${className || ""} ${checkActivePath(href as string) ? "underline decoration-primary" : ""}`}
    >
      {children}
    </Link>
  );
}
