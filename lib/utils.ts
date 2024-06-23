import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { ContentType } from "./types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const youtubeParser = (url: string) => {
  const regExp =
    /.*(?:youtu.be\/|(?:youtube.com\/live\/)|(?:youtube.com\/shorts\/)|v\/|u\/\w\/|embed\/|watch\?v=)([^#\&\?]*).*/;
  let match = url.match(regExp);
  return match && match[1].length == 11 ? match[1] : false;
};

export const pluralize = (_type: string) => {
  return `${_type === ContentType.post ? "blog" : _type + "s"}`;
};

export const unpluralize = (_type: string) => {
  return `${_type === "blog" ? ContentType.post : _type.slice(0, -1)}` as ContentType;
};

export const publicURL = () => {
  return process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL
    ? "https://" + process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL
    : "http://localhost:3000";
};
