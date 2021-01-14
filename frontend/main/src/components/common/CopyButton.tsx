import useCopyToClipboard from '@/utils/basics/useCopyToClipboard';

export default function CopyButton({
  code,
  className = 'w-8 h-8',
}: {
  code: any;
  className?: string;
}) {
  // isCopied is reset after 3 second timeout
  const [isCopied, handleCopy]: any = useCopyToClipboard(3000);

  return (
    <>
      {isCopied ? (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          className={className}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 13l4 4L19 7"
          />
        </svg>
      ) : (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          className={className}
          onClick={() => handleCopy(code)}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
          />
        </svg>
      )}
    </>
  );
}
