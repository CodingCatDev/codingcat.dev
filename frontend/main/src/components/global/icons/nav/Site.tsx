export default function Site({
  className = 'block w-8 h-8',
}: {
  className?: string;
}): JSX.Element {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="#BC2261"
      viewBox="0 0 24 24"
      stroke="#BC2261"
      className={className}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z"
      />
    </svg>
  );
}
