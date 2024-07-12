import {
  PortableText,
  type PortableTextComponents,
} from "next-sanity";
import Link from "next/link";

export default function QuoteEmbed(props: any) {
  const { content, url } = props;
  if (!content) {
    return null;
  }
  const components: PortableTextComponents = {
    marks: {
      link: ({ children, value }) => {
        return (
          <Link href={value?.href || "#"} rel="noreferrer noopener" target="_blank">
            {children}
          </Link>
        );
      },
      internalLink: ({ children, value }) => {
        return <Link href={value?.href || "#"}>{children}</Link>;
      },
    },
  };
  return (
    <figure>
      <blockquote cite={url || '#'} className="mt-6 border-l-2 pl-6 italic">
        <PortableText components={components} value={content} />
      </blockquote>
    </figure>
  )
}