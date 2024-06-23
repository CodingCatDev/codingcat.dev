"use client";

import GoPro from "@/components/user-go-pro";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export default function ShowPro() {
  const [showGoPro, setShowGoPro] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const showPro = searchParams.get("showPro");
  useEffect(() => {
    if (showPro) {
      router.replace(pathname);
      setShowGoPro(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showPro]);

  return <>{showGoPro && <GoPro setShowGoPro={setShowGoPro} />}</>;
}
