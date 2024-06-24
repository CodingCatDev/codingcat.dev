"use client";

import { CldImage as CldImageDefault, CldImageProps } from "next-cloudinary";

const CldImage = (props: CldImageProps) => {
  const dev = process.env.NODE_ENV !== "production";
  return <CldImageDefault {...props} />;
};

export default CldImage;
