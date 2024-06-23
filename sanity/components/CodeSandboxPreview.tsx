import React from "react";
import { RenderPreviewCallbackProps } from "sanity";
// TODO: Add stronger typing

const CodePenPreview = (props: any) => {
  const { url } = props;
  if (!url) {
    return <div>Add a CodePen URL</div>;
  }
  const splitURL = url.split("/").at(-1).split("-").at(-1);
  const embedUrl = `https://codesandbox.io/embed/${splitURL}`;

  return (
    <iframe
      src={embedUrl}
      style={{ width: "100%", minHeight: "400px" }}
      title="CodeSandbox Embed"
      allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
      sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
    />
  );
};

const preview = (props: any) => <CodePenPreview {...props} />;

export default preview;
