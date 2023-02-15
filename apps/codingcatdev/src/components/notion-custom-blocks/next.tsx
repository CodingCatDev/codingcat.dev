import { FC, memo } from 'react';
import isEqual from 'react-fast-compare';
import Image from "next/image";

export const wrapNextImage = ({
  src,
  alt,
  width,
  height,
  className,
  style,
  layout,
  ...rest
}: any) => {
  return memo(function ReactNotionXNextImage({
    src,
    alt,
    width,
    height,
    className,
    style,
    layout,
    ...rest
  }: any) {
    if (!layout) {
      layout = width && height ? 'intrinsic' : 'fill';
    }

    return (
      <Image
        className={className}
        src={src}
        alt={alt}
        width={layout === 'intrinsic' && width}
        height={layout === 'intrinsic' && height}
        objectFit={style?.objectFit}
        objectPosition={style?.objectPosition}
        layout={layout}
        {...rest}
        style={{
          maxWidth: "100%",
          height: "auto"
        }} />
    );
  },
  isEqual);
};

export const wrapNextLink = (NextLink: any): React.FC<any> =>
  (function ReactNotionXNextLink(
    {
      href,
      as,
      passHref,
      prefetch,
      replace,
      scroll,
      shallow,
      locale,
      ...linkProps
    }
  ) {
    return (
      <NextLink
        href={href}
        as={as}
        passHref={passHref}
        prefetch={prefetch}
        replace={replace}
        scroll={scroll}
        shallow={shallow}
        locale={locale}
      >
        <a {...linkProps} />
      </NextLink>
    );
  });
