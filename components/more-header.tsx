import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function MoreHeader({
  title,
  href,
  text = "View More",
  showHr = true,
}: {
  title: string;
  href: string;
  text?: string;
  showHr?: boolean;
}) {
  return (
    <>
      {showHr && <hr className="mb-8 sm:mb-24 border-accent-2 mt-8 sm:mt-28" />}

      <div className="flex flex-col md:flex-row md:justify-between mb-8 sm:mb-24">
        <h2 className="mb-8 text-6xl font-bold leading-tight tracking-tighter md:text-7xl">
          {title}
        </h2>
        <Button
          asChild
          className="mb-8 text-3xl font-bold md:text-4xl p-2 md:p-8"
        >
          <Link href={href}>{text}</Link>
        </Button>
      </div>
    </>
  );
}
