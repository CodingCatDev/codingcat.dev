interface Scope {
  [key: string]: unknown;
}

declare module 'next-mdx-remote/hydrate' {
  type HydrateOptions = { components: JSX.Element };

  export interface Source {
    compiledSource: string;
    renderedOutput: string;
    scope?: Scope;
  }

  let hydrate: (source: Source, options?: HydrateOptions) => JSX.Element;
  export default hydrate;
}
