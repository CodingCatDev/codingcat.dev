"use client";

import GoPro from "@/components/user-go-pro";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function UserGoProButton() {
  const [showGoPro, setShowGoPro] = useState(false);

  return (
    <>
      {showGoPro && <GoPro setShowGoPro={setShowGoPro} />}
      <Button onClick={() => setShowGoPro(true)}>Go Pro</Button>
    </>
  );
}
