import copy from 'copy-to-clipboard';
import { useEffect, useState } from 'react';

export default function useCopyToClipboard(resetInterval = 1000) {
  const [isCopied, setCopied] = useState(false);

  function handleCopy(text: any) {
    if (typeof text === 'string' || typeof text == 'number') {
      copy(text.toString());
      setCopied(true);
    } else {
      setCopied(false);
      console.error(
        `Cannot copy typeof ${typeof text} to clipboard, must be a string or number.`
      );
    }
  }

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (isCopied && resetInterval) {
      timeout = setTimeout(() => setCopied(false), resetInterval);
    }
    return () => {
      clearTimeout(timeout);
    };
  }, [isCopied, resetInterval]);

  return [isCopied, handleCopy];
}
