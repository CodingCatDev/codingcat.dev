"use client";
import { TwitterTweetEmbed } from "react-twitter-embed";

export default function TwitterEmbed(props: any) {
  const { id } = props;
  if (!id) {
    return <div>Add Twitter (X) id</div>;
  }
  return <TwitterTweetEmbed tweetId={id} />;
}
