import { usePathname } from "next/navigation";
import { useEffect } from "react";

export function useActivePath(): (path?: string) => boolean {
  const pathname = usePathname();

  const checkActivePath = (path?: string) => {
    return path === pathname;
  };

  return checkActivePath;
}

export function useKeyPress(callback: () => void, key: string): void {
  useEffect(() => {
    document.addEventListener("keydown", (e) => {
      if ((e.metaKey || e.ctrlKey) && e.code === key) {
        callback();
      }
    });
  });
}
