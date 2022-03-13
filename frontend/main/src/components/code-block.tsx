import useCopyToClipboard from '@/utils/basics/useCopyToClipboard';
import React, { useState } from 'react';
import javascript from 'react-syntax-highlighter/dist/esm/languages/hljs/javascript';
import bash from 'react-syntax-highlighter/dist/esm/languages/hljs/bash';
import html from 'react-syntax-highlighter/dist/esm/languages/hljs/xml';
import SyntaxHighlighter from 'react-syntax-highlighter/dist/esm/light-async';
// import oneDark from 'react-syntax-highlighter/dist/esm/styles/hljs/atom-one-dark';
// import githubGist from 'react-syntax-highlighter/dist/esm/styles/hljs/github-gist';
import a11yDark from 'react-syntax-highlighter/dist/esm/styles/hljs/a11y-dark';
import a11yLight from 'react-syntax-highlighter/dist/esm/styles/hljs/a11y-light';

SyntaxHighlighter.registerLanguage('html', html);
SyntaxHighlighter.registerLanguage('xml', html);
SyntaxHighlighter.registerLanguage('javascript', javascript);
SyntaxHighlighter.registerLanguage('typescript', javascript);
SyntaxHighlighter.registerLanguage('js', javascript);
SyntaxHighlighter.registerLanguage('jsx', javascript);
SyntaxHighlighter.registerLanguage('bash', bash);

// Adapted from https://github.com/dpeek/highlightjs-graphql/blob/master/graphql.js#L10
SyntaxHighlighter.registerLanguage('graphql', (hljs: any) => ({
  aliases: ['gql'],
  keywords: {
    keyword:
      'query mutation subscription|10 type interface union scalar fragment|10 enum on ...',
    literal: 'true false null',
  },
  contains: [
    hljs.HASH_COMMENT_MODE,
    hljs.QUOTE_STRING_MODE,
    hljs.NUMBER_MODE,
    {
      className: 'type',
      begin: '[^\\w][A-Z][a-z]',
      end: '\\W',
      excludeEnd: true,
    },
    {
      className: 'literal',
      begin: '[^\\w][A-Z][A-Z]',
      end: '\\W',
      excludeEnd: true,
    },
    { className: 'variable', begin: '\\$', end: '\\W', excludeEnd: true },
    {
      className: 'keyword',
      begin: '[.]{2}',
      end: '\\.',
    },
    {
      className: 'meta',
      begin: '@',
      end: '\\W',
      excludeEnd: true,
    },
  ],
  illegal: /([;<']|BEGIN)/,
}));

const defaultCopyButtonTooltipText = 'Copy code to clipboard';

export function CodeBlockComponent(
  { language, code, dark }: any /* TODO: types */
) {
  const [value, copy] = useCopyToClipboard();

  const [copyButtonTooltipText, setCopyButtonTooltipText] = useState(
    defaultCopyButtonTooltipText
  );

  return (
    <div
      css={{
        position: 'relative',
        '&:hover .copy-to-clipboard': {
          display: 'block !important',
        },
      }}
    >
      <button
        style={{
          position: 'absolute !important' as any,
          top: 0,
          right: 0,
          display: 'none !important' as any,
          zIndex: 10,
        }}
        className="copy-to-clipboard"
        onMouseLeave={() => {
          setCopyButtonTooltipText(defaultCopyButtonTooltipText);
        }}
        onClick={() => {
          copy(code);
          setCopyButtonTooltipText('Copied!');
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          xmlSpace="preserve"
          style={{ color: dark ? 'white' : 'black' }}
        >
          <path
            xmlns="http://www.w3.org/2000/svg"
            d="M19 3h-4.18C14.4 1.84 13.3 1 12 1c-1.3 0-2.4.84-2.82 2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 0c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm2 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"
          />
        </svg>
      </button>
      <SyntaxHighlighter
        customStyle={{
          fontFamily: 'Menlo, Monaco, "Courier New", monospace',
          lineHeight: '1em',
          padding: '.5em .2em',
        }}
        style={dark ? a11yDark : a11yLight}
        language={language}
      >
        {code}
      </SyntaxHighlighter>
    </div>
  );
}
