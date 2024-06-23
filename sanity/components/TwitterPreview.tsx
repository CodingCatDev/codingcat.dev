import React from "react";
import { TwitterTweetEmbed } from "react-twitter-embed";

const TwitterPreview = (props: any) => {
  const { id } = props;
  if (!id) {
    return <div>Add Twitter (X) id</div>;
  }
  return <TwitterTweetEmbed tweetId={id} />;
};

const preview = (props: any) => <TwitterPreview {...props} />;

export default preview;
