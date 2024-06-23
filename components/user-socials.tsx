"use client";

import type { AuthorQueryResult } from "@/sanity.types";

import {
  FaDev,
  FaGithub,
  FaCodepen,
  FaDiscord,
  FaLastfm,
  FaInstagram,
  FaFacebook,
  FaLinkedin,
  FaMastodon,
  FaMedium,
  FaStackOverflow,
  FaSquareXTwitter,
  FaTiktok,
  FaTwitch,
  FaYoutube,
} from "react-icons/fa6";
import { BsSubstack } from "react-icons/bs";

import Dribble from "@/components/icons/dribble.svg";
import Link from "next/link";
import { IconContext } from "react-icons/lib";

export default function UserSocials({
  socials,
}: {
  socials?: NonNullable<AuthorQueryResult>["socials"];
}) {
  if (!socials) {
    return <></>;
  }

  const renderIcon = (icon: string) => {
    switch (icon) {
      case "codepen":
        return (
          <>
            <FaCodepen /> <span className="sr-only">Codepen</span>
          </>
        );

      case "devto":
        return (
          <>
            <FaDev /> <span className="sr-only">Dev.to</span>
          </>
        );

      case "discord":
        return (
          <>
            <FaDiscord /> <span className="sr-only">Discord</span>
          </>
        );

      case "dribble":
        return (
          <>
            <Dribble /> <span className="sr-only">Dribble</span>
          </>
        );

      case "facebook":
        return (
          <>
            <FaFacebook /> <span className="sr-only">Facebook</span>
          </>
        );

      case "github":
        return (
          <>
            <FaGithub /> <span className="sr-only">GitHub</span>
          </>
        );

      case "instagram":
        return (
          <>
            <FaInstagram /> <span className="sr-only">Instagram</span>
          </>
        );

      case "lastfm":
        return (
          <>
            <FaLastfm /> <span className="sr-only">Last.fm</span>
          </>
        );

      case "linkedin":
        return (
          <>
            <FaLinkedin /> <span className="sr-only">LinkedIn</span>
          </>
        );

      case "mastodon":
        return (
          <>
            <FaMastodon /> <span className="sr-only">Mastodon</span>
          </>
        );

      case "medium":
        return (
          <>
            <FaMedium /> <span className="sr-only">Medium</span>
          </>
        );

      case "stackoverflow":
        return (
          <>
            <FaStackOverflow /> <span className="sr-only">Stack Overflow</span>
          </>
        );

      case "substack":
        return (
          <>
            <BsSubstack /> <span className="sr-only">Substack</span>
          </>
        );

      case "tiktok":
        return (
          <>
            <FaTiktok /> <span className="sr-only">TikTok</span>
          </>
        );

      case "twitch":
        return (
          <>
            <FaTwitch /> <span className="sr-only">Twitch</span>
          </>
        );

      case "twitter":
        return (
          <>
            <FaSquareXTwitter /> <span className="sr-only">X (Twitter)</span>
          </>
        );

      case "youtube":
        return (
          <>
            <FaYoutube /> <span className="sr-only">YouTube</span>
          </>
        );
    }
  };

  return (
    <IconContext.Provider value={{ size: "100%" }}>
      {Object.entries(socials).map((s) => (
        <Link
          href={s.at(1) || ""}
          key={s.at(0)}
          className="w-8 md:w-8 hover:text-primary"
          target="_blank"
          rel="noopener noreferrer"
        >
          {renderIcon(s.at(0) || "")}
        </Link>
      ))}
    </IconContext.Provider>
  );
}
