import React, { Children } from 'react';
import MDX from '@mdx-js/runtime';

class ErrorBoundary extends React.Component<
  any,
  { hasError: boolean; error: ReferenceError }
> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false, error: new ReferenceError() };
  }

  static getDerivedStateFromError(error: any) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <div className="grid grid-cols-1">
          <p>You have an error in your markdown.</p>
          <p className="text-ccd-reds-800">{this.state.error.message}</p>
        </div>
      );
    }

    return this.props.children;
  }
}

export default function App({ components, scope, children }: any) {
  return (
    <div className="App">
      <ErrorBoundary>
        <MDX components={components} scope={scope}>
          {children}
        </MDX>
      </ErrorBoundary>
    </div>
  );
}
