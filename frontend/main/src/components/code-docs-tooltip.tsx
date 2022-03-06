import React, { PropsWithChildren } from 'react';
import { TextLink } from './text-link';
import Tooltip from '@mui/material/Tooltip';

export type CodeDocsTooltipProps = {
  code: string;
};

type Tip = {
  /**
   * Patterns to match for. If an array is passed, all items must match
   */
  match: RegExp | string | Array<RegExp | string>;
  /**
   * If there was a match, render this content
   */
  content: React.ReactNode;
};

const TooltipLink = (props: PropsWithChildren<{ href: string }>) => (
  <TextLink
    target="_blank"
    href={props.href}
    className="font-bold text-primary-500"
  >
    {props.children}
  </TextLink>
);

/**
 * Configure tips to load based on patterns in the code nippset
 */
const tips: Tip[] = [
  {
    match: [/<BuilderComponent/, /react/],
    content: (
      <>
        Learn about{' '}
        <TooltipLink href="https://github.com/BuilderIO/builder/tree/master/packages/react">
          {'<BuilderComponent />'}
        </TooltipLink>
      </>
    ),
  },
  {
    match: [
      /builder\s*\.\s*(get|init|getAll)/,
      /@builder.io\/sdk|@builder.io\/react/,
    ],
    content: (
      <>
        Learn about the{' '}
        <TooltipLink href="https://github.com/BuilderIO/builder/tree/master/packages/core">
          builder
        </TooltipLink>{' '}
        object
      </>
    ),
  },
  {
    match: [/@builder.io\/react/],
    content: (
      <>
        Learn about the{' '}
        <TooltipLink href="https://github.com/BuilderIO/builder/tree/master/packages/react">
          React SDK
        </TooltipLink>{' '}
      </>
    ),
  },
  {
    match: [/@builder.io\/sdk/],
    content: (
      <>
        Learn about the{' '}
        <TooltipLink href="https://github.com/BuilderIO/builder/tree/master/packages/core">
          Builder Core SDK
        </TooltipLink>{' '}
      </>
    ),
  },
  {
    match: [/@builder.io\/vue/],
    content: (
      <>
        Learn about the{' '}
        <TooltipLink href="https://github.com/BuilderIO/builder/tree/master/packages/vue">
          Vue SDK
        </TooltipLink>{' '}
      </>
    ),
  },
  {
    match: [/@builder.io\/angular/],
    content: (
      <>
        Learn about the{' '}
        <TooltipLink href="https://github.com/BuilderIO/builder/tree/master/packages/angular">
          Angular SDK
        </TooltipLink>{' '}
      </>
    ),
  },
  {
    match: [/webcomponents/],
    content: (
      <>
        Learn about the{' '}
        <TooltipLink href="https://www.builder.io/c/docs/webcomponents-api">
          Web Components SDK
        </TooltipLink>{' '}
      </>
    ),
  },
  {
    match: [/gatsby/],
    content: (
      <>
        Learn about{' '}
        <TooltipLink href="https://github.com/BuilderIO/builder/tree/master/packages/gatsby">
          Builder with Gatsby
        </TooltipLink>{' '}
      </>
    ),
  },
  {
    match: [/'next'|getStaticProps|getInitialProps|getStaticPaths/],
    content: (
      <>
        Learn about{' '}
        <TooltipLink href="https://github.com/BuilderIO/builder/tree/master/examples/next-js">
          Builder with Next.js
        </TooltipLink>{' '}
      </>
    ),
  },
  {
    match: [/shopify/],
    content: (
      <>
        Learn about{' '}
        <TooltipLink href="https://www.builder.io/c/docs/shopify/developers">
          Builder with Shopify
        </TooltipLink>{' '}
      </>
    ),
  },
  {
    match: [/builder\.io\/api\/v1\/html/],
    content: (
      <>
        Learn about the{' '}
        <TooltipLink href="https://www.builder.io/c/docs/html-api">
          HTML API
        </TooltipLink>{' '}
      </>
    ),
  },
  {
    match: [/builder\.io\/api\/v2\/content/],
    content: (
      <>
        Learn about the{' '}
        <TooltipLink href="https://www.builder.io/c/docs/query-api">
          Content API
        </TooltipLink>{' '}
      </>
    ),
  },
  {
    match: [/builder\.io\/api\/v1\/graphql/],
    content: (
      <>
        Learn about the{' '}
        <TooltipLink href="https://www.builder.io/c/docs/graphql-api">
          GraphQL API
        </TooltipLink>{' '}
      </>
    ),
  },
];

/**
 * Render a tooltip calling out docs that may be useful given patterns
 * in the code snippets
 *
 * For example, if we detect "<BuilderComponent" and "react", show a tooltip
 * to learn more about this component on hover or touch
 */
export function CodeDocsTooltip(
  props: PropsWithChildren<CodeDocsTooltipProps>
) {
  const { code } = props;
  const matchedTips = !code
    ? []
    : tips.filter((tip) => {
        const { match } = tip;
        if (typeof match === 'string') {
          return code.includes(match);
        }
        if (match instanceof RegExp) {
          return match.test(code);
        }
        for (const item of match) {
          if (typeof item === 'string') {
            return code.includes(item);
          }
          return item.test(code);
        }
      });

  const hasMatchedTips = matchedTips.length;
  return (
    <Tooltip
      placement="left"
      disableHoverListener={!hasMatchedTips}
      disableFocusListener={!hasMatchedTips}
      title={
        !hasMatchedTips ? (
          ''
        ) : (
          <div css={{ padding: '0 8px', fontSize: 14 }}>
            {matchedTips.map((item, index) => (
              <div
                key={index}
                css={{
                  padding: '8px 0',
                  ...(index > 0 && {
                    borderTop: '1px solid rgba(255, 255, 255, 0.15)',
                  }),
                }}
              >
                {item.content}
              </div>
            ))}
          </div>
        )
      }
    >
      <div>{props.children}</div>
    </Tooltip>
  );
}
