import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { okaidia } from "react-syntax-highlighter/dist/esm/styles/prism";

import BlockCodeButton from "@/components/block-code-btn";

import { prismLanguages } from "@/lib/prism";

interface CodeProps {
  code: string;
  language?: string;
}

export default function BlockCode(props: CodeProps) {
  const { code, language } = props;

  // See https://raw.githubusercontent.com/react-syntax-highlighter/react-syntax-highlighter/master/AVAILABLE_LANGUAGES_PRISM.MD

  let cleanLanguage = "typescript";
  if (language && prismLanguages.includes(language)) {
    cleanLanguage = language;
  }

  return (
    <div className="relative grid">
      <BlockCodeButton code={code} />
      <SyntaxHighlighter
        language={cleanLanguage}
        style={okaidia}
        wrapLines
        // showLineNumbers
      >
        {code}
      </SyntaxHighlighter>
    </div>
  );
}
