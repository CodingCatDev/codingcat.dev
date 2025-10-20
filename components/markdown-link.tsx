
import React from 'react';
import Link from 'next/link';

export function MarkdownLink({ text }: { text: string }) {
  if (!text) return null;
  const regex = /\[([^\]]+)\]\(([^)]+)\)/g;
  const parts = text.split(regex);

  return (
    <>
      {parts.map((part, i) => {
        if (i % 3 === 1) {
          const href = parts[i + 1];
          return (
            <Link key={i} href={href} rel="noreferrer noopener" target="_blank">
              {part}
            </Link>
          );
        }
        if (i % 3 === 2) {
          return null;
        }
        return part;
      })}
    </>
  );
}
