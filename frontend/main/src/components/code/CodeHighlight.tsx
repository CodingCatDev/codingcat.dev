import Highlight, { defaultProps, Language } from 'prism-react-renderer';
import dracula from 'prism-react-renderer/themes/vsDark';

const CodeHighlight = ({
  children,
  className,
  lang,
}: {
  children: string;
  className: string;
  lang?: string;
}) => {
  const language =
    lang || className?.replace(/language-/, '') || ('bash' as any);

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
              {line.map((token, key) => (
                <span key={key} {...getTokenProps({ token, key })} />
              ))}
            </div>
          ))}
        </pre>
      )}
    </Highlight>
  );
};
export default CodeHighlight;
