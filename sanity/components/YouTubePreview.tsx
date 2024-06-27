"use client";

import { useCallback, useState } from "react";
import { Box, Stack, TextInput } from "@sanity/ui";
import { ObjectInputProps, set, unset } from "sanity";
import { youtubeParser } from "@/lib/utils";

export function VideoPreview(props: { youtube: string }) {
  const [loadEmbed, setLoadEmbed] = useState(false);
  const id = youtubeParser(props.youtube);

  return (
    <Box
      style={{
        aspectRatio: "16 / 9",
        position: "relative",
        isolation: "isolate",
      }}
    >
      <Box
        className="absolute -z-10"
        style={{
          position: "absolute",
          zIndex: -1,
          height: "100%",
          width: "100%",
        }}
      >
        <picture>
          <source
            type="image/webp"
            srcSet={[
              `https://i.ytimg.com/vi_webp/${id}/mqdefault.webp 320w`,
              `https://i.ytimg.com/vi_webp/${id}/hqdefault.webp 480w`,
              `https://i.ytimg.com/vi_webp/${id}/sddefault.webp 640w`,
            ].join(", ")}
          />
          <img
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
            src={`https://i.ytimg.com/vi/${id}/sddefault.jpg`}
            srcSet={[
              `https://i.ytimg.com/vi/${id}/mqdefault.jpg 320w`,
              `https://i.ytimg.com/vi/${id}/hqdefault.jpg 480w`,
              `https://i.ytimg.com/vi/${id}/sddefault.jpg 640w`,
            ].join(", ")}
            alt=""
          />
        </picture>
        <button
          type="button"
          onClick={() => setLoadEmbed(true)}
          aria-label="Play"
          style={{
            border: "0",
            background: "none",
            position: "absolute",
            top: 0,
            left: 0,
            display: "grid",
            width: "100%",
            height: "100%",
            placeItems: "center",
          }}
        >
          <svg version="1.1" viewBox="0 0 68 48" height="48" width="68">
            <path
              d="M66.52,7.74c-0.78-2.93-2.49-5.41-5.42-6.19C55.79,.13,34,0,34,0S12.21,.13,6.9,1.55 C3.97,2.33,2.27,4.81,1.48,7.74C0.06,13.05,0,24,0,24s0.06,10.95,1.48,16.26c0.78,2.93,2.49,5.41,5.42,6.19 C12.21,47.87,34,48,34,48s21.79-0.13,27.1-1.55c2.93-0.78,4.64-3.26,5.42-6.19C67.94,34.95,68,24,68,24S67.94,13.05,66.52,7.74z"
              fill="#f00"
            />
            <path d="M 45,24 27,14 27,34" fill="#fff" />
          </svg>
        </button>
      </Box>
      {loadEmbed && (
        <iframe
          style={{ height: "100%", width: "100%", border: 0 }}
          src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&fs=0`}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          title="YouTube video player"
        />
      )}
    </Box>
  );
}

export type YoutubeObject = {
  youtube: string;
};

export type YoutubeVideoData = {
  youtube: string;
};

export function YoutubeInputComponent(props: ObjectInputProps<string>) {
  const { elementProps, onChange, value = "" } = props;

  const handleChange = useCallback(
    (event: { currentTarget: { value: any } }) => {
      const nextValue = event.currentTarget.value;
      onChange(nextValue ? set(nextValue) : unset());
    },
    [onChange]
  );

  return (
    <Stack space={3}>
      <TextInput {...elementProps} onChange={handleChange} value={value} />{" "}
      {!!props.value && (
        <Box style={{ position: "relative" }}>
          <VideoPreview youtube={props.value} />
        </Box>
      )}
    </Stack>
  );
}

export function input(props: any) {
  return <YoutubeInputComponent {...props} />;
}
