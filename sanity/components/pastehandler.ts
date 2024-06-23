import { htmlToBlocks } from "@sanity/block-tools";
import { micromark } from "micromark";

interface Input {
  event: ClipboardEvent;
  schemaTypes: SchemaTypes;
  path: Array<any>;
}

interface SchemaTypes {
  blockObjects: Array<{ name: string }>;
  portableText: any;
}

interface Block {
  _type: "code";
  code: string;
  language: string;
}

interface InsertPatch {
  insert: ReturnType<typeof htmlToBlocks>;
  path: Array<any>;
}

export async function handlePaste(
  input: Input
): Promise<InsertPatch | undefined> {
  const { event, schemaTypes, path } = input;
  const text = event.clipboardData?.getData("text/plain");
  const json = event.clipboardData?.getData("application/json");

  if (text && !json) {
    const html = micromark(text);
    return html
      ? convertHtmlToSanityPortableTextPatch(html, schemaTypes, path)
      : undefined;
  }

  return undefined;
}

function convertHtmlToSanityPortableTextPatch(
  html: string,
  schemaTypes: SchemaTypes,
  path: Array<any>
): InsertPatch | undefined {
  if (!isCodeTypeAvailable(schemaTypes) || !html) return undefined;

  const blocks = htmlToBlocks(html, schemaTypes.portableText, {
    rules: [
      // @ts-ignore
      { deserialize: deserializeCodeBlockElement },
    ],
  });

  return blocks ? { insert: blocks, path } : undefined;
}

function isCodeTypeAvailable(schemaTypes: SchemaTypes): boolean {
  const hasCodeType = schemaTypes.blockObjects.some(
    (type) => type.name === "code"
  );
  if (!hasCodeType) {
    console.warn(
      'Run `sanity install @sanity/code-input` and add `type: "code"` to your schema.'
    );
  }
  return hasCodeType;
}

function deserializeCodeBlockElement(
  el: Element,
  next: any,
  block: (block: any) => any
): Block | undefined {
  if (!isPreformattedText(el)) return undefined;

  const codeElement = el.children[0];
  const childNodes = getCodeChildNodes(el, codeElement as Element);
  const codeText = extractTextFromNodes(childNodes);
  const language = mapLanguageAliasToActualLanguage(
    getLanguageAlias(codeElement as Element)
  );

  return block({
    _type: "code",
    code: codeText,
    language,
  });
}

function isPreformattedText(el: Element): boolean {
  return el && el.children && el.tagName && el.tagName.toLowerCase() === "pre"
    ? true
    : false;
}

function getCodeChildNodes(
  el: Element,
  codeElement: Element
): NodeListOf<ChildNode> {
  return codeElement && codeElement.tagName.toLowerCase() === "code"
    ? codeElement.childNodes
    : el.childNodes;
}

function extractTextFromNodes(childNodes: NodeListOf<ChildNode>): string {
  return Array.from(childNodes)
    .map((node) => node.textContent || "")
    .join("");
}

function getLanguageAlias(codeElement: Element): string {
  return codeElement.className.replace("language-", "");
}

function mapLanguageAliasToActualLanguage(languageAlias: string): string {
  const languageMapping = {
    js: "javascript",
    ts: "typescript",
  };
  return (
    languageMapping[languageAlias as keyof typeof languageMapping] ||
    (languageAlias as string)
  );
}
