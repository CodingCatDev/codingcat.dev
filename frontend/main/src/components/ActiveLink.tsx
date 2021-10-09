import { withRouter } from 'next/router';
import Link from 'next/link';
import React, { Children } from 'react';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function ActiveLink({ router, children, ...props }: any) {
  const child = Children.only(children);

  let className = child.props.className || '';
  if (router.asPath === props.href && props.activeClassName) {
    className = `${className} ${props.activeClassName}`.trim();
  }

  delete props.activeClassName;

  return (
    <Link href={props.href} {...props}>
      {React.cloneElement(child, { className })}
    </Link>
  );
}

export default withRouter(ActiveLink);
