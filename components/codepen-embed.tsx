"use client";

export default function CodePenEmbed(props: any) {
  const { url } = props;
  if (!url) {
    return <div>Add a CodePen URL</div>;
  }
  const splitURL = url.split("/");
  const [, , , user, , hash] = splitURL;
  const embedUrl = `https://codepen.io/${user}/embed/${hash}?height=370&theme-id=dark&default-tab=result`;
  return (
    <iframe
      height="370"
      style={{ width: "100%" }}
      title="CodePen Embed"
      src={embedUrl}
    />
  );
}
