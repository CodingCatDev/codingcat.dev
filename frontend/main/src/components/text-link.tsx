import React, { AnchorHTMLAttributes } from 'react';
import { RenderLink } from '@/components/render-link';

export function TextLink(props: AnchorHTMLAttributes<HTMLAnchorElement>) {
  return <RenderLink rel="noopener" className="cursor-pointer" {...props} />;
}
