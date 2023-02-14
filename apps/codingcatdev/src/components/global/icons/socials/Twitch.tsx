export default function Twitch({
  className = 'block w-8 h-8',
  fill,
  stroke,
  strokeWidth,
}: {
  className?: string;
  fill?: string;
  stroke?: string;
  strokeWidth?: string;
}): JSX.Element {
  return (
    <svg
      version="1.1"
      id="Layer_1"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 2400 2800"
      xmlSpace="preserve"
      className={className}
      fill={fill}
    >
      <g id="Layer_1-2">
        <path
          className="st0"
          stroke={stroke}
          strokeWidth={strokeWidth}
          d="M500 0 0 500v1800h600v500l500-500h400l900-900V0H500zm1700 1300-400 400h-400l-350 350v-350H600V200h1600v1100z"
        />
        <path
          className="st1"
          d="M1700 550h200v600h-200zM1150 550h200v600h-200z"
        />
      </g>
    </svg>
  );
}
