import Link from "next/link";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import React from "react";

export function BreadcrumbLinks({
  links,
}: {
  links: { title: string; href?: string }[];
}) {
  return (
    <Breadcrumb className="my-10">
      <BreadcrumbList className="text-lg md:text-xl">
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link href="/">Home</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        {links?.map((link, i) => (
          <React.Fragment key={i}>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              {link?.href ? (
                <BreadcrumbLink asChild>
                  <Link href={link.href}>{link.title}</Link>
                </BreadcrumbLink>
              ) : (
                <BreadcrumbPage>{link.title}</BreadcrumbPage>
              )}
            </BreadcrumbItem>
          </React.Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
