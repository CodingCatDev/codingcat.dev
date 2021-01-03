import nightwind from 'nightwind/helper';

export default function Toggle() {
  return (
    <button
      className="self-center p-1 m-2 rounded-full hover:bg-primary-800 dark:hover:bg-primary-800 dark:hover:primary-800 focus:outline-none focus:ring-2 focus:ring-basics-50"
      aria-label="Toggle dark mode"
      onClick={() => nightwind.toggle()}
    >
      <svg
        className="rounded-full w-7 h-7 bg-yellow-50 dark:bg-transparent"
        id="darkMode"
        viewBox="0 0 145 162"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M144.331 124.529C144.331 124.529 125.125 161.903 80.6229 161.903C36.1211 161.903 0.045166 125.827 0.045166 81.3248C0.045166 36.823 36.1211 0.74707 80.6229 0.74707C36.1724 40.166 42.1211 140.212 144.331 124.529Z"
          fill="#FFC700"
        />
      </svg>
    </button>
  );
}
