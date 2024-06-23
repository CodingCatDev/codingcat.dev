import { toPlainText } from "@portabletext/react";
import {
  BlockEditor as DefaultBlockEditor,
} from "sanity";
import { handlePaste } from "./pastehandler";

const wordsPerMinute = 200;

function BlockEditor(props: any, ref: any) {
  const value = props.value ?? [];
  const plainText = toPlainText(value);
  const characterCount = plainText.length;
  const wordCount = plainText.split(/\s+/g).filter(Boolean).length;
  const readingTime = Math.ceil(wordCount / wordsPerMinute);

  return (
    <div style={{ display: "grid" }}>
      <DefaultBlockEditor ref={ref} {...props} onPaste={handlePaste} />
      <div style={{ display: "flex" }}>
        <div>
          <span>🔠</span>
          {characterCount}
        </div>
        <div>
          <span>🚾</span>
          {wordCount}
        </div>
        <div>
          <span>⏱️</span>
          {readingTime} min
        </div>
      </div>
    </div>
  );
}
// TODO: Add stronger typing

const input = (props: any) => <BlockEditor {...props} onPaste={handlePaste} />;
export default input;
