/**
 * This component uses Portable Text to render a post body.
 *
 * You can learn more about Portable Text on:
 * https://www.sanity.io/docs/block-content
 * https://github.com/portabletext/react-portabletext
 * https://portabletext.org/
 *
 */

import {
  PortableText,
  type PortableTextComponents,
  type PortableTextBlock,
} from "next-sanity";
import Link from "next/link";

import BlockImage from "@/components/block-image";
import BlockCode from "@/components/block-code";
import TwitterEmbed from "@/components/twitter-embed";
import CodePenEmbed from "@/components/codepen-embed";
import CodeSandboxEmbed from "./codesandbox-embed";

export default function CustomPortableText({
  className,
  value,
}: {
  className?: string;
  value: PortableTextBlock[];
}) {
  const components: PortableTextComponents = {
    // TODO: make this more dynamic
    types: {
      "cloudinary.asset": ({ value }) => <BlockImage image={value} />,
      code: ({ value }) => <BlockCode {...value} />,
      codepen: ({ value }) => <CodePenEmbed {...value} />,
      codesandbox: ({ value }) => <CodeSandboxEmbed {...value} />,
      twitter: ({ value }) => <TwitterEmbed {...value} />,
    },
    block: {
      h5: ({ children }) => (
        <h5 className="mb-2 text-sm font-semibold">{children}</h5>
      ),
      h6: ({ children }) => (
        <h6 className="mb-1 text-xs font-semibold">{children}</h6>
      ),
    },
    marks: {
      link: ({ children, value }) => {
        return (
          <Link href={value?.href} rel="noreferrer noopener" target="_blank">
            {children}
          </Link>
        );
      },
      internalLink: ({ children, value }) => {
        return <Link href={value?.href}>{children}</Link>;
      },
    },
  };

  return (
    <div className={["prose", className].filter(Boolean).join(" ")}>
      <PortableText components={components} value={value} />
    </div>
  );
}
