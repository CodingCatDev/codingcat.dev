import Highlight, { defaultProps, Language } from 'prism-react-renderer';
import dracula from 'prism-react-renderer/themes/vsDark';
import WordHighlight from './WordHighlight';

const CodeHighlight = ({
  children,
  className,
  lang,
  highlight,
}: {
  children: string;
  className: string;
  lang?: string;
  highlight?: string[];
}) => {
  const language =
    lang || className?.replace(/language-/, '') || ('bash' as any);

  const getTokenSetup = ({ getTokenProps, token, key }: any) => {
    const tokenProps = getTokenProps({ token, key });
    if (highlight && highlight.includes(token.content)) {
      return <WordHighlight>{token.content}</WordHighlight>;
    }
    return <span key={key} {...tokenProps} />;
  };

  return (
    <Highlight
      {...defaultProps}
      code={children}
      language={language}
      theme={dracula}
    >
      {({ className, style, tokens, getLineProps, getTokenProps }) => (
        <pre className={className} style={{ ...style, padding: '20px' }}>
          {tokens.map((line, i) => (
            <div key={i} {...getLineProps({ line, key: i })}>
              {line.map((token, key) =>
                getTokenSetup({ getTokenProps, token, key })
              )}
            </div>
          ))}
        </pre>
      )}
    </Highlight>
  );
};
export default CodeHighlight;
